'use strict';
// Development-only evidence packaging. A reviewed per-species plan is required;
// this script never marks a species accepted or advances the formal cursor.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../../..');process.chdir(root);
const P=require(path.join(root,'completion-policy.cjs'));
const plan=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),id=plan.id;
const archive=path.relative(root,__dirname).replaceAll('\\','/');
const authorization=JSON.parse(fs.readFileSync(path.join(__dirname,'USER-BATCH-VALIDATION-AUTHORIZATION-2026-10-31.json')));
assert(authorization.ids.includes(id));assert(plan.reviewed===true&&plan.rationale);
const snapshot=JSON.parse(fs.readFileSync(`research/BATCH-4676-NEXT50/${id}/snapshot.json`));
const audit=JSON.parse(fs.readFileSync(`research/BATCH-4676-NEXT50/${id}/INSTANCE-AUDIT.json`));
const store=require(path.join(root,'local-species.cjs'));
let local;
if(fs.existsSync(`data/species/${id}.json`))local=store.species(id);
else {const result=store.save(snapshot);assert(result.saved,JSON.stringify(result));local=result.snapshot;}
const names=text=>[...text.matchAll(/test\('([^']+)'/g)].map(m=>m[1]);
const oldNames=names(fs.readFileSync(plan.oldTestFile,'utf8'));
const newNames=names(fs.readFileSync(plan.testFile,'utf8'));
const addedNames=plan.addedTestNames??[];assert(Array.isArray(addedNames)&&addedNames.every(n=>typeof n==='string'&&n.length>0));assert.equal(newNames.length,oldNames.length+addedNames.length,'Every appended test must be explicitly declared; removed tests are forbidden');assert.deepEqual(newNames.slice(oldNames.length),addedNames,'Only explicitly declared appended tests are allowed');
const titleMap=new Map(oldNames.map((name,i)=>[name,newNames[i]]));
for(const [before,after] of Object.entries(plan.titleAliases??{})){assert(audit.items.some(x=>x.tests.some(t=>t.file===plan.testFile&&t.name===before)),'Alias must name a preserved audit reference');assert(newNames.includes(after),'Alias destination must exist in the reviewed current tests');titleMap.set(before,after);}
const titleMaps=new Map([[plan.testFile,titleMap]]);
for(const mapping of plan.additionalTitleMappings??[]){
  const before=names(fs.readFileSync(mapping.oldTestFile,'utf8')),after=names(fs.readFileSync(mapping.testFile,'utf8'));
  assert.equal(before.length,after.length,'Additional title mapping requires equal test counts');
  titleMaps.set(mapping.testFile,new Map(before.map((name,i)=>[name,after[i]])));
}
function evidence(ref){
  const name=titleMaps.get(ref.file)?.get(ref.name)||ref.name;
  const text=fs.readFileSync(ref.file,'utf8'),start=text.indexOf("test('"+name+"'");
  assert(start>=0,`Missing test ${ref.file} :: ${name}`);
  const next=text.indexOf("\ntest('",start+1),body=text.slice(start,next<0?undefined:next);
  const checks=body.match(/assert\.[^;\n]+/g);assert(checks?.length,`No assertions: ${name}`);
  return {file:ref.file,name,assertion:name+'；实际状态断言：'+checks.join('；')};
}
const reviews=JSON.parse(fs.readFileSync('SINGLE-STAGE-REVIEWS.json'));
const original=P.inventory(snapshot),inventory=P.inventory(local),entries={};
for(const item of inventory){
  assert.deepEqual(item.raw,original.find(x=>x.key===item.key)?.raw,'Source raw data changed');
  const a=audit.items.find(x=>x.key===item.key);assert(a);
  const decision=plan.decisions?.[item.key];
  if(/deferred|mixed/.test(a.status??'')||!a.tests.length)assert(decision,`Explicit scope review required: ${item.key}`);
  if(item.kind==='soul'&&(require(path.join(root,'dist/engine.js')).SOULS.registry[item.raw.id].deferred??[]).length)assert(decision,`Soul deferred branches require explicit review: ${item.key}`);
  const extra=plan.extraTests?.[item.key]??plan.extraTests?.[item.kind]??[];
  const allRefs=[...a.tests,...extra].map(evidence);
  // Preserve schema-only checks separately; they cannot serve as state witnesses.
  const structural=allRefs.filter(ref=>(plan.structuralTestNames??[]).includes(ref.name));
  const refs=allRefs.filter(ref=>!structural.includes(ref));
  const r={sourceDigest:item.sourceDigest,scope:'single',reviewedBy:'Codex explicit answer and source review',reviewedAt:new Date().toISOString(),rationale:plan.rationale,
    singleBehavior:item.kind==='soul'?plan.soulBehavior:item.kind==='move'?'真实原魂印与完整技能组合的基础消耗、HP变化及技能边界；逐实例另行验证。':item.raw.instance.description,
    implementation:['dist/souls.js','dist/range-souls.js','dist/range-effects.js','dist/effect-registry.js'],
    tests:{success:refs,failure:refs,boundary:refs,interaction:refs},structuralTests:structural,userConfirmation:archive+'/USER-CONFIRMATIONS.json',formalAcceptance:'pending-final50-full-regression',...decision};
  if(r.scope==='multiplayer')delete r.singleBehavior;
  const failures=P.checkReview(item,r,root);assert.equal(failures.length,0,failures.join('\n'));
  entries[item.key]=r;
}
const originalBackup=path.join(__dirname,`${id}-reviews-before.json`),backup=fs.existsSync(originalBackup)?path.join(__dirname,`${id}-reviews-before-${new Date().toISOString().replace(/[:.]/g,'-')}.json`):originalBackup;
fs.writeFileSync(backup,JSON.stringify(Object.fromEntries(Object.entries(reviews.entries).filter(([k])=>k.startsWith(id+':'))),null,2)+'\n',{flag:'wx'});
Object.assign(reviews.entries,entries);fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');
const coverage=P.reviewCoverage(local,reviews);console.log(JSON.stringify({id,total:coverage.total,missing:coverage.missing.length,stale:coverage.stale.length,accepted:false}));
