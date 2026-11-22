'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),{make,turn}=require('./helpers/3079-native.cjs');
function items(s){const before=structuredClone(s),v=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.deepEqual(s,before);return v;}
test('3079当前HP严格高等低半的魂425判定显示与原生吸取一致，未知版本不显示且读取无改写',()=>{
 for(const[hp,text]of[[4499,'低于半血：无魂印麻痹 · 攻击吸取40%'],[4500,'恰为半血：无魂印麻痹 · 攻击吸取20%'],[4501,'高于半血：技能50%麻痹 · 攻击吸取20%']])assert.equal(items(make(10006,{aHp:hp})).find(x=>x.name==='圣甲雷 · 当前体力').value,text);let s=turn(make(10006,{aHp:4499}),10006);assert.equal(s.fighters[0].hp,8099);assert.match(items(s).find(x=>x.name==='圣甲雷 · 当前体力').value,/高于半血/);s.fighters[0].soulHash='unknown';assert.ok(!items(s).some(x=>x.name==='圣甲雷 · 当前体力'));
});
test('3079雷皇下一次连击与激雷下轮电红翻倍显示真实成长及起算，过期显示去除',()=>{
 let s=make(16103,{bGear:{resistance:{percent:100}}});assert.match(items(s).find(x=>x.name==='雷皇乱舞 · 连击').value,/下次 2 连击/);s=turn(s,16103);assert.match(items(s).find(x=>x.name==='雷皇乱舞 · 连击').value,/下次 3 连击/);s=turn(make(23359,{extraMoves:[10171]}),23359);assert.equal(items(s).find(x=>x.name==='电系伤害翻倍').value,'本回合生效 · 电系红伤×2');s=turn(s,10171);assert.equal(items(s).find(x=>x.name==='电系伤害翻倍'),undefined);
});
