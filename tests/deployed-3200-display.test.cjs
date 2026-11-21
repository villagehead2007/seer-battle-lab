'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),H=require('./helpers/3200-native.cjs');
function items(s){const before=structuredClone(s),rows=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.deepEqual(s,before);return rows;}
test('3200显示当前体力并明确战阶末取值，两魂下1或2回合免异常；真实第五计数显示下次300和400并注明下场重置',()=>{
 for(const soul of[523,532]){let s=H.make(19965,{soul,aHp:5001,aAilments:{中毒:2}});s=H.turn(s,'potion:pp');assert.match(items(s).find(x=>x.name==='霍德尔 · 当前体力').value,/当前低于半体力 · 分支以战阶末当时体力判定/);assert.equal(s.fighters[0].effects['免异常'].end,soul===523?2:3);assert.ok(items(s).find(x=>x.name==='霍德尔 · 高体分支').value.includes('下'+(soul===523?1:2)+'回合'));s=H.make(19965,{soul});for(const n of[300,400]){s=H.turn(s,19965);assert.equal(items(s).find(x=>x.name==='王绝影逆魂 · 下次基础附伤').value,n+' 固定 · 天敌翻倍 · 下场重置');}const unknown=structuredClone(s);unknown.fighters[0].soulHash='unknown';assert.ok(!items(unknown).some(x=>x.name.startsWith('霍德尔 ·')||x.name.startsWith('王绝影逆魂 ·')));}
});
