'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3150-native.cjs'),pp='potion:pp';
test('3150雷电化身37严格低三分之一双威力，无尽电罚真实双降二且免弱阻挡',()=>{
 for(const hp of[2999,3000,3001]){const s=H.turn(H.make(11202,{aHp:hp,aStages:{acc:6}}),11202);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('威力 '+(hp<3000?180:90)+' '));}
 for(const immune of[false,true]){const s=H.turn(H.make(24983,{bEffects:immune?{免弱:{start:1,end:3}}:{}}),24983);assert.equal(s.fighters[1].stages.spe,immune?0:-2);assert.equal(s.fighters[1].stages.acc,immune?0:-2);assert.equal(s.fighters[1].stages.atk,0);}
});
test('3150闪耀450原250至400随机回复有多值，技能禁疗与溢出；天降50麻痹有成败及免异',()=>{
 const values=new Set(),status=new Set();for(let seed=1;seed<=32;seed++){let s=H.turn(H.make(19763,{seed,aStages:{acc:6}}),19763),gain=s.fighters[0].hp-4500;assert.ok(gain>=250&&gain<=400);values.add(gain);s=H.turn(H.make(19761,{seed,aStages:{acc:6}}),19761);status.add(!!s.fighters[1].ailments['麻痹']);}assert.ok(values.size>1);assert.equal(status.size,2);
 assert.equal(H.turn(H.make(19763,{aHp:8999,aStages:{acc:6}}),19763).fighters[0].hp,9000);assert.equal(H.turn(H.make(19763,{aEffects:{无法通过自身技能恢复体力:{start:1,end:3}},aStages:{acc:6}}),19763).fighters[0].hp,4500);assert.equal(H.turn(H.make(19761,{bEffects:{免异常:{start:1,end:3}},aStages:{acc:6}}),19761).fighters[1].ailments['麻痹'],undefined);
});
test('3150永恒164四轮真实受攻击麻痹而第五停，免异阻状态不阻攻击',()=>{
 let s=H.make(24986,{aHp:8000,enemyMoves:[10086]});s=H.turn(s,24986,10086);assert.ok(s.fighters[1].ailments['麻痹']);for(let r=2;r<=4;r++)s=H.turn(s,pp);s=H.turn(s,pp,10086);assert.equal(s.fighters[1].ailments['麻痹'],undefined);
 s=H.turn(H.make(24986,{enemyMoves:[10086],bEffects:{免异常:{start:1,end:4}}}),24986,10086);assert.equal(s.fighters[1].ailments['麻痹'],undefined);assert.ok(s.damageEvents.some(e=>e.sourceSide===1&&e.type==='attack'&&e.settledDamage>0));
});
test('3150第五942只在清真实回合效果成功时吸取最大体力三分之一，清除失败不吸且禁疗只阻回复',()=>{
 for(const mode of['clear','none','ban']){let s=H.make(19765,{aHp:1000,aStages:{acc:6},enemyId:3205,enemyMoves:[21042],bStats:{spe:2000},aEffects:mode==='ban'?{无法通过自身技能恢复体力:{start:1,end:4}}:{}});s=H.turn(s,19765,mode==='none'?pp:21042);const hits=(s.damageEvents??[]).filter(e=>e.sourceSide===0&&e.type==='percent');assert.equal(hits.length,mode==='none'?0:1);if(hits.length)assert.equal(hits[0].settledDamage,3000);assert.equal(s.fighters[0].hp,mode==='clear'?4000:1000);if(mode!=='none')assert.equal(s.fighters[1].effects['免异常'],undefined);}
});
