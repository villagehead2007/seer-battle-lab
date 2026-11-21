'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const T=require('../dist/team-engine.js');
const store=require('../local-species.cjs');
const {loadout}=require('./helpers/3001-native.cjs');

const pp='potion:pp';
const settings={seed:14,criticals:false};
function member(id,overrides={},soul){
  const snapshot=structuredClone(store.species(id));
  if(soul)snapshot.selectedSoulId=soul;
  return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:4000,...overrides}}};
}

for(const fallen of [0,1])for(const selected of [1,2]){
  test(`阵亡方 ${fallen}、替补 ${selected}：提交补位和行动后各结算一次`,()=>{
    const rosters=[[member(2988,{maxHp:20,def:1,spe:1}),member(3056),member(3291)],
      [member(2988,{atk:9999,spe:9999})]];
    if(fallen)rosters.reverse();
    const initial=T.create(rosters,[0,0],settings);
    const pending=T.turn(initial,initial.battle.fighters.map(f=>f.moves[0]));
    assert.deepEqual(pending.pending,[fallen]);
    const previous=structuredClone(pending);
    const keys=['wiki:24780','wiki:25295'];
    const targets=fallen?[null,selected]:[selected,null];
    const actions=fallen?[pp,keys[selected-1]]:[keys[selected-1],pp];
    const view=T.projectReplacement(pending,targets);
    assert.deepEqual(view.active,targets.map(target=>target??0));
    assert.equal(view.battle.fighters[fallen].name,pending.slots[fallen][selected].fighter.name);
    assert.throws(()=>T.turnWithReplacement(pending,targets,[null,pp]),/请选择|选择可执行/);
    assert.deepEqual(pending,previous);
    const game=T.turnWithReplacement(pending,targets,actions);
    const round=pending.battle.round;
    assert.equal(game.active[fallen],selected);
    assert.equal(game.battle.round,round+1);
    assert.deepEqual(game.battle.turns.at(-1).choices,actions);
    assert.equal(game.slots[fallen][selected].fighter.pp[actions[fallen]],
      pending.slots[fallen][selected].fighter.pp[actions[fallen]]-1);
    assert.deepEqual(game.battle.teamDepartureEvents.at(-1),{round,side:fallen,from:0,to:selected,kind:'knockout',selection:'chosen'});
    const name=pending.slots[fallen][selected].fighter.name;
    assert.match(game.history[pending.history.length],new RegExp(name+' 登场。'));
    assert.deepEqual(pending,previous);
  });
}

test('双方同回合阵亡时仅有一只存活替补也要各选行动，沿用原登场顺序',()=>{
  const initial=T.create([0,1].map(()=>[member(2988),member(3056)]),[0,0],settings);
  for(const f of initial.battle.fighters){f.hp=1;f.ailments['烧伤']=2;}
  const pending=T.turn(initial,[pp,pp]);
  assert.deepEqual(pending.battle.teamDeathOrder,[0,1]);
  assert.deepEqual(pending.pending,[0,1]);
  const actions=['wiki:24780','wiki:24780'];
  const game=T.turnWithReplacement(pending,[1,1],actions);
  assert.deepEqual(game.active,[1,1]);
  assert.deepEqual(game.battle.turns.at(-1).choices,actions);
  assert.deepEqual(game.history.slice(pending.history.length).filter(row=>row.endsWith(' 登场。')),
    T.replace(pending,[1,1]).history.slice(pending.history.length).filter(row=>row.endsWith(' 登场。')));
});

test('登场清空已选技能的 PP 时，原行动作废，另一方照常出招',()=>{
  const initial=T.create([[member(4745,{atk:9999,spa:9999,spe:9999}),member(4069,{},1315)],
    [member(4925,{maxHp:40}),member(3056)]],[0,0],settings);
  const pending=T.turn(initial,['wiki:37862',pp]);
  assert.deepEqual(pending.pending,[1]);
  const entered=T.replace(pending,[null,1]);
  const f=entered.battle.fighters[1],key=f.moves.find(move=>f.pp[move]===0);
  assert.ok(key);
  assert.ok(pending.slots[1][1].fighter.pp[key]>0);
  const game=T.turnWithReplacement(pending,[null,1],[pp,key]);
  assert.equal(game.battle.fighters[1].pp[key],0);
  assert.equal(game.battle.round,pending.battle.round+1);
  const round=game.battle.turns.at(-1);
  assert.match(round.events.map(e=>e.text).join('\n'),/所选行动无法执行/);
  assert.match(round.events.map(e=>e.text).join('\n'),/A 方 使用了PP 药/);
});

test('补位者被登场伤害击倒时，同回合再次选补位和行动',()=>{
  const attacker=member(3407,{maxHp:9000,atk:9999,spa:9999,spe:9999});
  attacker.snapshot=E.WIKI.versionSnapshots(attacker.snapshot).find(s=>E.WIKI.availableMoves(s).some(move=>move.id===30955));
  attacker.moves=loadout(attacker.snapshot,[30955]);
  const initial=T.create([[attacker],[member(2989,{maxHp:1,def:1,spd:1}),member(3102),member(3056)]],[0,0],settings);
  initial.slots[1][1].fighter.hp=20;
  const pending=T.turn(initial,['wiki:30955',pp]);
  assert.deepEqual(pending.pending,[1]);
  assert.ok(pending.battle.teamEntryGrants[1].some(grant=>grant.effectId===840));
  const next=T.turnWithReplacement(pending,[null,1],[pp,pp]);
  assert.equal(next.phase,'replace');
  assert.equal(next.battle.round,pending.battle.round);
  assert.equal(next.slots[1][1].fighter.hp,0);
  const entryDamage=Object.values(next.historyDetails).find(e=>e.turnEventIndex===null&&e.damage?.type==='percent');
  assert.equal(entryDamage.damage.targetName,next.slots[1][1].fighter.name);
  assert.equal(entryDamage.damage.hpLoss,20);
  assert.deepEqual(T.candidates(next,1,true),[2]);
  assert.equal(next.battle.turns.length,pending.battle.turns.length);
  const game=T.turnWithReplacement(next,[null,2],[pp,'wiki:24780']);
  assert.equal(game.battle.round,pending.battle.round+1);
  assert.deepEqual(game.battle.turns.at(-1).choices,[pp,'wiki:24780']);
  assert.equal(game.active[1],2);
});

test('存活方选择主动换位时，阵亡补位先登场，主动换位仍占用原方行动',()=>{
  const initial=T.create([[member(2988,{atk:9999,spe:9999}),member(3056)],
    [member(2988,{maxHp:20,def:1,spe:1}),member(3291)]],[0,0],settings);
  const pending=T.turn(initial,['wiki:19123',pp]);
  assert.deepEqual(pending.pending,[1]);
  const game=T.turnWithReplacement(pending,[null,1],[{switchTo:1},'wiki:25295']);
  assert.deepEqual(game.active,[1,1]);
  assert.deepEqual(game.battle.teamDepartureEvents.slice(-2).map(e=>[e.side,e.kind]),[[1,'knockout'],[0,'voluntary']]);
  assert.deepEqual(game.battle.turns.at(-1).choices,['team:switch','wiki:25295']);
});
