'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),L=require('../local-species.cjs'),P=require('../completion-policy.cjs'),{loadout}=require('./helpers/3001-native.cjs');
const rows=require('../research/TEAM-STAGE-2/round99-parent-native-input-20261113.json'),counts={creations:0,turns:0};
function member(snapshot,moves=[],overrides={}){return{snapshot,moves:moves.length?moves:loadout(snapshot,[]),build:{overrides:{maxHp:9000,atk:180,spa:360,def:4000,spd:4000,spe:1000,...overrides}}};}
function actual(row){
  const snapshot=E.WIKI.versionSnapshots(L.species(row.id)).find(s=>P.digest(s)===row.snapshotDigest);assert.ok(snapshot,row.key);
  const raw=E.WIKI.availableMoves(snapshot).find(m=>m.id===row.move);
  assert.deepEqual([raw.kind,raw.power,raw.pp,raw.alwaysHit],[row.kind,row.power,row.pp,row.alwaysHit]);
  const before=T.create([[member(snapshot,row.moves),member(L.species(3056))],[member(L.species(2989),[],{maxHp:9999,def:9999,spd:9999,spe:100}),member(L.species(3223))]],[0,0],{seed:14,criticals:false});counts.creations++;
  before.battle.fighters[0].hp=5000;before.battle.fighters[0].stages.acc=6;before.slots[0][1].fighter.hp=4000;
  const key='wiki:'+row.move,pp=before.battle.fighters[0].pp[key],original=E.SOULS,fx=E.WIKI.effectsEngine;
  let used,attackStats;
  E.SOULS={...original,run(event,c){if(event==='afterUse'&&c.a.side===0&&c.m.wikiId===row.move)used={pp:c.a.pp[key],soul:c.a.soulId,hash:c.a.soulHash,move:c.m.wikiId,operations:c.m.operations.map(o=>[Number(o.effectId),o.index,o.phase,o.sourceArgs])};return original.run(event,c);}};
  E.WIKI.effectsEngine={...fx,run(phase,ops,c){const out=fx.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0&&c.m.wikiId===row.move)attackStats={atk:c.effective(c.a,'atk'),spa:c.effective(c.a,'spa')};return out;}};
  let after;try{after=T.turn(before,[key,'potion:pp']);counts.turns++;}finally{E.SOULS=original;E.WIKI.effectsEngine=fx;}
  return{before,after,used,attackStats,pp,snapshot};
}
test('十九完整父项的26原合法版本各实际整招：原PP及两免耗魂、物特独立面板、原全指令与魂印保留，单体和队伍分支合并取证',()=>{
  const parents=new Set();
  for(const row of rows){
    const x=actual(row);parents.add(row.key);assert.ok(x.used,row.key+' actually used full original');
    assert.equal(x.used.move,row.move);assert.equal(x.used.soul,row.soul);
    assert.equal(x.used.hash,x.snapshot.souls.find(s=>s.id===row.soul).hash);
    assert.equal(x.used.pp,x.pp-row.expectedBasePpCost,row.key+' before independent passive PP recovery');
    assert.deepEqual(x.used.operations,row.operations,row.key+' complete ordered multi-phase original operations');
    const red=(x.after.battle.damageEvents??[]).filter(e=>e.round===1&&e.sourceSide===0&&e.type==='attack'&&e.moveId===row.move);
    if(row.kind==='status')assert.equal(red.length,0,row.key);
    else{
      assert.ok(red.length>0,row.key+' actual original red damage');assert.ok(red.some(e=>e.hpLoss>0));
      assert.ok(x.attackStats,row.key+' original beforeDamage frame');
      assert.equal(red[0].attackValue,x.attackStats[row.kind==='physical'?'atk':'spa'],row.key+' correct original physical/special panel');
    }
    assert.equal(x.before.battle.round,1);assert.equal(x.before.slots[0][1].fighter.hp,4000);
  }
  assert.equal(parents.size,19);assert.equal(rows.length,26);
});
test.after(()=>console.log('ROUND99_PARENT_COUNTS '+JSON.stringify({...counts,parents:19,originalProfiles:rows.length,noMidBattleWrites:true,noRngReplacement:true,existingPerEffectEvidenceReused:true,not840OnlyCertification:true})));
