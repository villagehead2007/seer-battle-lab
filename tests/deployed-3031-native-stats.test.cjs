'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3031-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
test('3031绝代583真实五槽随机仅一槽PP归零，其他槽原值保持，原已全零不负数且不影响强化',()=>{
 const slots=new Set();for(let seed=1;seed<=24;seed++){const s=make(24731,{seed}),before={...s.fighters[1].pp},out=turn(s,24731,'potion:hp'),zero=Object.keys(out.fighters[1].pp).filter(k=>out.fighters[1].pp[k]===0);assert.equal(zero.length,1);slots.add(zero[0]);for(const k of Object.keys(before))assert.equal(out.fighters[1].pp[k],k===zero[0]?0:before[k]);assert.ok(out.fighters[0].stages.atk>0);}assert.ok(slots.size>1);const s=make(24731);for(const k of s.fighters[1].moves)s.fighters[1].pp[k]=0;const out=turn(s,24731,'potion:hp');assert.ok(Object.values(out.fighters[1].pp).every(n=>n===0));assert.ok(out.fighters[0].stages.atk>0);
});
test('3031果断只命中一不朽只双防二，原生正六封顶与禁强化逐项阻挡',()=>{
 for(const[id,expected]of[[20496,{acc:1}],[21021,{def:2,spd:2}]]){let s=turn(make(id),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],expected[k]??0);s=turn(make(id,{aStages:Object.fromEntries(keys.map(k=>[k,5]))}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],expected[k]?6:5);s=turn(make(id,{aEffects:{禁强化:{start:1,end:2}}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],0);}
});
test('3031绝代622同次50%强化翻倍六项同为一或二，真实初始种子成功失败，封顶和禁强化',()=>{
 let one=0,two=0;for(let seed=1;seed<=24;seed++){const s=turn(make(24731,{seed}),24731),n=s.fighters[0].stages.atk;assert.ok([1,2].includes(n));for(const k of keys)assert.equal(s.fighters[0].stages[k],n);if(n===1)one++;else two++;}assert.ok(one>0&&two>0);let s=turn(make(24731,{aStages:Object.fromEntries(keys.map(k=>[k,5]))}),24731);for(const k of keys)assert.equal(s.fighters[0].stages[k],6);s=turn(make(24731,{aEffects:{禁强化:{start:1,end:2}}}),24731);for(const k of keys)assert.equal(s.fighters[0].stages[k],0);
});
test('3031狂神三项5仅降防速命中一，负六封底且真实星皇免弱',()=>{
 for(const o of [{},{bStages:{def:-6,spe:-6,acc:-6}},{enemyId:3291}]){const s=turn(make(19270,{...o,aStages:{acc:6}}),19270);for(const k of keys)assert.equal(s.fighters[1].stages[k],o.enemyId?0:['def','spe','acc'].includes(k)?o.bStages?-6:-1:0);}
});
test('3031邪念749真实初始种子50%六项同次弱化，自然成功失败且免弱不下降',()=>{
 let yes=0,no=0;for(let seed=1;seed<=32;seed++){const s=turn(make(19271,{seed,aStages:{acc:6}}),19271),n=s.fighters[1].stages.atk;assert.ok([0,-1].includes(n));for(const k of keys)assert.equal(s.fighters[1].stages[k],n);if(n)yes++;else no++;}assert.ok(yes>0&&no>0);const s=turn(make(19271,{enemyId:3291,aStages:{acc:6}}),19271);for(const k of keys)assert.equal(s.fighters[1].stages[k],0);
});
test('3031八荒521只反自身负级保留正级，当次红伤仍取负攻，负六反六且原先制二抢先',()=>{
 let s=turn(make(19273,{aStages:{atk:-2,def:1,spa:-1,spd:2,spe:-3,acc:1},aStats:{spe:1},bStats:{spe:9999},enemyMoves:[10086]}),19273,10086);assert.deepEqual(s.fighters[0].stages,{atk:2,def:1,spa:1,spd:2,spe:3,acc:1});assert.equal(s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).attackValue,600);assert.equal(s.fighters[0].soulState.resolvedPriority.value,2);assert.equal(s.turns[0].first,0);s=turn(make(19273,{aStages:{atk:-6,def:6,acc:-6}}),19273);assert.equal(s.fighters[0].stages.atk,6);assert.equal(s.fighters[0].stages.def,6);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0));
});
test('3031一戟635吸真实对手速度正级成功才授下一轮先制一，到期恢复，空强化无补偿',()=>{
 let s=make(19269,{extraMoves:[10127],enemyMoves:[20889,10086],aStats:{spe:100},bStats:{spe:9999}});s=turn(s,pp,20889);assert.equal(s.fighters[1].stages.spe,1);s=turn(s,19269);assert.equal(s.fighters[1].stages.spe,0);assert.equal(s.fighters[0].stages.spe,1);s=turn(s,10127,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,1);assert.equal(s.turns.at(-1).first,0);s=turn(s,10127,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);assert.equal(s.turns.at(-1).first,1);s=turn(make(19269),19269);assert.equal(s.fighters[0].effects.id984,undefined);
});
