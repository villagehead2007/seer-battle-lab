'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[]){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:1000,spa:1000,def:1000,spd:1000,spe:1000}}};}
test('2084完整原魂真实抵挡两敌原必暴全队归信后授免疫，真下场清免疫而信仰恒常保留，返场满足条件重新授',()=>{
 assert.equal(S.species(4898).souls.find(s=>s.id===2084).hash,'86e95364');let g=T.create([[member(4898,2084),member(2988)],[member(3056,undefined,[23285,10127]),member(4808,undefined,[26330,10001])]],[0,0],{seed:14,criticals:false});
 g=T.turn(g,[pp,'wiki:23285']);g=T.turn(g,[pp,'wiki:10127']);assert.equal(Number(g.battle.fighters[1].statusState.faithSourceNumber),4898);assert.ok(g.battle.fighters[0].soulState.pope4898.uses.some(x=>x.blocked>0));
 g=T.turn(g,[pp,{switchTo:1}]);g=T.turn(g,[pp,'wiki:26330']);g=T.turn(g,[pp,'wiki:10001']);assert.equal(Number(g.battle.fighters[1].statusState.faithSourceNumber),4898);assert.equal(Number(g.slots[1][0].fighter.statusState.faithSourceNumber),4898);assert.equal(!!g.battle.fighters[0].soulState.pope4898.immunity,false);
 g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[0].soulState.pope4898.immunity,true);
 g=T.turn(g,[{switchTo:1},pp]);assert.equal(!!g.slots[0][0].fighter.soulState.pope4898?.immunity,false,'unannotated earned immunity clears on true leave');assert.equal(Number(g.slots[1][0].fighter.statusState.faithSourceNumber),4898);assert.equal(Number(g.slots[1][1].fighter.statusState.faithSourceNumber),4898);
 g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.pope4898.immunity,true,'the actual next round start still sees all followers and freshly grants immunity');
});
