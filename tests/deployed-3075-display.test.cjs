'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),{make,turn}=require('./helpers/3075-native.cjs');
test('3075魂421显示原生每轮特攻速度一与吸取150，读取不改对战且未知魂印版本不显示',()=>{
 let s=turn(make(10499),'potion:pp'),before=structuredClone(s),item=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items.find(x=>x.name==='圣甲瞳 · 每回合');assert.equal(item.value,'特攻、速度各+1 · 吸取对手 150 点体力');assert.equal(item.activeOnly,true);assert.deepEqual(s,before);assert.equal(s.fighters[0].stages.spa,1);assert.equal(s.fighters[0].stages.spe,1);assert.equal(s.fighters[1].hp,8850);s.fighters[0].soulHash='unknown';assert.ok(!D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items.some(x=>x.name==='圣甲瞳 · 每回合'));
});
