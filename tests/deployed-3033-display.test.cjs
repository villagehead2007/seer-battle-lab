'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),{E,make,turn}=require('./helpers/3033-native.cjs'),pp='potion:pp';
test('3033第五显示0到120实际在场使用计数和封顶，与每次真实增伤一致且读取无改写',()=>{
 let s=make(19286);for(let n=0;n<=5;n++){if(n)s=turn(s,19286);const before=structuredClone(s),item=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items.find(x=>x.name==='佛晓跃金破 · 增伤');assert.equal(item.value,Math.min(120,n*30)+'% · 已使用 '+n+' 次 · 上限 120%');assert.deepEqual(s,before);}
});
test('3033分类减伤显示双类50%和三轮剩余，用招回复与免反异常各自独立期限',()=>{
 let s=turn(make(19282,{aStages:{acc:6}}),19282);assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('分类攻击减伤（物理与特殊攻击 50%）')&&t.includes('余 2 回合')));s=turn(make(24736),24736);assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('免疫反弹异常')&&t.includes('余 4 回合')));s=turn(make(24737),24737);assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('用招回复体力')&&t.includes('余 3 回合')));
});
