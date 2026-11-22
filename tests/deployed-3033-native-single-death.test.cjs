'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,loadout,make,turn}=require('./helpers/3033-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
test('3033同一真实死亡效果无继任时也清敌正级PP回合，单挑与单成员队伍一致且输入不变',()=>{
 let s=turn(make(10086,{aHp:100,aStats:{def:1},enemyMoves:[24624,10086],bStats:{atk:9999}}),pp,24624);const before=structuredClone(s);const out=turn(s,pp,10086);assert.deepEqual(s,before);assert.equal(out.fighters[0].hp,0);assert.equal(out.fighters[1].stages.def,0);assert.equal(out.fighters[1].stages.spd,0);assert.ok(Object.values(out.fighters[1].pp).every(n=>n===0));assert.deepEqual(out.fighters[1].effects,{});
 function member(id,stats,moves=[]){const snapshot=id===3033?source:store.species(id);return{snapshot,moves:loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
 let g=T.create([[member(3033,{def:1})],[member(2989,{atk:9999},[24624,10086])]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=100;g=T.turn(g,[pp,'wiki:24624']);g=T.turn(g,[pp,'wiki:10086']);assert.equal(g.phase,'finished');assert.equal(g.battle.fighters[1].stages.def,0);assert.equal(g.battle.fighters[1].stages.spd,0);assert.ok(Object.values(g.battle.fighters[1].pp).every(n=>n===0));assert.deepEqual(g.battle.fighters[1].effects,{});
});
