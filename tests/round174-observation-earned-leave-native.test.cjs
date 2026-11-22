'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[],stats={}){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
function verify(soul){
 for(const consume of [false,true]){
  let g=T.create([[member(4915,soul,[12897],{def:consume?1:4000,spe:100}),member(3056)],[member(4829,2019,[38133],{atk:consume?9999:180,spe:1000})]],[0,0],{seed:14,criticals:false});
  if(consume)g.battle.fighters[0].hp=1;
  g=T.turn(g,[pp,'wiki:38133']);let st=g.battle.fighters[0].soulState.observation4915;
  assert.equal(st.active,!consume,JSON.stringify({consume,st,hp:g.battle.fighters[0].hp}));assert.equal(st.status,'麻痹');assert.equal(st.kind,'physical');assert.ok(st.events.some(e=>e.field==='status'&&e.value==='麻痹'));assert.equal(st.events.filter(e=>e.kind==='observation-rebirth').length,consume?1:0);assert.ok(g.battle.fighters[0].hp>0);
  g=T.turn(g,[{switchTo:1},pp]);st=g.slots[0][0].fighter.soulState.observation4915;assert.equal(st.active,!consume);assert.equal(st.status,null);assert.equal(st.kind,null);
  g=T.turn(g,[{switchTo:0},pp]);st=g.battle.fighters[0].soulState.observation4915;assert.equal(st.active,!consume);assert.equal(st.status,null);assert.equal(st.kind,null);
  if(consume){g=T.turn(g,[pp,'wiki:38133']);assert.equal(g.slots[0][0].fighter.hp,0);assert.equal(g.phase,'replace');assert.equal(g.slots[0][0].fighter.soulState.observation4915.active,false);}
  else {g=T.turn(g,['wiki:12897',pp]);assert.equal(g.battle.fighters[0].soulState.observation4915.status,null);assert.equal(g.battle.fighters[1].ailments['麻痹'],undefined);assert.ok(g.battle.damageEvents.some(e=>e.round===g.battle.round-1&&e.type==='attack'&&e.targetSide===1&&e.settledDamage>0));}
 }
}
test('4915原魂2100真实负荷电频记录后下场清内容，未用重生仍可用而已用重生不重授',()=>{assert.equal(S.species(4915).souls.find(s=>s.id===2100).hash,'a7bcec13');verify(2100);});
test('4915原魂2108真实负荷电频记录后下场清内容，未用重生仍可用而已用重生不重授',()=>{assert.equal(S.species(4915).souls.find(s=>s.id===2108).hash,'8b430e1');verify(2108);});
