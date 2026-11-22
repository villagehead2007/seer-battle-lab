'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,skill,stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,...stats}}};}
test('冥契真实敌方主动换入逐槽回一点PP，回满时全队回100；未满不授全队回复，阵亡队友不复活',()=>{
 for(const deficit of [0,1,2]){
  let g=T.create([[member(4467),member(2987),member(2988),member(3056)],[member(2987),member(2988)]],[0,0],{seed:14,criticals:false});
  const f=g.battle.fighters[0];f.hp=7000;g.slots[0][1].fighter.hp=4000;g.slots[0][2].fighter.hp=4000;g.slots[0][3].fighter.hp=0;const key=f.moves[0],max=g.battle.moveDefinitions[key].pp;f.pp[key]=max-deficit;
  g=T.turn(g,['potion:hp',{switchTo:1}]);assert.equal(g.battle.fighters[0].pp[key],max-Math.max(0,deficit-1));
  assert.equal(g.slots[0][2].fighter.hp,deficit<2?4100:4000);assert.equal(g.slots[0][1].fighter.hp,deficit<2?6350:6250);assert.equal(g.slots[0][3].fighter.hp,0);
 }
});
test('冥契真实击败只为最低现体靠前替补回半体，强制补位不回PP且自己在场下不观察主动切换',()=>{
 let g=T.create([[member(4467,10535,{atk:9999}),member(2987),member(2988)],[member(3056),member(2988),member(3102)]],[0,0],{seed:14,criticals:false});
 g.slots[0][1].fighter.hp=3000;g.slots[0][2].fighter.hp=3000;const f=g.battle.fighters[0],key=f.moves[0];f.pp[key]-=4;g.battle.fighters[1].hp=1;
 g=T.turn(g,['wiki:10535','potion:pp']);assert.equal(g.phase,'replace');assert.equal(g.slots[0][1].fighter.hp,7500);assert.equal(g.slots[0][2].fighter.hp,3000);const pp={...g.battle.fighters[0].pp};
 g=T.replace(g,[null,1]);assert.deepEqual(g.battle.fighters[0].pp,pp);
 g=T.turn(g,[{switchTo:1},'potion:pp']);const restingPP={...g.slots[0][0].fighter.pp};g=T.turn(g,['potion:pp','potion:pp']);assert.deepEqual(g.slots[0][0].fighter.pp,restingPP);
 // The third enemy remains alive from the initial roster; the defeated slot stays dead.
 assert.equal(g.slots[1][0].fighter.hp,0);g=T.turn(g,['potion:pp',{switchTo:2}]);assert.equal(g.slots[1][0].fighter.hp,0);assert.deepEqual(g.slots[0][0].fighter.pp,restingPP);
});
