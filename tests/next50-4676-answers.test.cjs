'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {make,turn,key,sum,timer}=require('./helpers/4676-battle.cjs');
test('4676用户公共回答次数免攻和减伤归零均执行命中附伤',()=>{
  const immune=make({move:19476,index:0});immune.fighters[1].counts.attackNullify=1;turn(immune);
  assert.equal(immune.fighters[1].counts.attackNullify,0);assert.equal(sum(immune),0);
  assert.equal(sum(immune,'percent'),1800);assert.equal(immune.fighters[1].hp,7200);
  const reduced=make({move:19476,index:0});timer(reduced,0,'自身攻击输出定额减少',{amount:100000});turn(reduced);
  assert.equal(sum(reduced),0);assert.equal(sum(reduced,'percent'),1800);assert.equal(reduced.fighters[1].hp,7200);
});
test('4676用户公共回答自爆击败对手保1，未击败死亡停止后续锁层与免异',()=>{
  const killed=make({move:37510,hp:777});killed.fighters[1].hp=1;turn(killed);
  assert.equal(killed.fighters[1].hp,0);assert.equal(killed.fighters[0].hp,1);
  assert.equal(killed.fighters[0].soulState.pendingNextGuard2213.spent,776);
  assert.equal(killed.fighters[0].soulState.pendingNextGuard2213.shield,388);
  assert.equal(killed.fighters[0].counts.immune,1);
  const alive=make({move:37510,hp:777});turn(alive);
  assert.equal(alive.fighters[0].hp,0);assert.ok(alive.fighters[1].hp>0);
  assert.equal(alive.fighters[1].soulState.chiyong1878,undefined);
  assert.equal(alive.fighters[0].counts.immune??0,0);
});
test('4676用户公共回答907负级反正受禁强化拦截，不成功就不清PP',()=>{
  const s=make({move:37511,index:2});s.fighters[0].stages.atk=-2;
  timer(s,0,'禁强化');turn(s);
  assert.equal(s.fighters[0].stages.atk,-2);
  assert.equal(Object.values(s.fighters[1].pp).filter(n=>n===0).length,0);
});
test('4676用户回答锁层在正零负命中等级上相减，下限保持且实际命中伤害与等效等级一致',()=>{
  let hits=0,misses=0;
  for(const stage of [2,0,-5])for(let seed=0;seed<8;seed++){
    const a=make({soul:true,hit:false,seed}),b=make({soul:true,hit:false,seed});
    a.fighters[1].stages.acc=stage;b.fighters[1].stages.acc=Math.max(-6,stage-2);
    a.fighters[1].soulState.chiyong1878={layers:2,sourceSide:0};
    turn(a,20077,12258);turn(b,20077,12258);
    assert.equal(sum(a,'attack',1),sum(b,'attack',1));
    assert.equal(a.fighters[1].pp[key(12258)],29);
    sum(a,'attack',1)>0?hits++:misses++;
  }
  assert.ok(hits>0);assert.ok(misses>0);
});
test('4676用户回答2212成功疲惫当次攻击继续，随后行动受控且免疫仍抵挡',()=>{
  const s=make({move:37509,index:1});turn(s,37509,12258);
  assert.ok(s.fighters[1].ailments['疲惫']);assert.ok(sum(s,'attack',1)>0);
  assert.equal(s.fighters[1].pp[key(12258)],29);
  turn(s,20077,12258);assert.equal(s.fighters[1].pp[key(12258)],29);assert.equal(sum(s,'attack',1),0);
  const immune=make({move:37509,index:1});timer(immune,1,'免异常');turn(immune,37509,12258);
  assert.equal(immune.fighters[1].ailments['疲惫'],undefined);assert.equal(sum(immune,'attack',1),0);
});
test('4676用户回答1827击败共享标记保留，已有共享标记的首次属性用招消费无效',()=>{
  const s=make({move:37511,index:4});s.fighters[1].hp=1;turn(s);
  assert.equal(s.fighters[1].hp,0);assert.equal(s.fighters[1].counts.nextStatusInvalid1827,1);
  const resumed=make({move:20077,index:-1});resumed.fighters[1].counts.nextStatusInvalid1827=s.fighters[1].counts.nextStatusInvalid1827;turn(resumed,20077,20077);
  assert.equal(resumed.fighters[1].counts.nextStatusInvalid1827,0);
  assert.equal(resumed.fighters[1].stages.atk,0);assert.equal(resumed.fighters[1].pp[key(20077)],19);
});
