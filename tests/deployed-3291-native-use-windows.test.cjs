'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3291-native.cjs');

test('3291原1096持续吸取按实际用招，不以命中为门；MISS整招无效也吸取，被控与药剂不吸取',()=>{
 for(const mode of ['normal','miss','invalid','control','item','zero']){
  let s=H.make(25295,{extraMoves:[10499]});s=H.turn(s,25295);s.fighters[0].hp=1000;s.fighters[1].hp=9000;
  if(mode==='miss')s.fighters[0].effects.攻击必失={start:2,end:2};
  if(mode==='invalid')s.fighters[0].effects.skillBlock={start:2,end:2};
  if(mode==='control')s.fighters[0].ailments.睡眠=3;
  if(mode==='zero')s.fighters[1].effects.攻击伤害免疫={start:2,end:2};
  const before=s.fighters[0].pp['wiki:10499'];s=H.turn(s,mode==='item'?'potion:pp':10499);
  const expected=['control','item'].includes(mode)?0:6000,drain=s.damageEvents.filter(e=>e.round===2&&e.sourceSide===0&&e.type==='percent').reduce((n,e)=>n+e.settledDamage,0);
  assert.equal(drain,expected,mode);assert.equal(s.fighters[0].pp['wiki:10499'],before-Number(!['control','item'].includes(mode)),mode);
  assert.equal(s.fighters[0].hp,mode==='control'?1000:2125+expected,mode);
 }
});

test('3291原1096半体边界吸取不翻倍、禁技能回复只阻回血而不阻百分比伤害，第四回到期',()=>{
 for(const hp of [4499,4500]){
  let s=H.make(25295,{extraMoves:[10499]});s=H.turn(s,25295);s.fighters[0].hp=hp;s.fighters[1].hp=9000;s.fighters[0].effects.技能禁疗={start:2,end:2};
  s=H.turn(s,10499);const amount=s.damageEvents.filter(e=>e.round===2&&e.type==='percent'&&e.sourceSide===0).reduce((n,e)=>n+e.settledDamage,0);
  assert.equal(amount,hp<4500?6000:3000);assert.equal(s.fighters[0].hp,hp+1125,'只有独立星赐魂印回复');
 }
 let s=H.make(25295,{extraMoves:[10499]});s=H.turn(s,25295);assert.equal(s.fighters[0].effects.drain.end,4);
 for(let r=2;r<=5;r++){s.fighters[1].hp=9000;s=H.turn(s,10499);const damage=s.damageEvents.filter(e=>e.round===r&&e.type==='percent'&&e.sourceSide===0).reduce((n,e)=>n+e.settledDamage,0);assert.equal(damage,r<=4?3000:0,'round'+r);}
});

test('3291原1095门对真实属性用招各槽PP降低遵守PP保护，原技能自身仍消耗一次PP',()=>{
 for(const protectedPP of [false,true]){
  const s=H.make(10499,{enemyId:3291,enemyMoves:[20530],aEffects:{gate:{start:1,end:3}},bEffects:protectedPP?{PP保护:{start:1,end:3}}:{}}),before={...s.fighters[1].pp},out=H.turn(s,10499,20530),after=out.fighters[1].pp;
  for(const key of out.fighters[1].moves){const cost=key==='wiki:20530'?1:0,loss=before[key]-after[key]-cost;if(protectedPP)assert.equal(loss,0,key);else assert.ok(loss>=1&&loss<=3,key+':'+loss);}
 }
});
