'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),{E,make,turn}=require('./helpers/3022-native.cjs'),pp='potion:pp';
test('3022回初资格只显示已存在的判定值，不输出不存在的回合编号',()=>{
 const s=turn(make(10613,{aHp:1000}),pp),item=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items.find(x=>x.name==='王龙 · 最近回初判定');assert.equal(item.value,'低体：战斗阶段末回复 3000 点');assert.ok(!item.value.includes('undefined'));
});
test('3022显示实时红伤减免及最近回初严格高低等体判定与回血数值，读取不改变战斗',()=>{
 for(const soul of[395,396])for(const[aHp,bHp,scope]of[[8000,1000,'高体：免异常'],[5000,5000,'等体：不免异常、不回复'],[1000,9000,'低体：战斗阶段末回复 3000 点']]){const s=turn(make(10613,{soul,aHp,bHp}),pp),before=structuredClone(s),items=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.ok(items.find(x=>x.name==='王龙 · 最近回初判定').value.includes(scope));const reduction=items.find(x=>x.name==='王龙 · 当前红伤减免');assert.ok(reduction.value.startsWith(Math.round(E.SOULS.trait(s.fighters[0],'attackReduction')*100)+'%'));assert.ok(reduction.value.includes('固定、百分比及真实伤害不减'));assert.deepEqual(s,before);}
});
test('3022忽双防45%和免异免弱期限实际显示，真攻击消费后忽防消失且到期移除',()=>{
 let s=turn(make(24717,{extraMoves:[22295,10622]}),24717),before=structuredClone(s);assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('下次攻击忽略双防 · 45%')));assert.deepEqual(s,before);s=turn(s,10622);assert.ok(!E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('下次攻击忽略双防')));s=turn(s,22295);assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('免异常')&&t.includes('余 2 回合')));s=turn(s,pp);s=turn(s,pp);s=turn(s,pp);assert.ok(!E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('免异常')&&t.includes('余')));
});
