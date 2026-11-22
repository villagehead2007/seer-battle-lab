'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),H=require('./helpers/3102-native.cjs');
function items(s){const before=structuredClone(s),rows=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.deepEqual(s,before);return rows;}
test('3102两魂只读展示回初高低体、待攻击回血、实际储备固伤，药剂保留储备且错误版本不显示',()=>{
 for(const soul of[449,456]){let s=H.make(19565,{soul});assert.match(items(s).find(x=>x.name==='武神 · 最近回初判定').value,/待回合开始/);s=H.turn(s,'potion:pp');assert.match(items(s).find(x=>x.name==='武神 · 待用攻击回血').value,/已储备/);s=H.turn(s,19565);const n=s.fighters[0].soulState.ruierFixedNext;assert.ok(n>0);assert.ok(items(s).find(x=>x.name==='武神 · 储备固伤').value.startsWith(n+' 点'));assert.ok(items(s).filter(x=>x.name.startsWith('武神 ·')).every(x=>x.activeOnly));s=H.turn(s,'potion:pp');assert.ok(items(s).find(x=>x.name==='武神 · 储备固伤').value.startsWith(n+' 点'));s.fighters[0].soulHash='unknown';assert.ok(!items(s).some(x=>x.name.startsWith('武神 ·')));}
 let s=H.turn(H.make(19565,{aHp:9000,bHp:4500}),'potion:pp');assert.match(items(s).find(x=>x.name==='武神 · 最近回初判定').value,/高体：本回合红伤×2/);
});
