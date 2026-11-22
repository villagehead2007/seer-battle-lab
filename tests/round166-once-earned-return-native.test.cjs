'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[],stats={}){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
test('753完整原魂实际致命触发轮回，真换下返场保已用且第二次原攻击致命正常阵亡',()=>{
 let g=T.create([[member(5000,753,[],{def:1,spe:1}),member(2989)],[member(3056,undefined,[10127],{atk:9999,spe:9999})]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=1;
 g=T.turn(g,[pp,'wiki:10127']);assert.ok(g.battle.fighters[0].hp>0);assert.equal(g.battle.fighters[0].soulState.pony753.reincarnationUsed,true);assert.ok(g.battle.damageEvents.some(e=>e.type==='attack'&&e.targetSide===0&&e.settledDamage>1));
 g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.slots[0][0].fighter.soulState.pony753.reincarnationUsed,true);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.pony753.reincarnationUsed,true);g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.battle.fighters[0].hp,0);assert.deepEqual(g.pending,[0]);
});
test('1603完整原魂未用技能真实阵亡并次回合重生，实际换返已尝试保留且再死不再预约',()=>{
 let g=T.create([[member(4384,1603,[],{def:1,spe:1}),member(2989)],[member(3056,undefined,[10127],{atk:9999,spe:9999})]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=1;
 g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.battle.fighters[0].soulState.kingDeathAttempted,true);assert.equal(g.battle.fighters[0].soulState.kingRevivalRound,g.battle.round);assert.deepEqual(g.pending,[]);
 g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[0].hp,9000);assert.equal(g.battle.fighters[0].soulState.kingRevivalRound,undefined);g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.slots[0][0].fighter.soulState.kingDeathAttempted,true);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.kingDeathAttempted,true);
 g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.battle.fighters[0].soulState.kingRevivalRound,undefined);assert.deepEqual(g.pending,[0]);
});
