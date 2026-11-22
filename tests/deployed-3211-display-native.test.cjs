'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3211-native.cjs'),D=require('../dist/battle-display.js');
test('3211双魂真实满体受红后低半与下次减伤显示，绝瞳原技能回复三千附三千百分比，读取不改变状态',()=>{
 for(const [soul,reduction]of[[538,50],[549,65]]){let s=H.turn(H.make(25114,{soul,aStats:{def:66},bStats:{atk:9999},enemyMoves:[10086]}),'potion:pp',10086);assert.ok(s.fighters[0].hp>0&&s.fighters[0].hp<4500);const read=()=>{const before=structuredClone(s),items=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.deepEqual(s,before);return items;};assert.match(read().find(x=>x.name==='超能 · 吸取条件').value,/当前低于半体/);assert.equal(read().find(x=>x.name==='下次红伤减伤').value,reduction+'% · 一次');const hp=s.fighters[0].hp;s=H.turn(s,25114);assert.equal(s.fighters[0].hp,hp+3000);assert.equal(H.damage(s,'percent'),3000);assert.match(read().find(x=>x.name==='用招回血附伤').value,/3000 点.*实际回复/);assert.match(read().find(x=>x.name==='超能 · 吸取条件').value,/当前未低于半体/);}
});
