'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,make,turn}=require('./helpers/3004-native.cjs'),pp='potion:pp';
test('3004贤者真实两附伤显示比例原双防300点及不同到期时间，正负等级不误改显示且读取不写状态',()=>{
 for(const level of [-2,0,2]){let s=make(24666,{extraMoves:[10614],aStats:{def:600,spd:400},aStages:{def:level,spd:level}});s=turn(s,24666);const before=structuredClone(s),shown=E.describeEffects(s.fighters[0],s.round);assert.ok(shown.some(t=>/面板双防和的30%（300点）.*余 3 回合/.test(t)));assert.ok(shown.some(t=>/对手红伤后当前体力的25%.*余 2 回合/.test(t)));assert.deepEqual(s,before);s=turn(s,pp);s=turn(s,pp);assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>/面板双防和的30%（300点）.*余 1 回合/.test(t)));assert.ok(!E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('红伤后当前体力')));s=turn(s,pp);assert.ok(!E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('面板双防和')));}
});
test('3004贤者提前展示下回合起但当前双防粉伤尚未造成，提示不授予或消费任何效果',()=>{
 let s=make(24666);s=turn(s,24666);const before=structuredClone(s);assert.ok(E.describeEffects(s.fighters[0],1).some(t=>/面板双防和的30%.*下回合起 · 余 3 回合/.test(t)));assert.ok(!(s.damageEvents??[]).some(e=>e.type==='percent'));assert.deepEqual(s,before);
});
