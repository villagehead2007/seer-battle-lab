'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const at=new Date().toISOString();
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const write=(f,x)=>fs.writeFileSync(f,JSON.stringify(x,null,2)+'\n');
const gate=fs.readFileSync('research/3613-versions-gate.log','utf8');
assert.match(gate,/species 3613 passed \(single-stage\)/);
for(const [file,count] of [['targeted',48],['npm',711]]){
  const text=fs.readFileSync(`research/3613-versions-${file}.log`,'utf8');
  assert.match(text,new RegExp(`pass ${count}\\b`));assert.match(text,/fail 0\b/);
}
const baseline=read('research/3613-versions-baseline.json');
const before=JSON.parse(baseline['data/species/3613.json'].text),after=read('data/species/3613.json');
const withoutGroups=structuredClone(after);delete withoutGroups.snapshot.skillVersions;
assert.deepEqual(withoutGroups,before,'不得改写任何原始技能、魂印、参数、来源或部署时间');
const audit=read('research/3613-review-audit.json');
audit.validationHistory??=[];
if(audit.blocker)audit.validationHistory.push({validation:audit.validation,blocker:audit.blocker,resolvedAt:at,resolution:'来源分组与魂印版本绑定，每组恰好一个第五；HTTP逐招按对应版本换入'});
delete audit.blocker;audit.status='single-stage-complete';
audit.skillVersions=after.snapshot.skillVersions;
audit.validation={review:{total:103,missing:0,stale:0},targeted:{command:'node --test tests/deployed-3613*.test.cjs',passed:48,total:48,exitCode:0,log:'research/3613-versions-targeted.log'},npm:{command:'npm test',passed:711,total:711,exitCode:0,log:'research/3613-versions-npm.log'},gate:{command:'node automation-validate.cjs 3613',result:'passed (single-stage)',exitCode:0,log:'research/3613-versions-gate.log'},integration:{passed:true,executedBy:['npm test','automation-validate.cjs 3613'],versions:[909,1825],sourceMovesCovered:31}};
audit.versionFixNotes=['未删除或降格两个第五，未改动31招/70实例/两个魂印原始值；新增6项版本专项，原有42项断言保留。','首次回归发现运行时强制未分组历史快照单第五导致旧精灵加载失败；恢复历史加载规则，完成认证仍严格要求未分组快照仅一个第五。第二次回归711/711通过。','魂印专项的无魂印对照夹具先选择对应技能组再移除版本元数据；真实来源快照两版分别经HTTP加载、选招、PP、伤害与独立种族值验证。'];
write('research/3613-review-audit.json',audit);
const state=read('AUTO-PROGRESS.json');assert.equal(state.cursor.id,3613);assert.equal(state.automationEnabled,false);
state.phase='advance';state.singleStageStatus='single-stage-complete';
state.lastProgress='3613双第五版本修复，103项审核缺失0过期0、专项48/48、npm711/711、passed (single-stage)。用户暂停批次，游标保持3613；3623、3626未开始。';
state.subtask='批次按用户要求暂停；3613已认证，等待用户恢复后才推进3623';
state.completedSubtasks=['3613全部103项资料与状态审核','3613原版/觉醒版技能分组与魂印绑定','3613专项48/48、npm711/711、HTTP两版全部31招接入','3613 passed (single-stage)','3613多精灵3项完整延期登记'];
state.pendingEffects=state.pendingEffects.filter(x=>!(x.speciesId===3613&&x.type==='single-stage-validation'));
state.lastTest={command:'node --test tests/deployed-3613*.test.cjs; npm test; node automation-validate.cjs 3613',status:0,at,note:'专项48/48、npm711/711、gate passed (single-stage)，原版与觉醒版接入均通过'};
if(state.lastFailure?.speciesId===3613)state.lastFailure={...state.lastFailure,resolvedAt:at,resolution:'技能来源分组修复，保留完整性校验与原断言'};
state.completions[3613]={singleStage:'single-stage-complete',allMechanisms:'not-certified',at,gate:'automation-validate.cjs'};
write('AUTO-PROGRESS.json',state);
const section=`## 2026-10-13 3613双第五版本修复完成；串行批次暂停

**3613已通过单精灵阶段验证。** 原版魂印909绑定原第五32045“王·春暖花开”；觉醒魂印1825绑定觉醒第五37195“王·千春共绽”。原版组27招、觉醒组30招（普通技能共享），来源总计31招全部保留，第五标记、名称、参数、效果实例和两个魂印均未改写。

新增skillVersions来源分组，配招及界面随魂印版本选择对应技能。每组仍须恰好一个第五，拒绝跨版本混装、遗漏、重复及来源不匹配；完成验证分别检查两版战斗接入，103项逐项审核与原有状态断言继续执行。未分组快照的完成认证保持原单第五要求，历史运行时加载行为保持原样。

| 检查 | 结果 |
|---|---|
| 3613专项 | 48/48通过（保留42项，新增6项版本测试） |
| npm test | 711/711通过 |
| automation-validate.cjs 3613 | passed (single-stage)，退出码0 |
| 审核覆盖 | 103项，缺失0、过期0 |
| HTTP接入 | 原版/觉醒版分别逐招接入，覆盖全部31招 |

三项多精灵延期保持：909下一只获得护盾/护罩及免异常；1825下一只芳馨之祝、灵茉之芯延长祝福和下场保留；技能30515效果1128对后继对手攻击无效。不标记全部机制完全完成。

首次回归发现把未分组快照的单第五约束扩大至运行时会阻止历史精灵加载；已恢复其原有运行时行为，完成门槛未放宽，随后回归全部通过。测试、审核与变更范围证据见research/3613-versions-*.log、research/3613-review-audit.json和research/3613-versions-scope-check.json。

**用户已暂停批次：游标保持索引67/id3613，自动开发关闭；3623、3626未开始。** 恢复批次时再按seer_id.txt推进3623。未修改已完成精灵数据/战斗实现、AGENTS.md、队列和自动化脚本，未使用Git。下面保留修复前阻塞记录作为历史。

`;
let progress=fs.readFileSync('PROGRESS.md','utf8');
if(!progress.includes('## 2026-10-13 3613双第五版本修复完成；串行批次暂停'))fs.writeFileSync('PROGRESS.md','# PROGRESS.md\n\n'+section+progress.replace(/^# PROGRESS\.md\r?\n\r?\n/,''));
const allowed=['dist/wiki-support.js','dist/wiki-ui.js','automation-validate.cjs','data/species/3613.json','tests/local-integration.test.cjs','tests/helpers/3613-battle.cjs','tests/deployed-3613-soul.test.cjs','research/3613-review-audit.json','DEVELOPMENT-STAGES.md','PROGRESS.md','AUTO-PROGRESS.json'];
const changed=[],unchanged=[];
for(const [file,v] of Object.entries(baseline)){
  const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  (hash===v.sha256?unchanged:changed).push(file);
}
assert.deepEqual(changed.filter(f=>!allowed.includes(f)),[]);
write('research/3613-versions-scope-check.json',{at,baseline:'research/3613-versions-baseline.json',changed,unchanged,allOriginalSourceDataUnchanged:true,allExistingReviewAndDeferredRecordsUnchanged:true,battleMechanicsUnchanged:true,cursor:state.cursor,batchPaused:true,batch:{3613:'single-stage-complete',3623:'not-started',3626:'not-started'}});
console.log({review:103,targeted:'48/48',npm:'711/711',gate:'passed (single-stage)',cursor:state.cursor,paused:true});
