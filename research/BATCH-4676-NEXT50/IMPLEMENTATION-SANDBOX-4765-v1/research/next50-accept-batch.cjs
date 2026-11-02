'use strict';
// An actual fresh, frozen batch proof is required. This script does not run tests.
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,j)=>fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');
const proofPath=process.argv[2];assert.ok(proofPath&&/^research\/next50-batch[1-5]-formal-.*-result\.json$/.test(proofPath));
const p=read(proofPath),a=read(base+'USER-BATCH-VALIDATION-AUTHORIZATION-2026-10-27.json'),s=read('research/BATCH-4509-NEXT50-STATUS.json');
assert.equal(p.status,'passed-single-stage');assert.equal(p.accepted,true);assert.equal(p.authorization,base+'USER-BATCH-VALIDATION-AUTHORIZATION-2026-10-27.json');
assert.deepEqual(p.ids,a.ids.slice((p.batch-1)*10,p.batch*10));assert.deepEqual(p.frozenFilesChanged,[]);
assert.deepEqual(fs.readFileSync('seer_id.txt','utf8').split(/\r?\n/).slice(226,276).map(x=>Number(x.trim())),a.ids);
assert.equal(p.preflights.length,10);assert.deepEqual(p.preflights.map(x=>x.id),p.ids);
for(const check of p.preflights){assert.equal(check.passed,true);assert.equal(check.exitCode,0);assert.equal(check.error,null);assert.ok(fs.readFileSync(check.log,'utf8').includes(`preflight gate: species ${check.id} passed (pending-batch-full-regression; NOT stage complete)`));}
assert.equal(p.npm.exitCode,0);assert.equal(p.npm.error,null);assert.equal(p.npm.actualExecutions,1);assert.equal(p.npm.executedInsideAuthorizedBatchValidator,true);
assert.ok(p.npm.tests>0);assert.equal(p.npm.pass,p.npm.tests);for(const k of ['fail','skipped','cancelled','todo'])assert.equal(p.npm[k],0);
const npmLog=fs.readFileSync(p.npm.log,'utf8');for(const k of ['tests','pass','fail','skipped','cancelled','todo']){
 const found=[...npmLog.matchAll(new RegExp('^(?:ℹ|#) '+k+' ([\\d.]+)','gm'))];assert.ok(found.length);assert.equal(Number(found.at(-1)[1]),p.npm[k]);
}
assert.ok(!fs.existsSync('research/.next50-batch-validation.lock'),'batch process must finish first');
const freeze=read(p.freeze);for(const [file,expected]of Object.entries(freeze.files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),expected,'frozen file changed: '+file);
const before=s.singleStageCompleteIds??[];assert.ok(p.ids.some(id=>!before.includes(id)),'already accepted');
for(const id of a.ids.slice(0,(p.batch-1)*10))assert.ok(before.includes(id));
const at=new Date().toISOString(),r=read('SINGLE-STAGE-REVIEWS.json'),todo=read('MULTI-PET-TODO.json'),store=require('../local-species.cjs'),policy=require('../completion-policy.cjs');
for(const id of p.ids){
 const snapshot=store.species(id);assert.deepEqual(policy.validateCoverage(snapshot,r,todo,process.cwd(),false),[]);
 const existing=base+id+'-ACCEPTED.json',item=s.targets.find(x=>x.id===id);assert.ok(item);
 const certificate={acceptedAt:at,speciesId:id,speciesName:snapshot.name,queueLine:227+a.ids.indexOf(id),stage:'single',completeMechanisms:false,passedSingleStage:true,batch:p.batch,batchProof:proofPath,validatorExitCode:0,preflight:p.preflights.find(x=>x.id===id),npm:p.npm,codeFreeze:p.freeze,codeFreezeVerified:true,questionConfirmation:base+id+'-user-confirmations.json',reviewedItems:policy.reviewCoverage(snapshot,r).total};
 if(!before.includes(id)){assert.ok(!fs.existsSync(existing),'refuse to overwrite historical certificate');write(existing,certificate);}
 else assert.ok(fs.existsSync(existing),'missing historical certificate');
 item.previousAnswerImplementationStatus=item.status;item.status='single-stage-complete';item.accepted=true;item.acceptedAt=before.includes(id)?read(existing).acceptedAt:at;item.deployed=true;item.completeMechanisms=false;item.acceptance=existing;item.batchAcceptance=proofPath;
 item.answerImplementation={...item.answerImplementation,implementationStatus:'implemented-and-accepted-single-stage',confirmation:certificate.questionConfirmation,batch:p.batch,batchProof:proofPath,acceptance:existing};
 item.pendingAnswerDependentWork=[];item.pendingIndependentWork=[];item.review=certificate.reviewedItems+'-items-state-tested-and-batch-regression-passed';
 for(const inv of policy.inventory(snapshot)){const review=r.entries[inv.key];review.reviewStatus='single-stage-accepted';review.acceptance=existing;review.batchAcceptance=proofPath;review.acceptedAt=at;}
}
const accepted=a.ids.filter(id=>before.includes(id)||p.ids.includes(id)),next=a.ids.find(id=>!accepted.includes(id))??null;
s.singleStageCompleteIds=accepted;s.formalCompletedCount=accepted.length;s.formalCursor={id:next,line:next===null?null:227+a.ids.indexOf(next),accepted};s.implementationCursor={id:next,line:s.formalCursor.line};s.currentAnswerTarget={...s.implementationCursor,phase:next===null?'fixed50-single-stage-complete':'answer-implementation'};
s.pendingBatchPreflights=(s.pendingBatchPreflights??[]).filter(x=>!p.ids.includes(x.speciesId));s.currentFullRegression=p.npm;s.fullRegressionUnderCurrentState=proofPath;s.lastAcceptedFullRegression=proofPath;s.currentCodePendingBatchRegression=false;s.finalSummary={singleStageAccepted:accepted.length,total:a.ids.length,pending:a.ids.length-accepted.length,completeMechanismsCertified:s.targets.filter(x=>accepted.includes(x.id)&&x.completeMechanisms===true).length,activeSpecies:next,activeQueueLine:s.formalCursor.line,lastBatchProof:proofPath};s.status=next===null?"fixed50-single-stage-complete":"serial-answer-implementation-and-validation";if(next===null)s.completedAt=at;
s.batchValidation={...s.batchValidation,currentBatch:p.batch+1,completedBatches:[...new Set([...(s.batchValidation.completedBatches??[]),p.batch])],lastProof:proofPath,ids:a.ids.slice(p.batch*10,p.batch*10+10),formalCompleteIds:[],preflightPendingIds:[]};
s.currentFormalValidation={batch:p.batch,accepted:true,result:proofPath};s.activeProcesses=[];s.activeWork=next===null?'固定50只单精灵阶段完成，按用户范围停止，不处理4676。':'按正式队列继续下一批逐只审核、实现和专项HTTP预检。';s.testSlot={owner:'/root',species:next,status:'idle',concurrency:4};s.updatedAt=at;
s.progressHistory??=[];s.progressHistory.push({at,formalCompleted:accepted.length,batch:p.batch,proof:proofPath,next:s.formalCursor});
write('SINGLE-STAGE-REVIEWS.json',r);write('research/BATCH-4509-NEXT50-STATUS.json',s);
const t=read(base+'TAKEOVER.json');t.current={speciesId:next,queueLine:s.formalCursor.line,phase:s.currentAnswerTarget.phase,accepted,preflightPending:s.pendingBatchPreflights.map(x=>x.speciesId),activeProcesses:[],testConcurrency:4};t.pendingBatchPreflights=s.pendingBatchPreflights;t.updatedAt=at;t.lastAcceptedBatch=proofPath;t.nextAction=s.activeWork;write(base+'TAKEOVER.json',t);
fs.appendFileSync('PROGRESS.md',`\n\n${at} 原固定50第${p.batch}批正式通过单精灵阶段验收（${p.ids.join('、')}）。冻结版本逐只全部专项和HTTP预检通过，随后一次新完整npm ${p.npm.pass}/${p.npm.tests}，0失败/跳过/取消。证据：${proofPath}。本固定范围正式单精灵阶段完成${accepted.length}/50；全部机制完全完成0/50（多精灵延期仍完整保留）；本批跳过0、待验证0、阻塞0。下一批起点${next??'无；在4674后停止'}，正式队列行${s.formalCursor.line??'无'}。历史4509/4510/4511验收证书保留，新增批次证据补充其当前版本复验。\n`);
console.log(JSON.stringify({acceptedBatch:p.batch,formalCompleted:accepted.length,next:s.formalCursor,npm:p.npm,proof:proofPath}));
