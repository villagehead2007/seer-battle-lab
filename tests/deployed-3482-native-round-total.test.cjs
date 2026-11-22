'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3482-native.cjs');
test('3482原792两真实版本回初低于对手，叩击保1过量按整回合完整伤害回复而不按1999实损截断，免红零伤不虚增',()=>{
 for(const source of H.versions)for(const immune of[false,true]){const state=H.make(source,{hp:1000,enemyHp:2000,aStats:{atk:9999},bStats:{def:1},bEffects:{致命保留:{start:1,end:1,hp:1},...(immune?{攻击伤害免疫:{start:1,end:1}}:{})}}),s=H.turn(state),red=H.sum(s,'attack');assert.equal(s.fighters[0].soulState.rielsLowRound,1);assert.equal(s.fighters[0].hp,immune?1000:9000);assert.equal(s.fighters[0].pp['wiki:10127'],state.fighters[0].pp['wiki:10127']-1);if(immune){assert.equal(red,0);assert.equal(H.sum(s,'percent'),0);}else{assert.ok(red>9000);assert.equal(H.events(s,'attack').reduce((n,e)=>n+e.hpLoss,0),1999);assert.equal(H.sum(s,'percent'),8000);assert.equal(s.fighters[1].hp,1);}}
});
test('3482原792属性先实际回血后百分比，低体总量包含已结算粉伤且只结算一次，半体边界溢出粉免禁疗分离',()=>{
 for(const source of H.versions)for(const [hp,expected]of[[1000,[6000,2000]],[4499,[4501]],[4500,[3000,1500]],[4501,[3000,1499]],[8990,[10]]]){const s=H.turn(H.make(source,{hp}),20117);assert.equal(s.fighters[0].hp,9000);assert.deepEqual(H.events(s,'percent').filter(e=>e.settledDamage>0).map(e=>e.settledDamage),expected);assert.equal(s.fighters[0].stages.atk,1);}
 for(const source of H.versions)for(const mode of['pink','all-heal-ban','skill-heal-ban']){const s=H.turn(H.make(source,{hp:1000,aEffects:mode==='all-heal-ban'?{四杀鬼囹:{start:1,end:1}}:mode==='skill-heal-ban'?{无法通过自身技能恢复体力:{start:1,end:1}}:{},bEffects:mode==='pink'?{固定百分比免疫:{start:1,end:1}}:{}}),20117);assert.equal(s.fighters[0].hp,mode==='pink'?7000:mode==='all-heal-ban'?1000:9000);assert.equal(H.sum(s,'percent'),mode==='skill-heal-ban'?8000:0);assert.equal(H.sum(s,'attack'),0);}
});
test('3482原792反馈严格超过100才全强化，真实红400与404对应粉100和101，保1实损零不截阈值而粉免归零不奖励',()=>{
 for(const source of H.versions)for(const red of[400,404])for(const immune of[false,true]){const atk=H.incomingAttack(source,red),s=H.incomingCase(source,atk,immune);assert.equal(H.sum(s,'attack',1,0),red);assert.equal(H.sum(s,'percent'),immune?0:red/4);assert.ok(H.events(s,'percent').every(e=>e.hpLoss===0));assert.equal(s.fighters[1].hp,1);for(const k of H.keys)assert.equal(s.fighters[0].stages[k],!immune&&red>400?1:0,k+'仅完整反馈严格超过100触发');}
});
