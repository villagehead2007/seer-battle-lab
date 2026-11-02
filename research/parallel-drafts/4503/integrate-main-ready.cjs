'use strict';
// Main-agent only: intentionally NOT executed by the drafting agent.
// Prerequisite: canonical4503 has not yet been saved, and no validator/npm is running.
// Main runs prepare-4503-formal.cjs after this backup/code/test integration, then tests.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),sha=s=>crypto.createHash('sha256').update(s).digest('hex'),draft=p=>fs.readFileSync(path.join(__dirname,p),'utf8'),changes=JSON.parse(draft('changes.json'));
assert.equal(changes.length,2,'Only two current exact-source guard removals; legacy1594 flags are outside this script');
assert.ok(changes.every(p=>p.file==='dist/range-effects.js'&&p.after===''),'Unexpected implementation mutation');
assert.ok(changes.some(p=>p.before.includes("pendingNoBoostQuestion:'Q-N20-4503-001'")));
assert.ok(changes.some(p=>p.before.includes("pendingReplyBasisQuestion='Q-N20-4503-002'")));
const writes=new Map(),baseSHAs={};for(const p of changes){const src=writes.get(p.file)??read(p.file);baseSHAs[p.file]??=sha(read(p.file));assert.equal(src.split(p.before).length,2,'Current unique source anchor: '+p.file);writes.set(p.file,src.replace(p.before,p.after));}
assert.equal(fs.existsSync(path.join(root,'data/species/4503.json')),false,'Canonical4503 must be saved exactly once by main formal binder after integration');
const canonical=JSON.parse(draft('candidate-snapshot.json')),original=JSON.parse(read('research/4503-reviewed-snapshot.json')),sourceCheck=JSON.parse(read('research/4503-source-check.json')),record=(kind,id)=>sourceCheck.records.find(x=>x.url.endsWith('/'+kind+'/'+id));
assert.deepEqual(canonical,original,'Candidate must preserve reviewed original source');assert.equal(canonical.id,4503);assert.equal(canonical.source.revision,'fe6e367');assert.equal(record('pet',4503).data.hash,canonical.source.revision);assert.equal(canonical.moves.length,17);assert.deepEqual(canonical.souls.map(x=>[x.id,x.hash]),[[1717,'98b92253']]);assert.deepEqual(canonical.moves.filter(x=>x.fifth).map(x=>[x.id,x.hash,x.pp]),[[36579,'b6a080ad',6]]);
for(const m of canonical.moves){const raw=record('skill',m.id);assert.ok(raw,'Genuine skill source '+m.id);assert.equal(raw.data.hash,m.hash);}assert.equal(record('soulmark',1717).data.hash,'98b92253');
function replaceExactly(text,before,after,label){assert.equal(text.split(before).length,2,label);return text.replace(before,after);}
let helper=draft('battle-helper.draft.cjs');helper=replaceExactly(helper,"require('./overlay.cjs').engine","require('../../dist/engine.js')",'Helper real current engine');helper=replaceExactly(helper,"require('./candidate-snapshot.json')","require('../../local-species.cjs').species(4503)",'Helper genuine canonical savedsource');
let old=draft('independent-tests.draft.cjs'),fresh=draft('confirmed-tests.draft.cjs');
old=replaceExactly(old,"require('./battle-helper.draft.cjs')","require('./helpers/4503-battle.cjs')",'Migrate old16 helper');fresh=replaceExactly(fresh,"require('./battle-helper.draft.cjs')","require('./helpers/4503-battle.cjs')",'Migrate new6 helper');
const before="test('4503完整原生17招全实例配招/原魂1717与sourceHash实际选中，每只独立对照ID；第五PP6且444真实回复PP',()=>{assert.equal(E.WIKI.assess(H.source).supported,true);";
const after="test('4503正式本地搜索加载17真实ID与全部原生实例，原魂1717及独立对照，原第五PP6与444真实回复',()=>{const store=require('../local-species.cjs'),canonical=store.species(4503),reference=require('../research/4503-reviewed-snapshot.json');assert.ok(store.search('4503').results.some(x=>x.id===4503));assert.equal(canonical.source.storage,'local');assert.equal(canonical.source.revision,'fe6e367');assert.equal(canonical.moves.length,17);assert.deepEqual(canonical.souls.map(x=>[x.id,x.hash]),[[1717,'98b92253']]);assert.deepEqual(canonical.moves.filter(x=>x.fifth).map(x=>[x.id,x.hash,x.pp]),[[36579,'b6a080ad',6]]);assert.deepEqual(H.source,canonical);for(const m of canonical.moves){const raw=reference.moves.find(x=>x.id===m.id);assert.ok(raw);assert.equal(m.hash,raw.hash);assert.equal(m.revision,raw.revision);assert.deepEqual(m.effectInstances,raw.effectInstances);}assert.equal(E.WIKI.assess(H.source).supported,true);";
fresh=replaceExactly(fresh,before,after,'Native genuine local store/search/load and originalhash assertions');
// Titles only; correct state assertions and source descriptions remain intact.
const fixTitles=t=>t.replace(/test\('([^']*)'/g,(all,name)=>"test('"+name.replace('单次已知概率分支','每回合一次真实概率分支').replace('禁疗回复基数待答','禁疗实际回复0不附伤').replace('零伤/MISS待答','零伤触发/MISS不触发')+"'");old=fixTitles(old);fresh=fixTitles(fresh);
const count=t=>(t.match(/\btest\('/g)??[]).length;assert.equal(count(old),16);assert.equal(count(fresh),6);assert.equal(count(old)+count(fresh),22);
for(const [name,text]of [['old16',old],['new6',fresh],['helper',helper]])assert.ok(!text.includes('./overlay.cjs')&&!text.includes('./candidate-snapshot.json')&&!text.includes('./battle-helper.draft.cjs'),name+' must not reference draft runtime/data');
writes.set('tests/helpers/4503-battle.cjs',helper);writes.set('tests/deployed-4503-independent.test.cjs',old);writes.set('tests/deployed-4503.test.cjs',fresh);
// All preflight is complete before first filesystem mutation. Back up every overwritten file first.
const stamp=new Date().toISOString().replace(/[:.]/g,'-'),backupRelative='research/4503-before-integration-'+stamp,backup=path.join(root,backupRelative);assert.ok(!fs.existsSync(backup));fs.mkdirSync(backup,{recursive:true});
const manifest={at:new Date().toISOString(),backupRelative,canonicalSource:canonical.source,implementationChanges:changes.map(p=>({file:p.file,oldBaselineSHA256:p.baselineSha256,currentBeforeSHA256:baseSHAs[p.file],uniqueAnchor:true})),tests:{existingMigrated:16,new:6,total:22},legacy1594FlagModified:false,files:[]};
for(const [file,value]of writes){const absolute=path.join(root,file),exists=fs.existsSync(absolute),name=file.replace(/[\\/]/g,'__');if(exists)fs.copyFileSync(absolute,path.join(backup,name));manifest.files.push({file,existed:exists,backup:exists?name:null,beforeSHA256:exists?sha(read(file)):null,afterSHA256:sha(value)});}
fs.writeFileSync(path.join(backup,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');for(const [file,value]of writes)fs.writeFileSync(path.join(root,file),value);
console.log(JSON.stringify({backup:backupRelative,files:manifest.files.map(x=>x.file),tests:22,legacy1594FlagModified:false,testsExecuted:false,validatorExecuted:false}));
