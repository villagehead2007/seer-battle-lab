'use strict';
// Research integrity only; does not import or alter the project's validator.
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const r=require('./effect-2074-report.json'),s=require('./effect-2074-sources.json'),l=require('./effect-2074-local.json'),b=require('./random-effect-pools-baseline.json');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),cache=new Map();
function at(ref){if(!cache.has(ref.file))cache.set(ref.file,JSON.parse(fs.readFileSync(ref.file,'utf8').replace(/^\uFEFF/,'')));return ref.pointer.split('/').slice(1).reduce((o,k)=>o[k.replace(/~1/g,'/').replace(/~0/g,'~')],cache.get(ref.file));}
const definition=s.records.find(x=>x.data.id===2074).data;
assert.equal(r.effectId,2074);assert.equal(r.definition.originalDescription,definition.info);assert.equal(r.definition.hash,definition.hash);
assert.deepEqual(r.instances.map(x=>x.skillId).sort((a,b)=>a-b),definition.skill.map(x=>x.id).sort((a,b)=>a-b));
let refs=0;
for(const inst of r.instances){const skill=s.records.find(x=>x.url==='https://api.seerapi.com/v1/skill/'+inst.skillId).data;assert.equal(inst.skillHash,skill.hash);assert.equal(inst.skillName,skill.name);assert.deepEqual(skill.friend_skill_effect,[]);for(const source of inst.sources){const e=at(source);assert.equal(e.effect?.id??e.id,2074);assert.deepEqual(e.args,inst.args);assert.equal(e.info??e.description,inst.originalDescription);refs++;}assert.equal(inst.args.length,definition.args_num);assert.equal(inst.originalDescription,definition.info.replace('{0}',String(inst.args[0])));}
for(const version of r.definition.sourceDefinitions)for(const source of version.sources){const d=at(source);assert.equal(d.id,2074);assert.equal(d.hash??d.revision?.replace(/^seerapi:/,''),definition.hash);refs++;}
for(const history of r.versionHistory.bwiki){assert.equal(history.revisions.length,history.coverage.revisions);assert.equal(history.coverage.continuationExhausted,true);for(const rev of history.revisions){assert.equal(sha(rev.content),rev.contentSha256);for(const source of rev.sources){const d=at(source);assert.equal(d.revid,rev.revid);assert.equal(d.slots?.main?.['*']??d['*'],rev.content);refs++;}}}
for(const source of s.records)assert.equal(sha(JSON.stringify(source.data)),source.sha256);
for(const source of r.sourceManifest)assert.equal(sha(fs.readFileSync(source.file)),source.sha256,source.file);
assert.equal(l.errors.length,0);assert.equal(r.candidatePool.confirmedMembers,null);assert.deepEqual(r.candidatePool.namedCandidates,[]);assert.equal(r.implementationReady,false);assert.equal(r.status,'definition-unresolved');
assert.ok(r.reasonableHypotheses.every(x=>x.usableForImplementation===false));assert.ok(r.sourceAccess.failures.some(x=>x.error.includes('HTTP 567')));assert.ok(r.versionHistory.unretrieved.includes('技能:37654'));assert.ok(r.versionHistory.unretrieved.includes('技能:38191'));
const changed=Object.entries(b.files).filter(([file,hash])=>sha(fs.readFileSync(file))!==hash).map(([file])=>file);assert.deepEqual(changed,[]);
const result={checkedAt:new Date().toISOString(),status:'research-integrity-passed',effectDefinitionStatus:r.status,scannedJsonFiles:l.summary.files,currentSkillInstances:r.instances.length,apiReverseIndexCovered:true,bwikiRevisions:r.versionHistory.bwiki.reduce((n,h)=>n+h.revisions.length,0),sourceReferencesChecked:refs,protectedFilesChecked:Object.keys(b.files).length,protectedFilesChanged:changed,unretrievedHistories:r.versionHistory.unretrieved,confirmedPoolMembers:null,battleTestsRun:false,completionValidatorRun:false,note:'证据、指针、参数、版本及保护文件检查通过；不表示2074定义已解决或战斗实现完成。'};
fs.writeFileSync('research/effect-2074-check.json',JSON.stringify(result,null,2)+'\n');console.log(result);
