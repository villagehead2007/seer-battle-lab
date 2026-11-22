'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');

function empress(enemyMaxHp) {
  const game = T.create([
    [member(4345, [], {spd: 1}), member(3002), member(3004)],
    [member(5000, [10996], {maxHp: enemyMaxHp, spa: 9999})]
  ], [0, 0], {seed: 14, criticals: false});
  return T.turn(game, [pp, pp]);
}

test('原1570自然获得600盾不继承，601盾时只给主动换入的实际队友双防', () => {
  for (const amount of [600, 601]) {
    let game = empress(amount * 3);
    const caster = game.battle.fighters[0];
    assert.equal(caster.soulId, 1570);
    assert.equal(caster.suitState.shield, amount);
    assert.equal(caster.stages.def, 1);
    assert.equal(caster.stages.spd, 1);
    game = T.turn(game, [{switchTo: 2}, pp]);
    assert.equal(game.active[0], 2);
    assert.deepEqual(Object.values(game.battle.fighters[0].stages), [0, amount === 601 ? 1 : 0, 0, amount === 601 ? 1 : 0, 0, 0]);
    assert.equal(game.battle.fighters[0].suitState.shield, 0);
    game = T.turn(game, [{switchTo: 1}, pp]);
    assert.ok(Object.values(game.battle.fighters[0].stages).every(value => value === 0));
  }
});

test('原1570自然获得601盾与双防，真实阵亡补位不触发主动换入强化', () => {
  let game = empress(1803);
  assert.equal(game.battle.fighters[0].suitState.shield, 601);
  assert.equal(game.battle.fighters[0].stages.def, 1);
  assert.equal(game.battle.fighters[0].stages.spd, 1);
  game = T.turn(game, [pp, 'wiki:10996']);
  assert.deepEqual(game.pending, [0]);
  assert.equal(game.battle.fighters[0].hp, 0);
  game = T.replace(game, [2, null]);
  assert.ok(Object.values(game.battle.fighters[0].stages).every(value => value === 0));
});

function king() {
  const caster = member(4384, [10361], {def: 1, spe: 9999});
  caster.snapshot.selectedSoulId = 1603;
  return T.create([
    [caster, member(3002), member(3004)],
    [member(3056, [10127], {atk: 9999, spe: 100})]
  ], [0, 0], {seed: 14, criticals: false});
}

test('原1603实际出手后首次被击败，敌两技能清PP且只给指定补位者全属性+1', () => {
  let game = T.turn(king(), ['wiki:10361', 'wiki:10127']);
  assert.equal(game.battle.fighters[0].soulId, 1603);
  assert.deepEqual(game.pending, [0]);
  assert.ok(game.battle.damageEvents.some(event => event.sourceSide === 0 && event.moveId === 10361 && event.hpLoss > 0));
  assert.equal(Object.values(game.battle.fighters[1].pp).filter(value => value === 0).length, 2);
  game = T.replace(game, [2, null]);
  assert.ok(Object.values(game.battle.fighters[0].stages).every(value => value === 1));
  game = T.turn(game, [{switchTo: 1}, pp]);
  assert.ok(Object.values(game.battle.fighters[0].stages).every(value => value === 0));
});

test('原1603未用招被实际击败后先重生，换返再次击败时已用资格不重授接替者强化', () => {
  let game = T.turn(king(), [pp, 'wiki:10127']);
  assert.equal(game.battle.fighters[0].hp, 0);
  assert.equal(game.battle.fighters[0].soulState.kingRevivalRound, game.battle.round);
  assert.deepEqual(game.pending, []);
  game = T.turn(game, [pp, pp]);
  assert.equal(game.battle.fighters[0].hp, 9000);
  game = T.turn(game, [{switchTo: 1}, pp]);
  game = T.turn(game, [{switchTo: 0}, pp]);
  game = T.turn(game, ['wiki:10361', 'wiki:10127']);
  assert.deepEqual(game.pending, [0]);
  game = T.replace(game, [2, null]);
  assert.ok(Object.values(game.battle.fighters[0].stages).every(value => value === 0));
});
