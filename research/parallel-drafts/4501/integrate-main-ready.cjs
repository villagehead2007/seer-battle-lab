'use strict';
// REVIEW-ONLY DELIVERY: parent executes explicitly after the current formal gate ends.
// This integrates code/tests, never deploys, runs tests, changes the queue, or certifies.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),count=(s,n)=>n?s.split(n).length-1:0,sha=s=>crypto.createHash('sha256').update(s).digest('hex');
assert.equal(path.resolve(process.cwd()),root,'Run from the project root');
const spec=JSON.parse(read('research/parallel-drafts/4501/implementation-replacements.json')).patches,migrations=JSON.parse(read('research/parallel-drafts/4501/baseline-migrations.json'));
assert.equal(spec.length,13);assert.equal(migrations.length,9);
const outputs=new Map(),patchReport=[];
for(const [i,p] of spec.entries()){
  const original=read(p.file),text=outputs.get(p.file)??original;
  if(i<5){assert.equal(count(original,p.needle),0,'Dependency must already be integrated: '+p.why);if(p.insert)assert.equal(count(original,p.insert),1,'Dependency replacement missing: '+p.why);patchReport.push({index:i+1,status:'already-integrated',file:p.file,needleCount:0,insertCount:p.insert?count(original,p.insert):null});continue;}
  assert.equal(count(original,p.needle),1,'Current original anchor not unique: '+p.why);
  assert.equal(count(text,p.needle),1,'Sequential anchor conflict: '+p.why);
  outputs.set(p.file,text.replace(p.needle,p.insert));patchReport.push({index:i+1,status:'prepared',file:p.file,needleCount:1});
}
const baselineFile='tests/deployed-4501-independent.test.cjs',oldBaseline=read(baselineFile),oldNames=[...oldBaseline.matchAll(/test\('([^']+)'/g)].map(m=>m[1]);
assert.equal(oldNames.length,20);let baseline=oldBaseline;
for(const [i,m]of migrations.entries()){assert.equal(count(baseline,m.before),1,'Baseline migration '+(i+1));baseline=baseline.replace(m.before,m.after);}
const skipped='if(e.id===1827)continue;';assert.equal(count(baseline,skipped),1);baseline=baseline.replace(skipped,'');
const titles=new Map([
 [0,'4501全部22真实技能基础物特/PP/0PP/控制未用，原第五36568及1715hash真实，1827真实实例接受严格编译'],
 [12,'4501 1845实际使用时目标缺失HP快照每2取整固定，保1不截断基数、满HP与免攻零补偿，多段整招一次；1827真实实例接入'],
 [13,'4501 1486真实无盾50%两分支/有盾100%并倍伤，先制不参与倍率，整回合共享一次概率'],
 [15,'4501全部真实效果控制未使用不扣PP/无敌HP载荷，含1827完整来源与真实实现'],
 [17,'4501 1845实际使用前目标缺失100HP快照附50固定；1662保1实际0触发等量回复'],
 [19,'4501精确1617命中零伤反制、MISS不触发、整回合一次；保1完整正伤实际0仍反制']
]);
for(const [index,title]of titles){const before="test('"+oldNames[index]+"'";assert.equal(count(baseline,before),1);baseline=baseline.replace(before,"test('"+title+"'");}
const newNames=[...baseline.matchAll(/test\('([^']+)'/g)].map(m=>m[1]);assert.equal(newNames.length,20);assert.equal(newNames.filter((x,i)=>x!==oldNames[i]).length,6);
outputs.set(baselineFile,baseline);
let helper=read('research/parallel-drafts/4501/draft-helper.cjs');
assert.equal(count(helper,"require('./load-draft-engine.cjs')"),1);helper=helper.replace("require('./load-draft-engine.cjs')","require('../../dist/engine.js')");
assert.equal(count(helper,"require('./draft-snapshot.json')"),1);helper=helper.replace("require('./draft-snapshot.json')","require('../../local-species.cjs').species(4501)");
assert.ok(helper.includes('unknown=[]'));assert.ok(helper.includes('b.id=920688'));
outputs.set('tests/helpers/4501-battle.cjs',helper);
let wrapper=read('research/parallel-drafts/4501/draft-tests.cjs');assert.equal([...wrapper.matchAll(/test\('/g)].length,6);
wrapper=wrapper.replace("require('./draft-helper.cjs')","require('./helpers/4501-battle.cjs')").replace("require('../../../research/4384-reviewed-snapshot.json')","require('../research/4384-reviewed-snapshot.json')");
const sourceNeedle="const source=require('./draft-snapshot.json'),enemy=structuredClone(source);";
assert.equal(count(wrapper,sourceNeedle),1);
wrapper=wrapper.replace(sourceNeedle,"const store=require('../local-species.cjs'),source=store.species(4501),enemy=structuredClone(source);assert.ok(store.search('4501').results.some(x=>x.id===4501));assert.equal(source.id,4501);assert.equal(source.moves.length,22);assert.equal(E.SOULS.registry[1715].sourceHash,'f91439c9');assert.equal(source.souls[0].hash,E.SOULS.registry[1715].sourceHash);");
assert.ok(wrapper.includes('enemy.id=920751'));assert.ok(wrapper.includes('assert.equal(b.fighters[0].soulId,1715)'));
assert.ok(!wrapper.includes('load-draft-engine'));assert.ok(!wrapper.includes('draft-snapshot'));assert.ok(!wrapper.includes('../../../'));
wrapper+="\nrequire('./deployed-4501-independent.test.cjs');\n";
outputs.set('tests/deployed-4501.test.cjs',wrapper);
let policy=read('research/4501-scope-policy-tests.draft.cjs');assert.equal([...policy.matchAll(/test\('/g)].length,3);assert.ok(policy.includes("require('../completion-policy.cjs')"));
outputs.set('tests/deployed-4501-scope-policy.test.cjs',policy);
// Compile prepared files without executing their bodies or requiring production modules.
for(const [file,text]of outputs)new Function('require','module','exports','__filename','__dirname',text);
const report={at:new Date().toISOString(),patchReport,baselineMigrations:9,baselineTitleMapping:oldNames.map((before,i)=>({index:i+1,before,after:newNames[i]})),baselineCount:20,wrapperTests:6,policyTests:3,preflightSyntax:'passed',originalHashes:Object.fromEntries([...new Set(spec.map(x=>x.file).concat([baselineFile,'tests/helpers/4501-battle.cjs']))].map(file=>[file,sha(read(file))])),formalAcceptance:false};
// prepare-4501-formal.cjs reads the first matching directory and this exact filename.
assert.equal(fs.readdirSync(path.join(root,'research')).filter(x=>x.startsWith('4501-before-integration-')).length,0,'Existing backup: parent must reconcile prepare script selection before rerun');
const backup='research/4501-before-integration-'+report.at.replace(/[:.]/g,'-');
const extra=['SINGLE-STAGE-REVIEWS.json','research/FIXED50-ANSWER-USER-CONFIRMATIONS.json','research/4501-user-confirmed-rules.json','data/species/4501.json'];
const backupFiles=[...new Set([...outputs.keys(),...extra])];
// All assertions/prepared syntax pass before this first filesystem mutation.
fs.mkdirSync(path.join(root,backup));
for(const file of backupFiles)if(fs.existsSync(path.join(root,file)))fs.copyFileSync(path.join(root,file),path.join(root,backup,file.replace(/[\\/]/g,'__')));
fs.writeFileSync(path.join(root,backup,'INTEGRATION-MANIFEST.json'),JSON.stringify({...report,backup,backupFiles:backupFiles.map(file=>({file,existed:fs.existsSync(path.join(root,file))}))},null,2)+'\n');
for(const [file,text]of outputs)fs.writeFileSync(path.join(root,file),text);
fs.writeFileSync(path.join(root,'research/4501-main-integration-report.json'),JSON.stringify({...report,backup,outputs:[...outputs.keys()]},null,2)+'\n');
console.log(JSON.stringify({integrated:true,backup,patches:8,dependenciesRetained:5,baselineTests:20,extraTests:6,policyTests:3,formalAcceptance:false}));
