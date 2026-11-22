'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');

const lock = '不能主动切换';
const swap = {switchTo: 1};

function assertClause(source, skill, index, effectId, args) {
  const move = source.snapshot.moves.find(entry => entry.id === skill);
  const effect = move.effectInstances[index];
  assert.equal(effect.id, effectId);
  if (args) assert.deepEqual(effect.args, args);
}

function assertBlocked(battle, side) {
  assert.deepEqual(T.candidates(battle, side), []);
  assert.throws(() => T.turn(battle, side === 0 ? [swap, pp] : [pp, swap]), /不可换入/);
}

for (const [id, skill, index, duration] of [
  [4625, 28666, 2, 1],
  [4669, 28802, 0, 1],
  [4785, 29088, 2, 1],
  [4921, 29390, 3, 2]
]) {
  test('效果2144原技能 ' + skill + ' 封双方原在场成员，阵亡补位独立于主动封换', () => {
    const caster = member(id, [skill]);
    assertClause(caster, skill, index, 2144, [duration]);
    const initial = T.create([
      [caster, member(2989)],
      [member(3001, [23108]), member(3056)]
    ], [0, 0], {seed: 'switch-lock', criticals: false});
    const cast = T.turn(initial, ['wiki:' + skill, pp]);
    const seal = {start: 2, end: duration + 1, noSwitch: true};
    assert.deepEqual(cast.battle.fighters.map(fighter => fighter.effects[lock]), [seal, seal]);

    let battle = cast;
    for (let round = 2; round <= seal.end; round++) {
      assert.equal(battle.battle.round, round);
      assertBlocked(battle, 0);
      assertBlocked(battle, 1);
      battle = T.turn(battle, [pp, pp]);
    }
    battle = T.turn(battle, [swap, swap]);
    assert.deepEqual(battle.active, [1, 1]);
    assert.ok(battle.battle.fighters.every(fighter => fighter.effects[lock] === undefined));

    const death = T.turn(cast, [pp, 'wiki:23108']);
    assert.equal(death.phase, 'replace');
    assert.deepEqual(death.pending, [1]);
    assert.equal(death.battle.fighters[1].hp, 0);
    battle = T.replace(death, [null, 1]);
    assert.deepEqual(battle.active, [0, 1]);
    assert.equal(battle.battle.fighters[1].effects[lock], undefined);
    if (duration > 1) assertBlocked(battle, 0);
  });
}

for (const [id, skill, index, divisor] of [[3983, 29193, 1, 3], [4444, 29346, 0, 4]]) {
  test('效果2367原技能 ' + skill + ' 只在原对手带真实臣服时解除并封换', () => {
    const ghost = member(4444, [38383, 29346]);
    const caster = id === 4444 ? ghost : member(3983, [29193]);
    assertClause(caster, skill, index, 2367, [1, 2, divisor]);
    const initial = T.create([
      [ghost, id === 4444 ? member(3102) : caster],
      [member(2989), member(3056)]
    ], [0, 0], {seed: 14, criticals: false});

    for (const applyStatus of [false, true]) {
      let battle = T.turn(initial, [applyStatus ? 'wiki:38383' : pp, pp]);
      if (id === 3983) battle = T.turn(battle, [swap, pp]);
      const {round} = battle.battle;
      const target = battle.battle.fighters[1];
      assert.equal(target.ailments['臣服'] >= round, applyStatus);
      battle = T.turn(battle, ['wiki:' + skill, pp]);
      assert.equal(battle.battle.fighters[1].ailments['臣服'], undefined);
      assert.deepEqual(battle.battle.fighters[1].effects[lock],
        applyStatus ? {start: round, end: round + 1} : undefined);
      assert.equal(battle.battle.fighters[0].effects[lock], undefined);
      if (applyStatus) assertBlocked(battle, 1);
      else assert.deepEqual(T.candidates(battle, 1), [1]);

      battle = T.turn(battle, [{switchTo: id === 3983 ? 0 : 1}, pp]);
      battle = T.turn(battle, [pp, swap]);
      assert.equal(battle.active[1], 1);
      assert.equal(battle.battle.fighters[1].effects[lock], undefined);
    }
  });
}

test('时空漩涡1667的封换独立于束缚，真实免异常挡下束缚时仍封原对手', () => {
  const caster = member(4184, [34895]);
  assertClause(caster, 34895, 0, 1667, []);
  const initial = T.create([
    [caster, member(3102)],
    [member(3056, [23287]), member(2989)]
  ], [0, 0], {seed: 13, criticals: false});
  for (const immune of [false, true]) {
    let battle = T.turn(initial, [pp, immune ? 'wiki:23287' : pp]);
    battle = T.turn(battle, ['wiki:34895', pp]);
    assert.equal(Boolean(battle.battle.fighters[1].ailments['束缚']), !immune);
    assert.deepEqual(battle.battle.fighters[1].effects[lock], {start: 3, end: 4, noSwitch: true});
    assert.equal(battle.battle.fighters[0].effects[lock], undefined);
    assertBlocked(battle, 1);

    battle = T.turn(battle, [swap, pp]);
    assertBlocked(battle, 1);
    battle = T.turn(battle, [pp, pp]);
    battle = T.turn(battle, [pp, swap]);
    assert.deepEqual(battle.active, [1, 1]);
    assert.equal(battle.battle.fighters[1].effects[lock], undefined);
  }
});

test('龙械图腾1509在原技能清空非第五PP后打开霸之庇护，封对手一回合', () => {
  const caster = member(4288);
  assert.equal(caster.snapshot.souls.find(soul => soul.id === 1509).hash, '6bf22e3');
  const initial = T.create([
    [caster, member(2988)],
    [member(3102, [24881]), member(3056)]
  ], [0, 0], {seed: 2, criticals: false});

  const intact = T.turn(initial, [pp, pp]);
  assert.equal(intact.battle.fighters[0].soulState.dragonTotem.openedRounds.dominion, undefined);
  assert.deepEqual(T.candidates(intact, 1), [1]);
  let battle = T.turn(initial, [pp, 'wiki:24881']);
  assert.equal(battle.battle.fighters[0].soulState.dragonTotem.openedRounds.dominion, 1);
  assert.deepEqual(battle.battle.fighters[1].effects[lock], {start: 2, end: 2});
  assert.equal(battle.battle.fighters[0].effects[lock], undefined);
  assertBlocked(battle, 1);

  battle = T.turn(battle, [swap, pp]);
  assert.equal(battle.battle.fighters[0].suitState.shield, 300);
  battle = T.turn(battle, [pp, swap]);
  assert.deepEqual(battle.active, [1, 1]);
  assert.equal(battle.battle.fighters[1].effects[lock], undefined);
});
