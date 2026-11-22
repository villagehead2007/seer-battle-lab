'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3227-native.cjs'),D=require('../dist/battle-display.js');
test('3227两魂月辉自身回复与对手固定附伤分开只读显示，真实沉默提升双防后回复数值同步',()=>{
 for(const[soul,fraction]of[[552,.5],[553,.6]]){let s=H.make(20521,{soul,aStats:{def:1000,spd:2000},bStats:{def:2000,spd:3000}});function read(){const before=structuredClone(s),items=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.deepEqual(s,before);return items;}assert.match(read().find(x=>x.name==='月辉 · 攻击回复').value,new RegExp('基础回复 '+3000*fraction));assert.match(read().find(x=>x.name==='月辉 · 攻击附伤').value,new RegExp(5000*fraction+' 点固定伤害'));s=H.turn(s,20521);assert.match(read().find(x=>x.name==='月辉 · 攻击回复').value,new RegExp('基础回复 '+6000*fraction));assert.match(read().find(x=>x.name==='月辉 · 攻击附伤').value,new RegExp(5000*fraction+' 点固定伤害'));s.fighters[0].soulHash='wrong-version';assert.equal(read().some(x=>x.name.startsWith('月辉 · ')),false);}
});
