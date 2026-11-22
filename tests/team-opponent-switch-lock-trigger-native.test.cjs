'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');
const {loadout} = require('./helpers/3001-native.cjs');

const lock = '不能主动切换';
const swap = {switchTo: 1};

function casterWithClause(id, skill, index, effectId) {
  const caster = member(id);
  const version = E.WIKI.versionSnapshots(caster.snapshot)
    .find(snapshot => E.WIKI.availableMoves(snapshot).some(move => move.id === skill));
  if (version) caster.snapshot = version;
  caster.moves = loadout(caster.snapshot, [skill]);
  const effect = caster.snapshot.moves.find(move => move.id === skill).effectInstances[index];
  assert.equal(effect.id, effectId);
  return {caster, args: effect.args};
}

function start(caster, target, seed = 'switch-lock') {
  return T.create([[caster, member(2989)], [target, member(2988)]],
    [0, 0], {seed, criticals: false});
}

function checkWindow(battle, startRound, endRound) {
  const targetLock = battle.battle.fighters[1].effects[lock];
  assert.deepEqual(targetLock, startRound === undefined ? undefined :
    {start: startRound, end: endRound, noSwitch: true});
  assert.equal(battle.battle.fighters[0].effects[lock], undefined);
  assert.deepEqual(T.candidates(battle, 0), [1]);
  if (!targetLock) {
    assert.deepEqual(T.candidates(battle, 1), [1]);
    return;
  }

  for (let round = battle.battle.round; round <= endRound; round++) {
    assert.deepEqual(T.candidates(battle, 1), []);
    assert.throws(() => T.turn(battle, [pp, swap]), /不可换入/);
    battle = T.turn(battle, [battle.active[0] === 0 ? swap : pp, pp]);
    assert.deepEqual(battle.active, [1, 0]);
  }
  battle = T.turn(battle, [pp, swap]);
  assert.deepEqual(battle.active, [1, 1]);
  assert.equal(battle.battle.fighters[1].effects[lock], undefined);
}

for (const [id, skill] of [[3586, 38119], [4000, 38423], [4903, 38392]]) {
  test('效果2351原技能 ' + skill + ' 全部弱化被真实免弱挡下才封换', () => {
    const {caster, args} = casterWithClause(id, skill, id === 3586 ? 3 : 4, 2351);
    assert.deepEqual(args, [1, 2]);
    const initial = start(caster, member(4946, [29456]));
    for (const protectedTarget of [false, true]) {
      let battle = T.turn(initial, [pp, protectedTarget ? 'wiki:29456' : pp]);
      const target = battle.battle.fighters[1];
      assert.equal(Boolean(target.effects['免弱']), protectedTarget);
      assert.equal(Boolean(target.effects.protect), protectedTarget);
      battle = T.turn(battle, ['wiki:' + skill, pp]);
      assert.ok(battle.battle.fighters[1].hp > 0);
      if (protectedTarget) assert.ok(battle.battle.fighters[1].effects['免弱']);
      checkWindow(battle, protectedTarget ? 2 : undefined, 3);
    }
  });
}

for (const [id, skill, index] of [[4685, 37616, 1], [4872, 38273, 1]]) {
  test('效果2227原技能 ' + skill + ' 只有清除真实气力强化才封原目标', () => {
    const {caster, args} = casterWithClause(id, skill, index, 2227);
    assert.deepEqual(args, [1]);
    const initial = start(caster, member(3056, [20117]));
    for (const boosted of [false, true]) {
      let battle = T.turn(initial, [pp, boosted ? 'wiki:20117' : pp]);
      assert.equal(battle.battle.fighters[1].stages.atk, Number(boosted));
      battle = T.turn(battle, ['wiki:' + skill, pp]);
      assert.equal(battle.battle.fighters[1].stages.atk, 0);
      checkWindow(battle, boosted ? 3 : undefined, 3);
    }
  });
}

test('效果1783面对真实免断时封原对手，普通回合效果实际被清除时不封换', () => {
  const {caster, args} = casterWithClause(4345, 27902, 1, 1783);
  assert.deepEqual(args, [9, 2]);
  const initial = start(caster, member(3406, [25582, 30947]));
  for (const protectedTarget of [false, true]) {
    let battle = T.turn(initial, [pp, protectedTarget ? 'wiki:25582' : 'wiki:30947']);
    assert.equal(Boolean(battle.battle.fighters[1].effects.protect), protectedTarget);
    if (!protectedTarget) assert.ok(battle.battle.fighters[1].effects['免弱']);
    battle = T.turn(battle, ['wiki:27902', pp]);
    if (!protectedTarget) assert.equal(battle.battle.fighters[1].effects['免弱'], undefined);
    checkWindow(battle, protectedTarget ? 3 : undefined, 4);
  }
});

test('效果2332真实解除自身烧伤后，只封原对手下两回合', () => {
  const {caster, args} = casterWithClause(3524, 29142, 2, 2332);
  assert.deepEqual(args, [2]);
  caster.build.overrides.spe = 10;
  const initial = start(caster, member(3043, [19308], {spe: 5000}), 14);
  for (const burn of [false, true]) {
    let battle = T.turn(initial, [pp, burn ? 'wiki:19308' : pp]);
    assert.equal(Boolean(battle.battle.fighters[0].ailments['烧伤']), burn);
    battle = T.turn(battle, ['wiki:29142', pp]);
    assert.equal(battle.battle.fighters[0].ailments['烧伤'], undefined);
    checkWindow(battle, burn ? 3 : undefined, 4);
  }
});

test('效果2140普通目标实际损失体力时不封换，星皇免吸取时只封原目标', () => {
  const {caster, args} = casterWithClause(3941, 37241, 1, 2140);
  assert.deepEqual(args, [25, 5, 1]);
  for (const id of [3102, 3291]) {
    const initial = start(caster, member(id), 14);
    const battle = T.turn(initial, ['wiki:37241', pp]);
    const drain = battle.battle.damageEvents.filter(event => event.type === 'percent' &&
      event.sourceSide === 0 && event.hpLoss > 0);
    assert.equal(drain.length, id === 3291 ? 0 : 1);
    checkWindow(battle, id === 3291 ? 2 : undefined, 2);
  }
});
