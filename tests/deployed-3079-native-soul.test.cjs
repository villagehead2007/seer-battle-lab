'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{source,make,turn}=require('./helpers/3079-native.cjs');
test('3079魂425严格高半全部技能50麻痹，原生状态瞪眼有初始种子成败，等半低半不授魂麻痹',()=>{
 const seen=new Set();for(const hp of[4499,4500,4501])for(let seed=1;seed<=24;seed++){const s=turn(make(20004,{aHp:hp,seed}),20004);assert.equal(s.fighters[0].soulId,425);assert.equal(s.fighters[0].soulHash,'ba3a5753');assert.equal(s.fighters[0].hp,hp);assert.equal(s.fighters[1].hp,9000);assert.equal(s.fighters[1].stages.def,-1);if(hp===4501)seen.add(!!s.fighters[1].ailments['麻痹']);else assert.equal(s.fighters[1].ailments['麻痹'],undefined);}assert.equal(seen.size,2);
});
test('3079魂425攻击吸取敌最大HP20%，严格低半才40%，完整百分比与理论回复独立于实际HP损失',()=>{
 for(const hp of[4499,4500,4501]){const n=hp<4500?3600:1800,s=turn(make(10006,{aHp:hp}),10006),pink=s.damageEvents.filter(e=>e.type==='percent'&&e.sourceSide===0);assert.equal(pink.length,1);assert.equal(pink[0].settledDamage,n);assert.equal(s.fighters[0].hp,hp+n);const red=s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(s.fighters[1].hp,9000-red.hpLoss-n);}
 const s=turn(make(10006,{aHp:4499,enemyId:3141,bHp:1}),10006),pink=s.damageEvents.find(e=>e.type==='percent'&&e.sourceSide===0);assert.equal(pink.settledDamage,3600);assert.equal(pink.hpLoss,0);assert.equal(s.fighters[1].hp,1);assert.equal(s.fighters[0].hp,8099);
 const resist=turn(make(10006,{aHp:4499,bGear:{resistance:{percent:100}}}),10006);assert.equal(resist.damageEvents.find(e=>e.type==='percent'&&e.sourceSide===0).settledDamage,0);assert.equal(resist.fighters[0].hp,8099);
});
test('3079魂425药剂和疲惫未出招不麻痹也不吸取，零PP拒绝不改战斗，技能禁疗不挡魂回复',()=>{
 for(const action of['potion:pp',10006]){const s=turn(make(10006,{aHp:4501,aAilments:action===10006?{疲惫:2}:{}}),action);assert.equal(s.fighters[0].hp,4501);assert.equal(s.fighters[1].hp,9000);assert.equal(s.fighters[1].ailments['麻痹'],undefined);assert.equal(s.fighters[0].pp['wiki:10006'],source.moves.find(m=>m.id===10006).pp);}
 const s=make(10006,{aHp:4501});s.fighters[0].pp['wiki:10006']=0;const before=structuredClone(s);assert.throws(()=>turn(s,10006),/有 PP/);assert.deepEqual(s,before);const o=turn(make(10006,{aHp:4499,aEffects:{无法通过自身技能恢复体力:{start:1,end:3}}}),10006);assert.equal(o.fighters[0].hp,8099);
});
