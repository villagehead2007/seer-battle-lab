'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {make,turn,pick,key,timer}=require('./helpers/4004-battle.cjs');
const status=require('../dist/status-rules.js');
test('4004荣光之裁不免疫不暂停真实异常，控制仍阻行动、扣血与到期正常、消费后条件恢复',()=>{
 let s=make();s.fighters[0].soulState.holyVerdict=1;s.fighters[0].ailments['疲惫']=2;s.fighters[0].ailments['烧伤']=3;
 const hp=s.fighters[0].hp,pp=s.fighters[0].pp[key(s.auditMoveId)];
 assert.equal(status.conditionPresent(s.fighters[0],1),false);
 let o=turn(s);assert.equal(o.fighters[0].pp[key(s.auditMoveId)],pp);assert.ok(o.fighters[0].hp<hp);
 assert.equal(o.fighters[0].ailments['烧伤'],3);assert.equal(o.fighters[0].ailments['疲惫'],2);
 assert.equal(status.conditionPresent(o.fighters[0],2),false);
 o.fighters[0].soulState.holyVerdict=0;assert.equal(status.conditionPresent(o.fighters[0],2),true);
 o=turn(o);assert.equal(o.fighters[0].ailments['疲惫'],undefined);assert.equal(o.fighters[0].ailments['烧伤'],3);
});
test('4004有裁仍按真实异常剩余总时长转换，麻痹免疫失败仍清除原异常',()=>{
 for(const immune of [false,true]){
  const s=make(undefined,{soul:2121});s.fighters[1].ailments['烧伤']=2;s.fighters[1].ailments['失明']=3;
  if(immune)timer(s,1,'免异常');s.moveDefinitions[key(900040)].power=0;
  const o=turn(s,900031,900040);assert.equal(o.fighters[1].ailments['烧伤'],undefined);assert.equal(o.fighters[1].ailments['失明'],undefined);
  assert.equal(o.fighters[1].ailments['麻痹'],immune?undefined:15);assert.equal(o.fighters[1].soulState.holyVerdict,1);
 }
});
test('4004荣光之裁不阻新异常施加，条件忽略自身和对手但不改变实际清除',()=>{
 const s=make(pick(2548)[0]);s.moveDefinitions[key(s.auditMoveId)].power=0;
 s.fighters[0].soulState.holyVerdict=1;s.fighters[1].soulState.holyVerdict=1;
 assert.equal(status.attempt(s.fighters[1],'中毒',1,{duration:3,random:()=>0}).applied,true);
 assert.equal(status.conditionPresent(s.fighters[1],1),false);
 const o=turn(s);assert.equal(o.fighters[1].ailments['中毒'],undefined);
 assert.ok(o.damageEvents.some(e=>e.type==='true'&&e.settledDamage===210));
 assert.ok(o.damageEvents.some(e=>e.type==='percent'&&e.settledDamage===210));
});
