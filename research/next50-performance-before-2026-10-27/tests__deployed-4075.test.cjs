'use strict';
require('./deployed-4075-heal-death.test.cjs');
require('./deployed-4075-partial.test.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict');
const {make,turn,pick,timer,keys,key,E}=require('./helpers/4075-battle.cjs');
test('4075吸强后全部自身正级额外赋予负级，含已有正级而非只本次吸取项',()=>{
 for(const soul of [1320,1544]){const s=make(undefined,{soul});s.fighters[0].stages.atk=2;s.fighters[1].stages.atk=-1;s.fighters[1].stages.def=1;
  const o=turn(s);assert.equal(o.fighters[0].stages.atk,2);assert.equal(o.fighters[0].stages.def,1);assert.equal(o.fighters[1].stages.atk,-3);assert.equal(o.fighters[1].stages.def,-1);
  assert.equal(o.fighters[1].moves.filter(k=>o.fighters[1].pp[k]===0).length,0);
 }
});
test('4075任一赋予失败即补偿、无正级及已达负6也补偿，原强化分别随机清1或2PP',()=>{
 for(const [soul,count]of [[1320,1],[1544,2]])for(const mode of ['none','immune','partial','floor']){
  const s=make(undefined,{soul,hp:1000});if(mode!=='none')s.fighters[0].stages.atk=2;
  if(mode==='immune')timer(s,1,'免弱');if(['floor','partial'].includes(mode))s.fighters[1].stages.atk=-6;
  if(mode==='partial')s.fighters[0].stages.def=1;
  const o=turn(s);assert.ok(o.damageEvents.some(e=>e.type==='percent'&&e.settledDamage===3000));
  assert.equal(o.fighters[1].moves.filter(k=>o.fighters[1].pp[k]===0).length,count);
  assert.ok(o.fighters[0].hp>=4000);if(mode==='partial')assert.equal(o.fighters[1].stages.def,-1);
  if(mode==='floor')assert.equal(o.fighters[1].stages.atk,-6);
 }
});
test('4075赋予免疫补偿不绕PP保护、粉免与回复削减，控制未用招不补偿',()=>{
 for(const soul of [1320,1544]){
  let s=make(undefined,{soul,hp:1000});timer(s,1,'固定百分比免疫');timer(s,1,'PP保护');timer(s,0,'回复效果削减',{fraction:.5});
  let o=turn(s);assert.equal(o.fighters[0].hp,2500);assert.equal(o.fighters[1].hp,9000-o.damageEvents.filter(e=>e.type==='attack').reduce((n,e)=>n+e.hpLoss,0));
  assert.equal(o.damageEvents.some(e=>e.type==='percent'&&e.settledDamage>0),false);
  assert.equal(o.fighters[1].moves.some(k=>o.fighters[1].pp[k]===0),false);
  s=make(undefined,{soul,hp:1000});s.fighters[0].ailments['疲惫']=3;o=turn(s);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[1].hp,9000);
 }
});
test('4075受攻全强概率整回合共享仅结算一次，完全禁强或六项满级均转敌全弱',()=>{
 for(const blocked of ['ban','max']){const s=make(pick(1594)[0]);if(blocked==='ban')timer(s,0,'禁强化');else for(const k of keys)s.fighters[0].stages[k]=6;
  const def=s.moveDefinitions[key(900040)],rule=E.WIKI.effectsEngine.registry[31];
  const compiled=E.WIKI.effectsEngine.compileInstances([{id:31,args:[3,3],description:rule.template}],[{id:31,argsNum:rule.argsNum,template:rule.template}],def);assert.equal(compiled.issue,'');def.operations=compiled.operations;
  const o=turn(s,undefined,900040);for(const k of keys){assert.equal(o.fighters[0].stages[k],blocked==='max'?6:0);assert.equal(o.fighters[1].stages[k],-1);}
  assert.equal(o.fighters[0].soulState.counter1594Round,1);assert.equal(o.damageEvents.filter(e=>e.type==='attack').length,3);
 }
});
