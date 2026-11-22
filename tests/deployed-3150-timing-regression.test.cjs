'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3150-native.cjs'),pp='potion:pp';
test('3150两魂回初低体后由真实浮动能量跨至高体，低体末麻痹保留且战阶高体同时授次轮红伤奖励',()=>{
 for(const soul of[492,528]){let s=H.turn(H.make(24985,{soul,aHp:4499,extraMoves:[10006]}),24985);assert.equal(s.fighters[0].hp,7499);assert.equal(s.fighters[1].ailments['麻痹'],2);assert.equal(s.fighters[0].effects.id913?.bonus,soul===492?.5:.75);s=H.turn(s,10006);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('增减伤 '+(soul===492?1.5:1.75)+' ×'));}
});
test('3150两魂回初高体受真实攻击后跌破半血，战阶末不授次轮奖励；恰半血两体力分支均不触发',()=>{
 for(const soul of[492,528]){let s=H.turn(H.make(10006,{soul,aHp:5001,aStats:{def:400},bStats:{atk:9999},enemyMoves:[10086]}),pp,10086);assert.ok(s.fighters[0].hp>0&&s.fighters[0].hp<4500);assert.equal(s.fighters[0].effects.id913,undefined);s=H.turn(s,10006);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('增减伤 1 ×'));s=H.turn(H.make(10006,{soul,aHp:4500}),pp);assert.equal(s.fighters[0].effects.id913,undefined);assert.equal(s.fighters[1].ailments['麻痹'],undefined);}
});
test('3150两魂战阶末高体奖励先于回合末中毒，不能改成毒后HP判断；旧静态魂印逻辑继续有效',()=>{
 for(const soul of[492,528]){const s=H.turn(H.make(10006,{soul,aHp:5001,aAilments:{中毒:2}}),pp);assert.equal(s.fighters[0].hp,3876);assert.equal(s.fighters[0].effects.id913?.bonus,soul===492?.5:.75);assert.equal(s.fighters[0].effects.id913.start,2);}
});
