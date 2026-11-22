'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');

test('空元之诗·柱仅在原对手有真实回合效果时封换，下一回结束恢复主动切换', () => {
  const caster = member(4586, [28535]);
  const raw = caster.snapshot.moves.find(move => move.id === 28535);
  assert.equal(raw.effectInstances[3].id, 2088);
  const key = '禁止主动切换';

  for (const targetAction of [pp, 'wiki:20355']) {
    const targetHasTimedEffect = targetAction === 'wiki:20355';
    let battle = T.create([
      [caster, member(3102)],
      [member(2989, [20355]), member(3056)]
    ], [0, 0], {seed: 13, criticals: false});

    battle = T.turn(battle, [pp, targetAction]);
    const target = battle.battle.fighters[1];
    assert.equal(Boolean(target.effects['必定暴击']), targetHasTimedEffect);
    battle = T.turn(battle, ['wiki:28535', pp]);
    assert.equal(battle.battle.fighters[0].effects[key], undefined);
    assert.deepEqual(battle.battle.fighters[1].effects[key],
      targetHasTimedEffect ? {start: 3, end: 3, noSwitch: true} : undefined);
    assert.deepEqual(T.candidates(battle, 0), [1]);
    assert.deepEqual(T.candidates(battle, 1), targetHasTimedEffect ? [] : [1]);
    if (targetHasTimedEffect) {
      assert.throws(() => T.turn(battle, [{switchTo: 1}, {switchTo: 1}]), /不可换入/);
    }

    battle = T.turn(battle, [{switchTo: 1}, pp]);
    battle = T.turn(battle, [pp, {switchTo: 1}]);
    assert.deepEqual(battle.active, [1, 1]);
    assert.ok(battle.battle.fighters.every(fighter => fighter.effects[key] === undefined));
  }
});
