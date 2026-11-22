'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {make,turn}=require('./helpers/remaining-4950.cjs');
const display=require('../dist/battle-display.js');
function members(s){
  const before=structuredClone(s);
  const group=display.fighter(s.fighters[0],s.round).group;
  assert.deepEqual(s,before);
  return group.members.map(m=>[m.role,m.name,m.hp]);
}
test('帝皇之戎双方身体随正常换位和晋升刷新，读取不改战斗记录',()=>{
  const s=make({move:38554,soul:true,hp:3000});
  assert.deepEqual(members(s),[['主位','帝皇之钺',3000],['副位','帝皇之御',9000]]);
  turn(s,38568,20309);
  assert.deepEqual(members(s),[['主位','帝皇之御',9000],['副位','帝皇之钺',3000]]);
  const k=make({move:29466,index:-1,soul:true,hp:1});
  turn(k,29466,10127);
  assert.deepEqual(members(k),[['主位','帝皇之御',9000],['阵亡成员','帝皇之钺',0]]);
  assert.equal(display.fighter(k.fighters[0],k.round).group.vacant,true);
});
test('帝皇铠甲五行印记按持有人和实际期限显示',()=>{
  const {make}=require('./helpers/remaining-4930-audit.cjs');
  const s=make({move:38483,soul:true});
  for(const [side,names] of [[0,['金印记','火土印记']],[1,['木印记','水印记']]]){
    const marks=round=>display.fighter(s.fighters[side],round).items.filter(x=>x.name.endsWith('印记'));
    assert.deepEqual(marks(1).map(x=>x.name),names);
    assert.ok(marks(5).every(x=>x.value==='余 1 回合'));
    assert.deepEqual(marks(6),[]);
  }
});
test('修罗铠甲按开局双攻显示正邪，平攻时显示未激活',()=>{
  const {make}=require('./helpers/remaining-4933.cjs');
  for(const [atk,spa,value] of [[200,100,'正气'],[100,200,'邪气'],[100,100,'未激活']]){
    const s=make({move:29425,index:-1,soul:true,aStats:{atk,spa}});
    assert.equal(display.fighter(s.fighters[0],1).items.find(x=>x.name==='气势').value,value);
  }
});
test('圣光灵神真实新版魂印的重生次数、神途形态层数及威力期限同步显示且只读',()=>{
 const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
 const member=id=>{const snapshot=store.species(id);return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000}}};};
 const foe=member(3056);if(!foe.moves.includes(10127))foe.moves[1]=10127;foe.build.overrides.atk=1500;foe.build.overrides.spe=9999;
 let g=T.create([[member(3311),member(2988)],[foe]],[0,0],{seed:13,criticals:false});
 const items=round=>{const before=structuredClone(g);const result=display.fighter(g.battle.fighters[0],round??g.battle.round).items;assert.deepEqual(g,before);return Object.fromEntries(result.map(x=>[x.name,x.value]));};
 assert.equal(items()['灵神重生'],'可用 1 次');assert.match(items()['神途之熠'],/^0 \/ 7 层/);
 g.battle.fighters[0].hp=1;g=T.turn(g,['potion:pp','wiki:10127']);
 const f=g.battle.fighters[0],boost=f.effects['灵神重生威力'];
 assert.equal(f.soulHash,'53bf6afd');assert.equal(f.soulState.holyReborn,true);
 assert.equal(items()['灵神重生'],'本场已使用');assert.match(items()['神途之熠'],/神灵形态/);
 assert.equal(items()['魂印攻击附伤'],f.lastIncomingSettledAttackDamage/2+' 点固定伤害');
 assert.equal(items(boost.start-1)['灵神重生 · 技能威力翻倍'],'下回合起，持续 2 回合');
 assert.equal(items(boost.start)['灵神重生 · 技能威力翻倍'],'余 2 回合');
 assert.equal(items(boost.end)['灵神重生 · 技能威力翻倍'],'余 1 回合');
 assert.equal(items(boost.end+1)['灵神重生 · 技能威力翻倍'],undefined);
 g=T.turn(g,['potion:pp','potion:pp']);assert.match(items()['神途之熠'],/^0 \/ 7 层 · 原系形态$/);
});
