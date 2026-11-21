'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),{make,turn}=require('./helpers/3056-native.cjs'),pp='potion:pp';
function items(s){const before=structuredClone(s),v=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.deepEqual(s,before);return v;}
test('3056显示回血未启动与真实用招后每回合3000及下场清除，99级仍可回血但不显示可反击',()=>{
 for(const level of[99,100]){let s=make(10127,{level,aHp:1000});assert.equal(items(s).find(x=>x.name==='圣甲·盖亚 · 回合回复').value,'未启动：使用技能后开启');assert.equal(items(s).find(x=>x.name==='圣甲·盖亚 · 临终反击').value,level===100?'100级 · 战斗阶段实际死亡时触发':'99级 · 不触发临终反击');s=turn(s,10127);assert.equal(s.fighters[0].hp,4000);assert.equal(items(s).find(x=>x.name==='圣甲·盖亚 · 回合回复').value,'已启动：每回合回复 3000 点 · 下场清除');}
});
test('3056显示已记录完整攻击伤害，死亡不声称回血，错误魂印版本不展示',()=>{
 const s=turn(make(10127,{aHp:50,enemyId:3017,enemyMoves:[10761],aStats:{spd:9999},bStats:{spa:180}}),pp,10761),n=s.damageEvents.filter(e=>e.sourceSide===1&&e.targetSide===0&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);assert.ok(n>0&&n<50);assert.equal(s.damageEvents.find(e=>e.type==='fixed').settledDamage,75);assert.equal(items(s).find(x=>x.name==='圣甲·盖亚 · 已受攻击伤害').value,n+' 点 · 完整结算');assert.equal(items(s).find(x=>x.name==='圣甲·盖亚 · 回合回复').value,'已阵亡：不回复');s.fighters[0].soulHash='unverified-source';assert.ok(!items(s).some(x=>x.name.startsWith('圣甲·盖亚 ·')));
});
