'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4608-battle.cjs');
test('4608已核实1327共同盾整数基数：敌最大HP9001时实际扣血回复和理论值向下取整均3000',()=>{
  const s=H.make(H.pick(1327)[0],{hp:1000,aStats:{atk:3000},bStats:{maxHp:9001}});
  H.timer(s,1,'攻击伤害上限',{amount:299});
  const o=H.turn(s),damage=type=>(o.damageEvents??[]).filter(e=>e.round===1&&e.targetSide===1&&e.type===type).reduce((n,e)=>n+e.settledDamage,0);
  assert.equal(damage('attack'),299);
  assert.equal(damage('percent'),3000);
  assert.equal(o.fighters[0].hp,4000);
  assert.equal(o.fighters[1].hp,5702);
  assert.equal(o.fighters[0].suitState.shield,3000);
});
