'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),store=require('../local-species.cjs');
const source=require('../data/species/3613.json').snapshot;
const pet=require('../research/seerapi-cache/3613/pet-3613.json');
const mode=soulId=>({...structuredClone(source),selectedSoulId:soulId});

test('3613 技能版本保留31招原始第五标记、27招原版与30招觉醒覆盖',()=>{
  assert.deepEqual(E.WIKI.skillVersionIssues(source),[]);
  assert.deepEqual(source.moves.map(m=>[m.id,m.fifth,m.advanced]),pet.skill.map(x=>[x.skill.id,x.is_fifth,x.is_advanced]));
  assert.deepEqual(source.moves.filter(m=>m.fifth).map(m=>m.id),[32045,37195]);
  assert.equal(E.WIKI.availableMoves(mode(909)).length,27);
  assert.equal(E.WIKI.availableMoves(mode(1825)).length,30);
  for(const s of E.WIKI.versionSnapshots(source)){
    const group=source.skillVersions.find(g=>g.soulId===s.selectedSoulId),raw=require('../research/seerapi-cache/3613/soulmark-'+group.soulId+'.json');
    assert.equal(group.soulHash,raw.hash);
    if(group.id==='awakened'){assert.equal(raw.from.id,909);assert.equal(raw.advance.id,source.advance.id);assert.deepEqual(source.moves.filter(m=>m.advanced).map(m=>m.id),source.advance.raw.skill.map(x=>x.id));}
    const ids=E.WIKI.defaultMoves(s);
    assert.equal(ids.length,5);assert.equal(ids.filter(id=>s.moves.find(m=>m.id===id).fifth).length,1);
    assert.ok(ids.includes(s.selectedSoulId===909?32045:37195));
    assert.equal(E.WIKI.assess(s,ids).supported,true);
  }
  assert.deepEqual(store.species(3613),source);
});

test('3613 跨版本第五和觉醒追加技能不能注入原版战斗',()=>{
  const original=mode(909),awakened=mode(1825),other=require('../data/species/3592.json').snapshot;
  for(const [s,invalid] of [[original,37195],[awakened,32045],[original,28646],[original,37193],[original,37194]]){
    const ids=E.WIKI.defaultMoves(s),m=s.moves.find(m=>m.id===invalid);
    ids[ids.findIndex(id=>s.moves.find(x=>x.id===id).fifth===m.fifth)]=invalid;
    assert.equal(E.WIKI.assess(s,ids).supported,false);
    assert.throws(()=>E.createBattle({wikiSnapshots:[s,other],wikiLoadouts:[ids,E.WIKI.defaultMoves(other)]}),/当前版本/);
  }
});

test('3613 每版仍拒绝无第五、双第五、重复技能和未知魂印',()=>{
  for(const s of E.WIKI.versionSnapshots(source)){
    const normal=E.WIKI.availableMoves(s).filter(m=>!m.fifth).slice(0,5).map(m=>m.id);
    const dual=[32045,37195,...normal.slice(0,3)],duplicate=E.WIKI.defaultMoves(s);duplicate[4]=duplicate[3];
    for(const ids of [normal,dual,duplicate])assert.equal(E.WIKI.assess(s,ids).supported,false);
  }
  assert.equal(E.WIKI.assess(mode(999999)).supported,false);
});

test('3613 缺失分组拒绝认证，遗漏技能重复分组混装第五和伪造来源拒绝部署',()=>{
  const missing=structuredClone(source);delete missing.skillVersions;
  assert.ok(E.WIKI.skillVersionIssues(missing,true).length);
  const noFifth=structuredClone(missing);noFifth.moves=noFifth.moves.filter(m=>!m.fifth);
  assert.ok(E.WIKI.skillVersionIssues(noFifth,true).length);
  const mutations=[
    s=>s.skillVersions=[],
    s=>s.skillVersions[0].moveIds.pop(),
    s=>s.skillVersions.forEach(g=>g.moveIds=g.moveIds.filter(id=>id!==10127)),
    s=>s.skillVersions[1].moveIds=s.skillVersions[1].moveIds.filter(id=>id!==37193),
    s=>s.skillVersions[0].moveIds.push(37195),
    s=>s.skillVersions[0].moveIds.push(10127),
    s=>s.skillVersions[1]=structuredClone(s.skillVersions[0]),
    s=>s.skillVersions[0].soulId=1825,
    s=>s.skillVersions[1].soulHash='incorrect',
    s=>s.skillVersions[1].source.revision='incorrect',
    s=>s.advance.raw.pet.id=999,
    s=>s.advance.raw.skill.push({id:99999}),
    s=>s.moves.find(m=>m.id===37195).fifth=false,
    s=>s.moves.find(m=>m.id===37195).advanced=false
  ];
  for(const mutate of mutations){const s=structuredClone(source);mutate(s);assert.ok(E.WIKI.skillVersionIssues(s).length);assert.ok(store.issues(s).length);}
});

test('3613 双版本完整性仍检查非当前版本的全部技能及效果',()=>{
  const s=mode(909),m=s.moves.find(m=>m.id===37195);m.effectIds.push(999999);m.effectInstances.push({id:999999,args:[],description:'未知效果'});
  assert.ok(store.issues(s).some(x=>x.includes(m.name)));
  const {reviewCoverage}=require('../completion-policy.cjs'),reviews=require('../SINGLE-STAGE-REVIEWS.json');
  assert.equal(reviewCoverage(source,reviews).total,103);
  assert.equal(reviewCoverage(source,reviews).missing.length,0);
  assert.equal(reviewCoverage(source,reviews).stale.length,0);
  assert.ok(reviewCoverage(s,reviews).missing.length>0);
});

test('3613 原版与觉醒版同场使用各自第五、独立魂印种族值与实际伤害PP',()=>{
  const snapshots=[mode(909),mode(1825)],loadouts=snapshots.map(s=>E.WIKI.defaultMoves(s));
  let outcome;
  for(let seed=0;seed<30;seed++){
    const state=E.createBattle({wikiSnapshots:snapshots,wikiLoadouts:loadouts,criticals:false});state.rng=seed;
    assert.deepEqual(state.fighters.map(f=>f.soulId),[909,1825]);
    assert.equal(state.fighters[1].stats.maxHp-state.fighters[0].stats.maxHp,30);
    const next=E.resolveTurn(state,['wiki:32045','wiki:37195']);
    if(next.fighters.every(f=>f.lastAttackDamage>0)){outcome={state,next};break;}
  }
  assert.ok(outcome,'必须找到双方实际执行第五技能的战斗');
  const {state,next}=outcome;
  for(const [side,id] of [[0,32045],[1,37195]]){
    assert.equal(next.fighters[side].pp['wiki:'+id],4);
    assert.ok(next.fighters[side].hp<state.fighters[side].hp);
    assert.ok(next.fighters[side].lastAttackDamage>0);
    assert.equal(next.fighters[side].pp['wiki:'+(side===0?37195:32045)],undefined);
  }
});
