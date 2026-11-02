#!/usr/bin/env bash
set -u
set -o pipefail

# Bounded, restartable phase scheduler. The Codex process is an untrusted worker;
# only files, tests and automation-validate.cjs can advance a species.
ROOT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
cd -- "$ROOT_DIR" || exit 1
default_rounds=${MAX_ROUNDS:-3}; max_rounds=${1:-$default_rounds}
network_retries=${NETWORK_RETRIES:-2}; retry_delay=${NETWORK_RETRY_DELAY:-5}
max_runtime=${MAX_RUNTIME_SECONDS:-3600}; no_progress_limit=${MAX_NO_PROGRESS:-3}
state_file=${AUTO_PROGRESS_FILE:-$ROOT_DIR/AUTO-PROGRESS.json}
codex_bin=${CODEX_BIN:-codex}; log_dir=${AUTOMATION_LOG_DIR:-$ROOT_DIR/automation-logs}
usage(){ printf 'Usage: %s [max-rounds]\n' "$(basename "$0")"; printf 'Environment: MAX_ROUNDS, NETWORK_RETRIES, NETWORK_RETRY_DELAY, MAX_RUNTIME_SECONDS, MAX_NO_PROGRESS, CODEX_BIN, AUTO_PROGRESS_FILE, AUTOMATION_LOG_DIR\n'; }
for value_name in max_rounds network_retries retry_delay max_runtime no_progress_limit; do value=${!value_name}; case "$value" in ''|*[!0-9]*) printf '%s must be a non-negative integer\n' "$value_name" >&2; usage >&2; exit 2;; esac; done
(( max_rounds == 0 )) && { printf 'No rounds requested.\n'; exit 0; }
mkdir -p -- "$log_dir"

atomic_write_json(){ local file=$1 tmp; tmp=$(mktemp "${file}.tmp.XXXXXX") || return 1; cat >"$tmp" || { rm -f -- "$tmp"; return 1; }; node -e 'JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"))' "$tmp" || { rm -f -- "$tmp"; return 1; }; mv -f -- "$tmp" "$file"; }
write_state_patch(){ local file=$1 patch=$2; node - "$file" "$patch" <<'NODE'
const fs=require('node:fs');const f=process.argv[2],p=JSON.parse(process.argv[3]);const s=JSON.parse(fs.readFileSync(f,'utf8'));for(const[k,v]of Object.entries(p))s[k]=v;const t=`${f}.tmp.${process.pid}.${Date.now()}`;fs.writeFileSync(t,JSON.stringify(s,null,2)+'\n');fs.renameSync(t,f);
NODE
}

if [[ ! -f "$state_file" ]]; then atomic_write_json "$state_file" <<'JSON'
{"schemaVersion":2,"cursor":{"index":60,"id":3575},"strategy":{"mode":"single-first","currentStage":"single"},"automationEnabled":false,"phase":"source","subtask":"核实当前精灵资料、魂印、技能和效果参数","completedSubtasks":[],"pendingEffects":[],"deferredEffects":[],"sources":[],"lastTest":null,"lastFailure":null,"batchSize":10,"activeBatch":[],"revisitQueue":[],"lastRound":null,"lastProgress":null}
JSON
fi
# Upgrade legacy state in place without changing its cursor.
node - "$state_file" <<'NODE'
const fs=require('node:fs');const f=process.argv[2],s=JSON.parse(fs.readFileSync(f,'utf8'));let c=false;for(const[k,v]of Object.entries({schemaVersion:2,phase:'source',subtask:'核实当前精灵资料、魂印、技能和效果参数',completedSubtasks:[],pendingEffects:[],deferredEffects:[],sources:[],lastTest:null,lastFailure:null,strategy:{mode:'single-first',currentStage:'single'},automationEnabled:false}))if(!(k in s)){s[k]=v;c=true;}if(c){const t=`${f}.tmp.${process.pid}`;fs.writeFileSync(t,JSON.stringify(s,null,2)+'\n');fs.renameSync(t,f);}
NODE

# A paused state cannot launch a worker. Resuming requires an explicit user request.
if ! node -e 'const s=JSON.parse(require("fs").readFileSync(process.argv[1]));process.exit(s.automationEnabled===true&&s.strategy?.mode==="single-first"&&s.strategy?.currentStage==="single"?0:1)' "$state_file"; then
  printf 'Automation paused or stage not authorized; no worker started.\n'; exit 0
fi

fingerprint_paths(){ { for path in "$@"; do [[ -e "$path" ]] && find "$path" -type f -print0; done; } | sort -z | xargs -0r sha256sum | sha256sum | awk '{print $1}'; }
implementation_fingerprint(){ fingerprint_paths dist; }; data_fingerprint(){ fingerprint_paths data/species data/species-pending; }; test_fingerprint(){ fingerprint_paths tests; }
is_transient_error(){ grep -Eiq 'network|timed out|timeout|TLS|ECONN|ENET|EAI_AGAIN|DNS|fetch failed|connection reset|websocket|service unavailable|HTTP[[:space:]]+(408|429|500|502|503|504)|selected model is at capacity|model.+capacity' "$1"; }
run_required_tests(){ local log=$1; printf '\n=== independent test run: npm test ===\n'|tee -a "$log"; npm test 2>&1|tee -a "$log"; return "${PIPESTATUS[0]}"; }

start_epoch=$(date +%s); no_progress=0; printf 'Starting phase scheduler: %s round(s), workspace %s\n' "$max_rounds" "$ROOT_DIR"
for ((round=1;round<=max_rounds;round++)); do
  (( $(date +%s)-start_epoch >= max_runtime )) && { printf 'Maximum runtime reached; state preserved for resume.\n' >&2; break; }
  stamp=$(date +%Y%m%d-%H%M%S); log_file="$log_dir/round-$round-$stamp.log"; before_state=$(mktemp "${TMPDIR:-/tmp}/auto-codex-state.XXXXXX"); cp -- "$state_file" "$before_state"
  before_impl=$(implementation_fingerprint); before_data=$(data_fingerprint); before_tests=$(test_fingerprint); state_json=$(cat "$state_file"); phase=$(node -p 'JSON.parse(process.argv[1]).phase' "$state_json"); id=$(node -p 'JSON.parse(process.argv[1]).cursor.id' "$state_json")
  case "$phase" in source|engine|tests|verify|advance) ;; *) printf 'Invalid phase %s; refusing to run.\n' "$phase" >&2; exit 2;; esac
  prompt_file=$(mktemp "${TMPDIR:-/tmp}/auto-codex-prompt.XXXXXX")
  cat >"$prompt_file" <<PROMPT
在 seer-battle-lab 中只处理当前阶段的一个明确子任务。先读取 AGENTS.md、PROGRESS.md、AUTO-PROGRESS.json 并核对磁盘现状。当前精灵 ${id}，阶段 ${phase}，子任务：$(node -p 'JSON.parse(process.argv[1]).subtask' "$state_json")。
阶段顺序严格为 source -> engine -> tests -> verify；只有独立验证成功后调度器才会推进到下一只精灵。本次只完成一个可核验子任务：source 核实真实资料和来源证据；engine 实现对应真实机制；tests 编写状态变化专项测试；verify 修复验证器指出的缺口。不要一次调用跨阶段或处理整只精灵。
当前为第一阶段：只实现单精灵可触发行为。按原文语义拆分混合词条，把多精灵专属分支登记在 SINGLE-STAGE-REVIEWS.json 并重新生成 MULTI-PET-TODO.json。旧 deferred 或效果 ID 都不能直接当作豁免。pendingEffects 只放单精灵未完成项，deferredEffects 记录第二阶段分支。所有单精灵词条须有逐分支状态断言证据；验证器独立运行专项及完整 npm test 后才能标记 single-stage-complete。不得把它写成全部机制完全完成。不得使用 Git。未获用户恢复授权不得更改 automationEnabled。
不得编造资料、弱化测试、修改 AGENTS.md、删除进度或修改无关核心逻辑。完成后原子更新 AUTO-PROGRESS.json 的 phase、subtask、completedSubtasks、pendingEffects、sources、lastFailure 等字段，并更新 PROGRESS.md。
PROMPT
  attempt=0; worker_status=1
  while :; do
    attempt=$((attempt+1)); attempt_log=$(mktemp "${TMPDIR:-/tmp}/auto-codex-attempt.XXXXXX"); printf '\n=== round %d phase %s species %s attempt %d ===\n' "$round" "$phase" "$id" "$attempt"|tee -a "$log_file"
    set +e; "$codex_bin" exec --model gpt-6-astra --disable apps --disable plugins --sandbox workspace-write --skip-git-repo-check --cd "$ROOT_DIR" <"$prompt_file" 2>&1|tee -a "$log_file"|tee "$attempt_log"; worker_status=${PIPESTATUS[0]}; set -e
    if (( worker_status==0 )); then rm -f -- "$attempt_log"; break; fi
    if (( attempt>network_retries )) || ! is_transient_error "$attempt_log"; then
      printf 'Worker failed (%d); state preserved, see %s\n' "$worker_status" "$log_file" >&2
      write_state_patch "$state_file" "$(node -e 'const fs=require("fs");const f=process.argv[1],s=JSON.parse(fs.readFileSync(f));s.lastFailure={kind:"worker",message:fs.readFileSync(process.argv[2],"utf8").slice(-4000),at:new Date().toISOString(),resumeWhen:"修复外部错误后重试"};process.stdout.write(JSON.stringify(s))' "$state_file" "$attempt_log")" 2>/dev/null || true
      rm -f -- "$attempt_log" "$prompt_file" "$before_state"; exit "$worker_status"
    fi
    state_json=$(cat "$state_file")
    {
      printf '\n重试前重新读取的最新 AUTO-PROGRESS.json：\n'
      cat "$state_file"
      printf '\n重试时只继续该阶段剩余子任务，不要重复已保存的工作。\n'
    } >>"$prompt_file"
    printf 'Transient worker failure; retry %d/%d in %ss\n' "$attempt" "$network_retries" "$retry_delay" >&2; sleep "$retry_delay"; rm -f -- "$attempt_log"
  done
  rm -f -- "$prompt_file"
  if ! node -e 'JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"))' "$state_file"; then cp -- "$before_state" "$state_file"; printf 'Invalid state after worker; restored previous state.\n' >&2; rm -f -- "$before_state"; exit 1; fi
  test_log=$(mktemp "${TMPDIR:-/tmp}/auto-codex-tests.XXXXXX"); set +e; run_required_tests "$test_log"; test_status=$?; set -e; cat "$test_log" >>"$log_file"; rm -f -- "$test_log"
  if (( test_status!=0 )); then write_state_patch "$state_file" "$(node -e 'const fs=require("fs"),f=process.argv[1],s=JSON.parse(fs.readFileSync(f));s.lastTest={command:"npm test",status:Number(process.argv[2]),at:new Date().toISOString()};s.lastFailure={kind:"tests",message:"npm test failed",at:new Date().toISOString(),resumeWhen:"修复失败测试后重试"};process.stdout.write(JSON.stringify(s))' "$state_file" "$test_status")" 2>/dev/null || true; printf 'Independent tests failed (%d); cursor not advanced.\n' "$test_status" >&2; rm -f -- "$before_state"; exit "$test_status"; fi
  current_phase=$(node -p 'JSON.parse(require("fs").readFileSync(process.argv[1])).phase' "$state_file")
  # A worker may not skip phases or move the cursor.  Restore only the
  # scheduler-owned fields and leave its research notes available for resume.
  transition_status=$(node - "$before_state" "$state_file" <<'NODE'
const fs=require('node:fs');
const a=JSON.parse(fs.readFileSync(process.argv[2])),b=JSON.parse(fs.readFileSync(process.argv[3]));
const rank={source:0,engine:1,tests:2,verify:3,advance:4};
const cursorChanged=a.cursor?.index!==b.cursor?.index||a.cursor?.id!==b.cursor?.id;
if(cursorChanged){b.cursor=a.cursor;b.activeBatch=a.activeBatch;}
if(!(b.phase in rank)||rank[b.phase]-rank[a.phase]>1){b.phase=a.phase;b.subtask=a.subtask;}
const t=`${process.argv[3]}.tmp.${process.pid}`;fs.writeFileSync(t,JSON.stringify(b,null,2)+'\n');fs.renameSync(t,process.argv[3]);
process.stdout.write(cursorChanged?'cursor-restored':'ok');
NODE
)
  if [[ "$transition_status" == cursor-restored ]]; then
    printf 'Worker attempted to change cursor; restored cursor %s without discarding notes.\n' "$id" >&2
    rm -f -- "$before_state"; exit 1
  fi
  current_phase=$(node -p 'JSON.parse(require("fs").readFileSync(process.argv[1])).phase' "$state_file")
  if [[ "$current_phase" == verify || "$current_phase" == advance ]]; then
    set +e; node automation-validate.cjs "$id" >>"$log_file" 2>&1; gate_status=$?; set -e
    if (( gate_status!=0 )); then write_state_patch "$state_file" "$(node -e 'const fs=require("fs"),f=process.argv[1],s=JSON.parse(fs.readFileSync(f));s.phase="verify";s.subtask="修复单精灵验证或语义登记缺口，不实现已审核的多精灵延期分支";s.lastFailure={kind:"verification",message:"automation-validate.cjs rejected single stage",at:new Date().toISOString(),resumeWhen:"按验证日志修复单精灵实现、测试或登记缺口"};process.stdout.write(JSON.stringify(s))' "$state_file")" 2>/dev/null || true; printf 'Single-stage gate rejected species %s; review verification log.\n' "$id" >&2; rm -f -- "$before_state"; exit 1; fi
    node - "$state_file" <<'NODE'
const fs=require('node:fs'),f=process.argv[2],s=JSON.parse(fs.readFileSync(f)),ids=fs.readFileSync('seer_id.txt','utf8').split(/\r?\n/).map(x=>x.trim()).filter(x=>/^\d+$/.test(x)).map(Number);
if(ids[s.cursor.index]!==s.cursor.id)throw Error('cursor does not match seer_id.txt');
const completedId=s.cursor.id;s.completions??={};s.completions[completedId]={singleStage:'single-stage-complete',allMechanisms:'not-certified',at:new Date().toISOString(),gate:'automation-validate.cjs'};
const n=s.cursor.index+1;
if(n<ids.length){s.cursor={index:n,id:ids[n]};s.activeBatch=ids.slice(n,n+s.batchSize);s.phase='source';s.subtask='核实当前精灵单精灵资料与多精灵语义分支';s.completedSubtasks=[];s.pendingEffects=[];s.deferredEffects=[];s.sources=[];s.lastFailure=null;s.singleStageStatus='in-progress';s.lastProgress=`单精灵阶段完成 ${completedId}；全部机制尚未认证`;}
else{s.phase='advance';s.automationEnabled=false;const remaining=ids.filter(id=>s.completions[id]?.singleStage!=='single-stage-complete');s.stageOneRemaining=remaining;s.strategy.currentStage=remaining.length?'single':'multiplayer-ready';s.lastProgress=remaining.length?'列表末尾已到达；历史条目仍须按新标准审核，不能开启第二阶段':'全部精灵单精灵阶段完成；第二阶段待统一规划与授权启动';}
const t=`${f}.tmp.${process.pid}`;fs.writeFileSync(t,JSON.stringify(s,null,2)+'\n');fs.renameSync(t,f);
NODE
    printf 'Single-stage verification accepted species %s; multiplayer completion is separate.\n' "$id"
    if ! node -e 'const s=JSON.parse(require("fs").readFileSync(process.argv[1]));process.exit(s.automationEnabled===true?0:1)' "$state_file"; then break; fi
  fi
  after_impl=$(implementation_fingerprint); after_data=$(data_fingerprint); after_tests=$(test_fingerprint); if [[ "$before_impl" != "$after_impl" || "$before_data" != "$after_data" || "$before_tests" != "$after_tests" ]]; then no_progress=0; else no_progress=$((no_progress+1)); fi
  rm -f -- "$before_state"; if (( no_progress>=no_progress_limit )); then printf 'Stopping after %d consecutive rounds without file progress; resume is safe.\n' "$no_progress_limit"; break; fi
done
printf 'Automation stopped. Logs are in %s\n' "$log_dir"
