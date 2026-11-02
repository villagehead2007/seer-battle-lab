'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),p=require('../completion-policy.cjs'),store=require('../local-species.cjs');
const result=store.save(require('./4105-reviewed-snapshot.json'));assert.ok(result.saved,JSON.stringify(result));
const snapshot=store.species(4105),r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json')),cfile='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',c=JSON.parse(fs.readFileSync(cfile));
const names=[...fs.readFileSync('tests/deployed-4105.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
const rename=n=>n.replace('未知不正式部署','全部回答已实现可正式部署').replace('其余冲突保持partial','仅攻击减伤与明确百分比附伤').replace('条件概率免疫明确待确认','条件概率免疫按本次实际判定').replace('1612固定真伤亦观察完整伤害，1HP保命零实际损失仍触发；多段单位明确阻塞','1612不观察固定真伤，1HP保命完整正攻击仍触发；多段按整回合累计');
for(const e of p.inventory(snapshot)){
 const v=r.entries[e.key];assert.ok(v,e.key);v.sourceDigest=e.sourceDigest;v.reviewedAt=new Date().toISOString();
 for(const refs of Object.values(v.tests??{}))for(const ref of refs)ref.name=rename(ref.name);
 if(e.kind==='soul'||e.kind==='skill'&&[1612,2313].includes(e.raw.instance.id)){
  for(const k of ['question','questions','pendingSingleBehavior','reviewStatus'])delete v[k];
  v.rationale='Q013攻击限定减伤/增伤及百分比附伤；Q014反转前互斥；Q015只累计完整攻击每回合一次；Q016按当次实际免疫条件/概率判定且失败分支仍执行；Q017攻击前HP25%每招命中一次。原始来源不改。';
  v.singleBehavior=e.kind==='soul'?'回合初正强化决定当回合攻击减50%或攻击先制+1及每招25%对手攻击前HP百分比追加；仅命中附加，反转前有负则成功免反，不同时获得次回合随机50-100%攻击增伤。':e.raw.instance.description;
  v.userConfirmation=cfile;v.implementation=['dist/range-souls.js','dist/range-effects.js','dist/souls.js'];
  const relevant=names.filter(n=>e.kind==='soul'?n.startsWith('4105魂印'):e.raw.instance.id===1612?n.includes('1612'):n.includes('洞见'));
  for(const k of ['success','failure','boundary','interaction']){
   const existing=v.tests?.[k]??[];v.tests[k]=[...existing,...relevant.map(name=>({file:'tests/deployed-4105.test.cjs',name,assertion:'真实状态断言：2250百分比基数且多段一次、MISS/失效不附；反转+2与反弹时窗并排除随机增伤；两个200不反制/两个100仅一次300失败补偿；穿透实际攻击免疫仍正攻击，概率两结果与条件阈值决定3000理论吸取、概率失败实际双防-1。'}))];
  }
  c.instanceBindings[e.key]={questionIds:['Q-A60-4105-013','Q-A60-4105-014','Q-A60-4105-015','Q-A60-4105-016','Q-A60-4105-017'],sourceDigest:e.sourceDigest,source:e.source,raw:e.raw};
 }
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');fs.writeFileSync(cfile,JSON.stringify(c,null,2)+'\n');
const affected=[];for(const name of fs.readdirSync('data/species').filter(n=>/^\d+\.json$/.test(n))){const s=JSON.parse(fs.readFileSync('data/species/'+name)).snapshot;if(s.id!==4105&&s.moves.some(m=>m.effectIds.some(id=>[1612,2313].includes(id))))affected.push(s.id);}
fs.writeFileSync('research/4105-answered-public-impact.json',JSON.stringify({effects:[1612,2313],otherDeployedConsumers:affected,requiredRecertifications:affected,newSoul:1340,initialTestFailure:'research/4105-answered-special-v1.log',testCorrection:'新增百分比附伤成为最后伤害事件，旧精确攻击断言从末事件改为最后攻击事件，数值公式及全部断言保留。',special:'research/4105-answered-special-v2.log'},null,2)+'\n');console.log(JSON.stringify({coverage:p.reviewCoverage(snapshot,r),affected}));
