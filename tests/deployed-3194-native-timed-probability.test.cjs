'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3194-native.cjs'),pp='potion:pp',red=s=>s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack');
test('3194无尽693只下两轮红伤额外150第三恢复，真实普通攻击按2点5倍及1倍结算',()=>{
 let s;for(let i=1;i<=32&&!s;i++){let q=H.turn(H.make(23769,{seed:'3194-693-'+i,extraMoves:[10001]}),23769);q=H.turn(q,10001);assert.ok(red(q).detail.includes('增减伤 2.5 ×'));if(q.fighters[1].hp<=0)continue;q=H.turn(q,10001);assert.ok(red(q).detail.includes('增减伤 2.5 ×'));if(q.fighters[1].hp>0)s=q;}assert.ok(s);s=H.turn(s,10001);assert.ok(red(s).detail.includes('增减伤 1 ×'));
});
test('3194魔王极光77三轮用招回复120药剂不触发，169三轮追加害怕有真实成败且到期，死亡448三项每末弱一止于三轮',()=>{
 const seen=new Set();for(let i=1;i<=32&&seen.size<2;i++){const s=H.turn(H.make(23753,{seed:'3194-169-'+i}),23753);assert.equal(s.fighters[0].hp,4620);seen.add(!!s.fighters[1].ailments['害怕']);}assert.equal(seen.size,2);let s=H.turn(H.make(23753,{extraMoves:[20044]}),23753);s=H.turn(s,pp);assert.equal(s.fighters[0].hp,4620);s=H.turn(s,20044);assert.equal(s.fighters[0].hp,4740);assert.equal(s.fighters[0].effects['用招追加异常'],undefined);s=H.turn(s,20044);assert.equal(s.fighters[0].hp,4740);
 s=H.make(23785);for(let r=1;r<=4;r++){s=H.turn(s,r===1?23785:pp);for(const k of['atk','spa','spe'])assert.equal(s.fighters[1].stages[k],-Math.min(r,3));for(const k of['def','spd','acc'])assert.equal(s.fighters[1].stages[k],0);}
});
test('3194超重力691原十五概率直接秒杀有成败，独立两轮封属；黑天1063真实王雷伊增伤五成且普通敌不增',()=>{
 const seen=new Set();for(let i=1;i<=48&&seen.size<2;i++){const s=H.turn(H.make(16866,{seed:'3194-691-'+i}),16866);seen.add(s.fighters[1].hp===0);if(s.fighters[1].hp>0)assert.equal(s.fighters[1].effects.statusBlock.end,2);}assert.equal(seen.size,2);
 for(const id of[2989,3142]){const s=H.turn(H.make(30128,{enemyId:id,aStages:{acc:6}}),30128);assert.ok(red(s).detail.includes('增减伤 '+(id===3142?1.5:1)+' ×'));}
});
