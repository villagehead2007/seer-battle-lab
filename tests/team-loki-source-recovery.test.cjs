'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,soul){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000}}};}
test('两版洛基场下时敌方药剂不叠神祇，场下已阵亡者不因真实敌攻击触发伤害或清PP',()=>{
 for(const soul of [1586,2055]){
  let g=T.create([[member(3056),member(4361,soul)],[member(2988)]],[0,0],{seed:13,criticals:false});
  g=T.turn(g,['potion:pp','potion:pp']);
  assert.equal(g.slots[0][1].fighter.soulState.lokiLayers??0,0);
  g.slots[0][1].fighter.hp=0;const before=g.battle.fighters[1].pp['wiki:19123'],round=g.battle.round;
  g=T.turn(g,['potion:pp','wiki:19123']);
  assert.equal(g.slots[0][1].fighter.soulState.lokiLayers??0,0);
  assert.equal(g.battle.fighters[1].pp['wiki:19123'],before-1);
  assert.equal(g.battle.fighters[1].soulState.lokiFalseArc??0,0);
  assert.ok(!g.battle.damageEvents?.some(e=>e.round===round&&e.sourceSide===0&&e.type==='true'));
 }
});
