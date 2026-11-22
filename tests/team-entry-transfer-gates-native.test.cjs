'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');
const T = require('../dist/team-engine.js');
const store = require('../local-species.cjs');

const pp = 'potion:pp';
const hp = 'potion:hp';

function member(id, skills = [], overrides = {}) {
  const snapshot = E.WIKI.versionSnapshots(store.species(id))[0];
  const moves = [...new Set([
    ...skills,
    ...E.WIKI.defaultMoves(snapshot),
    ...E.WIKI.availableMoves(snapshot).map(move => move.id),
  ])].slice(0, 5);
  return {
    snapshot,
    moves,
    build: {overrides: {maxHp: 9000, atk: 1, spa: 1, def: 1000, spd: 1000, spe: 100, ...overrides}},
  };
}

for (const {id, move, hash, args, status} of [
  {id: 3870, move: 29329, hash: '52bbbe59', args: [100, 8, 2], status: '睡眠'},
  {id: 4865, move: 29252, hash: '7d9ae5eb', args: [100, 28, 2, 2], status: '束缚'},
]) {
  function setup(immune = false) {
    const caster = member(id, [move], {spe: 1000});
    const source = caster.snapshot.moves.find(candidate => candidate.id === move);
    assert.equal(source.hash, hash);
    assert.deepEqual(source.effectInstances.find(effect => effect.id === 2403).args, args);
    const target = immune ? member(3056, [23287], {spe: 1500}) : member(3056);
    return T.create([[caster], [target, member(2987), member(2988)]], [0, 0], {seed: 14, criticals: false});
  }

  test(`${id}原2403实际附${status}后只转给期限内实际选中的换入者`, () => {
    for (const timely of [true, false]) {
      let game = T.turn(setup(), ['wiki:' + move, pp]);
      const original = game.battle.fighters[1];
      assert.ok(original.ailments[status] >= game.battle.round);
      assert.equal(original.soulState.repeatOnExit2403.through, 2);
      assert.equal(game.battle.fighters[0].soulState.repeatOnExit2403, undefined);
      if (!timely) game = T.turn(game, [pp, pp]);
      const entryRound = game.battle.round;
      game = T.turn(game, [pp, {switchTo: 2}]);
      assert.equal(game.active[1], 2);
      assert.equal(game.battle.fighters[1].ailments[status], timely ? entryRound + 2 : undefined);
      assert.equal(game.slots[1][1].fighter.ailments[status], undefined);
      assert.equal(game.battle.fighters[1].soulState.repeatOnExit2403?.through, timely ? entryRound + 1 : undefined);
      game = T.turn(game, [pp, {switchTo: 1}]);
      assert.equal(game.active[1], 1);
      assert.equal(game.battle.fighters[1].ailments[status], timely ? entryRound + 3 : undefined);
    }
  });

  test(`${id}原2403被实际先手免异常挡住时，换人不转交${status}`, () => {
    let game = T.turn(setup(true), ['wiki:' + move, 'wiki:23287']);
    assert.equal(game.battle.turns.at(-1).first, 1);
    assert.ok(game.battle.fighters[1].effects['免异常']?.end >= game.battle.round);
    assert.equal(game.battle.fighters[1].ailments[status], undefined);
    assert.equal(game.battle.fighters[1].soulState.repeatOnExit2403, undefined);
    game = T.turn(game, [pp, {switchTo: 2}]);
    assert.equal(game.active[1], 2);
    assert.equal(game.battle.fighters[1].ailments[status], undefined);
  });
}

test('原2146自然烧伤换得两层己方灼火，队友实际受攻消耗后原2147只读取剩余层数', () => {
  for (const extraAttack of [true, false]) {
    const hestia = member(4627, [37251, 28674, 10234], {spe: 1000});
    let game = T.create(
      [[hestia, member(2987)], [member(3227, [19087]), member(3291, [10499, 20530])]],
      [0, 0],
      {seed: 13, criticals: false},
    );

    game = T.turn(game, ['wiki:10234', 'wiki:19087']);
    assert.ok(game.battle.fighters[0].ailments['烧伤'] >= game.battle.round);
    game = T.turn(game, ['wiki:28674', {switchTo: 1}]);
    assert.equal(game.battle.fighters[0].soulState.guardedFlame1833, 2);
    game = T.turn(game, [{switchTo: 1}, 'wiki:10499']);
    assert.equal(game.battle.fighters[0].soulState.guardedFlame1833, 1);
    assert.ok(game.battle.fighters[1].ailments['烧伤'] >= game.battle.round);
    assert.equal(game.battle.fighters[1].soulState.guardedFlame1833, undefined);

    if (extraAttack) {
      game = T.turn(game, [hp, 'wiki:10499']);
      assert.equal(game.battle.fighters[0].soulState.guardedFlame1833, 0);
    }
    game = T.turn(game, [{switchTo: 0}, hp]);
    assert.equal(game.active[0], 0);
    assert.equal(game.battle.fighters[0].soulState.guardedFlame1833 ?? 0, extraAttack ? 0 : 1);
    game = T.turn(game, ['wiki:37251', hp]);
    assert.equal(game.battle.fighters[0].soulState.guardedFlame1833, 0);
    const events = game.battle.turns.at(-1).events;
    assert.equal(events.filter(event => event.text.includes('佑灵无烧伤比例吸取')).length, extraAttack ? 0 : 1);
    assert.equal(events.filter(event => event.text.includes('佑灵触发烧伤体力扣除')).length, 0);
  }
});
