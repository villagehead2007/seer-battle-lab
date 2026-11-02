'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const gate=fs.readFileSync('research/3592-gate.log','utf8');assert.match(gate,/species 3592 passed \(single-stage\)/);
const targeted=fs.readFileSync('research/3592-targeted.log','utf8'),npm=fs.readFileSync('research/3592-npm.log','utf8');assert.match(targeted,/pass 40/);assert.match(targeted,/fail 0/);assert.match(npm,/pass 663/);assert.match(npm,/fail 0/);
const ids=fs.readFileSync('seer_id.txt','utf8').match(/\d+/g).map(Number),index=ids.indexOf(3592),next=ids[index+1];assert.ok(index>=0&&next);assert.equal(next,3613);
const at=new Date().toISOString(),file='research/3592-review-audit.json',audit=JSON.parse(fs.readFileSync(file));audit.status='single-stage-complete';audit.completedAt=at;audit.validation={targeted:{command:'node --test tests/deployed-3592*.test.cjs',passed:40,total:40,exitCode:0,log:'research/3592-targeted.log'},npm:{command:'npm test',passed:663,total:663,exitCode:0,log:'research/3592-npm.log'},gate:{command:'node automation-validate.cjs 3592',result:'passed (single-stage)',exitCode:0,log:'research/3592-gate.log'},coverage:{total:83,missing:0,stale:0}};audit.implementationChanges=['魂印886回合开始满HP先制+2/非满HP全伤+50%，攻击未击败下回合必暴；下只对手吸取延期。','新增468回合开始清弱与本技能威力翻倍，936麻痹失败封属；复用原有战斗流程。','依据真实参数支持31至60段，1138麻痹/疲惫；954冗余原参数完整保留并按已核实零参数模板规范化。','931受免吸阻止时不清PP；1109吸取回复标记为技能来源，接受禁疗。'];audit.deferredKeys=['3592:soul:886','3592:skill:31928:1'];audit.nextQueueEntry={index:index+1,id:next,started:false};fs.writeFileSync(file,JSON.stringify(audit,null,2)+'\n');
const state=JSON.parse(fs.readFileSync('AUTO-PROGRESS.json'));assert.equal(state.automationEnabled,false);state.completions[3592]={singleStage:'single-stage-complete',allMechanisms:'not-certified',at,gate:'automation-validate.cjs'};state.cursor={index:index+1,id:next};state.activeBatch=ids.slice(index+1,index+1+state.batchSize);state.phase='source';state.subtask='按最新seer_id.txt下一项3613待资料审核；本轮未开始，自动开发继续暂停';state.completedSubtasks=[];state.pendingEffects=[];state.deferredEffects=[];state.sources=[];state.lastFailure=null;state.lastRound='2026-10-13';state.singleStageStatus='in-progress';state.lastProgress='3592单精灵阶段完成：83项审核无缺失/过期，专项40/40、整库663/663，验证器passed (single-stage)；魂印和883的下只出场分支共2项延期，按队列推进3613但尚未开发';state.lastTest={command:'node --test tests/deployed-3592*.test.cjs; npm test; node automation-validate.cjs 3592',status:0,at,note:'40/40、663/663，passed (single-stage)，多精灵延期2项，非全部机制完成'};fs.writeFileSync('AUTO-PROGRESS.json',JSON.stringify(state,null,2)+'\n');
const progress=fs.readFileSync('PROGRESS.md','utf8'),section=`## 2026-10-13 3592 幽冥帝尊·修罗单精灵阶段完成

最新状态：**3592 单精灵阶段完成，已本地部署**。83项审核缺失0、过期0；验证器 passed (single-stage)、退出码0。下一只出场的两个分支继续延期，不标记全部机制完全完成。

资料先审后实现：29招、53个有序效果实例、魂印886，共83项。pet hash aded6a51、魂印hash 4df358b3；原始来源缓存、参数和词条保留。串行SeerAPI客户端刷新pet/魂印、属性组合35和完整属性表、效果468/936，以及30127、32624、31929与954模板。首次沙箱fetch failed、组合35非JSON错误均留档，重试成功。来源清单和逐项证据见 research/3592-source-manifest.json、research/3592-review-audit.json。

分类：81项纯单精灵、1项混合魂印、1项纯多精灵。追加自身技能32624“冥之狂电”实现20～60段攻击、反弱回血及麻痹，不因特殊技能标志延期。魂印只延期击败后吸取对手下只出场精灵最大体力1/3；技能883只登记每次命中使下只出战精灵最大体力降低10%、上限40%。两项完整来源、参数、触发和未来机制存入统一MULTI-PET-TODO，未实现多精灵系统。

实现复用：魂印886按回合开始HP锁定满血全技能先制+2或非满血全伤害+50%，攻击未击败下回合必暴；补充468回合开始清弱本招翻倍、936麻痹失败封属，按真实来源支持31的60段上限与1138麻痹/疲惫组合。931吸强受到免吸时不清PP；1109技能吸取回复遵守禁疗。已完成3575～3586的数据、专项测试、审核和延期记录保持原样。

来源异常处理：30127实例954携带[1]，而同版本模板args_num=0、词条固定先制+1。重新查询确认技能hash a9cc2c86、模板hash45fecb70后，将原始实例完整保留在sourceEffectInstances与parameterNormalization，并转换为零参数固定+1指令；未改写原词条、未修改编译器或完成验证规则，低体/等体/高体实际行动顺序测试覆盖此规范化。

| 检查 | 结果 |
|---|---|
| node --test tests/deployed-3592*.test.cjs | 40/40通过，退出码0 |
| npm test | 663/663通过，退出码0 |
| node automation-validate.cjs 3592 | passed (single-stage)，退出码0，含真实本地HTTP接入与整库回归 |
| 审核覆盖 | 83项，缺失0、过期0 |
| 多精灵延期 | 魂印886下只出场吸取、效果883下只出战最大体力削减 |

专项真实状态覆盖HP、能力等级、异常控制、PP、概率、持续到期、先制、暴击、免疫、多段击败中止及完整第五/追加技能组合。补充交互检查发现1109回复缺少skill来源，禁疗时实际4000、预期1000；保留失败测试与research/3592-interaction-initial.log，仅补齐回复来源后通过。最终日志为research/3592-targeted.log、research/3592-npm.log、research/3592-gate.log。

research/3592-scope-check.json核对事前55个文件基线：完成验证器、自动化脚本、导入列表、项目规范、已完成精灵数据/测试保持原样；其他精灵审核和延期记录逐项一致。本次未使用Git。验证通过后才将游标推进至 **3613（零基索引67）**，按seer_id.txt实际顺序读取，尚未开发；自动开发保持关闭，3579仍为skipped/无魂印不部署。

`;
assert.ok(progress.startsWith('# PROGRESS.md'));fs.writeFileSync('PROGRESS.md','# PROGRESS.md\n\n'+section+progress.replace(/^# PROGRESS\.md\r?\n\r?\n/,''));
const baseline=require('./3592-baseline.json'),allowed=['SINGLE-STAGE-REVIEWS.json','MULTI-PET-TODO.json','MULTI-PET-TODO.md','dist/souls.js','dist/soul-registry.js','dist/range-effects.js','data/species/3592.json','AUTO-PROGRESS.json','PROGRESS.md'],changed=[],unchanged=[];
for(const [p,v] of Object.entries(baseline)){const hash=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');(hash===v.hash?unchanged:changed).push(p);}assert.deepEqual(changed.filter(p=>!allowed.includes(p)),[]);
const r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json')),oldr=JSON.parse(baseline['SINGLE-STAGE-REVIEWS.json'].text);assert.deepEqual(Object.fromEntries(Object.entries(r.entries).filter(([k])=>!k.startsWith('3592:'))),Object.fromEntries(Object.entries(oldr.entries).filter(([k])=>!k.startsWith('3592:'))));const todo=JSON.parse(fs.readFileSync('MULTI-PET-TODO.json')),oldtodo=JSON.parse(baseline['MULTI-PET-TODO.json'].text);assert.deepEqual(todo.records.filter(x=>x.speciesId!==3592),oldtodo.records.filter(x=>x.speciesId!==3592));fs.writeFileSync('research/3592-scope-check.json',JSON.stringify({at,baseline:'research/3592-baseline.json',comparedFiles:Object.keys(baseline).length,changed,unchanged,otherSpeciesReviewsUnchanged:true,otherSpeciesDeferredRecordsUnchanged:true,automationEnabled:false,nextQueueEntry:state.cursor},null,2)+'\n');console.log({completed:3592,next:state.cursor,changed,otherSpeciesUnchanged:true});
