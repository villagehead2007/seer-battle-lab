'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');
const {loadout} = require('./helpers/3001-native.cjs');

const status = '瘫痪';
const swap = {switchTo: 1};
const seedFor = value => Math.imul(value, 2654435761) >>> 0;

function configured(id, skills, stats = {}) {
  const caster = member(id, [], stats);
  const selected = E.WIKI.versionSnapshots(caster.snapshot)
    .find(snapshot => skills.every(id => E.WIKI.availableMoves(snapshot).some(move => move.id === id)));
  if (selected) caster.snapshot = selected;
  caster.moves = loadout(caster.snapshot, skills);
  return caster;
}

function make(caster, opponent, seed) {
  return T.create([[caster, member(3102)], [opponent, member(2988)]],
    [0, 0], {seed, criticals: false});
}

function effectOf(caster, skill, index, id) {
  const effect = caster.snapshot.moves.find(move => move.id === skill).effectInstances[index];
  assert.equal(effect.id, id);
  return effect;
}

function observeLock(battle, applied) {
  const [caster, target] = battle.battle.fighters;
  assert.ok(target.hp > 0);
  assert.equal(caster.ailments[status], undefined);
  assert.deepEqual(T.candidates(battle, 0), [1]);
  if (!applied) {
    assert.equal(target.ailments[status], undefined);
    assert.deepEqual(T.candidates(battle, 1), [1]);
    return;
  }

  const end = target.ailments[status];
  assert.ok(end >= battle.battle.round);
  while (battle.battle.round <= end) {
    assert.deepEqual(T.candidates(battle, 1), []);
    assert.throws(() => T.turn(battle, [pp, swap]), /不可换入/);
    battle = T.turn(battle, [battle.active[0] === 0 ? swap : pp, pp]);
  }
  assert.deepEqual(battle.active, [1, 0]);
  assert.deepEqual(T.turn(battle, [pp, swap]).active, [1, 1]);
}

for (const [id, skill, index, effectId, success, failure] of [
  [3476, 31323, 1, 1047, 1, 2],
  [3631, 17286, 1, 756, 7, 1],
  [3631, 17288, 0, 756, 1, 2],
  [3631, 19690, 1, 937, 7, 1],
  [3631, 32144, 1, 966, 1, 2],
  [3896, 26808, 2, 756, 1, 3],
  [4674, 28824, 1, 803, 4, 1]
]) {
  test('原技能 ' + skill + ' 的概率瘫痪只限制实际状态持有者，失败不封换', () => {
    const caster = configured(id, [skill]);
    assert.ok(effectOf(caster, skill, index, effectId).args.includes(19));
    for (const applied of [false, true]) {
      const initial = make(caster, member(2989), seedFor(applied ? success : failure));
      assert.equal(initial.battle.fighters[1].stages.atk, 0);
      const battle = T.turn(initial, ['wiki:' + skill, pp]);
      observeLock(battle, applied);
    }
  });
}

for (const [id, skill, index, effectId, seed] of [
  [3631, 26180, 3, 1077, 14],
  [3652, 26221, 1, 1140, 14],
  [3840, 26671, 1, 1200, seedFor(2)],
  [3896, 26810, 2, 1322, 14],
  [4184, 27494, 1, 1077, 14],
  [4909, 29365, 3, 164, 14]
]) {
  test('原技能 ' + skill + ' 使实际攻击者瘫痪，真实受击后仅该目标受封换', () => {
    const caster = configured(id, [skill]);
    assert.ok(effectOf(caster, skill, index, effectId).args.includes(19));
    const original = make(caster, member(3056, [10127], {atk: 1200}), seed);
    const armed = T.turn(original, ['wiki:' + skill, pp]);
    assert.equal(armed.battle.fighters[1].ailments[status], undefined);
    const battle = T.turn(armed, [pp, 'wiki:10127']);
    assert.ok(battle.battle.damageEvents.some(event => event.round === 2 &&
      event.type === 'attack' && event.sourceSide === 1));
    observeLock(battle, true);
  });
}

test('19692在真实获得强化后才有瘫痪成功种子，未强化或随机失败不锁', () => {
  const caster = configured(3631, [19692, 24950]);
  assert.deepEqual(effectOf(caster, 19692, 1, 434).args, [60, 19]);
  for (const [boosted, seed, applied] of [[false, 1, false], [true, 1, true], [true, 3, false]]) {
    let battle = make(caster, member(3056), seedFor(seed));
    battle = T.turn(battle, [boosted ? 'wiki:24950' : pp, pp]);
    assert.equal(battle.battle.fighters[0].stages.atk, boosted ? 2 : 0);
    battle = T.turn(battle, ['wiki:19692', pp]);
    observeLock(battle, applied);
  }
});

test('19690吸强成功施加瘫痪，后续独立的40%瘫痪失败时仍按原目标封换', () => {
  const caster = configured(3631, [19690]);
  assert.deepEqual(effectOf(caster, 19690, 0, 948).args, [19]);
  let battle = make(caster, member(3056, [20117]), seedFor(1));
  battle = T.turn(battle, [pp, 'wiki:20117']);
  assert.equal(battle.battle.fighters[1].stages.atk, 1);
  battle = T.turn(battle, ['wiki:19690', pp]);
  const target = battle.battle.fighters[1];
  assert.equal(target.stages.atk, 0);
  assert.equal(target.effects.id984.amount, -2);
  observeLock(battle, true);
});

test('31507真实自爆由自身完成阵亡补位，原对手的瘫痪持续到来源期限', () => {
  const caster = configured(3512, [31507], {maxHp: 2000});
  assert.deepEqual(effectOf(caster, 31507, 0, 1277).args, []);
  let battle = make(caster, member(2989), seedFor(1));
  battle = T.turn(battle, ['wiki:31507', pp]);
  assert.deepEqual(battle.pending, [0]);
  assert.equal(battle.battle.fighters[0].hp, 0);
  assert.ok(battle.battle.fighters[1].hp > 0);
  assert.equal(battle.battle.fighters[1].ailments[status], 2);
  battle = T.replace(battle, [1, null]);
  assert.deepEqual(battle.active, [1, 0]);
  assert.throws(() => T.turn(battle, [pp, swap]), /不可换入/);
  battle = T.turn(battle, [pp, pp]);
  assert.deepEqual(T.turn(battle, [pp, swap]).active, [1, 1]);

  const healthy = configured(3512, [31507], {maxHp: 9500});
  const stays = T.turn(make(healthy, member(2989), seedFor(1)), ['wiki:31507', pp]);
  assert.equal(stays.battle.fighters[0].hp, 1);
  assert.equal(stays.battle.fighters[1].ailments[status], undefined);
  assert.deepEqual(T.candidates(stays, 1), [1]);
});

test('33463仅真实攻击伤害高于300时施加瘫痪并封换', () => {
  const caster = configured(3896, [33463], {atk: 2000, spa: 2000});
  assert.deepEqual(effectOf(caster, 33463, 2, 1106).args, [300, 100, 19]);
  for (const [defense, applied] of [[4000, false], [400, true]]) {
    const initial = make(caster, member(2989, [], {def: defense, spd: defense}), seedFor(1));
    const battle = T.turn(initial, ['wiki:33463', pp]);
    const red = battle.battle.damageEvents.find(event => event.type === 'attack' && event.sourceSide === 0);
    assert.equal(red.settledDamage > 300, applied);
    observeLock(battle, applied);
  }
});

test('星光·能源吸收38505吸取真实强化后才瘫痪原目标', () => {
  const caster = configured(4937, [38505]);
  assert.deepEqual(effectOf(caster, 38505, 0, 948).args, [19]);
  const initial = make(caster, member(4946, [29456]), 14);
  for (const boosted of [false, true]) {
    let battle = T.turn(initial, [pp, boosted ? 'wiki:29456' : pp]);
    assert.equal(battle.battle.fighters[1].stages.def, boosted ? 2 : 0);
    battle = T.turn(battle, ['wiki:38505', pp]);
    assert.equal(battle.battle.fighters[1].stages.def, 0);
    observeLock(battle, boosted);
  }
});

test('38538在真实免疫百分比吸取时附加瘫痪，普通目标只承受其他异常', () => {
  const caster = configured(4946, [38538]);
  assert.deepEqual(effectOf(caster, 38538, 2, 1885).args, [3, 100, 19]);
  for (const id of [2989, 3291]) {
    const battle = T.turn(make(caster, member(id), 14), ['wiki:38538', pp]);
    const percent = battle.battle.damageEvents
      .filter(event => event.type === 'percent' && event.sourceSide === 0)
      .reduce((total, event) => total + event.settledDamage, 0);
    assert.equal(percent, id === 3291 ? 0 : 3000);
    assert.ok(battle.battle.fighters[1].ailments['麻痹']);
    observeLock(battle, id === 3291);
  }
});

test('37136只在原对手实际有强化时才判定70%瘫痪', () => {
  const caster = configured(4605, [37136]);
  assert.deepEqual(effectOf(caster, 37136, 1, 200).args, [70, 19]);
  for (const [boosted, seed, applied] of [[false, 1, false], [true, 1, true], [true, 3, false]]) {
    let battle = make(caster, member(3056, [20117]), seedFor(seed));
    battle = T.turn(battle, [pp, boosted ? 'wiki:20117' : pp]);
    assert.equal(battle.battle.fighters[1].stages.atk, Number(boosted));
    battle = T.turn(battle, ['wiki:37136', pp]);
    observeLock(battle, applied);
  }
});

test('大雪纷飞28319只对未强化的原对手附加凝滞，凝滞到期后正常换宠', () => {
  const caster = configured(4511, [28319]);
  assert.deepEqual(effectOf(caster, 28319, 2, 2004).args, [100, 32]);
  const initial = make(caster, member(3289, [23556]), seedFor(1));
  for (const cleared of [false, true]) {
    let battle = T.turn(initial, [pp, cleared ? 'wiki:23556' : pp]);
    assert.equal(battle.battle.fighters[1].stages.atk, cleared ? 0 : 1);
    battle = T.turn(battle, ['wiki:28319', pp]);
    assert.equal(battle.battle.fighters[0].ailments['凝滞'], undefined);
    if (!cleared) {
      assert.equal(battle.battle.fighters[1].ailments['凝滞'], undefined);
      assert.deepEqual(T.candidates(battle, 1), [1]);
      continue;
    }
    const end = battle.battle.fighters[1].ailments['凝滞'];
    assert.ok(end >= battle.battle.round);
    while (battle.battle.round <= end) {
      assert.throws(() => T.turn(battle, [pp, swap]), /不可换入/);
      battle = T.turn(battle, [battle.active[0] === 0 ? swap : pp, pp]);
    }
    assert.deepEqual(T.turn(battle, [pp, swap]).active, [1, 1]);
  }
});
