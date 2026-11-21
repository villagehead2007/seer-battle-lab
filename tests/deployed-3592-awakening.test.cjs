'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const T=require('../dist/team-engine.js');
const local=require('../local-species.cjs');
const source=local.species(3592);
const target=local.species(4765),other=local.species(2987);
const pp='potion:pp',key=id=>'wiki:'+id,config={criticals:false,seed:6};
function member(snapshot,moves,overrides={}){
  return {snapshot,moves:moves??E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:500,spa:500,def:500,spd:500,spe:500,...overrides}}};
}
function shura(soul){return member({...source,selectedSoulId:soul},[31929,31926,31928,32624,29524]);}
function foe(){return member(target,[10171,20006,20085,10006,37908],{spe:80});}
function duel(a,b){return E.createBattle({...config,wikiSnapshots:[a.snapshot,b.snapshot],wikiLoadouts:[a.moves,b.moves],builds:[a.build,b.build]});}

test('3592 焦魂冥墟新技能兼容旧印，睡眠失败返等量固定伤害，麻痹失败封属性',()=>{
  for(const soul of [886,2169]){
    const out=E.resolveTurn(duel(shura(soul),foe()),[key(29524),pp]);
    assert.equal(out.fighters[0].soulId,soul);
    assert.equal(out.fighters[0].pp[key(29524)],4);
    assert.ok(out.fighters[0].effects.reflect);
  }
  const s=duel(shura(886),foe());
  s.fighters[1].effects['免异常']={start:1,end:1};
  const blocked=E.resolveTurn(s,[key(29524),key(10006)]);
  assert.ok(blocked.fighters[1].effects.statusBlock);
  const returned=blocked.damageEvents.find(e=>e.sourceSide===0&&e.targetSide===1&&e.type==='fixed');
  assert.ok(returned?.settledDamage>0);
  assert.ok(blocked.damageEvents.filter(e=>e.type==='attack'&&e.targetSide===0).every(e=>e.hpLoss===0));
  const following=E.resolveTurn(blocked,[key(29524),pp]);
  assert.equal(following.fighters[1].stages.def,blocked.fighters[1].stages.def-1);
  assert.equal(following.fighters[1].stages.acc,blocked.fighters[1].stages.acc-1);
});

test('3592 奈落伏尸整次清 PP 只消耗一具，技能使用独立；对手换人按实扣交给场下修罗',()=>{
  const s=T.create([[shura(2169),member(other)],[foe(),member(other)]],[0,0],config);
  const target=s.battle.fighters[1],actor=s.battle.fighters[0];
  actor.hp=2000;actor.effects['攻击必中']={start:1,end:1};
  target.stages.atk=2;
  const out=T.turn(s,[key(31926),pp]);
  assert.equal(out.battle.fighters[1].soulState.ppClearHistory.length,2);
  assert.equal(out.battle.teamNaraku[0].count,4);
  assert.equal(out.battle.teamNaraku[0].damage[0],3000);
  assert.equal(out.battle.fighters[0].hp,5000);
  const switched=T.turn(out,[{switchTo:1},{switchTo:1}]);
  assert.equal(switched.slots[0][0].fighter.hp,8000);
  assert.ok(switched.battle.damageEvents.some(e=>e.round===2&&e.sourceSide===0&&e.targetSide===1&&e.hpLoss===3000));
});

test('3592 先制与红伤增减按失血档；无尸可用时没有麻痹补偿',()=>{
  const a=member({...source,selectedSoulId:2169},[31929,31926,32624,29524,20307]);
  for(const [hp,priority,ratio] of [[9000,3,.3],[7201,3,.3],[7200,2,.3],[5400,1,.6],[1800,-1,.9]]){
    const s=duel(a,foe()),fighter=s.fighters[0];
    fighter.hp=hp;
    assert.equal(E.SOULS.trait(fighter,'skillPriority'),priority);
    assert.ok(Math.abs(E.SOULS.trait(fighter,'attackReduction')-ratio)<1e-10);
    assert.ok(Math.abs(E.SOULS.trait(fighter,'attackMultiplier')-(1+ratio))<1e-10);
  }
  const s=duel(a,foe());
  s.teamNaraku=[{count:0,damage:{},pending:null,owner:null},null];
  const empty=E.resolveTurn(s,[key(20307),pp]);
  assert.equal(empty.teamNaraku[0].count,0);
  assert.equal(empty.fighters[1].ailments['麻痹'],undefined);
});
