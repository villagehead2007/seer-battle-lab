'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,soul){const snapshot=structuredClone(store.species(id));if(soul)snapshot.selectedSoulId=soul;return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
test('用户同类规则：两份真实独立凌波版本来源记录作只读分类，50%与必定睡眠均归一种；不伪造同编号同时配队',()=>{
 const sources=[];for(const soul of [1157,1561]){const g=T.create([[member(4745),member(3888,soul)],[member(3102)]],[0,0],{seed:14,criticals:false}),f=g.battle.fighters[0];assert.equal(f.soulState.hunt1948.souls,1);assert.equal(f.soulState.hunt1948.inheritedSingleSources[0].soulId,soul);sources.push(...f.soulState.hunt1948.inheritedSingleSources);}const before=structuredClone(sources),kinds=E.SOULS.registry[1948].abilities.effectKinds(sources);assert.equal(kinds.length,1);assert.deepEqual(sources,before);
});
test('同类完整回HP与PP在真实无限自由加弗丽嘉背包只增一种，凯旋条件不凭空发放，其他不同效果仍独立计层',()=>{
 let g=T.create([[member(4745),member(3383),member(4498),member(3665)],[member(4925),member(3102)]],[0,0],{seed:14,criticals:false});const f=g.battle.fighters[0];assert.equal(f.soulState.hunt1948.inheritedSingleSources.length,3);assert.equal(f.soulState.hunt1948.souls,2);assert.equal(f.soulState.prophecies,undefined);g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.hunt1948.souls,2);assert.equal(g.battle.fighters[0].soulState.hunt1948.inheritedEntryHistory.at(-1).added,2);
});
