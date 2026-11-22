'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3033-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
test('3033锁敌只命中一战意只防一，渡世893仅严格满体六项二否则一，封顶和禁强化',()=>{
 for(const[id,aHp,expected]of[[20267,4500,{acc:1}],[20307,4500,{def:1}],[24736,9000,Object.fromEntries(keys.map(k=>[k,2]))],[24736,8999,Object.fromEntries(keys.map(k=>[k,1]))]]){let s=turn(make(id,{aHp}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],expected[k]??0);s=turn(make(id,{aHp,aStages:Object.fromEntries(keys.map(k=>[k,5]))}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],expected[k]?6:5);s=turn(make(id,{aHp,aEffects:{禁强化:{start:1,end:2}}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],0);}
});
test('3033远古之印两5仅降速命中一，佛祖749六项各一，负六封底和真实星皇免弱',()=>{
 for(const[id,affected]of[[22358,['spe','acc']],[24735,keys]])for(const o of [{},{bStages:Object.fromEntries(keys.map(k=>[k,-6]))},{enemyId:3291}]){const s=turn(make(id,o),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],o.enemyId?0:o.bStages?-6:affected.includes(k)?-1:0);}
});
test('3033佛光521只反负级保正级，当次红伤仍原负特攻600，负六反正六且原必中覆盖负命中',()=>{
 let s=turn(make(19284,{aStages:{atk:1,def:-1,spa:-2,spd:2,spe:-3,acc:1}}),19284);assert.deepEqual(s.fighters[0].stages,{atk:1,def:1,spa:2,spd:2,spe:3,acc:1});assert.equal(s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).attackValue,600);s=turn(make(19284,{aStages:{spa:-6,def:6,acc:-6}}),19284);assert.equal(s.fighters[0].stages.spa,6);assert.equal(s.fighters[0].stages.def,6);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0));
});
test('3033第五85吸真实对手双防正二，当前红伤先按原攻，空正级不造强化且保留敌负级',()=>{
 let s=make(19286,{enemyMoves:[24624]});s=turn(s,pp,24624);assert.equal(s.fighters[1].stages.def,2);s=turn(s,19286);assert.equal(s.fighters[1].stages.def,0);assert.equal(s.fighters[1].stages.spd,0);assert.equal(s.fighters[0].stages.def,2);assert.equal(s.fighters[0].stages.spd,2);assert.equal(s.damageEvents.find(e=>e.round===2&&e.type==='attack'&&e.sourceSide===0).attackValue,1200);s=turn(make(19286,{bStages:{def:-2}}),19286);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===0));assert.equal(s.fighters[1].stages.def,-2);
});
test('3033第五709真实KO才翻倍当前正级并六封顶，原负级保持，无KO不翻倍',()=>{
 for(const[bHp,atk,def]of[[1,2,1],[1,5,5],[9000,2,1]]){const s=turn(make(19286,{bHp,aStages:{atk,def,spa:-1}}),19286),killed=bHp===1;assert.equal(s.fighters[1].hp===0,killed);assert.equal(s.fighters[0].stages.atk,killed?Math.min(6,atk*2):atk);assert.equal(s.fighters[0].stages.def,killed?Math.min(6,def*2):def);assert.equal(s.fighters[0].stages.spa,-1);}
});
test('3033天地890有正能力才额外二倍，只有负级或全零不增，吸血溢出基数另待答',()=>{
 for(const[stages,multiplier]of[[{},1],[{def:1},2],[{atk:-1,spa:-2},1]]){const s=turn(make(19285,{aStages:stages}),19285),e=s.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0);assert.ok(e.detail.includes('增减伤 '+multiplier+' ×'));assert.ok(e.damage.settledDamage>0);}
});
test('3033火光12真实10%烧伤初始种子成功失败，首轮周期1125真伤且同种子真实免异常阻挡',()=>{
 let yes=0,no=0,first;for(let seed=1;seed<=64;seed++){const s=turn(make(10253,{seed}),10253);if(s.fighters[1].ailments['烧伤']){yes++;first??=seed;assert.equal(s.damageEvents.filter(e=>e.type==='true'&&e.targetSide===1).reduce((n,e)=>n+e.settledDamage,0),1125);}else no++;}assert.ok(yes>0&&no>0);const s=turn(make(10253,{seed:first,bEffects:{免异常:{start:1,end:3}}}),10253);assert.equal(s.fighters[1].ailments['烧伤'],undefined);assert.ok(!s.damageEvents.some(e=>e.type==='true'&&e.targetSide===1));assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0));
});
