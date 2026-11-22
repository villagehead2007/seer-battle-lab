'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),{make,turn}=require('./helpers/3082-native.cjs');
function items(s){const before=structuredClone(s),rows=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.deepEqual(s,before);return rows;}
test('3082已明确的登场封属性剩余和回合随机弱化只读显示，首两轮后结束且错误魂印版本不显示',()=>{
 let s=make(12258);assert.equal(items(s).find(x=>x.name==='秘 · 登场封属性').value,'第 1 次登场 · 剩 2 回合');assert.equal(items(s).find(x=>x.name==='秘 · 回合弱化').value,'回合末随机2种不同能力各−1');s=turn(s,'potion:pp');assert.equal(items(s).find(x=>x.name==='秘 · 登场封属性').value,'第 1 次登场 · 剩 1 回合');s=turn(s,'potion:pp');assert.equal(items(s).find(x=>x.name==='秘 · 登场封属性').value,'第 1 次登场 · 封属性已结束');s.fighters[0].soulHash='unknown';assert.ok(!items(s).some(x=>x.name.startsWith('秘 ·')));
});
test('3082神佛真实使用后下次百分比显示20到30到40及人答下场重置，读取无改写',()=>{
 let s=make(19476,{bGear:{resistance:{percent:100}}});for(let n=0;n<3;n++){assert.equal(items(s).find(x=>x.name==='神佛俱灭 · 下次附伤').value,Math.min(40,20+n*10)+'% 对手最大体力 · 百分比伤害 · 下场重置');s=turn(s,19476);}
});
test('3082魂424施加给真实对手的标记明确显示仅受红伤一次，固定150后仍显示且读取不改状态',()=>{
 let s=turn(make(24834,{enemyMoves:[20889],bStages:{acc:6}}),'potion:pp',20889);s=turn(s,24834);const before=structuredClone(s),rows=D.fighter(s.fighters[1],s.round,s.moveDefinitions,s).items;assert.equal(rows.find(x=>x.name==='米斯蒂克 · 下次受红伤').value,'×2 · 一次 · 固定、百分比、真实不消费');assert.equal(rows.find(x=>x.name==='米斯蒂克 · 下次受红伤').activeOnly,true);assert.deepEqual(s,before);
});
