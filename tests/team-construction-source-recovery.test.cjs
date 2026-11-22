'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id){const snapshot=store.species(id);return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000}}};}
test('克雷弗德真实两种协议进入激发且同构造不重复，离场清空返场守备可重新授予',()=>{
 const owner=member(4644),foe=member(3056);owner.build.overrides.spe=9999;foe.build.overrides.spe=1;foe.build.overrides.atk=100;if(!foe.moves.includes(10127))foe.moves[1]=10127;
 let g=T.create([[owner,member(2988)],[foe]],[0,0],{seed:13,criticals:false});
 assert.deepEqual(g.battle.fighters[0].soulState.constructions1845,[]);
 g=T.turn(g,['wiki:37357','wiki:10127']);assert.deepEqual(g.battle.fighters[0].soulState.constructions1845,[4]);
 g=T.turn(g,['wiki:28725','wiki:10127']);assert.deepEqual(g.battle.fighters[0].soulState.constructions1845,[2,4]);
 assert.equal(D.fighter(g.battle.fighters[0],g.battle.round).items.find(x=>x.name==='德莱赫默').value,'激发状态');
 g=T.turn(g,['wiki:37357','wiki:10127']);assert.deepEqual(g.battle.fighters[0].soulState.constructions1845,[2,4]);
 assert.equal(g.battle.fighters[0].soulState.constructionRound1845.mode,'active');
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.soulState.constructions1845?.length??0,0);
 g=T.turn(g,[{switchTo:0},'potion:pp']);assert.deepEqual(g.battle.fighters[0].soulState.constructions1845,[]);
 assert.equal(g.battle.fighters[0].soulState.constructionRound1845.mode,'guard');
 assert.equal(D.fighter(g.battle.fighters[0],g.battle.round).items.find(x=>x.name==='德莱赫默').value,'守备状态');
 g=T.turn(g,['wiki:37357','wiki:10127']);assert.deepEqual(g.battle.fighters[0].soulState.constructions1845,[4]);
});
