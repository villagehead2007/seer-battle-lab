'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3142-native.cjs');
test('3142万鸣981复用3741已答属性直伤模板：克制及强化种类修正，无攻防本系暴击浮动，不走固定百分比抗性',()=>{
 for(const soul of[484,527])for(const seed of[1,14])for(const stat of[1,9999]){const s=H.turn(H.make(24970,{soul,seed,aStages:{def:1,acc:1},aStats:{atk:stat,spa:stat},bStats:{def:stat,spd:stat},aEffects:{必定暴击:{start:1,end:3}},bGear:{resistance:{fixed:100,percent:100,critical:100}}}),24970),expected=Math.floor(312*H.E.typeEffectiveness('电',s.fighters[1].type,s.typeChart)),hit=s.damageEvents.find(e=>e.sourceSide===0);assert.equal(hit.type,'attack');assert.equal(hit.settledDamage,expected);assert.equal(s.fighters[1].hp,9000-expected);}
});
test('3142万鸣981属性直伤走攻击减伤免伤护盾及红伤上限，自身先反弱化新增强化种类参与百分之十',()=>{
 for(const mode of['plain','half','immune','cap','shield']){let s=H.make(24970,{aStages:{atk:-1,def:-2},bEffects:mode==='half'?{全伤害减半:{start:1,end:3}}:mode==='immune'?{攻击伤害免疫:{start:1,end:3}}:mode==='cap'?{伤害上限:{start:1,end:3,amount:250,attackOnly:true}}:{}});if(mode==='shield')s.fighters[1].suitState.shield=100;s=H.turn(s,24970);assert.equal(s.fighters[0].stages.atk,1);assert.equal(s.fighters[0].stages.def,2);const n=Math.floor(312*H.E.typeEffectiveness('电',s.fighters[1].type,s.typeChart)),expected=mode==='half'?Math.floor(n/2):mode==='immune'?0:mode==='cap'?Math.min(250,n):mode==='shield'?Math.max(0,n-100):n;assert.equal(s.damageEvents.find(e=>e.sourceSide===0).settledDamage,expected);}
});
