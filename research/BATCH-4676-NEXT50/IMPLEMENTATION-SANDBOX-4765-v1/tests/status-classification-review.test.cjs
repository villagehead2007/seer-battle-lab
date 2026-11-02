'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const catalog=require('../status-database.cjs'),review=require('../data/statuses/classification-reviews.json'),cache=require('../research/status-classification-cache-review.json');
const pool=require('../status-pool-candidates.cjs').inspectNonRestricted();
const root=path.join(__dirname,'..'),sha=x=>crypto.createHash('sha256').update(x).digest('hex'),docs=new Map();
function resolve(ref){if(!docs.has(ref.file))docs.set(ref.file,JSON.parse(fs.readFileSync(path.join(root,ref.file))));return ref.pointer.split('/').slice(1).reduce((v,k)=>v[k.replaceAll('~1','/').replaceAll('~0','~')],docs.get(ref.file));}

test('分类逐项审核覆盖38个待核实和3个排除项，无重复或遗漏',()=>{
 assert.equal(review.records.length,41);assert.equal(new Set(review.records.map(r=>r.id)).size,41);
 assert.deepEqual(review.records.filter(r=>r.wasPending).map(r=>r.id),pool.unresolved.map(r=>r.id));
 for(const row of review.records){const original=catalog.getById(row.id);assert.equal(row.name,original.name);assert.equal(row.originalDescription,original.description);assert.ok(row.reviewNote.length>10);assert.equal(Object.keys(row.checks).length,6);}
 assert.equal(review.summary.pendingReviewed,38);assert.equal(review.summary.newlyConfirmedPoolMembers,0);
});

test('逐状态证据原文与修订哈希可回溯，控制类别标签不替代行为字段',()=>{
 assert.equal(review.databaseSha256,sha(fs.readFileSync(path.join(root,'data/statuses/statuses.json'))));
 const wiki=resolve(catalog.database.sources['wiki-mechanics']);assert.equal(sha(wiki),review.source.hash);
 for(const r of review.records){for(const f of Object.values(r.checks)){for(const e of Array.isArray(f.evidence)?f.evidence:f.evidence?[f.evidence]:[]){assert.equal(e.revision,review.source.revision);assert.equal(e.hash,review.source.hash);assert.ok(r.originalDescription.includes(e.quote));assert.ok(wiki.includes(e.quote));}}
  assert.equal(r.checks.controlClass.listedCategory,catalog.getById(r.id).category);
  for(const key of ['isAbnormal','restrictsSwitching','controlsAction','dealsPeriodicDamage'])assert.equal(r.checks[key].value,catalog.getById(r.id).classification[key]);
 }
 const stagnant=review.records.find(r=>r.name==='凝滞');assert.equal(stagnant.checks.controlClass.value,false);assert.equal(stagnant.checks.controlClass.listedCategory,'弱化类');assert.equal(stagnant.checks.controlsAction.value,null);
});

test('缓存去重保留文件指针和内容摘要，缺失页面不当作状态不存在',()=>{
 assert.equal(cache.parseFailures.length,0);
 for(const doc of cache.documents)assert.equal(sha(fs.readFileSync(path.join(root,doc.file))),doc.sha256);
 const keys=cache.wikiRevisions.map(p=>JSON.stringify([p.title,p.revision,p.hash]));assert.equal(new Set(keys).size,keys.length);
 for(const page of cache.wikiRevisions)for(const ref of page.locations)assert.equal(sha(resolve(ref)),page.hash);
 assert.equal(cache.mechanicsVersions.length,1);assert.equal(cache.mechanicsVersions[0].revision,388558);assert.ok(cache.mechanicsVersions[0].locations.length>1);
 for(const term of cache.termHits)for(const ref of term.locations){const text=resolve(ref);assert.equal(sha(text),ref.stringSha256);assert.ok(text.includes(term.quote));}
 assert.ok(cache.missingPages.some(p=>p.title==='异常状态'));
 const guard=review.records.find(r=>r.name==='山神守护');assert.equal(guard.checks.isAbnormal.value,null);assert.equal(guard.checks.controlClass.value,null);assert.equal(guard.checks.eligibleFor2074.value,null);
});

test('反推风险逐条保留null：转化不继承本体伤害，恢复和增伤不冒充周期伤害',()=>{
 for(const name of ['冰封','易燃','焚烬','感染','诅咒','超频','空定','渐冻','束缚','雷解','星哲','衰弱','沸涌']){
  const r=review.records.find(r=>r.name===name);assert.equal(r.checks.dealsPeriodicDamage.value,null,name);assert.equal(r.checks.eligibleFor2074.value,null,name);assert.ok(r.missingEvidence.length>=3);
 }
 const star=review.records.find(r=>r.name==='星赎');assert.equal(star.checks.restrictsSwitching.value,null);assert.equal(star.checks.eligibleFor2074.value,null);
});

test('审核汇总区分已知行为与入池资格，待核实不会被升级成完整池',()=>{
 assert.deepEqual(review.summary.fields.isAbnormal,{yes:40,no:0,unknown:1});
 assert.deepEqual(review.summary.fields.controlClass,{yes:13,no:27,unknown:1});
 assert.deepEqual(review.summary.fields.restrictsSwitching,{yes:2,no:0,unknown:39});
 assert.deepEqual(review.summary.fields.dealsPeriodicDamage,{yes:8,no:0,unknown:33});
 assert.deepEqual(review.summary.fields.eligibleFor2074,{yes:0,no:3,unknown:38});
 assert.deepEqual(review.records.filter(r=>r.checks.eligibleFor2074.value===false).map(r=>r.name),['瘫痪','凝滞','魇昧']);
 assert.equal(review.summary.poolCanBeGenerated,false);assert.equal(review.summary.poolIds,null);assert.equal(pool.poolIds,null);
 assert.equal(catalog.database.runtimeEnabled,false);
});
