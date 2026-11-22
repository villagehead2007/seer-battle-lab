'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3017-native.cjs'),keys=['atk','def','spa','spd','spe','acc'],pp='potion:pp';
test('3017固定4与585逐索引强化且魂印双防末另加二，狂暴自身防御减一不误作加一，禁强化不挡负级',()=>{
 for(const[id,delta]of[[20203,{atk:2,def:-1}],[20139,{spd:2}],[22831,{atk:1,spd:1,spe:1,acc:1}],[23528,{def:2,spd:2}],[23529,{atk:2,spe:1,acc:1}],[24696,{atk:1,def:1,spa:1,spd:1,spe:1,acc:1}]]){
  let s=turn(make(id),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],(delta[k]??0)+(['def','spd'].includes(k)?2:0),id+'/'+k);
  s=turn(make(id,{aStages:Object.fromEntries(keys.map(k=>[k,5]))}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],Math.min(6,5+(delta[k]??0)+(['def','spd'].includes(k)?2:0)));
  s=turn(make(id,{aEffects:{禁强化:{start:1,end:2}}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],Math.min(0,delta[k]??0));
 }
 let s=turn(make(20203,{aStages:{def:-6}}),20203);assert.equal(s.fighters[0].stages.def,-4);assert.ok(s.turns[0].events.some(e=>e.text.includes('防御等级 -6 → -4')));
});
test('3017地痕20概率只加自身防御一，自然成功失败仍各自叠魂印二，禁强化阻挡及正六封顶',()=>{
 let yes=0,no=0;for(let seed=1;seed<=48;seed++){const s=turn(make(10757,{seed}),10757);assert.ok([2,3].includes(s.fighters[0].stages.def));if(s.fighters[0].stages.def===3)yes++;else no++;assert.equal(s.fighters[0].stages.spd,2);for(const k of['atk','spa','spe','acc'])assert.equal(s.fighters[0].stages[k],0);}assert.ok(yes>0&&no>0);let s=turn(make(10757,{aStages:{def:6}}),10757);assert.equal(s.fighters[0].stages.def,6);s=turn(make(10757,{aEffects:{禁强化:{start:1,end:2}}}),10757);assert.equal(s.fighters[0].stages.def,0);
});
test('3017威仪六5咆哮双防二怒龙防一按指定索引弱化，负六封底真实星皇免弱，潜龙10%攻二自然成功失败',()=>{
 for(const[id,delta]of[[20338,{atk:-1,def:-1,spa:-1,spd:-1,spe:-1,acc:-1}],[20339,{def:-2,spd:-2}],[15181,{def:-1}]]){let s=turn(make(id,{aStages:{acc:6}}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],delta[k]??0,id+'/'+k);s=turn(make(id,{aStages:{acc:6},bStages:Object.fromEntries(keys.map(k=>[k,-6]))}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],-6);s=turn(make(id,{aStages:{acc:6},enemyId:3291}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],0);}
 let yes=0,no=0;for(let seed=1;seed<=64;seed++){const s=turn(make(10760,{seed}),10760);assert.ok([0,-2].includes(s.fighters[1].stages.atk));if(s.fighters[1].stages.atk===-2)yes++;else no++;for(const k of keys.filter(k=>k!=='atk'))assert.equal(s.fighters[1].stages[k],0);}assert.ok(yes>0&&no>0);let s=turn(make(10760,{enemyId:3291}),10760);assert.equal(s.fighters[1].stages.atk,0);s=turn(make(10760,{bStages:{atk:-6}}),10760);assert.equal(s.fighters[1].stages.atk,-6);
});
test('3017天灵与狂龙两3命中后仅清自身负级而本次红伤取旧攻击值，MISS不清负，魂印末双防独立',()=>{
 for(const id of[15182,19206]){let s=turn(make(id,{aStages:{atk:-2,def:1,spa:2,spd:-1,spe:-3,acc:6}}),id);assert.deepEqual(s.fighters[0].stages,{atk:0,def:3,spa:2,spd:2,spe:0,acc:6});const m=s.moveDefinitions['wiki:'+id];assert.equal(s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).attackValue,m.kind==='physical'?600:7200);s=turn(make(id,{aStages:{atk:-2,acc:-6}}),id);assert.equal(s.fighters[0].stages.atk,-2);assert.equal(s.fighters[0].stages.acc,-6);assert.equal(s.fighters[0].stages.def,2);}
});
test('3017碎骨破灭两33真实清穿梭正速保留负防，繁苍保护阻挡消强，空强化不改负六',()=>{
 for(const id of[15180,16396]){let s=make(id,{enemyMoves:[20889],bStages:{def:-2},aStages:{acc:6}});s=turn(s,pp,20889);assert.equal(s.fighters[1].stages.spe,1);s=turn(s,id);assert.equal(s.fighters[1].stages.spe,0);assert.equal(s.fighters[1].stages.def,-2);s=make(id,{enemyId:3549,enemyMoves:[29392],aStages:{acc:6}});s=turn(s,pp,29392);const before={...s.fighters[1].stages};assert.ok(Object.values(before).some(n=>n>0));s=turn(s,id);assert.deepEqual(s.fighters[1].stages,before);s=turn(make(id,{bStages:{def:-6},aStages:{acc:6}}),id);assert.equal(s.fighters[1].stages.def,-6);}
});
