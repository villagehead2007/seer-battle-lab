'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3082-native.cjs'),pp='potion:pp';
test('3082摄魂717按敌最大HP四分一百分比，严格低半仅回复两倍，过量与抗性不截理论回复且禁疗只挡回复',()=>{
 for(const[aHp,n]of[[4499,4500],[4500,2250],[4501,2250]])for(const mode of['normal','resist','ban']){const s=turn(make(24837,{aHp,bGear:mode==='resist'?{resistance:{percent:100}}:{},aEffects:mode==='ban'?{无法通过自身技能恢复体力:{start:1,end:3}}:{}}),24837);assert.equal(s.damageEvents.find(e=>e.sourceSide===0&&e.type==='percent').settledDamage,mode==='resist'?0:2250);assert.equal(s.fighters[0].hp,mode==='ban'?aHp:Math.min(9000,aHp+n));assert.equal(s.fighters[1].hp,mode==='resist'?9000:6750);}
 let s=make(24837,{extraMoves:[19477],aHp:1000,bStats:{maxHp:1500,def:1,spd:1}});s=turn(s,24837);assert.equal(s.fighters[0].hp,1750);s=turn(s,19477);assert.equal(s.fighters[1].hp,0);assert.ok(s.damageEvents.some(e=>e.round===2&&e.type==='attack'&&e.settledDamage>1125));assert.equal(s.fighters[0].hp,2500);
});
test('3082摄魂717当前四轮真实用属性技能仍吸取，第五停止且药剂不触发，真实中毒避免满体掩盖',()=>{
 let s=make(24837,{extraMoves:[20077],enemyId:3036,enemyMoves:[24739],aAilments:{中毒:7}}),hp=4500;for(let r=1;r<=5;r++){s=turn(s,r===1?24837:20077,r===3?24739:pp);hp=Math.min(9000,hp+(r<=4?2250:0))-1125;assert.equal(s.fighters[0].hp,hp);assert.equal((s.damageEvents??[]).filter(e=>e.round===r&&e.sourceSide===0&&e.type==='percent').length,r<=4?1:0);assert.ok(s.fighters[1].hp>0);}s=turn(make(24837),24837);const before=s.fighters[0].hp;s=turn(s,pp);assert.equal(s.fighters[0].hp,before);assert.ok(!s.damageEvents.some(e=>e.round===2&&e.type==='percent'&&e.sourceSide===0));
});
