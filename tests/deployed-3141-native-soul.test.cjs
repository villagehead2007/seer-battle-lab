'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3141-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
test('3141两魂严格回初低体所有技能先制二和受击害怕，等高不加，受伤跨线不改当轮快照',()=>{
 for(const soul of[480,611])for(const hp of[6999,7000,7001]){const s=H.turn(H.make(20496,{soul,aHp:hp,bHp:7000,enemyMoves:[10086]}),20496,10086);assert.equal(s.fighters[0].soulState.hadesLow,hp<7000);assert.equal(s.fighters[0].soulState.resolvedPriority.value,hp<7000?2:0);assert.equal(!!s.fighters[1].ailments['害怕'],hp<7000);}
 const s=H.turn(H.make(20496,{aHp:7001,bHp:7000,aStats:{spe:1,def:1000},bStats:{atk:9999},enemyMoves:[10086]}),20496,10086);assert.ok(s.fighters[0].hp<7000);assert.equal(s.fighters[0].soulState.hadesLow,false);assert.equal(s.fighters[1].ailments['害怕'],undefined);
});
test('3141两魂首次登场致死保1，下回合低体二叠原二或强三，攻击附3000固定仅该回合，属性不附',()=>{
 for(const soul of[480,611])for(const next of[14115,20496]){let s=H.turn(H.make(next,{soul,extraMoves:[14115],aHp:1000,aStats:{def:1},bStats:{atk:9999},enemyMoves:[10086]}),pp,10086);assert.equal(s.fighters[0].hp,1);assert.equal(s.fighters[0].soulState.hadesRewardRound,2);s=H.turn(s,next);assert.equal(s.fighters[0].soulState.resolvedPriority.value,next===20496?2:soul===480?4:5);const fixed=s.damageEvents.find(e=>e.round===2&&e.type==='fixed'&&e.sourceSide===0);if(next===20496)assert.equal(fixed,undefined);else assert.equal(fixed.settledDamage,3000);s=H.turn(s,14115);assert.equal(s.fighters[0].soulState.resolvedPriority.value,2);assert.ok(!s.damageEvents.some(e=>e.round===3&&e.type==='fixed'&&e.sourceSide===0));}
});
test('3141两魂真实第二回合从替补登场也按登场首回合保1，奖励跟随实际第三回合而非全场首回合',()=>{
 for(const soul of[480,611]){function member(id,overrides={},moves=[]){const snapshot=structuredClone(store.species(id));if(id===3141)snapshot.selectedSoulId=soul;return{snapshot,moves:H.loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:1200,spa:1200,def:4000,spd:4000,spe:1000,...overrides}}};}let g=T.create([[member(3004),member(3141,{maxHp:500,def:1},[14115])],[member(2989,{atk:9999},[10086])]],[0,0],{seed:14,criticals:false});g=T.turn(g,[pp,pp]);g=T.turn(g,[{switchTo:1},'wiki:10086']);assert.equal(g.phase,'action');assert.equal(g.battle.fighters[0].hp,1);assert.equal(g.battle.fighters[0].soulState.hadesRewardRound,3);g=T.turn(g,['wiki:14115',pp]);assert.equal(g.battle.fighters[0].soulState.resolvedPriority.value,soul===480?4:5);assert.equal(g.battle.damageEvents.find(e=>e.round===3&&e.type==='fixed'&&e.sourceSide===0).settledDamage,3000);}
});

