'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');
const source = require('../research/BATCH-4676-NEXT50/4765/snapshot.json');
const neutral = require('../research/4628-reviewed-snapshot.json');
const key = id => 'wiki:' + id;
const axes = ['atk', 'def', 'spa', 'spd', 'spe', 'acc'];
const crowns = [37906, 29043, 29044, 37907];
const paths = [[3, 2, 0, 1], [0, 3, 1, 2], [1, 0, 2, 3], [2, 1, 3, 0]];
const policies = ['crowned1966', 'pointTiming1966', 'badShapeTiming1966', 'leiPaths1966',
  'awakeHealScope1966', 'awakeHealBasis1966', 'lethal1966', 'forcedAdmission1966',
  'percentStep1653', 'healThenEqual4765', 'charge42Timing', 'negativeReverseAdmission'];
const pins = [
  [10006, '4d93a02d', []], [20006, 'd63722b', [[42, [1, 1]]]],
  [10166, 'fe136ddf', []], [10171, 'a46dafd', []], [20004, 'ce953011', [[5, [1, 100, -1]]]],
  [10167, '87cf081c', []], [10172, '91e10282', [[10, [5]]]], [20085, '37997ee0', [[10, [100]]]],
  [10010, '71e9626d', [[10, [5]]]], [10168, '4022ae30', [[37, [2, 2]]]],
  [10173, '4e8755a0', [[10, [5]]]], [29049, 'f11de991', [[191, [4]], [532, [4, 3]], [792, []]]],
  [10169, '18aa5514', [[10, [5]]]], [10174, 'dbd05aa3', [[3, []]]],
  [37915, '61a19241', [[29, [240]], [1249, [100]]]],
  [29050, 'e031f46', [[1014, [1, 2]], [58, [2]], [702, [2]], [843, [2, 2]]]],
  [37916, '2d01ca63', [[1468, [300, 1]], [501, [300, 1, 2]]]],
  [37917, 'e503394d', [[494, []], [1653, [10, 30]]]],
  [37918, 'ea30a391', [[180, []], [1252, [2, 2, 4, 4]]]],
  [37906, '4ed45779', [[959, [1]], [978, []], [2164, [20]], [663, [1, 100, 0]]]],
  [29043, 'ff3faefa', [[191, [4]], [2060, [3, 100, 0, 3]], [716, [3, 1]], [1647, [4, 3, 2, 250]]]],
  [29044, 'cca2121d', [[2290, []], [924, [3, 3]], [1683, [3]], [843, [2, 2]]]],
  [37907, '668bc346', [[881, []], [980, []], [863, [1]], [1221, [1]], [567, []]]],
  [37908, 'ebb27035', [[1523, [350]], [2289, [160, 100]], [964, []], [1960, [2]]]]
];
function timer(s, side, name, data = {}, start = s.round, end = 99) {
  s.fighters[side].effects[name] = {start, end, ...data};
}
function make({move = 37906, ids, hp = 9000, aStats = {}, bStats = {}, hit = true,
  seed = 0x9e3779b9, criticals = false} = {}) {
  const a = structuredClone(source), b = structuredClone(neutral);
  a.selectedSoulId = 1966;
  b.souls = []; // Neutralize the different, real opponent BEFORE creation; retain all source moves.
  ids ??= move === 37908 ? [...crowns, move] : [move, ...crowns.filter(id => id !== move).slice(0, 3), 37908];
  const other = [20030, 10086, 10392, 20521, 37258];
  assert.deepEqual(E.WIKI.assess(a, ids).issues, []);
  assert.deepEqual(E.WIKI.assess(b, other).issues, []);
  const stats = {maxHp: 9000, atk: 180, spa: 180, def: 300, spd: 300, spe: 500};
  const s = E.createBattle({wikiSnapshots: [a, b], wikiLoadouts: [ids, other], criticals,
    builds: [{suit: 'none', overrides: {...stats, ...aStats}},
      {suit: 'none', overrides: {...stats, spe: 100, ...bStats}}]});
  Object.assign(s.typeChart.aliases, structuredClone(a.typeChart.aliases), structuredClone(b.typeChart.aliases));
  s.rng = seed;
  s.fighters[0].hp = hp;
  // Labelled public hit-state fixtures, NOT edits to source accuracy or alwaysHit.
  if (hit) for (const f of s.fighters) for (const name of ['攻击必中', '属性必中']) timer(s, f.side, name);
  assert.equal(s.fighters[0].soulId, 1966);
  assert.equal(s.fighters[1].soulId, null);
  assert.equal(s.fighters[0].type, source.type);
  assert.equal(s.fighters[1].type, neutral.type);
  assert.equal(s.fighters[1].number, '4628');
  assert.equal(s.wikiSnapshots[0].moves.length, 24);
  for (const p of policies) assert.equal(Object.hasOwn(s.fighters[0].soulState, p), false, 'no MODEL default:' + p);
  for (const [snapshot, loadout] of [[a, ids], [b, other]]) for (const id of loadout) {
    const m = snapshot.moves.find(m => m.id === id), actual = s.moveDefinitions[key(id)];
    const compiled = E.WIKI.effectsEngine.compileInstances(m.effectInstances, snapshot.effects, m);
    assert.equal(compiled.issue, '');
    assert.deepEqual(actual.operations.map(o => [o.effectId, o.index, o.phase, o.params]),
      compiled.operations.map(o => [o.effectId, o.index, o.phase, o.params]), m.name + ':all native phases');
    for (const [i, x] of m.effectInstances.entries()) assert.ok(actual.operations.some(o => o.index === i && o.effectId === x.id));
    assert.equal(actual.revision, m.revision);
    assert.equal(actual.accuracy, m.accuracy);
    assert.equal(actual.alwaysHit, m.alwaysHit);
  }
  return s;
}
function go(s, a = 37906, b = 20030, observe = null) {
  const old = E.SOULS;
  if (observe) E.SOULS = {...old, run(event, c) { old.run(event, c); observe(event, c); }};
  try { return Object.assign(s, E.resolveTurn(s, [a === null ? 'potion:hp' : key(a), b === null ? 'potion:hp' : key(b)])); }
  finally { E.SOULS = old; }
}
const damage = (s, type = 'attack', side = 0) => (s.damageEvents ?? []).filter(e =>
  e.round === s.round - 1 && e.type === type && e.sourceSide === side && e.targetSide === 1 - side);
const sum = (s, type = 'attack', side = 0) => damage(s, type, side).reduce((n, e) => n + e.settledDamage, 0);
const active = s => E.SOULS.registry[1966].abilities.active(s.fighters[0], s.round);
function refill(s) {
  // Explicit BETWEEN-ROUND HP fixture only. Full1647/924/2164 operations remain intact.
  for (const f of s.fighters) f.hp = f.stats.maxHp;
}
function pathFloor(s) {
  // Protected public1HP floor keeps all real ongoing1647+924 clauses present,
  // including on low-HP and high-star turns;37906 cannot clear the protected floor.
  timer(s, 1, '致命保留', {hp: 1}); timer(s, 1, 'protect');
}
function progress(s, path) {
  for (const slot of path) { refill(s); pathFloor(s); go(s, crowns[slot]); }
  return s;
}
function awakeFixture(s) {
  // Explicit persistent-progress PRESTATE for native loadout variants. This does
  // not claim that a loadout missing a crown completed a four-crown battle path.
  // Separate tests below prove every canonical route through actual full moves.
  s.fighters[0].soulState.lei1966 = {sourceHash: 'ea01fd9', stars: [...paths[0]],
    connections: [[3, 2], [2, 0], [0, 1]], last: 1,
    awake: {start: s.round, end: s.round + 2, sourceHash: 'ea01fd9'}};
  return s;
}
function actorSnapshot(out) {
  return (event, c) => {
    if (event === 'afterUse' && c.a.side === 0) Object.assign(out, {hp: c.a.hp,
      stages: {...c.a.stages}, targetStages: {...c.t.stages}, effects: structuredClone(c.a.effects),
      targetEffects: structuredClone(c.t.effects), stars: [...c.a.soulState.lei1966.stars]});
  };
}

test('4765全部24招保留45个有序原实例、真实1966魂印与不同种4628，逐招真实PP和状态', () => {
  assert.equal(source.source.revision, 'ebd2164a');
  assert.deepEqual(source.souls.map(x => [x.id, x.hash, x.eid, x.args]), [[1966, 'ea01fd9', 2376, [3, 1, 1]]]);
  assert.equal(source.moves.length, 24);
  assert.equal(source.moves.reduce((n, m) => n + m.effectInstances.length, 0), 45);
  assert.deepEqual(source.moves.filter(m => m.fifth).map(m => m.id), [37908]);
  for (const [id, hash, instances] of pins) {
    const m = source.moves.find(m => m.id === id), s = make({move: id}), out = {};
    assert.equal(m.hash, hash);
    assert.equal(m.revision, 'seerapi:' + hash);
    assert.deepEqual(m.effectInstances.map(x => [x.id, x.args]), instances);
    go(s, id, 20030, actorSnapshot(out));
    assert.equal(s.fighters[0].soulState.basePPCostThisUse.amount, 1, m.name + ':one real PP cost');
    assert.equal(s.fighters[0].pp[key(id)], m.pp - (crowns.includes(id) ? 0 : 1), m.name + ':native soul restores all PP1 only on new point');
    if (m.kind !== 'status') assert.ok(sum(s) > 0, m.name + ':real red attack');
    if (id === 20004) assert.equal(out.targetStages.def, -1);
    if (id === 20085) assert.ok(s.fighters[1].ailments['麻痹']);
    if (id === 29049) assert.ok(out.effects.reflect);
    if (id === 29050) assert.ok(axes.every(k => out.stages[k] === 2));
    if (id === 37915) assert.equal(sum(s, 'fixed'), 240);
    if (id === 37917) assert.equal(sum(s, 'fixed'), 300);
    if (id === 37906) { assert.ok(axes.every(k => out.stages[k] === 1)); assert.equal(sum(s, 'fixed'), 240); }
    if (id === 29043) assert.equal(sum(s, 'percent'), 3000);
    if (id === 29044) assert.ok(axes.every(k => out.stages[k] === 1));
    if (id === 37908) { assert.equal(sum(s), 100); assert.equal(out.stars.length, 0); }
  }
});

test('4765四条且仅四条真实ㄣ路径：E0S1W2N3，反向已包含，第四招END才觉醒、清异常负级而非回满', () => {
  assert.equal(new Set(paths.map(p => p.join())).size, 4);
  for (const p of paths) assert.ok(paths.some(q => q.join() === [...p].reverse().join()));
  for (const path of paths) {
    const s = make({ids: [...crowns, 37908]});
    for (let i = 0; i < 4; i++) {
      refill(s); pathFloor(s);
      delete s.fighters[1].ailments['麻痹'];
      for (const k of s.fighters[0].moves) s.fighters[0].pp[k] = 1;
      if (i === 3) { s.fighters[0].ailments['烧伤'] = 9; s.fighters[0].stages.def = -2; }
      let beforeEnd;
      go(s, crowns[path[i]], 20030, (event, c) => {
        if (event !== 'afterUse' || c.a.side !== 0) return;
        assert.deepEqual(c.a.soulState.lei1966.stars, path.slice(0, i + 1));
        assert.equal(E.SOULS.registry[1966].abilities.active(c.a, c.round), false, 'fourth payload is NOT already awake');
        if (i === 3) beforeEnd = structuredClone(c.a.soulState.lei1966);
      });
      assert.deepEqual(s.fighters[0].soulState.lei1966.stars, path.slice(0, i + 1));
      assert.equal(s.fighters[0].pp[key(37908)], 2, 'new point restores actual fifth as well');
      if (i < 3) assert.equal(active(s), false);
      if (i === 3) assert.ok(beforeEnd.pending?.kind === 'awake');
    }
    assert.equal(s.fighters[0].ailments['烧伤'], undefined);
    assert.ok(s.fighters[0].stages.def >= 0);
    assert.equal(active(s), true);
    assert.deepEqual(s.fighters[0].soulState.lei1966.awake, {start: 5, end: 7, sourceHash: 'ea01fd9'});
    for (let r = 5; r <= 7; r++) { refill(s); go(s, 37908); }
    assert.deepEqual(s.fighters[0].soulState.lei1966.stars, []);
    assert.deepEqual(s.fighters[0].soulState.lei1966.connections, []);
    assert.equal(s.fighters[0].soulState.lei1966.last, null);
    assert.equal(active(s), false);
  }
});

test('4765错误第四点仅END回满并清进度，魂印回复穿过技能禁疗但全禁疗阻回复仍重置', () => {
  for (const mode of ['normal', 'skill-ban', 'all-ban']) {
    const s = make({ids: [...crowns, 37908], aStats: {maxHp: 9999}}); progress(s, [0, 1, 2]);
    // Normal full924+1647 can legitimately heal9000 before END. Legal9999MAX
    // and1startingHP keep that native heal below full; no ongoing clause is cut.
    refill(s); s.fighters[0].hp = mode === 'normal' ? 1 : 1000;
    if (mode === 'skill-ban') timer(s, 0, '技能禁疗');
    if (mode === 'all-ban') timer(s, 0, '四杀鬼囹');
    let beforeEnd;
    go(s, 37907, 20030, (event, c) => { if (event === 'afterUse' && c.a.side === 0) {
      beforeEnd = c.a.hp; assert.deepEqual(c.a.soulState.lei1966.stars, [0, 1, 2, 3]);
      assert.equal(c.a.soulState.lei1966.pending.kind, 'bad');
    }});
    assert.ok(beforeEnd < 9999, 'bad shape is not immediately full-healed');
    assert.equal(s.fighters[0].hp, mode === 'all-ban' ? 1000 : 9999);
    assert.deepEqual(s.fighters[0].soulState.lei1966.stars, []);
    assert.deepEqual(s.fighters[0].soulState.lei1966.connections, []);
    assert.equal(active(s), false);
  }
});

test('4765点亮先于当招2290，重复槽不重新恢复PP/麻痹；雷祭雷电击和真正第五均不点亮', () => {
  const s = make({ids: [...crowns, 37908]});
  go(s, 29044); assert.ok(axes.every(k => s.fighters[0].stages[k] === 1));
  assert.deepEqual(s.fighters[0].soulState.lei1966.stars, [2]);
  delete s.fighters[1].ailments['麻痹'];
  const pp = s.fighters[0].pp[key(37907)];
  go(s, 29044);
  assert.equal(s.fighters[0].pp[key(37907)], pp);
  assert.equal(s.fighters[1].ailments['麻痹'], undefined);
  assert.ok(axes.every(k => s.fighters[0].stages[k] === 2));
  for (const id of [20085, 10171, 37908]) {
    const q = make({move: id}); go(q, id);
    assert.deepEqual(q.fighters[0].soulState.lei1966.stars, []);
    assert.equal(q.fighters[0].pp[key(id)], source.moves.find(m => m.id === id).pp - 1);
  }
});

test('4765魂印点亮PP1独立于技能封锁与异常免疫，实际无效仍点亮；控制或道具不冒充用招', () => {
  for (const mode of ['seal', 'invalid', 'immune', 'control', 'item']) {
    const s = make({ids: [...crowns, 37908]});
    s.fighters[0].pp[key(37908)] = 1;
    if (mode === 'seal') timer(s, 0, 'statusBlock');
    if (mode === 'invalid') s.fighters[0].counts.nextSkillInvalid = 1;
    if (mode === 'immune') timer(s, 1, '免异常');
    if (mode === 'control') s.fighters[0].ailments['疲惫'] = 9;
    go(s, mode === 'item' ? null : 29044);
    const used = !['control', 'item'].includes(mode);
    assert.deepEqual(s.fighters[0].soulState.lei1966.stars, used ? [2] : []);
    assert.equal(s.fighters[0].pp[key(37908)], used ? 2 : 1);
    assert.equal(!!s.fighters[1].ailments['麻痹'], used && mode !== 'immune');
    assert.equal(s.fighters[0].stages.atk, mode === 'immune' ? 1 : 0);
  }
});

test('4765回合初原有麻痹解除才当轮先制1，下轮无追加；普通死亡不点亮、不再持续吸取', () => {
  const s = make({ids: [...crowns, 37908]}); s.fighters[0].ailments['麻痹'] = 9;
  go(s, 29044); assert.equal(s.fighters[0].ailments['麻痹'], undefined);
  assert.equal(s.fighters[0].soulState.resolvedPriority.value, 1);
  go(s, 37907); assert.equal(s.fighters[0].soulState.resolvedPriority.value, 2, 'only prior843 remains');
  const q = make({ids: [...crowns, 37908]}); go(q, 29043);
  q.fighters[0].hp = 1; q.fighters[0].stats.spe = 1;
  q.fighters[1].stats.atk = 9999; q.fighters[1].stats.spe = 9999;
  delete q.fighters[1].ailments['麻痹'];
  go(q, 29044, 10086);
  assert.equal(q.fighters[0].hp, 0);
  assert.deepEqual(q.fighters[0].soulState.lei1966.stars, [1]);
  assert.equal(sum(q, 'percent'), 0);
});

test('4765真实四点后觉醒免耗PP含0PP选择、必中必暴、免异免弱和三轮终止', () => {
  const s = progress(make({ids: [...crowns, 37908], hit: false}), paths[0]);
  for (const k of s.fighters[0].moves) s.fighters[0].pp[k] = 0;
  for (let r = 5; r <= 7; r++) {
    refill(s); timer(s, 0, '攻击必失'); delete s.fighters[1].ailments['麻痹'];
    let crit = false;
    //37906 really has alwaysHit:false; the inherently必中 fifth is NOT a
    // discriminator for the awake always-hit trait.
    go(s, 37906, 20030, (event, c) => {
      if (event === 'afterAttack' && c.a.side === 0) crit = c.crit;
      if (event === 'afterUse' && c.a.side === 1) {
        c.ailment(c.t, '烧伤', c.a);
        const before = c.t.stages.atk; c.stage(c.t, -1, ['atk']);
        assert.equal(c.t.stages.atk, before, 'awake weakness immunity blocks the real stage attempt');
      }
    });
    assert.ok(sum(s) > 0); assert.equal(crit, true);
    assert.equal(s.fighters[0].pp[key(37906)], 0);
    assert.equal(s.fighters[0].ailments['烧伤'], undefined);
    assert.ok(s.fighters[0].stages.atk >= 0);
  }
  assert.equal(active(s), false);
  assert.equal(E.availableMoves(s.fighters[0]).includes(key(37906)), false);
  assert.equal(E.availableMoves(s.fighters[0], s.round).includes(key(37906)), false);
  assert.throws(() => go(s, 37906), /PP/);
});

test('4765觉醒仅压对手先制为0不篡改速度，包含正与负的公共先制；自身原先制仍保留', () => {
  for (const priority of [8, -5]) {
    const s = awakeFixture(make({ids: [...crowns, 37908], aStats: {spe: 50}, bStats: {spe: 500}}));
    timer(s, 1, 'id984', {amount: priority}); timer(s, 0, 'id984', {amount: -1});
    go(s, 37908, 10086);
    assert.equal(s.fighters[1].soulState.resolvedPriority.value, 0);
    assert.equal(s.fighters[0].soulState.resolvedPriority.value, 0, 'own awake+1 offsets labelled public-1');
    assert.equal(s.turns.at(-1).first, 1, 'equal actual priority keeps the real faster enemy first');
    assert.equal(s.fighters[0].stats.spe, 50); assert.equal(s.fighters[1].stats.spe, 500);
    assert.ok(sum(s) > 0);
  }
});

test('4765觉醒额外回复只取技能完整结算红伤，保1实际减0、技能禁疗不拦魂印回复', () => {
  const s = awakeFixture(make({ids: [...crowns, 37908], hp: 1000}));
  timer(s, 0, '技能禁疗');
  timer(s, 1, 'protect'); timer(s, 1, '致命保留', {hp: 1});
  s.fighters[1].hp = 1;
  go(s, 37908);
  const n = sum(s);
  assert.ok(n > 1);
  assert.equal(damage(s)[0].hpLoss, 0);
  assert.equal(s.fighters[0].hp, 1000 + n);
  assert.equal(s.fighters[1].hp, 1);
});

test('4765觉醒红伤免疫不回血，真实技能固定240不冒充红伤，独立非技能附伤也不回血', () => {
  const s = awakeFixture(make({move: 37915, hp: 1000}));
  timer(s, 1, '攻击伤害免疫'); timer(s, 1, 'protect');
  let after;
  go(s, 37915, 20030, (event, c) => {
    if (event === 'afterUse' && c.a.side === 0) {
      assert.equal(c.a.hp, 1000, 'zero RED and realfixed240 grant no awake healing');
      for (const type of ['fixed', 'percent', 'true']) c.hurt(c.t, 40, 'explicit independent non-skill damage fixture', type);
      after = c.a.hp;
    }
  });
  assert.equal(sum(s), 0); assert.equal(sum(s, 'fixed'), 280);
  assert.equal(sum(s, 'percent'), 40); assert.equal(sum(s, 'true'), 40);
  assert.equal(after, 1000);
});

test('4765觉醒只穿命中效果封锁：正常免异、反弹、免弱、禁强、PP保护与整招无效均保留', () => {
  for (const mode of ['seal', 'immune', 'reflect', 'whole-invalid']) {
    const s = awakeFixture(make({move: 20085}));
    timer(s, 0, '属性技能命中效果失效');
    if (mode === 'immune') timer(s, 1, '免异常');
    if (mode === 'reflect') timer(s, 1, 'reflect');
    if (mode === 'whole-invalid') s.fighters[0].counts.nextSkillInvalid = 1;
    go(s, 20085);
    assert.equal(!!s.fighters[1].ailments['麻痹'], mode === 'seal');
    assert.equal(s.fighters[0].ailments['麻痹'], undefined, 'awake owner immunity still admits reflection normally');
  }
  const weak = awakeFixture(make({move: 20004})); timer(weak, 1, '免弱'); go(weak, 20004);
  assert.equal(weak.fighters[1].stages.def, 0);
  const strong = awakeFixture(make({ids: [...crowns, 37908]})); timer(strong, 0, '禁强化'); go(strong, 29044);
  assert.ok(axes.every(k => strong.fighters[0].stages[k] === 0));
  const pp = awakeFixture(make({move: 37916})); pp.fighters[0].stages.atk = 1; timer(pp, 1, 'PP保护');
  go(pp, 37916);
  assert.equal(Object.values(pp.fighters[1].pp).filter(n => n === 0).length, 0);
  assert.equal(sum(pp, 'fixed'), 300);
});

test('4765觉醒仍保留真实5%原概率与HP条件，不能将概率或条件强制成成功', () => {
  const outcomes = new Set();
  for (let i = 1; i <= 96; i++) {
    const s = awakeFixture(make({move: 10172, seed: Math.imul(i, 2654435761) >>> 0}));
    timer(s, 0, '攻击技能命中效果失效'); go(s, 10172);
    outcomes.add(!!s.fighters[1].ailments['麻痹']);
  }
  assert.deepEqual(outcomes, new Set([true, false]));
  const values = [];
  for (const hp of [4500, 4499]) {
    const s = awakeFixture(make({move: 10168, hp})); go(s, 10168); values.push(sum(s));
  }
  assert.ok(Math.abs(values[1] - 2 * values[0]) <= 3);
});

test('4765四条原生5%麻痹实例各有成功失败，100%雷祭免异/命中封锁保留', () => {
  for (const id of [10172, 10010, 10173, 10169]) {
    const outcomes = new Set();
    for (let i = 1; i <= 96; i++) {
      const s = make({move: id, seed: Math.imul(i, 2654435761) >>> 0});
      timer(s, 1, '攻击伤害免疫'); go(s, id);
      assert.equal(sum(s), 0); outcomes.add(!!s.fighters[1].ailments['麻痹']);
    }
    assert.deepEqual(outcomes, new Set([true, false]), String(id));
  }
  for (const mode of ['immune', 'seal']) {
    const s = make({move: 20085}); timer(s, mode === 'immune' ? 1 : 0, mode === 'immune' ? '免异常' : '属性技能命中效果失效');
    go(s, 20085); assert.equal(s.fighters[1].ailments['麻痹'], undefined);
  }
});

test('4765普通先制2/1、5防御弱化与免弱、3解除负级及解除保护均真实有效', () => {
  for (const [id, n] of [[10166, 2], [10167, 1]]) {
    const s = make({move: id}); go(s, id); assert.equal(s.fighters[0].soulState.resolvedPriority.value, n);
  }
  for (const blocked of [false, true]) {
    const s = make({move: 20004}); if (blocked) timer(s, 1, '免弱'); go(s, 20004);
    assert.equal(s.fighters[1].stages.def, blocked ? 0 : -1);
    const q = make({move: 10174}); q.fighters[0].stages.def = -2;
    if (blocked) timer(q, 0, '弱化不可解除反转'); go(q, 10174);
    assert.equal(q.fighters[0].stages.def, blocked ? -2 : 0);
  }
});

test('4765完整充电42仅下轮一轮电伤翻倍，37严格低半HP才双倍', () => {
  const ids = [20006, 10171, 10006, 10168, 37908];
  const base = make({ids}), charged = make({ids});
  go(base, 10006); go(charged, 20006);
  assert.deepEqual(charged.fighters[0].effects['电系伤害翻倍'], {start: 2, end: 2});
  base.rng = charged.rng; refill(base); refill(charged);
  go(base, 10171); go(charged, 10171);
  assert.ok(Math.abs(sum(charged) - 2 * sum(base)) <= 2);
  base.rng = charged.rng; refill(base); refill(charged);
  go(base, 10171); go(charged, 10171); assert.equal(sum(charged), sum(base));
  const low = make({move: 10168, hp: 4499}), half = make({move: 10168, hp: 4500});
  go(low, 10168); go(half, 10168); assert.ok(Math.abs(sum(low) - 2 * sum(half)) <= 2);
});

test('4765完整29049的191反弹四轮、532净回复粉伤与792当轮封攻分别真实执行', () => {
  for (const [hp, ban, n] of [[1000, false, 3000], [8999, false, 1], [9000, false, 0], [1000, true, 0]]) {
    const s = make({move: 29049, hp}); if (ban) timer(s, 0, '技能禁疗');
    go(s, 29049, 10086);
    assert.equal(sum(s, 'percent'), n);
    assert.equal(s.fighters[0].hp, hp + n);
    assert.equal(sum(s, 'attack', 1), 0);
    assert.ok(s.fighters[0].effects.reflect);
  }
  const s = make({ids: [29049, 10006, 10171, 10174, 37908]}); go(s, 29049);
  for (let r = 2; r <= 5; r++) {
    refill(s); delete s.fighters[0].ailments['烧伤']; delete s.fighters[1].ailments['烧伤'];
    go(s, 10006, 20030, (event, c) => { if (event === 'afterUse' && c.a.side === 1) c.ailment(c.t, '烧伤', c.a); });
    assert.equal(!!s.fighters[0].ailments['烧伤'], r === 5);
    assert.equal(!!s.fighters[1].ailments['烧伤'], r < 5);
  }
});

test('4765完整29050半体严格高于才强化2，下两轮必暴/回满/先制2；落地暴击零红仍回满', () => {
  for (const hp of [4500, 4501]) {
    const s = make({move: 29050, hp}); go(s, 29050);
    assert.ok(axes.every(k => s.fighters[0].stages[k] === (hp > 4500 ? 2 : 1)));
  }
  const s = make({ids: [29050, 10006, 10171, 10174, 37908]}); go(s, 29050);
  for (let r = 2; r <= 4; r++) {
    refill(s); s.fighters[0].hp = 1000;
    let crit;
    timer(s, 1, '攻击伤害免疫');
    go(s, 10006, 20030, (event, c) => { if (event === 'afterAttack' && c.a.side === 0) crit = c.crit; });
    assert.equal(sum(s), 0);
    assert.equal(crit, r <= 3);
    assert.equal(s.fighters[0].hp, r <= 3 ? 9000 : 1000);
    assert.equal(s.fighters[0].soulState.resolvedPriority.value, r <= 3 ? 2 : 0);
  }
  const banned = make({ids: [29050, 10006, 10171, 10174, 37908], hp: 1000});
  go(banned, 29050); timer(banned, 0, '技能禁疗'); go(banned, 10006);
  assert.equal(banned.fighters[0].hp, 1000);
});

test('4765完整1468清双方正负级与普通盾，不能偷清护罩；成功固定300与随机清1PP、PP保护独立', () => {
  for (const side of [0, 1]) for (const kind of ['positive', 'negative', 'shield']) {
    const s = make({move: 37916}), f = s.fighters[side];
    if (kind === 'positive') f.stages.atk = 2;
    if (kind === 'negative') f.stages.spd = -2;
    if (kind === 'shield') f.suitState.shield = 100;
    s.fighters[0].suitState.barrier = 777;
    go(s, 37916);
    assert.equal(s.fighters[side].stages.atk, 0);
    assert.equal(s.fighters[side].stages.spd, 0);
    assert.equal(s.fighters[side].suitState.shield ?? 0, 0);
    assert.equal(s.fighters[0].suitState.barrier, 777);
    assert.equal(sum(s, 'fixed'), 300);
    assert.equal(Object.values(s.fighters[1].pp).filter(n => n === 0).length, 1);
  }
  for (const protectedPP of [false, true]) {
    const s = make({move: 37916});
    if (protectedPP) { s.fighters[0].stages.atk = 1; timer(s, 1, 'PP保护'); }
    go(s, 37916);
    assert.equal(sum(s, 'fixed'), protectedPP ? 300 : 0);
    assert.equal(Object.values(s.fighters[1].pp).filter(n => n === 0).length, 0);
  }
});

test('4765完整1468消强/消负保护、501严格红伤不足300和免弱；零红命中仍弱化', () => {
  for (const mode of ['boost', 'negative', 'zero', 'weak-immune']) {
    const s = make({move: 37916}); timer(s, 1, '攻击伤害免疫');
    if (mode === 'boost') { s.fighters[0].stages.atk = 2; timer(s, 0, '强化保护'); }
    if (mode === 'negative') { s.fighters[0].stages.def = -2; timer(s, 0, '弱化不可解除反转'); }
    if (mode === 'weak-immune') timer(s, 1, '免弱');
    go(s, 37916);
    assert.equal(sum(s, 'fixed'), 0);
    assert.equal(s.fighters[1].stages.def, mode === 'weak-immune' ? 0 : -2);
    if (mode === 'boost') assert.equal(s.fighters[0].stages.atk, 2);
    if (mode === 'negative') assert.equal(s.fighters[0].stages.def, -2);
  }
  const q = make({move: 37916, aStats: {atk: 3000}}); go(q, 37916);
  assert.ok(sum(q) >= 300); assert.equal(q.fighters[1].stages.def, 0);
});

test('4765完整1653取释放HP快照连续比例向下取整，494忽略正防御且固定免疫不妨红伤', () => {
  for (const [hp, n] of [[9000, 300], [4500, 150], [4499, 149], [899, 29]]) {
    const s = make({move: 37917}); s.fighters[1].hp = hp;
    go(s, 37917); assert.equal(sum(s, 'fixed'), n);
  }
  const a = make({move: 37917}), b = make({move: 37917}); b.fighters[1].stages.def = 6;
  go(a, 37917); go(b, 37917); assert.equal(sum(a), sum(b));
  const q = make({move: 37917}); timer(q, 1, '固定百分比免疫'); go(q, 37917);
  assert.equal(sum(q, 'fixed'), 0); assert.ok(sum(q) > 0);
});

test('4765完整37918的180清回合和保护，1252低半/低四分之一严格边界2倍4倍', () => {
  for (const protectedCase of [false, true]) {
    const s = make({move: 37918}); timer(s, 1, '固定增伤', {amount: 1});
    if (protectedCase) timer(s, 1, 'protect'); go(s, 37918);
    assert.equal(!!s.fighters[1].effects['固定增伤'], protectedCase);
  }
  const values = [];
  for (const hp of [4500, 4499, 2250, 2249]) { const s = make({move: 37918, hp}); go(s, 37918); values.push(sum(s)); }
  assert.ok(Math.abs(values[1] - 2 * values[0]) <= 2);
  assert.equal(values[2], values[1]);
  assert.ok(Math.abs(values[3] - 4 * values[0]) <= 3);
});

test('4765完整37906先959全属性1再978吸取反转再2164统计正级；点亮麻痹令理论吸取翻倍', () => {
  const s = make({ids: [...crowns, 37908], hp: 1000});
  s.fighters[1].stages.atk = 2;
  const out = {}; go(s, 37906, 20030, actorSnapshot(out));
  assert.equal(out.stages.atk, 3);
  assert.ok(axes.filter(k => k !== 'atk').every(k => out.stages[k] === 1));
  assert.equal(out.targetStages.atk, -2);
  assert.equal(sum(s, 'fixed'), 8 * 20 * 2, 'full ordered program gives8positivelevels, not isolated60');
  assert.equal(out.hp, 1000 + 320);
  for (const mode of ['protected', 'ban-boost', 'immune-fixed', 'heal-ban']) {
    const q = make({ids: [...crowns, 37908], hp: 1000}); q.fighters[1].stages.atk = 2;
    if (mode === 'protected') {
      timer(q, 1, '强化保护'); timer(q, 1, 'protect');
      //959 must fail under protect; retain six explicit pre-existing levels so
      // the intended2164positiveSum6/240 case cannot invent a failed959grant.
      for (const k of axes) q.fighters[0].stages[k] = 1;
    }
    if (mode === 'ban-boost') timer(q, 0, '禁强化');
    if (mode === 'immune-fixed') {
      timer(q, 1, '固定百分比免疫'); timer(q, 1, 'protect');
      // Protecting immunity also legitimately prevents959's grant. Six existing
      // boosts plus the real978 steal still give the asserted positiveSum8.
      for (const k of axes) q.fighters[0].stages[k] = 1;
    }
    if (mode === 'heal-ban') timer(q, 0, '技能禁疗');
    const seen = {}; go(q, 37906, 20030, actorSnapshot(seen));
    const expected = mode === 'protected' ? 240 : mode === 'ban-boost' ? 0 : 320;
    assert.equal(seen.stages.atk, mode === 'protected' ? 1 : mode === 'ban-boost' ? 0 : 3);
    assert.equal(seen.targetStages.atk, mode === 'protected' ? 2 : -2);
    assert.equal(sum(q, 'fixed'), mode === 'immune-fixed' ? 0 : expected);
    assert.equal(seen.hp, mode === 'heal-ban' ? 1000 : 1000 + expected);
  }
});

test('4765完整37906的663只当轮敌实际攻击后麻痹，免异阻断；控制不算实际用招', () => {
  for (const mode of ['normal', 'immune', 'control']) {
    const s = make({ids: [...crowns, 37908]});
    // Pre-lit slot prevents the separate SOUL point-paralysis from confounding663.
    s.fighters[0].soulState.lei1966.stars = [0]; s.fighters[0].soulState.lei1966.last = 0;
    if (mode === 'immune') { timer(s, 1, '免异常'); timer(s, 1, 'protect'); } // Otherwise native959 legitimately clears immunity first.
    if (mode === 'control') s.fighters[1].ailments['疲惫'] = 9;
    go(s, 37906, 10086);
    assert.equal(!!s.fighters[1].ailments['麻痹'], mode === 'normal');
    delete s.fighters[1].ailments['麻痹']; delete s.fighters[1].ailments['疲惫'];
    go(s, null, 10086); assert.equal(s.fighters[1].ailments['麻痹'], undefined);
  }
});

test('4765完整29043的2060与1647分时观察：敌属性失败附伤只取净HP增加，溢出/禁疗/反弹保留', () => {
  for (const mode of ['success', 'normal', 'overflow', 'full', 'heal-ban', 'reflect']) {
    const s = make({ids: [...crowns, 37908]});
    if (mode !== 'success' && mode !== 'reflect') timer(s, 1, '免异常');
    if (mode === 'reflect') timer(s, 1, 'reflect');
    if (mode === 'heal-ban') timer(s, 0, '技能禁疗');
    let ownUse, afterEnemy;
    go(s, 29043, 20030, (event, c) => {
      if (event === 'afterUse' && c.a.side === 0) {
        ownUse = c.a.hp;
        // Boundary prestate starts AFTER1647's own actual-use drain and BEFORE
        // the opponent's actual status action invokes2060. No clause is removed.
        c.a.hp = mode === 'overflow' ? 8999 : mode === 'full' ? 9000 : 1000;
        c.t.hp = 9000;
        delete c.t.ailments['麻痹'];
      }
      if (event === 'afterUse' && c.a.side === 1) afterEnemy = {hp: c.t.hp, paralyzed: !!c.a.ailments['麻痹']};
    });
    assert.ok(ownUse >= 3000); assert.ok(afterEnemy);
    const n = mode === 'success' || mode === 'full' || mode === 'heal-ban' ? 0 : mode === 'overflow' ? 1 : 3000;
    assert.equal(afterEnemy.hp, (mode === 'overflow' ? 8999 : mode === 'full' ? 9000 : 1000) + n);
    assert.equal(afterEnemy.paralyzed, mode === 'success');
    //1647's separate own-use nominal3000 appears in the SAME round; distinguish it.
    assert.equal(sum(s, 'percent'), 3000 + n);
  }
});

test('4765完整1647授予当次吸取，半血严格低才6000、相等3000，免粉补250真且理论回复不截断', () => {
  for (const hp of [4499, 4500]) {
    const s = make({ids: [...crowns, 37908], hp}); timer(s, 1, '固定百分比免疫');
    go(s, 29043, null);
    assert.equal(sum(s, 'percent'), 0); assert.equal(sum(s, 'true'), 250);
    assert.equal(s.fighters[0].hp, Math.min(9000, hp + (hp < 4500 ? 6000 : 3000)));
  }
  const s = make({ids: [...crowns, 37908], hp: 4499}); go(s, 29043, null);
  assert.equal(sum(s, 'percent'), 6000); assert.equal(s.fighters[0].hp, 9000);
});

test('4765完整1647持续四轮实际无效/技能封锁仍触发，控制/道具不触发且真实到期', () => {
  for (const mode of ['invalid', 'seal', 'control', 'item']) {
    const s = make({ids: [29043, 10006, 10171, 10174, 37908]});
    timer(s, 1, '固定百分比免疫'); go(s, 29043, null);
    for (let r = 2; r <= 5; r++) {
      refill(s); s.fighters[0].hp = 4499;
      if (mode === 'invalid') s.fighters[0].counts.nextSkillInvalid = 1;
      if (mode === 'seal') timer(s, 0, 'attackBlock');
      if (mode === 'control') s.fighters[0].ailments['疲惫'] = 9;
      go(s, mode === 'item' ? null : 10006, null);
      const n = r <= 4 && ['invalid', 'seal'].includes(mode) ? 250 : 0;
      assert.equal(sum(s, 'true'), n);
      assert.equal(s.fighters[0].hp, n ? 9000 : mode === 'item' ? 4749 : 4499, 'only actual blood potion heals250 when no1647 proc');
    }
  }
});

test('4765完整716敌实际攻击随机清1PP，PP保护/控制/物品阻断且不混入点亮恢复', () => {
  for (const mode of ['normal', 'protected', 'control', 'item']) {
    const s = make({ids: [...crowns, 37908]});
    s.fighters[0].soulState.lei1966.stars = [1]; s.fighters[0].soulState.lei1966.last = 1;
    if (mode === 'protected') timer(s, 1, 'PP保护');
    if (mode === 'control') s.fighters[1].ailments['疲惫'] = 9;
    go(s, 29043, mode === 'item' ? null : 10086);
    assert.equal(Object.values(s.fighters[1].pp).filter(n => n === 0).length, mode === 'normal' ? 1 : 0);
  }
});

test('4765完整29044的924下三轮真实攻击吸三分一、1683消强保护三轮；全部实例不裁剪', () => {
  const s = make({ids: [29044, 10006, 10171, 10174, 37908], hp: 1000});
  go(s, 29044); assert.equal(sum(s, 'percent'), 0);
  for (let r = 2; r <= 5; r++) {
    refill(s); s.fighters[0].hp = 1000;
    go(s, 10006, 20030, (event, c) => { if (event === 'afterUse' && c.a.side === 1) c.clearBoost(c.t); });
    assert.equal(sum(s, 'percent'), r <= 4 ? 3000 : 0);
    assert.equal(s.fighters[0].hp, r <= 4 ? 4000 : 1000);
    assert.equal(s.fighters[0].stages.atk, r < 4 ? 1 : 0);
  }
});

test('4765完整37907负级先制3、1221经正常强化事件，禁强/解除保护失败不授次数免异', () => {
  for (const mode of ['success', 'ban', 'protected', 'none']) {
    const s = make({ids: [...crowns, 37908]});
    if (mode !== 'none') s.fighters[0].stages.def = -2;
    if (mode === 'ban') timer(s, 0, '禁强化');
    if (mode === 'protected') timer(s, 0, '弱化不可解除反转');
    let immune;
    go(s, 37907, 20030, (event, c) => { if (event === 'afterUse' && c.a.side === 0) immune = c.a.counts.immune ?? 0; });
    assert.equal(s.fighters[0].soulState.resolvedPriority.value, mode === 'none' ? 0 : 3);
    assert.equal(s.fighters[0].stages.def, mode === 'success' ? 2 : mode === 'none' ? 0 : -2);
    assert.equal(immune, mode === 'success' ? 1 : 0);
  }
});

test('4765完整37907先手980封属性，后手863只封下一轮攻击；真实状态不可追溯抹去', () => {
  const early = make({ids: [...crowns, 37908]});
  timer(early, 1, '免异常'); // Admit the real enemy action; soul paralysis must not masquerade as980payload sealing.
  go(early, 37907, 20521);
  assert.equal(early.fighters[1].stages.def, 0); assert.equal(early.fighters[1].pp[key(20521)], 19);
  const late = make({ids: [...crowns, 37908], aStats: {spe: 50}, bStats: {spe: 500}});
  timer(late, 1, '免异常');
  go(late, 37907, 10086); assert.ok(sum(late, 'attack', 1) > 0);
  go(late, 37908, 10086); assert.equal(sum(late, 'attack', 1), 0);
  refill(late); go(late, 37908, 10086); assert.ok(sum(late, 'attack', 1) > 0);
});

test('4765真实第五0星只按当前一只存活最低100，1至4当前星各160威力；必中源不伪造MISS', () => {
  const values = [];
  for (let n = 0; n <= 4; n++) {
    const s = make({ids: [...crowns, 37908], bStats: {def: 1000}});
    s.fighters[0].soulState.lei1966.stars = paths[0].slice(0, n);
    s.fighters[0].soulState.lei1966.last = n ? paths[0][n - 1] : null;
    timer(s, 0, '攻击必失');
    go(s, 37908); values.push(sum(s));
    assert.equal(s.fighters[0].soulState.lei1966.stars.length, n, 'fifth never lights a star');
  }
  assert.equal(values[0], 100);
  assert.ok(values[4] > values[3] && values[3] > values[2] && values[2] > values[1]);
  const immune = make({ids: [...crowns, 37908]}); timer(immune, 1, '攻击伤害免疫'); timer(immune, 1, 'protect');
  go(immune, 37908); assert.equal(sum(immune), 0);
});

test('4765完整第五1523成功清回合才固定吸350，保护失败不授；禁疗与理论回复独立', () => {
  for (const mode of ['success', 'protected', 'heal-ban']) {
    const s = make({ids: [...crowns, 37908], hp: 1000});
    timer(s, 1, '固定增伤', {amount: 1}); timer(s, 1, '固定百分比免疫');
    if (mode === 'protected') timer(s, 1, 'protect');
    if (mode === 'heal-ban') timer(s, 0, '技能禁疗');
    go(s, 37908);
    assert.equal(sum(s, 'fixed'), mode === 'protected' ? 0 : 350);
    assert.equal(s.fighters[0].hp, mode === 'success' ? 1350 : 1000);
    assert.equal(!!s.fighters[1].effects['固定百分比免疫'], mode === 'protected');
  }
});

test('4765完整第五真实KO1960两轮保护；即时2243非KO只964正级翻倍且负级不变', () => {
  for (const revive of [false, true]) {
    const s = make({ids: [...crowns, 37908]});
    s.fighters[0].stages.atk = 2; s.fighters[0].stages.def = -2;
    s.fighters[1].hp = 1;
    // Public removal protection keeps1523 from adding350 AFTER immediate rebirth.
    // All four native fifth operations remain present and execute normal admission.
    timer(s, 1, 'protect');
    if (revive) s.fighters[1].soulState.rebirth2243 = {armed: true};
    go(s, 37908);
    assert.equal(s.fighters[1].hp, revive ? 9000 : 0);
    assert.equal(s.fighters[0].stages.atk, revive ? 4 : 2);
    assert.equal(s.fighters[0].stages.def, -2);
    if (revive) assert.equal(s.fighters[0].effects['强化保护'], undefined);
    else assert.deepEqual(s.fighters[0].effects['强化保护'], {start: 1, end: 2});
  }
});

test('4765原答123零红暴击702仍回满：普通盾和定额减免不封载荷，MISS整招无效与命中封锁不回满', () => {
  for (const mode of ['shield', 'flat', 'miss', 'invalid', 'hit-seal']) {
    const s = make({ids: [29050, 10006, 10171, 10174, 37908]});
    go(s, 29050); s.fighters[0].hp = 1000;
    if (mode === 'shield') s.fighters[1].suitState.shield = 99999;
    if (mode === 'flat') timer(s, 1, '伤害定额减免', {amount: 99999});
    if (mode === 'miss') { delete s.fighters[0].effects['攻击必中']; timer(s, 0, '攻击必失'); }
    if (mode === 'invalid') s.fighters[0].counts.nextSkillInvalid = 1;
    if (mode === 'hit-seal') timer(s, 0, '技能命中效果失效');
    go(s, 10006);
    assert.equal(s.fighters[0].hp, ['shield', 'flat'].includes(mode) ? 9000 : 1000, mode);
    if (mode !== 'hit-seal') assert.equal(sum(s), 0, mode);
    else assert.ok(sum(s) > 0, 'payload seal does not cancel the landed critical RED');
  }
});

test('4765完整37915当前1249仅本次回复净增附粉：普通满血溢出禁疗倍率蛊与回复转伤，固定240独立', () => {
  for (const mode of ['normal', 'full', 'overflow', 'ban', 'half', 'gu', 'conversion']) {
    const initial = mode === 'full' ? 9000 : mode === 'overflow' ? 8999 : 1000;
    const s = make({move: 37915, hp: initial});
    s.fighters[1].ailments['疲惫'] = 9; // Non-DOT condition; prevents an unrelated enemy action.
    if (mode === 'ban') timer(s, 0, '技能禁疗');
    if (mode === 'half') timer(s, 0, '回复效果削减', {fraction: .5});
    if (mode === 'gu') s.fighters[0].soulState.soulGu = [{sourceSide: 1, usedRound: 0}];
    if (mode === 'conversion') timer(s, 0, '自身技能回复转伤害', {sourceSide: 1, fraction: 1});
    go(s, 37915);
    const red = sum(s), request = mode === 'half' ? Math.floor(red / 2) : red;
    assert.ok(red > 0);
    const end = mode === 'full' || mode === 'overflow' ? 9000 : mode === 'ban' ? initial :
      mode === 'conversion' ? initial - request : initial + request - (mode === 'gu' ? 40 : 0);
    assert.equal(s.fighters[0].hp, end, mode);
    assert.equal(sum(s, 'percent'), Math.max(0, end - initial), mode + ':this1249NET only');
    assert.equal(sum(s, 'fixed'), 240, 'independent29[240] must not enlarge1249request');
    if (mode === 'gu') assert.equal(sum(s, 'true', 1), 40);
  }
});

test('4765完整37915超杀与保1红伤不按实际HP截断，固定240及异常附粉仍为各自独立来源', () => {
  for (const floor of [false, true]) {
    const s = make({move: 37915, hp: 1000}); s.fighters[1].hp = 1;
    s.fighters[1].ailments['疲惫'] = 9;
    if (floor) { timer(s, 1, 'protect'); timer(s, 1, '致命保留', {hp: 1}); }
    go(s, 37915);
    const red = sum(s); assert.ok(red > 1);
    assert.equal(damage(s)[0].hpLoss, floor ? 0 : 1);
    assert.equal(s.fighters[0].hp, 1000 + red);
    assert.equal(s.fighters[1].hp, floor ? 1 : 0);
    if (floor) { assert.equal(sum(s, 'fixed'), 240); assert.equal(sum(s, 'percent'), red); }
  }
});

test('4765实际1966觉醒与37915完整程序同招回血两来源分离，1249粉伤不能误取整招HP总增加', () => {
  for (const mode of ['normal', 'skill-ban', 'half']) {
    const s = awakeFixture(make({move: 37915, hp: 1000}));
    s.fighters[1].hp = 1; s.fighters[1].ailments['疲惫'] = 9;
    timer(s, 1, 'protect'); timer(s, 1, '致命保留', {hp: 1});
    if (mode === 'skill-ban') timer(s, 0, '技能禁疗');
    if (mode === 'half') timer(s, 0, '回复效果削减', {fraction: .5});
    go(s, 37915);
    const red = sum(s), soulHeal = mode === 'half' ? Math.floor(red / 2) : red;
    const skillHeal = mode === 'skill-ban' ? 0 : soulHeal;
    assert.ok(red > 1); assert.equal(damage(s)[0].hpLoss, 0);
    assert.equal(s.fighters[0].hp, 1000 + soulHeal + skillHeal);
    assert.equal(sum(s, 'percent'), skillHeal, 'only1249healNET, not independentawakeSoulheal');
    assert.equal(sum(s, 'fixed'), 240); assert.equal(s.fighters[1].hp, 1);
  }
});
