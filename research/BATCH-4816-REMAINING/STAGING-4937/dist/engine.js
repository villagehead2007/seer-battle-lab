(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BattleEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERSION = '0.17.0';
  const TYPES = typeof module === 'object' && module.exports ? require('../type-database.cjs') : globalThis.BattleTypeRules.create(globalThis.BattleTypeCatalog.data);
  const typeLibraryVersion = Object.freeze({...TYPES.data.version,stabRule:TYPES.data.rules.stab.id});
  function checkTypeVersion(version){if(version&&JSON.stringify(version)!==JSON.stringify(typeLibraryVersion))throw new Error('属性库版本不匹配，不能重算此对局');}
  const GEAR = typeof module === 'object' && module.exports ? require('./equipment.js') : globalThis.BattleEquipment;
  const CHARACTERISTICS = typeof module === 'object' && module.exports ? require('./characteristic-catalog.js') : globalThis.BattleCharacteristicCatalog;
  let MOVES = Object.freeze({
    thunder: { id: 'thunder', name: '雷神天明闪', type: '电', kind: 'physical', category: '物理', power: 160, accuracy: 100, alwaysHit: true, pp: 3, burst: .1, description: '必中；10% 概率造成 4 倍伤害。' },
    aurora: { id: 'aurora', name: '极光刃', type: '普通', kind: 'physical', category: '物理', power: 130, accuracy: 100, pp: 20, clearBoosts: true, description: '命中后消除对手能力提升状态。' },
    flash: { id: 'flash', name: '闪光击', type: '电', kind: 'physical', category: '物理', power: 60, accuracy: 100, pp: 35, priority: 1, description: '先制 +1，优先于普通技能行动。' },
    awaken: { id: 'awaken', name: '雷神觉醒', type: '属性', kind: 'status', category: '属性', power: 0, accuracy: 100, pp: 20, boosts: { atk: 2, spe: 2 }, description: '自身攻击、速度等级各提升 2 级。' },
    shatter: { id: 'shatter', name: '石破天惊', type: '战斗', kind: 'physical', category: '物理', power: 150, accuracy: 100, pp: 5, clearBoosts: true, description: '命中后消除对手能力提升状态。' },
    eclipse: { id: 'eclipse', name: '日月皆伤', type: '普通', kind: 'physical', category: '物理', power: 140, accuracy: 100, pp: 5, clearBoosts: true, description: '命中后消除对手能力提升状态。' },
    break: { id: 'break', name: '破元闪', type: '战斗', kind: 'physical', category: '物理', power: 60, accuracy: 100, pp: 25, priority: 1, description: '先制 +1，优先于普通技能行动。' },
    purify: { id: 'purify', name: '返璞归真', type: '属性', kind: 'status', category: '属性', power: 0, accuracy: 100, pp: 5, boosts: { atk: 2, acc: 2 }, description: '自身攻击、命中等级各提升 2 级。' },
    crunch: { id: 'crunch', name: '咬碎', type: '普通', kind: 'physical', category: '物理', power: 100, accuracy: 100, pp: 15, description: '15% 概率令对方防御降低 2 级。' },
    storm: { id: 'storm', name: '飞叶风暴', type: '草', kind: 'special', category: '特殊', power: 140, accuracy: 90, pp: 5, description: '命中后，自身特攻降低 1 级。' },
    absorb: { id: 'absorb', name: '超级吸取', type: '草', kind: 'special', category: '特殊', power: 60, accuracy: 100, pp: 10, description: '回复实际造成伤害的 1/2。' },
    heal: { id: 'heal', name: '光合作用', type: '普通', kind: 'status', category: '属性', power: 0, accuracy: 100, pp: 5, description: '回复最大体力的 1/2。' },
    'potion:hp': { id: 'potion:hp', name: '血药', kind: 'item', priority: 100, description: '消耗本回合行动，恢复当前出战精灵至多 250 点体力。' },
    'potion:pp': { id: 'potion:pp', name: 'PP 药', kind: 'item', priority: 100, description: '消耗本回合行动，恢复当前出战精灵全部技能 PP 至各自上限。' },
    struggle: { id: 'struggle', name: '挣扎', type: '普通', kind: 'physical', category: '物理', power: 50, accuracy: 100, pp: null, description: '所有 PP 耗尽时可用；反伤为最大体力的 1/4（测试规则）。' }
  });
  const LOADOUT = ['crunch', 'storm', 'absorb', 'heal'];
  const DEFAULT_STATS = Object.freeze({ maxHp: 331, atk: 254, def: 246, spa: 186, spd: 206, spe: 148 });
  const STAT_LABELS = { atk: '攻击', def: '防御', spa: '特攻', spd: '特防', spe: '速度' };
  const STAGE_LABELS = { ...STAT_LABELS, acc: '命中' };
  const SPECIES = {
    rey: { name: '雷伊', number: '070', type: '电', base: { maxHp: 71, atk: 108, def: 70, spa: 101, spd: 77, spe: 105 }, moves: ['thunder', 'aurora', 'flash', 'awaken'] },
    gaia: { name: '盖亚', number: '261', type: '战斗', base: { maxHp: 105, atk: 119, def: 87, spa: 96, spd: 78, spe: 105 }, moves: ['shatter', 'eclipse', 'break', 'purify'] },
    bubuhua: { name: '布布花', number: '003', type: '草', base: { maxHp: 95, atk: 109, def: 105, spa: 75, spd: 85, spe: 56 }, moves: LOADOUT }
  };
  const NATURES = Object.fromEntries([
    ['实干', null, null], ['认真', null, null], ['坦率', null, null], ['害羞', null, null], ['浮躁', null, null],
    ['孤独', 'atk', 'def'], ['固执', 'atk', 'spa'], ['调皮', 'atk', 'spd'], ['勇敢', 'atk', 'spe'],
    ['大胆', 'def', 'atk'], ['顽皮', 'def', 'spa'], ['无虑', 'def', 'spd'], ['悠闲', 'def', 'spe'],
    ['保守', 'spa', 'atk'], ['稳重', 'spa', 'def'], ['马虎', 'spa', 'spd'], ['冷静', 'spa', 'spe'],
    ['沉着', 'spd', 'atk'], ['温顺', 'spd', 'def'], ['慎重', 'spd', 'spa'], ['狂妄', 'spd', 'spe'],
    ['胆小', 'spe', 'atk'], ['急躁', 'spe', 'def'], ['开朗', 'spe', 'spa'], ['天真', 'spe', 'spd']
  ].map(([name, up, down]) => [name, { up, down }]));
  function integer(value, min, max, name) {
    if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name}必须是 ${min}–${max} 的整数。`);
  }
  function calculateStats(speciesId, input = {}) {
    if (!Object.hasOwn(SPECIES, speciesId)) throw new Error('未知精灵。');
    const build = { level: input.level ?? 100, iv: input.iv ?? 31, nature: input.nature ?? '实干', evs: {}, bonuses: {}, overrides: {} };
    integer(build.level, 1, 100, '等级'); integer(build.iv, 0, 31, '个体值');
    if (!Object.hasOwn(NATURES, build.nature)) throw new Error('请选择有效性格。');
    build.suit = input.suit ?? 'none';
    if (!Object.hasOwn(GEAR.SUITS, build.suit)) throw new Error('请选择有效套装。');
    build.resistance = GEAR.normalizeResistance(input.resistance);
    build.characteristic = CHARACTERISTICS.normalize(input.characteristic);
    if(input.inscriptions!==undefined&&(!Array.isArray(input.inscriptions)||input.inscriptions.length>3))throw new Error('刻印最多填写三组。');
    build.inscriptions=Array.from({length:3},(_,i)=>Object.fromEntries(Object.keys(DEFAULT_STATS).map(key=>{const value=input.inscriptions?.[i]?.[key]??0;integer(value,0,999,`刻印 ${i+1} ${key}`);return [key,value];})));
    const nature = NATURES[build.nature], calculated = {}, stats = {}, suitBonuses = {};
    for (const key of Object.keys(DEFAULT_STATS)) {
      const ev = input.evs?.[key] ?? 0, bonus = input.bonuses?.[key] ?? 0;
      integer(ev, 0, 255, '单项学习力'); integer(bonus, 0, 999, '额外加成');
      build.evs[key] = ev; build.bonuses[key] = bonus;
      const speedEv=SPECIES[speciesId].speedGrowthToHp&&key==='maxHp'?(input.evs?.spe??0):0;
      integer(speedEv,0,255,'速度学习力');
      const n = (SPECIES[speciesId].base[key] * 8 + build.iv * 4 + ev + speedEv) * build.level;
      // Keep EV fractions through nature multiplication; floor only the final result.
      const factor = nature.up === key ? 11 : nature.down === key ? 9 : 10;
      calculated[key] = (key === 'maxHp' ? Math.floor(n / 400) + build.level + 10 : Math.floor((n + 2000) * factor / 4000)) + bonus + build.inscriptions.reduce((sum,slot)=>sum+slot[key],0);
      if(SPECIES[speciesId].speedGrowthToHp&&key==='maxHp')calculated[key]+=build.inscriptions.reduce((sum,slot)=>sum+slot.spe,0);
      suitBonuses[key] = GEAR.suitBonus(build.suit, key, calculated[key]);
      calculated[key] += suitBonuses[key];
      if(key==='maxHp')calculated[key]=Math.floor(calculated[key]*(SPECIES[speciesId].maxHpMultiplier??1));
      const override = input.overrides?.[key];
      if (override !== undefined && override !== null && override !== '') { integer(override, 1, 9999, '直接数值'); build.overrides[key] = override; }
      stats[key] = build.overrides[key] ?? calculated[key];
    }
    const evTotal = Object.values(build.evs).reduce((a, b) => a + b, 0);
    if (evTotal > 510) throw new Error(`学习力合计 ${evTotal}，不能超过 510。`);
    return { build, calculated, stats, evTotal, suitBonuses };
  }
  const clone = x => JSON.parse(JSON.stringify(x));
  function seedNumber(seed) {
    let h = 2166136261;
    for (const c of String(seed)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function random(state) {
    state.rng = (state.rng + 0x6D2B79F5) >>> 0;
    let t = state.rng;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  function validateStats(stats) {
    for (const key of Object.keys(DEFAULT_STATS)) {
      if (!Number.isInteger(stats[key]) || stats[key] < 1 || stats[key] > 9999) throw new Error('能力值必须是 1–9999 的整数。');
    }
  }
  function createBattle(options = {}) {
    checkTypeVersion(options.typeLibraryVersion);
    const seed = String(options.seed ?? 'rey-gaia-001').trim();
    if (!seed || seed.length > 64) throw new Error('随机种子需为 1–64 个字符。');
    const species = options.species ?? ['rey', 'gaia'];
    if (!Array.isArray(species) || species.length !== 2) throw new Error('需要两只精灵。');
    const fighters = [0, 1].map(i => {
      const growth = calculateStats(species[i], { ...options.builds?.[i], overrides: { ...options.builds?.[i]?.overrides, ...options.stats?.[i] } });
      const stats = growth.stats, data = SPECIES[species[i]];
      validateStats(stats);
      return { side: i, species: species[i], name: data.name, number: data.number, type: data.type, level: growth.build.level, build: growth.build, stats, hp: stats.maxHp, moves: [...data.moves],
        stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0 }, pp: Object.fromEntries(data.moves.map(id => [id, api.MOVES[id].pp])) };
    });
    return { version: VERSION, typeLibraryVersion, seed, rng: seedNumber(seed), round: 1, winner: null, finished: false,
      criticals: options.criticals !== false, fighters, turns: [], initial: { typeLibraryVersion, seed, species: [...species], criticals: options.criticals !== false, builds: fighters.map(f => clone(f.build)) } };
  }
  function multiplier(stage) { return stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage); }
  function effective(f, stat) { return Math.max(1, Math.floor(f.stats[stat] * multiplier(f.stages[stat]))); }
  function availableMoves(f) { const usable=id=>!(f.soulId===1809&&f.soulState.collapsedSkills1809?.[id])&&(f.pp[id]>0||(id===f.moves[1]&&!!api?.SOULS?.trait(f,'secondSlotIgnorePP'))||([1809,1842].includes(f.soulId)&&!!api?.SOULS?.trait(f,'ignorePP')));return [...(f.moves.some(usable)?f.moves.filter(usable):['struggle']),'potion:hp','potion:pp']; }
  function resolveTurn(previous, choices) {
    checkTypeVersion(previous.typeLibraryVersion);
    if (previous.finished) throw new Error('本场对战已结束，请重新开局。');
    if (!Array.isArray(choices) || choices.length !== 2 || choices.some((id, i) => !availableMoves(previous.fighters[i]).includes(id))) throw new Error('请为双方选择有 PP 的技能。');
    const state = clone(previous);
    const events = [];
    const label = i => i === 0 ? 'A 方' : 'B 方';
    const emit = (text, kind = 'info', detail = '') => events.push({ text, kind, detail });
    const speeds = state.fighters.map(f => effective(f, 'spe'));
    const priorities = choices.map(id => MOVES[id].priority ?? 0);
    const first = priorities[0] !== priorities[1] ? (priorities[0] > priorities[1] ? 0 : 1) : speeds[0] === speeds[1] ? (random(state) < .5 ? 0 : 1) : (speeds[0] > speeds[1] ? 0 : 1);
    emit(priorities[0] !== priorities[1] ? `${label(first)} 技能先制更高，先手行动（先制 ${priorities[0]} / ${priorities[1]}）。` : speeds[0] === speeds[1] ? `双方速度均为 ${speeds[0]}，本回合随机由 ${label(first)} 先手。` : `${label(first)} 速度更高，先手行动（${speeds[0]} / ${speeds[1]}）。`);
    function stage(f, key, delta) {
      const before = f.stages[key];
      f.stages[key] = Math.max(-6, Math.min(6, before + delta));
      emit(`${label(f.side)} ${STAGE_LABELS[key]}等级 ${before > 0 ? '+' : ''}${before} → ${f.stages[key] > 0 ? '+' : ''}${f.stages[key]}。`, 'status');
    }
    function recover(f, amount) {
      const restored = Math.min(f.stats.maxHp - f.hp, amount);
      f.hp += restored;
      emit(`${label(f.side)} 回复 ${restored} 点体力${restored === 0 ? '（体力已满）' : ''}。`, 'heal');
    }
    function finish() {
      const dead = state.fighters.map(f => f.hp <= 0);
      if (!dead.some(Boolean)) return false;
      state.finished = true;
      state.winner = dead.every(Boolean) ? 'draw' : (dead[0] ? 1 : 0);
      emit(state.winner === 'draw' ? '双方同时倒下，本场平局。' : `${label(state.winner)} 获胜，对战结束。`, 'result');
      return true;
    }
    for (const side of [first, 1 - first]) {
      const actor = state.fighters[side], target = state.fighters[1 - side], move = MOVES[choices[side]];
      if (state.finished) break;
      if (move.kind === 'item') {
        emit(`${label(side)} 使用了${move.name}。`, 'move');
        if (move.id === 'potion:hp') recover(actor, 250);
        else { const restored = actor.moves.reduce((sum, id) => { const before = actor.pp[id]; actor.pp[id] = MOVES[id].pp; return sum + actor.pp[id] - before; }, 0); emit(`${label(side)} 全部技能 PP 恢复至上限，共恢复 ${restored} 点。`, 'heal'); }
        continue;
      }
      if (move.id !== 'struggle') actor.pp[move.id]--;
      emit(`${label(side)} 使用了${move.name}。`, 'move');
      const accuracy = Math.min(100, move.accuracy * multiplier(actor.stages.acc ?? 0));
      if (!move.alwaysHit && accuracy < 100 && random(state) * 100 >= accuracy) { emit('攻击未命中。', 'miss'); continue; }
      if (move.kind === 'status') {
        if (move.boosts) for (const [key, delta] of Object.entries(move.boosts)) stage(actor, key, delta);
        else if (move.id === 'heal') recover(actor, Math.max(1, Math.floor(actor.stats.maxHp / 2)));
        continue;
      }
      const atkKey = move.kind === 'physical' ? 'atk' : 'spa';
      const defKey = move.kind === 'physical' ? 'def' : 'spd';
      const attack = effective(actor, atkKey), defense = effective(target, defKey);
      const stab = TYPES.stab(move.type,actor.type);
      const affinity = TYPES.effectiveness(move.type,target.type);
      const critical = state.criticals && random(state) < 1 / 16;
      const burst = move.burst && random(state) < move.burst ? 4 : 1;
      const roll = 85 + Math.floor(random(state) * 16);
      const base = Math.floor(Math.floor((2 * actor.level / 5 + 2) * move.power * attack / defense) / 50) + 2;
      const calculated = affinity===0||move.power===0?0:Math.max(1, Math.floor(base * stab * affinity * (critical ? 2 : 1) * burst * roll / 100));
      const damage = Math.min(target.hp, calculated);
      target.hp -= damage;
      emit(`${label(1 - side)} 结算伤害 ${calculated}，损失 ${damage} 点体力${critical ? '，致命一击' : ''}${affinity < 1 ? '，效果减半' : ''}。`, 'damage',
        `等级 ${actor.level} · 威力 ${move.power} · ${STAT_LABELS[atkKey]} ${attack} / ${STAT_LABELS[defKey]} ${defense} · 基础 ${base} × 本系 ${stab} × 属性 ${affinity} × 暴击 ${critical ? 2 : 1} × 技能增伤 ${burst} × 浮动 ${roll}% = ${calculated}；实际扣除 ${damage}`);
      if (burst > 1) emit('雷神天明闪触发 4 倍伤害。', 'status');
      if (move.clearBoosts && target.hp > 0) {
        const positive = Object.keys(target.stages).filter(key => target.stages[key] > 0);
        for (const key of positive) target.stages[key] = 0;
        emit(positive.length ? `${label(target.side)} 的${positive.map(key => STAGE_LABELS[key]).join('、')}提升已清除。` : `${label(target.side)} 没有可清除的能力提升。`, 'status');
      }
      if (move.id === 'absorb') recover(actor, Math.floor(damage / 2));
      if (move.id === 'storm') stage(actor, 'spa', -1);
      if (move.id === 'crunch' && target.hp > 0 && random(state) < .15) stage(target, 'def', -2);
      if (move.id === 'struggle') { const recoil = Math.min(actor.hp, Math.max(1, Math.floor(actor.stats.maxHp / 4))); actor.hp -= recoil; emit(`${label(side)} 因挣扎反伤损失 ${recoil} 点体力。`, 'damage'); }
      finish();
    }
    state.turns.push({ round: state.round, choices: [...choices], first, events, remainingHp: state.fighters.map(f => f.hp) });
    state.round++;
    return state;
  }
  let api = { CHARACTERISTICS, TYPES, typeLibraryVersion, checkTypeVersion, GEAR, VERSION, MOVES, LOADOUT, DEFAULT_STATS, STAT_LABELS, STAGE_LABELS, SPECIES, NATURES, calculateStats, createBattle, resolveTurn, availableMoves, effective, multiplier };
  const attach = typeof module === 'object' && module.exports ? require('./souls.js') : globalThis.BattleSouls;
  if (attach) { api = attach(api); MOVES = api.MOVES; }
  api.WIKI=(typeof module==='object'&&module.exports?require('./wiki-support.js'):globalThis.WikiSupport)(api);
  return api;
});
