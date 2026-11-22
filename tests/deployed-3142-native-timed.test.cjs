'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3142-native.cjs'),pp='potion:pp';
test('3142三招57真实使用技能回血按各自三轮或两轮整回，药剂不触发，禁疗与到期有实际HP差',()=>{
 for(const[id,last,n]of[[23244,3,3000],[24377,3,3000],[24971,2,9000]]){let s=H.make(id,{extraMoves:[20004],aHp:1,aAilments:{中毒:7}}),hp=1;for(let r=1;r<=last+1;r++){s=H.turn(s,r===1?id:20004);hp=Math.min(9000,hp+(r<=last?n:0))-1125;assert.equal(s.fighters[0].hp,hp);}s=H.turn(H.make(id,{aHp:1000,aEffects:{无法通过自身技能恢复体力:{start:1,end:3}}}),id);assert.equal(s.fighters[0].hp,1000);s=H.turn(H.make(id,{aHp:1000}),id);const before=s.fighters[0].hp;s=H.turn(s,pp);assert.equal(s.fighters[0].hp,before);}
});
test('3142霹雳821先手两轮后手三轮免断，真实回合内清除失败，期满且回初等体则可清除，不被魂低体遮盖',()=>{
 for(const first of[false,true]){const last=first?2:3,options={aHp:9000,bHp:9000,aStats:{spe:first?1000:1},enemyId:3102,enemyMoves:[20117,19560]};let s=H.turn(H.make(24377,options),24377,20117);assert.equal(s.fighters[0].effects.protect.end,last);s=H.turn(s,pp,19560);assert.ok(s.fighters[0].effects.reflect);s=H.turn(H.make(24377,options),24377,20117);for(let r=2;r<=last;r++)s=H.turn(s,pp,20117);s=H.turn(s,pp,19560);assert.equal(s.fighters[0].effects.reflect,undefined);}
});
test('3142天雷800只在三轮窗口内真实属性触发下两轮红伤限250，第四轮已过旧限伤，真伤中毒不受250上限',()=>{
 let s=H.make(24376,{aHp:9000,bHp:9999,aStats:{def:100},bStats:{atk:9999},extraMoves:[20004],enemyMoves:[20889,10086],aAilments:{中毒:5},bEffects:{PP保护:{start:1,end:1}}});s=H.turn(s,24376,20889);for(let r=2;r<=4;r++){s=H.turn(s,pp,10086);const e=s.damageEvents.find(e=>e.round===r&&e.sourceSide===1&&e.type==='attack');assert.equal(e.settledDamage<=250,r<=3);assert.equal(s.damageEvents.find(e=>e.round===r&&e.targetSide===0&&e.type==='true').settledDamage,1125);}
});
