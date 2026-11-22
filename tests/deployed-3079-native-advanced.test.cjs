'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3079-native.cjs'),pp='potion:pp';
test('3079电击10原生5麻痹与雷祭100麻痹，初始种子成败及免异常仍保本体红伤',()=>{
 const seen=new Set();for(let seed=1;seed<=64;seed++){const s=turn(make(10172,{seed,aHp:1}),10172);seen.add(!!s.fighters[1].ailments['麻痹']);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));}assert.equal(seen.size,2);const s=turn(make(20085,{aHp:1,aStages:{acc:6}}),20085);assert.ok(s.fighters[1].ailments['麻痹']);const blocked=turn(make(20085,{aHp:1,aStages:{acc:6},bEffects:{免异常:{start:1,end:3}}}),20085);assert.equal(blocked.fighters[1].ailments['麻痹'],undefined);
});
test('3079雷暴93固定70与红伤和魂百分比吸取独立，固定抗性只阻该固定附伤',()=>{
 for(const resist of[0,100]){const s=turn(make(16105,{bGear:{resistance:{fixed:resist}}}),16105);assert.equal(s.damageEvents.find(e=>e.type==='fixed'&&e.sourceSide===0).settledDamage,resist?0:70);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));assert.equal(s.damageEvents.find(e=>e.type==='percent'&&e.sourceSide===0).settledDamage,1800);}
});
test('3079雷颤909先手50麻痹有原生种子成败，未触发才固定300，后手无两项且免异仍补偿',()=>{
 const seen=new Set();for(let seed=1;seed<=24;seed++){const s=turn(make(19480,{seed,aHp:1,aStages:{acc:6},enemyMoves:[10086]}),19480,10086),success=!!s.fighters[1].ailments['麻痹'];seen.add(success);const fixed=(s.damageEvents??[]).filter(e=>e.type==='fixed'&&e.sourceSide===0);assert.equal(fixed.length,success?0:1);if(!success)assert.equal(fixed[0].settledDamage,300);}assert.equal(seen.size,2);
 let s=turn(make(19480,{aHp:1000,aStats:{spe:1},enemyMoves:[10086]}),19480,10086);assert.equal(s.fighters[1].ailments['麻痹'],undefined);assert.ok(!s.damageEvents.some(e=>e.type==='fixed'&&e.sourceSide===0));s=turn(make(19480,{aHp:1,enemyMoves:[10086],bEffects:{免异常:{start:1,end:3}}}),19480,10086);assert.equal(s.fighters[1].ailments['麻痹'],undefined);assert.equal(s.damageEvents.find(e=>e.type==='fixed'&&e.sourceSide===0).settledDamage,300);
});
test('3079第五913仅真正清回合才下轮红伤额外50%，当前与再下轮不加成、魂百分比不加成',()=>{
 let s=make(19481,{extraMoves:[10006],enemyId:3036,enemyMoves:[24740]});s=turn(s,pp,24740);s=turn(s,19481);assert.equal(s.fighters[1].effects['免弱'],undefined);assert.ok(s.fighters[0].effects.id913);for(let r=3;r<=4;r++){s=turn(s,10006);const e=s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0),factor=Number(e.detail.match(/增减伤 ([\d.]+)/)[1]);assert.ok(Math.abs(factor-(r===3?1.2:.8))<1e-12,e.detail);assert.equal(s.damageEvents.find(e=>e.round===r&&e.sourceSide===0&&e.type==='percent').settledDamage,1800);}s=turn(make(19481),19481);assert.equal(s.fighters[0].effects.id913,undefined);
});
