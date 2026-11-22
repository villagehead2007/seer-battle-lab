'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3141-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
test('3141果断命中一黑夜四项一冥府与亡灵全属性一，六封顶及禁强化而附属效果仍生效',()=>{
 for(const[id,v]of[[20496,{acc:1}],[22202,{def:1,spd:1,spa:1,spe:1}],[23950,Object.fromEntries(keys.map(k=>[k,1]))],[24966,Object.fromEntries(keys.map(k=>[k,1]))]])for(const mode of['normal','cap','ban']){const s=H.turn(H.make(id,{aStages:mode==='cap'?Object.fromEntries(keys.map(k=>[k,6])):{},aEffects:mode==='ban'?{禁强化:{start:1,end:3}}:{}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='ban'?0:v[k]??0);if([23950,24966].includes(id))assert.equal(s.fighters[1].hp,6000);}
});
test('3141黑雾闪电之心雷电之影真实各自弱化，负六封底和星皇免弱不削能力',()=>{
 for(const[id,v]of[[20182,{atk:-1,spa:-1}],[22199,{atk:-1,spa:-1,spe:-1}],[22201,{acc:-2}]]){let s=H.turn(H.make(id,{aStages:{acc:6}}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],v[k]??0);s=H.turn(H.make(id,{aStages:{acc:6},bStages:Object.fromEntries(keys.map(k=>[k,-6]))}),id);assert.ok(Object.values(s.fighters[1].stages).every(n=>n===-6));s=H.turn(H.make(id,{aStages:{acc:6},enemyId:3291}),id);assert.ok(Object.values(s.fighters[1].stages).every(n=>n===0));}
});
test('3141深雷清自身弱化，亡者与幽魂反转自身负级不动正级，禁强化阻反转提升',()=>{
 // 521/dcd7a23e沿用已确认规则：先反转，禁强化使提升归零；3仍直接解除。
 for(const id of[14113,17177,19722])for(const ban of[false,true]){const s=H.turn(H.make(id,{aStages:{atk:-2,def:-1,spa:2,acc:6},aEffects:ban?{禁强化:{start:1,end:3}}:{}}),id);assert.equal(s.fighters[0].stages.spa,2);assert.equal(s.fighters[0].stages.atk,id===14113||ban?0:2);assert.equal(s.fighters[0].stages.def,id===14113||ban?0:1);}
});
test('3141魔神闪真实消除正级保留负级，真实29392强化保护阻清；先制一叠低体二',()=>{
 let s=H.turn(H.make(14114,{bStages:{atk:2,def:1,spd:-2}}),14114);assert.equal(s.fighters[1].stages.atk,0);assert.equal(s.fighters[1].stages.def,0);assert.equal(s.fighters[1].stages.spd,-2);assert.equal(s.fighters[0].soulState.resolvedPriority.value,3);s=H.make(14114,{enemyId:3549,enemyMoves:[29392]});s=H.turn(s,pp,29392);const before=structuredClone(s.fighters[1].stages);s=H.turn(s,14114);assert.deepEqual(s.fighters[1].stages,before);
});
test('3141冥河单倍与破寂双倍反转后仅下轮全技能先制一，百分比附伤包含本招红伤新增损血',()=>{
 for(const[id,multiple,pct]of[[17176,1,20],[19721,2,35]]){let s=H.turn(H.make(id,{extraMoves:[20496],bHp:8000,bStages:{def:2,spd:1,atk:-1}}),id);assert.equal(s.fighters[1].stages.def,-2*multiple);assert.equal(s.fighters[1].stages.spd,-multiple);assert.equal(s.fighters[1].stages.atk,-1);const red=s.damageEvents.find(e=>e.sourceSide===0&&e.type==='attack'),pink=s.damageEvents.find(e=>e.sourceSide===0&&e.type==='percent');assert.equal(pink.settledDamage,Math.floor((1000+red.hpLoss)*pct/100));s=H.turn(s,20496);assert.equal(s.fighters[0].soulState.resolvedPriority.value,3);s=H.turn(s,20496);assert.equal(s.fighters[0].soulState.resolvedPriority.value,2);s=H.turn(H.make(id),id);assert.equal(s.fighters[0].effects.id984,undefined);}
});
