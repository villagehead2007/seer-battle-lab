'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const D=require('../dist/battle-display.js');
function member(id,stats={}){const snapshot=store.species(id);return{snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const kinds=['烈焰诅咒','致命诅咒','虚弱诅咒'];
test('贝利亚真实再次登场向自身重新附三种附属诅咒三回合，普通离场清旧标且不带旧剩余期限',()=>{
 let g=T.create([[member(4680),member(3056)],[member(3102)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['potion:pp','potion:pp']);g=T.turn(g,[{switchTo:1},'potion:pp']);for(const k of kinds)assert.equal(g.slots[0][0].fighter.ailments[k],undefined);const round=g.battle.round;g=T.turn(g,[{switchTo:0},'potion:pp']);for(const k of kinds){assert.equal(g.battle.fighters[0].ailments[k],round+2);assert.ok(g.battle.entryStatusEvents.some(e=>e.targetSide===0&&e.status===k&&e.appliedDuration===3&&e.endRound===round+2));}
});
test('贝利亚真实一击击败尚无诅咒的目标不增加上限或诅咒后继，只有带咒击败才预约且显示当前来源只读',()=>{
 let g=T.create([[member(4680,{spa:9999}),member(3056)],[member(3102,{spd:1}),member(3056)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:37525','potion:pp']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].stats.maxHp,9000);g=T.replace(g,[null,1]);assert.equal(g.battle.fighters[1].ailments['诅咒'],undefined);
 g=T.create([[member(4680,{spa:9999}),member(3056)],[member(3102,{spd:1}),member(3056)]],[0,0],{seed:14,criticals:false});g.slots[1][1].fighter.counts.immune=1;g=T.turn(g,['wiki:28814','potion:pp']);g=T.turn(g,['wiki:37525','potion:pp']);const before=structuredClone(g);assert.match(D.team(g,1).find(x=>x.name==='下只登场诅咒').value,/A 方贝利亚奥特曼.*一次/);assert.match(D.fighter(g.battle.fighters[0],g.battle.round,g.battle.moveDefinitions).items.find(x=>x.name==='诅咒击败体力上限').value,/150.*下场重置/);assert.deepEqual(g,before);g=T.replace(g,[null,1]);assert.equal(g.battle.fighters[1].ailments['诅咒'],undefined);assert.equal(g.battle.fighters[1].counts.immune,0);assert.equal(g.battle.teamEntryGrants[1].length,0);
});
test('贝利亚真实传播三咒后原第五击败，所选第三后继独获一次诅咒，己方真下场重置KO上限增量',()=>{
 let g=T.create([[member(4680,{atk:9999,spa:9999}),member(3056)],[member(3102,{def:1,spd:1}),member(3056),member(4647)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:28814','potion:pp']);assert.ok(kinds.every(k=>g.battle.fighters[1].ailments[k]>=g.battle.round));g=T.turn(g,['wiki:37525','potion:pp']);assert.equal(g.phase,'replace',JSON.stringify({hp:g.battle.fighters.map(f=>f.hp),history:g.history.slice(-18),turn:g.battle.turns.at(-1)}));assert.ok(g.battle.fighters[0].hp>0);const max=g.battle.fighters[0].stats.maxHp;assert.equal(max,9150);g=T.replace(g,[null,2]);assert.ok(g.battle.fighters[1].ailments['诅咒']>=g.battle.round);assert.equal(g.slots[1][1].fighter.ailments['诅咒'],undefined);g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.battle.fighters[1].ailments['诅咒'],undefined);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.stats.maxHp,9000);assert.equal(g.slots[0][0].fighter.soulState.belialMaxHP1886,undefined);assert.ok(g.slots[0][0].fighter.hp<=9000);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].stats.maxHp,9000);assert.equal(g.battle.fighters[0].soulState.belialMaxHP1886,undefined);
});


