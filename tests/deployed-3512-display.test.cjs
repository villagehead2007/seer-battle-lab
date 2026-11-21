'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),{make,turn}=require('./helpers/3512-native.cjs');
test('3512华光洗礼实际消回合授予的转回复显示当前生效，消费回合后消失且读取不改变战斗状态',()=>{
 let s=make(31502,{enemyMoves:[24624,10086],aHp:1000});s=turn(s,'potion:pp',24624);s=turn(s,31502);const before=structuredClone(s),items=D.fighter(s.fighters[0],s.round).items;assert.deepEqual(items.find(x=>x.name==='华光洗礼伤害转回复'),{name:'华光洗礼伤害转回复',value:'本回合受到伤害转为体力回复'});assert.deepEqual(s,before);s=turn(s,'potion:pp',10086);assert.ok(!D.fighter(s.fighters[0],s.round).items.some(x=>x.name==='华光洗礼伤害转回复'));assert.ok(s.fighters[0].hp>4000);
});
test('3512华光洗礼只有消强或空目标不显示伤害转回复，不把回复三千显示为回合效果',()=>{
 for(const boosted of [true,false]){let s=make(31502,{enemyMoves:[20889],aHp:1000});s=turn(s,'potion:pp',boosted?20889:'potion:pp');s=turn(s,31502);assert.ok(!D.fighter(s.fighters[0],s.round).items.some(x=>x.name==='华光洗礼伤害转回复'));assert.equal(s.fighters[0].hp,boosted?4000:1000);}
});
