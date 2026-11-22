'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');
const shield = require('../dist/shield-rules.js');
const {T, member, pp, S} = require('./helpers/report-restriction-native.cjs');

test('原393由满血经历敌方真实强化与击败，清对手PP和回合并只给玩家指定的补位者双防', () => {
  let game = T.create([
    [member(3033, [], {def: 1}), member(3002), member(3004)],
    [member(2989, [24624, 10086], {atk: 9999})]
  ], [0, 0], {seed: 14, criticals: false});
  game = T.turn(game, [pp, 'wiki:24624']);
  const foe = game.battle.fighters[1];
  assert.equal(game.battle.fighters[0].hp, 9000);
  assert.equal(foe.stages.def, 2);
  assert.equal(foe.stages.spd, 2);
  assert.ok(Object.keys(foe.effects).length > 0);
  game = T.turn(game, [pp, 'wiki:10086']);
  assert.deepEqual(game.pending, [0]);
  assert.equal(game.battle.fighters[0].hp, 0);
  assert.ok(Object.values(game.battle.fighters[1].pp).every(n => n === 0));
  assert.deepEqual(game.battle.fighters[1].effects, {});
  assert.equal(game.battle.fighters[1].stages.def, 0);
  assert.equal(game.battle.fighters[1].stages.spd, 0);
  game = T.replace(game, [2, null]);
  assert.equal(game.battle.fighters[0].stages.def, 2);
  assert.equal(game.battle.fighters[0].stages.spd, 2);
  game = T.turn(game, [{switchTo: 1}, pp]);
  assert.ok(Object.values(game.battle.fighters[0].stages).every(n => n === 0));
  game = T.turn(game, [{switchTo: 2}, pp]);
  assert.ok(Object.values(game.battle.fighters[0].stages).every(n => n === 0));
});

function jasmine() {
  const source = member(3613, [], {spd: 1});
  source.snapshot = E.WIKI.versionSnapshots(S.species(3613)).find(s => s.selectedSoulId === 1825);
  source.moves = E.WIKI.defaultMoves(source.snapshot);
  return T.create([
    [source, member(3002), member(3004)],
    [member(5000, [10996], {spa: 9999})]
  ], [0, 0], {seed: 14, criticals: false});
}

function jasmineDefeat() {
  let game = jasmine();
  for (let i = 0; i < 2; i++) game = T.turn(game, [pp, pp]);
  assert.equal(game.battle.fighters[0].soulState.jasmineCore, 2);
  for (let i = 0; i < 10 && game.phase === 'action'; i++) {
    const attack = game.battle.fighters[1].pp['wiki:10996'] > 0;
    game = T.turn(game, [pp, attack ? 'wiki:10996' : pp]);
  }
  assert.deepEqual(game.pending, [0]);
  assert.equal(game.battle.fighters[0].hp, 0);
  assert.deepEqual(game.battle.damageEvents.filter(e => e.targetSide === 0 && e.type === 'attack' && e.hpLoss > 0).map(e => e.hpLoss), [3000, 3000, 3000]);
  return T.replace(game, [2, null]);
}

test('原1825真实累积2芯并被击败，实际补位者获三回合芳馨之祝，获得盾罩且临时上限自然到期', () => {
  let game = jasmineDefeat();
  const round = game.battle.round;
  const fighter = game.battle.fighters[0];
  assert.equal(fighter.soulState.jasmineBlessing.end, round + 2);
  assert.equal(fighter.stats.maxHp, 9500);
  assert.equal(shield.sourceValue(fighter, '芳馨之祝'), 500);
  assert.equal(shield.barrierSourceValue(fighter, '芳馨之祝'), 500);
  assert.equal(game.slots[0][1].fighter.stats.maxHp, 9000);
  for (let i = 0; i < 2; i++) {
    game = T.turn(game, [pp, pp]);
    assert.equal(game.battle.fighters[0].stats.maxHp, 9500);
  }
  game = T.turn(game, [pp, pp]);
  assert.equal(game.battle.fighters[0].stats.maxHp, 9000);
  assert.equal(game.battle.fighters[0].soulState.jasmineBlessing, undefined);
});

test('原1825主动离场不授芳馨之祝，获祝后离场仍由原补位者持有并按原期限到期', () => {
  let game = T.turn(jasmine(), [{switchTo: 1}, pp]);
  assert.equal(game.battle.fighters[0].soulState.jasmineBlessing, undefined);
  game = jasmineDefeat();
  const end = game.battle.fighters[0].soulState.jasmineBlessing.end;
  game = T.turn(game, [{switchTo: 1}, pp]);
  assert.equal(game.battle.fighters[0].soulState.jasmineBlessing, undefined);
  assert.equal(game.battle.fighters[0].stats.maxHp, 9000);
  assert.equal(game.slots[0][2].fighter.soulState.jasmineBlessing.end, end);
  game = T.turn(game, [{switchTo: 2}, pp]);
  assert.equal(game.battle.fighters[0].soulState.jasmineBlessing.end, end);
  assert.equal(game.battle.fighters[0].stats.maxHp, 9500);
  game = T.turn(game, [pp, pp]);
  assert.equal(game.battle.fighters[0].soulState.jasmineBlessing, undefined);
  assert.equal(game.battle.fighters[0].stats.maxHp, 9000);
});
