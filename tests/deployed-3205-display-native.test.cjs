'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),H=require('./helpers/3205-native.cjs');
test('3205双魂王瞳真实当前睡眠条件预览、命中原有睡眠固定三千，读取不改变状态或随机数',()=>{
 for(const soul of [535,548]){
  let s=H.make(22053,{soul,extraMoves:[10499]});const read=()=>{const before=structuredClone(s),row=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items.find(x=>x.name==='王瞳 · 命中前睡眠条件');assert.deepEqual(s,before);return row;};
  assert.match(read().value,/目标未睡眠/);s=H.turn(s,22053);assert.match(read().value,/目标已睡眠.*3000 点固定伤害/);s=H.turn(s,10499);assert.equal(s.turns.at(-1).events.filter(e=>e.damage?.sourceSide===0&&e.damage.type==='fixed').reduce((n,e)=>n+e.damage.settledDamage,0),3000);
 }
});
