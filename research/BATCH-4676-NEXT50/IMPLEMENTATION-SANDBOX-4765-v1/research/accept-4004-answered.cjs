'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),store=require('../local-species.cjs'),policy=require('../completion-policy.cjs');
const source=require('./4004-reviewed-snapshot.json');
const result=store.save(source);assert.ok(result.saved,JSON.stringify(result));
const snapshot=store.species(4004),entries=policy.inventory(snapshot),r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json','utf8'));
const confirmationsFile='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',confirmations=JSON.parse(fs.readFileSync(confirmationsFile));
const oldBase='4004全部21招真实基础PP和攻击，零PP与控制，原版/觉醒两源绑定及未知项禁止正式保存',newBase='4004全部21招真实基础PP和攻击，零PP与控制，原版/觉醒两源绑定及全部技能规则可正式保存';
const oldMask='4004裁异常视同仍明确partial，已知另一方清除真伤独立执行而不猜未知吸取',newMask='4004确认裁仅屏蔽异常条件，双方真实异常仍可清除并触发真伤及无异常吸取';
for(const entry of entries){
 const v=r.entries[entry.key];assert.ok(v,entry.key);v.sourceDigest=entry.sourceDigest;v.reviewedAt=new Date().toISOString();
 for(const k of ['success','failure','boundary','interaction'])for(const ref of v.tests?.[k]??[]){if(ref.name===oldBase)ref.name=newBase;if(ref.name===oldMask)ref.name=newMask;}
 if(v.question==='Q-A60-4004-007'||v.questions?.includes('Q-A60-4004-007')){delete v.question;delete v.questions;delete v.pendingSingleBehavior;delete v.reviewStatus;v.userConfirmation=confirmationsFile;v.confirmations=['Q-A60-4004-007'];}
 if(entry.key==='4004:soul:2121'){
  v.singleBehavior='首次获得神圣之霆、裁3层及穿攻免消费；裁仅屏蔽异常条件，真实异常行为/计时不暂停，施加/清除/转换仍执行；属性选招麻痹、攻击消耗及转化、战阶半血分支和回合结束清理已验证。';
  v.rationale='API魂印33a5fd64和用户Q007/Q008；后续实际再次登场延期，首次在场全部行为已实现。';
  for(const k of ['success','failure','boundary','interaction'])v.tests[k].push(...[
   ['4004荣光之裁不免疫不暂停真实异常，控制仍阻行动、扣血与到期正常、消费后条件恢复','有裁疲惫阻行动且PP不消耗、烧伤扣HP/正常到期；裁归0恢复真实异常条件'],
   ['4004有裁仍按真实异常剩余总时长转换，麻痹免疫失败仍清除原异常','有裁烧伤2与失明3清除，麻痹15回合；免疫时原异常仍清除'],
   ['4004荣光之裁不阻新异常施加，条件忽略自身和对手但不改变实际清除','有裁施加中毒成功、条件false、实际清除后真伤与百分比吸取各210']
  ].map(([name,assertion])=>({file:'tests/deployed-4004.test.cjs',name,assertion})));
 }
 if(['4004:soul:2121','4004:skill:38473:4'].includes(entry.key)){
  v.userConfirmation=confirmationsFile;v.confirmations=[...new Set([...(v.confirmations??[]),'Q-A60-4004-008'])];
  confirmations.instanceBindings[entry.key]={questionId:'Q-A60-4004-008',sourceDigest:entry.sourceDigest,rawDigest:policy.digest(entry.raw),petRevision:'ad8c1c08',source:entry.source,raw:entry.raw};
 }
}
confirmations.implementation.current=4004;confirmations.implementation.lastOperation='正式部署及审核已保存，等待专项/HTTP/完整npm正式验证，不代表已验收';
confirmations.implementation.species4004Bindings=entries.map(e=>({key:e.key,sourceDigest:e.sourceDigest,source:e.source,raw:e.raw}));
fs.writeFileSync(confirmationsFile,JSON.stringify(confirmations,null,2)+'\n');fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify({saved:true,coverage:policy.reviewCoverage(snapshot,r)}));
