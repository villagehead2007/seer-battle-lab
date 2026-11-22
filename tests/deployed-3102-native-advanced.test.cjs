'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3102-native.cjs'),pp='potion:pp';
test('3102恐惧15原生5害怕有初始种子成败，免异常阻状态不阻红伤与魂回血',()=>{
 const seen=new Set();for(let seed=1;seed<=64;seed++){const s=turn(make(10650,{seed,aStages:{acc:6}}),10650);seen.add(!!s.fighters[1].ailments['害怕']);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));}assert.equal(seen.size,2);const s=turn(make(10650,{aStages:{acc:6},bEffects:{免异常:{start:1,end:3}}}),10650);assert.equal(s.fighters[1].ailments['害怕'],undefined);assert.ok(s.fighters[0].hp>4500);
});
test('3102盛怒937原生50疲惫成败，未触发才下两轮先制负二，免异仍补偿且第三轮恢复',()=>{
 const seen=new Set();for(let seed=1;seed<=32;seed++){const s=turn(make(19564,{seed}),19564),success=!!s.fighters[1].ailments['疲惫'];seen.add(success);assert.equal(!!s.fighters[1].effects.id984,!success);if(!success)assert.deepEqual(s.fighters[1].effects.id984,{start:2,end:3,amount:-2});}assert.equal(seen.size,2);let s=turn(make(19564,{enemyMoves:[10086],bEffects:{免异常:{start:1,end:4}}}),19564);assert.equal(s.fighters[1].ailments['疲惫'],undefined);for(let r=2;r<=4;r++){s=turn(s,pp,10086);assert.equal(s.fighters[1].soulState.resolvedPriority.value,r<=3?-2:0);}
});
test('3102第五978真实双防二吸到自己并把敌正级反成负二，自己禁强化只阻自身获得，不改旧负级与当前旧防',()=>{
 for(const ban of[false,true]){let s=make(19565,{enemyMoves:[24624],aEffects:ban?{禁强化:{start:1,end:4}}:{},bStages:{atk:-1}});s=turn(s,pp,24624);s=turn(s,19565);assert.equal(s.fighters[0].stages.def,ban?0:2);assert.equal(s.fighters[0].stages.spd,ban?0:2);assert.equal(s.fighters[1].stages.def,-2);assert.equal(s.fighters[1].stages.spd,-2);assert.equal(s.fighters[1].stages.atk,-1);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0).detail.includes('防御 8000'));}
 for(const ban of[false,true]){let s=make(19565,{enemyId:3549,enemyMoves:[29392],aEffects:ban?{禁强化:{start:1,end:4}}:{}});s=turn(s,pp,29392);const before=structuredClone(s.fighters[1].stages);assert.ok(Object.values(before).some(n=>n>0));s=turn(s,19565);assert.deepEqual(s.fighters[1].stages,before);}
 const immune=turn(make(19565,{enemyId:3291,bStages:{def:2}}),19565);assert.equal(immune.fighters[0].stages.def,2);assert.equal(immune.fighters[1].stages.def,0);
});
