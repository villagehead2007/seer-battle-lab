'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const H3642=require('./helpers/3642-battle.cjs'),H4474=require('./helpers/4474-battle.cjs');
test('性能夹具等价：3642每个独立种子仍执行真实118/604，克隆初始化与重新创建完整状态一致',()=>{
  for(const id of [118,604]){
    const entry=H3642.pick(id)[0],fixture=H3642.make(entry),unchanged=structuredClone(fixture);
    for(const seed of [0,749,1499]){
      const clone=structuredClone(fixture);clone.rng=seed;
      const fresh=H3642.make(entry,{seed});
      assert.deepEqual(clone,fresh);
      const actual=H3642.turn(clone),expected=H3642.turn(fresh);
      assert.deepEqual(actual,expected);
      assert.ok(actual.fighters[1].hp<9000);
      assert.deepEqual(fixture,unchanged);
    }
  }
});
test('性能夹具等价：4474固定吸取保留正级两分支及种子，HP/伤害/PP完整结果与逐次初始化相同',()=>{
  const entry=H4474.pick(1694)[0];
  for(const boost of [false,true]){
    const fixture=H4474.make(entry,{hp:1000}),unchanged=structuredClone(fixture);
    for(const seed of [0,699,1399]){
      const clone=structuredClone(fixture);clone.rng=seed;
      const fresh=H4474.make(entry,{hp:1000,seed});
      if(boost){clone.fighters[0].stages.acc=1;fresh.fighters[0].stages.acc=1;}
      assert.deepEqual(clone,fresh);
      const actual=H4474.turn(clone),expected=H4474.turn(fresh);
      assert.deepEqual(actual,expected);
      assert.ok(actual.fighters[0].hp>1000);
      assert.deepEqual(fixture,unchanged);
    }
  }
});
