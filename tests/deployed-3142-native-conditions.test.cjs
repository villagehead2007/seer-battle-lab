'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3142-native.cjs'),pp='potion:pp';
test('3142低半516与低于对手946按不同严格阈值翻倍；通用正级与禁强化由原生实际各项承接',()=>{
 const keys=['atk','def','spa','spd','spe','acc'];for(const hp of[4499,4500,4501]){const s=H.turn(H.make(23245,{aHp:hp}),23245),n=hp<4500?2:1;for(const k of keys)assert.equal(s.fighters[0].stages[k],['atk','def','spd','spe'].includes(k)?n:0);}
 for(const hp of[6999,7000,7001]){const s=H.turn(H.make(24971,{aHp:hp,bHp:7000}),24971),n=hp<7000?2:1;for(const k of keys)assert.equal(s.fighters[0].stages[k],n+(hp>7000&&k==='atk'?2:0));assert.equal(s.fighters[0].hp,9000);}
 for(const id of[20363,20364,19730,24377]){const s=H.turn(H.make(id,{aEffects:{禁强化:{start:1,end:3}},aStages:{acc:6}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],k==='acc'?6:0);}
});
test('3142雷裂842仅已有正级才红伤增五成；980先手封真实属性出招，后手不封而敌强化被回末吸取',()=>{
 for(const boost of[false,true]){const s=H.turn(H.make(19729,{aStages:boost?{acc:1}:{},enemyMoves:[20889]}),19729,20889),e=s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack');assert.ok(e.detail.includes('增减伤 '+(boost?1.5:1)+' ×'));assert.equal(s.fighters[0].stages.spe,0);assert.ok(!s.turns.at(-1).events.some(e=>e.text.startsWith('B 方 速度等级 0 → 1')));}
 const s=H.turn(H.make(19729,{enemyMoves:[20889],bEffects:{id984:{start:1,end:1,amount:4}}}),19729,20889);assert.equal(s.turns.at(-1).first,1);assert.ok(s.turns.at(-1).events.some(e=>e.text.startsWith('B 方 速度等级 0 → 1')));assert.equal(s.fighters[0].stages.spe,1);
});
test('3142审判978复用已答吸取前提：实际当轮新双防可吸并反转，自己禁强化仍反转，防消吸保护时不反转',()=>{
 for(const ban of[false,true]){let s=H.make(17977,{enemyMoves:[24624],bEffects:{id984:{start:1,end:1,amount:4}},aEffects:ban?{禁强化:{start:1,end:3}}:{}});s=H.turn(s,17977,24624);assert.equal(s.fighters[1].stages.def,-2);assert.equal(s.fighters[1].stages.spd,-2);assert.equal(s.fighters[0].stages.def,ban?0:2);assert.equal(s.fighters[0].stages.spd,ban?0:2);}
 let s=H.make(17977,{enemyId:3549,enemyMoves:[29392]});s=H.turn(s,pp,29392);s=H.turn(s,17977);assert.ok(Object.values(s.fighters[1].stages).every(n=>n===1));
});
