'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {inventory,checkReview,validateCoverage,reviewCoverage}=require('../completion-policy.cjs');
const {build}=require('../research/build-multiplayer-todo.cjs');
test('3883 两个出战实例仅精确来源和授权允许延期，变更或缺授权拒绝',t=>{
 const root=path.resolve(__dirname,'..'),s=require('../local-species.cjs').species(3883),reviews=require('../SINGLE-STAGE-REVIEWS.json');
 for(const entry of inventory(s).filter(x=>x.raw.instance?.id===840)){
  const review=reviews.entries[entry.key];assert.deepEqual(checkReview(entry,review,root),[]);
  for(const mutate of [e=>e.key='3886:skill:33388:2',e=>e.raw.index++,e=>e.raw.instance.args[0]=4,e=>e.raw.instance.id=841,e=>e.raw.metadata.revision='changed',e=>e.source.skillRevision='changed',e=>e.source.snapshot.revision='changed',e=>e.sourceDigest='changed']){const e=structuredClone(entry);mutate(e);const matched={...review,sourceDigest:e.sourceDigest};assert.ok(checkReview(e,matched,root).some(x=>x.includes('dependencyEvidence')));}
  const altered=structuredClone(review);altered.dependencyEvidence[0].quote='下只精灵出战时';assert.ok(checkReview(entry,altered,root).some(x=>x.includes('dependencyEvidence')));
  const f=fixture(t);assert.ok(checkReview(entry,review,f.root).some(x=>x.includes('dependencyEvidence')));
  fs.mkdirSync(path.join(f.root,'research'));const a=JSON.parse(fs.readFileSync(path.join(root,review.userConfirmation),'utf8'));a.dependencyCompatibilityAuthorization.answer='未授权';fs.writeFileSync(path.join(f.root,review.userConfirmation),JSON.stringify(a));assert.ok(checkReview(entry,review,f.root).some(x=>x.includes('dependencyEvidence')));
 }
});
function fixture(t) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'seer-policy-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.mkdirSync(path.join(root,'tests'));
  fs.writeFileSync(path.join(root,'implementation.js'),'module.exports = 1;');
  fs.writeFileSync(path.join(root,'tests','deployed-1.test.cjs'),"test('HP changes',()=>{const fighter={hp:100};fighter.hp-=10;assert.equal(fighter.hp,90);});");
  const snapshot={id:1,name:'policy fixture',source:{provider:'seerapi',url:'https://api.seerapi.com/v1/pet/1',revision:'test',loadedAt:'2026-10-12T00:00:00Z'},souls:[],effects:[{id:1331,argsNum:2,template:'fixture',revision:'test'}],moves:[{id:2,revision:'test',hash:'test',description:'mixed fixture',effectInstances:[{id:1331,args:[6,2]},{id:1331,args:[6,3]}],effectIds:[1331,1331]}]};
  const tests=Object.fromEntries(['success','failure','boundary','interaction'].map(x=>[x,[{file:'tests/deployed-1.test.cjs',name:'HP changes',assertion:'HP before/after and expected delta'}]]));
  const entries=Object.fromEntries(inventory(snapshot).map(e=>[e.key,{sourceDigest:e.sourceDigest,scope:e.kind==='move'?'single':'mixed',reviewedBy:'test reviewer',reviewedAt:'2026-10-12',rationale:'explicit branch reasoning',singleBehavior:'own state changes',implementation:['implementation.js'],tests,deferredBehavior:'next opponent entry',trigger:'defeat then replacement',futureMechanisms:['replacement event']}])) ;
  return {root,snapshot,reviews:{schemaVersion:1,entries}};
}

test('伙伴羁绊觉醒自身强化不得借延期或虚构队伍依赖绕过单精灵审核',t=>{
  for(const word of ['伙伴','羁绊','觉醒']){const f=fixture(t);f.snapshot.moves[0].description=word+'强化自身攻击+1';const e=inventory(f.snapshot)[1],r=f.reviews.entries[e.key];r.sourceDigest=e.sourceDigest;
    for(const scope of ['mixed','multiplayer']){r.scope=scope;assert.ok(checkReview(e,r,f.root).some(x=>x.includes('dependencyEvidence')));}
    r.dependencyEvidence=[{kind:'team-members',quote:'队伍中有伙伴'}];assert.ok(checkReview(e,r,f.root).some(x=>x.includes('dependencyEvidence')));
    r.scope='single';assert.deepEqual(checkReview(e,r,f.root),[]);delete r.tests.failure;assert.ok(checkReview(e,r,f.root).some(x=>x.includes('failure state assertion')));
  }
});
test('伙伴混合词条仅有来源明确的队伍依赖才能延期且仍验证自身分支',t=>{
  const f=fixture(t);f.snapshot.moves[0].description='伙伴强化自身攻击+1；下一只精灵出场时全属性+1';const e=inventory(f.snapshot)[1],r=f.reviews.entries[e.key];r.sourceDigest=e.sourceDigest;r.dependencyEvidence=[{kind:'next-entry',quote:'下一只精灵出场时全属性+1'}];assert.deepEqual(checkReview(e,r,f.root),[]);
  r.dependencyEvidence[0].kind='switch';assert.ok(checkReview(e,r,f.root).some(x=>x.includes('dependencyEvidence')));
  r.dependencyEvidence[0].kind='next-entry';delete r.tests.success;assert.ok(checkReview(e,r,f.root).some(x=>x.includes('success state assertion')));
});
test('仅在延期说明中出现伙伴系统也不能豁免，明确无需队伍的来源不能充当依赖',t=>{
  const f=fixture(t),e=inventory(f.snapshot)[1],r=f.reviews.entries[e.key];r.futureMechanisms=['伙伴系统'];assert.ok(checkReview(e,r,f.root).some(x=>x.includes('dependencyEvidence')));
  f.snapshot.moves[0].description='羁绊强化不需要队伍成员';const next=inventory(f.snapshot)[1];r.sourceDigest=next.sourceDigest;r.dependencyEvidence=[{kind:'team-members',quote:'羁绊强化不需要队伍成员'}];assert.ok(checkReview(next,r,f.root).some(x=>x.includes('dependencyEvidence')));
});
test('single completion accepts reviewed mixed branches, full completion rejects their deferred branches',t=>{
  const f=fixture(t),todo=build([f.snapshot],f.reviews);
  assert.deepEqual(validateCoverage(f.snapshot,f.reviews,todo,f.root),[]);
  assert.ok(validateCoverage(f.snapshot,f.reviews,todo,f.root,true).some(x=>x.includes('remains deferred')));
});
test('legacy deferred registration cannot grant a semantic exemption',t=>{
  const f=fixture(t),todo=build([f.snapshot],{entries:{}});
  assert.equal(todo.records.length,2);
  assert.ok(todo.records.every(x=>x.reviewStatus==='needs-review'));
  assert.equal(validateCoverage(f.snapshot,{entries:{}},todo,f.root).length,inventory(f.snapshot).length);
  assert.ok(validateCoverage(f.snapshot,{entries:{}},todo,f.root).every(x=>x.includes('missing or stale')));
});
test('mixed branches require success, failure, boundary and interaction state evidence',t=>{
  const f=fixture(t),entry=inventory(f.snapshot)[1],review=f.reviews.entries[entry.key];
  delete review.tests.failure;
  assert.ok(checkReview(entry,review,f.root).some(x=>x.includes('failure state assertion')));
  review.tests.failure=[{file:'tests/deployed-1.test.cjs',name:'absent test',assertion:'HP'}];
  assert.ok(checkReview(entry,review,f.root).some(x=>x.includes('named assertion test missing')));
});
test('repeated effect instances retain separate keys, params and source digests',t=>{
  const f=fixture(t),todo=build([f.snapshot],f.reviews);
  assert.notEqual(todo.records[0].key,todo.records[1].key);
  assert.deepEqual(todo.records.map(x=>x.raw.instance.args),[[6,2],[6,3]]);
  const entry=inventory(f.snapshot)[1];f.snapshot.moves[0].effectInstances[0].args[1]=9;
  assert.ok(checkReview(inventory(f.snapshot)[1],f.reviews.entries[entry.key],f.root).some(x=>x.includes('stale')));
});
test('missing, duplicate and stale multiplayer records reject completion',t=>{
  const f=fixture(t),todo=build([f.snapshot],f.reviews);
  for(const records of [[],[...todo.records,todo.records[0]],todo.records.map(x=>({...x,sourceDigest:'stale'}))]) {
    assert.ok(validateCoverage(f.snapshot,f.reviews,{records},f.root).some(x=>x.includes('exactly one current')));
  }
});
test('deferred classification needs original trigger and required future mechanisms',t=>{
  const f=fixture(t),entry=inventory(f.snapshot)[1],review=f.reviews.entries[entry.key];
  review.scope='multiplayer';review.trigger='';review.futureMechanisms=[];
  assert.ok(checkReview(entry,review,f.root).some(x=>x.includes('trigger')));
});
test('registry soul deferrals survive when the snapshot lacks deployment annotations',()=>{
  const s={id:1,name:'test',source:{provider:'seerapi',revision:'x'},souls:[{id:372,description:'raw source',hash:'x',args:[]}],moves:[],effects:[]};
  const todo=build([s]);assert.equal(todo.records[0].kind,'soul');assert.equal(todo.records[0].raw.description,'raw source');
});

test('every soul, skill base and repeated instance needs an explicit review, even with an empty registry',t=>{
  const f=fixture(t);
  f.snapshot.souls=[{id:875,hash:'source-hash',description:'source description',args:[]}];
  const entries=inventory(f.snapshot),coverage=reviewCoverage(f.snapshot,{entries:{}});
  assert.equal(coverage.total,4);assert.equal(coverage.missing.length,4);
  const failures=validateCoverage(f.snapshot,{entries:{}},{records:[]},f.root);
  for(const entry of entries)assert.ok(failures.some(x=>x.startsWith(entry.key)&&x.includes('missing or stale')),entry.key);
  assert.equal(failures.filter(x=>x.includes('effectId=1331')).length,2);
});

test('a reviewed generated row cannot synthesize a missing semantic review',t=>{
  const f=fixture(t),todo=build([f.snapshot],f.reviews),key='1:skill:2:0';
  delete f.reviews.entries[key];
  assert.equal(todo.records[0].reviewStatus,'reviewed');
  assert.deepEqual(reviewCoverage(f.snapshot,f.reviews).missing.map(x=>x.key),[key]);
  assert.ok(validateCoverage(f.snapshot,f.reviews,todo,f.root).some(x=>x.startsWith(key)&&x.includes('missing or stale')));
});

test('source and parameters are mandatory even when fresh reviews and deferred records exist',t=>{
  const mutations=[
    [s=>delete s.source.url,'source URL'],
    [s=>delete s.source.revision,'source URL'],
    [s=>delete s.moves[0].hash,'skill source'],
    [s=>delete s.effects[0].revision,'effect source'],
    [s=>delete s.effects[0].template,'effect source'],
    [s=>delete s.effects[0].argsNum,'instance parameters'],
    [s=>delete s.moves[0].effectInstances[0].args,'instance parameters'],
    [s=>s.moves[0].effectInstances[0].args=[6],'instance parameters'],
    [s=>s.moves[0].effectInstances[0].args=[6,NaN],'instance parameters'],
    [s=>s.moves[0].effectInstances.pop(),'ordered instances'],
    [s=>s.moves[0].effectIds.pop(),'ordered instances']
  ];
  for(const [mutate,expected] of mutations){
    const f=fixture(t);mutate(f.snapshot);
    for(const entry of inventory(f.snapshot))f.reviews.entries[entry.key].sourceDigest=entry.sourceDigest;
    assert.ok(validateCoverage(f.snapshot,f.reviews,build([f.snapshot],f.reviews),f.root).some(x=>x.includes(expected)),expected);
  }
});

test('missing soul source hash or argument array rejects completion',t=>{
  const f=fixture(t);f.snapshot.souls=[{id:875,description:'source description'}];
  const failures=validateCoverage(f.snapshot,f.reviews,{records:[]},f.root);
  assert.ok(failures.some(x=>x.includes('soul source hash')));
  assert.ok(failures.some(x=>x.includes('soul instance parameters')));
});

test('explicit zero-argument effects are valid but absent argument arrays are not',t=>{
  const f=fixture(t);f.snapshot.effects[0].argsNum=0;
  f.snapshot.moves[0].effectInstances.forEach(x=>x.args=[]);
  for(const entry of inventory(f.snapshot))f.reviews.entries[entry.key].sourceDigest=entry.sourceDigest;
  assert.deepEqual(validateCoverage(f.snapshot,f.reviews,build([f.snapshot],f.reviews),f.root),[]);
  delete f.snapshot.moves[0].effectInstances[0].args;
  assert.ok(validateCoverage(f.snapshot,f.reviews,build([f.snapshot],f.reviews),f.root).some(x=>x.includes('instance parameters')));
});

test('multiplayer classification cannot exempt declared single behavior or its missing branch witnesses',t=>{
  const f=fixture(t),entry=inventory(f.snapshot)[1],review=f.reviews.entries[entry.key];
  review.scope='multiplayer';delete review.tests.failure;
  const failures=checkReview(entry,review,f.root);
  assert.ok(failures.some(x=>x.includes('mixed scope required')));
  assert.ok(failures.some(x=>x.includes('failure state assertion')));
});

test('assertions in other tests, comments, skipped tests or literal constants are not named state witnesses',t=>{
  const f=fixture(t),entry=inventory(f.snapshot)[1],review=f.reviews.entries[entry.key];
  for(const content of [
    "test('HP changes',()=>{});test('other',()=>assert.equal(fighter.hp,90));",
    "// test('HP changes',()=>assert.equal(fighter.hp,90));",
    "test('HP changes',()=>{const label='assert.equal(fighter.hp,90)';});",
    "test('HP changes',()=>{const pattern=/assert.equal(fighter.hp,90)/;});",
    "test('HP changes',()=>assert.equal(1,1));",
    "test('HP changes',{skip:true},()=>assert.equal(fighter.hp,90));",
    "test.skip('HP changes',()=>assert.equal(fighter.hp,90));"
  ]){
    fs.writeFileSync(path.join(f.root,'tests','deployed-1.test.cjs'),content);
    assert.ok(checkReview(entry,review,f.root).some(x=>x.includes('named assertion test missing')),content);
  }
});

test('division, comments and object literals do not hide the named state assertion',t=>{
  const f=fixture(t),entry=inventory(f.snapshot)[1],review=f.reviews.entries[entry.key];
  fs.writeFileSync(path.join(f.root,'tests','deployed-1.test.cjs'),"test('HP changes',()=>{const fighter={hp:100};fighter.hp/=2;/* } */assert.equal(fighter.hp,100/2);});");
  assert.deepEqual(checkReview(entry,review,f.root),[]);
});

test('placeholder assertion descriptions and empty branch lists cannot certify coverage',t=>{
  const f=fixture(t),entry=inventory(f.snapshot)[1],review=f.reviews.entries[entry.key];
  review.tests.success[0].assertion='success state';review.tests.boundary=[];
  const failures=checkReview(entry,review,f.root);
  assert.ok(failures.some(x=>x.includes('specific state assertion required')));
  assert.ok(failures.some(x=>x.includes('boundary state assertion')));
});

test('deferred evidence must preserve original source, raw parameters, scope and trigger',t=>{
  const f=fixture(t),todo=build([f.snapshot],f.reviews);
  for(const mutate of [row=>delete row.source.url,row=>row.raw.instance.args=[9,9],row=>row.trigger='',row=>row.scope='single']){
    const changed=structuredClone(todo);mutate(changed.records[0]);
    assert.ok(validateCoverage(f.snapshot,f.reviews,changed,f.root).some(x=>x.includes('incomplete or inconsistent')));
  }
});

test('stale reviews are counted separately from absent reviews',t=>{
  const f=fixture(t);delete f.reviews.entries['1:skill:2:0'];f.reviews.entries['1:skill:2:1'].sourceDigest='old';
  const coverage=reviewCoverage(f.snapshot,f.reviews);
  assert.deepEqual(coverage.missing.map(x=>x.key),['1:skill:2:0']);
  assert.deepEqual(coverage.stale.map(x=>x.key),['1:skill:2:1']);
});
