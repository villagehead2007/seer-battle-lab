'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');
const source = structuredClone(require('../research/BATCH-4676-NEXT50/4755/snapshot.json'));
const other4628 = require('../research/4628-reviewed-snapshot.json');
const other4752 = require('../research/BATCH-4676-NEXT50/4752/snapshot.json');
source.selectedSoulId = 1963;
const axes = ['atk', 'def', 'spa', 'spd', 'spe', 'acc'];
const key = id => 'wiki:' + id;
const move = id => source.moves.find(m => m.id === id);
const defaultIds = [37897, 29037, 29038, 37898, 37899];

// Both real snapshots retain every original skill instance and operation.
// Only the opponent soul is disabled; builds and accuracy are transient battle fixtures.
function make({ids = defaultIds, hp = 9000, enemy = 4628, enemyAtk = 180} = {}) {
  const a = structuredClone(source);
  const b = structuredClone(enemy === 4752 ? other4752 : other4628);
  b.souls = [];
  const enemyIds = enemy === 4752
    ? [10802, ...b.moves.filter(m => !m.fifth && m.id !== 10802).slice(0, 3).map(m => m.id), b.moves.find(m => m.fifth).id]
    : [20030, 10086, 10392, 20521, 37258];
  assert.deepEqual(E.WIKI.assess(a, ids).issues, []);
  assert.deepEqual(E.WIKI.assess(b, enemyIds).issues, []);
  const stats = {maxHp: 9000, atk: 180, spa: 180, def: 300, spd: 300, spe: 500};
  const s = E.createBattle({
    wikiSnapshots: [a, b], wikiLoadouts: [ids, enemyIds], criticals: false,
    builds: [{suit: 'none', overrides: stats}, {suit: 'none', overrides: {...stats, spe: 100, atk: enemyAtk}}]
  });
  s.rng = 0;
  s.fighters[0].hp = hp;
  for (const f of s.fighters) for (const name of ['攻击必中', '属性必中']) timer(s, f.side, name);
  assert.equal(s.fighters[0].soulId, 1963);
  assert.equal(s.fighters[1].soulId, null);
  assert.equal(s.fighters[0].type, source.type);
  assert.equal(s.fighters[1].number, String(enemy));
  for (const f of s.fighters) for (const name of ['lethal1963', 'rounding1963', 'zeroCrit4755']) {
    assert.equal(Object.hasOwn(f.soulState, name), false);
  }
  for (const id of ids) {
    const ops = s.moveDefinitions[key(id)].operations;
    for (const [index, instance] of move(id).effectInstances.entries()) {
      assert.ok(ops.some(op => op.effectId === instance.id && op.index === index), id + ':' + index);
    }
  }
  return s;
}
function timer(s, side, name, data = {}, start = s.round, end = 99) {
  s.fighters[side].effects[name] = {start, end, ...data};
}
function go(s, a, b = 20030, observe = null) {
  const old = E.SOULS;
  if (observe) E.SOULS = {...old, run(event, c) { old.run(event, c); observe(event, c); }};
  try { return Object.assign(s, E.resolveTurn(s, [key(a), key(b)])); }
  finally { E.SOULS = old; }
}
const events = (s, type, side = 0) => (s.damageEvents ?? []).filter(e =>
  e.round === s.round - 1 && e.sourceSide === side && e.targetSide === 1 - side && e.type === type);
const sum = (s, type = 'attack', side = 0) => events(s, type, side).reduce((n, e) => n + e.settledDamage, 0);
const afterActorUse = target => (event, c) => {
  if (event === 'afterUse' && c.a.side === 0) Object.assign(target, {hp: c.a.hp, targetHp: c.t.hp});
};

 test('4755原生1963全部20招完整实例和真实4628技能共存，无候选默认且PP/红伤/等级/半体代价真实结算', () => {
  assert.equal(source.moves.length, 20);
  for (const m of source.moves) {
    const pool = [10157, 20125, 29037, 29038];
    const ids = m.fifth ? [...pool, m.id] : [m.id, ...pool.filter(id => id !== m.id).slice(0, 3), 37899];
    const s = make({ids});
    let crit;
    go(s, m.id, 20030, (event, c) => { if (event === 'afterAttack' && c.a.side === 0) crit = c.crit; });
    const [a, t] = s.fighters;
    assert.equal(a.pp[key(m.id)], m.pp - 1, m.name);
    assert.equal(a.soulState.basePPCostThisUse.amount, 1, m.name);
    const feared = t.ailments['害怕'] >= 1, cursed = t.ailments['诅咒'] >= 1;
    if (feared) assert.ok(m.effectInstances.some(e => e.id === 15), m.name);
    if (cursed) { assert.equal(m.id, 37897); assert.ok(m.effectInstances.some(e => e.id === 2095)); assert.equal(a.hp, 9000); }
    if (feared || cursed) assert.equal(t.stages.spe, 0, m.name + ':native control prevents 加速');
    assert.equal(t.pp[key(20030)], other4628.moves.find(x => x.id === 20030).pp - (feared || cursed ? 0 : 1) - (m.id === 37898 ? 2 : 0), m.name);
    assert.ok(a.hp > 0 && a.hp <= 9000 && t.hp > 0 && t.hp <= 9000, m.name);
    if (m.kind !== 'status') assert.ok(sum(s) > 0, m.name);
    if (m.id === 20125) assert.equal(t.stages.spa, -1);
    if (m.id === 20008) assert.deepEqual([a.stages.atk, a.stages.def, a.stages.spe], [1, 1, -1]);
    if (m.id === 20093) assert.equal(a.stages.spd, 2);
    if (m.id === 20088) assert.equal(a.stages.atk, 2);
    if (m.id === 20126) assert.equal(t.stages.acc, -1);
    if (m.id === 10280) assert.equal(a.stages.atk, -1);
    if (m.id === 29037) {
      assert.equal(a.hp, 4500);
      assert.equal(sum(s, 'fixed'), 250);
      assert.equal(t.hp, 8750);
      assert.deepEqual([a.stages.atk, a.stages.spe], [2, 2]);
    }
    if (m.id === 29038) {
      assert.ok(axes.every(k => a.stages[k] === 2));
      assert.equal(sum(s, 'percent'), 3000);
      assert.equal(t.hp, 6000);
    }
    if (m.id === 37898) {
      assert.equal(crit, false);
      assert.equal(Object.values(a.stages).filter(n => n === 2).length, 3);
      assert.equal(t.effects.statusBlock, undefined);
    }
    if (m.id === 37899) {
      assert.equal(crit, false);
      assert.ok(axes.every(k => a.stages[k] === 1));
      assert.ok(sum(s, 'fixed') >= 200 && sum(s, 'fixed') <= 400);
      assert.equal(sum(s, 'percent'), 0);
    }
  }
});

test('4755原生29037的191反弹、1018红伤免返、137直扣半体与1963战阶追加同时有效', () => {
  let s, before, after;
  // Native4628/10392 has the real5% fear clause. Search battle seeds, not a fabricated status primitive.
  for (let seed = 0; seed < 128; seed++) {
    s = make();
    s.rng = Math.imul(seed + 1, 2654435761) >>> 0;
    s.fighters[0].counts.immune = 1;
    go(s, 29037, 10392, (event, c) => {
      if (event === 'beforeUse' && c.a.side === 1) before = c.t.hp;
      if (event === 'afterUse' && c.a.side === 1) after = c.t.hp;
    });
    if (s.fighters[1].ailments['害怕']) break;
  }
  assert.ok(s.fighters[1].ailments['害怕'], 'nativefear must actually reflect within bounded seeds');
  assert.equal(s.fighters[0].ailments['害怕'], undefined);
  const a = s.fighters[0], counter = sum(s, 'fixed') - a.soulState.phase1963.amount;
  assert.equal(before, 4500);
  assert.equal(after, 4500);
  assert.equal(a.hp, 4500);
  assert.equal(sum(s, 'attack', 1), 0);
  assert.ok(counter > 0 && counter < 1000);
  assert.equal(a.effects.reflect.end, 4);
  assert.equal(a.effects['低伤免疫返还'].end, 3);
  assert.equal(a.effects['低伤免疫返还'].redOnly4755, true);
  assert.equal(a.soulState.phase1963.amount, 250);
  assert.equal(a.counts.immune, 1);
  const losses = s.healthLossEvents.filter(e => e.targetSide === 0 && e.type === 'direct');
  assert.equal(losses.length, 1);
  assert.equal(losses[0].hpLoss, 4500);
});

test('4755原生1836在正常半血吸取与低于半血只附双倍粉伤后，1963再按实际缺血追加并魂印回满', () => {
  for (const hp of [4500, 4499]) {
    const s = make({hp}), used = {};
    go(s, 29038, 20030, afterActorUse(used));
    assert.equal(used.hp, hp === 4500 ? 7500 : 4499);
    assert.equal(used.targetHp, hp === 4500 ? 6000 : 3000);
    assert.equal(sum(s, 'percent'), hp === 4500 ? 3000 : 6000);
    assert.equal(sum(s, 'fixed'), hp === 4500 ? 83 : 250);
    assert.equal(s.fighters[0].soulState.phase1963.lost, hp === 4500 ? 1500 : 4501);
    assert.equal(s.fighters[1].hp, hp === 4500 ? 5917 : 2750);
    assert.equal(s.fighters[0].hp, 9000);
    assert.ok(axes.every(k => s.fighters[0].stages[k] === 1));
    assert.equal(s.fighters[0].effects['梦魇实际用招吸取改粉'].end, 4);
    assert.equal(s.fighters[0].effects.id984.start, 2);
    assert.equal(s.fighters[0].effects.id984.end, 3);
  }
});

test('4755原生37897先真实消强技能回血再读满血2095；禁疗/强化保护/没有正级不伪造成功，免异走下两轮先制负1', () => {
  for (const mode of ['success', 'heal-ban', 'boost-protect', 'no-boost', 'curse-immune']) {
    const s = make({hp: 1000}), used = {};
    if (mode !== 'no-boost') s.fighters[1].stages.def = 2;
    if (mode === 'heal-ban') timer(s, 0, '技能禁疗');
    if (mode === 'boost-protect') timer(s, 1, '强化保护');
    if (mode === 'curse-immune') timer(s, 1, '免异常');
    go(s, 37897, 20030, afterActorUse(used));
    const success = ['success', 'curse-immune'].includes(mode), [a, t] = s.fighters;
    assert.equal(used.hp, success ? 9000 : 1000, mode);
    assert.equal(t.stages.def, mode === 'boost-protect' ? 2 : 0, mode);
    if (success) {
      assert.equal(a.soulState.phase1963.amount, 0);
      assert.ok(t.ailments['诅咒'] || t.effects.id984, mode);
      if (mode === 'curse-immune') {
        assert.equal(t.ailments['诅咒'], undefined);
        assert.deepEqual([t.effects.id984.start, t.effects.id984.end, t.effects.id984.amount], [2, 3, -1]);
      }
    } else {
      assert.equal(t.ailments['诅咒'], undefined, mode);
      assert.equal(t.effects.id984, undefined, mode);
      assert.equal(a.soulState.phase1963.amount, 444);
      assert.equal(a.hp, 1000);
    }
    assert.equal(a.pp[key(37897)], 19);
  }
});

test('4755原生37898三项强化不回溯本招暴击，下一招1963强制暴击与1483两轮封属并逐招全PP减2', () => {
  const s = make(), initialPP = {...s.fighters[1].pp}, crits = [];
  const observe = (event, c) => { if (event === 'afterAttack' && c.a.side === 0) crits.push(c.crit); };
  go(s, 37898, 20030, observe);
  assert.deepEqual(crits, [false]);
  assert.equal(s.fighters[1].effects.statusBlock, undefined);
  assert.equal(Object.values(s.fighters[0].stages).filter(n => n === 2).length, 3);
  go(s, 37898, 20030, observe);
  assert.deepEqual(crits, [false, true]);
  assert.deepEqual([s.fighters[1].effects.statusBlock.start, s.fighters[1].effects.statusBlock.end], [2, 3]);
  assert.equal(s.fighters[0].pp[key(37898)], 3);
  for (const id of s.fighters[1].moves) assert.equal(s.fighters[1].pp[id], initialPP[id] - 4 - (id === key(20030) ? 2 : 0));
  assert.equal(s.fighters[1].stages.spe, 1);
});

test('4755原生37899先清回合全1但当次仍非暴击，下一次真正暴击才转300至400理论吸取，840不对当前对手提前吸取', () => {
  const s = make({hp: 1000}), crits = [];
  const observe = (event, c) => { if (event === 'afterAttack' && c.a.side === 0) crits.push(c.crit); };
  go(s, 37899, 20030, observe);
  assert.deepEqual(crits, [false]);
  assert.ok(axes.every(k => s.fighters[0].stages[k] === 1));
  assert.equal(s.fighters[0].hp, 1000);
  const firstFixed = sum(s, 'fixed') - s.fighters[0].soulState.phase1963.amount;
  assert.ok(firstFixed >= 200 && firstFixed <= 400);
  assert.equal(s.fighters[1].hp, 9000 - sum(s) - sum(s, 'fixed'));
  const targetBefore = s.fighters[1].hp, used = {};
  go(s, 37899, 20030, (event, c) => { observe(event, c); afterActorUse(used)(event, c); });
  assert.deepEqual(crits, [false, true]);
  const drain = used.hp - 1000;
  assert.ok(drain >= 300 && drain <= 400);
  assert.equal(sum(s, 'fixed'), drain + s.fighters[0].soulState.phase1963.amount);
  assert.equal(s.fighters[1].hp, targetBefore - sum(s) - sum(s, 'fixed'));
  assert.equal(sum(s, 'percent'), 0);
  assert.equal(s.fighters[0].pp[key(37899)], 3);
});

test('4755原生完整第五红伤立即2243重生非KO，后续1659固定或吸取照常执行而840不误认下只出战', () => {
  for (const critical of [false, true]) {
    const s = make({hp: 1000}), used = {};
    s.fighters[1].hp = 1;
    Object.assign(s.fighters[1].soulState, {rebirth2243: {armed: true}, rebirthMode2243: 'immediate-full'});
    if (critical) s.fighters[0].stages.def = 1;
    go(s, 37899, 20030, afterActorUse(used));
    const red = events(s, 'attack')[0], phase = s.fighters[0].soulState.phase1963.amount;
    const extra = sum(s, 'fixed') - phase;
    assert.ok(red.settledDamage > 1);
    assert.equal(red.hpLoss, 1);
    assert.ok(extra >= (critical ? 300 : 200) && extra <= 400);
    assert.equal(used.hp, critical ? 1000 + extra : 1000);
    assert.equal(s.fighters[0].hp, used.hp);
    assert.equal(s.fighters[1].hp, 9000 - extra - phase);
    assert.notEqual(s.fighters[1].soulState.deathResolved, true);
    assert.equal(sum(s, 'percent'), 0);
    assert.equal(s.finished, false);
  }
});

test('4755原生真实命中暴击红0仍授1483和1659；当前命中载荷封锁与整招无效不是零伤命中效果', () => {
  for (const id of [37898, 37899]) for (const mode of ['hit-zero', 'hit-sealed', 'whole-invalid']) {
    const s = make({hp: id === 37899 ? 1000 : 9000}), used = {};
    s.fighters[0].stages.def = 1;
    timer(s, 1, '攻击伤害免疫');
    timer(s, 1, '固定百分比免疫');
    timer(s, 1, 'protect'); // Full959 must not clear the immunity fixture before1659.
    if (mode === 'hit-sealed') timer(s, 0, '技能命中效果失效');
    if (mode === 'whole-invalid') s.fighters[0].counts.nextSkillInvalid = 1;
    go(s, id, 20030, afterActorUse(used));
    assert.equal(sum(s), 0, id + ':' + mode);
    assert.equal(sum(s, 'fixed'), 0);
    if (id === 37898) assert.equal(!!s.fighters[1].effects.statusBlock, mode === 'hit-zero');
    else if (mode === 'hit-zero') assert.ok(used.hp >= 1300 && used.hp <= 1400);
    else assert.equal(used.hp, 1000);
    assert.equal(s.fighters[0].pp[key(id)], 4);
  }
});

test('4755原生1018按真实4752双鳍连打10802两段整招阈值判定，整招达千不免、低于千只反一次完整整招固定', () => {
  const raw = other4752.moves.find(m => m.id === 10802);
  assert.equal(raw.hash, '54c21cf9');
  assert.deepEqual(raw.effectInstances, [{id: 31, args: [2, 2], description: '1回合做2次攻击'}]);
  const samples = [];
  for (const enemyAtk of [180, 500, 1000, 2000, 4000, 6000, 8000, 9999]) {
    const s = make({enemy: 4752, enemyAtk});
    go(s, 29037, 10802, (event, c) => {
      // Remove the granted timed defense only in the baseline, after137 consumed halfHP.
      if (event === 'beforeUse' && c.a.side === 1) {
        assert.equal(c.t.hp, 4500);
        assert.ok(c.on(c.t, '低伤免疫返还'));
        c.clear(c.t);
      }
    });
    const hits = events(s, 'attack', 1);
    assert.equal(hits.length, 2);
    samples.push({enemyAtk, s, total: sum(s, 'attack', 1), hits});
  }
  const below = samples.find(x => x.total > 0 && x.total < 1000);
  const above = samples.find(x => x.total > 1000 && x.hits.every(e => e.settledDamage < 1000));
  assert.ok(below, 'bounded realAtk search must include a below-threshold attack');
  assert.ok(above, 'bounded realAtk search must include two individually-small segments whose total exceeds1000');
  for (const baseline of [below, above]) {
    const s = make({enemy: 4752, enemyAtk: baseline.enemyAtk});
    go(s, 29037, 10802);
    const low = baseline === below, phase = s.fighters[0].soulState.phase1963.amount;
    assert.equal(sum(s, 'attack', 1), low ? 0 : baseline.total);
    assert.equal(s.fighters[0].hp, low ? 4500 : baseline.s.fighters[0].hp);
    assert.equal(sum(s, 'fixed'), phase + (low ? baseline.total : 0));
    assert.equal(events(s, 'fixed').length, low ? 2 : 1); // One counter, plus the separate1963 phase payload.
    assert.equal(s.fighters[1].hp, 9000 - sum(s, 'fixed'));
    if (low) assert.equal(phase, 250);
    else assert.equal(phase, baseline.s.fighters[0].soulState.phase1963.amount);
    assert.equal(s.fighters[1].pp[key(10802)], raw.pp - 1);
    assert.equal(s.fighters[0].pp[key(29037)], 4);
  }
});
