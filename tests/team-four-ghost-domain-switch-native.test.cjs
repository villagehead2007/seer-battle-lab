'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');

const domain = '四杀鬼囹';
const fifth = 'wiki:38384';

function castDomain(opponentStats = {}, casterStats = {}) {
  const caster = member(4444, [38384], casterStats);
  const opponent = member(3002, [], opponentStats);
  const move = caster.snapshot.moves.find(entry => entry.id === 38384);
  assert.equal(move.hash, '861ebb39');
  assert.equal(move.effectInstances[1].id, 2469);

  const battle = T.create([[caster, member(3008)], [opponent, member(3056)]],
    [0, 0], {seed: 14, criticals: false});
  const effects = battle.battle.fighters[0].effects;
  assert.ok(['魑', '魅', '魍', '魉'].every(name => effects['鬼祰·' + name]));
  assert.deepEqual(T.candidates(battle, 0), [1]);
  assert.deepEqual(T.candidates(battle, 1), [1]);

  const cast = T.turn(battle, [fifth, pp]);
  for (const fighter of cast.battle.fighters) {
    assert.deepEqual(fighter.effects[domain], {start: 1, end: 4, noSwitch: true});
  }
  return cast;
}

test('百罗鬼帝真实第五消耗四道鬼祰后，四杀鬼囹禁止双方主动切换直至到期', () => {
  let battle = castDomain();
  for (let round = 2; round <= 4; round++) {
    assert.equal(battle.battle.round, round);
    assert.deepEqual(T.candidates(battle, 0), []);
    assert.deepEqual(T.candidates(battle, 1), []);
    assert.throws(() => T.turn(battle, [{switchTo: 1}, pp]), /换入|切换/);
    assert.throws(() => T.turn(battle, [pp, {switchTo: 1}]), /换入|切换/);
    battle = T.turn(battle, [pp, pp]);
  }
  battle = T.turn(battle, [{switchTo: 1}, {switchTo: 1}]);
  assert.deepEqual(battle.active, [1, 1]);
  assert.ok(battle.battle.fighters.every(fighter => fighter.effects[domain] === undefined));
});

test('四杀鬼囹允许阵亡补位，原对手身上的效果不会传给补位者', () => {
  let battle = castDomain({maxHp: 1, def: 1}, {atk: 2000});
  assert.equal(battle.phase, 'replace');
  assert.deepEqual(battle.pending, [1]);
  assert.equal(battle.battle.fighters[1].hp, 0);
  assert.deepEqual(T.candidates(battle, 1, true), [1]);

  battle = T.replace(battle, [null, 1]);
  assert.deepEqual(battle.active, [0, 1]);
  assert.equal(battle.battle.fighters[0].effects[domain].end, 4);
  assert.equal(battle.battle.fighters[1].effects[domain], undefined);
});
