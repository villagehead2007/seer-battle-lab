'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[]){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
function statusUse(g){const original=E.SOULS;let actual;E.SOULS={...original,run(event,c){original.run(event,c);if(event==='afterUse'&&c.a.side===0&&c.m.kind==='status')actual={used:c.actualUsed,successful:c.successful};}};try{return{next:T.turn(g,['wiki:20157',pp]),actual};}finally{E.SOULS=original;}}
test('957完整原魂真实拍打MISS不涨攻层，原必中击命中获得首层，真换返保层且下一命中继续增长',()=>{
 assert.equal(S.species(3672).souls.find(s=>s.id===957).hash,'4d676d24');let g=T.create([[member(3672,957,[10004,32335]),member(2989)],[member(2989)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].stages.acc=-6;g.battle.fighters[1].stages.eva=6;
 g=T.turn(g,['wiki:10004',pp]);assert.ok(g.battle.turns.at(-1).events.some(e=>/未命中|闪避|MISS/.test(e.text)));assert.equal(g.battle.fighters[0].soulState.miracleAttacks??0,0);
 g=T.turn(g,['wiki:32335',pp]);assert.equal(g.battle.fighters[0].soulState.miracleAttacks,1);assert.ok(g.battle.damageEvents.some(e=>e.round===g.battle.round-1&&e.type==='attack'&&e.targetSide===1&&e.settledDamage>0));
 g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.slots[0][0].fighter.soulState.miracleAttacks,1);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.miracleAttacks,1);g=T.turn(g,['wiki:32335',pp]);assert.equal(g.battle.fighters[0].soulState.miracleAttacks,2);
});
test('957完整原魂原神速受真实登场封属不涨减伤层，封属结束实际强化成长，真换返保层再成功使用继续增长',()=>{
 assert.equal(S.species(3672).souls.find(s=>s.id===957).hash,'4d676d24');let g=T.create([[member(3672,957,[20157]),member(2989)],[member(4676)]],[0,0],{seed:14,criticals:false});
 let observed=statusUse(g);g=observed.next;assert.deepEqual(observed.actual,{used:true,successful:false},'native two-round entry seal really invalidated the original status skill');assert.equal(g.battle.fighters[0].soulState.miracleStatuses??0,0);
 g=T.turn(g,['potion:hp',pp]);assert.equal(g.battle.fighters[0].soulState.miracleStatuses??0,0,'actual HP item lets the native seal expire without using a skill');observed=statusUse(g);g=observed.next;assert.deepEqual(observed.actual,{used:true,successful:true});assert.equal(g.battle.fighters[0].soulState.miracleStatuses,1);g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.slots[0][0].fighter.soulState.miracleStatuses,1);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.miracleStatuses,1);g=T.turn(g,['wiki:20157',pp]);assert.equal(g.battle.fighters[0].soulState.miracleStatuses,2);
});
