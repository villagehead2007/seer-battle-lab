'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3020-native.cjs'),pp='potion:pp';
test('3020魂391严格红伤200201299300边界，真实手下留情初1损0仍按完整伤害授下轮免攻及威力翻倍',()=>{
 for(const[atk,expected,immune,double]of[[6102,200,false,true],[6150,201,true,true],[9137,299,true,true],[9167,300,true,false]]){let s=make(20156,{extraMoves:[10361],aHp:1,enemyId:4732,enemyMoves:[10057],aStats:{def:1000,spe:1},bStats:{atk,spe:9999}});s=turn(s,20156,10057);const red=s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===1);assert.equal(red.settledDamage,expected);assert.equal(red.hpLoss,0);assert.equal(s.fighters[0].hp,1);assert.equal(!!s.fighters[0].effects['鬼王攻击免疫'],immune);assert.equal(!!s.fighters[0].effects['鬼王威力翻倍'],double);s=turn(s,10361);assert.ok(s.turns.at(-1).events.some(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0&&e.detail.startsWith('威力 '+(double?100:50)+' ')));s=turn(s,pp,10057);assert.ok(s.damageEvents.some(e=>e.round===3&&e.sourceSide===1&&e.settledDamage>0));}
});
test('3020魂391只免下轮攻击不额外回血，免疫归零不触发受伤奖励，周期中毒真实1125可授下轮攻击免疫',()=>{
 let s=make(20156,{extraMoves:[10361],aHp:1000,enemyId:4732,enemyMoves:[10057],aStats:{def:1000,spe:1},bStats:{atk:6150,spe:9999}});s=turn(s,20156,10057);assert.equal(s.fighters[0].hp,799);s=turn(s,10361,10057);assert.equal(s.fighters[0].hp,799);assert.ok(s.damageEvents.some(e=>e.round===2&&e.sourceSide===1&&e.type==='attack'&&e.settledDamage===0));
 s=turn(make(20156,{enemyMoves:[10086],aEffects:{当回合免伤:{start:1,end:1}}}),20156,10086);assert.equal(s.fighters[0].effects['鬼王攻击免疫'],undefined);assert.equal(s.fighters[0].effects['鬼王威力翻倍'],undefined);
 s=turn(make(20156,{enemyId:4693,enemyMoves:[20020]}),20156,20020);assert.equal(s.fighters[0].hp,7875);assert.ok(s.damageEvents.some(e=>e.type==='true'&&e.settledDamage===1125));assert.equal(s.fighters[0].effects['鬼王攻击免疫'].start,2);assert.equal(s.fighters[0].effects['鬼王威力翻倍'],undefined);
});
