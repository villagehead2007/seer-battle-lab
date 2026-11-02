'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const id=Number(process.argv[2]),log=process.argv[3],runFile='research/DEPLOY-3940-4068-STATUS.json',run=JSON.parse(fs.readFileSync(runFile));
assert.equal(run.current,id,'必须严格串行');assert.ok(fs.readFileSync(log,'utf8').includes('passed (single-stage)'),'必须有通过证据');
const index=run.ids.indexOf(id);assert.ok(index>=0);assert.ok(run.ids.slice(0,index).every(n=>run.accepted.includes(n)||(run.mode==='serial-questions-record-and-continue'&&run.targets.find(x=>x.id===n)?.processed===true&&['partially-implemented-awaiting-confirmation','externally-blocked','skipped'].includes(run.targets.find(x=>x.id===n)?.status))),'前序未验收且无登记问题/外部阻塞');
if(!run.accepted.includes(id))run.accepted.push(id);run.current=run.ids[index+1]??null;run.phase=run.current?'implementing':'awaiting-final-regression';
Object.assign(run.targets.find(x=>x.id===id),{status:'single-stage-complete',gate:{exitCode:0,log},acceptedOn:'2026-10-20',processed:true});
fs.writeFileSync(runFile,JSON.stringify(run,null,2)+'\n');
for(const p of ['research/BATCH-3883-NEXT-60-STATUS.json','research/BATCH-3940-NEXT-10-STATUS.json','research/BATCH-4001-NEXT-10-STATUS.json']){
 const o=JSON.parse(fs.readFileSync(p));const target=o.targets.find(x=>x.id===id);if(!target)continue;
 Object.assign(target,{status:'single-stage-complete',formalGate:{exitCode:0,log},questionsResolvedBy:'research/DEPLOY-3940-4068-USER-CONFIRMATIONS.json',currentImplementation:'已回答的全部当前单精灵分支落实、真实专项和本地接入及完整npm test通过，真正多精灵分支保留延期'});
 if(p.includes('3883')){let count=0;while(o.targets[count]?.status==='single-stage-complete')count++;o.formalCompletionCursor={fixedTargetIndex:count,id:o.targets[count-1]?.id,nextTarget:o.targets[count]?.id,evidence:log,automationSystemModified:false};o.currentTarget=run.current;o.phase='strict-serial-answers-deployment';}
 else{if(!o.completed.includes(id))o.completed.push(id);o.current=run.current;}
 if(o.counts){o.counts.completed=o.targets.filter(t=>t.status==='single-stage-complete').length;o.counts.partiallyImplementedTargets=o.targets.filter(t=>t.status.startsWith('partially-implemented')).length;o.counts.questionsPendingTargets=o.targets.filter(t=>t.answerState==='awaiting-answer').length;}if(o.ids){o.completed=o.ids.filter(n=>o.targets.find(t=>t.id===n)?.status==='single-stage-complete');if(o.completed.length===o.ids.length){o.phase='all-targets-single-stage-accepted';o.current=null;}else{o.phase='strict-serial-answers-deployment';o.current=o.ids.includes(run.current)?run.current:null;}}
 fs.writeFileSync(p,JSON.stringify(o,null,2)+'\n');
}
fs.appendFileSync('research/BATCH-3883-NEXT-60-QUESTIONS.md','\n'+id+'：相关回答已落实，已实现、已验收；正式验证退出0 passed(single-stage)，内置完整npm test通过。日志'+log+'。\n');
const p='PROGRESS.md';fs.writeFileSync(p,'## 2026-10-20 '+id+'通过single-stage，范围内本轮累计验收'+run.accepted.length+'/20\n\n按正式队列串行，当前下一'+(run.current??'无；最终完整回归待运行')+'。全部当前单精灵分支、本地接入、完整回归及正式验证退出0 passed(single-stage)，日志'+log+'。原始回答保留，真实多精灵分支仍延期，不代表全部机制完成。未扫描新目标。状态research/DEPLOY-3940-4068-STATUS.json。\n\n'+fs.readFileSync(p,'utf8'));
console.log(JSON.stringify({accepted:id,count:run.accepted.length,next:run.current}));

const cp='research/DEPLOY-3940-4068-USER-CONFIRMATIONS.json',confirm=JSON.parse(fs.readFileSync(cp));confirm.acceptanceTracking={acceptedTargetIds:run.accepted,currentTarget:run.current,authority:runFile,note:'原始回答保留；公共答案不自动使其余关联目标通过验收'};fs.writeFileSync(cp,JSON.stringify(confirm,null,2)+'\n');fs.writeFileSync('research/DEPLOY-3940-4068-CHECKPOINT.json',JSON.stringify({date:'2026-10-20',current:run.current,phase:run.current?'next-target-not-started':'awaiting-final-regression',accepted:run.accepted,remaining:run.ids.filter(n=>!run.accepted.includes(n)),lastPassedLog:log,nextSpeciesMayStartOnlyAfterCurrentPassed:true},null,2)+'\n');

run.processed=run.ids.filter(n=>run.accepted.includes(n)||run.targets.find(x=>x.id===n)?.processed);run.scanIndex=run.processed.length;fs.writeFileSync(runFile,JSON.stringify(run,null,2)+'\n');const combinedPath='research/BATCH-3940-4068-AND-NEXT40-STATUS.json';if(fs.existsSync(combinedPath)){const c=JSON.parse(fs.readFileSync(combinedPath));c.firstBatch.acceptedCount=run.accepted.length;c.firstBatch.processedCount=run.processed.length;c.currentTarget=run.current;c.firstBatch.formalNext=JSON.parse(fs.readFileSync('research/BATCH-3883-NEXT-60-STATUS.json')).formalCompletionCursor?.nextTarget;fs.writeFileSync(combinedPath,JSON.stringify(c,null,2)+'\n');}
