'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {E, source, key, make, turn, sum} = require('./helpers/4766-battle.cjs');
const phase = f => E.SOULS.registry[1967].abilities.phase(f);
const maxPP = id => source.moves.find(move=>move.id===id).pp;

test('4766 战斗内正转连续两圈，每次回到血道才回满 PP',()=>{
  const s=make({soul:true,index:-1,move:10127});
  const own=key(10127);
  const expected=['evil','evil','sky','blood','evil','sky','blood'];
  for(const [offset, next] of expected.entries()){
    const round=offset+1;
    s.fighters[1].hp=9000;
    s.fighters[0].pp[own]=1;
    turn(s,null,10127);
    assert.equal(phase(s.fighters[0]),next,'R'+round);
    assert.equal(sum(s,'attack',1)>0,round===2,'R'+round);
    assert.equal(s.fighters[0].pp[own],next==='blood'?maxPP(10127):1,'R'+round);
  }
});

test('4766 真实逆转技能后按血天邪血循环，整招反馈保留原百分比口径',()=>{
  const move=source.moves.find(move=>move.id===37910);
  const reverseIndex=move.effectInstances.findIndex(instance=>instance.id===2292);
  const s=make({soul:true,index:reverseIndex,move:37910,aStats:{def:1000,spd:1000}});
  turn(s,37910,null);
  assert.equal(s.fighters[0].soulState.wudao1967.direction,'reverse');
  assert.equal(phase(s.fighters[0]),'blood');
  const own=key(29045);
  for(const next of ['sky','evil','blood','sky','evil','blood']){
    s.fighters[1].hp=9000;
    s.fighters[0].pp[own]=1;
    turn(s,null,10127);
    const red=sum(s,'attack',1);
    assert.ok(red>0);
    assert.equal(sum(s,'percent'),red);
    assert.equal(phase(s.fighters[0]),next);
    assert.equal(s.fighters[0].pp[own],next==='blood'?maxPP(29045):1);
  }
});

test('4766 血道挡该招的红伤，技能固定附伤仍按原值结算',()=>{
  const s=make({soul:true,index:-1,move:10127});
  const move=source.moves.find(move=>move.id===10716);
  const compiled=E.WIKI.effectsEngine.compileInstances(move.effectInstances,source.effects,move);
  assert.equal(compiled.issue,'');
  s.moveDefinitions[key(10716)].operations=compiled.operations;
  turn(s,null,10716);
  assert.equal(sum(s,'attack',1),0);
  assert.equal(sum(s,'fixed',1),50);
  assert.equal(phase(s.fighters[0]),'evil');
});
