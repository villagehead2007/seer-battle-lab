'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,ids=[],overrides={}){const snapshot=S.species(id);return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...overrides}}};}
test('2148原圣武38087自损后共享3次免异，跨成员保留剩余且耗尽后实际受束缚',()=>{
 let g=T.create([[member(4800,[38087]),member(2989),member(3008)],[member(4995,[38549])]],[0,0],{seed:14,criticals:false});
 g=T.turn(g,['wiki:38087',pp]);assert.equal(g.phase,'replace');assert.equal(g.slots[0][1].fighter.counts.immune??0,0);assert.equal(g.slots[0][2].fighter.counts.immune??0,0,'unentered reserves do not receive independent copies');
 g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].counts.immune,3);assert.equal(g.slots[0][0].fighter.soulState.vanished,true);
 g=T.turn(g,[pp,'wiki:38549']);assert.equal(g.battle.fighters[0].counts.immune,2);assert.equal(g.battle.fighters[0].ailments['束缚'],undefined);
 g=T.turn(g,[{switchTo:2},pp]);const old=g.slots[0][1].fighter;assert.equal(old.counts.immune??0,0);assert.ok(!(old.soulState.ailmentImmuneSources??[]).some(x=>x.kind==='wusheng2148'));assert.ok(!old.soulState.oracleImmunityLedger);assert.equal(g.battle.fighters[0].counts.immune,2,'next recipient receives the same remaining2');
 g=T.turn(g,[{switchTo:1},'wiki:38549']);assert.equal(g.battle.fighters[0].counts.immune,1);assert.equal(g.battle.fighters[0].ailments['束缚'],undefined);
 g=T.turn(g,[{switchTo:2},'wiki:38549']);assert.equal(g.battle.fighters[0].counts.immune,0);assert.equal(g.battle.fighters[0].ailments['束缚'],undefined);
 g=T.turn(g,[{switchTo:1},'wiki:38549']);assert.equal(g.battle.fighters[0].counts.immune??0,0);assert.ok(g.battle.fighters[0].ailments['束缚']>=g.battle.round-1);
});

test('2098完整原隔位入场免异授真实双方，持有者真下场清一次资格，来源未再登场的敌返场实际受原束缚',()=>{
 let g=T.create([[member(4000),member(4995,[38549]),member(2994)],[member(2989),member(3008)]],[0,0],{seed:14,criticals:false});assert.equal(g.battle.fighters[0].counts.immune,1);assert.equal(g.battle.fighters[1].counts.immune,1);g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.slots[1][0].fighter.counts.immune??0,0);assert.ok(!(g.slots[1][0].fighter.soulState.ailmentImmuneSources??[]).some(x=>x.kind==='verse2098'));g=T.turn(g,[{switchTo:1},{switchTo:0}]);const resting=g.slots[0][0].fighter,records=resting.soulState.ailmentImmuneSources??[];assert.equal(records.filter(x=>x.kind==='verse2098').reduce((n,x)=>n+x.count,0),0,JSON.stringify(records));assert.ok(records.some(x=>x.kind==='xuan2144'&&x.count===1),JSON.stringify(records));assert.equal(resting.counts.immune,1,'actual new Xuan entry grant must remain distinct from removed verse count');assert.equal(g.battle.fighters[1].counts.immune??0,0);g=T.turn(g,['wiki:38549',pp]);assert.ok(g.battle.fighters[1].ailments['束缚']>=g.battle.round-1);
});
test('2098完整原队伍存亡自然授四类免疫，来源真下场均清而真返场按仍死亡的实际位置重新获得',()=>{
 let g=T.create([[member(2989),member(2994),member(4000),member(3008),member(2998)],[member(3056)]],[2,0],{seed:14,criticals:false});for(const p of[0,1,4])g.slots[0][p].fighter.hp=0;g=T.turn(g,[pp,pp]);const fields=['weaknessImmune','ailmentImmune','fixedImmune','percentImmune'];for(const k of fields)assert.equal(g.battle.fighters[0].soulState.verse2098[k],true,k);g=T.turn(g,[{switchTo:3},pp]);for(const k of fields)assert.ok(!g.slots[0][2].fighter.soulState.verse2098[k],k+' must reset in reserve');g=T.turn(g,[{switchTo:2},pp]);for(const k of fields)assert.equal(g.battle.fighters[0].soulState.verse2098[k],true,k+' regranted by real unchanged dead roster');
});
