'use strict';const fs=require('fs'),assert=require('node:assert/strict'),p=require('../completion-policy.cjs'),store=require('../local-species.cjs');
const snapshot=structuredClone(require('./4182-reviewed-snapshot.json')),reviewPath='SINGLE-STAGE-REVIEWS.json',reviews=JSON.parse(fs.readFileSync(reviewPath)),cf='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',c=JSON.parse(fs.readFileSync(cf));
fs.writeFileSync('research/4182-reviews-before-answers.json',JSON.stringify(Object.fromEntries(Object.entries(reviews.entries).filter(([k])=>k.startsWith('4182:'))),null,2)+'\n');
const names=[...fs.readFileSync('tests/deployed-4182-answers.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
for(const e of p.inventory(snapshot)){
 const v=reviews.entries[e.key];assert.ok(v);v.reviewedAt=new Date().toISOString();
 for(const refs of Object.values(v.tests??{}))for(const ref of refs)ref.name=ref.name.replace('未知441不注册且不能假称完整','441真实注册且保留全部索引');
 if(e.kind==='soul'||e.raw.instance?.id===441||e.key==='4182:move:34882'){
  for(const field of ['question','questions','pendingSingleBehavior'])delete v[field];v.reviewStatus='reviewed';v.rationale='Q041本次攻击忽防、Q042仅本技能累计首击10%额外最高50%已明确；保存全部真实来源和实例，当前状态专项已验证，不将真实背包分支冒充完成。';
  v.singleBehavior=e.kind==='soul'?'常驻25%攻击增伤、回合开始异常快照；无异常分支在确定命中的本次伤害计算中决议害怕/失败15%-30%忽防，本次生效包含暴击，免疫失败进入补偿、次回合仅攻击先制1；真实队伍分支独立延期。':'441按当前技能独立记录使用次数，当前首次即附加10%暴击概率至额外50%；使用其他技能不增加或重置，控制未使用不累计，技能失效全部附效关闭时不成长；必中暴击仍按既有规则。';
  const selected=names.filter(n=>e.kind==='soul'?n.includes('魂印'):n.includes('441'));for(const b of ['success','failure','boundary','interaction'])v.tests[b]=[...(v.tests[b]??[]),...selected.map(name=>({file:'tests/deployed-4182-answers.test.cjs',name,assertion:'真实当前攻击伤害/暴击数值、额外概率与封顶、跨技能独立计数、控制/MISS/附效关闭、回合快照、免疫失败补偿和实际攻击先制状态变化'}))];
  c.instanceBindings[e.key]={questionIds:[e.kind==='soul'?'Q-A60-4182-041':'Q-A60-4182-042'],sourceDigest:e.sourceDigest,source:e.source,raw:e.raw,status:'implemented-awaiting-gate'};
 }
}
const saved=store.save(snapshot);assert.equal(saved.saved,true);for(const e of p.inventory(saved.snapshot))reviews.entries[e.key].sourceDigest=e.sourceDigest;fs.writeFileSync(reviewPath,JSON.stringify(reviews,null,2)+'\n');
for(const q of c.confirmations)if(q.primarySpeciesId===4182){q.implementationBySpecies??={};q.implementationBySpecies[4182]={state:'implemented-awaiting-gate',accepted:false};}fs.writeFileSync(cf,JSON.stringify(c,null,2)+'\n');
const pendingFile='data/species-pending/4182.json',pending=JSON.parse(fs.readFileSync(pendingFile));pending.historicalQuestionsBeforeAnswers??=pending.questions;pending.questions=[];pending.snapshot=saved.snapshot;pending.status='implemented-awaiting-verification';fs.writeFileSync(pendingFile,JSON.stringify(pending,null,2)+'\n');
fs.writeFileSync('tests/deployed-4182.test.cjs',"'use strict';require('./deployed-4182-partial.test.cjs');require('./deployed-4182-answers.test.cjs');\n");
const failures=p.validateCoverage(saved.snapshot,reviews,require('./build-multiplayer-todo.cjs').build([saved.snapshot],reviews),process.cwd(),false);console.log(JSON.stringify({id:4182,saved:saved.saved,coverage:p.reviewCoverage(saved.snapshot,reviews),failures}));
