'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,make,turn}=require('./helpers/3010-native.cjs'),pp='potion:pp';
test('3010原生暴击与分类减伤提示带真实概率类别比例，读展示不修改实际战斗和到期',()=>{
 for(const[id,pattern,n]of[[20566,/要害概率增加.*6\.25%.*余 4 回合/,5],[20567,/分类攻击减伤.*特殊攻击.*50%.*余 2 回合/,3]]){let s=turn(make(id),id);const before=structuredClone(s);assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>pattern.test(t)));assert.deepEqual(s,before);while(s.round<=n)s=turn(s,pp);assert.ok(!E.describeEffects(s.fighters[0],s.round).some(t=>/要害概率增加|分类攻击减伤/.test(t)));}
});
test('3010圣灵真实状态提示清PP数量与明确六异常池，三回合反应和四回合免异分别到期且读取不消费',()=>{
 let s=turn(make(24190),24190);const before=structuredClone(s),shown=E.describeEffects(s.fighters[0],s.round);assert.ok(shown.some(t=>/对手攻击后.*随机清空1个技能PP.*余 2 回合/.test(t)));assert.ok(shown.some(t=>/对手属性技能后.*烧伤.*冻伤.*中毒.*麻痹.*害怕.*睡眠.*余 2 回合/.test(t)));assert.deepEqual(s,before);s=turn(s,pp);s=turn(s,pp);assert.ok(!E.describeEffects(s.fighters[0],s.round).some(t=>/随机清空|对手属性技能后/.test(t)));assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>/免异常.*余 1 回合/.test(t)));
});
test('3010圣芒按真实分数展示用招回最大体力三分之一，下两轮攻击必先与当前四轮回复分开到期',()=>{
 let s=turn(make(24191),24191);const before=structuredClone(s);assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>/用招回复体力.*最大体力的1\/3.*余 3 回合/.test(t)));assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>/攻击必定先手.*余 2 回合/.test(t)));assert.deepEqual(s,before);s=turn(s,pp);s=turn(s,pp);assert.ok(!E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('攻击必定先手')));assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>/最大体力的1\/3.*余 1 回合/.test(t)));
});
