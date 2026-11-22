'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[]){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
test('1834完整原37239真实种因，持有者真下场及源离场多回合暂停，返场继续原级不重建',()=>{
 let g=T.create([[member(3941,1834,[37239]),member(3056)],[member(2988),member(2989)]],[0,0],{seed:13,criticals:false});g=T.turn(g,['wiki:37239',pp]);assert.equal(g.battle.fighters[1].soulState.darkCause.level,2);const before={...g.battle.fighters[1].pp};
 g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.slots[1][0].fighter.soulState.darkCause.level,2);assert.deepEqual(g.slots[1][0].fighter.pp,before);g=T.turn(g,[{switchTo:1},pp]);for(let i=0;i<2;i++){g=T.turn(g,[pp,pp]);assert.equal(g.slots[1][0].fighter.soulState.darkCause.level,2);assert.deepEqual(g.slots[1][0].fighter.pp,before);}
 g=T.turn(g,[pp,{switchTo:0}]);assert.equal(g.battle.fighters[1].soulState.darkCause.level,3);for(const k of g.battle.fighters[1].moves)assert.equal(g.battle.fighters[1].pp[k],Math.max(0,before[k]-1));assert.equal(g.active[0],1);assert.equal(g.slots[0][0].fighter.soulId,1834);
});
