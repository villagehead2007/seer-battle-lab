'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180}}};}
test('卓尔布真实返场吸取罗兰之绽各400盾罩，离场后无旧资源可重复吸取，敌重新真实授予后再次吸取',()=>{
 let g=T.create([[member(4657),member(2987)],[member(4247,27654)]],[0,0],{seed:14,criticals:false});
 assert.deepEqual(g.battle.fighters[0].soulState.bladeEntry1859.at(-1),{round:1,shield:0,barrier:0});
 function shield(){g=T.turn(g,[{switchTo:1},'wiki:27654']);assert.equal(g.battle.fighters[1].suitState.shield,400);assert.equal(g.battle.fighters[1].suitState.barrier,400);g=T.turn(g,[{switchTo:0},'potion:pp']);const a=g.battle.fighters[0],b=g.battle.fighters[1];assert.equal(a.suitState.shield,400);assert.equal(a.suitState.barrier,400);assert.equal(b.suitState.shield,0);assert.equal(b.suitState.barrier,0);assert.equal(a.soulState.bladeEntry1859.at(-1).shield,400);assert.equal(a.soulState.bladeEntry1859.at(-1).barrier,400);}
 shield();g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].suitState.shield,0);assert.equal(g.battle.fighters[0].suitState.barrier,0);assert.equal(g.battle.fighters[0].soulState.bladeEntry1859.at(-1).shield,0);shield();
});
