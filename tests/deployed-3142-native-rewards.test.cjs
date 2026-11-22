'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3142-native.cjs'),pp='potion:pp';
test('3142第五未击败全属性一和次轮所有技能先制二，实际KO则两项均不授；微弱相性转普通',()=>{
 let s=H.turn(H.make(19734,{extraMoves:[20004],enemyId:3004}),19734);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===1));assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('属性 1 ×'));for(let r=2;r<=3;r++){s=H.turn(s,20004);assert.equal(s.fighters[0].soulState.resolvedPriority.value,r===2?2:0);}
 s=H.turn(H.make(19734,{aHp:1,bHp:1}),19734);assert.equal(s.fighters[1].hp,0);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===0));assert.equal(s.fighters[0].effects.id984,undefined);
});
test('3142第五913真实消21042免异成功仅次轮红伤加百分百，空清不授而未KO奖励独立存在',()=>{
 let s=H.make(19734,{extraMoves:[10006],enemyId:3205,enemyMoves:[21042]});s=H.turn(s,pp,21042);assert.ok(s.fighters[1].effects['免异常']);s=H.turn(s,19734);assert.equal(s.fighters[1].effects['免异常'],undefined);for(let r=3;r<=4;r++){s=H.turn(s,10006);const e=s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack');assert.ok(e.detail.includes('增减伤 '+(r===3?2:1)+' ×'),e.detail);}
 s=H.turn(H.make(19734,{extraMoves:[10006]}),19734);s=H.turn(s,10006);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('增减伤 1 ×'));assert.equal(s.fighters[0].soulState.resolvedPriority.value,2);
});
test('3142凯歌456按本招红伤后严格不足280秒杀，823只有未KO才授下轮必先出手且之后结束',()=>{
 for(const hp of[281,282]){let s=H.turn(H.make(17979,{extraMoves:[20004],aHp:1,bHp:hp,aStats:{atk:1,spe:1},bStats:{def:9999,spe:2000},enemyMoves:[10086],aEffects:{致命保留:{start:1,end:3,hp:1}},aStages:{acc:6}}),17979);assert.equal(s.damageEvents.find(e=>e.sourceSide===0&&e.type==='attack').settledDamage,2);assert.equal(s.fighters[1].hp,hp===281?0:280);if(hp===281)assert.equal(s.fighters[0].effects['所有技能必定先手'],undefined);else{assert.ok(s.fighters[0].effects['所有技能必定先手']);s=H.turn(s,20004,10086);assert.equal(s.turns.at(-1).first,0);s=H.turn(s,20004,10086);assert.equal(s.turns.at(-1).first,1);assert.ok(!s.fighters[0].effects['所有技能必定先手']||s.fighters[0].effects['所有技能必定先手'].end<3);}}
});
