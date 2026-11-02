'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),p=require('../completion-policy.cjs'),store=require('../local-species.cjs');
const file='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',c=JSON.parse(fs.readFileSync(file)),s=require('./4125-reviewed-snapshot.json');
for(const m of s.moves)if(m.id===38247)m.limitations=m.limitations.filter(x=>!x.includes('Q-A60-4125-026'));
fs.writeFileSync('research/4125-answered-snapshot.json',JSON.stringify(s,null,2)+'\n');
const result=store.save(s);assert.ok(result.saved,JSON.stringify(result));const snapshot=store.species(4125),r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json'));
if(!fs.existsSync('research/4125-reviews-before-answers.json'))fs.writeFileSync('research/4125-reviews-before-answers.json',JSON.stringify(Object.fromEntries(Object.entries(r.entries).filter(([k])=>k.startsWith('4125:'))),null,2)+'\n');
const renames=require('./4125-answer-test-renames.json'),names=[...fs.readFileSync('tests/deployed-4125-answers.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
const ids=[1327,1622,2145,2397,2398,2399,2400,2401];
for(const e of p.inventory(snapshot)){
 const v=r.entries[e.key];assert.ok(v,e.key);v.sourceDigest=e.sourceDigest;v.reviewedAt=new Date().toISOString();
 for(const refs of Object.values(v.tests??{}))for(const ref of refs)for(const [from,to]of renames)ref.name=ref.name.replaceAll(from,to);
 const pending=!!(v.question||v.questions||v.pendingSingleBehavior||v.reviewStatus),id=e.raw.instance?.id;
 if(pending||e.kind==='soul'||ids.includes(id)){
  for(const k of ['question','questions','pendingSingleBehavior','reviewStatus'])delete v[k];
  v.userConfirmation=file;v.rationale='用户Q022-027及Q093明确资源、三类技能、首用、整招后清记录和原版时序；Q008仅授权当前原始实例上只在场回复延期。API原始hash/参数保持，不将用户答案伪称API。';
  v.singleBehavior=e.kind==='skill'?e.raw.instance.description:e.kind==='soul'?'两真实版本独立：三类用招比较，首次不算同异；原版全部反应后回复/附伤与使用后随机，失败战阶吸取；觉醒首用获旧日，PP按扣除前判定、类型关联、次数与12点阈值回满；异常盾、宙变、衰弱失败补偿及无异常双方护盾回血。':e.raw.description;
  v.implementation=['dist/range-effects.js','dist/range-souls.js','dist/effect-registry.js','dist/souls.js','dist/status-rules.js'];
  let relevant=names.filter(n=>e.kind!=='skill'||n.includes(' '+id+' ')||n.includes('Q'+({1327:'026',1622:'025',2145:'027'}[id]??'-absent-'))||([2398,2399].includes(id)&&n.includes('宙变')));
  if(!relevant.length)relevant=names;
  for(const k of ['success','failure','boundary','interaction'])v.tests[k]=[...(v.tests[k]??[]),...relevant.map(name=>({file:'tests/deployed-4125-answers.test.cjs',name,assertion:'实际HP/PP/层数/完整伤害/次数/异常持续与计数状态；1PP扣除前、同类与异类、次数0/1与12点阈值；失败/免疫、整招后记录、理论量盾、技能各阶段关闭及魂印保留。各条原有成功失败状态断言继续保留。'}))];
  c.instanceBindings[e.key]={questionIds:['Q-A60-4125-022','Q-A60-4125-023','Q-A60-4125-024','Q-A60-4125-025','Q-A60-4125-026','Q-A60-4125-027','Q-A60-4125-093'],sourceDigest:e.sourceDigest,source:e.source,raw:e.raw};
 }
 if(e.key==='4125:skill:29253:1'){
  v.dependencyEvidence=[{kind:'previous-ally',quote:'己方上只在场精灵'}];
  v.rationale+=' 仅上只在场精灵回复为真实换宠/场下分支；自身全强与给对手宙变已实现。';
  Object.assign(c.instanceBindings[e.key],{questionId:'Q-A60-4004-008',rawDigest:p.digest(e.raw)});
 }
}
c.implementation.current=4125;c.implementation.lastOperation='4125已部署和逐项更新审核，41项专项通过；正式验证器尚未运行，不算已验收。';
c.implementation.species4125RulePrecedence={weakness:'user-rule-confirmation-3667.json Q005及followUpConfirmations固定刷新3回合/100%增伤仍有效；Q022仅2399修改既有回合数不重新施加，Q027继承转附明确采用继承时长。',archive:'原问答e5444e6b...逐字节归档保持；Q093作为新增人类确认单独追加。'};
fs.writeFileSync(file,JSON.stringify(c,null,2)+'\n');fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');
const affected=[];for(const name of fs.readdirSync('data/species').filter(n=>/^\d+\.json$/.test(n))){const x=JSON.parse(fs.readFileSync('data/species/'+name)).snapshot;if(x.id!==4125&&x.moves.some(m=>m.effectIds.some(id=>[1622,2145,2397,2398,2399,2400,2401].includes(id))))affected.push(x.id);}
fs.writeFileSync('research/4125-answered-public-impact.json',JSON.stringify({at:new Date().toISOString(),otherDeployedConsumers:affected,requiredRecertifications:affected,semantics:'1327仅新增4125/38247/49f8152f/[300,3]理论护盾实例，旧来源无变化；命中附效失效由独立新载体启用，不改变既有整招无效；宙变仅明确附加时启用；消逝与普通死亡独立计数。',logs:{firstNewResource:'research/4125-answered-resource-special-v1.log',oldAssertions:'research/4125-answered-special-v2.log',answeredBaseline:'research/4125-answered-special-v3.log',branchesFirst:'research/4125-answered-branches-v1.log',branchesRounding:'research/4125-answered-branches-v2.log',branchesSource:'research/4125-answered-branches-v3.log',newBurnFixture:'research/4125-answered-branches-v4.log',finalSpecial:'research/4125-answered-special-v4.log'},corrections:'旧pending抛错/标记断言按用户答案换成实际状态；2401测试起初对已取整伤害再乘倍率造成差1，改为独立既有攻击倍数机制在取整前作严格相等对照；烧伤0结算事件是同源自身目标，精确区分目标后仍只1次对手吸取，原HP4000断言保留。'},null,2)+'\n');
console.log(JSON.stringify({issues:store.issues(snapshot),coverage:p.reviewCoverage(snapshot,r),affected}));
