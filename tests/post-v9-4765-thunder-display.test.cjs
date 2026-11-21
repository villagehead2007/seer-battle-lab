'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const E = require('../dist/engine.js');
const T = require('../dist/team-engine.js');
const D = require('../dist/battle-display.js');
const store = require('../local-species.cjs');

const skill = [37906,29043,29044,37907,37908];
const rei = store.species(4765);
const alternateRei = store.species(4946);
const ppt = 'potion:pp';
const key = id => 'wiki:'+id;
const settings = {criticals:false,seed:14};
function member(snapshot, moves=E.WIKI.defaultMoves(snapshot)){
  const overrides={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000};
  return {snapshot,moves,build:{overrides}};
}
function solo(snapshot=rei, loadout=skill){
  return E.createBattle({...settings,wikiSnapshots:[rei,snapshot],wikiLoadouts:[skill,loadout],
    builds:[member(rei).build,member(snapshot).build]});
}
function display(s,side){
  return D.fighter(s.fighters[side],s.round,s.moveDefinitions,s).items.filter(item=>item.name.startsWith('雷辰 · '));
}
function awakening(s,side,round=s.round){
  return D.reiStatuses(s.fighters[side],round,s.moveDefinitions).find(item=>item.name==='觉醒');
}
function choose(s,side,slot) {
  const choices=[ppt,ppt];
  choices[side]=key(skill[slot]);
  return E.resolveTurn(s,choices);
}
function renderSingle(s,side) {
  const app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8');
  assert.ok(app.includes('${renderThunderStars(f,i)}'));
  const helper=app.slice(app.indexOf('  function renderThunderStars('),app.indexOf('  function renderXin('));
  return vm.runInNewContext(helper+';renderThunderStars', {
    state:s,E,window:{BattleDisplay:D},sideName:i=>i===0?'A 方':'B 方',
    escape:value=>String(value),
  })(s.fighters[side],side);
}

test('1966 单精灵面板随双方真实技能槽显示四方向，并用真实连接顺序及觉醒倒计时重绘',()=>{
  let s=solo();
  const items=display(s,0);
  assert.match(items[0].value,/东 雷·极光千刃 未点亮/);
  assert.match(items[0].value,/南 .* 未点亮.*西 .* 未点亮.*北 .* 未点亮/);
  assert.match(renderSingle(s,1),/B 方专属状态/);
  s=choose(s,1,3);
  assert.match(renderSingle(s,1),/北 .* 已点亮/);
  assert.equal(display(s,0)[1].value,'尚未点亮');
  s=choose(s,1,3);
  assert.deepEqual(s.fighters[1].soulState.lei1966.stars,[3]);
  assert.equal(display(s,1)[1].value,'北 · 尚未连线');
  for(const slot of [2,0,1])s=choose(s,1,slot);
  assert.equal(display(s,1)[1].value,'北→西→东→南 · 连线 北→西、西→东、东→南');
  for(const remaining of [3,2,1]){
    assert.equal(awakening(s,1).value,'剩余 '+remaining+' 回合');
    if(remaining===3)assert.equal(awakening(s,1,s.round-1),undefined);
    s=E.resolveTurn(s,[ppt,ppt]);
  }
  assert.equal(display(s,1)[1].value,'尚未点亮');
  assert.equal(awakening(s,1),undefined);
});

test('1966 多精灵双方专属状态由真实战斗重绘，错误顺序清空且 4946 不显示旧雷辰',()=>{
  const left=member(rei,skill),right=member(rei,[29044,37906,29043,37907,37908]);
  let g=T.create([[left],[right]],[0,0],settings);
  assert.match(display(g.battle,1)[0].value,/东 雷·.* 未点亮.*南 雷·极光千刃 未点亮/);
  g=T.turn(g,[ppt,key(37906)]);
  assert.equal(display(g.battle,1)[1].value,'南 · 尚未连线');
  assert.equal(display(g.battle,0)[1].value,'尚未点亮');
  for(const move of [29044,37907,29043])g=T.turn(g,[ppt,key(move)]);
  assert.equal(display(g.battle,1)[1].value,'尚未点亮');
  assert.equal(awakening(g.battle,1),undefined);
  const other=T.create([[left],[member(alternateRei)]],[0,0],settings);
  assert.deepEqual(display(other.battle,1),[]);
  assert.ok(display(other.battle,0).length);
  const teamCode=fs.readFileSync(require.resolve('../dist/team-ui.js'),'utf8');
  assert.match(teamCode,/BattleDisplay\.fighter\(f,game\.battle\.round,game\.battle\.moveDefinitions,game\.battle\)/);
  assert.match(teamCode,/\['专属状态',display\.items\]/);
});

test('4946 真实低血觉醒独立显示，只有生效后出现；换宠切走显示，返场按引擎状态刷新',()=>{
  const reserve=member(store.species(2987)),left=member(alternateRei),right=member(rei,skill);
  let g=T.create([[left,reserve],[right]],[0,0],settings);
  assert.equal(awakening(g.battle,0),undefined);
  g.battle.fighters[0].hp=1000;
  g=T.turn(g,[key(29455),ppt]);
  assert.equal(awakening(g.battle,0,1),undefined);
  assert.equal(awakening(g.battle,0).value,'剩余 3 回合');
  assert.equal(awakening(g.battle,1),undefined);
  assert.match(renderSingle(g.battle,0),/觉醒 · 剩余 3 回合/);
  assert.deepEqual(display(g.battle,0),[]);
  g=T.turn(g,[{switchTo:1},ppt]);
  assert.equal(awakening(g.battle,0),undefined);
  g=T.turn(g,[{switchTo:0},ppt]);
  const beforeDeadline=E.SOULS.registry[1966].abilities.active(g.battle.fighters[0],g.battle.round);
  assert.equal(awakening(g.battle,0)?.value,beforeDeadline?'剩余 1 回合':undefined);
  g=T.turn(g,[ppt,ppt]);
  assert.equal(awakening(g.battle,0),undefined);
});

test('单精灵 B 方万霆神律与多精灵 A 方怒雷神裁同步各自的觉醒期限',()=>{
  let s=solo(alternateRei,E.WIKI.defaultMoves(alternateRei));
  s.fighters[1].hp=1000;
  s=E.resolveTurn(s,[ppt,key(29455)]);
  assert.match(renderSingle(s,1),/B 方专属状态[\s\S]+觉醒 · 剩余 3 回合/);
  assert.equal(awakening(s,0),undefined);
  for(let i=0;i<3;i++)s=E.resolveTurn(s,[ppt,ppt]);
  assert.ok(!renderSingle(s,1).includes('觉醒'));

  let g=T.create([[member(rei,skill)],[member(store.species(2987))]],[0,0],settings);
  for(const slot of [3,2,0,1])g=T.turn(g,[key(skill[slot]),ppt]);
  const rows=()=>D.fighter(g.battle.fighters[0],g.battle.round,g.battle.moveDefinitions,g.battle).items;
  assert.equal(rows().find(item=>item.name==='觉醒').value,'剩余 3 回合');
  for(let i=0;i<3;i++)g=T.turn(g,[ppt,ppt]);
  assert.ok(!rows().some(item=>item.name==='觉醒'));
});

test('4765 对手真实雷祭跨回合麻痹，解麻痹实际先动只在当轮，攻击与属性招均适用',()=>{
  const loadout=[10171,20006,20085,10006,37908];
  const left=member(rei,loadout),right=member(rei,loadout);
  left.build.overrides.spe=50;right.build.overrides.spe=500;
  const options={seed:4,criticals:false};
  for(const team of [false,true])for(const move of [10171,20006])for(const paralyze of [false,true]){
    const boot=team?T.create([[left],[right]],[0,0],options):E.createBattle({...options,wikiSnapshots:[rei,rei],wikiLoadouts:[loadout,loadout],builds:[left.build,right.build]});
    const resolve=team?T.turn:E.resolveTurn;
    const state=game=>team?game.battle:game;
    let g=resolve(boot,[key(20006),key(paralyze?20085:20006)]);
    let battle=state(g);
    assert.equal(battle.turns.at(-1).first,1);
    assert.equal(battle.fighters[0].soulState.resolvedPriority.value,0);
    assert.equal(battle.fighters[0].ailments['麻痹']>=2,paralyze);
    assert.equal(renderSingle(battle,0).includes('技能先制 +1'),paralyze);
    g=resolve(g,[key(move),key(20006)]);battle=state(g);
    assert.equal(battle.fighters[0].ailments['麻痹'],undefined);
    assert.equal(battle.turns.at(-1).first,paralyze?0:1);
    assert.match(battle.turns.at(-1).events[0].text,paralyze?/先制 1 \/ 0/:/先制 0 \/ 0/);
    assert.ok(!renderSingle(battle,0).includes('技能先制 +1'));
    g=resolve(g,[key(move),key(20006)]);battle=state(g);
    assert.equal(battle.fighters[0].soulState.resolvedPriority.value,0);
    assert.equal(battle.turns.at(-1).first,1);
  }
});
