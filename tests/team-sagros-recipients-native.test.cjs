'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');
const T = require('../dist/team-engine.js');
const store = require('../local-species.cjs');

const pp = 'potion:pp';

function member(id, requestedMoves = []) {
  const snapshot = store.species(id);
  const moves = [...new Set([...requestedMoves, ...E.WIKI.defaultMoves(snapshot)])].slice(0, 5);
  return {snapshot, moves, build: {overrides: {maxHp: 9000, atk: 20, spa: 20, def: 1200, spd: 1200, spe: 1000}}};
}

function setup() {
  const sagros = member(3328, [30547, 20157]);
  assert.equal(sagros.snapshot.souls.find(soul => soul.id === 652).hash, '3e805f9e');
  const move = sagros.snapshot.moves.find(skill => skill.id === 30547);
  assert.equal(move.hash, '4e3b1fc6');
  assert.deepEqual(move.effectInstances.map(effect => [effect.id, effect.args]), [[951, [1]], [786, [2]]]);
  return T.create(
    [[sagros, member(2987)], [member(3056, [23287]), member(2988)]],
    [0, 0],
    {seed: 14, criticals: false},
  );
}

test('圣王原30547双异常只附当前对手，自身用属性技能只回复本人PP', () => {
  let game = setup();
  const startingPp = game.battle.fighters[0].pp['wiki:30547'];
  const otherPp = {...game.slots[0][1].fighter.pp};
  game = T.turn(game, ['wiki:30547', pp]);
  const liveAilments = Object.values(game.battle.fighters[1].ailments).filter(end => end >= game.battle.round);
  assert.equal(liveAilments.length, 2);
  assert.deepEqual(game.battle.fighters[0].ailments, {});
  assert.deepEqual(game.slots[1][1].fighter.ailments, {});
  assert.equal(game.battle.fighters[0].pp['wiki:30547'], startingPp - 1);

  game = T.turn(game, ['wiki:20157', pp]);
  assert.equal(game.battle.fighters[0].pp['wiki:30547'], startingPp);
  assert.deepEqual(game.slots[0][1].fighter.pp, otherPp);
});

test('对手实际使用原属性技能时，圣王652只归零该对手的一个有PP技能槽', () => {
  let game = setup();
  const ownPp = {...game.battle.fighters[0].pp};
  const enemyPp = {...game.battle.fighters[1].pp};
  const enemyBenchPp = {...game.slots[1][1].fighter.pp};
  game = T.turn(game, [pp, 'wiki:23287']);
  assert.equal(game.battle.fighters[1].pp['wiki:23287'], enemyPp['wiki:23287'] - 1);
  const depleted = Object.keys(enemyPp).filter(key => enemyPp[key] > 0 && game.battle.fighters[1].pp[key] === 0);
  assert.equal(depleted.length, 1);
  assert.deepEqual(game.battle.fighters[0].pp, ownPp);
  assert.deepEqual(game.slots[1][1].fighter.pp, enemyBenchPp);
});
