'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3291-native.cjs');
const blocked={skillBlock:{start:1,end:1}},rage=s=>s.turns[0].events.some(e=>e.text.startsWith('A 方 星皇之怒判定')&&e.text.includes('：触发'));
// Whole-rage immunity/reflection/feedback exception is an explicit human ruling, not an invented API sentence.
test('3291原1097皇怒异常概率及失明施加均不向真实4871嘲风报告异常执行，风龙结初始1保持',()=>{
 let seen=0;const outcomes=new Set();for(let seed=1;seed<=16;seed++){
  const s=H.turn(H.make(30380,{seed,enemyId:4871,aEffects:blocked}),30380);assert.equal(s.fighters[1].soulId,2058);assert.equal(s.fighters[1].soulHash,'6f5c0ef1');if(!rage(s))continue;seen++;outcomes.add(!!s.fighters[1].ailments.失明);
  assert.equal(s.fighters[1].soulState.wind2058.count,1,'整个皇怒不产生风龙结响应');assert.equal((s.windExecutionEvents2058??[]).filter(e=>e.actorSide===0).length,0);
 }assert.ok(seen>0);assert.deepEqual(outcomes,new Set([true,false]));
});

test('3291原1097皇怒50失明不被真实4853低概率异常观察施加暴露，成功失败均保持无曝',()=>{
 let seen=0;const outcomes=new Set();for(let seed=1;seed<=16;seed++){
  const s=H.turn(H.make(30380,{seed,enemyId:4853,aEffects:blocked}),30380);assert.equal(s.fighters[1].soulId,2038);assert.equal(s.fighters[1].soulHash,'5382550b');if(!rage(s))continue;seen++;outcomes.add(!!s.fighters[1].ailments.失明);
  assert.equal(s.fighters[0].soulState.exposure4853,undefined);assert.equal((s.ailmentExecutions4853??[]).length,0);
 }assert.ok(seen>0);assert.deepEqual(outcomes,new Set([true,false]));
});

test('3291原1097技能本体疲惫仍被真实嘲风观察100执行一次，不能为皇怒例外关闭公共异常观察',()=>{
 for(let seed=1;seed<=12;seed++){
  const s=H.turn(H.make(30380,{seed,enemyId:4871}),30380),gains=s.fighters[1].soulState.windGainEvents2058??[];
  assert.equal(s.fighters[1].soulState.wind2058.count,51);assert.equal(gains.length,1);assert.equal(gains[0].chance,100);assert.equal(gains[0].actorSide,0);
 }
});

test('3291原1097失明不是附属异常，真实4888神域之门保持关闭，不把通知函数入口误判成已触发缺陷',()=>{
 let seen=0;for(let seed=1;seed<=12;seed++){
  const s=H.turn(H.make(30380,{seed,enemyId:4888,aEffects:blocked}),30380);assert.equal(s.fighters[1].soulId,2075);assert.equal(s.fighters[1].soulHash,'9fb02d17');if(!s.fighters[1].ailments.失明)continue;seen++;
  assert.equal(H.E.STATUS_RULES.isAuxiliary('失明'),false);assert.deepEqual(s.fighters[1].soulState.ria2075.gates,[]);assert.deepEqual(s.fighters[1].soulState.ria2075.gateEvents,[]);
 }assert.ok(seen>0);
});

test('3291原1097皇怒失明不被真实4643星执转化为星赐，记录原失明且保留来源和默认时长',()=>{
 let seen=0;for(let seed=1;seed<=16;seed++){
  const s=H.turn(H.make(30380,{seed,enemyId:4643,aEffects:blocked,bGear:{resistance1844:{entries:{失明:.5,睡眠:.2},fullBonus:0}}}),30380),f=s.fighters[1];assert.equal(f.soulId,1844);assert.equal(f.soulHash,'552e3440');assert.equal(f.soulState.starRecord1844,'失明');if(!rage(s)||f.effects.statusBlock)continue;seen++;
  assert.ok(f.ailments.失明===2||f.ailments.失明===3);assert.equal(f.ailments.星赐,undefined);assert.equal((f.soulState.starConversions1844??[]).length,0);assert.equal(f.statusState.sources.失明,0);
 }assert.ok(seen>0);
});

test('3291皇怒失明复用最大剩余时长刷新，旧5回不缩短且保留真实施加来源，不开启嘲风观察',()=>{
 let seen=0;for(let seed=1;seed<=16;seed++){
  const s=H.turn(H.make(30380,{seed,enemyId:4871,aEffects:blocked,bAilments:{失明:5}}),30380),f=s.fighters[1];if(!rage(s)||f.effects.statusBlock)continue;seen++;
  assert.equal(f.ailments.失明,5);assert.equal(f.statusState.sources.失明,0);assert.equal(f.soulState.wind2058.count,1);assert.equal((s.windExecutionEvents2058??[]).length,0);
 }assert.ok(seen>0);
});

test('3291本体疲惫仍可被真实4643星执转为星赐，皇怒例外不改普通公共异常转化',()=>{
 let seen=0;for(let seed=1;seed<=16;seed++){
  const s=H.turn(H.make(30380,{seed,enemyId:4643,bGear:{resistance1844:{entries:{疲惫:.5,睡眠:.2},fullBonus:0}}}),30380),f=s.fighters[1],events=f.soulState.starConversions1844??[];assert.equal(f.soulState.starRecord1844,'疲惫');if(!events.length)continue;seen++;
  assert.equal(events.length,1);assert.equal(events[0].from,'疲惫');assert.equal(f.ailments.疲惫,undefined);assert.equal(f.ailments.星赐,3);
 }assert.ok(seen>0);
});
