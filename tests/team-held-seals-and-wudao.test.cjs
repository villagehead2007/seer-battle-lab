'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const T=require('../dist/team-engine.js');
const D=require('../dist/battle-display.js');
const local=require('../local-species.cjs');
const {loadout}=require('./helpers/3001-native.cjs');
const hp='potion:hp',pp='potion:pp',settings={seed:14,criticals:false};
function member(id,stats={},moves=[]){
  const snapshot=local.species(id);
  return {snapshot,moves:moves.length?loadout(snapshot,moves):E.WIKI.defaultMoves(snapshot),
    build:{overrides:{maxHp:9000,def:3000,spd:3000,atk:120,spa:120,spe:100,...stats}}};
}
const red=(g,side=1)=>g.battle.damageEvents.filter(e=>e.round===g.battle.round-1&&e.sourceSide===side&&e.type==='attack');
const martial=g=>D.wudaoStatus(g.battle.fighters[0]);

test('原配招组队正转两道阈值，挡红伤后衍化，回到血道唤回第五 PP',()=>{
  let g=T.create([[member(4766,{spe:99}),member(3056)],[member(2988,{atk:600}),member(3017)]],[0,0],settings);
  assert.equal(martial(g),'正转 · 血道');
  const move='wiki:37911';
  for(const [i,path] of ['邪道','邪道','天道','血道','邪道'].entries()){
    g=T.turn(g,[i===0?move:hp,'wiki:19121']);
    assert.equal(martial(g),'正转 · '+path);
    assert.equal(red(g)[0].settledDamage>0,i===1);
    assert.equal(g.battle.fighters[0].pp[move],i<3?4:5);
    assert.equal(g.battle.turns.at(-1).events.some(e=>/抵挡 \d+ 点攻击红伤，衍化至/.test(e.text)),i!==1);
  }
  g=T.turn(g,[{switchTo:1},pp]);
  g=T.turn(g,[{switchTo:0},pp]);
  assert.equal(martial(g),'正转 · 血道');
  assert.equal(g.battle.fighters[0].soulState.wudao1967.fieldRounds,6);
});

test('神罡不灭的额外免攻使红伤为零，邪道不符合条件时不会误推进',()=>{
  let g=T.create([[member(4766,{spe:9999})],[member(2988,{atk:600})]],[0,0],settings);
  g=T.turn(g,['wiki:29045','wiki:19121']);
  assert.equal(martial(g),'正转 · 邪道');
  g=T.turn(g,[hp,'wiki:19121']);
  assert.equal(red(g)[0].settledDamage,0);
  assert.equal(martial(g),'正转 · 邪道');
  assert.ok(!g.battle.turns.at(-1).events.some(e=>e.text.includes('衍化至')));
});

test('原配招组队逆转血天邪血，反馈完整红伤，回到血道才回满逆转技能 PP',()=>{
  let g=T.create([[member(4766,{spe:99})],[member(2988,{atk:600})]],[0,0],settings);
  const move='wiki:37910';
  g=T.turn(g,[move,pp]);
  assert.equal(martial(g),'逆转 · 血道');
  for(const [i,path] of ['天道','邪道','血道','天道','邪道'].entries()){
    g=T.turn(g,[hp,'wiki:19121']);
    assert.equal(martial(g),'逆转 · '+path);
    const hit=red(g)[0];
    assert.ok(hit.hpLoss>0);
    const back=g.battle.damageEvents.find(e=>e.round===g.battle.round-1&&e.type==='percent'&&e.sourceSide===0);
    assert.equal(back.settledDamage,hit.settledDamage);
    assert.equal(g.battle.fighters[0].pp[move],i<2?4:5);
  }
});

test('回合封属和封攻由施放者持有，封原位对手、跟随对手换人、随自身退场清除',()=>{
  for(const [id,skill,key,next,check] of [
    [3031,24730,'heldStatusBlock','wiki:24780',g=>g.battle.fighters[1].stages.atk>0],
    [3240,30148,'heldAttackBlock','wiki:19369',g=>red(g).length>0],
  ]){
    const initial=T.create([[member(id,{spe:1},[skill]),member(3223)],[member(2988),member(3056)]],[0,0],settings);
    const g=T.turn(initial,['wiki:'+skill,key==='heldAttackBlock'?'wiki:24651':'wiki:19121']);
    const holder=g.battle.fighters[0],opponent=g.battle.fighters[1];
    assert.ok(holder.effects[key]);
    assert.equal(opponent.effects[key],undefined);
    const same=T.turn(g,[pp,key==='heldAttackBlock'?'wiki:19121':'wiki:24651']);
    assert.ok(same.history.some(line=>line.includes('持有的回合封招')));
    const swapped=T.turn(g,[pp,{switchTo:1}]);
    assert.equal(swapped.active[1],1);
    const nextFoe=T.turn(swapped,[pp,next]);
    assert.equal(check(nextFoe),false);
    assert.ok(nextFoe.history.some(line=>line.includes('持有的回合封招')&&line.includes('圣甲·盖亚')));
    const away=T.turn(swapped,[{switchTo:1},next]);
    assert.ok(check(away));
    assert.equal(away.slots[0][0].fighter.effects[key],undefined);
  }
});
