'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),{E,make,turn}=require('./helpers/3017-native.cjs'),pp='potion:pp';
test('3017原猛龙受击回复显示实际65概率100数值及期限，读取不改状态，到期不显示',()=>{
 let s=turn(make(23528),23528);const before=structuredClone(s);assert.ok(E.describeEffects(s.fighters[0],s.round).includes('受击回复（65%概率回复100点体力） · 余 2 回合'));assert.deepEqual(s,before);s=turn(s,pp);assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('受击回复')&&t.includes('余 1 回合')));s=turn(s,pp);assert.ok(!E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('受击回复')));
});
test('3017肉身真实连用后下次威力180210240封顶只读预告，其他技能打断隐藏再用重回180',()=>{
 let s=make(19207,{extraMoves:[10611],aStages:{acc:6}});for(const[power,next]of[[150,180],[180,210],[210,240],[240,240]]){s=turn(s,19207);assert.ok(s.turns.at(-1).events.some(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0&&e.detail.startsWith('威力 '+power+' ')));const before=structuredClone(s),item=D.fighter(s.fighters[0],s.round,s.moveDefinitions).items.find(x=>x.name==='肉身离心吼连用威力');assert.ok(item);assert.ok(item.value.includes('下次连续使用威力 '+next));assert.deepEqual(s,before);}s=turn(s,10611);assert.ok(!D.fighter(s.fighters[0],s.round,s.moveDefinitions).items.some(x=>x.name==='肉身离心吼连用威力'));s=turn(s,19207);assert.ok(D.fighter(s.fighters[0],s.round,s.moveDefinitions).items.find(x=>x.name==='肉身离心吼连用威力').value.includes('下次连续使用威力 180'));
});
