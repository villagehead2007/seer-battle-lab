'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('普鲁修托回能真实用招逐槽恢复PP，离场清除且重新克制登场只重授三回合',()=>{
 let g=T.create([[member(4489,10250),member(3056)],[member(3432)]],[0,0],{seed:13,criticals:false});
 let f=g.battle.fighters[0];assert.ok(f.soulState.ppStates['回能Ⅰ']);assert.equal(f.soulState.ppStates['回能Ⅰ'].end,3);
 for(const key of f.moves)f.pp[key]=1;g=T.turn(g,['wiki:10250','potion:pp']);f=g.battle.fighters[0];
 for(const key of f.moves)assert.equal(f.pp[key],Math.min(g.battle.moveDefinitions[key].pp,key==='wiki:10250'?1:2),key);
 assert.ok(E.describeEffects(f,g.battle.round).some(x=>x.includes('回能Ⅰ')));
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.soulState.ppStates?.['回能Ⅰ'],undefined);
 const round=g.battle.round;g=T.turn(g,[{switchTo:0},'potion:pp']);f=g.battle.fighters[0];
 assert.equal(f.soulState.ppStates['回能Ⅰ'].start,round);assert.equal(f.soulState.ppStates['回能Ⅰ'].end,round+2);
});
test('普鲁修托失能属于实际持有者，源下场仍持续，持有者下场清除，双方重新入场按新属性判定',()=>{
 let g=T.create([[member(4489),member(2988)],[member(3056,20117),member(2987)]],[0,0],{seed:13,criticals:false});
 assert.equal(g.battle.fighters[0].soulState.ppStates?.['回能Ⅰ'],undefined);assert.ok(g.battle.fighters[1].soulState.ppStates['失能Ⅰ']);
 const before={...g.battle.fighters[1].pp};g=T.turn(g,['potion:pp','wiki:20117']);const f=g.battle.fighters[1];
 for(const key of f.moves)assert.equal(f.pp[key],before[key]-(key==='wiki:20117'?2:1));
 assert.ok(E.describeEffects(f,g.battle.round).some(x=>x.includes('失能Ⅰ')));
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.ok(g.battle.fighters[1].soulState.ppStates?.['失能Ⅰ']);
 g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.slots[1][0].fighter.soulState.ppStates?.['失能Ⅰ'],undefined);
 g=T.turn(g,[{switchTo:0},'potion:pp']);
 assert.equal(g.battle.fighters[0].soulState.ppStates?.['回能Ⅰ'],undefined);assert.equal(g.battle.fighters[1].soulState.ppStates?.['失能Ⅰ'],undefined);
});
