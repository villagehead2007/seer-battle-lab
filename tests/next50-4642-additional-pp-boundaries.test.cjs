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
test('4642原生440五倍与1509三倍相加每次费用8并消费一次',()=>{const s=fixture(),o=turn(s);assert.equal(o.fighters[0].pp[key(28720)],4);assert.equal(o.fighters[1].pp[key(920041)],91);assert.equal(o.fighters[1].soulState.maple1509PPCost.count,2);assert.equal(o.fighters[1].effects['PP消耗倍增'].multiple,5);});

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
