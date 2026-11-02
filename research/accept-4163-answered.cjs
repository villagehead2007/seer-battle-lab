'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),p=require('../completion-policy.cjs'),store=require('../local-species.cjs');
const s=require('./4163-reviewed-snapshot.json'),file='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',c=JSON.parse(fs.readFileSync(file));
for(const m of s.moves)if(m.id===27437)m.limitations=m.limitations.filter(x=>!x.includes('1617'));fs.writeFileSync('research/4163-answered-snapshot.json',JSON.stringify(s,null,2)+'\n');const saved=store.save(s);assert.ok(saved.saved,JSON.stringify(saved));
const snapshot=store.species(4163),r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json')),renames=require('./4163-answer-test-renames.json'),names=[...fs.readFileSync('tests/deployed-4163-answers.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
if(!fs.existsSync('research/4163-reviews-before-answers.json'))fs.writeFileSync('research/4163-reviews-before-answers.json',JSON.stringify(Object.fromEntries(Object.entries(r.entries).filter(([k])=>k.startsWith('4163:'))),null,2)+'\n');
for(const e of p.inventory(snapshot)){
 const v=r.entries[e.key];assert.ok(v,e.key);v.sourceDigest=e.sourceDigest;v.reviewedAt=new Date().toISOString();for(const refs of Object.values(v.tests??{}))for(const ref of refs)for(const [a,b]of renames)ref.name=ref.name.replaceAll(a,b);
 if(v.question||v.questions||v.pendingSingleBehavior||v.reviewStatus||e.kind==='soul'||e.raw.instance?.id===1617){
  for(const k of ['question','questions','pendingSingleBehavior','reviewStatus'])delete v[k];v.userConfirmation=file;
  v.rationale='用户Q037明确1690盾值70%吸取为百分比伤害且理论回复，随后石化/失败全强再附固定伤害；Q038只确认1389/1690强化反转属于消强反制。1617新增4163关联明确沿用原012/021。未改变其他魂印或词条的反转规则。';
  v.singleBehavior=e.kind==='skill'?e.raw.instance.description:e.kind==='move'?e.raw.description:e.raw.id===1389?'无盾正强化段数25、有盾30固定，50%石化失败全强；被清强/吸强/当前限定反转触发100%石化，失败清敌回合并附1/3自身最大HP盾。':'初始双防+1、战阶无强化清异常；清强/吸强/限定反转反制；攻击后当前盾值70%百分比理论吸取，后石化或失败全强，再按届时正强化段数30固定；目标在吸取阶段死亡不续接控制/固定。';
  const relevant=e.kind==='soul'?names.filter(n=>n.includes(e.raw.id===1389?'Q038':'1690')||n.includes('两个真实魂印')):e.raw.instance?.id===1617?names.filter(n=>n.includes('1617')):names;
  for(const k of ['success','failure','boundary','interaction'])v.tests[k]=[...(v.tests[k]??[]),...relevant.map(name=>({file:'tests/deployed-4163-answers.test.cjs',name,assertion:'真实百分比完整伤害与实际HP损失、理论回复、免疫/过量/回复倍率/输出倍率/护盾不消费；前序目标死亡停止，70%石化成功失败后固定段数；限定反转/强化保护；1617四回合正完整伤害每回合一次；17原生技能与两魂印加载实际状态。'}))];
  const questionIds=e.kind==='soul'?[...(e.raw.id===1690?['Q-A60-4163-037']:[]),'Q-A60-4163-038']:['Q-A60-4075-012','Q-A60-4114-021'];
  c.instanceBindings[e.key]={questionIds,sourceDigest:e.sourceDigest,source:e.source,raw:e.raw,scope:'Q038只限当前1389/1690；1617沿用回答仅与明确新增4163实例关联'};
 }
 if(e.kind==='move')v.tests.success.push({file:'tests/deployed-4163-answers.test.cjs',name:names.find(n=>n.includes('全部17技能')),assertion:'17真实技能保留所有原生有序效果执行、实际PP与攻击；两个真实魂印版本配招并真实执行27436盾/双防状态。'});
}
c.implementation.current=4163;c.implementation.lastOperation='4163正式本地保存及逐项审核，25项真实状态专项通过；待正式验证器，不记已验收。';
fs.writeFileSync(file,JSON.stringify(c,null,2)+'\n');fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');
fs.writeFileSync('research/4163-answered-public-impact.json',JSON.stringify({changedSouls:[1389,1690],otherDeployedConsumers:[],requiredRecertifications:[],public1617:'复用4114已完成公共1617，当前不再改公共实现；之前1065/1207/1751修复和22只重新认证证据保留，本次未改这些公共实现。',reversalScope:'只移除1389/1690对reverse的待确认阻断；不改其他源的reverse反制。',tests:{initial:'research/4163-answered-special-v1.log',firstNew:'research/4163-answered-special-v2.log',final:'research/4163-answered-special-v3.log'},history:'旧pending/throw断言改为实际已答状态；新增测试起初误把既有寒月阈值<=50当成可压70，核对已有celestial-rules及3432确认后，保留既有规则并精确验证70不受压。未改正确代码或弱化断言。',deferred:'沿用当前来源逐项单精灵分类，没有新增真正队伍/换宠分支，也没有将未实现当前行为延期。'},null,2)+'\n');
console.log(JSON.stringify({issues:store.issues(snapshot),coverage:p.reviewCoverage(snapshot,r)}));
