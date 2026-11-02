'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const at=new Date().toISOString(),gate=fs.readFileSync('research/3613-gate.log','utf8');assert.match(gate,/exactly one fifth skill is required/);
const reason='真实来源包含原第五32045与觉醒第五37195；automation-validate.cjs:113要求整份快照恰好一个第五。现有全部技能HTTP接入测试换入第二第五时未替换原第五，也按同一约束拒绝。禁止改验证规则或删改真实技能，当前不能认证完成。';
const file='research/3613-review-audit.json',audit=JSON.parse(fs.readFileSync(file));audit.status='validation-blocked';audit.validation={review:{total:103,missing:0,stale:0},targeted:{command:'node --test tests/deployed-3613*.test.cjs',passed:42,total:42,exitCode:0,log:'research/3613-targeted.log'},npm:{command:'npm test',passed:705,total:705,exitCode:0,log:'research/3613-npm.log'},gate:{command:'node automation-validate.cjs 3613',result:'rejected (single-stage)',exitCode:1,log:'research/3613-gate.log'},integration:{command:'SEER_INTEGRATION_ID=3613 node --test tests/local-integration.test.cjs',passed:0,total:1,exitCode:1,log:'research/3613-integration.log',reason:'逐招换入第二第五时同时带入默认第五，触发恰好一个第五的配招检查'}};audit.blocker={at,reason,source:'research/seerapi-cache/3613/pet-3613.json',fifthSkills:[32045,37195],sourceHash:'5b9f75f0',validationRule:'automation-validate.cjs:113',integrationAssumption:'tests/local-integration.test.cjs:58',attempts:'只读确认真实pet与pet_advance/3版本关系；保留两个第五且各自合法配招专项通过。未修改验证器、集成测试或第五标记。'};audit.deferredKeys=['3613:soul:909','3613:soul:1825','3613:skill:30515:1'];fs.writeFileSync(file,JSON.stringify(audit,null,2)+'\n');
const state=JSON.parse(fs.readFileSync('AUTO-PROGRESS.json'));assert.equal(state.cursor.id,3613);assert.equal(state.automationEnabled,false);assert.ok(!state.completions?.[3613]);state.phase='verify';state.singleStageStatus='blocked';state.lastProgress='3613待验证/阻塞：103项审核缺失0过期0，专项42/42、npm705/705；真实双版本第五触发验证器单第五限制，单独HTTP全部技能接入亦被双第五配招假设阻止。3623、3626未开始，游标保持3613。';state.subtask='保留3613真实双版本第五，等待在不削弱标准的前提下解决双版本认证与接入冲突；不得推进3623';state.completedSubtasks=['3613真实资料及原/强化魂印审核','3613全部单精灵状态专项42/42','3613 npm test 705/705','3613多精灵分支3项完整延期登记'];state.pendingEffects=[{speciesId:3613,type:'single-stage-validation',description:reason}];state.deferredEffects=audit.deferredKeys.map(key=>({key,status:'multiplayer-deferred'}));state.sources=['research/3613-source-manifest.json','research/3613-review-audit.json'];state.lastTest={command:'node --test tests/deployed-3613*.test.cjs; npm test; node automation-validate.cjs 3613',status:1,at,note:'专项42/42、npm705/705；gate rejected，另行完整HTTP接入0/1。未认证完成。'};state.lastFailure={at,kind:'validation-constraint-conflict',speciesId:3613,reason,logs:['research/3613-gate.log','research/3613-integration.log']};fs.writeFileSync('AUTO-PROGRESS.json',JSON.stringify(state,null,2)+'\n');
const section=`## 2026-10-13 三只串行批次：3613验证阻塞，3623与3626未开始

固定批次顺序3613→3623→3626；本次只处理3613。**3613未通过单精灵阶段认证，游标保持零基索引67/id3613，未开始3623或3626。** 已完成精灵保留，自动开发继续关闭。

3613“芳馨·茉蕊儿”已完成103项资料/状态证据审核：31招、70个实例、原魂印909和强化魂印1825；缺失0、过期0。本地文件已经保存且搜索可见，默认配招可开局；完整逐招HTTP接入未通过，因此不宣称部署认证完成。pet hash5b9f75f0、魂印hash3318d0c8/22a49efe、pet_advance/3 hash89a6ceee均已串行只读刷新。觉醒魂印、种族值、四招强化技能和两个第五原始资料完整保留。来源/版本/参数详见research/3613-source-manifest.json与research/3613-review-audit.json。

本次新增原/觉醒魂印选招分流（清PP、半血/三分之一限伤、选属免异常免弱）、灵茉之芯获取/上限3/逐点粉伤+10%、感染及结束后的双攻-1与中毒、真实寄生、护罩消失PP回复及新增技能分支。原魂印与强化魂印可独立选择，强化种族值不覆盖原值。其他效果复用既有机制，保留所有状态断言。

| 检查 | 结果 |
|---|---|
| node --test tests/deployed-3613*.test.cjs | 42/42通过，退出码0 |
| npm test | 705/705通过，退出码0 |
| node automation-validate.cjs 3613 | rejected (single-stage)，退出码1 |
| 独立SEER_INTEGRATION_ID=3613接入测试 | 0/1；逐招换入第二第五时配招含两个第五，退出码1 |
| 审核覆盖 | 103项，缺失0、过期0 |

**阻塞原因：**真实pet资料同时包含原第五32045“王·春暖花开”和觉醒第五37195“王·千春共绽”。两招分别合法配招的专项已通过，但automation-validate.cjs第113–114行要求整份快照仅一个第五；tests/local-integration.test.cjs第58行逐招换入时没有替换默认第五，也因此拒绝。没有删除、降格任何真实第五技能，没有修改验证规则或集成断言，未认证3613完成。不能继续下一只。

多精灵延期共3条：魂印909阵亡后下一只精灵500护盾/500护罩及一次免异常；魂印1825阵亡后下一只获得芳馨之祝及灵茉之芯延长祝福、下场保留；30515效果1128击败后后继对手的一次攻击无效。原词条、参数、来源、触发和未来机制均在MULTI-PET-TODO登记，非本次单精灵阻塞原因。

初期专项失败属于夹具：等待招PP耗尽、随机流对照、可被消回合的免疫、超面板范围和浮点期望、后手/减伤条件不足；修正夹具后保留断言全部通过。各失败及最终日志保存于research/3613-*.log。research/3613-scope-check.json核对已完成精灵数据、专项及辅助测试、审核和延期记录保持原样；AGENTS.md、DEVELOPMENT-STAGES.md、seer_id.txt、完成验证器、自动化脚本未改。未使用Git。

3623：未开始本轮审核/实现/测试；3626：未开始本轮审核/实现/测试。批次下一步仍是解决3613真实双版本第五的认证冲突，不能跳到3623。

`;
let progress=fs.readFileSync('PROGRESS.md','utf8');fs.writeFileSync('PROGRESS.md','# PROGRESS.md\n\n'+section+progress.replace(/^# PROGRESS\.md\r?\n\r?\n/,''));
const baseline=require('./3613-baseline.json'),allowed=['SINGLE-STAGE-REVIEWS.json','MULTI-PET-TODO.json','MULTI-PET-TODO.md','dist/souls.js','dist/soul-registry.js','dist/range-effects.js','dist/effect-registry.js','dist/wiki-support.js','data/species/3613.json','AUTO-PROGRESS.json','PROGRESS.md'],changed=[],unchanged=[];for(const [p,v] of Object.entries(baseline)){const h=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');(h===v.hash?unchanged:changed).push(p);}assert.deepEqual(changed.filter(x=>!allowed.includes(x)),[]);const r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json')),old=JSON.parse(baseline['SINGLE-STAGE-REVIEWS.json'].text);assert.deepEqual(Object.fromEntries(Object.entries(r.entries).filter(([k])=>!k.startsWith('3613:'))),Object.fromEntries(Object.entries(old.entries).filter(([k])=>!k.startsWith('3613:'))));const todo=JSON.parse(fs.readFileSync('MULTI-PET-TODO.json')),oldtodo=JSON.parse(baseline['MULTI-PET-TODO.json'].text);assert.deepEqual(todo.records.filter(r=>r.speciesId!==3613),oldtodo.records.filter(r=>r.speciesId!==3613));fs.writeFileSync('research/3613-scope-check.json',JSON.stringify({at,baseline:'research/3613-baseline.json',changed,unchanged,otherSpeciesReviewsUnchanged:true,otherSpeciesDeferredRecordsUnchanged:true,validationRulesUnchanged:true,cursor:state.cursor,batch:{3613:'validation-blocked',3623:'not-started',3626:'not-started'}},null,2)+'\n');console.log({status:'validation-blocked',cursor:state.cursor,targeted:'42/42',npm:'705/705',gate:'rejected',nextTwo:'not-started'});
