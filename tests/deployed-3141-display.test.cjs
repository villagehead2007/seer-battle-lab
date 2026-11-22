'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),H=require('./helpers/3141-native.cjs');
function items(s){const before=structuredClone(s),rows=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.deepEqual(s,before);return rows;}
test('3141两魂只读显示实际登场保命、回初低体和保命奖励原二强化三，奖励过期消失，版本不符不显示',()=>{
 for(const soul of[480,611]){let s=H.make(14115,{soul,aHp:1000,aStats:{def:1},bStats:{atk:9999},enemyMoves:[10086]});assert.match(items(s).find(x=>x.name==='冥 · 登场保命').value,/第 1 回合登场.*本回合致死/);s=H.turn(s,'potion:pp',10086);assert.match(items(s).find(x=>x.name==='冥 · 最近回初判定').value,/低体：全技能先制\+2/);assert.equal(items(s).find(x=>x.name==='冥 · 保命奖励').value,'本回合攻击先制+'+(soul===480?2:3)+' · 附加对手最大体力1/3固定伤害');assert.ok(items(s).filter(x=>x.name.startsWith('冥 ·')).every(x=>x.activeOnly));s=H.turn(s,14115);assert.ok(!items(s).some(x=>x.name==='冥 · 保命奖励'));s.fighters[0].soulHash='unknown';assert.ok(!items(s).some(x=>x.name.startsWith('冥 ·')));}
});
