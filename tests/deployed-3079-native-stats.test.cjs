'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3079-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
test('3079雷皇585五项与极鸣六项强化按原参数，六封顶禁强化不挡独立回血，低体与等高体恢复倍率分别',()=>{
 for(const[id,values]of[[23360,{atk:1,def:1,spd:1,spe:1,acc:1}],[24839,Object.fromEntries(keys.map(k=>[k,1]))]])for(const mode of['normal','cap','blocked']){const s=turn(make(id,{aStages:mode==='cap'?Object.fromEntries(keys.map(k=>[k,6])):{},aEffects:mode==='blocked'?{禁强化:{start:1,end:3}}:{}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='blocked'?0:values[k]??0);assert.equal(s.fighters[0].hp,id===23360?7500:9000);}
 for(const[aHp,bHp,n]of[[1000,9000,6000],[4000,4000,3000],[4001,4000,3000]]){const s=turn(make(24839,{aHp,bHp}),24839);assert.equal(s.fighters[0].hp,Math.min(9000,aHp+n));}
});
test('3079瞪眼舞空原生降防降命按一，负六封底且真实星皇免弱',()=>{
 for(const id of[20004,23358]){let s=turn(make(id),id);assert.equal(s.fighters[1].stages.def,-1);assert.equal(s.fighters[1].stages.acc,id===23358?-1:0);s=turn(make(id,{bStages:{def:-6,acc:-6}}),id);assert.equal(s.fighters[1].stages.def,-6);assert.equal(s.fighters[1].stages.acc,-6);s=turn(make(id,{enemyId:3291}),id);assert.ok(Object.values(s.fighters[1].stages).every(n=>n===0));}
});
test('3079百万3清负级与金色733反负级且成功才麻痹，当前物特先按对应负攻600，原正级保留',()=>{
 for(const id of[16104,19479]){const s=turn(make(id,{aStages:{atk:-2,spa:-2,def:2,acc:6}}),id);assert.equal(s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).attackValue,600);assert.equal(s.fighters[0].stages.atk,id===16104?0:2);assert.equal(s.fighters[0].stages.spa,id===16104?0:2);assert.equal(s.fighters[0].stages.def,2);assert.equal(!!s.fighters[1].ailments['麻痹'],id===19479);}const s=turn(make(19479),19479);assert.equal(s.fighters[1].ailments['麻痹'],undefined);
});
test('3079雷皇33多段清真实双防二但不偷能力，激雷2与惊雷37均严格低半才威力两倍',()=>{
 let s=make(16103,{enemyMoves:[24624]});s=turn(s,pp,24624);s=turn(s,16103);assert.equal(s.fighters[1].stages.def,0);assert.equal(s.fighters[1].stages.spd,0);assert.equal(s.fighters[0].stages.def,0);assert.equal(s.fighters[0].stages.spd,0);
 for(const id of[16101,10168])for(const hp of[4499,4500,4501]){const s=turn(make(id,id===16101?{bHp:hp}:{aHp:hp}),id),p=(id===16101?80:55)*(hp<4500?2:1),e=s.turns.at(-1).events.find(e=>e.damage?.type==='attack');assert.ok(e.detail.includes('威力 '+p+' ·'),e.detail);}
});
