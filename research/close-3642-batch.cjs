'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto'),ids=[3642,3652,3665];
const queue=fs.readFileSync('seer_id.txt','utf8').split(/\r?\n/).map(x=>x.trim()).filter(x=>/^\d+$/.test(x)).map(Number),start=queue.indexOf(3642);assert.deepEqual(queue.slice(start,start+3),ids);const next=queue[start+3];assert.equal(next,3667);
for(const id of ids){assert.ok(fs.readFileSync(`research/${id}-gate.log`,'utf8').includes(`species ${id} passed (single-stage)`));assert.equal(require(`./${id}-review-audit.json`).status,'single-stage-complete');}
const baseline=require('./3642-baseline.json'),allowed=['dist/effect-registry.js','dist/range-effects.js','dist/soul-registry.js','dist/souls.js','seerapi.cjs'],changed=Object.entries(baseline.files).filter(([p,h])=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')!==h).map(([p])=>p);assert.ok(changed.every(p=>allowed.includes(p)),JSON.stringify(changed));
const reviews=require('../SINGLE-STAGE-REVIEWS.json'),todo=require('../MULTI-PET-TODO.json');for(const [k,v]of Object.entries(baseline.reviews.entries))assert.deepEqual(reviews.entries[k],v,k);for(const r of baseline.todo.records)assert.ok(todo.records.some(t=>JSON.stringify(t)===JSON.stringify(r)),r.key);
const report={batch:ids,strictSerial:true,next,stage:'single-stage-complete',completeMechanismsCertified:false,tests:{3642:{targeted:'31/31',npm:'912/912'},3652:{targeted:'36/36',npm:'948/948'},3665:{targeted:'32/32',npm:'980/980'}},allGates:'passed (single-stage)',deferredAdded:todo.records.length-baseline.todo.records.length,deferredTotal:todo.records.length,changedSharedFiles:changed,protectedFilesUnchanged:true,earlierReviewsAndTodoUnchanged:true};fs.writeFileSync('research/3642-3652-3665-batch-audit.json',JSON.stringify(report,null,2)+'\n');
const p='PROGRESS.md',old=fs.readFileSync(p,'utf8');const text=`# PROGRESS.md

## 2026-10-13 当前三只串行批次完成：3642→3652→3665

三只均为single-stage-complete，每只专项、npm test和automation-validate.cjs通过后才开始下一只。已重新读取seer_id.txt核实下一正式编号为3667，本批未开始3667。当前正式单精灵完成：3575、3576、3577、3580、3584、3586、3592、3613、3623、3626、3627、3629、3631、3637、3642、3652、3665。

| 精灵 | 技能/执行实例/审核项 | 专项 | 当只完成时整库 | 独立验证 |
|---|---|---|---|---|
| 3642 极天之翼·托鲁克 | 27 / 42 / 71 | 31/31 | 912/912 | passed (single-stage) |
| 3652 异星装甲·赛伯斯特 | 27 / 48 / 77 | 36/36 | 948/948 | passed (single-stage) |
| 3665 厉魇魔王·咤克斯 | 27 / 48 / 76 | 32/32 | 980/980 | passed (single-stage) |

三只资料审核缺失0、过期0，独立验证均包括正式本地存储、真实HTTP搜索/快照及逐技能战斗接入。原/强化魂印版本分别保存及测试：3642的931/1473、3652的937/1475；3665仅真实魂印951，无伙伴或觉醒追加技能缺口。真实词条、参数、来源URL、hash及加载时间均保留。

3665 pet hash fbf678eb、魂印hash d235892e。SeerAPI魂印格式化说明明确攻击伤害增减20%，原始desc和BWIKI魂印951/revision319488补充证据均保留；按每次受击前体力判定满体先制或非满体回复。当前对手被击败获得的一层已真实记录，攻击/固定伤害类型与实际状态有断言。1297诅咒参数按来源格式化三级触发关系实现：消回合成功、诅咒未触发才吸取；既有3577疲惫参数分支及其测试不改。1035免异常导致未触发时补偿遗漏已保留失败断言修复。

本批多精灵延期新增6项，统一清单105项：3642两版魂印下场清层及11460第二目标；3652第五1128后继对手封攻；3665魂印累计层数跨后继对手承接及第五910击败后封属。当前双方可用的强化、技能、回复、免疫与击败加层均不延期。全部机制完全完成：本批未认证；本批跳过、单精灵待验证和阻塞均为0。3579仍为临时保留资料、不计正式完成。

3665来源请求191和843分别遇到HTTP545非JSON，已保存失败并断点恢复成功，最终资料齐全。首轮测试失败及修复原因记录在各编号review-audit和初次日志；没有删除失败断言或弱化验证。最终整库980/980，完成门槛三只全部通过。

保护文件和旧审核/延期记录核对通过：没有修改AGENTS.md、开发规范、导入队列、验证规则、自动化系统或此前完成精灵的快照/测试/审核，未使用Git。自动开发仍暂停。必要共享机制补充与真实缺陷修复均经完整回归。

证据：research/3642-3652-3665-batch-audit.json，各编号source-manifest/review-audit/scope-check，targeted/npm/gate日志。下方保留历史进度，当前状态以本节为准。
`;
fs.writeFileSync(p,text+old.slice('# PROGRESS.md'.length));console.log(report);
