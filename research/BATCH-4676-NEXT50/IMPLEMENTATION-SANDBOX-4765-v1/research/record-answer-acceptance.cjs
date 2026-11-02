'use strict';
const fs=require('fs');
const id=Number(process.argv[2]),tag=process.argv[3],result=JSON.parse(fs.readFileSync(`research/${tag}-result.json`));
const gateLog=`research/${tag}.log`,output=fs.readFileSync(gateLog,'utf8');
if(result.id!==id||result.exitCode!==0||!output.includes(`species ${id} passed (single-stage)`))throw Error('gate not passed');
const at=new Date().toISOString(),summary={id,acceptedAt:at,gateLog,result:`research/${tag}-result.json`,exitCode:0,singleStage:true,completeMechanisms:false,children:result.children};
const file='research/BATCH-3940-4068-AND-NEXT40-STATUS.json',all=JSON.parse(fs.readFileSync(file));
const run=all.answerImplementation;run.acceptedThisRun=[...new Set([...run.acceptedThisRun,id])];run.lastAcceptance=summary;
const scope=[...all.firstBatch.ids,...all.secondBatch.ids],next=scope.find(x=>!run.acceptedThisRun.includes(x)&&!(all.firstBatch.ids.includes(x)?JSON.parse(fs.readFileSync(all.firstBatch.state)).accepted:JSON.parse(fs.readFileSync(all.secondBatch.state)).accepted).includes(x));
run.current=next??null;run.backgroundRunning=false;run.phase=next?'implementing-current-species':'fixed-scope-final-regression-pending';
const statePath=all.firstBatch.ids.includes(id)?all.firstBatch.state:all.secondBatch.state,state=JSON.parse(fs.readFileSync(statePath));
const target=state.targets.find(x=>x.id===id);if(!target)throw Error('target missing');
Object.assign(target,{status:'single-stage-complete',answerState:'implemented-and-accepted',formalLocalDeployed:true,officialGate:summary,currentImplementation:'已按归档用户回答实现全部单精灵分支，逐项审核、专项/真实HTTP/完整npm和验证器通过；真实多精灵分支仍登记延期。'});
state.accepted=[...new Set([...state.accepted,id])].sort((a,b)=>scope.indexOf(a)-scope.indexOf(b));state.formalCursor={next:next??null,lastAccepted:id,scope:'original-fixed60-serial-answer-implementation'};
state.phase='serial-answer-implementation';state.current=next??null;
state.summary={...state.summary,accepted:state.accepted.length,awaitingConfirmation:state.targets.filter(t=>t.status==='partially-implemented-awaiting-confirmation').map(t=>t.id),partiallyImplemented:state.targets.filter(t=>t.status==='partially-implemented-awaiting-confirmation').length};
fs.writeFileSync(statePath,JSON.stringify(state,null,2)+'\n');
if(all.firstBatch.ids.includes(id)){all.firstBatch.acceptedCount=state.accepted.length;all.firstBatch.pendingIds=all.firstBatch.ids.filter(x=>!state.accepted.includes(x));all.firstBatch.formalNext=next;all.firstBatch.summary=state.summary;}
else {all.secondBatch.acceptedCount=state.accepted.length;all.secondBatch.summary={...all.secondBatch.summary,accepted:state.accepted.length,partiallyImplemented:state.targets.filter(t=>t.status==='partially-implemented-awaiting-confirmation').map(t=>t.id)};}
all.phase='serial-answer-implementation';all.currentTarget=next??null;all.currentBatch=next&&all.firstBatch.ids.includes(next)?'first':'second';
fs.writeFileSync(file,JSON.stringify(all,null,2)+'\n');
const confirmationPath='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',confirmation=JSON.parse(fs.readFileSync(confirmationPath));confirmation.implementation.current=next??null;confirmation.implementation.acceptedThisRun=run.acceptedThisRun;confirmation.implementation.acceptances??={};confirmation.implementation.acceptances[id]=summary;
for(const q of confirmation.confirmations)if(q.primarySpeciesId===id){q.implementationBySpecies??={};q.implementationBySpecies[id]={state:'implemented-and-accepted',...summary};}
fs.writeFileSync(confirmationPath,JSON.stringify(confirmation,null,2)+'\n');
const pendingPath=`data/species-pending/${id}.json`;if(fs.existsSync(pendingPath)){const pending=JSON.parse(fs.readFileSync(pendingPath));pending.previousStatusBeforePromotion??=pending.status;pending.status='promoted-to-local-single-stage-complete';pending.promotion={at,localFile:`data/species/${id}.json`,gate:summary};fs.writeFileSync(pendingPath,JSON.stringify(pending,null,2)+'\n');}
fs.appendFileSync('research/BATCH-3940-4068-AND-NEXT40-QUESTIONS.md',`\n### ${at} 用户回答落实验收记录：${id}\n\n原问题及用户回答不改。${id}全部单精灵分支已实现并正式部署；验证器退出0/passed(single-stage)，日志${gateLog}，子进程及完整回归统计${summary.result}。真实多精灵延期保留，不宣称全部机制完成。下一范围内未验收目标${next??'无'}。\n`);
fs.writeFileSync('PROGRESS.md',`## 2026-10-21 回答落实：${id}单精灵验收通过，下一${next??'无'}\n\n日志${gateLog}，退出0/passed(single-stage)。专项${result.children[0].passed}/${result.children[0].tests}、HTTP接入${result.children[1].passed}/${result.children[1].tests}、验证器内部完整npm ${result.children[2].passed}/${result.children[2].tests}，三项为实际独立子进程，未在同状态额外重复整库。本轮新验收${run.acceptedThisRun.join('、')}；全部机制完全完成未认证；下一只仅在本次通过后开始。固定范围与正式队列未改，自动开发关闭。\n\n`+fs.readFileSync('PROGRESS.md','utf8'));
console.log(JSON.stringify({accepted:id,next,gateLog}));
