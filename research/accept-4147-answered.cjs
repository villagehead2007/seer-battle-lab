'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),p=require('../completion-policy.cjs'),store=require('../local-species.cjs');
const s=require('./4147-reviewed-snapshot.json'),file='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',c=JSON.parse(fs.readFileSync(file));
for(const m of s.moves)if([27395,38437].includes(m.id))m.limitations=[];fs.writeFileSync('research/4147-answered-snapshot.json',JSON.stringify(s,null,2)+'\n');
const saved=store.save(s);assert.ok(saved.saved,JSON.stringify(saved));const snapshot=store.species(4147),r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json')),renames=require('./4147-answer-test-renames.json');
if(!fs.existsSync('research/4147-reviews-before-answers.json'))fs.writeFileSync('research/4147-reviews-before-answers.json',JSON.stringify(Object.fromEntries(Object.entries(r.entries).filter(([k])=>k.startsWith('4147:'))),null,2)+'\n');
const names=[...fs.readFileSync('tests/deployed-4147-answers.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]),questionFor=e=>e.kind==='soul'?[e.raw.id===1376?33:34]:e.kind==='skill'?({1633:[35],2422:[36]}[e.raw.instance.id]??[]):({27395:[35],38437:[36]}[e.raw.id]??[]);
for(const e of p.inventory(snapshot)){
 const v=r.entries[e.key];assert.ok(v,e.key);v.sourceDigest=e.sourceDigest;v.reviewedAt=new Date().toISOString();for(const refs of Object.values(v.tests??{}))for(const ref of refs)for(const [a,b]of renames)ref.name=ref.name.replaceAll(a,b);
 const pending=!!(v.question||v.questions||v.pendingSingleBehavior||v.reviewStatus),id=e.raw.instance?.id;
 if(pending||e.kind==='soul'||[1633,2422].includes(id)){
  for(const k of ['question','questions','pendingSingleBehavior','reviewStatus'])delete v[k];v.userConfirmation=file;
  v.rationale=e.kind==='soul'&&e.raw.id===2110?'Q034明确实际先制判据，只有技能携带的基础先制减半向上取整，再叠加原其他修正；当前双月归属和战阶三分支保持，真实场下目标分支继续独立延期。':'用户Q033-036明确实际HP减少量回复、实际先制判别与基础先制减半、百分比直接调HP、护盾最终加到攻击/特攻；保留API原始hash、实例、来源和版本，不以代码充当答案。';
  v.singleBehavior=e.kind==='skill'?e.raw.instance.description:e.kind==='move'?e.raw.description:e.raw.id===1376?'冰封成功次回合必暴，失败固定伤害且低体按对手实际HP减少量回复；免疫/护罩/过量和回复倍率真实测试，战阶HP增减对应全强/次回合攻击先制。':'创建真实中立双月、归属与持月吸取/冰封；无血月按对手实际先制>0减攻伤，无寒月按实际先制判别并只对基础先制减半向上；战阶高低相等各分支。';
  const relevant=names.filter(n=>e.kind==='soul'?n.includes(' '+e.raw.id):e.kind==='skill'?n.includes(' '+id):true);
  for(const k of ['success','failure','boundary','interaction'])v.tests[k]=[...(v.tests[k]??[]),...relevant.map(name=>({file:'tests/deployed-4147-answers.test.cjs',name,assertion:'1376实际HP损失非理论/完整量；2110基础0临时+2及基础3被减0、奇数和混合先制；1633交换前比较、不同最大HP向上/1HP/禁疗及盾不参与；2422物特正零负等级最终加护盾并排除护罩、真实提前消盾；原生19招与四合法版本。'}))];
  c.instanceBindings[e.key]={questionIds:questionFor(e).map(n=>'Q-A60-4147-'+String(n).padStart(3,'0')),sourceDigest:e.sourceDigest,source:e.source,raw:e.raw,scope:'仅月冕当前明确来源版本及此实例'};
 }
 if(e.kind==='move')v.tests.success.push({file:'tests/deployed-4147-answers.test.cjs',name:names.find(n=>n.includes('真实19技能')),assertion:'19个真实技能ID保留全部原生顺序与参数实际执行，真实扣PP及攻击事件；四魂印/第五组合真实加载配招与效果执行。'});
}
c.implementation.current=4147;c.implementation.lastOperation='4147正式部署和57个审核条目已更新，29项专项通过；验证器尚待通过，不计验收。';
c.implementation.species4147AdditionalFifthAuthorization={question:'Q-A60-4004-008追加4147',answerVerbatim:'我的回答（仅4147追加范围）：授权',petRevision:snapshot.source.revision,souls:snapshot.souls.map(x=>({id:x.id,hash:x.hash})),fifths:snapshot.moves.filter(m=>m.fifth).map(m=>({id:m.id,revision:m.revision,sourceFlags:m.sourceFlags})),fullSkillIds:snapshot.moves.map(m=>m.id)};
fs.writeFileSync(file,JSON.stringify(c,null,2)+'\n');fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');
fs.writeFileSync('research/4147-answered-public-impact.json',JSON.stringify({newEffects:[1633,2422],otherDeployedConsumers:[],requiredRecertifications:[],sharedChanges:'攻击计算增加默认0的通用最终加数；未用2422的来源完全不改原公式。显示攻击值改用实际结算攻击。新增双第五白名单只绑定4147/a6a942e、原两魂印hash、34699/38437及全19招；未改验证逻辑。',deferred:'仅已有血月通则的场下发起者目标限制保留多精灵延期，不延期当前星体/魂印/技能。',tests:{initial:'research/4147-answered-special-v1.log',final:'research/4147-answered-special-v2.log'},history:'旧未知注册/待确认标记断言与旧白名单拒绝断言按明确回答改为真实状态，原测试与helper完整归档；新29项成功失败边界关键交互首轮通过。'},null,2)+'\n');
console.log(JSON.stringify({issues:store.issues(snapshot),coverage:p.reviewCoverage(snapshot,r)}));
