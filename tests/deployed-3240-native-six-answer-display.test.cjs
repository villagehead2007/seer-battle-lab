'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3240-native.cjs'),D=require('../dist/battle-display.js');
test('3240新裁定限伤反弹阈值与703显示原参数、类别、时点和期限，读取无副作用',()=>{
 for(const[move,pattern]of[[17389,/攻击伤害上限.*每回合红伤合计最多280点/],[23241,/受击反弹.*本次完整红伤的40%.*百分比伤害/],[25178,/受击低伤异常.*回合末红伤合计低于300则害怕.*属性技能不触发/],[24064,/属性招扣血.*1\/3百分比伤害.*只扣当前HP、上限不变/]]){const s=H.turn(H.make(move),move),before=structuredClone(s),text=H.E.describeEffects(s.fighters[0],s.round).join('\n');assert.match(text,pattern,String(move));assert.match(text,/余 [12] 回合/);D.fighter(s.fighters[0],s.round,s.moveDefinitions,s);assert.deepEqual(s,before);}
});
test('3240禁强1069负级归零的实际面板，不展示未授予的闪避，原反弱先制仍可独立显示',()=>{
 const s=H.turn(H.make(30147,{aStages:{atk:-2,acc:6},aEffects:{禁强化:{start:1,end:3}}}),30147),before=structuredClone(s),view=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s);assert.equal(s.fighters[0].stages.atk,0);assert.ok(!H.E.describeEffects(s.fighters[0],s.round).some(x=>x.includes('闪避')));assert.ok(view);assert.deepEqual(s,before);
});
