'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');

const firstMove = 'wiki:10250';
const secondMove = 'wiki:10611';

function prepared(id, soul) {
  const source = member(id, [], {spd: 1});
  source.snapshot.selectedSoulId = soul;
  let game = T.create([
    [member(3008, [], {spd: 1}), member(3002, [10250]), member(3004, [10611]), source, member(3001)],
    [member(5000, [10996], {spa: 9999}), member(3432, [29465])]
  ], [0, 0], {seed: 14, criticals: false});
  game = T.turn(game, [pp, 'wiki:10996']);
  assert.deepEqual(game.pending, [0]);
  game = T.replace(game, [1, null]);
  game = T.turn(game, [pp, {switchTo: 1}]);
  game = T.turn(game, [firstMove, 'wiki:29465']);
  game = T.turn(game, [firstMove, 'wiki:29465']);
  game = T.turn(game, [{switchTo: 2}, 'wiki:29465']);
  game = T.turn(game, [secondMove, 'wiki:29465']);
  game = T.turn(game, [{switchTo: 3}, {switchTo: 0}]);
  assert.equal(game.battle.fighters[0].soulId, soul);
  assert.deepEqual(game.slots[0].map(slot => slot.fighter.hp), [0, 3000, 3200, 9000, 9000]);
  assert.equal(game.slots[0][1].fighter.pp[firstMove], 38);
  assert.equal(game.slots[0][2].fighter.pp[secondMove], 39);
  return game;
}

function defeat(game, soul) {
  game = T.turn(game, [pp, 'wiki:10996']);
  assert.deepEqual(game.pending, [0]);
  assert.equal(game.slots[0][3].fighter.hp, 0);
  assert.deepEqual(game.battle.teamEntryGrants.map(queue => queue.map(grant => grant.soulId)), [[soul], []]);
  return game;
}

for (const soul of [1157, 1561]) {
  test(`原魂${soul} 真实阵亡只回复存活场下队友，400盾罩仅授实际补位者`, () => {
    let game = defeat(prepared(3888, soul), soul);
    assert.deepEqual(game.slots[0].map(slot => slot.fighter.hp), [0, 6000, 6200, 0, 9000]);
    game = T.replace(game, [1, null]);
    for (const [index, slot] of game.slots[0].entries()) {
      assert.equal(slot.fighter.suitState.shield, index === 1 ? 400 : 0);
      assert.equal(slot.fighter.suitState.barrier, index === 1 ? 400 : 0);
    }
    game = T.turn(game, [{switchTo: 2}, pp]);
    assert.equal(game.battle.fighters[0].suitState.shield, 0);
    assert.equal(game.battle.fighters[0].suitState.barrier, 0);
    assert.deepEqual(game.battle.teamEntryGrants, [[], []]);
    game = T.turn(game, [{switchTo: 1}, pp]);
    assert.equal(game.battle.fighters[0].suitState.shield, 0);
    assert.equal(game.battle.fighters[0].suitState.barrier, 0);
  });
}

for (const [soul, attacks] of [[1315, 1], [1562, 2]]) {
  test(`原魂${soul} 真实阵亡恢复各存活场下队友1PP，仅实际补位者按原次数消耗幽冥之荷`, () => {
    let game = defeat(prepared(4069, soul), soul);
    assert.deepEqual(game.slots[0].map(slot => slot.fighter.hp), [0, 3000, 3200, 0, 9000]);
    assert.equal(game.slots[0][1].fighter.pp[firstMove], 39);
    assert.equal(game.slots[0][2].fighter.pp[secondMove], 40);
    game = T.replace(game, [1, null]);
    assert.equal(game.battle.fighters[0].soulState.netherLotusAttacks, attacks);
    assert.equal(game.slots[0][2].fighter.soulState.netherLotusAttacks, undefined);
    game = T.turn(game, [pp, pp]);
    assert.equal(game.battle.fighters[0].soulState.netherLotusAttacks, attacks);
    for (let left = attacks - 1; left >= 0; left--) {
      game = T.turn(game, [firstMove, pp]);
      assert.equal(game.battle.fighters[0].soulState.netherLotusAttacks, left);
    }
    game = T.turn(game, [{switchTo: 2}, pp]);
    assert.equal(game.battle.fighters[0].soulState.netherLotusAttacks, undefined);
    assert.deepEqual(game.battle.teamEntryGrants, [[], []]);
  });
}
