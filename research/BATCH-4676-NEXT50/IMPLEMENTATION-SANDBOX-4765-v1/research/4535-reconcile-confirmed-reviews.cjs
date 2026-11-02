'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),policy=require('../completion-policy.cjs');
const base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/',reviews=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json'));
const names=s=>[...s.matchAll(/test\('([^']+)'/g)].map(x=>x[1]),mapping={};
for(const file of ['tests/deployed-4535-skills.test.cjs','tests/deployed-4535-soul.test.cjs']){
 const old=names(fs.readFileSync(base+'4535-before/'+file.replaceAll('/','__'),'utf8')),current=names(fs.readFileSync(file,'utf8'));
 assert.equal(current.length,old.length);old.forEach((name,i)=>mapping[name]=current[i]);
}
const confirmation=base+'4535-user-confirmations.json',direct=JSON.parse(fs.readFileSync(confirmation));assert.equal(direct.latestDirectAnswers.length,1);
const source=require('./4535-reviewed-snapshot.json'),saved=require('../local-species.cjs').save(source);assert.equal(saved.saved,true,JSON.stringify(saved.issues));
const snapshot=saved.snapshot,newNames=names(fs.readFileSync('tests/deployed-4535.test.cjs','utf8'));
for(const item of policy.inventory(snapshot)){
 const r=reviews.entries[item.key];assert.ok(r,item.key);r.previousSourceDigest=r.sourceDigest;r.sourceDigest=item.sourceDigest;
 r.resolvedQuestions=[...new Set([...(r.resolvedQuestions??[]),...(r.questions??[])])];r.questions=[];r.reviewedAt=new Date().toISOString();r.reviewStatus='state-tested-awaiting-batch-regression';r.userConfirmation=confirmation;
 r.rationale='SeerAPI原始快照逐项一致性证据保留；主回答、精简第2/6/7题及2045直接回答落实到当前实例。全部专项和HTTP实际预检，整批新npm前不计正式完成。';
 r.targetedResults=['research/4535-confirmed-targeted-v1-result.json','research/4535-native-targeted-v2-result.json','research/4535-native-fixture-v4-result.json'];
 for(const branch of ['success','failure','boundary','interaction']){
  const refs=[];
  for(const ref of r.tests[branch]){
   const renamed=mapping[ref.name]??ref.name;
   if(renamed==='4535精确新实例hash/revision/索引/参数拒绝且旧源留给旧校验'){(r.sourceValidationChecks??=[]).push({...ref,name:renamed});continue;}
   refs.push({...ref,previousName:ref.name,previousAssertion:ref.assertion,name:renamed,assertion:renamed+'；真实状态断言、消费及交互见具名测试。'});
  }
  r.tests[branch]=refs;
 }
 function add(index){for(const b of ['success','failure','boundary','interaction'])r.tests[b].push({file:'tests/deployed-4535.test.cjs',name:newNames[index],assertion:newNames[index]+'；具名HP、PP、等级、伤害事件与次数状态断言。'});}
 if(item.kind==='move')add(5);
 if(item.kind==='soul')add(4);
 if(item.kind==='skill'){
  if(item.raw.instance.id===1011){r.singleBehavior='整招仅抽一次概率并应用于所有攻击段；以其他防御减免、免疫和护盾后本效果免疫前的最终红伤求和，整招结束一次直接扣等量体力，零伤返扣0；与真实次数免攻按后获得者优先，只消费选中来源。';add(0);add(1);add(2);}
  if(item.raw.instance.id===2045)r.singleBehavior='非暴按当时诡符数授予下一次攻击先制，同源刷新1次与本次加值；其他来源独立保存并叠加先制，每次实际使用攻击各消费一次，属性、控制和0PP不消费。';
  if(item.raw.instance.id===521||item.raw.instance.id===1232)r.singleBehavior='自身负级经公共等级重写接口反转，遵守禁强/反转锁；1232仅成功反转项目向对手反馈相应负级，对手免弱不回滚自身成功。';
  if(item.raw.instance.id===1090){
   r.scope='multiplayer';r.singleBehavior='';r.deferredBehavior='击败对手则2回合内令对手攻击技能无法造成伤害且命中效果失效；用户确认仅真实下一只对手，从击败后下一回合开始持续两回合，技能全部词条封锁，独立魂印照常。';
   r.trigger='实际击败且完成死亡结算后的真实下一只对手登场，自击败后下一回合计时';r.futureMechanisms=['真实下一只对手定位、战场间保存与绝对回合窗口继承；复活当前目标不作为下一只。'];
   r.currentNegativeEvidence=r.tests;r.futurePayloadWitnesses={file:'tests/deployed-4535-skills.test.cjs',name:'4535 1090明确给定目标和时窗的限制载荷实际红伤/附效/PP与属性可用、到期'};
  }
 }
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');
fs.writeFileSync(base+'4535-confirmed-test-name-map.json',JSON.stringify(mapping,null,2)+'\n');
console.log(JSON.stringify({saved:true,items:policy.reviewCoverage(snapshot,reviews),nameChanges:Object.entries(mapping).filter(([a,b])=>a!==b)}));
