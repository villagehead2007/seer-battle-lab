'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id){const snapshot=store.species(id);return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000}}};}
test('戟决先锋每场首次致死保1回复实际两防减少量，换下返场后第二次致死不重授',()=>{
 const owner=member(4857),foe=member(3056);Object.assign(owner.build.overrides,{def:401,spd:403});foe.build.overrides.atk=9999;if(!foe.moves.includes(10127))foe.moves[1]=10127;
 let g=T.create([[owner,member(2988)],[foe]],[0,0],{seed:13,criticals:false});g.battle.fighters[0].hp=100;
 g=T.turn(g,['potion:pp','wiki:10127']);const f=g.battle.fighters[0];
 assert.equal(f.hp,402);assert.equal(f.stats.def,201);assert.equal(f.stats.spd,202);assert.equal(f.soulState.phalanx2044.survivalUsed,true);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.soulState.phalanx2044.survivalUsed,true);
 g=T.turn(g,[{switchTo:0},'potion:pp']);assert.ok(g.battle.fighters[0].hp>1);
 g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.phase,'replace');
});
test('用户确认戟决先锋返场重算首次命中：防御50%、特防50%，药剂不计次且换回重用防御',()=>{
 const owner=member(4857);Object.assign(owner.build.overrides,{def:400,spd:800,atk:100});
 const hit=owner.snapshot.moves.find(m=>m.kind==='physical'&&m.effectIds.length===0).id;if(!owner.moves.includes(hit))owner.moves[1]=hit;
 let g=T.create([[owner,member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
 const attacks=[];
 for(const action of ['potion:pp','wiki:'+hit,'wiki:'+hit]){
  const round=g.battle.round;g=T.turn(g,[action,'potion:pp']);
  attacks.push(g.battle.damageEvents?.filter(e=>e.round===round&&e.sourceSide===0&&e.type==='percent').map(e=>e.settledDamage)??[]);
 }
 assert.deepEqual(attacks,[[],[200],[400]]);assert.equal(g.battle.fighters[0].soulState.phalanx2044.hits,2);
 g=T.turn(g,['wiki:'+hit,'potion:pp']);assert.equal(g.battle.fighters[0].soulState.phalanx2044.hits,3);
 g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);
 assert.equal(g.battle.fighters[0].soulState.phalanx2044.hits,0);
 assert.equal(D.fighter(g.battle.fighters[0],g.battle.round).items.find(x=>x.name==='本次在场攻击命中').value,'0 次 · 下次附伤按防御值的 50%');
 const round=g.battle.round;g=T.turn(g,['wiki:'+hit,'potion:pp']);
 assert.deepEqual(g.battle.damageEvents.filter(e=>e.round===round&&e.sourceSide===0&&e.type==='percent').map(e=>e.settledDamage),[200]);
 assert.equal(D.fighter(g.battle.fighters[0],g.battle.round).items.find(x=>x.name==='本次在场攻击命中').value,'1 次 · 下次附伤按特防值的 50%');
});
test('戟决先锋攻击MISS不占奇偶命中计数，下一次实际命中仍按防御附伤',()=>{
 const owner=member(4857);Object.assign(owner.build.overrides,{def:400,spd:800});const move=owner.snapshot.moves.find(m=>m.kind==='physical'&&m.effectIds.length===0&&!m.alwaysHit);assert.ok(move);if(!owner.moves.includes(move.id))owner.moves[1]=move.id;const key='wiki:'+move.id;let observed=false;
 for(let seed=1;seed<=128&&!observed;seed++){
  let g=T.create([[owner,member(2988)],[member(3056)]],[0,0],{seed,criticals:false});g.battle.fighters[0].stages.acc=-6;const definition=structuredClone(g.battle.moveDefinitions[key]);g=T.turn(g,[key,'potion:pp']);if(g.battle.fighters[0].soulState.phalanx2044.hits!==0)continue;
  assert.ok(!g.battle.damageEvents?.some(e=>e.sourceSide===0));const round=g.battle.round;g=T.turn(g,[key,'potion:pp']);if(g.battle.fighters[0].soulState.phalanx2044.hits!==1)continue;
  assert.deepEqual(g.battle.moveDefinitions[key],definition);assert.deepEqual(g.battle.damageEvents.filter(e=>e.round===round&&e.sourceSide===0&&e.type==='percent').map(e=>e.settledDamage),[200]);observed=true;
 }assert.equal(observed,true,'shared native RNG must produce a real miss followed by a real hit without changing the original move');
});
