'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');const {make,turn,timer,key}=require('./helpers/3763-battle.cjs');
const fixture=(soul,options={})=>make({moveId:14478,index:null},{soul,omit:true,...options});
test('3763 原魂印首回合全次转伤免异常、次回合失效，强化仅转一次',()=>{
 for(const soul of [1043,1816]){const s=fixture(soul,{hp:1000,targetHp:1000}),n=turn(s,900031,900040);const neutral=turn(fixture(null,{hp:1000,targetHp:1000}),900031,900040);assert.equal(n.fighters[0].hp,1000+neutral.fighters[1].lastAttackDamage);assert.equal(n.fighters[1].lastAttackDamage,0);}
 // Compare against a neutral hit because converted attack reports zero actual damage.
 for(const soul of [1043,1816]){const s=fixture(soul,{hp:1000,targetHp:9000});s.moveDefinitions[key(900040)].operations=[{effectId:15,index:0,phase:'afterHit',params:[100],sourceArgs:[100]}];const n=turn(s,900031,900040);assert.equal(n.fighters[0].ailments['害怕'],undefined);if(soul===1816)assert.ok(n.fighters[1].ailments['害怕']);else assert.equal(n.fighters[1].ailments['害怕'],undefined);assert.ok(n.fighters[0].hp>1000);assert.equal(n.fighters[1].lastAttackDamage,0);delete n.fighters[1].ailments['害怕'];n.moveDefinitions[key(900040)].operations=[];n.fighters[0].hp=n.fighters[1].hp=9000;const later=turn(n,900031,900040);assert.ok(later.fighters[1].lastAttackDamage>0);}
});
test('3763 强化首回合未转化即失去恩怜，盾罩计入比较与上限而不扩实际HP',()=>{
 const s=fixture(1816,{hp:500,targetHp:1500,aStats:{maxHp:1000},bStats:{maxHp:3000}});s.fighters[0].suitState.shield=300;s.fighters[0].suitState.barrier=200;const n=turn(s,900031);assert.equal(n.fighters[0].hp,1000);assert.equal(n.fighters[1].hp,1000);assert.equal(n.fighters[0].stats.maxHp,1000);assert.equal(n.fighters[0].soulState.mountainGraceLost,true);assert.equal(n.fighters[0].counts.nextAttackHealing,0);
 n.fighters[0].suitState.shield=0;n.fighters[0].suitState.barrier=0;const later=turn(n,900031,900040);assert.ok(later.fighters[1].lastAttackDamage>0);
 const eq=fixture(1816,{hp:500,targetHp:1000,aStats:{maxHp:1000}});eq.fighters[0].suitState.shield=300;eq.fighters[0].suitState.barrier=200;assert.equal(turn(eq,900031).fighters[0].hp,500);
});
test('3763 两魂印战阶按低体实际回复追加，平体无效和高体反弹期限',()=>{
 for(const soul of [1043,1816]){const s=fixture(soul,{hp:1000,targetHp:8000});s.round=2;const n=turn(s,900031);assert.equal(n.fighters[0].hp,4000);assert.equal(n.fighters[1].hp,5000);const eq=fixture(soul,{hp:5000,targetHp:5000});eq.round=2;assert.equal(turn(eq,900031).fighters[0].hp,5000);const hi=fixture(soul,{hp:8000,targetHp:7000});hi.round=2;assert.equal(turn(hi,900031).fighters[0].effects.reflect.end,3);
 const limited=fixture(soul,{hp:8000,targetHp:9000});limited.round=2;const capped=turn(limited,900031);assert.equal(capped.fighters[0].hp,9000);assert.equal(capped.fighters[1].hp,8000);
 const im=fixture(soul,{hp:1000,targetHp:9000});im.round=2;im.fighters[1].soulId=622;im.fighters[1].ailments['疲惫']=9;const immune=turn(im,900031);assert.equal(immune.fighters[0].hp,4000);assert.equal(immune.fighters[1].hp,9000);
 }
});


test('3763原版转化全部连击而强化只转一次并保留再次恩怜资格',()=>{
 const results=[];for(const soul of [1043,1816]){const s=fixture(soul,{hp:1000,targetHp:1000});s.moveDefinitions[key(900040)].operations=[{effectId:484,index:0,phase:'beforeUse',params:[2,0,2],sourceArgs:[2,0,2]}];const n=turn(s,900031,900040);results.push(n);if(soul===1043)assert.equal(n.fighters[1].lastAttackDamage,0);else {assert.ok(n.fighters[1].lastAttackDamage>0);assert.equal(n.fighters[0].counts.nextAttackHealing,0);assert.equal(n.fighters[0].soulState.mountainGraceLost,false);}}assert.ok(results[0].fighters[0].hp>results[1].fighters[0].hp);
});
