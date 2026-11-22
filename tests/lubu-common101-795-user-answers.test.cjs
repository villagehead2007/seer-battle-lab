'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3031-native.cjs'),B=require('./helpers/3033-native.cjs'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
const hits=(s,type,side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type===type&&e.sourceSide===side);
test('魂400新答只完整红伤吸血，过量实际损1与冥王保1实际损0仍回完整红伤半数，免红零不回',()=>{
 for(const enemyId of[2989,3141]){const s=H.turn(H.make(10127,{aHp:1000,bHp:1,enemyId}),10127),red=hits(s,'attack')[0];assert.ok(red.settledDamage>1);assert.equal(red.hpLoss,enemyId===3141?0:1);assert.equal(s.fighters[0].hp,1000+Math.floor(red.settledDamage/2));}const zero=H.turn(H.make(10127,{aHp:1000,enemyId:3036}),10127);assert.equal(hits(zero,'attack')[0].settledDamage,0);assert.equal(zero.fighters[0].hp,1000);
});
test('魂400新答不吸原生100至200固定及回末2250百分比，实际回血仅该次完整红伤一半',()=>{
 for(const[move,type]of[[19273,'fixed'],[19274,'percent']]){const s=H.turn(H.make(move,{aHp:1000,bHp:5000}),move),red=hits(s,'attack')[0];assert.ok(hits(s,type).some(e=>e.targetSide===1&&e.settledDamage>0));assert.equal(s.fighters[0].hp,1000+Math.floor(red.settledDamage/2));}
});
test('魂400新答不吸816免攻反出的真实伤害，仍正常回技能500，反伤死亡后不能吸红复活',()=>{
 const s=H.turn(H.make(24730,{aHp:1000,enemyMoves:[10086],bStats:{atk:9999}}),24730,10086);assert.ok(hits(s,'true').some(e=>e.targetSide===1&&e.settledDamage>0));assert.equal(s.fighters[0].hp,1500);const dead=H.turn(H.make(10127,{aHp:1,enemyId:3031,enemyMoves:[24730],bStats:{spe:2000}}),10127,24730);assert.equal(hits(dead,'attack')[0].settledDamage,0);assert.ok(hits(dead,'true',1).some(e=>e.hpLoss===1));assert.equal(dead.fighters[0].hp,0);
});
test('用户统一101完整红伤：天地100%目标仅1或保1实际0仍回复完整，禁疗阻挡且近满封顶',()=>{
 for(const enemyId of[2989,3141])for(const blocked of[false,true]){const s=B.turn(B.make(19285,{aHp:1000,bHp:1,enemyId,aEffects:blocked?{'无法通过自身技能恢复体力':{start:1,end:2}}:{}}),19285),red=hits(s,'attack')[0];assert.ok(red.settledDamage>1);assert.equal(red.hpLoss,enemyId===3141?0:1);assert.equal(s.fighters[0].hp,1000+(blocked?0:red.settledDamage));}const full=B.turn(B.make(19285,{aHp:8999,bHp:1}),19285);assert.equal(full.fighters[0].hp,9000);
});
function member(id,stats={},moves=[]){const snapshot=store.species(id);return{snapshot,moves:H.loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:1200,spa:1200,def:4000,spd:4000,spe:1000,...stats}}};}
test('佛晓795人答真实换下重置，两次60后离场返场再次30，实际PP继续3到2且原输入不改',()=>{
 let g=T.create([[member(3033,{},[19286]),member(3056)],[member(2989)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:19286',pp]);g=T.turn(g,['wiki:19286',pp]);assert.equal(g.battle.fighters[0].soulState.damageGrowth['wiki:19286'],2);assert.equal(g.battle.fighters[0].pp['wiki:19286'],3);const before=structuredClone(g);let out=T.turn(g,[{switchTo:1},pp]);assert.deepEqual(g,before);assert.equal(out.slots[0][0].fighter.soulState.damageGrowth?.['wiki:19286']??0,0);out=T.turn(out,[{switchTo:0},pp]);assert.equal(out.battle.fighters[0].pp['wiki:19286'],3);out=T.turn(out,['wiki:19286',pp]);assert.equal(out.battle.fighters[0].soulState.damageGrowth['wiki:19286'],1);assert.equal(out.battle.fighters[0].pp['wiki:19286'],2);assert.ok(out.battle.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0).detail.includes('增减伤 1.3 ×'));
});
test('佛晓795人答实际阵亡并补位后也不保留两次成长，继任者不继承该技能计数',()=>{
 let g=T.create([[member(3033,{maxHp:1000,def:1},[19286]),member(3056)],[member(2989,{atk:9999},[10086])]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:19286',pp]);g=T.turn(g,['wiki:19286',pp]);g=T.turn(g,[pp,'wiki:10086']);assert.equal(g.slots[0][0].fighter.hp,0);g=T.replace(g,[1,null]);assert.equal(g.slots[0][0].fighter.soulState.damageGrowth?.['wiki:19286']??0,0);assert.equal(g.battle.fighters[0].soulState.damageGrowth?.['wiki:19286']??0,0);
});
