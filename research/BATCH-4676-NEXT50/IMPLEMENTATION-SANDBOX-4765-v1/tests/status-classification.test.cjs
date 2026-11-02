'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const catalog=require('../status-database.cjs'),query=require('../status-pool-candidates.cjs');
const {fields,classify}=require('../research/status-classification.cjs');
const root=path.join(__dirname,'..'),db=catalog.database,source=db.sources['wiki-mechanics'];
function rawWiki(){const file=JSON.parse(fs.readFileSync(path.join(root,source.file)));return source.pointer.split('/').slice(1).reduce((v,k)=>v[k],file);}
const namesFor=field=>catalog.list().filter(r=>r.classification[field]===true).map(r=>r.name);

test('全部41种状态具有完整三值分类字段，已知值逐字段绑定真实来源',()=>{
 const raw=rawWiki();assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),source.hash);assert.equal(catalog.list().length,41);
 for(const row of catalog.list()){
  assert.deepEqual(Object.keys(row.classification),fields);
  for(const field of fields){const value=row.classification[field],e=row.classificationEvidence[field];
   assert.ok(value===true||value===false||value===null);if(value===null){assert.equal(e,null);assert.ok(row.classificationPending.includes(field));}
   else{assert.equal(e.revision,source.revision);assert.equal(e.hash,source.hash);assert.equal(e.url,source.url);assert.equal(e.statusName,row.name);assert.ok(row.description.includes(e.quote));assert.ok(raw.includes(e.quote));assert.ok(!row.classificationPending.includes(field));}
  }
  assert.deepEqual(classify(row,source).classification,row.classification);
 }
 assert.equal(namesFor('isAbnormal').length,40);assert.equal(catalog.getByName('山神守护').classification.isAbnormal,null);
});

test('限制类和禁止换宠分别保存，星赎引用非限制类不误判为自身限制',()=>{
 assert.deepEqual(namesFor('isRestrictedClass'),['瘫痪','凝滞','魇昧']);assert.deepEqual(namesFor('restrictsSwitching'),['瘫痪','凝滞']);
 assert.equal(catalog.getByName('魇昧').classification.restrictsSwitching,null);
 const star=catalog.getByName('星赎');assert.equal(star.explicitRestricted,null);assert.equal(star.classification.isRestrictedClass,null);assert.equal(star.classification.restrictsSwitching,null);
 for(const n of ['麻痹','中毒','睡眠','害怕','混乱']){assert.equal(catalog.getByName(n).classification.isRestrictedClass,null);assert.equal(catalog.getByName(n).classification.restrictsSwitching,null);}
 assert.ok(!catalog.list().some(r=>r.classification.restrictsSwitching===false));
});

test('行动控制保留条件，技能无效及免疫控制不反推自身控制',()=>{
 assert.equal(namesFor('controlsAction').length,13);
 const faith=catalog.getByName('狂信');assert.equal(faith.classification.controlsAction,true);assert.equal(faith.classificationEvidence.controlsAction.condition,'对手为信仰对象');
 for(const n of ['凝滞','失明','失神','沉默','臣服'])assert.equal(catalog.getByName(n).classification.controlsAction,null);
});

test('持续伤害区别概率扣血与一次性解除伤害，属性等级变化保留结束时点',()=>{
 assert.deepEqual(namesFor('dealsPeriodicDamage'),['中毒','烧伤','寄生','冻伤','混乱','流血','烈焰诅咒','沉默']);
 assert.equal(catalog.getByName('混乱').classificationEvidence.dealsPeriodicDamage.condition,'5%的概率');
 for(const n of ['束缚','雷解','致命诅咒'])assert.equal(catalog.getByName(n).classification.dealsPeriodicDamage,null);
 assert.deepEqual(namesFor('changesStats'),['冰封','焚烬','感染']);
 for(const n of namesFor('changesStats'))assert.equal(catalog.getByName(n).classificationEvidence.changesStats.scope,'on-status-end');
 for(const n of ['烧伤','混乱','超频','魇昧'])assert.equal(catalog.getByName(n).classification.changesStats,null);
});

test('刷新与叠加无来源保持null，用户2074策略不回填为通用状态事实',()=>{
 for(const row of catalog.list()){assert.equal(row.classification.allowsDurationRefresh,null);assert.equal(row.classification.stackingRule,null);assert.equal(row.defaultDurationTurns,null);}
 assert.equal(catalog.getByName('星赎').classification.allowsDurationRefresh,null);
 assert.throws(()=>{catalog.getByName('睡眠').classification.stackingRule='max';},TypeError);
});

test('真实数据库动态查询区分明确排除和待核实，不将未知误当非限制候选',()=>{
 const result=query.inspectNonRestricted();assert.equal(result.status,'needs-source');assert.equal(result.poolIds,null);assert.deepEqual(result.candidateIds,[]);
 assert.deepEqual(result.excluded.map(r=>r.name),['瘫痪','凝滞','魇昧']);assert.equal(result.unresolved.length,38);assert.ok(result.unresolved.some(r=>r.name==='中毒'));assert.ok(result.unresolved.some(r=>r.name==='山神守护'));assert.ok(result.unresolved.some(r=>r.name==='星赎'));
 assert.equal(result.candidates.length+result.excluded.length+result.unresolved.length,41);
 assert.equal(result.runtimeConnected,false);
});

// Synthetic classification cases exercise tri-state filtering; not source claims.
const fixture=(id,flags)=>({id,name:'分类夹具'+id,classification:{isAbnormal:true,isRestrictedClass:false,restrictsSwitching:false,...flags}});
test('动态候选查询响应分类变化且不按控制或正负收益筛选，不修改源数据',()=>{
 const rows=[fixture(4,{controlsAction:true}),fixture(2,{controlsAction:false}),fixture(7,{restrictsSwitching:true}),fixture(9,{isRestrictedClass:true}),fixture(11,{isAbnormal:false})];
 const before=structuredClone(rows),a=query.inspectNonRestricted(rows);assert.deepEqual(a.poolIds,[2,4]);assert.equal(a.status,'classification-complete');assert.deepEqual(rows,before);
 rows.push(fixture(15,{}));assert.deepEqual(query.inspectNonRestricted(rows).poolIds,[2,4,15]);rows[0].classification.restrictsSwitching=true;assert.deepEqual(query.inspectNonRestricted(rows).poolIds,[2,15]);
});

test('未知、确认空池、非法分类和重复ID边界保持可区分',()=>{
 const unknown=query.inspectNonRestricted([fixture(1,{}),fixture(2,{restrictsSwitching:null})]);assert.deepEqual(unknown.candidateIds,[1]);assert.equal(unknown.poolIds,null);assert.equal(unknown.status,'needs-source');
 const empty=query.inspectNonRestricted([fixture(1,{isRestrictedClass:true})]);assert.equal(empty.status,'confirmed-empty');assert.deepEqual(empty.poolIds,[]);
 assert.throws(()=>query.inspectNonRestricted([fixture(1,{restrictsSwitching:'false'})]),TypeError);
 assert.throws(()=>query.inspectNonRestricted([fixture(1,{}),fixture(1,{})]),TypeError);
});

test('分类查询只读且不加载战斗引擎，不注册2074或提供随机执行器',()=>{
 assert.equal(db.runtimeEnabled,false);assert.equal(query.sample,undefined);assert.equal(query.apply,undefined);
 assert.ok(!Object.keys(require.cache).some(f=>f.startsWith(path.join(root,'dist')+path.sep)));
 assert.throws(()=>{catalog.getByName('中毒').classificationEvidence.isAbnormal.hash='fake';},TypeError);
});

test('2074接入方案绑定当前数据摘要，用户策略与来源事实分离',()=>{
 const design=require('../research/status-pool-2074-design.json');
 assert.equal(design.effectId,2074);assert.equal(design.runtimeConnected,true);assert.equal(design.conclusionHistory[0].status,'design-only-needs-source');assert.equal(design.currentProjectImplementation.sourceType,'user_confirmed');assert.deepEqual(design.currentProjectImplementation.candidates,require('../dist/status-pools.js').pool());
 assert.equal(design.sourceCatalog.sha256,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'data/statuses/statuses.json'))).digest('hex'));
 assert.equal(design.sourceCatalog.wiki.revision,source.revision);assert.equal(design.sourceCatalog.wiki.hash,source.hash);
 for(const policy of Object.values(design.policies)){assert.equal(policy.kind,'user-requested-design');assert.equal(policy.gameSourceConfirmed,false);}
 assert.equal(design.policies.distribution.kindOfDistribution,'uniform');assert.equal(design.policies.durationMerge.rule,'max');
 assert.equal(design.policies.distribution.multipleDrawReplacement,null);assert.equal(design.unresolved.defaultDurations,null);
 assert.deepEqual(design.currentClassification,query.inspectNonRestricted());
});
