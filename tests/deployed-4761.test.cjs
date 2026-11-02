'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');
const C = require('../dist/characteristic-catalog.js');
const source = require('../research/BATCH-4676-NEXT50/4761/snapshot.json');
const enemy4628 = require('../research/4628-reviewed-snapshot.json');
const enemy4706 = require('../research/BATCH-4676-NEXT50/4706/snapshot.json');
const key = id => 'wiki:' + id;
const axes = ['atk', 'def', 'spa', 'spd', 'spe', 'acc'];
const defaults = [14102, 29055, 29056, 37929, 37930];
const policyNames = ['entryRepeat1972', 'entryResistance1972', 'enteredStatus1972', 'curseProbability1973', 'curseMinimum1973', 'once2305_4761', 'postCost2305_4761', 'extraNegative1856_4761', 'transfer2173_4761', 'crisisCount1972', 'lethal1972'];
function timer(s, side, name, data = {}, start = s.round, end = 99) {
  s.fighters[side].effects[name] = {start, end, ...data};
}
// Source snapshots, all original effect instances, and all compiled operations remain intact.
// Distinct4628 is an actual neutral opponent, with only its own soul disabled.
function make({ids = defaults, hp = 9000, enemy = 4628, characteristic = false, diagnostic = false, seed = 0} = {}) {
  const a = structuredClone(source), b = structuredClone(enemy === 4706 ? enemy4706 : enemy4628);
  a.selectedSoulId = 1972;
  if (enemy === 4706) b.selectedSoulId = 1901;
  else b.souls = [];
  const enemyIds = enemy === 4706
    ? [...b.moves.filter(m => !m.fifth).slice(0, 4).map(m => m.id), b.moves.find(m => m.fifth && !m.advanced).id]
    : [20030, 10086, 10392, 20521, 37258];
  assert.deepEqual(E.WIKI.assess(a, ids).issues, []);
  assert.deepEqual(E.WIKI.assess(b, enemyIds).issues, []);
  const stats = {maxHp: 9000, atk: 180, spa: 180, def: 300, spd: 300, spe: 500};
  const instant = C.get(21, 0);
  const options = {
    wikiSnapshots: [a, b], wikiLoadouts: [ids, enemyIds], criticals: false,
    builds: [{suit: 'none', overrides: stats}, {suit: 'none', overrides: {...stats, spe: 100}, ...(characteristic ? {characteristic: {groupId: 21, star: 0}} : {})}]
  };
  if (diagnostic) options.comparisonPetEffects1972 = [[], [{id: instant.id, hash: instant.hash}]];
  const s = E.createBattle(options);
  Object.assign(s.typeChart.aliases, structuredClone(a.typeChart.aliases), structuredClone(b.typeChart.aliases));
  s.rng = seed;
  s.fighters[0].hp = hp;
  for (const f of s.fighters) for (const name of ['攻击必中', '属性必中']) timer(s, f.side, name);
  assert.equal(s.fighters[0].soulId, 1972);
  assert.equal(s.fighters[1].soulId, enemy === 4706 ? 1901 : null);
  assert.equal(s.fighters[0].type, source.type);
  assert.equal(s.fighters[1].number, String(enemy));
  for (const f of s.fighters) for (const name of policyNames) assert.equal(Object.hasOwn(f.soulState, name), false, name);
  for (const [snapshot, loadout] of [[a, ids], [b, enemyIds]]) for (const id of loadout) {
    const m = snapshot.moves.find(m => m.id === id), ops = s.moveDefinitions[key(id)].operations;
    const expectedOps = E.WIKI.effectsEngine.compileInstances(m.effectInstances, snapshot.effects, m).operations;
    assert.deepEqual(ops.map(op => [op.effectId, op.index, op.phase, op.params]), expectedOps.map(op => [op.effectId, op.index, op.phase, op.params]), m.name + ':all original compiled phases');
    for (const [index, e] of m.effectInstances.entries()) assert.ok(ops.some(op => op.effectId === e.id && op.index === index), m.name + ':' + index);
    assert.equal(s.moveDefinitions[key(id)].revision, m.revision);
  }
  return s;
}
function go(s, a = 14102, b = 20030, observe = null) {
  const old = E.SOULS;
  if (observe) E.SOULS = {...old, run(event, c) { old.run(event, c); observe(event, c); }};
  try { return Object.assign(s, E.resolveTurn(s, [key(a), key(b)])); }
  finally { E.SOULS = old; }
}
const events = (s, type, side = 0) => (s.damageEvents ?? []).filter(e => e.round === s.round - 1 && e.sourceSide === side && e.targetSide === 1 - side && e.type === type);
const sum = (s, type = 'attack', side = 0) => events(s, type, side).reduce((n, e) => n + e.settledDamage, 0);
const captureUse = result => (event, c) => {
  if (event === 'afterUse' && c.a.side === 0) Object.assign(result, {hp: c.a.hp, targetHp: c.t.hp, pp: {...c.t.pp}, stages: {...c.t.stages}, ailments: {...c.t.ailments}, effects: structuredClone(c.t.effects)});
};
function settledEntry(s) { go(s); return s; }

test('4761原生1972全部16招与真实4628完整技能共存，不剥离实例不预设候选模型', () => {
  assert.equal(source.moves.length, 16);
  for (const m of source.moves) {
    const pool = [14102, 20142, 29055, 29056];
    const ids = m.fifth ? [...pool, m.id] : [m.id, ...pool.filter(id => id !== m.id).slice(0, 3), 37930];
    const s = make({ids}), used = {};
    go(s, m.id, 20030, captureUse(used));
    assert.equal(s.fighters[0].soulState.basePPCostThisUse.amount, 1, m.name);
    assert.ok(s.fighters[0].pp[key(m.id)] >= m.pp - 1 && s.fighters[0].pp[key(m.id)] <= m.pp, m.name);
    for (const f of s.fighters) assert.ok(f.hp >= 0 && f.hp <= f.stats.maxHp, m.name);
    if (m.kind !== 'status') assert.ok(sum(s) > 0, m.name + ':native RED');
    if (m.id === 37930) assert.equal(s.fighters[0].hp, 0);
    else assert.equal(s.fighters[0].soulState.dream1972.flower, 2);
    if (m.id === 20142) assert.equal(s.fighters[0].stages.spa, 2);
    if (m.id === 13578) {
      assert.equal(used.stages.spe, -1);
      assert.equal(s.fighters[1].stages.spe, 0, 'native4628/加速 adds1 after the verified weakness');
    }
    if (m.id === 37929) assert.ok(s.fighters[1].ailments['睡眠']);
    if (m.id === 29056) assert.ok(axes.every(k => s.fighters[0].stages[k] === 1));
  }
});

test('4761真正装备瞬杀初始危机2及R1花4；1901加瞬杀危机3花6，诊断同ID/hash不重复计数', () => {
  for (const enemy of [4628, 4706]) for (const diagnostic of [false, true]) {
    const s = make({enemy, characteristic: true, diagnostic, ids: [20142, 29055, 29056, 37929, 37930]});
    const expected = enemy === 4706 ? 3 : 2;
    assert.equal(s.fighters[1].build.characteristic.id, C.get(21, 0).id);
    assert.equal(s.fighters[0].soulState.dream1972.crisis, expected);
    const foeMove = enemy === 4706 ? enemy4706.moves.find(m => m.kind === 'status' && s.fighters[1].moves.includes(key(m.id))).id : 20030;
    go(s, 20142, foeMove);
    assert.equal(s.fighters[0].soulState.dream1972.flower, expected * 2);
  }
});

test('4761完整37929命中零红仍执行2303，不走2304；命中效果封锁既不执行2303也不冒充整招无效', () => {
  for (const mode of ['zero', 'sealed']) {
    const s = settledEntry(make()), out = {};
    timer(s, 1, '攻击伤害免疫'); timer(s, 1, '固定增伤', {amount: 1});
    if (mode === 'sealed') timer(s, 0, '技能命中效果失效');
    go(s, 37929, 20030, captureUse(out));
    assert.equal(sum(s), 0);
    assert.equal(s.randomStatusEvents?.length ?? 0, 0);
    assert.equal(out.effects['固定增伤'].amount, 1);
    assert.equal(out.hp, mode === 'zero' ? 6000 : 9000);
    assert.equal(!!out.ailments['睡眠'], mode === 'zero');
  }
});

test('4761完整37929真实MISS和整招无效进入2304，控制失败只刷新一次登场且封当轮属性', () => {
  for (const mode of ['miss', 'whole-invalid']) {
    const s = settledEntry(make({hp: 1000})); s.fighters[0].hp = 1000;
    timer(s, 1, '固定增伤', {amount: 1});
    s.fighters[0].soulState.dream1972.crisis = 2;
    s.fighters[1].counts.immune = 2;
    if (mode === 'miss') { delete s.fighters[0].effects['攻击必中']; timer(s, 0, '攻击必失'); }
    else s.fighters[0].counts.nextSkillInvalid = 1;
    const out = {}; go(s, 37929, 20030, captureUse(out));
    assert.equal(out.effects['固定增伤'], undefined);
    assert.equal(s.randomStatusEvents.length, 2);
    assert.ok(s.randomStatusEvents.every(e => E.STATUS_RULES.isControl(e.name)));
    assert.ok(out.effects.statusBlock);
    assert.equal(out.hp, 1000);
    assert.equal(s.fighters[0].hp, 4000);
    assert.equal(s.fighters[0].soulState.dream1972.crisis, 2);
    assert.equal(s.fighters[0].soulState.dream1972.flower, 6);
  }
});

test('4761完整29055反弹控制免疫阻止转移，非控制转移按原来源接收后解除并石化', () => {
  for (const status of ['睡眠', '中毒']) {
    const s = settledEntry(make());
    s.fighters[1].ailments[status] = s.round + 3;
    (s.fighters[1].statusState ??= {sources: {}}).sources[status] = 0;
    const beforePP = {...s.fighters[1].pp}, out = {};
    // This observes the unmodified full afterHit program immediately before2158 clears self.
    const wiki = E.WIKI, effects = wiki.effectsEngine, oldRun = effects.run;
    let transfer;
    const run = function(phase, ops, c) {
      if (phase === 'afterHit' && c.a.side === 0 && c.m.id === key(29055)) {
        const clear = c.clearAilments;
        c = {...c, clearAilments(f) { transfer = {name: f.ailments[status], source: f.statusState?.sources?.[status]}; return clear(f); }};
      }
      return oldRun.call(this, phase, ops, c);
    };
    E.WIKI = {...wiki, effectsEngine: {...effects, run}};
    try { go(s, 29055, 20030, captureUse(out)); } finally { E.WIKI = wiki; }
    assert.equal(s.fighters[0].effects['控制异常反弹'].end, 4);
    if (status === '中毒') {
      assert.ok(transfer.name >= s.round - 1);
      assert.equal(transfer.source, 0);
      assert.equal(s.fighters[0].ailments[status], undefined);
      assert.equal(s.fighters[1].ailments[status], undefined);
      assert.ok(out.ailments['石化']);
      assert.equal(Object.values(out.pp).filter(n => n === 0).length, 1);
    } else {
      assert.equal(transfer.name, undefined);
      assert.ok(s.fighters[1].ailments[status]);
      assert.equal(Object.values(out.pp).filter(n => n === 0).length, 0);
      assert.equal(out.ailments['石化'], undefined);
      assert.deepEqual(out.pp, beforePP);
    }
  }
});

test('4761完整29056负2按offset终+1，清双方回合后双方沉默且本次1785名义吸取，不假造场下回血', () => {
  const s = settledEntry(make()); s.fighters[0].hp = 1000; s.fighters[0].stages.def = -2;
  timer(s, 0, '固定增伤', {amount: 2}); timer(s, 1, '固定增伤', {amount: 3});
  timer(s, 1, '固定百分比免疫');
  const out = {}; go(s, 29056, 20030, captureUse(out));
  assert.ok(axes.every(k => s.fighters[0].stages[k] === 1));
  assert.equal(s.fighters[0].effects['固定增伤'], undefined);
  assert.equal(s.fighters[1].effects['固定增伤'], undefined);
  assert.ok(s.fighters[0].ailments['沉默']); assert.ok(s.fighters[1].ailments['沉默']);
  assert.equal(out.hp, 4000);
  assert.equal(s.fighters[0].hp, 2875, 'own native沉默 then removes maxHP/8 at round end');
  assert.deepEqual(events(s, 'percent').map(e => e.settledDamage), [3000, 1125], '1414 clears target immunity: current-use nominal drain3000, then separately target沉默 maxHP/8');
  assert.equal(sum(s, 'percent'), 4125);
  assert.equal(s.fighters[0].effects['琉梦实际用招吸取'].end, s.round + 2);
  assert.equal(s.fighters.length, 2);
  s.fighters[0].hp = 1000; timer(s, 1, '固定百分比免疫');
  const immuneUse = {}; go(s, 14102, 20030, captureUse(immuneUse));
  assert.equal(sum(s, 'percent'), 0);
  assert.equal(immuneUse.hp, 4000, 'later immune drain retains nominal heal');
  assert.equal(s.fighters[0].hp, 2875, 'unchanged own沉默 still deals its separate round-end damage');
});

test('4761完整37929满体直接耗三分一加睡眠，非满按理论三分一吸取及全PP减1', () => {
  for (const hp of [9000, 8999, 1000]) for (const immune of [false, true]) {
    const s = settledEntry(make()); s.fighters[0].hp = hp;
    if (immune) timer(s, 1, '固定百分比免疫');
    const before = {...s.fighters[1].pp}, out = {};
    go(s, 37929, 20030, captureUse(out));
    assert.equal(out.hp, hp === 9000 ? 6000 : Math.min(9000, hp + 3000));
    assert.equal(sum(s, 'percent'), hp === 9000 || immune ? 0 : 3000);
    assert.equal(!!out.ailments['睡眠'], hp === 9000);
    for (const k of s.fighters[1].moves) assert.equal(out.pp[k], Math.max(0, before[k] - (hp === 9000 ? 0 : 1)));
    assert.equal(s.randomStatusEvents?.length ?? 0, 0);
  }
});

test('4761完整第五直接自耗不触发2243且停止1756/805，原回合和强化不消除', () => {
  const s = settledEntry(make());
  s.fighters[0].soulState.rebirth2243 = {armed: true};
  timer(s, 1, '固定增伤', {amount: 1}); s.fighters[1].stages.def = 2;
  const out = {}; go(s, 37930, 20030, captureUse(out));
  assert.equal(s.fighters[0].hp, 0);
  assert.equal(s.fighters[0].soulState.rebirth2243.armed, true);
  assert.equal(s.fighters[0].soulState.dream1972.used2305, true);
  assert.equal(s.fighters[0].soulState.dream1972.crisis, 2);
  assert.equal(s.fighters[1].stages.def, 2);
  assert.ok(s.fighters[1].effects['固定增伤']);
  assert.equal(s.fighters[1].ailments['睡眠'], undefined);
  assert.equal(Object.values(s.fighters[1].pp).filter(n => n === 0).length, 0);
});

test('4761完整第五花毁后10层咒怨与1756/805共存，双方共享限次不靠研究开关', () => {
  const s = settledEntry(make());
  Object.assign(s.fighters[0].soulState.dream1972, {flower: null, destroyed: true});
  timer(s, 1, '固定增伤', {amount: 1}); s.fighters[1].stages.def = 2;
  const out = {}; go(s, 37930, 20030, captureUse(out));
  assert.equal(s.fighters[0].soulState.magicCurse1973, 10);
  assert.equal(out.effects['固定增伤'], undefined);
  assert.ok(out.ailments['睡眠']); assert.equal(out.stages.def, 0);
  assert.equal(Object.values(out.pp).filter(n => n === 0).length, 2);
  const available = s.fighters[1].moves.find(k => s.fighters[1].pp[k] > 0);
  assert.ok(available, '805 clears exactly two skills rather than fabricating unlimited PP');
  go(s, 37930, Number(available.slice(5)));
  assert.equal(s.fighters[0].soulState.magicCurse1973, 10);
  // Shared resource proof uses two genuine4761s, not an invented skill on4628.
  const snapshots = [structuredClone(source), structuredClone(source)];
  snapshots.forEach(x => { x.selectedSoulId = 1972; });
  const stats = {maxHp: 9000, atk: 180, spa: 180, def: 300, spd: 300, spe: 500};
  const shared = E.createBattle({wikiSnapshots: snapshots, wikiLoadouts: [defaults, defaults], criticals: false,
    builds: [{suit: 'none', overrides: stats}, {suit: 'none', overrides: {...stats, spe: 100}}]});
  for (const f of shared.fighters) {
    Object.assign(f.soulState.dream1972, {flower: null, destroyed: true});
    timer(shared, f.side, '攻击必中');
  }
  // Counts immunity survives1756's clear and prevents sleep from stopping side1's real fifth use.
  shared.fighters[1].counts.immune = 1;
  go(shared, 37930, 37930);
  for (const f of shared.fighters) {
    assert.equal(f.soulState.skillUses[key(37930)], 1);
    assert.equal(f.soulState.basePPCostThisUse.amount, 1);
    assert.equal(f.pp[key(37930)], 9);
  }
  assert.equal(shared.fighters[1].counts.immune, 0);
  assert.equal(shared.fighters[1].ailments['睡眠'], undefined);
  assert.equal(shared.fighters[0].soulState.magicCurse1973, 10);
  assert.equal(shared.fighters[1].soulState.magicCurse1973 ?? 0, 0);
  assert.equal(shared.fighters[0].soulState.dream1972.used2305, true);
  assert.equal(shared.fighters[1].soulState.dream1972.used2305, undefined);
});

test('4761真实装备瞬杀攻击触发的真KO摧花清PP，2243立即拦截则非KO保留花与原状态', () => {
  for (const rebirth of [false, true]) {
    let found = null;
    for (let seed = 1; seed <= 128; seed++) {
      const s = settledEntry(make({characteristic: true}));
      s.fighters[0].hp = 8500;
      s.fighters[0].stages.def = -1;
      timer(s, 0, '原有回合标记');
      if (rebirth) s.fighters[0].soulState.rebirth2243 = {armed: true};
      s.rng = Math.imul(seed, 2654435761) >>> 0;
      go(s, 14102, 10086);
      const a = s.fighters[0];
      if (rebirth ? a.soulState.rebirth2243.armed === false : a.soulState.dream1972.destroyed) { found = s; break; }
    }
    assert.ok(found, 'bounded actual battle RNG must activate equipped instant');
    const [a, b] = found.fighters;
    assert.equal(a.soulState.dream1972.destroyed, !rebirth);
    if (rebirth) {
      assert.equal(a.hp, 9000); assert.equal(a.stages.def, -1);
      assert.ok(a.effects['原有回合标记']); assert.equal(a.soulState.deathResolved, undefined);
      assert.equal(a.soulState.dream1972.flower, 8);
      for (const id of a.moves) assert.equal(a.pp[id], found.moveDefinitions[id].pp);
      assert.ok(Object.values(b.pp).some(n => n > 0));
    } else {
      assert.equal(a.hp, 0); assert.ok(Object.values(b.pp).every(n => n === 0));
    }
  }
});
