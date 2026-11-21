'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3102-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
test('3102气力斗志和气载按原各项强化，真实先前攻击封属才攻额外二，六封顶和禁强化不挡回血吸取',()=>{
 for(const[id,v]of[[20117,{atk:1}],[20164,{spe:1,acc:1}],[24882,Object.fromEntries(keys.map(k=>[k,1]))]])for(const mode of['normal','cap','ban']){const s=turn(make(id,{aStages:mode==='cap'?Object.fromEntries(keys.map(k=>[k,6])):{},aEffects:mode==='ban'?{禁强化:{start:1,end:3}}:{}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='ban'?0:v[k]??0);if(id===24882){assert.equal(s.fighters[0].hp,9000);assert.equal(s.fighters[1].hp,6000);}}
 for(const ban of[false,true]){let s=make(10127,{extraMoves:[24882],aEffects:ban?{禁强化:{start:1,end:4}}:{}});s=turn(s,10127);assert.ok(s.fighters[1].effects.statusBlock);s=turn(s,24882);for(const k of keys)assert.equal(s.fighters[0].stages[k],ban?0:k==='atk'?3:1);}
});
test('3102破攻减攻击二，拳冲减特攻命中二，负六封底且原生星皇免弱',()=>{
 for(const[id,v]of[[20514,{atk:-2}],[19562,{spa:-2,acc:-2}]]){let s=turn(make(id,{aStages:{acc:6}}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],v[k]??0);s=turn(make(id,{aStages:{acc:6},bStages:Object.fromEntries(keys.map(k=>[k,-6]))}),id);assert.ok(Object.values(s.fighters[1].stages).every(n=>n===-6));s=turn(make(id,{aStages:{acc:6},enemyId:3291}),id);assert.ok(Object.values(s.fighters[1].stages).every(n=>n===0));}
});
test('3102不败583清真实一槽PP，24初始种子多选择，PP保护阻止而自身免反及免弱仍有效',()=>{
 const seen=new Set();for(let seed=1;seed<=24;seed++){const s=turn(make(24881,{seed,enemyMoves:[10086],bStats:{spe:9999}}),24881,10086),zero=Object.keys(s.fighters[1].pp).filter(k=>s.fighters[1].pp[k]===0);assert.equal(zero.length,1);seen.add(zero[0]);assert.ok(s.fighters[0].effects.reflect);assert.ok(s.fighters[0].effects['免弱']);}assert.ok(seen.size>2);const s=turn(make(24881,{bEffects:{PP保护:{start:1,end:3}}}),24881);assert.ok(Object.values(s.fighters[1].pp).every(n=>n>0));assert.ok(s.fighters[0].effects.reflect);assert.ok(s.fighters[0].effects['免弱']);
});
