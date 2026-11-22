'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3004-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
test('3004十项原生4与585按真实参数分别强化，全项一正六封顶禁强化，龙族特攻二不误成一',()=>{
 for(const [id,expected]of [[20369,{acc:1}],[20444,{def:1}],[22794,{def:1,spa:1,spd:1,acc:1}],[23553,{def:1,spa:2,spd:1,acc:1}],[24667,{atk:1,def:1,spa:1,spd:1,spe:1,acc:1}]]){let s=turn(make(id),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],expected[k]??0,id+'/'+k);s=turn(make(id,{aStages:Object.fromEntries(keys.map(k=>[k,5]))}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],expected[k]?6:5);s=turn(make(id,{aEffects:{禁强化:{start:1,end:2}}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],0);}
});
test('3004五个必定5实例只按索引降低攻特攻二速度命中一，负六封底且真实星皇免弱',()=>{
 for(const [id,expected]of [[20445,{acc:-1}],[20447,{spe:-1,acc:-1}],[20448,{atk:-2,spa:-2}]]){let s=turn(make(id),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],expected[k]??0);s=turn(make(id,{bStages:Object.fromEntries(keys.map(k=>[k,-6]))}),id);for(const n of Object.values(s.fighters[1].stages))assert.equal(n,-6);s=turn(make(id,{enemyId:3291}),id);for(const n of Object.values(s.fighters[1].stages))assert.equal(n,0);}
});
test('3004魔龙咒10%特防弱化有真实自然成功失败，原多目标三不转三次判定且星皇免弱',()=>{
 let yes=0,no=0;for(let seed=1;seed<=64;seed++){const s=turn(make(10961,{seed}),10961);assert.ok([0,-1].includes(s.fighters[1].stages.spd));for(const k of keys.filter(k=>k!=='spd'))assert.equal(s.fighters[1].stages[k],0);assert.equal(s.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0).length,1);if(s.fighters[1].stages.spd<0)yes++;else no++;}assert.ok(yes>0&&no>0);let s=turn(make(10961,{enemyId:3291}),10961);assert.equal(s.fighters[1].stages.spd,0);s=turn(make(10961,{bStages:{spd:-6}}),10961);assert.equal(s.fighters[1].stages.spd,-6);
});
test('3004三个3只解除自身负级保留正级，伤害仍按解除前攻击值，明确不可解除时维持原负级',()=>{
 for(const id of [15119,16439,19151]){const initial={atk:-2,def:1,spa:-1,spd:2,spe:-3,acc:0};let s=turn(make(id,{aStages:initial}),id);assert.deepEqual(s.fighters[0].stages,{atk:0,def:1,spa:0,spd:2,spe:0,acc:0});assert.equal(s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).attackValue,600);s=turn(make(id,{aStages:{atk:-2},aEffects:{弱化不可解除反转:{start:1,end:2}}}),id);assert.equal(s.fighters[0].stages.atk,-2);s=turn(make(id,{aStages:{atk:2,def:1}}),id);assert.equal(s.fighters[0].stages.atk,2);assert.equal(s.fighters[0].stages.def,1);}
});
test('3004神经与龙族两33真实清穿梭正速只保留负防，龙族自身四强化独立，真实繁苍保护阻止消强',()=>{
 for(const id of [22793,23553]){let s=make(id,{enemyMoves:[20889],bStages:{def:-2}});s=turn(s,pp,20889);assert.equal(s.fighters[1].stages.spe,1);s=turn(s,id);assert.equal(s.fighters[1].stages.spe,0);assert.equal(s.fighters[1].stages.def,-2);if(id===23553){assert.equal(s.fighters[0].stages.spa,2);assert.equal(s.fighters[0].stages.def,1);}s=make(id,{enemyId:3549,enemyMoves:[29392]});s=turn(s,pp,29392);const initial={...s.fighters[1].stages};assert.ok(Object.values(initial).some(n=>n>0));s=turn(s,id);assert.deepEqual(s.fighters[1].stages,initial);}
});
