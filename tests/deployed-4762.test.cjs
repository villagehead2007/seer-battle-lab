'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');
const C = require('../dist/characteristic-catalog.js');
const source = require('../research/BATCH-4676-NEXT50/4762/snapshot.json');
const neutral = require('../research/4628-reviewed-snapshot.json');
const liu = require('../research/BATCH-4676-NEXT50/4761/snapshot.json');
const key = id => 'wiki:' + id;
const axes = ['atk', 'def', 'spa', 'spd', 'spe', 'acc'];
const panels = ['maxHp', 'atk', 'def', 'spa', 'spd', 'spe'];
const pool = [10001, 20288, 29047, 29048];
const policies = ['useTiming1973', 'shieldHealCount1973', 'deathBeforeRevive1973', 'capKinds1973', 'higherMax2296', 'ppBasis2295', 'trigger2295', 'instantOrder2295', 'curseProbability1973', 'curseMinimum1973'];
const bindings = [
  [10001, 'f1166c9c', []], [20288, 'b1520e22', [[5, [5, 100, -1]]]],
  [10194, '8628d5a', []], [20044, '96500a3a', [[4, [1, 100, 1]]]],
  [15877, '469de9d5', [[11, [30]]]], [16805, '8aa2e504', []],
  [20229, '22981786', [[5, [4, 100, -2]]]], [15879, '381152ea', []],
  [23751, 'fedfeeca', [[5, [5, 100, -2]]]], [16133, 'f6922d85', []],
  [23752, 'afbec292', [[48, [3]], [58, [2]], [4, [1, 100, 1]], [4, [3, 100, 1]], [4, [4, 100, 1]]]],
  [37912, '5059702f', [[889, [23]], [636, [0, 23]], [478, [2]]]],
  [29047, 'b3487e5e', [[1440, [2]], [803, [100, 23, 2, 3, 200]], [693, [2, 150]], [584, [3, 15]]]],
  [29048, '898dbeba', [[911, [1]], [1647, [4, 3, 2, 250]], [1304, [2, 24]], [843, [2, 2]]]],
  [37913, '3e7ed734', [[881, []], [1232, []], [2296, []], [2105, []], [2017, []]]],
  [37914, 'dcb0a3a4', [[2295, []], [698, [100, 23]]]]
];
function timer(s, side, name, data = {}, start = s.round, end = 99) {
  s.fighters[side].effects[name] = {start, end, ...data};
}
// No stripped skill instances, operations, invented loadout skills or research-policy defaults.
// Neutral4628 retains all real skill definitions; only its own soul is disabled.
function make({move = 10001, hp = 9000, enemy = 4628, characteristic = false, diagnostic = false,
  aStats = {}, bStats = {}, hit = true, seed = 0x9e3779b9} = {}) {
  const a = structuredClone(source), b = structuredClone(enemy === 4761 ? liu : neutral);
  a.selectedSoulId = 1973;
  if (enemy === 4761) b.selectedSoulId = 1972;
  else b.souls = [];
  const ids = move === 37914 ? [...pool, move] : [move, ...pool.filter(id => id !== move).slice(0, 3), 37914];
  const enemyIds = enemy === 4761 ? [14102, 20142, 29055, 29056, 37930] : [20030, 10086, 10392, 20521, 37258];
  assert.deepEqual(E.WIKI.assess(a, ids).issues, []);
  assert.deepEqual(E.WIKI.assess(b, enemyIds).issues, []);
  const stats = {maxHp: 9000, atk: 180, spa: 180, def: 300, spd: 300, spe: 500};
  const options = {wikiSnapshots: [a, b], wikiLoadouts: [ids, enemyIds], criticals: false,
    builds: [{suit: 'none', overrides: {...stats, ...aStats}},
      {suit: 'none', overrides: {...stats, spe: 100, ...bStats}, ...(characteristic ? {characteristic: {groupId: 21, star: 0}} : {})}]};
  if (diagnostic) options.comparisonPetEffects1972 = [[], [{id: C.get(21, 0).id, hash: C.get(21, 0).hash}]];
  const s = E.createBattle(options);
  Object.assign(s.typeChart.aliases, structuredClone(a.typeChart.aliases), structuredClone(b.typeChart.aliases));
  s.rng = seed;
  s.fighters[0].hp = hp;
  if (hit) for (const f of s.fighters) for (const name of ['攻击必中', '属性必中']) timer(s, f.side, name);
  assert.equal(s.fighters[0].soulId, 1973);
  assert.equal(s.fighters[1].soulId, enemy === 4761 ? 1972 : null);
  assert.equal(s.fighters[0].type, source.type);
  assert.equal(s.fighters[1].number, String(enemy));
  assert.equal(s.wikiSnapshots[0].moves.length, 16);
  for (const f of s.fighters) for (const name of policies) assert.equal(Object.hasOwn(f.soulState, name), false, name);
  for (const [snapshot, loadout] of [[a, ids], [b, enemyIds]]) for (const id of loadout) {
    const m = snapshot.moves.find(m => m.id === id), actual = s.moveDefinitions[key(id)];
    const compiled = E.WIKI.effectsEngine.compileInstances(m.effectInstances, snapshot.effects, m);
    assert.equal(compiled.issue, '');
    assert.deepEqual(actual.operations.map(o => [o.effectId, o.index, o.phase, o.params]),
      compiled.operations.map(o => [o.effectId, o.index, o.phase, o.params]), m.name + ':entire original program and phases');
    assert.equal(actual.revision, m.revision);
    if (snapshot.id === 4762 && id === 37914) {
      assert.equal(actual.operations.find(o => o.effectId === 2295 && o.index === 0).phase, 'beforeDamage');
      assert.deepEqual(E.WIKI.effectsEngine.registry[2295].hooks, {});
    }
    for (const [index, instance] of m.effectInstances.entries()) assert.ok(actual.operations.some(o => o.index === index && o.effectId === instance.id), m.name + ':' + index);
  }
  return s;
}
function go(s, a = 10001, b = 20030, observe = null) {
  const old = E.SOULS;
  if (observe) E.SOULS = {...old, run(event, c) { old.run(event, c); observe(event, c); }};
  try { return Object.assign(s, E.resolveTurn(s, [a === null ? 'potion:hp' : key(a), b === null ? 'potion:hp' : key(b)])); }
  finally { E.SOULS = old; }
}
const damage = (s, type = 'attack', side = 0) => (s.damageEvents ?? []).filter(e => e.round === s.round - 1 && e.type === type && e.sourceSide === side && e.targetSide === 1 - side);
const sum = (s, type = 'attack', side = 0) => damage(s, type, side).reduce((n, e) => n + e.settledDamage, 0);
function capture(out) {
  return (event, c) => {
    if (event === 'afterUse' && c.a.side === 0) Object.assign(out, {hp: c.a.hp, targetHp: c.t.hp,
      stages: {...c.a.stages}, targetStages: {...c.t.stages}, effects: structuredClone(c.a.effects), targetEffects: structuredClone(c.t.effects),
      ailments: {...c.a.ailments}, targetAilments: {...c.t.ailments}, immune: c.a.counts.immune});
  };
}
// Deterministic random injection only at the real outgoing damage event, never a policy/model.
// Used where minimum-damage proc would otherwise obscure the mechanic under examination.
const noCurseProc = (event, c) => { if (event === 'beforeDamage' && c.a.side === 0) c.random = () => .999999; };
function combined(...observers) { return (event, c) => observers.forEach(fn => fn(event, c)); }

test('4762原生1973全部16招保留真实ID/hash/index/args及完整编译阶段，与真实4628原生技能共存', () => {
  assert.equal(source.source.revision, '36c8185a');
  assert.equal(source.moves.length, 16);
  assert.deepEqual(source.souls.map(x => [x.id, x.hash, x.eid, x.args]), [[1973, '6ebfeebe', 2378, [1, 0]]]);
  for (const [id, hash, instances] of bindings) {
    const m = source.moves.find(m => m.id === id);
    assert.equal(m.hash, hash);
    assert.equal(m.revision, 'seerapi:' + hash);
    assert.deepEqual(m.effectInstances.map(x => [x.id, x.args]), instances);
    const s = make({move: id}), out = {};
    go(s, id, 20030, combined(noCurseProc, capture(out)));
    assert.equal(s.fighters[0].soulState.basePPCostThisUse.amount, 1, m.name);
    assert.equal(s.fighters[0].pp[key(id)], id === 37914 ? 0 : m.pp - 1, m.name + ':real PP');
    assert.ok(s.fighters.every(f => f.hp >= 0 && f.hp <= f.stats.maxHp));
    if (m.kind !== 'status' && id !== 37914) assert.ok(sum(s) > 0, m.name + ':actual RED');
    if ([20288, 23751].includes(id)) assert.equal(out.targetStages.acc, id === 20288 ? -1 : -2);
    if (id === 20229) assert.equal(out.targetStages.spe, -2);
    if (id === 20044) assert.equal(out.stages.def, 1);
    if (id === 16805) assert.equal(s.fighters[0].soulState.resolvedPriority.value, 2);
    if (id === 23752) { for (const k of ['def', 'spd', 'spe']) assert.equal(out.stages[k], 1); assert.ok(out.effects['免异常']); assert.ok(out.effects['必定暴击']); }
    if (id === 37912) assert.ok(out.targetEffects.statusBlock);
    if (id === 29047) { assert.equal(out.immune, 2); assert.ok(out.targetAilments['诅咒']); assert.ok(out.effects.id913); assert.ok(out.effects['攻击附加秒杀概率']); }
    if (id === 29048) { assert.ok(axes.every(k => out.stages[k] === 1)); assert.equal(sum(s, 'percent'), 3000); assert.ok(out.effects['湮灭实际用招低体吸取']); }
    if (id === 37913) assert.equal(s.fighters[1].stats.maxHp, 9000);
    if (id === 37914) { assert.equal(s.fighters[0].soulState.fifth2295.amount, 5); assert.equal(s.fighters[0].soulState.fifth2295.qualified, false); assert.equal(E.availableMoves(s.fighters[0]).includes(key(id)), false); assert.equal(s.moveDefinitions[key(id)].wikiId, id); }
  }
});

test('4762真正装备group21瞬杀初始1层，未装备和仅诊断比较都为0，不将来源比较冒充激活', () => {
  for (const characteristic of [false, true]) for (const diagnostic of [false, true]) {
    const s = make({characteristic, diagnostic});
    assert.equal(s.fighters[0].soulState.magicCurse1973, characteristic ? 1 : 0);
    if (characteristic) assert.equal(s.fighters[1].build.characteristic.id, C.get(21, 0).id);
  }
});

test('4762真实装备瞬杀对当前1973改为加层而非秒杀伤害，普通实际红伤仍独立结算', () => {
  let found;
  for (let seed = 1; seed <= 128; seed++) {
    const s = make({move: 20044, characteristic: true, seed: Math.imul(seed, 2654435761) >>> 0});
    go(s, 20044, 10086);
    if ((s.instantReplacement1973 ?? []).length) { found = s; break; }
  }
  assert.ok(found, 'bounded real battle RNG activates the actually equipped instant characteristic');
  assert.equal(found.instantReplacement1973.length, 1);
  assert.equal(found.fighters[0].soulState.magicCurse1973, 2, 'one startup layer plus one intercepted instant');
  assert.ok(found.fighters[0].hp > 0);
  assert.equal(found.fighters[0].hp, 9000 - sum(found, 'attack', 1));
  assert.equal((found.healthLossEvents ?? []).some(e => e.type === 'execution' && e.targetSide === 0), false);
  assert.equal(sum(found, 'true', 1), 0);
});

test('4762咒怨9层不免控而10层免控，非控制烧伤仍生效，不用模型开关', () => {
  for (const layers of [9, 10]) for (const status of ['睡眠', '烧伤']) {
    const s = make({move: 20288}); s.fighters[0].soulState.magicCurse1973 = layers;
    let accepted;
    go(s, 20288, 20030, (event, c) => {
      if (event === 'afterUse' && c.a.side === 1) accepted = c.ailment(c.t, status, c.a, false, false, 2);
    });
    assert.equal(accepted, status !== '睡眠' || layers < 10);
    assert.equal(!!s.fighters[0].ailments[status], status !== '睡眠' || layers < 10);
  }
});

test('4762完整不幸之爪30%中毒有真实成功失败，攻击免疫零红仍可命中附毒', () => {
  const outcomes = new Set();
  for (let seed = 1; seed <= 64; seed++) {
    const s = make({move: 15877, seed: Math.imul(seed, 2654435761) >>> 0}), out = {};
    timer(s, 1, '攻击伤害免疫');
    go(s, 15877, 20030, capture(out));
    assert.equal(sum(s), 0);
    outcomes.add(!!out.targetAilments['中毒']);
  }
  assert.deepEqual(outcomes, new Set([true, false]));
});

test('4762满体在对手实际出手前双清，回合保护和强化保护分别生效，控制与道具不触发授盾', () => {
  for (const protectTurn of [false, true]) for (const protectBoost of [false, true]) {
    const s = make({move: 20288});
    timer(s, 1, '固定增伤', {amount: 1}); s.fighters[1].stages.def = 2;
    if (protectTurn) timer(s, 1, 'protect');
    if (protectBoost) timer(s, 1, '强化保护');
    let seen = false;
    go(s, 20288, 20030, (event, c) => {
      if (event !== 'opponentBeforeUse' || c.a.side !== 0) return;
      seen = true;
      assert.equal(!!c.t.effects['固定增伤'], protectTurn);
      assert.equal(c.t.stages.def, protectTurn && protectBoost ? 2 : 0, 'a removable boost-protection timer is itself removed by the preceding successful turn clear');
      assert.equal(c.a.suitState.shield, 0);
    });
    assert.ok(seen);
  }
  for (const mode of ['control', 'item']) {
    const s = make({move: 20288, hp: 5000});
    if (mode === 'control') s.fighters[1].ailments['疲惫'] = 9;
    go(s, 20288, mode === 'item' ? null : 20030);
    assert.equal(s.fighters[0].suitState.shield, 0);
    assert.equal(s.fighters[0].hp, 5000);
  }
});

test('4762非满体真实用招授半缺血盾罩，真实红伤耗盾与固定伤耗罩后战阶只回剩余合计，技能禁疗不封魂印回复', () => {
  const s = make({move: 20288, hp: 5000});
  timer(s, 0, '技能禁疗');
  let remaining;
  go(s, 20288, 10086, (event, c) => {
    if (event === 'opponentBeforeUse' && c.a.side === 0) {
      assert.equal(c.a.suitState.shield, 2000);
      assert.equal(c.a.suitState.barrier, 2000);
    }
    if (event !== 'afterUse' || c.a.side !== 1) return;
    assert.ok(c.t.suitState.shield > 0 && c.t.suitState.shield < 2000, 'the real10086 RED consumed ordinary shield');
    assert.equal(c.t.suitState.barrier, 2000);
    c.hurt(c.t, 300, '实际固定伤害消耗护罩', 'fixed');
    assert.equal(c.t.suitState.barrier, 1700);
    remaining = c.t.suitState.shield + c.t.suitState.barrier;
    assert.equal(c.t.hp, 5000);
  });
  assert.equal(s.fighters[0].hp, 5000 + remaining);
  assert.equal(s.fighters[0].soulState.shieldHeal1973, undefined);
});

test('4762真正KO加35六面板及2层但不加能力等级，2243即时满HP满PP保留状态不算KO', () => {
  for (const revive of [false, true]) {
    const s = make(); s.fighters[1].hp = 1;
    s.fighters[1].stages.def = -1; timer(s, 1, '原有重生标记');
    if (revive) {
      s.fighters[1].soulState.rebirth2243 = {armed: true};
      for (const id of s.fighters[1].moves) s.fighters[1].pp[id] = 1;
    }
    const before = {...s.fighters[0].stats}; let observed = false;
    go(s, 10001, 20030, (event, c) => {
      if (event !== 'afterAttack' || c.a.side !== 0) return;
      observed = true;
      for (const k of panels) assert.equal(c.a.stats[k], before[k] + (revive ? 0 : 35));
      assert.equal(c.a.hp, 9000, 'maxHP growth itself is not healing');
      assert.equal(c.a.soulState.magicCurse1973 ?? 0, revive ? 0 : 2);
      assert.equal(c.a.soulState.killCount1973 ?? 0, revive ? 0 : 1);
      assert.ok(axes.every(k => c.a.stages[k] === 0));
      if (revive) {
        assert.equal(c.t.hp, 9000); assert.equal(c.t.stages.def, -1);
        assert.ok(c.t.effects['原有重生标记']);
        assert.equal(c.t.soulState.deathResolved, undefined);
        for (const id of c.t.moves) assert.equal(c.t.pp[id], s.moveDefinitions[id].pp);
      } else assert.equal(c.t.hp, 0);
    });
    assert.ok(observed);
  }
});

test('4762真被击败削对手当前MAX35%并夹HP且不制造伤害事件，2243立即拦截则不削MAX', () => {
  for (const revive of [false, true]) {
    const s = make({move: 20044, hp: 1, aStats: {def: 1}, bStats: {atk: 9999}});
    if (revive) s.fighters[0].soulState.rebirth2243 = {armed: true};
    go(s, 20044, 10086);
    assert.equal(s.fighters[0].hp, revive ? 9000 : 0);
    assert.equal(s.fighters[1].stats.maxHp, revive ? 9000 : 5850);
    assert.equal(s.fighters[1].hp, revive ? 9000 : 5850);
    assert.equal((s.fighters[0].soulState.deathEvents1973 ?? []).length, revive ? 0 : 1);
    assert.equal(sum(s, 'percent'), 0);
    assert.equal(sum(s, 'true'), 0);
  }
});

test('4762完整29047诅咒失败回复与200上限仅限红伤，固定300不受上限，成功不补偿', () => {
  const success = make({move: 29047}), out = {};
  go(success, 29047, 20030, capture(out));
  assert.ok(out.targetAilments['诅咒']); assert.equal(out.effects['伤害上限'], undefined);
  const s = make({move: 29047, bStats: {atk: 9999}});
  timer(s, 1, '免异常');
  go(s, 29047, 10086, (event, c) => {
    if (event === 'afterUse' && c.a.side === 1) c.hurt(c.t, 300, '实际固定300不受红伤上限', 'fixed');
  });
  assert.equal(sum(s, 'attack', 1), 200);
  assert.equal(sum(s, 'fixed', 1), 300);
  assert.equal(s.fighters[0].hp, 8500);
  assert.equal(s.fighters[0].effects['伤害上限'].attackOnly, true);
});

test('4762完整29048低半理论吸取6000及百分比免疫追加250真实，禁疗只封技能回复而不封战阶魂印', () => {
  for (const blockedHeal of [false, true]) {
    const s = make({move: 29048, hp: 1000}), out = {};
    timer(s, 1, '固定百分比免疫');
    if (blockedHeal) timer(s, 0, '技能禁疗');
    go(s, 29048, 20030, capture(out));
    assert.equal(sum(s, 'percent'), 0); assert.equal(sum(s, 'true'), 250);
    assert.equal(out.hp, blockedHeal ? 1000 : 7000);
    assert.ok(axes.every(k => out.stages[k] === 1));
    assert.equal(s.fighters[0].hp, 9000, 'remaining soul shield/barrier heal is not skill healing');
  }
});

test('4762完整37913真实反转负级并传等量负级，最低存活当前目标高低相等MAX均按原生规则结算', () => {
  for (const maxHp of [8000, 9000, 9999]) {
    const s = make({move: 37913, bStats: {maxHp, atk: 20, def: 40, spa: 60, spd: 80, spe: 100}}), out = {};
    s.fighters[1].hp = maxHp === 9999 ? 9999 : 1000;
    s.fighters[1].stages.atk = 2;
    const before = {...s.fighters[1].stats};
    go(s, 37913, 20030, capture(out));
    assert.equal(s.fighters[1].stats.maxHp, 9000);
    for (const k of ['atk', 'def', 'spa', 'spd', 'spe']) assert.equal(s.fighters[1].stats[k], maxHp < 9000 ? Math.max(1, before[k] - 50) : before[k]);
    assert.equal(out.targetStages.atk, 2, 'panel change is not a stage change');
    if (maxHp === 9999) assert.equal(out.targetHp, 9000, 'force lower MAX and clamp, without inventing negative heal or stat gain');
    else assert.equal(out.targetHp, 1000 - sum(s) + (9000 - maxHp));
  }
  const s = make({move: 37913}), out = {};
  s.fighters[0].stages.atk = -2; s.fighters[0].stages.spe = -3;
  go(s, 37913, 20030, capture(out));
  assert.equal(s.fighters[0].soulState.resolvedPriority.value, 3);
  assert.equal(out.stages.atk, 2); assert.equal(out.stages.spe, 3);
  assert.equal(out.targetStages.atk, -2); assert.equal(out.targetStages.spe, -3);
});

test('4762完整第五5PP含基础消耗换5层及废除，严格大于5先秒杀；普通红伤零也不阻止已命中载荷', () => {
  for (const initial of [0, 1]) {
    const s = make({move: 37914}); s.fighters[0].soulState.magicCurse1973 = initial;
    go(s, 37914, 20030, noCurseProc);
    const p = s.fighters[0].soulState.fifth2295;
    assert.equal(p.amount, 5); assert.equal(p.layers, initial + 5); assert.equal(p.qualified, initial > 0);
    assert.equal(s.fighters[0].pp[key(37914)], 0);
    assert.equal((s.healthLossEvents ?? []).some(e => e.type === 'execution' && e.targetSide === 1), initial > 0);
    assert.equal(s.fighters[1].hp, initial ? 0 : 9000);
    assert.equal(s.fighters[0].soulState.magicCurse1973, initial + 5 + (initial ? 2 : 0));
    s.fighters[0].pp[key(37914)] = 5;
    assert.equal(E.availableMoves(s.fighters[0]).includes(key(37914)), false);
    assert.equal(s.moveDefinitions[key(37914)].revision, 'seerapi:dcb0a3a4');
  }
  const zero = make({move: 37914}); zero.fighters[1].hp = 1000; timer(zero, 1, '攻击伤害免疫');
  go(zero, 37914, 20030, noCurseProc);
  assert.equal(sum(zero), 0); assert.equal(zero.fighters[1].hp, 9000);
  assert.equal(zero.fighters[0].soulState.fifth2295.amount, 5);
  assert.equal(E.availableMoves(zero.fighters[0]).includes(key(37914)), false);
});

test('4762完整第五整招失效和命中封锁只扣基础1PP，不废除不换层不回满对手', () => {
  for (const mode of ['invalid', 'sealed']) {
    const s = make({move: 37914}); s.fighters[1].hp = 1000;
    if (mode === 'invalid') s.fighters[0].counts.nextSkillInvalid = 1;
    if (mode === 'sealed') timer(s, 0, '技能命中效果失效');
    go(s, 37914, 20030, noCurseProc);
    assert.equal(s.fighters[0].pp[key(37914)], 4, mode + ':only base PP on failed qualification');
    assert.equal(s.fighters[0].soulState.magicCurse1973 ?? 0, 0);
    assert.equal(s.fighters[0].soulState.fifth2295, undefined);
    assert.equal(s.fighters[1].hp, 1000);
    assert.equal(E.availableMoves(s.fighters[0]).includes(key(37914)), true);
  }
});

test('4762来源必中第五不被普通攻击必失伪造MISS，普通撞击真实MISS则不造成伤害但仍正常扣PP', () => {
  // The failed v1/v2 fixture treated37914(alwaysHit:true) as an ordinary MISS.
  // Keep that source distinction explicit rather than weakening the invalid/sealed tests.
  for (const move of [10001, 37914]) {
    const s = make({move}); s.fighters[1].hp = 1000;
    delete s.fighters[0].effects['攻击必中']; timer(s, 0, '攻击必失');
    let reason;
    go(s, move, 20030, combined(noCurseProc, (event, c) => {
      if (event === 'afterUse' && c.a.side === 0) reason = {...c.invalidReason};
    }));
    if (move === 10001) {
      assert.equal(reason.miss || reason.forcedMiss, true);
      assert.equal(sum(s), 0);
      assert.equal(s.fighters[1].hp, 1000);
      assert.equal(s.fighters[0].pp[key(move)], 34);
    } else {
      assert.equal(!!reason.miss || !!reason.forcedMiss, false);
      assert.equal(s.fighters[1].hp, 9000);
      assert.equal(s.fighters[0].pp[key(move)], 0);
      assert.equal(s.fighters[0].soulState.fifth2295.amount, 5);
      assert.equal(E.availableMoves(s.fighters[0]).includes(key(move)), false);
    }
  }
});

test('4762完整第五对真实1972希望免秒杀仍结算最低普通红伤，2243复活不发旧KO而后续真KO才奖励', () => {
  const hope = make({move: 37914, enemy: 4761});
  Object.assign(hope.fighters[1].soulState.dream1972, {flower: null, hope: true});
  hope.fighters[0].soulState.magicCurse1973 = 1;
  go(hope, 37914, 20142, noCurseProc);
  assert.equal(hope.fighters[1].hp, 0);
  assert.equal(sum(hope), 9000);
  assert.equal(hope.fighters[0].soulState.killCount1973, 1);
  assert.equal(hope.fighters[0].soulState.magicCurse1973, 8);
  const rebirth = make({move: 37914});
  rebirth.fighters[0].soulState.magicCurse1973 = 1;
  rebirth.fighters[1].soulState.rebirth2243 = {armed: true};
  let beforeRed;
  go(rebirth, 37914, 20030, combined(noCurseProc, (event, c) => {
    if (event === 'afterAttack' && c.a.side === 0) beforeRed = {kills: c.a.soulState.killCount1973 ?? 0, used: c.t.soulState.rebirth2243.armed};
  }));
  assert.equal(beforeRed.used, false);
  assert.equal(beforeRed.kills, 1, 'instant revival itself is not a KO; the subsequent minimum red is the only real KO');
  assert.equal(rebirth.fighters[0].soulState.magicCurse1973, 8);
});
