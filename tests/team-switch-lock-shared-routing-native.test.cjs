'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');

const swap = {switchTo: 1};

function assertVoluntaryRejection(battle, side, position = 1) {
  assert.ok(!T.candidates(battle, side).includes(position));
  const actions = [pp, pp];
  actions[side] = {switchTo: position};
  assert.throws(() => T.turn(battle, actions), /不可换入/);
}

test('神秘结界1246只限制被放逐的候补主动上场，该候补仍能实际阵亡补位', () => {
  const caster = member(3986, [10920], {atk: 9999, spa: 9999});
  assert.equal(caster.snapshot.souls.find(soul => soul.id === 1246).hash, '4faedf27');
  const initial = T.create([
    [caster, member(3102)],
    [member(2989, [], {maxHp: 1, def: 1, spd: 1}), member(2988), member(3056), member(4647)]
  ], [0, 0], {seed: 13, criticals: false});
  assert.deepEqual(T.candidates(initial, 0), [1]);
  const exiled = initial.battle.teamExile1246[1].positions;
  assert.ok(exiled.length > 0 && exiled.length < 3);
  for (const position of exiled) assertVoluntaryRejection(initial, 1, position);
  const allowed = [1, 2, 3].find(position => !exiled.includes(position));
  assert.deepEqual(T.turn(initial, [pp, {switchTo: allowed}]).active, [0, allowed]);

  const left = T.turn(initial, [swap, pp]);
  assert.equal(left.battle.teamExile1246[1], null);
  assert.deepEqual(T.turn(left, [pp, {switchTo: exiled[0]}]).active, [1, exiled[0]]);

  const knockout = T.turn(initial, ['wiki:10920', pp]);
  assert.equal(knockout.phase, 'replace');
  assert.deepEqual(knockout.pending, [1]);
  assert.deepEqual(knockout.battle.teamExile1246[1].positions, exiled);
  assert.ok(T.candidates(knockout, 1, true).includes(exiled[0]));
  const replacement = T.replace(knockout, [null, exiled[0]]);
  assert.deepEqual(replacement.active, [0, exiled[0]]);
});

test('神途2610真实重生后由神灵形态限制双方主动换宠，阵亡补位可行，层数减半耗尽恢复', () => {
  const caster = member(3311, [], {maxHp: 120, def: 1});
  caster.moves = [38635, 38633, 29506, 29507, 38634];
  const fifth = caster.snapshot.moves.find(move => move.id === 38635);
  assert.equal(fifth.effectInstances[0].id, 2610);
  let battle = T.create([
    [caster, member(3056)],
    [member(3001, [14102, 23108], {atk: 9999, spe: 9999}), member(2989), member(4647)]
  ], [0, 0], {seed: 'divine-training', criticals: false});
  assert.deepEqual(T.candidates(battle, 0), [1]);
  assert.deepEqual(T.candidates(battle, 1), [1, 2]);
  battle = T.turn(battle, ['wiki:29507', 'wiki:14102']);
  const reborn = battle.battle.fighters[0];
  assert.equal(reborn.soulState.holyReborn, true);
  assert.equal(reborn.type, '神灵');
  assert.equal(reborn.soulState.divineJourney.layers, 3);
  assertVoluntaryRejection(battle, 0);
  assertVoluntaryRejection(battle, 1);

  const knockout = T.turn(battle, [pp, 'wiki:23108']);
  assert.deepEqual(knockout.pending, [1]);
  assert.equal(knockout.battle.fighters[0].type, '神灵');
  const replacement = T.replace(knockout, [null, 1]);
  assert.deepEqual(replacement.active, [0, 1]);
  assert.ok(T.candidates(replacement, 1, true).includes(2));
  assertVoluntaryRejection(replacement, 1, 2);

  for (const layers of [1, 0]) {
    battle = T.turn(battle, [pp, pp]);
    assert.equal(battle.battle.fighters[0].soulState.divineJourney.layers, layers);
    if (layers > 0) {
      assertVoluntaryRejection(battle, 0);
      assertVoluntaryRejection(battle, 1);
    }
  }
  assert.equal(battle.battle.fighters[0].type, reborn.soulState.divineJourney.originalType);
  assert.deepEqual(T.turn(battle, [swap, swap]).active, [1, 1]);
});

test('原技能37810对双方实际附加凝滞，分别限制状态持有者，解除后可同时换宠', () => {
  let battle = T.create([
    [member(3886, [37810]), member(3102)],
    [member(2989), member(3056)]
  ], [0, 0], {seed: 14, criticals: false});
  battle = T.turn(battle, ['wiki:37810', pp]);
  const end = battle.battle.fighters[0].ailments['凝滞'];
  assert.equal(end, battle.battle.fighters[1].ailments['凝滞']);
  assert.ok(end >= battle.battle.round);
  for (let round = battle.battle.round; round <= end; round++) {
    assertVoluntaryRejection(battle, 0);
    assertVoluntaryRejection(battle, 1);
    battle = T.turn(battle, [pp, pp]);
  }
  assert.deepEqual(T.turn(battle, [swap, swap]).active, [1, 1]);
});

test('原技能37762实际清强后施加瘫痪，锁原攻击对象，施术者离场后仍按状态期限', () => {
  const initial = T.create([
    [member(4716, [37762]), member(3102)],
    [member(3056, [20117]), member(2989)]
  ], [0, 0], {seed: 14, criticals: false});
  let control = T.turn(initial, [pp, pp]);
  control = T.turn(control, ['wiki:37762', pp]);
  assert.equal(control.battle.fighters[1].ailments['瘫痪'], undefined);
  assert.deepEqual(T.candidates(control, 1), [1]);

  let battle = T.turn(initial, [pp, 'wiki:20117']);
  battle = T.turn(battle, ['wiki:37762', pp]);
  const end = battle.battle.fighters[1].ailments['瘫痪'];
  assert.ok(end >= battle.battle.round);
  assert.equal(battle.battle.fighters[1].stages.atk, 0);
  assert.equal(battle.battle.fighters[0].ailments['瘫痪'], undefined);
  assert.deepEqual(T.candidates(battle, 0), [1]);
  for (let round = battle.battle.round; round <= end; round++) {
    assertVoluntaryRejection(battle, 1);
    battle = T.turn(battle, [battle.active[0] === 0 ? swap : pp, pp]);
  }
  assert.deepEqual(T.turn(battle, [pp, swap]).active, [1, 1]);
});
