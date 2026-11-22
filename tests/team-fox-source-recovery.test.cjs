'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('失心迷阵经真实23556清双方等级而解除，次回合确实禁换，再下一回合恢复；药剂不消费首次技能',()=>{
 let g=T.create([[member(4372),member(3056)],[member(3289,23556),member(2988)]],[0,0],{seed:13,criticals:false});assert.equal(g.battle.fighters[1].gender,1);assert.ok(g.battle.fighters[1].soulState.specialStates['失心迷阵']);
 g=T.turn(g,['potion:pp','wiki:23556']);assert.equal(g.battle.fighters[1].soulState.specialStates['失心迷阵'],undefined);assert.ok(Object.values(g.battle.fighters[0].stages).every(n=>n===0));assert.ok(!g.battle.fighters[0].soulState.foxFirstSkillDone);
 assert.deepEqual(T.candidates(g,1),[]);assert.throws(()=>T.turn(g,['potion:pp',{switchTo:1}]));
 const before=structuredClone(g);assert.match(D.fighter(g.battle.fighters[0],g.battle.round).items.find(x=>x.name==='本次在场首次技能').value,/待触发/);assert.deepEqual(g,before);
 g=T.turn(g,['potion:pp','potion:pp']);assert.deepEqual(T.candidates(g,1),[1]);g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.active[1],1);
});
test('苏璃真实35890对已有迷阵雄性免PP，对新换入雄性消耗PP施阵，源下场仍反转药剂而持有者下场清除',()=>{
 let g=T.create([[member(4372,35890),member(3056)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});const key='wiki:35890',pp=g.battle.fighters[0].pp[key];
 g=T.turn(g,[key,'potion:pp']);assert.equal(g.battle.fighters[0].pp[key],pp);assert.ok(g.battle.fighters[0].soulState.foxFirstSkillDone);
 g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.battle.fighters[1].soulState.specialStates?.['失心迷阵'],undefined);const before=g.battle.fighters[0].pp[key];
 g=T.turn(g,[key,'potion:pp']);assert.equal(g.battle.fighters[0].pp[key],before-1);assert.ok(g.battle.fighters[1].soulState.specialStates['失心迷阵']);
 g=T.turn(g,[{switchTo:1},'potion:hp']);assert.ok(g.battle.fighters[1].soulState.specialStates['失心迷阵']);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('药剂反转')&&e.text.includes('250')));
 g=T.turn(g,['potion:pp',{switchTo:0}]);assert.equal(g.slots[1][1].fighter.soulState.specialStates?.['失心迷阵'],undefined);
});

test('苏璃35890单独施阵后解除，只禁止原对手下一回合主动换宠', () => {
  const skill = 'wiki:35890';
  const clearStages = 'wiki:23556';
  const pp = 'potion:pp';
  const maze = '失心迷阵';
  const lock = '不能主动切换';
  let battle = T.create([[member(4372, 35890), member(3056)], [member(3289, 23556), member(2988)]],
    [0, 0], {seed: 13, criticals: false});

  battle = T.turn(battle, [pp, clearStages]);
  battle = T.turn(battle, [pp, pp]);
  const [fox, opponent] = battle.battle.fighters;
  assert.equal(opponent.soulState.specialStates?.[maze], undefined);
  assert.equal(opponent.effects[lock], undefined);
  assert.deepEqual(T.candidates(battle, 1), [1]);

  const castRound = battle.battle.round;
  battle = T.turn(battle, [skill, clearStages]);
  const [caster, restricted] = battle.battle.fighters;
  assert.equal(caster.pp[skill], fox.pp[skill] - 1);
  assert.equal(restricted.soulState.specialStates?.[maze], undefined);
  assert.equal(caster.effects[lock], undefined);
  assert.deepEqual(restricted.effects[lock], {start: castRound + 1, end: castRound + 1});
  assert.deepEqual(T.candidates(battle, 0), [1]);
  assert.deepEqual(T.candidates(battle, 1), []);
  assert.throws(() => T.turn(battle, [{switchTo: 1}, {switchTo: 1}]));

  battle = T.turn(battle, [{switchTo: 1}, pp]);
  assert.deepEqual(battle.active, [1, 0]);
  assert.deepEqual(T.candidates(battle, 1), [1]);
  battle = T.turn(battle, [pp, {switchTo: 1}]);
  assert.deepEqual(battle.active, [1, 1]);
  assert.equal(battle.battle.fighters[1].effects[lock], undefined);
  assert.equal(battle.slots[1][0].fighter.effects[lock], undefined);
});
