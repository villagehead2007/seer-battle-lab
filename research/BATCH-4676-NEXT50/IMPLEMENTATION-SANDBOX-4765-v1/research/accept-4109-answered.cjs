'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),p=require('../completion-policy.cjs'),store=require('../local-species.cjs');
const result=store.save(require('./4109-reviewed-snapshot.json'));assert.ok(result.saved,JSON.stringify(result));
const snapshot=store.species(4109),r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json')),file='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',c=JSON.parse(fs.readFileSync(file));
const names=[...fs.readFileSync('tests/deployed-4109.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
for(const e of p.inventory(snapshot)){
 const v=r.entries[e.key];assert.ok(v,e.key);v.sourceDigest=e.sourceDigest;v.reviewedAt=new Date().toISOString();
 if(e.kind==='soul'){
  for(const k of ['question','questions','pendingSingleBehavior','reviewStatus'])delete v[k];
  v.rationale='用户Q018百分比类型，Q019整回合全部完整攻击合计判一次，高伤按实际回复附加。保留API原始固定文本及历史格式化差异，不篡改来源。';
  v.singleBehavior='回合初损失比例攻击增伤与严格半血加倍；战阶有攻击事件且双方存活时按整回合完整攻击合计严格低于/高于目标最大HP1/3决定百分比追加或回复自身最大HP1/3并附实际回复等量百分比；恰等不触发，未攻击不触发，完整伤害不截剩余HP。';
  v.implementation=['dist/range-souls.js','dist/souls.js'];v.userConfirmation=file;
  for(const k of ['success','failure','boundary','interaction'])v.tests[k]=[...(v.tests[k]??[]),...names.map(name=>({file:'tests/deployed-4109.test.cjs',name,assertion:'完整攻击2999/3000/3001严格边界，低伤粉3000与高伤实际回复3000/1500/100/0；两段2000累计只一次；固定2000不计门槛；未攻击/MISS/受控不触发，百分比免疫不改回复；1HP保命完整3100而HP损失0仍高伤。'}))];
  c.instanceBindings[e.key]={questionIds:['Q-A60-4109-018','Q-A60-4109-019'],sourceDigest:e.sourceDigest,raw:e.raw,source:e.source};
 }
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');fs.writeFileSync(file,JSON.stringify(c,null,2)+'\n');
fs.writeFileSync('research/4109-answered-public-impact.json',JSON.stringify({newSoul:1342,existingPublicConsumersAffected:[],note:'通用当前回合出伤查询新增可选类型过滤与攻击事件只读查询；不传参数时保留原语义。魂印此前没有正式部署消费者。',initialFailure:'research/4109-answered-special-v1.log',fix:'未发生伤害时damageEvents未创建；只读查询改空数组，不改结算或断言。',finalSpecial:'research/4109-answered-special-v3.log'},null,2)+'\n');console.log(JSON.stringify(p.reviewCoverage(snapshot,r)));
