'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),p=require('../completion-policy.cjs'),store=require('../local-species.cjs');
const result=store.save(require('./4075-reviewed-snapshot.json'));assert.ok(result.saved,JSON.stringify(result));
const snapshot=store.species(4075),r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json'));
const cfile='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',c=JSON.parse(fs.readFileSync(cfile));
const tests=[...fs.readFileSync('tests/deployed-4075.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
for(const e of p.inventory(snapshot)){
 const v=r.entries[e.key];assert.ok(v,e.key);v.sourceDigest=e.sourceDigest;v.reviewedAt=new Date().toISOString();
 for(const refs of Object.values(v.tests??{}))for(const ref of refs)ref.name=ref.name.replace('未确认分支禁止正式保存','全部已答分支可正式保存').replace('不冒充未知弱化已实现','全部正级赋予额外弱化').replace('未知多段和禁强化边界明确阻塞','多段仅一次且禁强化时失败补偿');
 if(e.kind==='soul'||e.kind==='skill'&&e.raw.instance.id===1594){
  for(const key of ['questions','question','pendingSingleBehavior','reviewStatus'])delete v[key];
  v.userConfirmation=cfile;v.rationale='Q-A60-4075-011/012明确回答：全部自身正等级额外赋予对应弱化，任一失败含无正/已-6补偿；受攻全强/全弱每回合共享一次，实际未提升仍失败补偿。';
  v.singleBehavior=e.kind==='soul'?'实际使用后吸强，然后将自身全部正等级逐项额外下降于对手；任一无实际下降或无可赋予项时最大HP1/3百分比吸取、理论回复及原/强随机清1/2PP；回合初种数快照在战阶60/70回复/固定伤害。':e.raw.instance.description;
  v.implementation=['dist/range-souls.js','dist/souls.js','dist/health-rules.js'];
  for(const k of ['success','failure','boundary','interaction'])v.tests[k]=tests.filter(n=>e.kind==='soul'?!n.includes('受攻全强概率'):n.includes('受攻全强概率')).map(name=>({file:'tests/deployed-4075.test.cjs',name,assertion:e.kind==='soul'?'HP百分比3000与理论回复、PP清1/2项无放回/保护、已有与新吸取正级额外下降，部分免疫与-6/空集合补偿，禁回复倍率及控制边界。':'真实三段攻击仅一次敌全弱-1；禁强化与六项+6时自身不提升、敌六项均-1；原单次概率成功/失败及3回合载体测试另保留。'}));
  if(e.kind==='skill')for(const k of ['success','failure','boundary','interaction'])v.tests[k].push({file:'tests/deployed-4075-partial.test.cjs',name:'4075 1594明确单次受攻50%全强或失败100%全弱，两分支真实状态；多段仅一次且禁强化时失败补偿',assertion:'不同随机种子实际覆盖自身全强+1和敌方全弱-1，多段不重复、禁强必进入失败补偿。'});
  c.instanceBindings[e.key]={questionIds:['Q-A60-4075-011','Q-A60-4075-012'],sourceDigest:e.sourceDigest,source:e.source,raw:e.raw};
 }
}
c.implementation.species4075TestHistory={initial:'research/4075-answered-special-v1.log',second:'research/4075-answered-special-v2.log',final:'research/4075-answered-special-v3.log',reason:'首次旧partial结构断言需要改为完成后真实issues为空；第二次新免疫测试未扣主招真实24攻击伤害，改为精确扣攻击事件并额外断言无正百分比伤害，未放宽伤害或PP断言。'};
fs.writeFileSync(cfile,JSON.stringify(c,null,2)+'\n');fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');
const affected=[];for(const name of fs.readdirSync('data/species').filter(x=>/^\d+\.json$/.test(x))){const s=JSON.parse(fs.readFileSync('data/species/'+name)).snapshot;if(s.id!==4075&&s.moves.some(m=>m.effectIds.includes(1594)))affected.push(s.id);}
fs.writeFileSync('research/4075-answered-public-impact.json',JSON.stringify({newSouls:[1320,1544],effect:1594,otherDeployedConsumers:affected,recertificationRequired:affected,scope:'只有1594载体分支修改；原受攻其他效果未改；新魂印此前无正式消费者'},null,2)+'\n');
console.log(JSON.stringify({coverage:p.reviewCoverage(snapshot,r),otherDeployedConsumers:affected}));
