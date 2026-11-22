'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3141-native.cjs'),pp='potion:pp';
test('3141亡灵971真实四轮双吸实时阈值第五停，843只下两轮全技能先制一',()=>{
 let s=H.make(24966,{extraMoves:[20496],aHp:1,aStats:{maxHp:9999},aAilments:{中毒:7,冻伤:7,烧伤:7},bGear:{resistance:{percent:100}}}),hp=1;for(let r=1;r<=5;r++){const n=r<=4?(hp<9999/2?6000:3000):0;s=H.turn(s,r===1?24966:20496);hp=Math.min(9999,hp+n)-3747;assert.equal(s.fighters[0].hp,hp);assert.equal(s.fighters[1].hp,9000);}
 s=H.turn(H.make(24966,{extraMoves:[20496],bGear:{resistance:{percent:100}}}),24966);for(let r=2;r<=4;r++){s=H.turn(s,20496);assert.equal(s.fighters[0].soulState.resolvedPriority.value,(s.fighters[0].soulState.hadesLow?2:0)+(r<=3?1:0));}
});
test('3141死寂180真实清21042四轮免异，743和970依人答穿过防消吸保护完整反转并给先制奖励',()=>{
 let s=H.make(23949,{enemyId:3205,enemyMoves:[21042]});s=H.turn(s,pp,21042);assert.ok(s.fighters[1].effects['免异常']);s=H.turn(s,23949);assert.equal(s.fighters[1].effects['免异常'],undefined);
 for(const id of[17176,19721]){s=H.make(id,{enemyId:3549,enemyMoves:[29392]});s=H.turn(s,pp,29392);const before=structuredClone(s.fighters[1].stages);s=H.turn(s,id);const rewrite=s.stageRewriteEvents.find(e=>e.round===2&&e.sourceSide===0&&e.targetSide===1&&e.kind==='reverse');assert.ok(rewrite);for(const [k,n]of Object.entries(before)){assert.equal(rewrite.after[k],n>0?Math.max(-6,-n*(id===17176?1:2)):n);assert.equal(s.fighters[1].stages[k],n>0?Math.min(6,n*(id===17176?2:4)):n);}assert.equal(s.fighters[0].effects.id984.amount,1);const plain=H.turn(H.make(id,{bStages:{atk:1},bEffects:{强化保护:{start:1,end:4}}}),id);assert.equal(plain.fighters[1].stages.atk,id===17176?-1:-2);assert.equal(plain.fighters[0].effects.id984.amount,1);}
});
test('3141破寂970反转被星皇免弱阻止时仍执行失败消强，冥河743无失败奖励，百分比抗性只阻附伤',()=>{
 let s=H.turn(H.make(19721,{enemyId:3291,bStages:{def:2}}),19721);assert.equal(s.fighters[1].stages.def,0);assert.equal(s.fighters[0].effects.id984,undefined);
 for(const id of[17176,19721]){s=H.turn(H.make(id,{bHp:8000,bGear:{resistance:{percent:100}}}),id);assert.equal(s.damageEvents.find(e=>e.type==='percent'&&e.sourceSide===0).settledDamage,0);assert.ok(s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).settledDamage>0);assert.equal(s.fighters[0].effects.id984,undefined);}
});

