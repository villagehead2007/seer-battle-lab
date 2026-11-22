'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),H=require('./helpers/3142-native.cjs');
function items(s){const before=structuredClone(s),rows=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.deepEqual(s,before);return rows;}
test('3142原强化只读展示当前体力的待回初条件，不伪造已结束判定；充电时限及既有属性直伤模板明确',()=>{
 for(const soul of[484,527]){let s=H.make(23244,{soul,extraMoves:[24970]});assert.match(items(s).find(x=>x.name==='雷 · 待回初体力判定').value,/当前低体.*回初仍如此则本回合免断/);s=H.turn(s,23244);assert.equal(items(s).find(x=>x.name==='充电 · 电系红伤').value,'本回合 ×2 · 回合结束到期');assert.match(items(s).find(x=>x.name==='万鸣齐闪 · 属性直伤').value,/260 电系基数/);assert.ok(items(s).filter(x=>x.name.startsWith('雷 ·')).every(x=>x.activeOnly));s=H.turn(s,'potion:pp');assert.ok(!items(s).some(x=>x.name==='充电 · 电系红伤'));s.fighters[0].soulHash='unknown';assert.ok(!items(s).some(x=>x.name.startsWith('雷 ·')));s=H.make(10006,{soul,aHp:9000,bHp:4500});assert.match(items(s).find(x=>x.name==='雷 · 待回初体力判定').value,soul===527?/攻击\+2、速度及命中\+1/:/攻击\+2$/);}
});
