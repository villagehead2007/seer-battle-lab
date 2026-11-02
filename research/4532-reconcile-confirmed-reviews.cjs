'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),policy=require('../completion-policy.cjs');
const base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/',reviews=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json'));
const names=s=>[...s.matchAll(/test\('([^']+)'/g)].map(x=>x[1]),mapping={};
for(const file of ['tests/deployed-4532-skills.test.cjs','tests/deployed-4532-soul.test.cjs']){
 const old=names(fs.readFileSync(base+'4532-before/'+file.replaceAll('/','__'),'utf8')),current=names(fs.readFileSync(file,'utf8'));
 assert.equal(current.length,old.length);old.forEach((name,i)=>mapping[name]=current[i]);
}
const confirmation=base+'4532-user-confirmations.json',direct=JSON.parse(fs.readFileSync(confirmation));assert.equal(direct.latestDirectAnswers.length,2);
const source=require('./4532-reviewed-snapshot.json'),saved=require('../local-species.cjs').save(source);assert.equal(saved.saved,true,JSON.stringify(saved.issues));
const snapshot=saved.snapshot,newNames=names(fs.readFileSync('tests/deployed-4532.test.cjs','utf8'));
for(const item of policy.inventory(snapshot)){
 const r=reviews.entries[item.key];assert.ok(r,item.key);r.previousSourceDigest=r.sourceDigest;r.sourceDigest=item.sourceDigest;
 r.resolvedQuestions=[...new Set([...(r.resolvedQuestions??[]),...(r.questions??[])])];r.questions=[];r.reviewedAt=new Date().toISOString();r.reviewStatus='state-tested-awaiting-batch-regression';r.userConfirmation=confirmation;
 r.rationale='SeerAPI原始快照113项一致性证据保留；主回答、精简第2/7题及本次直接回答落实到当前实例。全部专项和HTTP仍须实际预检，整批新npm前不计正式完成。';
 r.targetedResults=['research/4532-confirmed-targeted-v2-result.json','research/4532-native-fixture-v4-result.json'];
 for(const branch of ['success','failure','boundary','interaction']){
  const refs=[];
  for(const ref of r.tests[branch]){
   const renamed=mapping[ref.name]??ref.name;
   if(renamed==='4532 579/690/574精确来源版本参数实例严格拒绝'){(r.sourceValidationChecks??=[]).push({...ref,name:renamed});continue;}
   refs.push({...ref,previousName:ref.name,previousAssertion:ref.assertion,name:renamed,assertion:renamed+'；真实状态断言、消费及交互见具名测试。'});
  }
  r.tests[branch]=refs;
 }
 function add(index){for(const b of ['success','failure','boundary','interaction'])r.tests[b].push({file:'tests/deployed-4532.test.cjs',name:newNames[index],assertion:newNames[index]+'；具名HP、PP、等级、伤害事件与次数状态断言。'});}
 if(item.kind==='move')add(5);
 if(item.kind==='soul'){
  r.singleBehavior='首登场痕、两回合无视强化/敌最终先制封顶3，最终先制总和分支，受伤/未受伤用后载荷；痕零威力攻击实际使用与扣PP、消费痕封锁全部技能词条而独立魂印正常；刻转痕或同源刷新/异源独立单次免攻；死亡当下含574自耗立即反转，公共强化保护与免弱/强化消失反制。';
  add(0);add(1);add(2);
 }
 if(item.kind==='skill'){
  if(item.raw.instance.id===2050){r.singleBehavior='最终先制为1或2的实际使用消耗一次、扣PP并封锁整招伤害及全部技能词条，独立魂印照常；控制和0PP不消费；重复同源刷新1次。';add(2);add(3);}
  if(item.raw.instance.id===579){r.singleBehavior='本招命中后登记，当回合结束双方仍存活且未击败对手才回复最大HP三分一；禁疗在到期前结算、倍率和溢出，后续死亡不回复。';add(4);}
  if(item.raw.instance.id===690)r.singleBehavior='监听下三回合自身正强化消失，自当回合开始封锁对手属性技能直到原三回合窗口结束，已触发不续期；当前回合及R+4不触发。';
  if(item.raw.instance.id===1673)add(0);
  if(item.raw.instance.id===2051){r.singleBehavior='普通未命中及整招封锁触发刻/痕补偿；只命中词条失效时包括本补偿词条全部封锁，独立魂印保留。';add(1);}
 }
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');
fs.writeFileSync(base+'4532-confirmed-test-name-map.json',JSON.stringify(mapping,null,2)+'\n');
console.log(JSON.stringify({saved:true,items:policy.reviewCoverage(snapshot,reviews),nameChanges:Object.entries(mapping).filter(([a,b])=>a!==b)}));
