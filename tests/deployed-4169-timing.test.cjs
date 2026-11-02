'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{make,pick,turn,timer,key}=require('./helpers/4169-battle.cjs');
const damage=(s,side)=>(s.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===side).reduce((n,e)=>n+e.settledDamage,0);
test('4169 1644整招结束才附异常，本次攻击与多段全部完成，新控制只挡以后用招',()=>{
 let controlled=false;for(let seed=0;seed<100&&!controlled;seed++){
  const s=make(pick(1644)[0],{seed});const o=turn(s,s.auditMoveId,920040);
  assert.ok(damage(o,1)>0);assert.equal(o.fighters[1].pp[key(920040)],98);
  assert.equal(o.randomStatusEvents.filter(x=>x.effectId===1644).length,2);
  assert.equal(o.fighters[0].effects['命轮用后异常印记'].end,4);
  if(Object.keys(o.fighters[1].ailments).some(k=>['疲惫','害怕','麻痹','睡眠','冰封','石化'].includes(k))){
   controlled=true;const next=turn(o,920031,920040);assert.equal(next.fighters[1].pp[key(920040)],98);
  }
 }assert.equal(controlled,true);
});
test('4169 1644异常全部免疫才散布，落在本次技能的新印记本次不扣血不消费，下一次真实消费',()=>{
 const s=make(pick(1644)[0]);timer(s,1,'免异常');s.fighters[1].moves=[key(920040)];
 let o=turn(s,s.auditMoveId,920040);assert.deepEqual(o.fighters[1].ailments,{});assert.equal(o.fighters[1].soulState.fatalMarks[key(920040)],1);
 assert.equal(o.damageEvents.some(e=>e.source==='致命印记使用后'),false);assert.equal(o.fighters[1].hp,9000);
 o=turn(o,920031,920040);assert.equal(o.fighters[1].hp,7500);assert.equal(o.fighters[1].soulState.fatalMarks[key(920040)],1);
 assert.equal(o.fatalMarkEvents.filter(x=>x.effectId===1644).length,2);
});
test('4169 1644不对属性道具控制跳过触发，持续四回合到期消失，攻击未命中仍算用招',()=>{
 let s=make(pick(1644)[0]);let o=turn(s);assert.equal(o.randomStatusEvents?.length??0,0);
 o.fighters[1].ailments['疲惫']=99;o=turn(o,920031,920040);assert.equal(o.randomStatusEvents?.length??0,0);
 delete o.fighters[1].ailments['疲惫'];o.moveDefinitions[key(920040)].alwaysHit=false;o.moveDefinitions[key(920040)].accuracy=0;
 o=turn(o,920031,920040);assert.equal(damage(o,1),0);assert.equal(o.randomStatusEvents.filter(x=>x.effectId===1644).length,2);
 o.fighters[1].ailments={};o=turn(o,920031);assert.equal(o.fighters[0].effects['命轮用后异常印记'],undefined);
 o=turn(o,920031,920040);assert.equal(o.randomStatusEvents.filter(x=>x.effectId===1644).length,2);
});
test('4169 1644死亡边界不继续施加；新三枚印记不关闭已经完成的技能效果',()=>{
 let s=make(pick(1644)[0],{hp:1});let o=turn(s,s.auditMoveId,920040);assert.equal(o.fighters[0].hp,0);assert.equal(o.randomStatusEvents?.length??0,0);
 s=make(pick(1644)[0]);timer(s,1,'免异常');s.fighters[1].moves=[key(920040)];s.fighters[1].soulState.fatalMarks={[key(920040)]:2};
 o=turn(s,s.auditMoveId,920040);assert.equal(o.fighters[1].hp,7200);assert.equal(o.fighters[1].pp[key(920040)],97);assert.equal(o.fighters[1].soulState.fatalMarks[key(920040)],1);
});
