'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3200-native.cjs');
test('3200暗夜450原200至400随机回复有多值，技能禁疗及满体上限不改变独立红伤',()=>{
 const seen=new Set();for(let seed=1;seed<=16;seed++){const s=H.turn(H.make(19960,{seed,aStages:{acc:6}}),19960),n=s.fighters[0].hp-4500;assert.ok(n>=200&&n<=400);seen.add(n);assert.ok(s.damageEvents.some(e=>e.sourceSide===0&&e.type==='attack'&&e.settledDamage>0));}assert.ok(seen.size>1);assert.equal(H.turn(H.make(19960,{aHp:8999,aStages:{acc:6}}),19960).fighters[0].hp,9000);assert.equal(H.turn(H.make(19960,{aEffects:{无法通过自身技能恢复体力:{start:1,end:4}},aStages:{acc:6}}),19960).fighters[0].hp,4500);
});
test('3200九死877只真正先手全属性一，后手不加且禁强化阻提升，原生真实敌攻击决定顺序',()=>{
 for(const first of[false,true]){const s=H.turn(H.make(19963,{enemyMoves:[10086],aStats:{spe:first?1000:1},bStats:{spe:100}}),19963,10086);assert.equal(s.turns.at(-1).first,first?0:1);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===(first?1:0)));}const s=H.turn(H.make(19963,{aEffects:{禁强化:{start:1,end:4}},enemyMoves:[10086]}),19963,10086);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===0));
});
