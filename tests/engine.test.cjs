const { test } = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');
const fresh = () => E.createBattle({ species: ['bubuhua', 'bubuhua'], criticals: false });

test('双方独立初始化，初始体力及 PP 正确', () => {
  const s = fresh();
  assert.equal(s.fighters[0].hp, 331);
  s.fighters[0].pp.crunch--;
  assert.equal(s.fighters[1].pp.crunch, 15);
  assert.notEqual(s.fighters[0].stats, s.fighters[1].stats);
});
test('缺少选招、未知技能和耗尽 PP 均被拒绝，不改变原状态', () => {
  const s = fresh(); s.fighters[0].pp.storm = 0;
  const before = JSON.stringify(s);
  for (const choices of [[null, 'heal'], ['missing', 'heal'], ['storm', 'heal'], ['struggle', 'heal']]) assert.throws(() => E.resolveTurn(s, choices));
  assert.equal(JSON.stringify(s), before);
});
test('咬碎伤害符合独立算例 74–88，双方各扣一次 PP', () => {
  const s = fresh();
  s.fighters[0].stats.spe = 200;
  const out = E.resolveTurn(s, ['crunch', 'absorb']);
  const damage = out.turns[0].events.find(e => e.kind === 'damage');
  const n = Number(damage.text.match(/损失 (\d+)/)[1]);
  assert.ok(n >= 74 && n <= 88);
  assert.equal(out.fighters[0].pp.crunch, 14);
  assert.equal(out.fighters[1].pp.absorb, 9);
  assert.equal(s.fighters[0].hp, 331);
  assert.equal(s.turns.length, 0);
});
test('相同种子和选招可完整复现，同速存在双方先手', () => {
  const play = () => { let s = fresh(); for (const c of [['crunch', 'storm'], ['heal', 'absorb'], ['storm', 'crunch']]) s = E.resolveTurn(s, c); return s; };
  assert.deepEqual(play(), play());
  const firsts = new Set();
  for (let i = 0; i < 30; i++) firsts.add(E.resolveTurn(E.createBattle({ species: ['bubuhua', 'bubuhua'], seed: String(i) }), ['heal', 'heal']).turns[0].first);
  assert.equal(firsts.size, 2);
});
test('光合作用回复半血并封顶，满血仍消耗 PP', () => {
  const s = fresh(); s.fighters[0].hp = 1;
  const out = E.resolveTurn(s, ['heal', 'heal']);
  assert.equal(out.fighters[0].hp, 166);
  assert.equal(out.fighters[1].hp, 331);
  assert.equal(out.fighters[1].pp.heal, 4);
});
test('超级吸取按实际伤害回复，不按溢出伤害回复', () => {
  const s = fresh(); s.fighters[0].hp = 100; s.fighters[0].stats.spe = 200; s.fighters[1].hp = 10;
  const out = E.resolveTurn(s, ['absorb', 'heal']);
  assert.equal(out.fighters[0].hp, 105);
  assert.equal(out.fighters[1].hp, 0);
  assert.equal(out.fighters[1].pp.heal, 5);
});
test('击败后手后不再行动，结束后不能继续回合', () => {
  const s = fresh(); s.fighters[0].stats.spe = 200; s.fighters[1].hp = 1;
  const out = E.resolveTurn(s, ['crunch', 'crunch']);
  assert.equal(out.winner, 0); assert.equal(out.finished, true);
  assert.equal(out.fighters[1].pp.crunch, 15);
  assert.throws(() => E.resolveTurn(out, ['heal', 'heal']));
});
test('飞叶风暴命中降低特攻、未命中不降低，两者均扣 PP', () => {
  const seen = new Set();
  for (let i = 0; i < 80; i++) {
    const s = E.createBattle({ species: ['bubuhua', 'bubuhua'], seed: `storm-${i}`, criticals: false }); s.fighters[0].stats.spe = 200;
    const out = E.resolveTurn(s, ['storm', 'heal']);
    const miss = out.turns[0].events.some(e => e.kind === 'miss'); seen.add(miss);
    assert.equal(out.fighters[0].stages.spa, miss ? 0 : -1);
    assert.equal(out.fighters[0].pp.storm, 4);
  }
  assert.equal(seen.size, 2);
});
test('特攻下降不低于 -6，咬碎可触发防御 -2', () => {
  let defenseDrop = false;
  for (let i = 0; i < 80; i++) {
    const s = E.createBattle({ species: ['bubuhua', 'bubuhua'], seed: `stages-${i}`, criticals: false }); s.fighters[0].stages.spa = -6; s.fighters[0].stats.spe = 200;
    const out = E.resolveTurn(s, ['storm', 'crunch']);
    assert.equal(out.fighters[0].stages.spa, -6);
    if (out.fighters[0].stages.def === -2) defenseDrop = true;
  }
  assert.ok(defenseDrop);
});
test('全部 PP 耗尽才能挣扎，反伤可导致平局', () => {
  const s = fresh();
  for (const f of s.fighters) { for (const id of E.LOADOUT) f.pp[id] = 0; f.hp = 1; }
  assert.deepEqual(E.availableMoves(s.fighters[0]), ['struggle', 'potion:hp', 'potion:pp']);
  const out = E.resolveTurn(s, ['struggle', 'struggle']);
  assert.equal(out.finished, true); assert.equal(out.winner, 'draw');
  assert.deepEqual(out.fighters.map(f => f.hp), [0, 0]);
});
test('能力和种子输入校验', () => {
  for (const bad of [0, -1, 1.5, NaN, Infinity, 10000]) assert.throws(() => E.createBattle({ species: ['bubuhua', 'bubuhua'], stats: [{ atk: bad }] }));
  assert.throws(() => E.createBattle({ species: ['bubuhua', 'bubuhua'], seed: ' ' }));
  assert.throws(() => E.createBattle({ species: ['bubuhua', 'bubuhua'], seed: 'a'.repeat(65) }));
});
test('多组完整对局保持血量和 PP 边界并能够结束', () => {
  for (let seed = 0; seed < 30; seed++) {
    let s = E.createBattle({ species: ['bubuhua', 'bubuhua'], seed: `full-${seed}` });
    for (let round = 0; round < 100 && !s.finished; round++) {
      const choices = s.fighters.map(f => E.availableMoves(f)[0]);
      s = E.resolveTurn(s, choices);
      for (const f of s.fighters) {
        assert.ok(f.hp >= 0 && f.hp <= f.stats.maxHp);
        assert.ok(Object.values(f.pp).every(pp => pp >= 0));
      }
    }
    assert.ok(s.finished);
  }
});
