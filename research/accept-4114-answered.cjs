'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),p=require('../completion-policy.cjs'),store=require('../local-species.cjs');
const result=store.save(require('./4114-reviewed-snapshot.json'));assert.ok(result.saved,JSON.stringify(result));
const snapshot=store.species(4114),r=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json')),file='research/FIXED60-ANSWER-USER-CONFIRMATIONS.json',c=JSON.parse(fs.readFileSync(file));
const names=[...fs.readFileSync('tests/deployed-4114.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
const rename=n=>n.replace('1444未知公式不宣称完整实现','1444公式按用户回答实现').replace('已确定22招完整链含伙伴实际释放，不把34533未知威力和1617受击缺口计完成','已确定22招与伙伴原生完整链，34533公式和1617边界由专项覆盖').replace('1617多段反制次数明确待确认不猜实现','1617多段仅整回合一次反制');
for(const e of p.inventory(snapshot)){
 const v=r.entries[e.key];assert.ok(v,e.key);v.sourceDigest=e.sourceDigest;v.reviewedAt=new Date().toISOString();for(const refs of Object.values(v.tests??{}))for(const ref of refs)ref.name=rename(ref.name);
 if(e.kind==='move'&&e.raw.id===34533||e.kind==='skill'&&[1444,1617].includes(e.raw.instance.id)){
  for(const k of ['questions','question','pendingSingleBehavior','reviewStatus'])delete v[k];v.userConfirmation=file;
  v.rationale='Q020明确使用技能时HP比例与100之差绝对值向上取整；Q021/012明确完整攻击正数才反制、同回合至多一次，HP实际损失不替代完整结算。';
  v.singleBehavior=e.kind==='move'?'34533保留真实power0原始来源，动态威力按用户公式在使用时读取并在攻击结算中执行；全技能PP/命中/控制及原命中等级-2同时执行。':e.raw.instance.description;
  v.implementation=['dist/range-effects.js','dist/souls.js'];
  const relevant=names.filter(n=>e.kind==='skill'&&e.raw.instance.id===1617?n.includes('1617'):!n.includes('1617'));
  for(const k of ['success','failure','boundary','interaction'])v.tests[k]=relevant.map(name=>({file:'tests/deployed-4114.test.cjs',name,assertion:'真实技能34533在9000/8999/4500/90/1HP给0/1/50/99/100威力，完整双效果实际伤害及命中-2，HP比例而非绝对量、控制/失效；1617三回合载体0伤不耗反制，两个20第一段盾抵后第二段正伤仅全强一次，后续每回合+1直至到期，保命零实际损失仍反制。'}));
  c.instanceBindings[e.key]={questionIds:['Q-A60-4114-020','Q-A60-4114-021','Q-A60-4075-012'],sourceDigest:e.sourceDigest,source:e.source,raw:e.raw};
 }
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');fs.writeFileSync(file,JSON.stringify(c,null,2)+'\n');
const affected=[];for(const name of fs.readdirSync('data/species').filter(n=>/^\d+\.json$/.test(n))){const s=JSON.parse(fs.readFileSync('data/species/'+name)).snapshot;if(s.id!==4114&&s.moves.some(m=>m.effectIds.some(id=>[1444,1617].includes(id))))affected.push(s.id);}
fs.writeFileSync('research/4114-answered-public-impact.json',JSON.stringify({effects:[1444,1617],otherDeployedConsumers:affected,requiredRecertifications:affected,tests:{initial:'research/4114-answered-special-v1.log',second:'research/4114-answered-special-v2.log',final:'research/4114-answered-special-v3.log',notes:'旧helper为未知1444主动抛错并过滤，改为要求真实注册并执行完整源；新比例对照12000超过既有9999面板上限，改为合法6000与9000。既有断言不弱化。'}},null,2)+'\n');
const kept=store.species(4113);c.implementation.retainedExisting??={};c.implementation.retainedExisting[4113]={state:'retained-existing-certification',localIssues:store.issues(kept),coverage:p.reviewCoverage(kept,r),validationIssues:p.validateCoverage(kept,r,require('../MULTI-PET-TODO.json'),process.cwd(),false),reason:'本轮公共修改1444/1617/1612/2313/1594无4113实例；保留原认证，当前各验证器完整回归已覆盖既有专项。'};fs.writeFileSync(file,JSON.stringify(c,null,2)+'\n');console.log(JSON.stringify({coverage:p.reviewCoverage(snapshot,r),affected}));
