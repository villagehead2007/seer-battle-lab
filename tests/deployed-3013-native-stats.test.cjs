'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3013-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
test('3013四个4与时空585真实按指定参数强化，承载速度二空间双防二全项一互不冒充，正六封顶禁强化',()=>{
 for(const[id,expected]of[[20044,{def:1}],[20744,{spe:2}],[24687,{def:2,spd:2}],[24689,{atk:1,def:1,spa:1,spd:1,spe:1,acc:1}]]){let s=turn(make(id),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],expected[k]??0,id+'/'+k);s=turn(make(id,{aStages:Object.fromEntries(keys.map(k=>[k,5]))}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],expected[k]?6:5);s=turn(make(id,{aEffects:{禁强化:{start:1,end:2}}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],0);}
});
test('3013四5逐索引原星罗降攻特攻二吞噬降特防命中一，其他能力不动，负六封底星皇免弱',()=>{
 for(const[id,expected]of[[21881,{atk:-2,spa:-2}],[19191,{spd:-1,acc:-1}]]){let s=turn(make(id,{aStages:{acc:6}}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],expected[k]??0);s=turn(make(id,{aStages:{acc:6},bStages:Object.fromEntries(keys.map(k=>[k,-6]))}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],-6);s=turn(make(id,{enemyId:3291,aStages:{acc:6}}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],0);}
});
test('3013尘埃521反转自身负级保留正级，本体攻击值仍为反转前600，原必中先于命中负级反转',()=>{
 let s=turn(make(19193,{aStages:{atk:-2,def:1,spa:-1,spd:2,spe:-3,acc:-6}}),19193);assert.deepEqual(s.fighters[0].stages,{atk:2,def:1,spa:1,spd:2,spe:3,acc:6});assert.equal(s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).attackValue,600);s=turn(make(19193,{aStages:{atk:-6,def:6}}),19193);assert.equal(s.fighters[0].stages.atk,6);assert.equal(s.fighters[0].stages.def,6);s=turn(make(19193,{aStages:{atk:1,def:2}}),19193);assert.equal(s.fighters[0].stages.atk,1);assert.equal(s.fighters[0].stages.def,2);
});
