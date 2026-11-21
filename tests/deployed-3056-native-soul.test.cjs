'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3056-native.cjs'),{make,turn}=H,T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
test('3056魂410未出手用药不启动，用原生技能后本次在场后续药剂及受控轮仍各回3000，近满封顶且技能禁疗不挡魂印',()=>{
 let s=turn(make(10127,{aHp:1000}),pp);assert.equal(s.fighters[0].hp,1000);assert.ok(!s.fighters[0].soulState.gaiaRecovery);s=turn(s,10127);assert.equal(s.fighters[0].hp,4000);s=turn(s,pp);assert.equal(s.fighters[0].hp,7000);s=turn(s,pp);assert.equal(s.fighters[0].hp,9000);s=turn(make(10127,{aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:3}}}),10127);assert.equal(s.fighters[0].hp,4000);s=turn(make(10127,{aHp:1000,enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),10127,22053);assert.ok(s.fighters[0].ailments['睡眠']);assert.equal(s.fighters[0].hp,4000);s=turn(s,10127);assert.equal(s.fighters[0].pp['wiki:10127'],39);assert.equal(s.fighters[0].hp,7000);
});
test('3056魂410真实离场后启动标记清除，返场仅换人或药剂不回，重新出招才恢复',()=>{
 function member(id){const snapshot=store.species(id);return{snapshot,moves:H.loadout(snapshot,id===3056?[10127]:[]),build:{overrides:{maxHp:9000,atk:1200,spa:1200,def:4000,spd:4000,spe:1000}}};}let g=T.create([[member(3056),member(3004)],[member(2989)]],[0,0],{seed:14,criticals:false});g.slots[0][0].fighter.hp=1000;g.battle.fighters[0].hp=1000;g=T.turn(g,['wiki:10127',pp]);assert.equal(g.battle.fighters[0].hp,4000);g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);assert.ok(!g.battle.fighters[0].soulState.gaiaRecovery);assert.equal(g.battle.fighters[0].hp,4000);g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[0].hp,4000);g=T.turn(g,['wiki:10127',pp]);assert.equal(g.battle.fighters[0].hp,7000);
});
test('3056魂410仅100级实际被技能红伤击败才按完整值反真，敌未死不回1，敌死才回1且未出手不启动3000',()=>{
 for(const[level,bHp]of[[99,9000],[100,9000],[100,1]]){const s=turn(make(10127,{level,aHp:1,bHp,enemyMoves:[10086],aStats:{def:1000},bStats:{atk:9999}}),pp,10086),incoming=s.damageEvents.find(e=>e.type==='attack'&&e.targetSide===0),feedback=s.damageEvents.find(e=>e.type==='true'&&e.sourceSide===0);assert.ok(incoming.settledDamage>1);assert.equal(incoming.hpLoss,1);if(level===99){assert.equal(feedback,undefined);assert.equal(s.fighters[0].hp,0);}else{assert.equal(feedback.settledDamage,incoming.settledDamage);assert.equal(s.fighters[0].hp,bHp===1?1:0);assert.equal(s.fighters[1].hp===0,bHp===1);}}
});
test('3056魂410原生技能先红后固定75致死，临终反真只包含本回合完整红伤',()=>{
 const s=turn(make(10127,{aHp:50,enemyId:3017,enemyMoves:[10761],aStats:{spd:9999},bStats:{spa:180}}),pp,10761),incoming=s.damageEvents.filter(e=>e.sourceSide===1&&e.targetSide===0&&['attack','fixed'].includes(e.type)),feedback=s.damageEvents.find(e=>e.sourceSide===0&&e.type==='true');assert.equal(incoming.length,2);assert.equal(incoming[1].settledDamage,75);assert.ok(incoming[0].settledDamage<50);assert.equal(incoming.reduce((n,e)=>n+e.hpLoss,0),50);assert.equal(feedback.settledDamage,incoming[0].settledDamage);assert.equal(s.fighters[0].hp,0);
});
test('3056魂410未实际死亡的保1不反击，回合末中毒死亡也不作战斗阶段反击',()=>{
 let s=turn(make(10127,{aHp:1,enemyMoves:[10086],aStats:{def:1000},bStats:{atk:9999},aEffects:{致命保留:{start:1,end:2,hp:1}}}),pp,10086);assert.equal(s.fighters[0].hp,1);assert.ok(!s.damageEvents.some(e=>e.sourceSide===0&&e.targetSide===1&&e.type==='true'));s=turn(make(10127,{aHp:1000,aAilments:{中毒:2}}),pp);assert.equal(s.fighters[0].hp,0);assert.ok(!s.damageEvents.some(e=>e.sourceSide===0&&e.targetSide===1&&e.type==='true'));
});
test('3056魂410仅受固定、百分比或真实伤害致死时无反击基数',()=>{
 for(const [type,enemyId,move,settled] of [['fixed',3004,22793,100],['percent',4329,27863,500],['true',4450,28166,200]]){
  const s=turn(make(10127,{aHp:1,bHp:8500,enemyId,enemyMoves:[move],aEffects:{免异常:{start:1,end:1}}}),pp,move);
  const incoming=s.damageEvents.filter(e=>e.targetSide===0);
  assert.deepEqual(incoming.map(e=>[e.type,e.settledDamage,e.hpLoss]),[[type,settled,1]]);
  assert.equal(s.fighters[0].hp,0);
  assert.ok(!s.damageEvents.some(e=>e.sourceSide===0&&e.type==='true'));
 }
});
test('3056魂410不继承上回合红伤，下一回合仅固定致死仍无反击基数',()=>{
 const attack=19153,fixed=22793;
 let s=make(10127,{aHp:1000,enemyId:3004,enemyMoves:[attack,fixed]});
 s=turn(s,pp,attack);
 assert.ok(s.damageEvents.some(e=>e.round===1&&e.targetSide===0&&e.type==='attack'&&e.hpLoss>0));
 assert.ok(s.fighters[0].hp>0);
 s.fighters[0].hp=20;
 s=turn(s,pp,fixed);
 assert.deepEqual(s.damageEvents.filter(e=>e.round===2).map(e=>[e.type,e.targetSide,e.hpLoss]),[['fixed',0,20]]);
 assert.equal(s.fighters[0].hp,0);
});
test('3056魂410区分独立属性伤害与普通攻击红伤',()=>{
 let s=make(10127,{aHp:1,enemyId:4355,enemyMoves:[27925]});
 const move=s.moveDefinitions['wiki:27925'];
 move.operations=move.operations.filter(o=>o.effectId===1792);
 s=turn(s,pp,27925);
 const [incoming]=s.damageEvents;
 assert.equal(incoming.redCategory,'attribute');
 assert.equal(incoming.hpLoss,1);
 assert.equal(s.fighters[0].hp,0);
 assert.equal(s.fighters[0].soulState.gaiaCounterDamage,0);
 assert.ok(!s.damageEvents.some(e=>e.sourceSide===0&&e.type==='true'));
});
