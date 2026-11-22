'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3031-native.cjs'),pp='potion:pp';
test('3031魂400回初严格满体才免原生睡眠及能力下降，差1不免且按每轮重新判断',()=>{
 for(const full of[true,false]){let s=turn(make(10127,{aHp:full?9000:8999,enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),pp,22053);assert.equal(s.fighters[0].soulState.lubuFull,full);assert.equal(!!s.fighters[0].ailments['睡眠'],!full);s=turn(make(10127,{aHp:full?9000:8999,enemyId:2995,enemyMoves:[20079]}),pp,20079);assert.equal(s.fighters[0].stages.def,full?0:-1);}
});
test('3031魂400回初满体红增50%资格整轮保留，下一轮残体无加成，真实回血后再下一轮恢复',()=>{
 let s=make(19269,{aHp:9000,extraMoves:[10127],enemyMoves:[10086]});s=turn(s,pp,10086);assert.equal(s.fighters[0].soulState.lubuFull,true);assert.ok(s.fighters[0].hp<9000);s=turn(s,19269);assert.equal(s.fighters[0].hp,9000);assert.equal(s.fighters[0].soulState.lubuFull,false);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0).detail.includes('增减伤 1 ×'));s=turn(s,10127);assert.equal(s.fighters[0].soulState.lubuFull,true);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0).detail.includes('增减伤 1.5 ×'));
});
