'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,skill,stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,...stats}}};}
test('米斯蒂克真实19473自爆由选定的第二替补独享500盾，免异全队共享且对手换入承接三回封属',()=>{
 let g=T.create([[member(4676,19473),member(2987),member(3056)],[member(3056,20117),member(2988)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:19473','potion:pp']);assert.equal(g.phase,'replace');g=T.replace(g,[2,null]);assert.equal(g.battle.fighters[0].suitState.shield,500);assert.equal(g.slots[0][1].fighter.suitState.shield,0);assert.equal(g.battle.fighters[0].counts.immune,1);
 g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.equal(g.battle.fighters[0].suitState.shield,0);assert.equal(g.battle.fighters[0].counts.immune,1);assert.equal(g.battle.fighters[1].effects.statusBlock.end,4);
 g=T.turn(g,['potion:pp',{switchTo:0}]);const before=g.battle.fighters[1].stages.atk;g=T.turn(g,['potion:pp','wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,before);g=T.turn(g,['potion:pp','wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,before+1);
});
test('米斯蒂克真实37510奇数3001体力自爆，选定后继各得1500盾罩，第三队友不获，资源不重复授',()=>{
 let g=T.create([[member(4676,37510),member(2987),member(3056)],[member(3056)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=3001;g=T.turn(g,['wiki:37510','potion:pp']);assert.equal(g.phase,'replace');g=T.replace(g,[2,null]);assert.equal(g.battle.fighters[0].suitState.shield,1500);assert.equal(g.battle.fighters[0].suitState.barrier,1500);assert.equal(g.slots[0][1].fighter.suitState.shield,0);assert.equal(g.slots[0][1].fighter.suitState.barrier,0);g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:2},'potion:pp']);assert.equal(g.battle.fighters[0].suitState.shield,0);assert.equal(g.battle.fighters[0].suitState.barrier,0);
});
test('米斯蒂克真实37511击败共享封属跨后继再换人仍只消费一次，药剂与换人不消费',()=>{
 let g=T.create([[member(4676,37511,{spa:9999,spe:9999}),member(2987)],[member(2988,null,{maxHp:1,spd:1}),member(3056,20117),member(3102,20117)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:37511','potion:pp']);assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,['potion:pp',{switchTo:2}]);const f=g.battle.fighters[1],before=f.stages.atk,pp=f.pp['wiki:20117'];g=T.turn(g,['potion:pp','wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,before);assert.equal(g.battle.fighters[1].pp['wiki:20117'],pp-1);g=T.turn(g,['potion:pp','wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,before+1);
});
test('米斯蒂克真实28809吸取后目标HP未减才回复所有活替补200，溢出封顶且不复活',()=>{
 for(const immune of [false,true]){
  let g=T.create([[member(4676,28809),member(3056),member(2987),member(2988)],[member(3056)]],[0,0],{seed:14,criticals:false});g.slots[0][1].fighter.hp=4000;g.slots[0][2].fighter.hp=8990;g.slots[0][3].fighter.hp=0;g.battle.fighters[1].hp=8000;
  if(immune)g.battle.fighters[1].effects['固定百分比免疫']={start:1,end:1};g=T.turn(g,['wiki:28809','potion:pp']);assert.equal(g.battle.fighters[1].hp,immune?8000:5000);assert.deepEqual(g.slots[0].slice(1).map(s=>s.fighter.hp),immune?[4200,9000,0]:[4000,8990,0]);
 }
});
