'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3142-native.cjs'),keys=['atk','def','spa','spd','spe','acc'];
test('3142各通用强化与全强化在真实魂印下按本招原项和参数生效，六封顶不越界',()=>{
 for(const[id,v]of[[20363,{def:1,spd:1}],[20364,{atk:2,spe:2}],[19730,{atk:2,spe:2}],[24377,Object.fromEntries(keys.map(k=>[k,1]))]]){let s=H.turn(H.make(id,{aStages:{acc:6}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],k==='acc'?6:v[k]??0);s=H.turn(H.make(id,{aStages:Object.fromEntries(keys.map(k=>[k,6]))}),id);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===6));}
});
test('3142三招按原双防或速度命中弱化，免弱负六及随机两种弱化参数明确，不以魂吸正级掩盖弱化结果',()=>{
 for(const[id,v]of[[20004,{def:-1}],[20086,{def:-1,spd:-1}],[20087,{spe:-1,acc:-1}]]){let s=H.turn(H.make(id,{aStages:{acc:6}}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],v[k]??0);s=H.turn(H.make(id,{aStages:{acc:6},enemyId:3291}),id);assert.ok(Object.values(s.fighters[1].stages).every(n=>n===0));s=H.turn(H.make(id,{aStages:{acc:6},bStages:Object.fromEntries(keys.map(k=>[k,-6]))}),id);assert.ok(Object.values(s.fighters[1].stages).every(n=>n===-6));}
 const seen=new Set();for(let seed=1;seed<=12;seed++){const s=H.turn(H.make(24969,{seed}),24969),reduced=Object.keys(s.fighters[1].stages).filter(k=>s.fighters[1].stages[k]===-2);assert.equal(reduced.length,2);seen.add(reduced.join(','));}assert.ok(seen.size>2);
});
// 521/dcd7a23e/[]复用既有人答：先反转，禁强化时锁为0提升；负级不残留。
test('3142解弱两招清负不动正，狂翼521反负成正，禁强化阻反转提升，原生195无视实际当轮新双防强化',()=>{
 for(const id of[10174,15892,17978])for(const ban of[false,true]){const s=H.turn(H.make(id,{aStages:{atk:-2,def:-1,acc:6},aEffects:ban?{禁强化:{start:1,end:3}}:{}}),id);assert.equal(s.fighters[0].stages.atk,id===17978?ban?0:2:0);assert.equal(s.fighters[0].stages.acc,6);}
 for(const id of[15894,10176]){const s=H.turn(H.make(id,{aStats:{spe:1},enemyMoves:[24624],bStats:{spe:2000},aStages:{acc:6}}),id,24624),e=s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack');assert.ok(e.detail.includes('防御 '+(id===15894?4000:8000)),e.detail);}
});
