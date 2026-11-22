'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js'),{make,turn}=require('./helpers/3036-native.cjs'),pp='potion:pp';
function items(s){const before=structuredClone(s),v=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items;assert.deepEqual(s,before);return v;}
test('3036显示已结算登场尸体与红伤增幅、实际剩余攻击盾；399限定红减伤且错误源版本不展示',()=>{
 for(const soul of[398,399]){let s=make(10004,{soul,enemyMoves:[10086],aStats:{def:1000},bStats:{atk:9999}}),v=items(s);assert.equal(v.find(x=>x.name==='乔特鲁德 · 登场判定'),undefined);assert.equal(v.find(x=>x.name==='乔特鲁德 · 红伤护盾').value,'100 点 · 固定、百分比及真实伤害不消耗');assert.equal(!!v.find(x=>x.name==='乔特鲁德 · 魂印红伤减免'),soul===399);s=turn(s,pp,10086);assert.equal(s.fighters[0].soulState.attackShield,0);assert.ok(items(s).find(x=>x.name==='乔特鲁德 · 红伤护盾').value.startsWith('0 点'));s.fighters[0].soulHash='unverified-source';assert.ok(!items(s).some(x=>x.name.startsWith('乔特鲁德 ·')));}
});
test('3036真正队伍登场才展示已记录阵亡数一和红伤10%，护盾按一活队友为200',()=>{
 const T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3036-native.cjs');function member(id){const snapshot=store.species(id);return{snapshot,moves:loadout(snapshot,[]),build:{overrides:{maxHp:9000}}};}let g=T.create([[member(3004),member(3036),member(3056)],[member(2989)]],[0,0],{seed:14,criticals:false});g.slots[0][2].fighter.hp=0;g=T.turn(g,[{switchTo:1},pp]);const v=items(g.battle);assert.equal(v.find(x=>x.name==='乔特鲁德 · 登场判定').value,'阵亡队友 1 · 红伤+10% · 返场重判');assert.ok(v.find(x=>x.name==='乔特鲁德 · 红伤护盾').value.startsWith('200 点'));
});
test('3036显示下一次真实反馈100与完整红伤定额减免，实际受击消费后移除且读取不改写',()=>{
 let s=turn(make(24740,{enemyMoves:[10086],aStats:{def:1000},bStats:{atk:9999}}),24740);assert.equal(items(s).find(x=>x.name==='乔特鲁德 · 下次红伤反馈').value,'100% · 真实伤害 · 一次');s=turn(s,pp,10086);assert.ok(!items(s).some(x=>x.name==='乔特鲁德 · 下次红伤反馈'));s=turn(make(19294,{enemyMoves:[10086],aStats:{def:1000},bStats:{atk:9999},aStages:{acc:6}}),19294);assert.equal(items(s).find(x=>x.name==='乔特鲁德 · 下次红伤减免').value,s.fighters[0].counts.nextDamageReduction+' 点 · 一次');s=turn(s,pp,10086);assert.ok(!items(s).some(x=>x.name==='乔特鲁德 · 下次红伤减免'));
});
