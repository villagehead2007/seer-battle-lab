'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');

const lock = '不能主动切换';
const fixtures = [
  [3886, 26781, 3, 2],
  [4329, 35660, 1, 1],
  [4386, 27996, 3, 2],
  [4541, 36791, 2, 1],
  [4604, 28604, 0, 2],
  [4662, 37469, 3, 1],
  [4679, 37521, 2, 1],
  [4823, 38113, 1, 1]
];

function castLock(id, move, index, duration) {
  const caster = member(id, [move]);
  const effect = caster.snapshot.moves.find(entry => entry.id === move).effectInstances[index];
  assert.equal(effect.id, 1478);
  assert.deepEqual(effect.args, [duration]);
  const start = T.create([
    [caster, member(3102)],
    [member(3001, [23108]), member(2989), member(4995)]
  ], [0, 0], {seed: 'switch-lock', criticals: false});

  assert.equal(T.switchMode(start, 1), 'expelled');
  assert.deepEqual(T.candidates(start, 1), [1, 2]);
  const battle = T.turn(start, ['wiki:' + move, pp]);
  assert.equal(battle.battle.fighters[0].effects[lock], undefined);
  assert.deepEqual(battle.battle.fighters[1].effects[lock],
    {start: 2, end: 1 + duration, noSwitch: true});
  return battle;
}

for (const [id, move, index, duration] of fixtures) {
  test('效果1478原技能 ' + move + ' 仅封原对手，玄武改变离场类别后仍守原期限', () => {
    let battle = castLock(id, move, index, duration);
    assert.deepEqual(T.candidates(battle, 0), [1]);
    for (let round = 2; round <= duration + 1; round++) {
      assert.equal(battle.battle.round, round);
      assert.deepEqual(T.candidates(battle, 1), []);
      assert.throws(() => T.turn(battle, [pp, {switchTo: 1}]), /不可换入/);
      battle = T.turn(battle, [round === 2 ? {switchTo: 1} : pp, pp]);
      assert.deepEqual(battle.active, [1, 0]);
    }

    assert.deepEqual(T.candidates(battle, 1), [1, 2]);
    battle = T.turn(battle, [pp, {switchTo: 1}]);
    assert.deepEqual(battle.active, [1, 1]);
    assert.equal(battle.battle.fighters[1].effects[lock], undefined);
    const departure = battle.battle.teamDepartureEvents.find(event => event.side === 1);
    assert.equal(departure.kind, 'expelled');
    assert.equal(departure.selection, 'chosen');
  });
}

test('效果1478封换期间允许真实阵亡补位，原目标的封换不交给候补', () => {
  let battle = castLock(...fixtures[0]);
  battle = T.turn(battle, [{switchTo: 1}, 'wiki:23108']);
  assert.equal(battle.phase, 'replace');
  assert.deepEqual(battle.pending, [1]);
  assert.equal(battle.battle.fighters[1].hp, 0);
  assert.equal(battle.battle.fighters[1].effects[lock].end, 3);
  battle = T.replace(battle, [null, 1]);
  assert.deepEqual(battle.active, [1, 1]);
  assert.equal(battle.battle.fighters[1].effects[lock], undefined);
  assert.equal(battle.battle.teamDepartureEvents.find(event => event.side === 1).kind, 'knockout');
});
