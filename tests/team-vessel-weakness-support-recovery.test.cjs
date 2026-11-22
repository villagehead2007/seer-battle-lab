'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,stats={},skills=[]){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const skill of skills)if(!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
function make(removed=3,blocked=false){let g=T.create([[member(13311,{maxHp:1000,def:30}),member(2988,{},[20154])],[member(3291),...(blocked?[member(4000)]:[])]],[0,0],{seed:14,criticals:false});for(let i=0;i<removed;i++){g=T.turn(g,['wiki:38626',pp]);g=T.turn(g,[{switchTo:1},pp]);if(i<removed-1)g=T.turn(g,[{switchTo:0},pp]);}if(!removed)g=T.turn(g,[{switchTo:1},pp]);return g;}
test('SP真实三次第五与下场移除弱化记录，存活场下支援使己方真实扰乱穿透星皇原生免弱且不移除对手免弱',()=>{
 let g=make();assert.deepEqual(g.battle.teamVessel2162[0].state.records,['ailment']);assert.equal(g.battle.teamVessel2162[0].state.removed,3);assert.equal(g.active[0],1);assert.equal(E.SOULS.trait(g.battle.fighters[1],'weaknessImmune'),true);g=T.turn(g,['wiki:20154',pp]);assert.equal(g.battle.fighters[1].stages.acc,-1);assert.equal(E.SOULS.trait(g.battle.fighters[1],'weaknessImmune'),true);assert.ok(g.slots[0][0].fighter.hp>0);const before=structuredClone(g);assert.equal(require('../dist/battle-display.js').team(g,0).find(x=>x.name==='神魂场下支援').value,'能力下降无视对手免弱');assert.deepEqual(g,before);
});
test('SP弱化记录尚未移除不提供穿透，真实活薇尔诗限制场下指定时已移除弱化也不能支援',()=>{
 for(const [removed,blocked]of [[0,false],[3,true]]){let g=make(removed,blocked);g=T.turn(g,['wiki:20154',pp]);assert.equal(g.battle.fighters[1].stages.acc,0);assert.equal(E.SOULS.trait(g.battle.fighters[1],'weaknessImmune'),true);}
});
