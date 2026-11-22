'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');

function battle(lead) {
  const wing = member(2987, [], {spd: 1});
  wing.snapshot.selectedSoulId = 574;
  return T.create([
    [member(3008, [10001], {spd: 1, spe: 9999}),
      member(3002, [10250], {spd: 1, spe: 9999}), wing, member(3004)],
    [member(5000, [10996], {spa: 9999, spe: 100})]
  ], [lead, 0], {seed: 14, criticals: false});
}

test('原574由两名真实阵亡且耗PP的队友中复活恰好一名，回满HP和PP', () => {
  let game = battle(0);
  const moves = ['wiki:10001', 'wiki:10250'];
  const initial = moves.map((move, index) => game.slots[0][index].fighter.pp[move]);
  for (const [index, move] of moves.entries()) {
    game = T.turn(game, [move, 'wiki:10996']);
    assert.deepEqual(game.pending, [0]);
    const fallen = game.slots[0][index].fighter;
    assert.equal(fallen.hp, 0);
    assert.equal(fallen.pp[move], initial[index] - 1);
    game = T.replace(game, [index + 1, null]);
  }
  assert.equal(game.battle.fighters[0].soulId, 574);
  game = T.turn(game, [pp, 'wiki:10996']);
  assert.deepEqual(game.pending, [0]);
  assert.equal(game.slots[0][2].fighter.hp, 0);
  const revived = game.slots[0].slice(0, 2).filter(slot => slot.fighter.hp > 0);
  assert.equal(revived.length, 1);
  for (const [index, move] of moves.entries()) {
    const slot = game.slots[0][index];
    if (slot === revived[0]) {
      assert.equal(slot.fighter.hp, 9000);
      for (const key of slot.fighter.moves) assert.equal(slot.fighter.pp[key], slot.fighter.teamPPDefinitions[key].pp);
    } else {
      assert.equal(slot.fighter.hp, 0);
      assert.equal(slot.fighter.pp[move], initial[index] - 1);
    }
  }
  assert.equal(game.slots[0][3].fighter.hp, 9000);
  const revivedIndex = game.slots[0].indexOf(revived[0]);
  game = T.replace(game, [revivedIndex, null]);
  assert.equal(game.active[0], revivedIndex);
});

test('原574被真实击败且没有阵亡队友时不复活自身，存活队友可照常补位', () => {
  let game = T.turn(battle(2), [pp, 'wiki:10996']);
  assert.deepEqual(game.pending, [0]);
  assert.deepEqual(game.slots[0].map(slot => slot.fighter.hp), [9000, 9000, 0, 9000]);
  game = T.replace(game, [3, null]);
  assert.equal(game.active[0], 3);
});
