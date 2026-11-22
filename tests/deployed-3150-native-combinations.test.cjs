'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3150-native.cjs'),pp='potion:pp';
// 用户全局确认：反弱收益遇自身禁强化时负级归零、不授收益；保留独立消强与先制消费断言。
test('3150雷祖994消强与733自身反弱独立成败，次次先制跨药剂保留且仅实际下一技能消费',()=>{
 for(const mode of['normal','protected','ban']){let s=H.turn(H.make(19762,{extraMoves:[20196],aStages:{def:-1},bStages:{atk:2},bEffects:mode==='protected'?{强化保护:{start:1,end:4}}:{},aEffects:mode==='ban'?{禁强化:{start:1,end:4}}:{}}),19762);assert.equal(s.fighters[1].stages.atk,mode==='protected'?2:0);assert.equal(s.fighters[0].stages.def,mode==='ban'?0:1);assert.equal(!!s.fighters[1].ailments['麻痹'],mode!=='ban');s=H.turn(s,pp);s=H.turn(s,20196);assert.equal(s.fighters[0].soulState.resolvedPriority.value,mode==='protected'?0:2);s=H.turn(s,20196);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);}
});
test('3150魂印真实末麻痹供993次轮双倍全强化，707低体满回及三轮到期，152属性监听期满不续控',()=>{
 let s=H.make(24987,{aHp:1000,extraMoves:[20196]});s=H.turn(s,pp);assert.ok(s.fighters[1].ailments['麻痹']);s=H.turn(s,24987);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===2));assert.equal(s.fighters[0].hp,9000);
 s=H.make(24987,{enemyMoves:[20889]});s=H.turn(s,24987,20889);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===1));assert.ok(s.fighters[1].ailments['麻痹']);s=H.turn(s,pp);s=H.turn(s,pp);s=H.turn(s,pp,20889);assert.equal(s.fighters[1].ailments['麻痹'],undefined);
 s=H.make(24987,{aHp:1,aAilments:{中毒:6},extraMoves:[20196]});for(let r=1;r<=4;r++){s=H.turn(s,r===1?24987:20196);assert.equal(s.fighters[0].hp,r<=3?7875:6750);}
});
test('3150远古968先手80与后手40麻痹有原生分支，499只后手授下一轮全技能先制一并到期',()=>{
 for(const first of[false,true]){const seen=new Set();for(let seed=1;seed<=24&&seen.size<2;seed++){const s=H.turn(H.make(19764,{seed,aStats:{spe:first?1000:1},enemyMoves:[20889],aStages:{acc:6}}),19764,20889);assert.equal(s.turns.at(-1).first,first?0:1);seen.add(!!s.fighters[1].ailments['麻痹']);}assert.equal(seen.size,2);let s=H.turn(H.make(19764,{extraMoves:[20196],aStats:{spe:first?1000:1},enemyMoves:[20889,10086],aStages:{acc:6}}),19764,20889);s=H.turn(s,20196,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,first?0:1);s=H.turn(s,20196,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);}
});
