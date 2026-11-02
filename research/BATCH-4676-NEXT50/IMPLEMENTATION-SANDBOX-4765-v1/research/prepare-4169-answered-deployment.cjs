'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),p=require('../completion-policy.cjs'),store=require('../local-species.cjs');
const snapshot=JSON.parse(fs.readFileSync('research/4169-answered-partial-snapshot.json'));for(const m of snapshot.moves)if([34807,27453,34812].includes(m.id))m.limitations=[];
const refs=[...fs.readFileSync('tests/deployed-4169-timing.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(x=>({file:'tests/deployed-4169-timing.test.cjs',name:x[1],assertion:'真实攻击伤害先完成、PP与控制、完整用后旧印记消费、新印记保留、异常免疫失败散布、死亡和四回合到期状态断言'}));
const path='SINGLE-STAGE-REVIEWS.json',reviews=JSON.parse(fs.readFileSync(path)),cf='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',c=JSON.parse(fs.readFileSync(cf));
for(const e of p.inventory(snapshot)){
 const v=reviews.entries[e.key];assert.ok(v);v.sourceDigest=e.sourceDigest;v.reviewedAt=new Date().toISOString();
 if(e.key==='4169:skill:27453:2'||e.key==='4169:move:27453'){
  for(const k of ['pendingSingleBehavior','question','questions'])delete v[k];v.reviewStatus='reviewed';v.singleBehavior='按040给对手施加；094整招及旧印记用后结算结束后，由仍存活双方触发全PVP池两种异常；全部施加失败才逐枚散布一枚印记，新异常和印记只影响以后用招；四回合载体、免疫不补抽、容量上限均依公共已确认规则。';v.rationale='039、040及094已答，真实参数[4,2,1]、技能和模板hash保留；只延期抽中限制状态的真实换宠分支。';
  for(const b of ['success','failure','boundary','interaction'])v.tests[b]=[...(v.tests[b]??[]),...refs];
  if(v.deferredBehavior)v.deferredBehavior=v.deferredBehavior.replace('094未答不因此豁免','094已回答且当前双方可触发行为均已实现');
  c.instanceBindings[e.key]={questionIds:['Q-A60-4169-039','Q-A60-4169-040','Q-A60-4169-094'],sourceDigest:e.sourceDigest,source:e.source,raw:e.raw,status:'implemented-awaiting-gate'};
 }
}
assert.deepEqual(store.issues(snapshot),[]);const saved=store.save(snapshot);assert.equal(saved.saved,true);fs.writeFileSync('research/4169-answered-snapshot.json',JSON.stringify(saved.snapshot,null,2)+'\n');
// save() adds deployment/source storage metadata; every review binds this exact locally served instance.
for(const e of p.inventory(saved.snapshot))reviews.entries[e.key].sourceDigest=e.sourceDigest;
fs.writeFileSync(path,JSON.stringify(reviews,null,2)+'\n');
for(const q of c.confirmations)if(q.primarySpeciesId===4169){q.implementationBySpecies??={};q.implementationBySpecies[4169]={state:'implemented-awaiting-gate',accepted:false,pending:[]};}c.implementation.pendingNewQuestions=[];c.implementation.pendingQuestions=[];fs.writeFileSync(cf,JSON.stringify(c,null,2)+'\n');
const pendingFile='data/species-pending/4169.json',pending=JSON.parse(fs.readFileSync(pendingFile));pending.snapshot=saved.snapshot;pending.questions=[];pending.status='implemented-awaiting-verification';pending.currentAnswerImplementation.pending=[];pending.currentAnswerImplementation.answered.push('Q-A60-4169-094');fs.writeFileSync(pendingFile,JSON.stringify(pending,null,2)+'\n');
fs.writeFileSync('tests/deployed-4169.test.cjs',"'use strict';require('./deployed-4169-partial.test.cjs');require('./deployed-4169-answers-independent.test.cjs');require('./deployed-4169-timing.test.cjs');\n");
console.log(JSON.stringify({id:4169,saved:saved.saved,reviewCount:p.inventory(saved.snapshot).length,issues:store.issues(saved.snapshot)}));
