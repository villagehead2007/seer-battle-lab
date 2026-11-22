'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3221-native.cjs'),D=require('../dist/battle-display.js');
test('3221真实魂印固定吸取90至270与当前HP比较只读展示，原始错误版本不显示',()=>{
 let s=H.make(10004,{aHp:1000}),read=()=>{const before=structuredClone(s),items=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.deepEqual(s,before);return items;};assert.match(read().find(x=>x.name==='四九 · 下次吸取').value,/90 点固定伤害.*下场重置/);assert.match(read().find(x=>x.name==='四九 · 体力条件').value,/当前低于.*红伤减少49%/);for(const n of[180,270,270]){s=H.turn(s,'potion:pp');assert.match(read().find(x=>x.name==='四九 · 下次吸取').value,new RegExp(n+' 点固定伤害'));}s=H.make(10004,{aHp:6000,bHp:5000});assert.match(read().find(x=>x.name==='四九 · 体力条件').value,/当前高于.*红伤提升49%/);s=H.make(10004,{aHp:5000,bHp:5000});assert.match(read().find(x=>x.name==='四九 · 体力条件').value,/当前与对手相等/);s.fighters[0].soulHash='wrong-version';assert.equal(read().some(x=>x.name.startsWith('四九 · ')),false);
});
