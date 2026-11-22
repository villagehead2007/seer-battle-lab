'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');

for (const [id, move, index, denominator] of [[3983, 29193, 1, 3], [4444, 29346, 0, 4]]) {
  test('原技能2367的己方回复按施术者体力上限，覆盖实战受伤的场下队友', () => {
    const caster = member(id, [move], {maxHp: 1200});
    const source = caster.snapshot.moves.find(entry => entry.id === move).effectInstances[index];
    assert.equal(source.id, 2367);
    assert.deepEqual(source.args, [1, 2, denominator]);
    let initial = T.create([
      [member(2989, [], {maxHp: 4000}), caster, member(3102)],
      [member(3043, [19308]), member(3056)]
    ], [0, 0], {seed: 14, criticals: false});
    initial = T.turn(initial, [pp, 'wiki:19308']);
    const injured = initial.battle.fighters[0];
    assert.ok(injured.hp < injured.stats.maxHp - 400);

    for (const burned of [false, true]) {
      const entered = T.turn(initial, [{switchTo: 1}, burned ? 'wiki:19308' : pp]);
      const active = entered.battle.fighters[0];
      assert.equal(Boolean(active.ailments['烧伤']), burned);
      assert.equal(active.stats.maxHp, 1200);
      const before = entered.slots[0][0].fighter.hp;
      const other = entered.slots[0][2].fighter.hp;
      const enemyReserve = entered.slots[1][1].fighter.hp;
      const cast = T.turn(entered, ['wiki:' + move, pp]);
      assert.equal(cast.battle.fighters[0].ailments['烧伤'], undefined);
      assert.equal(cast.slots[0][0].fighter.hp, before + (burned ? 1200 / denominator : 0));
      assert.equal(cast.slots[0][2].fighter.hp, other);
      assert.equal(cast.slots[1][1].fighter.hp, enemyReserve);
    }
  });
}

test('苏璃35890对无性别和雌性原对手都只回满施术者本人', () => {
  const caster = member(4372, [35890], {def: 120, spd: 120});
  const source = caster.snapshot.moves.find(entry => entry.id === 35890).effectInstances[2];
  assert.equal(source.id, 1806);
  for (const [target, attack, gender] of [[2989, 13693, 0], [3986, 33888, 2]]) {
    let battle = T.create([
      [caster, member(3102)],
      [member(target, [attack], {atk: 1800, spa: 1800, spe: 1500}), member(3056)]
    ], [0, 0], {seed: 13, criticals: false});
    battle = T.turn(battle, [pp, 'wiki:' + attack]);
    const [owner, opponent] = battle.battle.fighters;
    assert.equal(opponent.gender, gender);
    assert.ok(owner.hp > 0 && owner.hp < owner.stats.maxHp);
    const reserveHp = battle.slots[0][1].fighter.hp;
    battle = T.turn(battle, ['wiki:35890', pp]);
    assert.equal(battle.battle.fighters[0].hp, owner.stats.maxHp);
    assert.equal(battle.slots[0][1].fighter.hp, reserveHp);
    assert.equal(battle.battle.fighters[0].pp['wiki:35890'], owner.pp['wiki:35890'] - 1);
    assert.equal(battle.battle.fighters[1].soulState.specialStates?.['失心迷阵'], undefined);
  }
});
