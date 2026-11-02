'use strict';
// Integrity/coverage audit of research records, NOT a battle completion validator.
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto'),r=require('./random-effect-pools.json'),i=require('./random-effect-pools-inventory.json'),baseline=require('./random-effect-pools-baseline.json');
const digest=x=>crypto.createHash('sha256').update(x).digest('hex'),cache=new Map();
function json(file){if(!cache.has(file))cache.set(file,JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'')));return cache.get(file);}
function at(file,pointer){return pointer.split('/').slice(1).reduce((v,k)=>v[k.replace(/~1/g,'/').replace(/~0/g,'~')],json(file));}
assert.equal(r.records.length,81);const seen=new Set();let references=0,instances=0;
for(const record of r.records){const key=record.namespace+':'+record.effectId;assert.ok(!seen.has(key),key);seen.add(key);assert.ok(record.effectName&&record.originalDescription&&record.hash,key);assert.ok(record.sourceUrls.length>0&&record.sourceRefs.length>0,key);assert.ok(record.unconfirmed.length>0,key);assert.equal(record.probability.selectionWeights,null,key);
 for(const ref of record.sourceRefs){const raw=at(ref.file,ref.pointer);assert.ok(raw,ref.file+ref.pointer);assert.equal(raw.id,record.effectId,key);assert.equal(raw.hash??raw.revision?.replace(/^seerapi:/,''),record.hash,key);assert.equal(raw.info??raw.desc??raw.template??raw.description,record.originalDescription,key);assert.equal(new URL(ref.url).hostname,'api.seerapi.com');references++;}
 for(const v of record.sourceVersions)for(const ref of v.refs){assert.ok(at(ref.file,ref.pointer));references++;}
 if(record.confirmedPool.status==='membership-confirmed')for(const member of record.confirmedPool.members)assert.ok(record.originalDescription.includes(member),key+member);
 for(const inst of record.historicalInstances??[]){assert.ok(Array.isArray(inst.args));for(const source of inst.sources)assert.ok(at(source.file,source.pointer));instances++;}
}
for(const e of i.effects)assert.ok(seen.has('skill-effect:'+e.effectId)||r.scope.excluded.some(x=>x.namespace==='skill-effect'&&x.effectId===e.effectId));
for(const s of i.souls)assert.ok(seen.has('soulmark:'+s.id)||r.scope.excluded.some(x=>x.namespace==='soulmark'&&x.effectId===s.id));
const blocked=r.records.find(x=>x.namespace==='skill-effect'&&x.effectId===2074);assert.equal(blocked.confirmedPool.members,null);assert.equal(blocked.confirmedPool.status,'unconfirmed');
assert.ok(r.taxonomy.stageEnum.infos.length===6);assert.ok(r.taxonomy.source.revision);assert.ok(r.taxonomy.sourceText.includes('限制类'));assert.ok(r.scope.fixtureAudit.allCovered);
for(const entry of r.sourceManifest)assert.equal(digest(fs.readFileSync(entry.file)),entry.sha256,entry.file+' changed source');
const changed=Object.entries(baseline.files).filter(([p,h])=>digest(fs.readFileSync(p))!==h).map(([p])=>p);assert.deepEqual(changed,[],'protected runtime/data/test/validation/species files changed');
const output={checkedAt:new Date().toISOString(),status:'research-integrity-passed',skillEffects:56,soulmarks:25,sourceFiles:r.sourceManifest.length,sourceReferencesChecked:references,historicalInstanceVariants:instances,codeMentions:i.codeMentions.length,excludedFalsePositives:r.scope.excluded.length,systemSelections:r.systemSelections.length,protectedFilesChecked:Object.keys(baseline.files).length,protectedFilesChanged:changed,unknown2074StillUnconfirmed:true,battleTestsRun:false,note:'只验证研究记录完整性、源指针/版本及修改范围；不证明随机分布，不认证任何精灵或公共机制完成。'};
fs.writeFileSync('research/random-effect-pools-check.json',JSON.stringify(output,null,2)+'\n');console.log(output);
