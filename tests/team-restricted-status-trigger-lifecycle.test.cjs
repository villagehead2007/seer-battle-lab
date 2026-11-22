'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {T, member, pp} = require('./helpers/report-restriction-native.cjs');
const knockouts = require('./helpers/round30-original698-native.cjs');

const swap = {switchTo: 1};
const seedFor = value => Math.imul(value, 2654435761) >>> 0;
const paralysis = '瘫痪';
const congeal = '凝滞';

function create(caster, opponent, seed = 14) {
  return T.create([[caster, member(3102)], [opponent, member(2989)]],
    [0, 0], {seed, criticals: false});
}

function assertBlocked(battle, side, position = 1) {
  assert.ok(!T.candidates(battle, side).includes(position));
  const commands = [pp, pp];
  commands[side] = {switchTo: position};
  assert.throws(() => T.turn(battle, commands), /不可换入/);
}

function personal(battle, expected, status = paralysis) {
  const [caster, target] = battle.battle.fighters;
  assert.ok(target.hp > 0);
  assert.equal(caster.ailments[status], undefined);
  if (!expected) {
    assert.equal(target.ailments[status], undefined);
    assert.equal(T.candidates(battle, 1).length, 1);
    return;
  }
  const end = target.ailments[status];
  assert.ok(end >= battle.battle.round);
  assert.ok(T.candidates(battle, 0).includes(1));
  while (battle.battle.round <= end) {
    assertBlocked(battle, 1);
    battle = T.turn(battle, [battle.active[0] === 0 ? swap : pp, pp]);
  }
  assert.deepEqual(T.turn(battle, [pp, swap]).active, [1, 1]);
}

for (const [soulId, hash] of [[920, '463de87b'], [1581, 'cf9ef2a4']]) {
  test('雷伊魂印 ' + soulId + ' 真实消除自身强化才瘫痪原对手', () => {
    const caster = member(3631, [24950]);
    caster.snapshot = {...caster.snapshot, selectedSoulId: soulId};
    assert.equal(caster.snapshot.souls.find(soul => soul.id === soulId).hash, hash);
    let armed = create(caster, member(3289, [23556]));
    armed = T.turn(armed, ['wiki:24950', pp]);
    assert.equal(armed.battle.fighters[0].stages.atk, 2);
    const control = T.turn(armed, [pp, pp]);
    personal(control, false);
    const cleared = T.turn(armed, [pp, 'wiki:23556']);
    assert.equal(cleared.battle.fighters[0].stages.atk, 0);
    personal(cleared, true);
  });
}

for (const [species, move, rows] of [[3631, 32145, [3, 4]], [4184, 34893, [6, 7]]]) {
  test('原技能 ' + move + ' 的阵亡接替瘫痪只封玩家选中的继任者', () => {
    for (const index of rows) {
      const {success, failure} = knockouts.outcomes(index);
      assert.equal(success.row.speciesId, species);
      assert.equal(success.row.moveId, move);
      let battle = success.entry;
      assert.equal(battle.active[1], 2);
      assert.ok(battle.slots[1][1].fighter.hp > 0);
      assert.equal(battle.slots[1][1].fighter.ailments[paralysis], undefined);
      assert.deepEqual(T.candidates(failure.entry, 1), [1]);
      const end = battle.battle.fighters[1].ailments[paralysis];
      assert.ok(end >= battle.battle.round);
      while (battle.battle.round <= end) {
        assertBlocked(battle, 1);
        battle = T.turn(battle, [pp, pp]);
      }
      assert.equal(T.turn(battle, [pp, swap]).active[1], 1);
    }
  });
}

for (const [id, move] of [[3631, 32147], [4222, 35086]]) {
  test('原技能 ' + move + ' 清除真实回合效果后按原概率瘫痪或疲惫', () => {
    const caster = member(id, [move]);
    assert.equal(caster.snapshot.moves.find(m => m.id === move).effectInstances[0].id, 1138);
    for (const [cleared, seed, applied] of [[false, 1, false], [true, 1, true], [true, 3, false]]) {
      let battle = create(caster, member(3102, [24880]), seedFor(seed));
      battle = T.turn(battle, [pp, cleared ? 'wiki:24880' : pp]);
      assert.equal(Boolean(battle.battle.fighters[1].effects['免弱']), cleared);
      battle = T.turn(battle, ['wiki:' + move, pp]);
      const target = battle.battle.fighters[1];
      assert.equal(target.effects['免弱'], undefined);
      assert.equal(Boolean(target.ailments['疲惫']), cleared && !applied);
      personal(battle, applied);
    }
  });
}

test('圣甲永夜1113回末瘫痪分支封原对手，害怕分支保持换宠资格', () => {
  const caster = member(3840);
  assert.equal(caster.snapshot.souls.find(soul => soul.id === 1113).hash, 'c85f7577');
  for (const [seed, applied] of [[1, false], [3, true]]) {
    const battle = T.turn(create(caster, member(2988), seedFor(seed)), [pp, pp]);
    assert.equal(Boolean(battle.battle.fighters[1].ailments['害怕']), !applied);
    personal(battle, applied);
  }
});

for (const [id, move, index, effectId, enemy, trigger, field, failedSeed] of [
  [4048, 27163, 0, 1751, 3056, 10127, 'shield', 2],
  [4834, 29189, 2, 1879, 4946, 38538, 'barrier', 3]
]) {
  test('原技能 ' + move + ' 瘫痪只在真实资源被打破后按概率封原对手', () => {
    const caster = member(id, [move], {def: 200, spd: 200});
    assert.equal(caster.snapshot.moves.find(m => m.id === move).effectInstances[index].id, effectId);
    for (const [broken, seed, applied] of [[false, 1, false], [true, 1, true], [true, failedSeed, false]]) {
      let battle = create(caster, member(enemy, [trigger], {atk: id === 4048 ? 9999 : 180}), seedFor(seed));
      battle = T.turn(battle, ['wiki:' + move, pp]);
      assert.equal(battle.battle.fighters[0].suitState[field], id === 4048 ? 400 : 200);
      battle = T.turn(battle, [pp, broken ? 'wiki:' + trigger : pp]);
      assert.equal((battle.battle.fighters[0].suitState[field] ?? 0) === 0, broken);
      if (id === 4048) {
        const fixed = (battle.battle.damageEvents ?? []).filter(event =>
          event.round === 2 && event.type === 'fixed' && event.sourceSide === 0);
        assert.equal(fixed.reduce((total, event) => total + event.settledDamage, 0), broken ? 200 : 0);
      }
      if (id === 4834 && broken) {
        assert.equal(battle.phase, 'replace');
        assert.deepEqual(battle.pending, [0]);
        assert.equal(battle.battle.fighters[0].hp, 0);
        const end = battle.battle.fighters[1].ailments[paralysis];
        assert.equal(Boolean(end), applied);
        battle = T.replace(battle, [1, null]);
        assert.equal(battle.battle.fighters[0].ailments[paralysis], undefined);
        assert.equal(battle.battle.fighters[1].ailments[paralysis], end);
        while (battle.battle.round <= end) {
          assertBlocked(battle, 1);
          battle = T.turn(battle, [pp, pp]);
        }
        assert.deepEqual(T.turn(battle, [pp, swap]).active, [1, 1]);
      } else {
        personal(battle, applied);
      }
    }
  });
}

test('南霜1725换入时真实复制不同的强化，凝滞分别限制双方实际持有者', () => {
  const initial = T.create([
    [member(3102), member(4511), member(2988)],
    [member(3056, [20117, 10127]), member(2989)]
  ], [0, 0], {seed: 14, criticals: false});
  for (const boosted of [false, true]) {
    let battle = T.turn(initial, [pp, boosted ? 'wiki:20117' : pp]);
    battle = T.turn(battle, [swap, 'wiki:10127']);
    assert.equal(battle.battle.fighters[0].soulState.nanEntryDifferent, boosted);
    if (!boosted) {
      assert.equal(battle.battle.fighters[0].ailments[congeal], undefined);
      assert.equal(battle.battle.fighters[1].ailments[congeal], undefined);
      assert.deepEqual(T.candidates(battle, 1), [1]);
      continue;
    }
    const end = Math.min(...battle.battle.fighters.map(fighter => fighter.ailments[congeal]));
    assert.ok(end >= battle.battle.round);
    for (let round = battle.battle.round; round <= end; round++) {
      assertBlocked(battle, 0, 2);
      assertBlocked(battle, 1);
      battle = T.turn(battle, [pp, pp]);
    }
    while (battle.battle.fighters.some(fighter => fighter.ailments[congeal] >= battle.battle.round)) {
      battle = T.turn(battle, [pp, pp]);
    }
    assert.deepEqual(T.turn(battle, [{switchTo: 2}, swap]).active, [2, 1]);
  }
});

test('桑多姆1866真实非暴击受击后，冻伤被一次免异挡住才走凝滞封换', () => {
  for (const oneImmunity of [false, true]) {
    let battle = T.create([
      [member(4662), member(3102)],
      [member(4000, [10047], {atk: 1000}), member(2989), ...(oneImmunity ? [member(3056)] : [])]
    ], [0, 0], {seed: 14, criticals: false});
    assert.equal(battle.battle.fighters[1].counts.immune ?? 0, Number(oneImmunity));
    battle = T.turn(battle, [pp, 'wiki:10047']);
    const received = battle.battle.fighters[0].soulState.snow1866.received.at(-1);
    assert.equal(received.crit, false);
    assert.ok(received.settledDamage > 0);
    battle = T.turn(battle, [pp, pp]);
    assert.equal(Boolean(battle.battle.fighters[1].ailments['冻伤']), !oneImmunity);
    assert.equal(Boolean(battle.battle.fighters[1].ailments[congeal]), oneImmunity);
    if (oneImmunity) {
      assert.equal(battle.battle.fighters[1].counts.immune, 0);
      assertBlocked(battle, 1);
      assertBlocked(battle, 1, 2);
      battle = T.turn(battle, [swap, pp]);
    }
    assert.deepEqual(T.turn(battle, [pp, swap]).active, [oneImmunity ? 1 : 0, 1]);
  }
});

test('28989在原时限内自身强化被真清除才瘫痪原对手', () => {
  let battle = create(member(4706, [28885, 28989]), member(3289, [23556]));
  battle = T.turn(battle, ['wiki:28885', pp]);
  battle = T.turn(battle, ['wiki:28989', pp]);
  assert.ok(battle.battle.fighters[0].stages.atk > 0);
  personal(T.turn(battle, [pp, pp]), false);
  battle = T.turn(battle, [pp, 'wiki:23556']);
  assert.equal(battle.battle.fighters[0].stages.atk, 0);
  personal(battle, true);
});

test('卡塔1910首次原属性技能按70%瘫痪，概率失败后第二次用招不重抽', () => {
  const caster = member(4707, [20038]);
  assert.equal(caster.snapshot.souls.find(soul => soul.id === 1910).hash, '4b86ec8f');
  for (const [seed, applied] of [[1, true], [2, false]]) {
    const battle = T.turn(create(caster, member(2988), seedFor(seed)), ['wiki:20038', pp]);
    assert.equal(battle.battle.fighters[0].soulState.kata1910.statusReady, false);
    personal(battle, applied);
    if (!applied) personal(T.turn(battle, ['wiki:20038', pp]), false);
  }
});

test('4713魂印1916真实第二次致死后，继任免攻使原攻击者瘫痪', () => {
  let battle = create(member(4713, [], {maxHp: 120, def: 1}),
    member(2988, [10018], {atk: 9999, spe: 9999}), 'inherit-1916');
  battle = T.turn(battle, [pp, 'wiki:10018']);
  assert.equal(battle.battle.fighters[0].soulState.rewindUsed1916, true);
  assert.deepEqual(battle.pending, []);
  battle = T.turn(battle, [pp, 'wiki:10018']);
  assert.deepEqual(battle.pending, [0]);
  battle = T.replace(battle, [1, null]);
  const hp = battle.battle.fighters[0].hp;
  battle = T.turn(battle, [pp, 'wiki:10018']);
  assert.equal(battle.battle.fighters[0].hp, hp);
  const end = battle.battle.fighters[1].ailments[paralysis];
  assert.ok(end >= battle.battle.round);
  while (battle.battle.round <= end) {
    assertBlocked(battle, 1);
    battle = T.turn(battle, [pp, pp]);
  }
  assert.deepEqual(T.turn(battle, [pp, swap]).active, [1, 1]);
});

for (const [id, move, effectId] of [[4749, 37882, 733], [4816, 38084, 1054]]) {
  test('原技能 ' + move + ' 真实反转自身弱化时才对原对手瘫痪', () => {
    const caster = member(id, [move]);
    assert.equal(caster.snapshot.moves.find(m => m.id === move).effectInstances[2].id, effectId);
    let initial = create(caster, member(3631, [24009]));
    if (id === 4816) {
      initial = T.turn(initial, [pp, 'wiki:32147']);
      assert.equal(initial.battle.fighters[0].soulState.cyber2008.open, false);
    } else {
      initial = T.turn(initial, [pp, pp]);
    }
    for (const weakened of [false, true]) {
      let battle = T.turn(initial, [pp, weakened ? 'wiki:24009' : pp]);
      assert.equal(battle.battle.fighters[0].stages.atk, weakened ? -1 : 0);
      battle = T.turn(battle, ['wiki:' + move, pp]);
      assert.equal(battle.battle.fighters[0].stages.atk, weakened ? 1 : 0);
      personal(battle, weakened);
    }
  });
}

test('4915原1300真实受伤随机池抽到凝滞才封换，无条件不补抽', () => {
  for (const [seed, drawn, applied] of [[1, ['沉默', '麻痹'], false], [3, ['凝滞', '石化'], true]]) {
    let battle = create(member(4915, [29378], {def: 60, spd: 60}),
      member(3056, [10127], {atk: 3000}), seedFor(seed));
    battle = T.turn(battle, ['wiki:29378', pp]);
    const idle = T.turn(battle, [pp, pp]);
    assert.equal((idle.battle.randomStatusEvents ?? []).some(event => event.effectId === 1300), false);
    battle = T.turn(battle, [pp, 'wiki:10127']);
    assert.ok(battle.battle.damageEvents.some(event => event.type === 'attack' &&
      event.sourceSide === 1 && event.settledDamage > 300));
    const draws = battle.battle.randomStatusEvents.filter(event => event.type === 'draw' && event.effectId === 1300);
    assert.deepEqual(draws.map(event => event.name), drawn);
    assert.ok(draws.every(event => [2, 3].includes(event.duration)));
    personal(battle, applied, congeal);
  }
});

test('4940原29440后手才按50%瘫痪，不借等量盾罩词条封换', () => {
  for (const [slow, seed, applied] of [[false, 4, false], [true, 4, true], [true, 1, false]]) {
    const caster = member(4940, [29440], {spe: slow ? 10 : 9999});
    const opponent = member(3056, [20117], {spe: 9000});
    const battle = T.turn(create(caster, opponent, seedFor(seed)), ['wiki:29440', 'wiki:20117']);
    assert.equal(battle.battle.turns.at(-1).first, slow ? 1 : 0);
    assert.equal(battle.battle.fighters[1].soulState.noVoluntarySwitch2492, undefined);
    personal(battle, applied);
  }
});

test('4950原2583御主位有讨时瘫痪替换疲惫，只在取得讨的原对手当回合生效', () => {
  let initial = T.create([
    [member(3102), member(4950, [38554, 38566], {spe: 9999}), member(2988)],
    [member(2989, [20355]), member(3056)]
  ], [0, 0], {seed: 14, criticals: false});
  initial = T.turn(initial, [swap, pp]);
  for (const marked of [false, true]) {
    let battle = T.turn(initial, [marked ? 'wiki:38554' : pp, pp]);
    assert.equal(Boolean(battle.battle.fighters[1].soulState.tao2149), marked);
    const before = battle.battle.fighters[1].pp['wiki:20355'];
    battle = T.turn(battle, ['wiki:38566', 'wiki:20355']);
    const events = battle.battle.turns.at(-1).events;
    assert.ok(events.some(event => event.text.includes('B 方 陷入' + (marked ? paralysis : '疲惫'))));
    assert.equal(battle.battle.fighters[1].pp['wiki:20355'], before);
    assert.equal(battle.battle.fighters[1].ailments[paralysis], undefined);
    assert.deepEqual(T.turn(battle, [pp, swap]).active, [1, 1]);
  }
});
