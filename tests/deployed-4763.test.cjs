'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');
const source = require('../research/BATCH-4676-NEXT50/4763/snapshot.json');
const neutral = require('../research/4628-reviewed-snapshot.json');
const future = require('../data/species/4450.json').snapshot;
const key = id => 'wiki:' + id;
const axes = ['atk', 'def', 'spa', 'spd', 'spe', 'acc'];
const pool = [10001, 20167, 29057, 29058];
const policyNames = ['deathBeforeRevive1974', 'rebirthMode2243', 'capUnit766', 'capKinds766', 'drainBasis837', 'useTiming1255', 'useTiming1842'];
const bindings = [
  [10001, 'f1166c9c', []], [10389, 'f69ef042', [[31, [2, 3]]]],
  [20167, '174c2883', [[4, [4, 100, 2]]]], [10390, '39ffb142', []],
  [10392, '77cafb7e', [[15, [5]]]], [20168, 'bc4ffdf3', [[4, [5, 100, 1]]]],
  [37931, '15a47524', [[766, [2, 1]], [837, [300, 50, 500]]]],
  [10393, 'fa410e6b', [[5, [3, 15, -1]]]], [20169, 'b0772fcb', [[5, [5, 100, -1]]]],
  [10396, '2450fbcb', [[2, []]]], [10394, '835e1607', []],
  [10397, '50858976', [[15, [5]]]], [20170, 'dfea58e6', [[4, [2, 100, 2]]]],
  [29057, '60a8437c', [[48, [4]], [47, [4]], [1255, [3, 70, 6, 3]]]],
  [29058, 'b6e73ee7', [[1238, [1, 222]], [1842, [4, 250, 400]], [843, [2, 2]]]],
  [37932, '8f6d8986', [[884, []], [1395, []]]],
  [37933, '2f479800', [[1167, []], [950, [2]], [899, []]]]
];
function timer(s, side, name, data = {}, start = s.round, end = 99) {
  s.fighters[side].effects[name] = {start, end, ...data};
}
// Both snapshots retain EVERY real move and instance. Only neutral4628's soul is disabled.
// The deterministic hit timers below are explicitly controlled public-effect fixtures;
// no source accuracy, must-hit field, operation, skill slot, or policy default is replaced.
function make({move = 10001, ids, hp = 9000, enemy = 4628, hit = true, criticals = false,
  aStats = {}, bStats = {}, seed = 0x9e3779b9} = {}) {
  const a = structuredClone(source), b = structuredClone(enemy === 4450 ? future : neutral);
  a.selectedSoulId = 1974;
  if (enemy === 4450) {
    b.selectedSoulId = 1664;
    b.selectedSkillVersion = 'soul-1664-fifth-36303';
  } else b.souls = [];
  ids ??= move === 37933 ? [...pool, move] : [move, ...pool.filter(id => id !== move).slice(0, 3), 37933];
  const other = enemy === 4450 ? [28162, 36293, 36294, 36298, 36303] : [20030, 10086, 10392, 20521, 37258];
  assert.deepEqual(E.WIKI.assess(a, ids).issues, []);
  assert.deepEqual(E.WIKI.assess(b, other).issues, []);
  const stats = {maxHp: 9000, atk: 180, spa: 180, def: 300, spd: 300, spe: 500};
  const s = E.createBattle({wikiSnapshots: [a, b], wikiLoadouts: [ids, other], criticals,
    builds: [{suit: 'none', overrides: {...stats, ...aStats}},
      {suit: 'none', overrides: {...stats, spe: 100, ...bStats}}]});
  Object.assign(s.typeChart.aliases, structuredClone(a.typeChart.aliases), structuredClone(b.typeChart.aliases));
  s.rng = seed;
  s.fighters[0].hp = hp;
  if (hit) for (const f of s.fighters) for (const name of ['攻击必中', '属性必中']) timer(s, f.side, name);
  assert.equal(s.fighters[0].soulId, 1974);
  assert.equal(s.fighters[1].soulId, enemy === 4450 ? 1664 : null);
  assert.equal(s.fighters[0].type, source.type);
  assert.equal(s.fighters[1].number, String(enemy));
  assert.equal(s.wikiSnapshots[0].moves.length, 17);
  if (enemy === 4450) {
    assert.equal(s.wikiSnapshots[1].moves.length, 18, 'both raw fifth sources are preserved, not both equipped');
    assert.equal(s.wikiSnapshots[1].selectedSkillVersion, 'soul-1664-fifth-36303');
    assert.equal(E.WIKI.availableMoves(b).length, 17);
    assert.equal(s.fighters[1].moves.includes(key(36302)), false);
  }
  for (const f of s.fighters) for (const name of policyNames) assert.equal(Object.hasOwn(f.soulState, name), false, name);
  for (const [snapshot, loadout] of [[a, ids], [b, other]]) for (const id of loadout) {
    const m = snapshot.moves.find(m => m.id === id), actual = s.moveDefinitions[key(id)];
    const compiled = E.WIKI.effectsEngine.compileInstances(m.effectInstances, snapshot.effects, m);
    assert.equal(compiled.issue, '');
    assert.deepEqual(actual.operations.map(o => [o.effectId, o.index, o.phase, o.params]),
      compiled.operations.map(o => [o.effectId, o.index, o.phase, o.params]), m.name + ':entire native program');
    assert.equal(actual.revision, m.revision);
    assert.equal(actual.accuracy, m.accuracy);
    assert.equal(actual.alwaysHit, m.alwaysHit);
    for (const [index, x] of m.effectInstances.entries())
      assert.ok(actual.operations.some(o => o.index === index && o.effectId === x.id), m.name + ':' + index);
  }
  return s;
}
function go(s, a = 10001, b = 20030, observe = null) {
  const old = E.SOULS;
  if (observe) E.SOULS = {...old, run(event, c) { old.run(event, c); observe(event, c); }};
  try { return Object.assign(s, E.resolveTurn(s, [a === null ? 'potion:hp' : key(a), b === null ? 'potion:hp' : key(b)])); }
  finally { E.SOULS = old; }
}
const damage = (s, type = 'attack', side = 0) => (s.damageEvents ?? []).filter(e =>
  e.round === s.round - 1 && e.type === type && e.sourceSide === side && e.targetSide === 1 - side);
const sum = (s, type = 'attack', side = 0) => damage(s, type, side).reduce((n, e) => n + e.settledDamage, 0);
const capture = out => (event, c) => {
  if (event === 'afterUse' && c.a.side === 0) Object.assign(out, {hp: c.a.hp, targetHp: c.t.hp,
    stages: {...c.a.stages}, targetStages: {...c.t.stages}, effects: structuredClone(c.a.effects),
    targetEffects: structuredClone(c.t.effects), targetAilments: {...c.t.ailments}});
};

test('4763全部17招实际1974、原hash/实例/参数/完整阶段与不同种4628真实五招共存', () => {
  assert.equal(source.source.revision, '2cb4c48e');
  assert.equal(source.moves.length, 17);
  assert.deepEqual(source.souls.map(x => [x.id, x.hash, x.eid, x.args]), [[1974, '1ab671f2', 2387, [0, 100, 1]]]);
  assert.deepEqual(source.moves.filter(m => m.fifth).map(m => m.id), [37933]);
  for (const [id, hash, instances] of bindings) {
    const m = source.moves.find(m => m.id === id), s = make({move: id}), out = {};
    assert.equal(m.hash, hash);
    assert.equal(m.revision, 'seerapi:' + hash);
    assert.deepEqual(m.effectInstances.map(x => [x.id, x.args]), instances);
    go(s, id, 20030, capture(out));
    assert.equal(s.fighters[0].soulState.basePPCostThisUse.amount, 1, m.name);
    assert.equal(s.fighters[0].pp[key(id)], m.pp - 1, m.name + ':real PP');
    assert.ok(s.fighters.every(f => f.hp >= 0 && f.hp <= f.stats.maxHp));
    if (m.kind !== 'status') assert.ok(sum(s) > 0, m.name + ':actual RED');
    if (id === 20167) assert.equal(out.stages.spe, 2);
    if (id === 20168) assert.equal(out.stages.acc, 1);
    if (id === 20169) assert.equal(out.targetStages.acc, -1);
    if (id === 20170) assert.equal(out.stages.spa, 2);
    if (id === 37931) assert.equal(sum(s, 'fixed'), 300);
    if (id === 29057) { assert.ok(out.effects['免异常']); assert.ok(out.effects['免弱']); assert.ok(out.effects['魇魔实际用招害怕补粉']); }
    if (id === 29058) { assert.ok(axes.every(k => out.stages[k] === 1)); assert.equal(sum(s, 'fixed'), 250); assert.ok(out.effects['魇魔实际用招固定吸取']); }
    if (id === 37932) { assert.equal(m.pp, 1); assert.equal(s.fighters[1].stages.spe, 0); assert.equal(E.availableMoves(s.fighters[0]).includes(key(id)), false); }
    if (id === 37933) assert.equal(s.fighters[1].stages.spe, 0, '899 invalidates the real selected status move');
  }
});

test('4763七个精确来源绑定校验hash/revision/实例序号和原参数，不能仅靠moveID混入', () => {
  for (const [moveId, index, effectId] of [[37931, 0, 766], [37931, 1, 837], [29057, 2, 1255],
    [29058, 0, 1238], [29058, 1, 1842], [37933, 0, 1167], [37933, 1, 950]]) {
    const m = source.moves.find(m => m.id === moveId), p = m.effectInstances[index].args;
    const validate = E.WIKI.effectsEngine.registry[effectId].validate;
    assert.doesNotThrow(() => validate(p, m, index));
    assert.throws(() => validate(p, {...m, hash: 'wrong-source'}, index), /4763 source mismatch/);
    assert.throws(() => validate(p, {...m, revision: 'seerapi:wrong-source'}, index), /4763 source mismatch/);
    assert.throws(() => validate(p, m, index + 10), /4763 source mismatch/);
    assert.throws(() => validate([...p, 999], m, index), /4763 source mismatch/);
  }
});

test('4763原生1974条件分支：无异常不回PP不清第五，已有零第五不能越过异常前置', () => {
  for (const abnormal of [false, true]) for (const zero of [false, true]) {
    const s = make({move: 20167});
    for (const k of s.fighters[0].moves) s.fighters[0].pp[k] = 1;
    if (abnormal) s.fighters[1].ailments['中毒'] = 9;
    if (zero) s.fighters[1].pp[key(37258)] = 0;
    go(s, 20167);
    assert.equal(s.fighters[0].pp[key(10001)], abnormal ? 35 : 1);
    assert.equal(s.fighters[0].pp[key(20167)], abnormal ? 19 : 0);
    assert.equal(s.fighters[1].pp[key(37258)], abnormal || zero ? 0 : neutral.moves.find(m => m.id === 37258).pp);
    assert.equal(!!s.fighters[1].ailments['害怕'], abnormal);
  }
});

test('4763魂印PP保护按实际第五结果判害怕，次数免异/反弹独立且反弹优先不消费次数', () => {
  for (const zero of [false, true]) {
    const s = make(); s.fighters[1].ailments['中毒'] = 9; timer(s, 1, 'PP保护');
    if (zero) s.fighters[1].pp[key(37258)] = 0;
    go(s);
    assert.equal(s.fighters[1].pp[key(37258)], zero ? 0 : neutral.moves.find(m => m.id === 37258).pp);
    assert.equal(!!s.fighters[1].ailments['害怕'], zero);
  }
  for (const reflect of [false, true]) {
    const s = make({move: 20167}); s.fighters[1].ailments['中毒'] = 9;
    s.fighters[1].counts.immune = 1;
    if (reflect) timer(s, 1, 'reflect');
    s.fighters[0].pp[key(10001)] = 1;
    go(s, 20167);
    assert.equal(s.fighters[0].pp[key(10001)], 35);
    assert.equal(s.fighters[1].pp[key(37258)], 0);
    assert.equal(s.fighters[1].ailments['害怕'], undefined);
    assert.equal(s.fighters[1].counts.immune, reflect ? 1 : 0);
    assert.equal(!!s.fighters[0].ailments['害怕'], reflect);
    assert.equal(s.fighters[0].stages.spe, reflect ? 0 : 2);
  }
});

test('4763回合初魂印独立于控制、技能封锁与技能PP禁回；道具不冒充实际使用技能', () => {
  for (const mode of ['control', 'seal', 'item']) {
    const s = make({move: 37932});
    for (const k of s.fighters[0].moves) s.fighters[0].pp[k] = 0;
    // Selection is validated before roundStart: the selected skill must already have PP.
    // The other four genuinely empty slots prove subsequent soul restoration.
    s.fighters[0].pp[key(37932)] = 1;
    s.fighters[1].ailments['中毒'] = 9;
    s.fighters[1].soulState.bedPartnerPP = true;
    timer(s, 1, '机械领域', {fraction: 1});
    if (mode === 'control') s.fighters[0].ailments['疲惫'] = 9;
    if (mode === 'seal') timer(s, 0, 'attackBlock');
    go(s, mode === 'item' ? null : 37932);
    assert.equal(s.fighters[0].pp[key(10001)], 35, 'soul restore is not skill PP restoration');
    assert.equal(s.fighters[0].pp[key(37932)], mode === 'seal' ? 0 : 1);
    assert.equal(s.fighters[1].pp[key(37258)], 0);
    assert.equal(sum(s), 0);
    assert.equal(s.fighters[0].soulState.skillUses?.[key(37932)] ?? 0, mode === 'seal' ? 1 : 0);
  }
});

test('4763普通死亡害怕成功不清回合，失败才清且保护照常拦截；无历史2243候选默认', () => {
  for (const mode of ['fear', 'immune', 'protected']) {
    const s = make({hp: 1, aStats: {spe: 1}, bStats: {atk: 9999, spe: 1000}});
    timer(s, 1, '固定增伤', {amount: 1});
    if (mode !== 'fear') timer(s, 1, '免异常');
    if (mode === 'protected') timer(s, 1, 'protect');
    go(s, 10001, 10086);
    assert.equal(s.fighters[0].hp, 0);
    assert.equal(!!s.fighters[1].ailments['害怕'], mode === 'fear');
    assert.equal(!!s.fighters[1].effects['固定增伤'], mode !== 'immune');
    assert.equal(s.fighters[0].soulState.deathEvents1974.length, 1);
    assert.equal(s.fighters[0].soulState.deathEvents1974[0].applied, mode === 'fear');
  }
});

test('4763已武装2243立即回满保留状态而非KO，不派发1974死亡害怕或失败清回合', () => {
  const s = make({hp: 1, aStats: {spe: 1}, bStats: {atk: 9999, spe: 1000}});
  s.fighters[0].soulState.rebirth2243 = {armed: true};
  s.fighters[0].ailments['烧伤'] = 3;
  s.fighters[0].stages.def = 2;
  timer(s, 1, '固定增伤', {amount: 1});
  let afterRevive;
  go(s, 10001, 10086, (event, c) => {
    if (event === 'afterAttack' && c.a.side === 1) afterRevive = {hp: c.t.hp, pp: {...c.t.pp}, burn: c.t.ailments['烧伤'], def: c.t.stages.def};
  });
  assert.ok(afterRevive);
  assert.equal(afterRevive.hp, 9000);
  for (const id of [10001, 20167, 29057, 29058, 37933]) assert.equal(afterRevive.pp[key(id)], source.moves.find(m => m.id === id).pp);
  assert.equal(afterRevive.def, 2);
  assert.ok(afterRevive.burn);
  assert.equal(s.fighters[0].soulState.rebirth2243.armed, false);
  assert.equal(s.fighters[0].soulState.deathEvents1974, undefined);
  assert.equal(s.fighters[1].ailments['害怕'], undefined);
  assert.ok(s.fighters[1].effects['固定增伤']);
});

test('4763真实1974死亡回合初公共组件：不调用恢复PP、不清第五、不附怕', () => {
  const s = make();
  let observed = false;
  go(s, 10001, 20030, (event, c) => {
    if (event !== 'beforeRoundStart' || c.a.side !== 0) return;
    observed = true;
    // A battle already containing a dead fighter correctly finishes before its
    // normal roundStart dispatch. Probe that unreachable safety guard explicitly
    // as a public component, using the real battle context and real neutral4628
    // target loadout, rather than falsely claiming a native extra battle round.
    const dead = structuredClone(c.a), target = structuredClone(c.t);
    dead.hp = 0;
    dead.pp[key(10001)] = 1;
    target.ailments['中毒'] = 9;
    const fifthPP = target.pp[key(37258)], calls = {restore: 0, ailment: 0};
    E.SOULS.run('roundStart', {...c, a: dead, t: target,
      restorePP(f) { calls.restore++; f.pp[key(10001)] = 35; },
      ailment(f) { calls.ailment++; f.ailments['害怕'] = c.round + 1; return true; }});
    assert.deepEqual(calls, {restore: 0, ailment: 0});
    assert.equal(dead.hp, 0);
    assert.equal(dead.pp[key(10001)], 1);
    assert.equal(target.pp[key(37258)], fifthPP);
    assert.equal(target.ailments['害怕'], undefined);
  });
  assert.equal(observed, true, 'component received a context from the actual native turn');
});

test('4763原生4/5全部实例的方向、真实弱化/强化禁止、六级边界与15%概率成功失败', () => {
  for (const id of [20167, 20168, 20169, 20170, 10393]) {
    const m = source.moves.find(m => m.id === id), x = m.effectInstances[0];
    const side = x.id === 4 ? 0 : 1, axis = axes[x.args[0]], outcomes = new Set();
    for (let i = 1; i <= (id === 10393 ? 96 : 1); i++) {
      const s = make({move: id, seed: Math.imul(i, 2654435761) >>> 0}), out = {};
      go(s, id, 20030, capture(out));
      outcomes.add((side ? out.targetStages : out.stages)[axis]);
    }
    assert.ok(outcomes.has(x.args[2]), m.name);
    assert.equal(outcomes.has(0), id === 10393, m.name);
    const blocked = make({move: id}), out = {};
    timer(blocked, side, x.args[2] > 0 ? '禁强化' : '免弱');
    go(blocked, id, 20030, capture(out));
    assert.equal((side ? out.targetStages : out.stages)[axis], 0);
    const capped = make({move: id}); capped.fighters[side].stages[axis] = x.args[2] > 0 ? 6 : -6;
    const end = {}; go(capped, id, 20030, capture(end));
    assert.equal((side ? end.targetStages : end.stages)[axis], x.args[2] > 0 ? 6 : -6);
  }
});

test('4763两条真实5%害怕可成功可失败，攻击免疫零红仍执行命中词条', () => {
  for (const id of [10392, 10397]) {
    const outcomes = new Set();
    for (let i = 1; i <= 128; i++) {
      const s = make({move: id, seed: Math.imul(i, 2654435761) >>> 0});
      timer(s, 1, '攻击伤害免疫'); go(s, id);
      assert.equal(sum(s), 0);
      outcomes.add(!!s.fighters[1].ailments['害怕']);
    }
    assert.deepEqual(outcomes, new Set([true, false]), String(id));
  }
});

test('4763真实10389二至三段只支付一次PP，10396严格低于半体才翻倍', () => {
  const counts = new Set();
  for (let i = 1; i <= 24; i++) {
    const s = make({move: 10389, seed: Math.imul(i, 2654435761) >>> 0}); go(s, 10389);
    counts.add(damage(s).length);
    assert.equal(s.fighters[0].pp[key(10389)], source.moves.find(m => m.id === 10389).pp - 1);
    assert.equal(s.fighters[0].soulState.skillUses[key(10389)], 1);
  }
  assert.deepEqual(counts, new Set([2, 3]));
  const low = make({move: 10396}), half = make({move: 10396});
  low.fighters[1].hp = 4499; half.fighters[1].hp = 4500;
  go(low, 10396); go(half, 10396);
  assert.ok(Math.abs(sum(low) - 2 * sum(half)) <= 2);
});

test('4763精确766失败不授且不污染已有异源上限，成功两轮1红而第三轮到期', () => {
  for (const mode of ['none', 'protected']) {
    const s = make({move: 37931});
    if (mode === 'protected') { s.fighters[1].stages.atk = 1; timer(s, 1, '强化保护'); }
    const prior = {start: 1, end: 9, amount: 17, perRoundAttackOutput: true};
    s.fighters[1].effects['攻击输出上限'] = structuredClone(prior);
    go(s, 37931, 10086);
    assert.deepEqual(s.fighters[1].effects['攻击输出上限'], prior);
    assert.equal(s.fighters[1].stages.atk, mode === 'protected' ? 1 : 0);
  }
  const s = make({move: 37931}); s.fighters[1].stages.atk = 1;
  go(s, 37931, 10086);
  assert.equal(sum(s, 'attack', 1), 1);
  assert.equal(s.fighters[1].stages.atk, 0);
  assert.equal(s.fighters[1].effects['攻击输出上限'].cloudScope798, true);
  go(s, 10001, 10086); assert.equal(sum(s, 'attack', 1), 1);
  go(s, 10001, 10086); assert.ok(sum(s, 'attack', 1) > 1);
});

test('4763与真实4450：1664自然捕获37931，36303合法额外第五同回合重现红1加本招红1，非注入学习技能', () => {
  const s = make({move: 37931, enemy: 4450});
  s.fighters[1].stages.atk = 1;
  assert.equal(s.fighters[1].soulState.futureParsedMove, undefined);
  assert.equal(s.fighters[1].moves.includes(key(37931)), false);
  assert.equal(s.fighters[1].pp[key(37931)], undefined);
  go(s, 37931, 36303);
  assert.equal(s.fighters[1].soulState.futureParsedMove.id, key(37931));
  assert.deepEqual(damage(s, 'attack', 1).map(e => e.settledDamage), [1, 1]);
  assert.equal(sum(s, 'attack', 1), 2, 'whole-round budget would incorrectly suppress the second independent attack');
  assert.equal(sum(s, 'fixed', 1), 300, 'replayed real837 is not capped as red');
  assert.equal(s.fighters[1].pp[key(36303)], 0);
  assert.equal(s.fighters[1].soulState.skillUses[key(36303)], 1);
  assert.equal(s.fighters[1].soulState.skillUses[key(37931)], undefined);
  assert.equal(s.fighters[1].soulState.replaySkillUses[key(37931)], 1);
  assert.equal(s.fighters[1].soulState.replayCurrentComponent, undefined);
  assert.equal(s.fighters[1].moves.includes(key(37931)), false);
  assert.ok(s.fighters.every(f => f.hp > 0));
});

test('4763整次预算对真实10389多段累计1，再现结束后原36303重置为1；保1实际损失0仍消费完整红预算', () => {
  for (const floor of [false, true]) {
    const s = make({ids: [10389, 37931, 10001, 20167, 37933], enemy: 4450});
    go(s, 10389, 28162);
    assert.equal(s.fighters[1].soulState.futureParsedMove.id, key(10389));
    s.fighters[1].stages.atk = 1;
    if (floor) { s.fighters[0].hp = 1; timer(s, 0, '致命保留', {hp: 1}); timer(s, 0, '技能禁疗'); }
    go(s, 37931, 36303);
    const red = damage(s, 'attack', 1);
    assert.ok([3, 4].includes(red.length), '2/3 replay segments and one real root attack');
    assert.equal(red.slice(0, -1).reduce((n, e) => n + e.settledDamage, 0), 1);
    assert.equal(red.at(-1).settledDamage, 1);
    assert.equal(sum(s, 'attack', 1), 2);
    if (floor) { assert.equal(s.fighters[0].hp, 1); assert.ok(red.every(e => e.hpLoss === 0)); }
    assert.equal(s.fighters[1].soulState.skillUses[key(10389)], undefined);
    assert.equal(s.fighters[1].pp[key(36303)], 0);
  }
});

test('4763整次上限在攻击最低伤害之后仍为1，固粉真载荷不被该红伤上限篡改', () => {
  const s = make({move: 37931}); s.fighters[1].stages.atk = 1;
  timer(s, 1, '攻击最低伤害', {amount: 500});
  go(s, 37931, 10086, (event, c) => {
    if (event === 'afterUse' && c.a.side === 1) for (const type of ['fixed', 'percent', 'true']) c.hurt(c.t, 40, 'public non-red cap discriminator', type);
  });
  assert.equal(sum(s, 'attack', 1), 1);
  for (const type of ['fixed', 'percent', 'true']) assert.equal(sum(s, type, 1), 40);
});

test('4763完整37931的837按实际使用次数300至500封顶，理论回复不受目标免疫/残血截断', () => {
  const s = make({move: 37931, hp: 1000});
  for (let i = 0; i < 7; i++) {
    s.fighters[0].hp = 1000;
    go(s, 37931);
    const n = Math.min(500, 300 + 50 * i);
    assert.equal(sum(s, 'fixed'), n);
    assert.equal(s.fighters[0].hp, 1000 + n);
  }
  for (const mode of ['immune', 'low', 'floor', 'heal-blocked']) {
    const q = make({move: 37931, hp: 1000});
    if (mode === 'immune') timer(q, 1, '固定百分比免疫');
    if (mode === 'low' || mode === 'floor') { q.fighters[1].hp = 1; timer(q, 1, '攻击伤害免疫'); }
    if (mode === 'floor') timer(q, 1, '致命保留', {hp: 1});
    if (mode === 'heal-blocked') timer(q, 0, '技能禁疗');
    go(q, 37931);
    assert.equal(sum(q, 'fixed'), mode === 'immune' ? 0 : 300);
    assert.equal(q.fighters[0].hp, mode === 'heal-blocked' ? 1000 : 1300);
    if (mode === 'low' || mode === 'floor') {
      assert.equal(q.fighters[1].hp, mode === 'floor' ? 1 : 0);
      assert.equal(damage(q, 'fixed')[0].hpLoss, mode === 'floor' ? 0 : 1);
    }
  }
});

test('4763整招无效仍累计837使用次数，控制/道具不累计；下一次实际吸取350不是300', () => {
  for (const mode of ['invalid', 'control', 'item']) {
    const s = make({move: 37931, hp: 1000});
    if (mode === 'invalid') s.fighters[0].counts.nextSkillInvalid = 1;
    if (mode === 'control') s.fighters[0].ailments['疲惫'] = 9;
    go(s, mode === 'item' ? null : 37931);
    assert.equal(sum(s, 'fixed'), 0);
    delete s.fighters[0].ailments['疲惫']; s.fighters[0].hp = 1000;
    go(s, 37931);
    assert.equal(sum(s, 'fixed'), mode === 'invalid' ? 350 : 300);
    assert.equal(s.fighters[0].hp, mode === 'invalid' ? 1350 : 1300);
  }
});

test('4763完整混沌斥力1238按真实4628混沌圣灵不翻倍，真实4450机械神秘全六项翻倍', () => {
  for (const enemy of [4628, 4450]) {
    const s = make({move: 29058, enemy}), out = {};
    go(s, 29058, enemy === 4450 ? 28162 : 20030, capture(out));
    for (const k of axes) assert.equal(out.stages[k], enemy === 4628 ? 1 : 2);
    assert.equal(sum(s, 'fixed'), 250);
    assert.equal(s.fighters[0].hp, 9000);
  }
});

test('4763完整1842在授予当次真实用招比较双方实际HP，严格低才400、相等/更高250，免疫仍按理论回复', () => {
  for (const hp of [2000, 3000, 4000]) {
    const s = make({move: 29058, hp}); s.fighters[1].hp = 3000;
    go(s, 29058);
    const n = hp < 3000 ? 400 : 250;
    assert.equal(sum(s, 'fixed'), n);
    assert.equal(s.fighters[0].hp, hp + n);
  }
  const s = make({move: 29058, hp: 1000}); timer(s, 1, '固定百分比免疫');
  go(s, 29058); assert.equal(sum(s, 'fixed'), 0); assert.equal(s.fighters[0].hp, 1400);
});

test('4763完整1842四轮实际使用含无效，但控制/道具不触发；843只增后两轮先制且真实到期', () => {
  const s = make({move: 29058, hp: 1000}); go(s, 29058);
  for (const mode of ['invalid', 'item', 'control']) {
    s.fighters[0].hp = 1000; s.fighters[1].hp = 9000;
    if (mode === 'invalid') s.fighters[0].counts.nextSkillInvalid = 1;
    if (mode === 'control') s.fighters[0].ailments['疲惫'] = 9;
    go(s, mode === 'item' ? null : 20167);
    assert.equal(sum(s, 'fixed'), mode === 'invalid' ? 400 : 0);
  }
  delete s.fighters[0].ailments['疲惫']; go(s, 20167); assert.equal(sum(s, 'fixed'), 0);
  const p = make({move: 29058}); go(p, 29058);
  for (let r = 2; r <= 4; r++) {
    go(p, 10001);
    assert.equal(p.fighters[0].soulState.resolvedPriority.value, r <= 3 ? 2 : 0);
  }
});

test('4763完整邪影纠缠1255真实70%成功和失败补粉、免异失败补粉与独立免粉', () => {
  const outcomes = new Set();
  for (let i = 1; i <= 48; i++) {
    const s = make({move: 29057, seed: Math.imul(i, 2654435761) >>> 0});
    go(s, 29057);
    const fear = !!s.fighters[1].ailments['害怕']; outcomes.add(fear);
    assert.equal(sum(s, 'percent'), fear ? 0 : 3000);
  }
  assert.deepEqual(outcomes, new Set([true, false]));
  for (const immunePink of [false, true]) {
    const s = make({move: 29057}); timer(s, 1, '免异常');
    if (immunePink) timer(s, 1, '固定百分比免疫');
    go(s, 29057); assert.equal(sum(s, 'percent'), immunePink ? 0 : 3000);
    assert.equal(s.fighters[1].ailments['害怕'], undefined);
  }
});

test('4763完整1255持续三轮含实际无效使用，控制和道具不触发，到期不补粉；48/47四轮分别失效', () => {
  for (const mode of ['invalid', 'control', 'item']) {
    const s = make({move: 29057}); timer(s, 1, '免异常'); go(s, 29057);
    if (mode === 'invalid') s.fighters[0].counts.nextSkillInvalid = 1;
    if (mode === 'control') s.fighters[0].ailments['疲惫'] = 9;
    go(s, mode === 'item' ? null : 20167);
    assert.equal(sum(s, 'percent'), mode === 'invalid' ? 3000 : 0);
    delete s.fighters[0].ailments['疲惫'];
    // Restore the target between rounds so three real 1/3-maxHP procs do not
    // end the battle before the expiry assertion; no operation is stripped.
    s.fighters[1].hp = s.fighters[1].stats.maxHp;
    go(s, 20167); assert.equal(sum(s, 'percent'), 3000);
    s.fighters[1].hp = s.fighters[1].stats.maxHp;
    go(s, 20167); assert.equal(sum(s, 'percent'), 0);
  }
  const s = make({move: 29057}); timer(s, 1, '免异常'); timer(s, 1, '固定百分比免疫'); go(s, 29057);
  for (let r = 2; r <= 5; r++) {
    go(s, 20167, 20030, (event, c) => {
      if (event === 'afterUse' && c.a.side === 1) { c.stage(c.t, -1, ['atk']); c.ailment(c.t, '烧伤', c.a, false, false, 2); }
    });
    assert.equal(s.fighters[0].stages.atk, r === 5 ? -1 : 0);
    assert.equal(!!s.fighters[0].ailments['烧伤'], r === 5);
  }
});

test('4763持续1255/1842所有者先被真实对手击败后不再触发用招载荷', () => {
  for (const id of [29057, 29058]) {
    const s = make({move: id}); timer(s, 1, '免异常'); go(s, id);
    s.fighters[0].hp = 1;
    s.fighters[0].stats.spe = 1; s.fighters[1].stats.spe = 9999;
    s.fighters[1].stats.atk = 9999;
    // Existing843 would otherwise legitimately give the owner priority2.
    // Its source state remains intact; the opponent receives a labelled public priority fixture.
    timer(s, 1, 'id984', {amount: 10});
    go(s, 20167, 10086);
    assert.equal(s.fighters[0].hp, 0);
    assert.equal(sum(s, 'fixed'), 0);
    assert.equal(sum(s, 'percent'), 0);
  }
});

test('4763完整37932仅1PP：先手1395必暴并884封敌当次技能，后手只封下一次而不误称当前未用', () => {
  for (const late of [false, true]) {
    const s = make({move: 37932});
    if (late) timer(s, 1, 'id984', {amount: 10});
    let crit;
    go(s, 37932, 20030, (event, c) => { if (event === 'afterAttack' && c.a.side === 0) crit = c.crit; });
    assert.equal(s.fighters[0].pp[key(37932)], 0);
    assert.equal(crit, !late, 'critical rolls disabled: only the real first-action1395 can force a crit');
    assert.equal(s.fighters[1].stages.spe, late ? 1 : 0);
    assert.equal(s.fighters[1].pp[key(20030)], 34);
    go(s, 10001, 20030);
    assert.equal(s.fighters[1].stages.spe, 1, 'first case now recovers; late case consumes its pending884');
  }
});

test('4763完整37932命中零红仍884封招；攻击封锁不误授884，1974真实恢复可再次使用1PP', () => {
  for (const seal of [false, true]) {
    const s = make({move: 37932}); timer(s, 1, '攻击伤害免疫');
    if (seal) timer(s, 0, 'attackBlock');
    go(s, 37932, 20030);
    assert.equal(sum(s), 0);
    assert.equal(s.fighters[0].pp[key(37932)], 0);
    assert.equal(s.fighters[1].stages.spe, seal ? 1 : 0);
  }
  const s = make({move: 37932}); go(s, 37932);
  assert.equal(E.availableMoves(s.fighters[0]).includes(key(37932)), false);
  s.fighters[1].ailments['中毒'] = 9;
  // A zero-PP move cannot be selected before roundStart. Select another real
  // move while native1974 restores37932, then use the now-available1PP move.
  go(s, 10001);
  assert.equal(s.fighters[0].pp[key(37932)], 1);
  assert.equal(E.availableMoves(s.fighters[0]).includes(key(37932)), true);
  go(s, 37932);
  assert.equal(s.fighters[0].pp[key(37932)], 0);
  assert.equal(s.fighters[0].soulState.skillUses[key(37932)], 2);
  assert.ok(sum(s) > 0);
});

test('4763完整第五1167真实解除负级才回满，负级保护和技能禁疗各自独立', () => {
  for (const mode of ['success', 'none', 'protected', 'heal-blocked']) {
    const s = make({move: 37933, hp: 1000});
    if (mode !== 'none') s.fighters[0].stages.def = -2;
    if (mode === 'protected') timer(s, 0, '弱化不可解除反转');
    if (mode === 'heal-blocked') timer(s, 0, '技能禁疗');
    go(s, 37933);
    assert.equal(s.fighters[0].hp, mode === 'success' ? 9000 : 1000);
    assert.equal(s.fighters[0].stages.def, mode === 'protected' ? -2 : 0);
  }
});

test('4763完整第五950成功消真实回合才赋两轮攻击MISS，必中优先独立、保护失败不误赋', () => {
  for (const mode of ['clear', 'protected', 'always-hit']) {
    const s = make({move: 37933});
    timer(s, 1, '固定增伤', {amount: 1});
    if (mode === 'protected') timer(s, 1, 'protect');
    if (mode === 'always-hit') timer(s, 1, '攻击必中', {}, 1, 99);
    // A protected必中 state cannot serve as a forced-MISS discriminator.
    // For clear/always-hit, source950 removes the ordinary fixture before optionally re-granting it.
    go(s, 37933, 10086, (event, c) => {
      if (mode === 'always-hit' && event === 'afterUse' && c.a.side === 0) c.timed(c.t, '攻击必中', 2, {});
    });
    assert.equal(!!s.fighters[1].effects['攻击必失'], mode !== 'protected');
    assert.equal(sum(s, 'attack', 1) > 0, mode !== 'clear');
    if (mode === 'clear') {
      go(s, 10001, 10086); assert.equal(sum(s, 'attack', 1), 0);
      go(s, 10001, 10086); assert.ok(sum(s, 'attack', 1) > 0);
    }
  }
});

test('4763完整第五899仅先手令本回合真实属性整招无效，后手不追溯已完成技能且次回恢复', () => {
  for (const late of [false, true]) {
    const s = make({move: 37933});
    if (late) timer(s, 1, 'id984', {amount: 10});
    go(s, 37933, 20521);
    assert.equal(s.fighters[1].stages.def, late ? 2 : 0);
    assert.equal(s.fighters[1].stages.spd, late ? 2 : 0);
    assert.equal(s.fighters[1].pp[key(20521)], 19);
    go(s, 10001, 20521);
    assert.equal(s.fighters[1].stages.def, late ? 4 : 2);
    assert.equal(s.fighters[1].stages.spd, late ? 4 : 2);
  }
});
