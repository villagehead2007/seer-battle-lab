'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const catalog=require('../status-database.cjs'),source=require('../data/statuses/sources.json');
const root=path.join(__dirname,'..'),sha=x=>crypto.createHash('sha256').update(x).digest('hex');
function resolve(ref){const doc=JSON.parse(fs.readFileSync(path.join(root,ref.file)));return ref.pointer.split('/').slice(1).reduce((v,k)=>v[k.replace(/~1/g,'/').replace(/~0/g,'~')],doc);}
test('状态库完整保留来源枚举，保留空位而不把XX当成真实状态',()=>{
 const d=catalog.database,e=resolve(d.sources['seerapi-status-enum']);
 assert.equal(e.length,45);assert.equal(catalog.list().length,41);assert.equal(new Set(catalog.list().map(x=>x.id)).size,41);
 for(let id=0;id<e.length;id++){const row=catalog.getById(id);if(!e[id]||e[id]==='XX')assert.equal(row,null);else{assert.equal(row.name,e[id]);assert.equal(row.idEvidence.arrayIndex,id);assert.equal(catalog.getByName(e[id]),row);}}
 assert.equal(catalog.getById(0).name,'麻痹');assert.equal(catalog.getById(44).name,'魇昧');assert.equal(catalog.getById(2074),null);assert.equal(catalog.getByName('XX'),null);assert.throws(()=>catalog.getById('0'),TypeError);
});
test('状态规则逐字段引用原始Wiki文本与准确修订，合并单元格没有丢状态',()=>{
 const d=catalog.database,w=resolve(d.sources['wiki-mechanics']);assert.equal(sha(w),d.sources['wiki-mechanics'].hash);
 for(const r of source.records)assert.equal(sha(JSON.stringify(r.data)),r.sha256);
 assert.equal(d.sourceTableRows.length,40);assert.equal(catalog.getByName('中毒').description,catalog.getByName('冻伤').description);
 for(const n of ['疲惫','害怕','石化'])assert.equal(catalog.getByName(n).description,catalog.getByName('麻痹').description);
 for(const row of catalog.list())for(const field of ['triggerMethods','durationRules','damageRules','immunityConditions','clearConditions','interactions','behaviorRules'])for(const fact of row[field]??[]){assert.ok(w.includes(fact.evidence.quote));const original=d.sourceTableRows.find(x=>x.name===fact.evidence.statusName);assert.ok(original.description.includes(fact.evidence.quote));assert.equal(fact.text,fact.evidence.quote);}
});
test('缺少依据的持续时间及规则保持null，条件性时长不能提升为默认时长',()=>{
 for(const row of catalog.list())assert.equal(row.defaultDurationTurns,null);
 const guard=catalog.getByName('山神守护');assert.equal(guard.description,null);assert.equal(guard.damageRules,null);assert.equal(guard.completeness,'name-and-enum-only');
 assert.equal(catalog.getByName('中毒').immunityConditions,null);assert.equal(catalog.getByName('中毒').durationRules,null);
 assert.equal(catalog.getByName('麻痹').explicitRestricted,null);assert.equal(catalog.getByName('瘫痪').explicitRestricted.value,true);
 for(const name of ['瘫痪','冰封','沉默']){assert.ok(catalog.getByName(name).durationRules.length);assert.ok(catalog.getByName(name).durationRules.every(r=>r.scope==='duration-only-for-this-transition'));}
 assert.equal(catalog.getByName('凝滞').immunityConditions[0].scope,'immunity-granted-while-this-state-is-active');
});
test('状态库只能只读查询，不加载战斗引擎或提供随机池',()=>{
 assert.equal(catalog.database.runtimeEnabled,false);assert.equal(catalog.randomPool,undefined);
 assert.throws(()=>{catalog.getByName('睡眠').name='伪造';},TypeError);
 assert.throws(()=>catalog.list().push({}),TypeError);
 assert.throws(()=>{catalog.getByName('睡眠').clearConditions[0].evidence.quote='篡改';},TypeError);
 assert.ok(!Object.keys(require.cache).some(f=>f.startsWith(path.join(root,'dist')+path.sep)));
});
