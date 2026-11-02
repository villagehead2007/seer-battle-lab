'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),p=require('../completion-policy.cjs'),store=require('../local-species.cjs');
const file='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',c=JSON.parse(fs.readFileSync(file)),s=require('./4135-reviewed-snapshot.json');
for(const m of s.moves)if([34630,27363,36521].includes(m.id))m.limitations=[];
fs.writeFileSync('research/4135-answered-snapshot.json',JSON.stringify(s,null,2)+'\n');const saved=store.save(s);assert.ok(saved.saved,JSON.stringify(saved));
const snapshot=store.species(4135),r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json')),renames=require('./4135-answer-test-renames.json');
if(!fs.existsSync('research/4135-reviews-before-answers.json'))fs.writeFileSync('research/4135-reviews-before-answers.json',JSON.stringify(Object.fromEntries(Object.entries(r.entries).filter(([k])=>k.startsWith('4135:'))),null,2)+'\n');
const names=[...fs.readFileSync('tests/deployed-4135-answers.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
for(const e of p.inventory(snapshot)){
 const v=r.entries[e.key];assert.ok(v,e.key);v.sourceDigest=e.sourceDigest;v.reviewedAt=new Date().toISOString();
 for(const refs of Object.values(v.tests??{}))for(const ref of refs)for(const [a,b]of renames)ref.name=ref.name.replaceAll(a,b);
 const pending=!!(v.question||v.questions||v.pendingSingleBehavior||v.reviewStatus),id=e.raw.instance?.id;
 if(pending||e.kind==='soul'||[634,1235,920].includes(id)){
  for(const k of ['question','questions','pendingSingleBehavior','reviewStatus'])delete v[k];v.userConfirmation=file;
  v.rationale='用户Q028-032明确回复前半血判断、唯一重生尝试、满HP/PP且状态保留、各死亡原因立即判定、1235整回合抽取/补偿一次含必中失败、634攻击前比较、920仅基础攻击且不改理论回复；追加第五仅当前精确源获Q008授权。';
  v.singleBehavior=e.kind==='skill'?e.raw.instance.description:e.kind==='move'?e.raw.description:'原版/强化各自1/3或1/2战阶回血；回复前严格半血授予下回合50%减攻伤；死亡50%仅一次判定，成功满HP/PP、能力异常及回合效果保留，当前起三回合减攻伤50%。';
  let relevant=names.filter(n=>e.kind!=='skill'||n.includes(' '+id+' ')||([1602,1785].includes(id)&&n.includes('伙伴920')));if(!relevant.length)relevant=names;
  for(const k of ['success','failure','boundary','interaction'])v.tests[k]=[...(v.tests[k]??[]),...relevant.map(name=>({file:'tests/deployed-4135-answers.test.cjs',name,assertion:'真实HP、PP、能力/异常/回合状态、完整伤害、重生唯一尝试及回合数、四个合法真实第五/魂印组合、1235整回合三段共享及一次PP补偿/保护。既有逐实例成功失败边界状态断言保持。'}))];
  c.instanceBindings[e.key]={questionIds:['Q-A60-4135-028','Q-A60-4135-029','Q-A60-4135-030','Q-A60-4135-031','Q-A60-4135-032'],sourceDigest:e.sourceDigest,source:e.source,raw:e.raw};
 }
 if(v.dependencyEvidence)for(const evidence of v.dependencyEvidence)if(evidence.kind==='off-field-allies')evidence.kind='off-field';
}
const consumers=[3432,3673,3941];
for(const id of consumers)for(const e of p.inventory(store.species(id)))if(e.kind==='skill'&&e.raw.instance.id===1235){
 const v=r.entries[e.key];v.userConfirmations=[...new Set([...(v.userConfirmations??[]),file+'#Q-A60-4135-030'])];
 const related=names.filter(n=>n.includes(' 1235'));
 for(const k of ['success','failure','boundary','interaction'])v.tests[k].push(...related.map(name=>({file:'tests/deployed-4135-answers.test.cjs',name,assertion:'当前[3,70,1]/[3,80,1]/[3,80,2]三种实际参数均测试整回合一次判定、三段共享、必中失败、只清count项PP与PP保护；已有真实各精灵专项保持，须本轮重认证。'})));
 c.instanceBindings[e.key]={questionIds:['Q-A60-4135-030'],sourceDigest:e.sourceDigest,source:e.source,raw:e.raw};
}
c.implementation.current=4135;c.implementation.lastOperation='4135单精灵实现和部署、27项专项与3旧消费者受影响专项合计104通过；3只旧1235消费者需重新认证，当前尚未正式验收。';
fs.writeFileSync(file,JSON.stringify(c,null,2)+'\n');fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');
fs.writeFileSync('research/4135-answered-public-impact.json',JSON.stringify({effects:[1235,634,920],otherDeployedConsumers:consumers,requiredRecertifications:consumers,sourceCompatibility:'仅新增4135/f7781539、魂印1362/56119652与1787/18701ac4、两真实第五34633/36521和原18技能ID；不更改验证逻辑。',deferred:'两魂印未重生时真实场下回血、1602/1785真实不在场精灵回复继续延期；更正review依赖kind为既有支持off-field，并保留原引文，不扩展兼容范围。',tests:{initial:'research/4135-answered-special-v1.log',firstFull:'research/4135-answered-special-v2.log',sourceFixture:'research/4135-answered-special-v3.log',affected:'research/4135-answered-affected-special-v4.log'},history:'旧pending断言改为已确认实际行为；新四版本测试首次引用原始pending限制而被拒，按已回答三个技能生成可用副本；其次普通第五444会回复自己的PP，精确按其已确认真实效果验证用后PP满值。原始测试与review留档。'},null,2)+'\n');
console.log(JSON.stringify({issues:store.issues(snapshot),coverage:p.reviewCoverage(snapshot,r),requiredRecertifications:consumers}));
