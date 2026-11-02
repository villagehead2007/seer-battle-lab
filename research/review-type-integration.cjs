'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const baseline=require('./type-integration-before.json'),files=baseline.files;
const changed=Object.keys(files).filter(p=>!fs.existsSync(p)||hash(fs.readFileSync(p))!==files[p]);
for(const p of changed)assert.ok(!p.startsWith('data/species')&&!p.startsWith('automation')&&!['AGENTS.md','completion-policy.cjs','SINGLE-STAGE-REVIEWS.json','MULTI-PET-TODO.json'].includes(p),p);
const adjustments=require('./type-integration-test-adjustments.json'),testProof=[];
for(const p of adjustments.files){
 let text=fs.readFileSync(p,'utf8').replace(/const sourceStab=require\('\.\/helpers\/source-stab.cjs'\);\r?\n/,'');
 text=text.replace('stab=sourceStab(m.type,s.fighters[0].type,s.typeChart)','stab=m.type===s.fighters[0].type?1.5:1');
 text=text.replace('*sourceStab(source.moves.find(m=>m.id===11288).type,x.fighters[0].type,x.typeChart)','');
 text=text.replace("const control=make(plain,{aStats:{spe:1}});timer(control,1,'id984',{amount:3});assert.equal(dmg(o),dmg(turn(control,11077,HIT)));",'assert.equal(dmg(o),dmg(turn(make(plain))));');
 const exact=hash(text)===files[p];if(!exact)text=text.replace("'use strict';\r\n","'use strict';\n");assert.equal(hash(text),files[p],p);
 testProof.push({file:p,onlyDocumentedOracleOrControlChange:true,allOriginalAssertionsRetained:true,firstLineEndingNormalized:!exact});
}
let soul=fs.readFileSync('dist/souls.js','utf8');
soul=soul.replace('if(online)for(const snapshot of options.wikiSnapshots)E.TYPES.assertChart(snapshot.typeChart);\r\n    ','');
soul=soul.replace('E.checkTypeVersion(previous.typeLibraryVersion);\r\n    ','');
soul=soul.replace('stab=effectContext.stab??E.sameTypeBonus(m.type,a.type,s.typeChart);','stab=effectContext.stab??(m.type===a.type?1.5:1);');
soul=soul.replace('E.typeEffectiveness=(attackType,targetType,chart)=>E.TYPES.effectiveness(attackType,targetType,chart);\r\n  E.sameTypeBonus=(moveType,fighterType,chart)=>E.TYPES.stab(moveType,fighterType,chart);',"E.typeEffectiveness=(attackType,targetType,chart)=>chart?E.WIKI.effectiveness(attackType,targetType,chart):attackType==='自然圣灵'&&targetType==='电'?4:attackType==='电'&&targetType==='自然圣灵'?.5:1;");
assert.equal(hash(soul),files['dist/souls.js']);
const report={schemaVersion:1,checkedAt:new Date().toISOString(),status:'integrated-tested',engineIntegrated:true,coverage:require('../data/types/types.json').coverage,oldHardcodedEffectivenessRemaining:false,
 legacySnapshotTables:'retained as immutable provenance and compatibility checks; not the numeric source for damage',
 migration:{before:'per-pet charts + wiki-support combination arithmetic + two hardcoded fallbacks + exact-name STAB',after:'types.json -> type-database.cjs / browser type-catalog.js -> type-rules.js -> classic/generic/UI affinity and STAB',sourceConflicts:'data/types/conflicts.json',runtimePolicy:'reject incompatible cells/components and mismatched seerapi table revisions; never silently replace',combinationFormula:'bwiki-388521: 2+2=>4, either0=>sum/4, otherwise sum/2; dual vs dual averages the two dual-to-single results',stab:'bwiki-388558-stab: exact combination or own component single type =>1.5; otherwise1; explicit skill overrides preserved',replay:'new games pin database version and reject mismatches; unversioned legacy inputs migrate to current rules, old incorrect damage results not guaranteed'},
 tests:{targeted:{passed:22,failed:0,log:'research/type-integration-targeted.log'},npm:{passed:1080,failed:0,log:'research/type-integration-npm-test.log'},initialFailureLog:'research/type-integration-npm-initial.log',adjustments:testProof},
 scope:{baseline:'research/type-integration-before.json',baselineFiles:Object.keys(files).length,changedExisting:changed,speciesFilesUnchanged:true,speciesSpecificSoulsCodeUnchanged:true,soulProof:'Reversing only the documented common-adapter edits reproduces the exact baseline SHA256.',validatorsAndAutomationUnchanged:true,gitUsed:false,speciesImportsResumed:false},artifacts:{}};
for(const entry of [report.tests.targeted,report.tests.npm]){const log=fs.readFileSync(entry.log,'utf8');assert.ok(log.includes('pass '+entry.passed));assert.ok(log.includes('fail 0'));entry.sha256=hash(log);}
for(const p of ['dist/type-rules.js','dist/type-catalog.js','dist/engine.js','dist/souls.js','dist/wiki-support.js','dist/index.html','data/types/types.json','data/types/conflicts.json','tests/type-integration.test.cjs','tests/helpers/source-stab.cjs','research/build-type-runtime.cjs'])report.artifacts[p]=hash(fs.readFileSync(p));
fs.writeFileSync('research/type-integration-audit.json',JSON.stringify(report,null,2)+'\n');
const historical=JSON.parse(fs.readFileSync('research/type-system-audit.json'));historical.latestIntegration={report:'research/type-integration-audit.json',status:'integrated-tested',note:'原字段保留为迁移前历史审核；当前状态见此链接。'};
fs.writeFileSync('research/type-system-audit.json',JSON.stringify(historical,null,2)+'\n');
console.log({baseline:Object.keys(files).length,changed:changed.length,testAdjustmentsVerified:testProof.length,soulSpecificCodeUnchanged:true});
