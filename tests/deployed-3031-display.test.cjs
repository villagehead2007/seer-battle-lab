'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),{E,make,turn}=require('./helpers/3031-native.cjs'),pp='potion:pp';
test('3031显示最近回初满体资格，与真实满体失去和回血后次轮重判一致，读取无改写',()=>{
 let s=make(19269,{aHp:9000,extraMoves:[10127],enemyMoves:[10086]});for(const[a,b,full]of[[pp,10086,true],[19269,pp,false],[10127,pp,true]]){s=turn(s,a,b);const before=structuredClone(s),item=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items.find(x=>x.name==='鬼神 · 最近回初满体');assert.equal(item.value,full?'已满足：红伤+50%、免异常、免弱':'未满足：无满体增伤与免疫');assert.deepEqual(s,before);}
});
test('3031真实减伤三轮与忽限三轮显示数值类别和剩余，原生清回合后减伤状态即时消失',()=>{
 let s=turn(make(19271,{enemyId:3014,enemyMoves:[19199],aStages:{acc:6}}),19271),before=structuredClone(s);assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('分类攻击减伤（物理与特殊攻击 60%）')&&t.includes('余 2 回合')));assert.deepEqual(s,before);s=turn(s,pp,19199);assert.ok(!E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('分类攻击减伤')));s=turn(make(24729),24729);assert.ok(E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('无视伤害限制')&&t.includes('余 2 回合')));s=turn(s,pp);s=turn(s,pp);assert.ok(!E.describeEffects(s.fighters[0],s.round).some(t=>t.includes('无视伤害限制')));
});
