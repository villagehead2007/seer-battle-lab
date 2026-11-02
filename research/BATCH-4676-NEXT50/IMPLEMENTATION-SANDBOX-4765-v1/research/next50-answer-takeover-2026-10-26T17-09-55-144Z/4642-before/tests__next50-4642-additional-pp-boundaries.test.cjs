'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4642-battle.cjs'),{make,pick,turn,key}=H;
// Explicit already-granted premise, using the real frozen1509 carrier. This does not give species4642 skill37345.
const source1509=require('../research/4635-reviewed-snapshot.json').moves.find(m=>m.id===37345);
function fixture(policy){
  const x=pick(440).find(x=>x.moveId===28720),s=make(x);
  assert.equal(source1509.hash,'6c54eedb');
  assert.deepEqual(source1509.effectInstances.find(x=>x.id===1509).args,[1,1]);
  s.fighters[1].soulState.maple1509PPCost={count:3,multiple:3,sourceMove:key(source1509.id)};
  if(policy)s.fighters[1].soulState.qualified1509Coexist4635=policy;
  s.fighters[1].pp[key(920041)]=99;
  return s;
}
test('4642真实440五倍与已授1509三次费用未给策略时013守卫且双方实际PP次数保持准确',()=>{
  const s=fixture(),old=H.E.SOULS;let observed;
  H.E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterUse'&&c.a.side===0)observed={a:c.a,b:c.t};}};
  try{assert.throws(()=>turn(s),/Q-N50-4635-013/);}finally{H.E.SOULS=old;}
  assert.ok(observed,'captured real cloned battle fighters after own actual use');
  assert.equal(observed.a.pp[key(28720)],4);
  assert.equal(observed.b.pp[key(920041)],99);
  assert.equal(observed.b.soulState.maple1509PPCost.count,3);
  assert.equal(observed.b.effects['PP消耗倍增'].multiple,5);
  assert.equal(observed.b.effects['PP消耗倍增'].start,1);
  assert.equal(observed.a.hp,9000);assert.equal(observed.b.hp,9000);
});
test('4642真实440五倍与已授1509明确multiply replace-three maximum资格实际扣15或3或5且各消费一次',()=>{
  for(const[policy,cost]of [['multiply',15],['replace-three',3],['maximum',5]]){
    const s=fixture(policy),o=turn(s);
    assert.equal(o.fighters[0].pp[key(28720)],4);
    assert.equal(o.fighters[1].pp[key(920041)],99-cost);
    assert.equal(o.fighters[1].soulState.maple1509PPCost.count,2);
    assert.equal(o.fighters[1].effects['PP消耗倍增'].multiple,5);
    assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[1].hp,9000);
  }
});
