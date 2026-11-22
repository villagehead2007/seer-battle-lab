'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');

const lock = '不能主动切换';

function assertOriginalTargetLock(battle, expected) {
  assert.equal(battle.battle.fighters[0].effects[lock], undefined);
  assert.deepEqual(battle.battle.fighters[1].effects[lock], expected);
  assert.deepEqual(T.candidates(battle, 0), [1]);
  assert.deepEqual(T.candidates(battle, 1), expected ? [] : [1]);
  if (expected) {
    assert.throws(() => T.turn(battle, [pp, {switchTo: 1}]), /不可换入/);
  }

  battle = T.turn(battle, [{switchTo: 1}, pp]);
  assert.deepEqual(battle.active, [1, 0]);
  battle = T.turn(battle, [pp, {switchTo: 1}]);
  assert.deepEqual(battle.active, [1, 1]);
  assert.equal(battle.battle.fighters[1].effects[lock], undefined);
}

test('库坦1717的强化被真实23556清除后才封原对手，保留强化时可以换入', () => {
  const caster = member(4503);
  assert.equal(caster.snapshot.souls.find(soul => soul.id === 1717).hash, '98b92253');
  const initial = T.create([
    [caster, member(3102)],
    [member(3289, [23556]), member(3056)]
  ], [0, 0], {seed: 13, criticals: false});

  for (const action of [pp, 'wiki:23556']) {
    const battle = T.turn(initial, [pp, action]);
    const cleared = action !== pp;
    assert.equal(battle.battle.fighters[0].stages.atk, cleared ? 0 : 2);
    assert.equal(battle.battle.fighters[0].stages.def, cleared ? 0 : 2);
    assertOriginalTargetLock(battle, cleared ? {start: 2, end: 2, noSwitch: true} : undefined);
  }
});

test('云境灵兽1954实战比较对手回初体力，零损失封换，红伤降低体力时获得必暴', () => {
  const caster = member(4750, [10003]);
  assert.equal(caster.snapshot.souls.find(soul => soul.id === 1954).hash, '596c2e69');
  const initial = T.create([
    [caster, member(3102)],
    [member(4516, [28337]), member(3056)]
  ], [0, 0], {seed: 13, criticals: false});

  const damaging = T.turn(initial, ['wiki:10003', pp]);
  assert.ok(damaging.battle.fighters[1].hp < initial.battle.fighters[1].hp);
  assert.ok(damaging.battle.fighters[0].effects['必定暴击']);
  assert.equal(damaging.battle.fighters[1].effects[lock], undefined);
  assert.deepEqual(T.candidates(damaging, 1), [1]);

  const prepared = T.turn(initial, [pp, 'wiki:28337']);
  const inactive = T.turn(prepared, [pp, pp]);
  assert.deepEqual(T.candidates(inactive, 1), [1]);
  const zeroDamage = T.turn(prepared, ['wiki:10003', pp]);
  assert.equal(zeroDamage.battle.fighters[0].pp['wiki:10003'],
    prepared.battle.fighters[0].pp['wiki:10003'] - 1);
  assert.equal(zeroDamage.battle.fighters[1].hp, prepared.battle.fighters[1].hp);
  assertOriginalTargetLock(zeroDamage, {
    start: 3, end: 3, sourceSoul: 1954, sourceHash: '596c2e69'
  });
});
