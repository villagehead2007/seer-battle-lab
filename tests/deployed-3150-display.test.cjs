'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),H=require('./helpers/3150-native.cjs');
function items(s){const before=structuredClone(s),rows=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.deepEqual(s,before);return rows;}
test('3150显示分别对应最近回初低体与战阶末高体，真实回血跨线时两项可同时满足并显示50或75红伤奖励',()=>{
 for(const soul of[492,528]){let s=H.make(24985,{soul,aHp:4499});assert.match(items(s).find(x=>x.name==='雷祖 · 最近战阶判定').value,/待战斗阶段结束/);s=H.turn(s,24985);assert.match(items(s).find(x=>x.name==='雷祖 · 最近回初判定').value,/低于半体力 · 对应回合末/);assert.match(items(s).find(x=>x.name==='雷祖 · 最近战阶判定').value,/高于半体力 · 已授/);assert.equal(items(s).find(x=>x.name==='雷祖 · 红伤奖励').value,'本回合红伤+'+(soul===492?50:75)+'% · 回合结束到期');assert.ok(items(s).filter(x=>x.name.startsWith('雷祖 ·')).every(x=>x.activeOnly));const invalid=structuredClone(s);invalid.fighters[0].soulHash='unknown';assert.ok(!items(invalid).some(x=>x.name.startsWith('雷祖 ·')));}
});
