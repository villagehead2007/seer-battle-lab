'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3079-native.cjs'),pp='potion:pp';
test('3079狂雷908成功吸取真实双防二才封下一轮攻属，无效出招消耗原PP且再下一轮恢复攻击',()=>{
 let s=make(19478,{aHp:1,enemyMoves:[24624,10086]});s=turn(s,pp,24624);s=turn(s,19478);assert.equal(s.fighters[0].stages.def,2);assert.equal(s.fighters[0].stages.spd,2);assert.equal(s.fighters[1].stages.def,0);assert.ok(s.fighters[1].effects.attackBlock);assert.ok(s.fighters[1].effects.statusBlock);s=turn(s,pp,10086);assert.equal(s.fighters[1].pp['wiki:10086'],34);assert.ok(!s.damageEvents.some(e=>e.round===3&&e.sourceSide===1&&e.type==='attack'));s=turn(s,pp,10086);assert.equal(s.fighters[1].pp['wiki:10086'],33);assert.ok(s.damageEvents.some(e=>e.round===4&&e.sourceSide===1&&e.type==='attack'&&e.settledDamage>0));
});
test('3079狂雷908被原生四象强化保护阻止吸收时不能封下轮技能，敌仍可真实使用原属性招',()=>{
 let s=make(19478,{enemyId:3549,enemyMoves:[29392],bStats:{spe:2000}});s=turn(s,pp,29392);assert.ok(Object.values(s.fighters[1].stages).some(n=>n>0));s=turn(s,19478);assert.ok(Object.values(s.fighters[1].stages).some(n=>n>0));assert.equal(s.fighters[1].effects.attackBlock,undefined);assert.equal(s.fighters[1].effects.statusBlock,undefined);const before=s.fighters[1].pp['wiki:29392'];s=turn(s,pp,29392);assert.equal(s.fighters[1].pp['wiki:29392'],before-1);
});
test('3079狂雷908无正级与自身禁强化均不封技能，空目标负级保留',()=>{
 for(const blocked of[false,true]){const s=turn(make(19478,{bStages:blocked?{def:2}:{def:-2},aEffects:blocked?{禁强化:{start:1,end:3}}:{}}),19478);assert.equal(s.fighters[1].effects.attackBlock,undefined);assert.equal(s.fighters[1].effects.statusBlock,undefined);assert.equal(s.fighters[1].stages.def,blocked?2:-2);}
});
