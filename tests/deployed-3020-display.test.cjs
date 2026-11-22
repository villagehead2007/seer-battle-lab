'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,make,turn}=require('./helpers/3020-native.cjs'),pp='potion:pp';
test('3020光明随机异常显示50概率一种与期限，统领用招回血显示三分一低于半体翻倍且读取无修改',()=>{
 let s=turn(make(24700),24700),before=structuredClone(s);assert.ok(E.describeEffects(s.fighters[0],s.round).includes('攻击随机异常（50%，1种） · 余 2 回合'));assert.deepEqual(s,before);s=turn(s,pp);s=turn(s,pp);assert.ok(!E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('攻击随机异常')));
 s=turn(make(24702,{aHp:1000}),24702);assert.equal(s.fighters[0].hp,7000);before=structuredClone(s);assert.ok(E.describeEffects(s.fighters[0],s.round).includes('用招回血（最大体力1/3，低于1/2时翻倍） · 余 3 回合'));assert.deepEqual(s,before);for(let r=2;r<=4;r++)s=turn(s,pp);assert.ok(!E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('用招回血')));
});
