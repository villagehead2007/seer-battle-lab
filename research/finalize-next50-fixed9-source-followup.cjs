'use strict';
// DRAFT: main agent must review, then explicitly invoke with --apply-fixed9-after-review.
// This file does not run tests, deploy species, invoke validators, or process human answers.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),crypto=require('crypto');
assert.ok(process.argv.includes('--apply-fixed9-after-review'),'Review this draft first; explicit --apply-fixed9-after-review is required.');
const root=path.resolve(__dirname,'..');assert.equal(path.resolve(process.cwd()),root,'Run from project root');
const P=require(path.join(root,'completion-policy.cjs')),L=require(path.join(root,'local-species.cjs'));
const read=p=>JSON.parse(fs.readFileSync(p)),bytes=p=>fs.readFileSync(p),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const bp='research/BATCH-4509-NEXT50-STATUS.json',rp='SINGLE-STAGE-REVIEWS.json',mp='research/BATCH-4509-NEXT50-QUESTIONS.md';
const ep='research/parallel-drafts/next50-4633-soul/fixed-absorb-followup/evidence.json',sp='research/NEXT50-FIXED-ABSORB-SOURCE-FOLLOWUP.json';
const runPath='research/4633-production-integrated-targeted-v3-result.json',outPath='research/next50-fixed9-source-finalization-evidence.json';
assert.ok(!fs.existsSync(outPath),'Already finalized: inspect existing evidence; do not append twice.');
const run=read(runPath);assert.equal(run.exitCode,0);assert.equal(run.failed,0);assert.equal(run.tests,run.passed);assert.ok(run.tests>0);
const e=read(ep),source=read(sp),b=read(bp),reviews=read(rp),at=new Date().toISOString();
const inlineRecheck=read('research/next50-fixed9-inline-state-witness-recheck-v2-result.json');assert.equal(inlineRecheck.exitCode,0);assert.equal(inlineRecheck.passed,11);assert.equal(inlineRecheck.failed,0);assert.equal(sha(bytes(inlineRecheck.testFile)),inlineRecheck.testSha256);

const ids=[4612,4618,4622,4623,4627,4628,4632],fixedKeys=[
 '4612:skill:28634:2','4618:soul:1824','4618:skill:37203:1','4622:skill:28659:1',
 '4622:skill:28659:2','4623:skill:37227:2','4627:skill:37250:2','4628:skill:28677:1','4632:skill:37290:2'];
assert.deepEqual(e.scope.map(x=>x.key).sort(),fixedKeys.slice().sort());
assert.equal(source.source.revision,388991);assert.equal(e.validation.natural.exitCode,0);assert.equal(e.validation.natural.fail,0);
assert.equal(e.validation.modifiedOldEight.exitCode,0);assert.equal(e.validation.modifiedOldEight.fail,0);
assert.deepEqual(ids,b.sourceClarificationFollowup.ids);assert.equal(b.scan.current,4633);assert.equal(b.scan.line,257);
assert.equal(b.formalCursor.id,4509);assert.equal(b.scan.processed.length,30);assert.equal(b.scan.independentCompleted.length,23);
const protectedBefore={scan:JSON.stringify({...b.scan,independentCompleted:undefined}),formal:JSON.stringify(b.formalCursor),ids:JSON.stringify(b.ids)};
const snapshots=Object.fromEntries(ids.map(id=>[id,read('research/'+id+'-reviewed-snapshot.json')]));
const inventories=Object.fromEntries(ids.map(id=>[id,P.inventory(snapshots[id])]));
const inventoryKey=new Map(Object.values(inventories).flat().map(x=>[x.key,x]));
const reviewChecks=()=>Object.fromEntries(ids.map(id=>[id,inventories[id].flatMap(x=>P.checkReview(x,reviews.entries[x.key],root).map(error=>({key:x.key,error})))]));
const baselineReviewChecks=reviewChecks();
const allowedExisting4612=['success','failure','boundary','interaction'].map(category=>({key:'4612:skill:20420:0',error:'4612:skill:20420:0: '+category+' state assertion coverage required'}));
assert.deepEqual(baselineReviewChecks[4612],allowedExisting4612,'Only the four saved20420/effect4 arity evidence blockers may persist');
const followupTest='tests/next50-fixed-absorb-source-followup.test.cjs',basisTest='tests/next50-4628-101-basis-correction.test.cjs';
assert.ok(run.files.includes(followupTest));assert.ok(run.files.includes(basisTest));assert.equal(run.concurrency,1);
const formalHistory=['research/4633-production-integrated-targeted-v1-result.json','research/4633-production-integrated-targeted-v2-result.json'].map(p=>({path:p,...read(p)}));
const assertLiteral=(file,name)=>assert.ok(bytes(file).toString('utf8').includes("test('"+name+"'")||bytes(file).toString('utf8').includes('test("'+name+'"'),file+' missing literal test '+name);
// Read only frozen/explicit edit metadata. Never inspect or parse existing QUESTIONS content.
const basisEdits=read('research/4628-101-basis-correction/old-test-edits.json');
const renames=[...(e.renamedLiteralTests??[])];
for(const edit of basisEdits.edits){const old=edit.old.match(/^test\('([^']+)'/),next=edit.replacement.match(/^test\('([^']+)'/);if(old&&next)renames.push({file:basisEdits.file,old:old[1],replacement:next[1]});}
const renamedRefs=[];
for(const [key,review]of Object.entries(reviews.entries))for(const [category,rows]of Object.entries(review.tests??{}))for(const row of rows){
 for(const rename of renames)if(row.file===rename.file&&(row.name??row.test)===rename.old){assertLiteral(rename.file,rename.replacement);if(row.name!==undefined)row.name=rename.replacement;if(row.test!==undefined)row.test=rename.replacement;row.assertion=(row.assertion??'')+'；当前文字按资料回访/明确研究模型更名，未把研究输入当用户答案';renamedRefs.push({key,category,...rename});}
}
const sourceResolved=[];
for(const key of fixedKeys){const inv=inventoryKey.get(key),r=reviews.entries[key],proof=e.scope.find(x=>x.key===key),raw=source.instances.find(x=>x.key===key);
 assert.ok(inv&&r&&proof&&raw,key);assert.equal(inv.sourceDigest,proof.sourceDigest,key+' evidence digest');assert.equal(inv.sourceDigest,raw.sourceDigest,key+' source digest');assert.equal(r.sourceDigest,inv.sourceDigest,key+' review digest');
 assert.equal(proof.verdict,'fixed');assert.equal(proof.canResolveListedTypeGapFromSupplement,true);assert.equal(proof.apiExplicitOtherTypeConflict,false);
 assert.ok(r.questions.includes('Q-BATCH-004'),key+' exact type gap expected');
 const beforeQuestions=r.questions.slice();r.questions=r.questions.filter(q=>q!=='Q-BATCH-004');
 r.sourceClarificationFollowup={at,status:'source-clarified-and-formal-targeted-retested',kind:'source-supplement-not-user-answer',source:sp,sourceEvidence:ep,sourceDigest:inv.sourceDigest,revision:388991,type:'fixed',resolvedOnly:'Q-BATCH-004 damage-type subgap',otherQuestionsPreserved:r.questions.slice(),validation:runPath};
 r.reviewedAt=at;r.reviewStatus=r.questions.length?'partial-awaiting-user-confirmation':'state-tested-awaiting-batch-regression';
 if(r.questions.length)r.pendingSingleBehavior=r.questions.join(', ');else delete r.pendingSingleBehavior;
 for(const category of ['success','failure','boundary','interaction']){r.tests??={};r.tests[category]??=[];for(const name of proof.testRefs){assertLiteral(followupTest,name);if(!r.tests[category].some(x=>x.file===followupTest&&x.name===name))r.tests[category].push({file:followupTest,name,assertion:'本精确来源自然fixed吸取；真实固定免疫、低HP、保1、禁疗、半回复状态矩阵。理论回复既有确认不变；其它问题未解决。'});}}
 sourceResolved.push({key,sourceDigest:inv.sourceDigest,beforeQuestions,afterQuestions:r.questions.slice(),reason:proof.reason,testRefs:proof.testRefs});
}
// 101 is the exact same source used historically by4305; old implementation/test is not a human answer.
const basisKey='4628:skill:14859:0',basisInv=inventoryKey.get(basisKey),basis=reviews.entries[basisKey];assert.ok(basisInv&&basis,'Real inventory101 key missing');assert.equal(basis.sourceDigest,basisInv.sourceDigest);
const basisMove=snapshots[4628].moves.find(m=>m.id===14859),basisInstance=basisMove.effectInstances[0],basisEffect=snapshots[4628].effects.find(x=>x.id===101);
assert.equal(basisMove.hash,'b44c89e4');assert.equal(basisInstance.id,101);assert.deepEqual(basisInstance.args,[30]);assert.equal(basisEffect.revision,'seerapi:2e77710f');
const basisNames=[...bytes(basisTest).toString('utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);assert.equal(basisNames.length,4);
basis.questions=[...new Set([...(basis.questions??[]),'Q-N50-4628-001'])];basis.reviewStatus='partial-awaiting-user-confirmation';basis.reviewedAt=at;basis.pendingSingleBehavior=basis.questions.join(', ');
basis.sourceInterpretationCorrection={at,status:'natural-common-cases-tested; overkill/keep1-basis-pending',question:'Q-N50-4628-001',sourceDigest:basisInv.sourceDigest,notUserAnswer:true,old4305BehaviorIsNotAnswer:true,validation:runPath};
for(const category of ['success','failure','boundary','interaction']){basis.tests??={};basis.tests[category]??=[];for(const name of basisNames){assertLiteral(basisTest,name);if(!basis.tests[category].some(x=>x.file===basisTest&&x.name===name))basis.tests[category].push({file:basisTest,name,assertion:'101无差异时自然回复；过量/保1时实际HP损失及扣PP之后精确保留001；settled与hp-loss为明确研究输入，盾全挡0自然共同，未把旧4305行为当答案。'});}}
const coverage={},blockers={},pendingWrites=[],targetResults=[];
// Every clarified source and101 must itself have zero review failures; old arity blockers cannot cover a new-source failure.
for(const key of [...fixedKeys,basisKey])assert.deepEqual(P.checkReview(inventoryKey.get(key),reviews.entries[key],root),[],key+' clarified source must pass current state evidence');
const currentReviewChecks=reviewChecks();
for(const id of ids)assert.deepEqual(currentReviewChecks[id],id===4612?allowedExisting4612:[],id+' no new review blockers allowed');
const reviewCheckDiff=Object.fromEntries(ids.map(id=>[id,{baseline:baselineReviewChecks[id],current:currentReviewChecks[id],added:currentReviewChecks[id].filter(x=>!baselineReviewChecks[id].some(y=>y.key===x.key&&y.error===x.error)),resolved:baselineReviewChecks[id].filter(x=>!currentReviewChecks[id].some(y=>y.key===x.key&&y.error===x.error))}]));
for(const id of ids){const snapshot=snapshots[id],inventory=inventories[id],target=b.targets.find(t=>t.id===id);assert.ok(target&&target.independentWorkReopened);assert.equal(target.independentWorkComplete,false);
 const errors=currentReviewChecks[id];
 coverage[id]=P.reviewCoverage(snapshot,reviews);assert.equal(coverage[id].missing.length+coverage[id].stale.length,0);
 const questions=[...new Set(inventory.flatMap(x=>reviews.entries[x.key].questions??[]))];const pp='data/species-pending/'+id+'.json',pending=read(pp);assert.equal(pending.snapshot.id,id);
 const issues=L.issues(snapshot);pending.questions=questions;pending.validationIssues=issues;pending.status='partial-awaiting-confirmation';pending.snapshot=snapshot;pendingWrites.push([pp,pending]);
 if(id===4612)assert.ok(issues.some(x=>/效果\s*4|实例参数无效/.test(x)),'4612/20420 effect4 arity blocker must remain visible');
 blockers[id]={reviewEvidenceFailures:errors,reviewCheckDiff:reviewCheckDiff[id],validationIssues:issues,multiplayerCoverage:P.validateCoverage(snapshot,reviews,read('MULTI-PET-TODO.json'),root),sourceIntegrityFailures:read('research/'+id+'-source-integrity.json').failed};
 Object.assign(target,{questions,independentWorkComplete:true,status:'partial-awaiting-confirmation',deployed:false,accepted:false});
 target.independentWorkReopened={...target.independentWorkReopened,status:'closed-source-clarification-retested',closedAt:at,sourceResolvedKeys:fixedKeys.filter(k=>k.startsWith(id+':')),validation:runPath,otherQuestionsRetained:questions};
 target.sourceClarificationFollowup={at,evidence:outPath,validation:runPath,source:sp,sourceType:'source-supplement-not-user-answer',independentRestored:true,formalAccepted:false};
 targetResults.push({id,questions,blockers:blockers[id],independentRestored:true,deployed:false,accepted:false});
}
// Restore exactly seven previously reopened targets, sorted by original fixed queue order; never double count.
b.scan.independentCompleted=[...new Set([...b.scan.independentCompleted,...ids])].sort((a,c)=>b.ids.indexOf(a)-b.ids.indexOf(c));assert.equal(b.scan.independentCompleted.length,30);
assert.equal(JSON.stringify({...b.scan,independentCompleted:undefined}),protectedBefore.scan);assert.equal(JSON.stringify(b.formalCursor),protectedBefore.formal);assert.equal(JSON.stringify(b.ids),protectedBefore.ids);
b.sourceClarificationFollowup={...b.sourceClarificationFollowup,status:'source-classification-resolved-and-targeted-retested',completedAt:at,evidence:outPath,validation:runPath,sourceKind:'Wiki388991-source-supplement-not-user-answer',resolvedKeys:fixedKeys,restoredIndependentIds:ids,remainingQuestionsPreserved:true,fullNpmRuns:0,formalValidatorRuns:0};b.updatedAt=at;
const appendText='\n\n## 定向资料回访：9个固定点数吸取类型（Wiki388991，非用户新回答）\n\n'+
 '来源：'+source.source.url+'；标题对战机制；revision388991；内容SHA256 '+source.source.sha256+'。原文：“固定伤害是以固定的点数表示的一种伤害类型。如附加200点固定伤害、吸取对手200点体力等”。SeerAPI无冲突的9个精确来源据此补足fixed分类，仅撤销各自Q-BATCH-004类型缺口；理论回复已有确认不变，盾归属/触发时点/消费/其它疑问继续保留。原始API/来源参数/版本及sourceDigest逐项记录如下：\n\n'+
 '```json\n'+JSON.stringify(sourceResolved.map(x=>({...x,source:source.instances.find(z=>z.key===x.key)})),null,2)+'\n```\n\n'+
 '当前正式定向验证：'+runPath+'，退出0；这不是完整npm或正式验收，不代表单精灵与多精灵机制全部完成。\n\n'+
 '### Q-N50-4628-001 补充关联 · '+basisMove.name+'14859/101回复基数\n\n'+
 '精确范围：'+basisKey+'，sourceDigest '+basisInv.sourceDigest+'。'+
 '技能URL https://api.seerapi.com/v1/skill/'+basisMove.id+'，hash '+basisMove.hash+'；效果URL https://api.seerapi.com/v1/skill_effect_type/'+basisEffect.id+'，hash '+basisEffect.revision.replace(/^seerapi:/,'')+'；参数'+JSON.stringify(basisInstance.args)+'；原文“'+basisInstance.description+'”。版本：原版。完整相关来源：\n\n```json\n'+JSON.stringify({move:basisMove,instance:basisInstance,index:0,effect:basisEffect,source:snapshots[4628].source,rawFile:'research/4628-source-check.json'},null,2)+'\n```\n\n'+
 '已查冻结Q-A60-4305-082只回答魂印1528冷却及关联1591/027/038，没有101回复基数回答；旧4305使用相同14859/b44c89e4/i0[30]，旧测试按实际HP损失，但代码和测试都不构成人类回答。完整结算与实际HP损失独立保存的全局规则也不单独回答101回复基数。现有API只说伤害数值，资料尚不能判定两者。\n\n'+
 '具体差异：敌剩200HP、完整红伤500时，按完整结算回复150，按实际损失回复60；敌1HP受500且保1时分别回复150与0。禁疗、倍率、上限仍依各自已核实规则；无过量且两数相同500时自然回复150、盾全挡0自然不回复均已真实验证；两候选研究输入分别保留原断言，不作为新答案。\n\n'+
 '需要补充的一句明确问题：请明确本101[30]按完整结算红伤还是实际HP减少量的30%回复（含过量及保留1HP时）？\n\n我的回答：\n';
// Preflight finished. From here on main-authorized writes only; keep recoverable originals.
const beforeMD=bytes(mp),prefixSHA=sha(beforeMD),suffix=Buffer.from(appendText,'utf8'),archive='research/fixed9-finalization-archive-'+at.replace(/[:.]/g,'-');fs.mkdirSync(archive,{recursive:false});
const writes=[[rp,reviews],...pendingWrites,[bp,b]],backup=[];
for(const [p]of writes){const dest=archive+'/'+p.replace(/[\\/]/g,'__');fs.copyFileSync(p,dest);backup.push({path:p,archive:dest,sha256:sha(bytes(p))});}
fs.writeFileSync(archive+'/QUESTIONS-prefix.bin',beforeMD);
for(const [p,j]of writes)fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');
// Append Buffer only. Existing text is never parsed, searched, reserialized, trimmed, or replaced.
assert.equal(sha(bytes(mp)),prefixSHA,'QUESTIONS changed during preflight; stop before append');fs.appendFileSync(mp,suffix);
const afterMD=bytes(mp);assert.deepEqual(afterMD.subarray(0,beforeMD.length),beforeMD);assert.equal(afterMD.length,beforeMD.length+suffix.length);
const proof={at,status:'finalized-targeted-source-followup',sourceKind:'source-supplement-not-user-answer',run:{path:runPath,...run},inlineRecheck,formalHistory,source:{path:sp,sha256:sha(bytes(sp)),revision:388991},evidence:{path:ep,sha256:sha(bytes(ep))},sourceResolved,basis101:{key:basisKey,sourceDigest:basisInv.sourceDigest,question:'Q-N50-4628-001',newStateTestFile:basisTest,names:basisNames},renamedRefs,targetResults,coverage,blockers,independent:{before:23,restored:ids,after:30,processed:30,scanPreserved:b.scan.current,formalPreserved:b.formalCursor.id},md:{path:mp,prefixBytes:beforeMD.length,prefixSHA256:prefixSHA,prefixAfterSHA256:sha(afterMD.subarray(0,beforeMD.length)),appendedBytes:suffix.length,appendSHA256:sha(suffix),afterBytes:afterMD.length,afterSHA256:sha(afterMD),prefixArchive:archive+'/QUESTIONS-prefix.bin',contentParsed:false},backup,fullNpmRuns:0,validatorRuns:0,deployed:false,accepted:false};
fs.writeFileSync(outPath,JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify({evidence:outPath,resolvedExactSources:9,restoredIndependent:30,scan:b.scan.current,formal:b.formalCursor.id,blockersPreserved:blockers,mdPrefixPreserved:true}));
