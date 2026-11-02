'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {make,turn,timer,sum,key}=require('./helpers/4683-battle.cjs');
test('4683所有技能0PP仍尝试清强，清强被保护时也完成各槽PP消耗',()=>{
  const zero=make({move:37560,index:-1,soul:true});zero.moveDefinitions[key(37561)].type='机械';
  for(const k of zero.fighters[0].moves)zero.fighters[0].pp[k]=0;zero.fighters[1].stages.atk=2;
  turn(zero,null,37561);assert.ok(Object.values(zero.fighters[0].pp).every(n=>n===0));assert.equal(zero.fighters[1].stages.atk,0);
  const protectedState=make({move:37560,index:-1,soul:true});protectedState.moveDefinitions[key(37561)].type='机械';
  protectedState.fighters[1].stages.atk=2;timer(protectedState,1,'强化保护');
  const before={...protectedState.fighters[0].pp};turn(protectedState,null,37561);
  for(const k of protectedState.fighters[0].moves)assert.equal(protectedState.fighters[0].pp[k],Math.max(0,before[k]-2));
  assert.equal(protectedState.fighters[1].stages.atk,2);
});
test('4683下次增伤仅MISS保留，免攻或减伤归零仍按命中消费',()=>{
  for(const scenario of['miss','immune','zero']){
    const s=make({move:37560,index:-1,soul:true});s.fighters[0].soulState.tsunamiNext1882=true;
    if(scenario==='miss'){delete s.fighters[0].effects['攻击必中'];timer(s,0,'攻击必失');}
    if(scenario==='immune')s.fighters[1].counts.attackNullify=1;
    if(scenario==='zero')timer(s,0,'自身攻击输出定额减少',{amount:100000});
    turn(s,37560,28837);assert.equal(sum(s),0);assert.equal(s.fighters[0].soulState.tsunamiNext1882,scenario==='miss');
    assert.equal(s.fighters[0].pp[key(37560)],s.moveDefinitions[key(37560)].pp-1);
  }
});
