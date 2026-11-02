const { test } = require('node:test');
const assert = require('node:assert/strict');
const E = require('../dist/engine.js');

test('旧版雷伊与盖亚的种族、面板和配招独立', () => {
  const s = E.createBattle({species:['rey','gaia']});
  assert.deepEqual(s.fighters.map(f => f.name), ['雷伊', '盖亚']);
  assert.deepEqual(s.fighters[0].stats, { maxHp:283, atk:252, def:176, spa:238, spd:190, spe:246 });
  assert.deepEqual(s.fighters[1].stats, { maxHp:351, atk:274, def:210, spa:228, spd:192, spe:246 });
  assert.throws(() => E.resolveTurn(s, ['shatter','thunder']));
});
test('等级和共用个体值影响六项能力', () => {
  assert.deepEqual(E.calculateStats('rey',{level:50}).stats, { maxHp:146, atk:128, def:90, spa:121, spd:97, spe:125 });
  assert.deepEqual(E.calculateStats('rey',{iv:0}).stats, { maxHp:252, atk:221, def:145, spa:207, spd:159, spe:215 });
  assert.equal(E.calculateStats('rey',{level:1,iv:0}).stats.maxHp,12);
});
test('性格对应 +10% 与 -10%，不改变体力；共25种性格', () => {
  assert.equal(Object.keys(E.NATURES).length,25);
  const base = E.calculateStats('rey').stats;
  for (const [nature,change] of Object.entries(E.NATURES)) {
    const actual=E.calculateStats('rey',{nature}).stats;
    assert.equal(actual.maxHp,283);
    for(const key of Object.keys(E.STAT_LABELS)) assert.equal(actual[key],Math.floor(base[key]*(change.up===key?11:change.down===key?9:10)/10));
  }
});
test('255学习力的小数保留至性格修正后取整，额外加成不乘性格', () => {
  const g=E.calculateStats('gaia',{nature:'大胆',evs:{def:255},bonuses:{def:10,maxHp:20}});
  assert.equal(g.stats.def,311); // (174+31+63.75+5)*1.1=301.125, then +10
  assert.equal(g.stats.maxHp,371);
});
test('攻速学习力与开朗性格的已知雷伊算例', () => {
  const g=E.calculateStats('rey',{nature:'开朗',evs:{atk:255,spe:255}});
  assert.equal(g.stats.atk,315); assert.equal(g.stats.spe,340); assert.equal(g.stats.spa,214); assert.equal(g.evTotal,510);
});
test('学习力总量、单项、等级、个体、性格和额外加成均校验', () => {
  for (const bad of [{level:0},{level:101},{level:1.5},{iv:-1},{iv:32},{nature:'未知'},{evs:{atk:256}},{evs:{atk:255,spe:255,maxHp:1}},{evs:{atk:1.5}},{bonuses:{maxHp:-1}},{bonuses:{def:1000}},{overrides:{atk:0}}]) assert.throws(()=>E.calculateStats('rey',bad));
  assert.throws(()=>E.calculateStats('constructor'));
});
test('覆盖只改变填写的项目，清空恢复养成值', () => {
  const g=E.calculateStats('rey',{level:50,overrides:{maxHp:999,atk:'',spe:333}});
  assert.equal(g.stats.maxHp,999); assert.equal(g.stats.atk,128); assert.equal(g.stats.spe,333); assert.equal(g.calculated.maxHp,146);
  assert.equal(E.calculateStats('rey',{...g.build,overrides:{}}).stats.spe,125);
});
test('重开保留养成参数、直接覆盖和等级，恢复HP与PP', () => {
  const s=E.createBattle({species:['rey','gaia'],builds:[{level:50,nature:'固执',evs:{atk:255},bonuses:{maxHp:20},overrides:{spe:888}},{iv:0}]});
  const played=E.resolveTurn(s,['awaken','purify']);
  const reset=E.createBattle(played.initial);
  assert.deepEqual(reset,s);
});
test('技能先制优先于速度，同先制才比较速度', () => {
  const s=E.createBattle({species:['rey','gaia'],criticals:false,stats:[{spe:1,maxHp:9999},{spe:999,maxHp:9999}]});
  assert.equal(E.resolveTurn(s,['flash','shatter']).turns[0].first,0);
  assert.equal(E.resolveTurn(s,['flash','break']).turns[0].first,1);
});
test('强化技能改变对应能力且不回复体力', () => {
  const s=E.createBattle({species:['rey','gaia']});s.fighters[0].hp=100;
  const out=E.resolveTurn(s,['awaken','purify']);
  assert.equal(out.fighters[0].hp,100);
  assert.equal(out.fighters[0].stages.atk,2);assert.equal(out.fighters[0].stages.spe,2);
  assert.equal(out.fighters[1].stages.atk,2);assert.equal(out.fighters[1].stages.acc,2);
});
test('消强清除正等级并保留负等级，可消除当回合先手强化', () => {
  const s=E.createBattle({species:['rey','gaia'],criticals:false,stats:[{spe:999,maxHp:9999},{atk:1,maxHp:9999}]});
  s.fighters[0].stages.def=-2;
  const out=E.resolveTurn(s,['awaken','shatter']);
  assert.equal(out.fighters[0].stages.atk,0);assert.equal(out.fighters[0].stages.spe,0);assert.equal(out.fighters[0].stages.def,-2);
});
test('战斗伤害确实使用养成等级，即使直接面板相同', () => {
  const stats={maxHp:9999,atk:200,def:200,spa:200,spd:200,spe:100};
  const play=level=>E.resolveTurn(E.createBattle({species:['rey','gaia'],seed:'level-test',criticals:false,builds:[{level,overrides:stats},{overrides:stats}]}),['aurora','purify']);
  assert.ok(play(100).fighters[1].hp < play(10).fighters[1].hp);
});
test('天明闪的4倍效果可复现且不依赖暴击开关', () => {
  let burst=false, normal=false;
  for(let i=0;i<50;i++) {
    const s=E.createBattle({species:['rey','gaia'],seed:`burst-${i}`,criticals:false,stats:[{spe:999},{maxHp:9999}]});
    const out=E.resolveTurn(s,['thunder','purify']);
    const triggered=out.turns[0].events.some(e=>e.text.includes('触发 4 倍'));
    burst ||= triggered; normal ||= !triggered;
    assert.deepEqual(E.resolveTurn(s,['thunder','purify']),out);
  }
  assert.ok(burst&&normal);
});
