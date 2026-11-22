'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');

const skill = 'wiki:25545';
const attack = 'wiki:10127';
const swap = {switchTo: 1};

function create() {
  const caster = member(3393, [25545]);
  const effect = caster.snapshot.moves.find(move => move.id === 25545).effectInstances[1];
  assert.equal(effect.id, 1195);
  assert.deepEqual(effect.args, [4, 100, 19, 300]);
  return T.create([
    [caster, member(3102)],
    [member(3056, [10127, 23287], {atk: 1200}), member(2989)]
  ], [0, 0], {seed: 14, criticals: false});
}

function damage(battle, type, sourceSide, round) {
  return (battle.battle.damageEvents ?? [])
    .filter(event => event.round === round && event.type === type && event.sourceSide === sourceSide)
    .reduce((total, event) => total + event.settledDamage, 0);
}

test('3393原25545在真实受击时令攻击者瘫痪并封换，离场后仍按状态到期', () => {
  let battle = T.turn(create(), [skill, pp]);
  assert.equal(battle.battle.fighters[0].effects['受击瘫痪或固伤'].end, 4);
  assert.deepEqual(T.candidates(battle, 1), [1]);

  battle = T.turn(battle, [pp, attack]);
  assert.ok(damage(battle, 'attack', 1, 2) > 0);
  assert.equal(damage(battle, 'fixed', 0, 2), 0);
  assert.equal(battle.battle.fighters[0].ailments['瘫痪'], undefined);
  const end = battle.battle.fighters[1].ailments['瘫痪'];
  assert.ok(end >= battle.battle.round);
  while (battle.battle.round <= end) {
    assert.throws(() => T.turn(battle, [pp, swap]), /不可换入/);
    battle = T.turn(battle, [battle.active[0] === 0 ? swap : pp, pp]);
  }
  assert.deepEqual(T.turn(battle, [pp, swap]).active, [1, 1]);
});

test('3393原25545的瘫痪被真实英勇圣甲免疫时附300固伤且不封换', () => {
  let battle = T.turn(create(), [skill, 'wiki:23287']);
  battle = T.turn(battle, [pp, attack]);
  assert.ok(damage(battle, 'attack', 1, 2) > 0);
  assert.equal(battle.battle.fighters[1].ailments['瘫痪'], undefined);
  assert.equal(damage(battle, 'fixed', 0, 2), 300);
  assert.deepEqual(T.turn(battle, [pp, swap]).active, [0, 1]);
});

test('3393原25545对手用药或效果到期后受到攻击都不会产生反制', () => {
  let battle = T.turn(create(), [skill, pp]);
  while (battle.battle.round <= 4) {
    battle = T.turn(battle, [pp, pp]);
    assert.equal(battle.battle.fighters[1].ailments['瘫痪'], undefined);
  }
  assert.equal(battle.battle.fighters[0].effects['受击瘫痪或固伤'], undefined);
  battle = T.turn(battle, [pp, attack]);
  assert.ok(battle.battle.damageEvents.some(event =>
    event.round === 5 && event.type === 'attack' && event.sourceSide === 1));
  assert.equal(damage(battle, 'fixed', 0, 5), 0);
  assert.equal(battle.battle.fighters[1].ailments['瘫痪'], undefined);
  assert.deepEqual(T.candidates(battle, 1), [1]);
});
