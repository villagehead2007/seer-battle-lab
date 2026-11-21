'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');

const switchIn = {switchTo: 1};

function checkClause(caster, move, index, effectId, args) {
  const source = caster.snapshot.moves.find(entry => entry.id === move);
  assert.equal(source.effectInstances[index].id, effectId);
  assert.deepEqual(source.effectInstances[index].args, args);
  return source;
}

function assertBlocked(battle) {
  assert.deepEqual(T.candidates(battle, 1), []);
  assert.throws(() => T.turn(battle, [pp, switchIn]), /不可换入/);
}

function checkExpiry(battle, end, casterTo = switchIn) {
  assert.ok(T.candidates(battle, 0).includes(casterTo.switchTo));
  let casterLeaves = true;
  while (battle.battle.round <= end) {
    assertBlocked(battle);
    battle = T.turn(battle, [casterLeaves ? casterTo : pp, pp]);
    casterLeaves = false;
    assert.equal(battle.active[0], casterTo.switchTo);
    assert.equal(battle.active[1], 0);
  }
  assert.deepEqual(T.candidates(battle, 1), [1]);
  battle = T.turn(battle, [pp, switchIn]);
  assert.deepEqual(battle.active, [casterTo.switchTo, 1]);
  return battle;
}

for (const [id, move, index, duration] of [[4000, 38420, 3, 2], [4940, 29440, 1, 3]]) {
  test('效果2492原技能 ' + move + ' 只在真实消除等量非零盾罩时封原目标', () => {
    const golden = id === 4000;
    const caster = member(id, golden ? [38420, 29371] : [29440], {atk: 10, spa: 10, spe: 9000});
    const source = checkClause(caster, move, index, 2492, [duration]);
    for (const mode of ['empty', 'equal', 'unequal']) {
      const unequal = mode === 'unequal';
      const opponent = golden
        ? unequal ? member(2989, [10086]) : member(4995)
        : unequal ? member(4278, [27731]) : member(4247, [27654]);
      let battle = T.create([[caster, member(3102)], [opponent, member(3056)]],
        [0, 0], {seed: 13, criticals: false});
      const preparation = golden
        ? [mode === 'empty' ? pp : 'wiki:29371', unequal ? 'wiki:10086' : pp]
        : [pp, mode === 'empty' ? pp : unequal ? 'wiki:27731' : 'wiki:27654'];
      battle = T.turn(battle, preparation);
      const holders = battle.battle.fighters.map(fighter => fighter.suitState);
      const shield = holders.reduce((total, suit) => total + (suit.shield ?? 0), 0);
      const barrier = holders.reduce((total, suit) => total + (suit.barrier ?? 0), 0);
      if (mode === 'empty') assert.deepEqual([shield, barrier], [0, 0]);
      if (mode === 'equal') assert.ok(shield > 0 && shield === barrier);
      if (unequal) assert.notEqual(shield, barrier);

      battle = T.turn(battle, ['wiki:' + move, pp]);
      for (const fighter of battle.battle.fighters) {
        assert.equal(fighter.suitState.shield ?? 0, 0);
        assert.equal(fighter.suitState.barrier ?? 0, 0);
      }
      const [user, target] = battle.battle.fighters;
      assert.equal(user.soulState.noVoluntarySwitch2492, undefined);
      if (mode === 'equal') {
        assert.deepEqual(target.soulState.noVoluntarySwitch2492, {
          start: 2, end: duration + 1, sourceMove: move, sourceHash: source.hash,
          requiresRealSwitch: true
        });
        assert.equal(user.effects.heldStatusBlock.end, duration + 1);
        assert.equal(target.effects.statusBlock, undefined);
        assert.equal(target.effects['不能主动切换'], undefined);
        battle = checkExpiry(battle, duration + 1);
        assert.equal(battle.battle.fighters[1].soulState.noVoluntarySwitch2492, undefined);
      } else {
        assert.equal(target.soulState.noVoluntarySwitch2492, undefined);
        assert.deepEqual(T.candidates(battle, 1), [1]);
      }
    }
  });
}

for (const [id, move, index, enemy, trigger] of [
  [4942, 38524, 4, 4940, 38518],
  [4956, 29485, 1, 3056, 24779]
]) {
  test('效果2280原技能 ' + move + ' 被真实整招封锁后只封原对手', () => {
    const caster = member(id, [move]);
    const source = checkClause(caster, move, index, 2280, []);
    const opponent = member(enemy, [trigger], {atk: 60, spa: 60, ...(id===4956?{spe:2000}:{})});
    const initial = T.create([[caster, member(3102)], [opponent, member(2989)]],
      [0, 0], {seed: 14, criticals: false});
    for (const invalid of [false, true]) {
      let battle = T.turn(initial, [pp, invalid ? 'wiki:' + trigger : pp]);
      // 4956 clears the holder's timed effects at round end, so land the seal before
      // the attempted skill in the same round.
      battle = T.turn(battle, ['wiki:' + move, invalid&&id===4956?'wiki:'+trigger:pp]);
      const [user, target] = battle.battle.fighters;
      assert.equal(user.soulState.noVoluntarySwitch2280, undefined);
      assert.equal(battle.battle.turns.at(-1).events.some(event => event.text.includes('技能被封锁')), invalid);
      if (invalid) {
        assert.deepEqual(target.soulState.noVoluntarySwitch2280, {
          start: 3, end: 3, sourceHash: source.hash, requiresRealSwitch: true
        });
        assert.equal(target.effects['不能主动切换'], undefined);
        battle = checkExpiry(battle, 3);
        assert.equal(battle.battle.fighters[1].soulState.noVoluntarySwitch2280, undefined);
      } else {
        assert.equal(target.soulState.noVoluntarySwitch2280, undefined);
        assert.deepEqual(T.candidates(battle, 1), [1]);
      }
    }
  });
}

for (const role of ['钺', '御']) {
  test('帝皇之戎2580的' + role + '主位真实清除成功才封原对手三回合', () => {
    const caster = member(4950, [29467]);
    const source = checkClause(caster, 29467, 1, 2580, [3]);
    const yue = role === '钺';
    const ally = member(3102);
    const target = yue ? member(3043, [19308]) : member(3056, [20117]);
    const initial = T.create([yue ? [caster, ally] : [ally, caster], [target, member(2989)]],
      [0, 0], {seed: 14, criticals: false});

    for (const clearable of [false, true]) {
      let battle = initial;
      if (yue) {
        battle = T.turn(battle, [pp, pp]);
        battle = T.turn(battle, [pp, pp]);
        battle = T.turn(battle, [pp, clearable ? 'wiki:19308' : pp]);
        assert.equal(Boolean(battle.battle.fighters[0].ailments['烧伤']), clearable);
      } else {
        battle = T.turn(battle, [switchIn, clearable ? 'wiki:20117' : pp]);
        assert.equal(battle.battle.fighters[1].stages.atk, Number(clearable));
      }

      const {round} = battle.battle;
      battle = T.turn(battle, ['wiki:29467', pp]);
      const [user, opponent] = battle.battle.fighters;
      assert.equal(user.ailments['烧伤'], undefined);
      assert.equal(opponent.stages.atk, 0);
      assert.equal(user.soulState.switchBlock2580, undefined);
      if (clearable) {
        assert.deepEqual(opponent.soulState.switchBlock2580, {
          start: round, end: round + 2, sourceHash: source.revision, requiresActualSwitch: true
        });
        assert.equal(opponent.effects['不能主动切换'], undefined);
        battle = checkExpiry(battle, round + 2, {switchTo: yue ? 1 : 0});
        assert.equal(battle.battle.fighters[1].soulState.switchBlock2580, undefined);
      } else {
        assert.equal(opponent.soulState.switchBlock2580, undefined);
        assert.deepEqual(T.candidates(battle, 1), [1]);
      }
    }
  });
}

test('嘲风38271清除真实气力后，技能封换比魂印早先施加的封换多持续一回合', () => {
  const caster = member(4871, [38271], {maxHp: 1200, def: 200, spd: 200, spe: 5});
  checkClause(caster, 38271, 0, 2227, [2]);
  const target = member(3056, [10127, 20117], {atk: 7000, spe: 9999});
  const key = '不能主动切换';
  let ready = T.create([[member(3102), caster, member(2989)], [target, member(2988)]],
    [0, 0], {seed: 'switch-lock', criticals: false});
  ready = T.turn(ready, [pp, pp]);
  ready = T.turn(ready, [switchIn, 'wiki:10127']);
  const [user, opponent] = ready.battle.fighters;
  assert.ok(user.hp > 0 && user.hp < user.stats.maxHp / 2);
  const soulLock = {start: 3, end: 4, sourceSoul: 2058, sourceHash: '6f5c0ef1'};
  assert.deepEqual(opponent.effects[key], soulLock);

  const noBoost = T.turn(ready, ['wiki:38271', pp]);
  assert.deepEqual(noBoost.battle.fighters[1].effects[key], soulLock);
  let battle = T.turn(ready, ['wiki:38271', 'wiki:20117']);
  assert.equal(battle.battle.turns.at(-1).first, 1);
  assert.equal(battle.battle.fighters[1].stages.atk, 0);
  assert.equal(battle.battle.fighters[0].effects[key], undefined);
  assert.deepEqual(battle.battle.fighters[1].effects[key], {start: 4, end: 5, noSwitch: true});
  const expired = checkExpiry(battle, 5, {switchTo: 2});
  assert.equal(expired.battle.fighters[1].effects[key], undefined);
});
