'use strict';

const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const T=require('../dist/team-engine.js');
const display=require('../dist/battle-display.js');
const shields=require('../dist/shield-rules.js');
const local=require('../local-species.cjs');

const ice=local.species(3886),neutral=local.species(2987),xuan=local.species(4995);
const cfg={criticals:false,seed:14};
const strike='wiki:37809',hp='potion:hp',pp='potion:pp';
function member(snapshot,overrides={}){
  return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:4000,atk:200,def:200,spa:200,spd:200,spe:1,...overrides}}};
}
function duel(a,b){return E.createBattle({...cfg,wikiSnapshots:[a.snapshot,b.snapshot],wikiLoadouts:[a.moves,b.moves],builds:[a.build,b.build]});}
function last(battle){return battle.turns.at(-1);}

test('凝寒止喧 90 段按实际体力损失合并，护盾与同回合另一伤害来源保持独立，血药在技能后生效',()=>{
  const battle=duel(member(neutral,{maxHp:2000,spe:999}),member(ice));
  shields.add(battle.fighters[0],12,'test');
  battle.fighters[1].effects['用招附加固定']={start:1,end:1,amount:30};
  const out=E.resolveTurn(battle,[hp,strike]);
  const turn=last(out),events=turn.events,original=structuredClone(events),rendered=display.logEvents(events);
  const [row]=rendered.filter(e=>e.segments);
  const expected=events.filter(e=>e.segment);
  const loss=expected.reduce((n,e)=>n+e.damage.hpLoss,0);
  assert.equal(turn.first,1);
  assert.equal(turn.events.filter(e=>e.text.includes('先制 -100 / 3')).length,1);
  assert.equal(expected.length,90);
  assert.equal(expected[0].damage.hpLoss,0);
  assert.equal(row.text,`B 方使用凝寒止喧，命中 90 段，A 方共损失 ${loss} 点体力。`);
  assert.deepEqual(row.segments,expected);
  assert.ok(row.segments.every(e=>e.detail.includes('完整结算')));
  const extra=rendered.find(e=>e.damage?.type==='fixed'&&e.damage.hpLoss===30);
  const potion=rendered.findIndex(e=>e.text.includes('使用了血药'));
  assert.ok(rendered.indexOf(row)<rendered.indexOf(extra)&&rendered.indexOf(extra)<potion);
  assert.equal(out.fighters[0].hp,2000);
  assert.deepEqual(events,original);
});

test('免伤仍有命中段，提前击倒只计真实段且倒下者不再用药',()=>{
  const a=member(neutral,{maxHp:50,spe:999}),b=member(ice);
  const hurt=E.resolveTurn(duel(a,b),[hp,strike]);
  const hit=display.logEvents(last(hurt).events).find(e=>e.segments);
  assert.ok(hit.segments.length>0&&hit.segments.length<90);
  assert.match(hit.text,/A 方共损失 50 点体力/);
  assert.ok(!last(hurt).events.some(e=>e.text.includes('使用了血药')));
  const held=duel(a,b);
  held.fighters[0].soulState.hypnosLowRound=1;
  const blocked=E.resolveTurn(held,[pp,strike]);
  const row=display.logEvents(last(blocked).events).find(e=>e.segments);
  assert.match(row.text,/命中 90 段，A 方共损失 0 点体力/);
});

test('同回合双方各施放一次同名连击，按施放及受伤方各自合并',()=>{
  const initial=duel(member(ice,{spe:999}),member(ice));
  const battle=E.resolveTurn(initial,[strike,strike]);
  const summaries=display.logEvents(last(battle).events).filter(event=>event.segments);
  assert.equal(summaries.length,2);
  for(const [index,row] of summaries.entries()){
    assert.ok(row.segments.every(hit=>hit.damage.sourceSide===index&&hit.damage.targetSide===1-index));
    assert.equal(new Set(row.segments.map(hit=>hit.segment.cast)).size,1);
  }
  assert.notEqual(summaries[0].segments[0].segment.cast,summaries[1].segments[0].segment.cast);
});

test('多精灵 A 方攻击先于 B 方 PP 药；双方用药按速度，换宠仍先结算',()=>{
  const a=member(ice),b=member(neutral,{maxHp:2000,spe:999});
  const reserve=member(xuan);
  const create=()=>T.create([[a],[b,reserve]],[0,0],cfg);
  const game=create(),key=game.battle.fighters[1].moves[0];
  game.battle.fighters[1].pp[key]=1;
  const fight=T.turn(game,[strike,pp]).battle;
  assert.equal(last(fight).first,0);
  assert.match(last(fight).events[0].text,/先制 3 \/ -100/);
  assert.equal(fight.fighters[1].pp[key],fight.moveDefinitions[key].pp);
  assert.match(display.logEvents(last(fight).events).find(e=>e.segments).text,/^A 方使用凝寒止喧/);
  const both=T.turn(create(),[hp,pp]).battle;
  assert.equal(last(both).first,1);
  assert.match(last(both).events[0].text,/先制 -100 \/ -100/);
  const moved=T.turn(create(),[hp,{switchTo:1}]);
  assert.equal(moved.active[1],1);
  assert.equal(last(moved.battle).first,1);
});

test('玄武开战加成四舍五入一次，实际面板与状态显示读取同一整数',()=>{
  for(const [def,spd,rounded] of [[41,42,12],[44,46,14],[42,42,13]]){
    const a=member(xuan,{def,spd,maxHp:3000});
    const b=member(neutral);
    const state=duel(a,b),f=state.fighters[0];
    assert.equal(f.soulState.xuan2144.entryPanel.amount,rounded);
    assert.equal(f.stats.def,def+rounded);
    assert.equal(f.stats.spd,spd+rounded);
    assert.equal(f.hp,3000+rounded);
    const panel=()=>display.fighter(f,1,state.moveDefinitions,state).items.find(r=>r.name==='玄武开战面板').value;
    assert.match(panel(),new RegExp('各 \\+'+rounded+' ·'));
    assert.equal(panel(),panel());
    const team=T.create([[a,member(ice)],[b]],[0,0],cfg);
    const out=T.turn(T.turn(team,[{switchTo:1},pp]),[{switchTo:0},pp]);
    assert.equal(out.battle.fighters[0].stats.def,def+rounded);
    assert.equal(out.battle.fighters[0].stats.spd,spd+rounded);
  }
});

test('无极圣武英雄之耀面板按攻差四舍五入一次，场下和返场保留同一整数',()=>{
  const hero=local.species(4800),ally=local.species(3102);
  for(const [diff,rounded] of [[83,12],[90,14],[84,13]]){
    const a=member(hero,{atk:200+diff,spa:200,maxHp:3000});
    let g=T.create([[a,member(ally)],[member(neutral)]],[0,0],cfg);
    function check(f,battle){
      assert.equal(f.soulState.heroGlory2009,1);
      assert.equal(f.soulState.heroGloryPanel2009,rounded);
      for(const [stat,base] of Object.entries({def:200,spd:200,spe:1,maxHp:3000}))
        assert.equal(f.stats[stat],base+rounded);
      const line=display.fighter(f,battle.round,battle.moveDefinitions,battle).items.find(item=>item.name==='英雄之耀面板');
      assert.equal(line.value,'体力、防御、特防、速度各 +'+rounded);
    }
    check(g.battle.fighters[0],g.battle);
    g=T.turn(g,[{switchTo:1},pp]);
    check(g.slots[0][0].fighter,g.battle);
    g=T.turn(g,[{switchTo:0},pp]);
    check(g.battle.fighters[0],g.battle);
  }
});
