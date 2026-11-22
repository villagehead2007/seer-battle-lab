'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');
const {T, S, member, pp} = require('./helpers/report-restriction-native.cjs');
const {loadout} = require('./helpers/3001-native.cjs');

const lock = '不能主动切换';
const swap = {switchTo: 1};

function assertRejected(battle) {
  assert.deepEqual(T.candidates(battle, 1), []);
  assert.throws(() => T.turn(battle, [pp, swap]), /不可换入/);
}

for (const [id, skill, index, percent, duration] of [
  [4354, 38348, 3, 50, 2],
  [4444, 38383, 4, 100, 1]
]) {
  test('效果2440原技能 ' + skill + ' 的实际零红伤只封原对手，正红伤不封换', () => {
    const snapshot = E.WIKI.versionSnapshots(S.species(id))
      .find(version => E.WIKI.availableMoves(version).some(move => move.id === skill));
    assert.ok(snapshot);
    const caster = {...member(id), snapshot, moves: loadout(snapshot, [skill])};
    const effect = snapshot.moves.find(move => move.id === skill).effectInstances[index];
    assert.equal(effect.id, 2440);
    assert.deepEqual(effect.args, [percent, duration]);
    const initial = T.create([
      [caster, member(3102)],
      [member(4516, [28337]), member(3056)]
    ], [0, 0], {seed: 13, criticals: false});

    const hit = T.turn(initial, ['wiki:' + skill, pp]);
    const hitEvent = hit.battle.damageEvents.find(event => event.type === 'attack' && event.sourceSide === 0);
    assert.ok(hitEvent.settledDamage > 0);
    assert.equal(hit.battle.fighters[1].effects[lock], undefined);
    assert.deepEqual(T.candidates(hit, 1), [1]);

    let battle = T.turn(initial, [pp, 'wiki:28337']);
    battle = T.turn(battle, ['wiki:' + skill, pp]);
    const blockedHit = battle.battle.damageEvents.find(event => event.type === 'attack' && event.sourceSide === 0);
    assert.equal(blockedHit.settledDamage, 0);
    assert.equal(battle.battle.fighters[0].effects[lock], undefined);
    assert.deepEqual(battle.battle.fighters[1].effects[lock],
      {start: 3, end: 2 + duration, noSwitch: true});
    assertRejected(battle);

    battle = T.turn(battle, [swap, pp]);
    if (duration === 2) {
      assertRejected(battle);
      battle = T.turn(battle, [pp, pp]);
    }
    battle = T.turn(battle, [pp, swap]);
    assert.deepEqual(battle.active, [1, 1]);
    assert.equal(battle.battle.fighters[1].effects[lock], undefined);
  });
}

test('武心婵1994仅在实战获得白鳞后封换，白鳞离场消失时按原机制清除封换', () => {
  const caster = member(4500, [28325, 28326, 28327]);
  const effect = caster.snapshot.moves.find(move => move.id === 28327).effectInstances[4];
  assert.equal(effect.id, 1994);
  assert.deepEqual(effect.args, [2, 1, 2]);
  const initial = T.create([
    [caster, member(3102)],
    [member(3056, [10127]), member(2989)]
  ], [0, 0], {seed: 13, criticals: false});

  const normal = T.turn(initial, ['wiki:28327', pp]);
  assert.equal(normal.battle.fighters[1].effects[lock], undefined);
  assert.deepEqual(T.candidates(normal, 1), [1]);

  let battle = T.turn(initial, ['wiki:28325', 'wiki:10127']);
  assert.deepEqual(Object.keys(battle.battle.fighters[0].soulState.royalGuards), ['blue']);
  battle = T.turn(battle, ['wiki:28326', pp]);
  assert.equal(battle.battle.fighters[0].soulState.royalGuards.white.start, 3);
  const cast = T.turn(battle, ['wiki:28327', pp]);
  assert.equal(cast.battle.fighters[0].effects[lock], undefined);
  assert.deepEqual(cast.battle.fighters[1].effects[lock], {start: 4, end: 5});
  assertRejected(cast);

  const left = T.turn(cast, [swap, pp]);
  assert.equal(left.battle.round, 5);
  assert.equal(left.slots[0][0].fighter.soulState.royalGuards?.white, undefined);
  assert.equal(left.battle.fighters[1].effects[lock], undefined);
  assert.deepEqual(T.turn(left, [pp, swap]).active, [1, 1]);

  battle = T.turn(cast, [pp, pp]);
  assertRejected(battle);
  battle = T.turn(battle, [pp, pp]);
  assert.deepEqual(T.turn(battle, [pp, swap]).active, [0, 1]);
});

test('空元行者2190在真实睡眠中因未用技能触发无为，清空原技能PP并封原对手下一回合', () => {
  const caster = member(4661, [37458]);
  const effect = caster.snapshot.moves.find(move => move.id === 37458).effectInstances[3];
  assert.equal(effect.id, 2190);
  assert.deepEqual(effect.args, [3]);
  const initial = T.create([
    [caster, member(2989)],
    [member(4372, [20178]), member(3056)]
  ], [0, 0], {seed: 14, criticals: false});
  assert.equal(initial.battle.fighters[0].pp['wiki:37458'], 1);

  const control = T.turn(initial, [pp, pp]);
  assert.equal(control.battle.fighters[0].pp['wiki:37458'], 1);
  assert.equal(control.battle.fighters[1].effects[lock], undefined);

  let battle = T.turn(initial, [pp, 'wiki:20178']);
  assert.ok(battle.battle.fighters[0].ailments['睡眠'] >= battle.battle.round);
  assert.equal(battle.battle.fighters[0].pp['wiki:37458'], 0);
  assert.equal(battle.battle.fighters[0].effects[lock], undefined);
  assert.deepEqual(battle.battle.fighters[1].effects[lock], {start: 2, end: 2});
  assertRejected(battle);

  battle = T.turn(battle, [swap, pp]);
  battle = T.turn(battle, [pp, swap]);
  assert.deepEqual(battle.active, [1, 1]);
  assert.equal(battle.battle.fighters[1].effects[lock], undefined);
});
