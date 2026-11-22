'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3075-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,stats={},moves=[]){const snapshot=store.species(id);return{snapshot,moves:H.loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:1200,spa:1200,def:4000,spd:4000,spe:1000,...stats}}};}
test('3075赤瞳601实际本招KO后下轮真正选择的继任者速命各降一，其他替补不受影响且未KO换人不触发',()=>{
 for(const knockout of[false,true]){let g=T.create([[member(3075,{},[19453])],[member(2989,{maxHp:knockout?1:9000}),member(3004),member(3014)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:19453',pp]);assert.equal(g.slots[1][0].fighter.hp===0,knockout);if(knockout)g=T.replace(g,[null,1]);else g=T.turn(g,[pp,{switchTo:1}]);g=T.turn(g,[pp,pp]);assert.equal(Number(g.battle.fighters[1].number),3004);assert.equal(g.battle.fighters[1].stages.spe,knockout?-1:0);assert.equal(g.battle.fighters[1].stages.acc,knockout?-1:0);assert.ok(Object.values(g.slots[1][2].fighter.stages).every(n=>n===0));}
});
