'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(id===3102)moves[4]=10127;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:5000,spa:5000,def:4000,spd:4000,spe:1000,...stats}}};}
function create(hasSource,seed=14){const g=T.create([[member(4745,{atk:9999,spa:9999}),member(hasSource?3665:4521)],[member(4925,{maxHp:40}),member(3102)]],[0,0],{seed,criticals:false});g.battle.fighters[0].hp=5000;return g;}
function gain(hasSource,seed=14){let g=create(hasSource,seed);assert.equal(g.battle.fighters[0].soulState.hunt1948.souls,1);assert.equal(E.SOULS.trait(g.battle.fighters[0],'attackMultiplier'),1);assert.equal(E.SOULS.trait(g.battle.fighters[0],'attackReduction'),0);g=T.turn(g,['wiki:37862',pp]);assert.equal(g.battle.fighters[1].hp,0);return T.replace(g,[null,1]);}
test('咤克斯951同一句三项击败提升只给狩杀一层，初始增伤减伤不复制，实际KO后红伤增10%且减红10%而不受击回血',()=>{
 const cases=[false,true].map(hasSource=>{
  let g=gain(hasSource);const a=g.battle.fighters[0];
  assert.equal(a.soulState.hunt1948.inheritedZakKills??0,hasSource?1:0);
  assert.equal(E.SOULS.trait(a,'attackMultiplier'),hasSource?1.1:1);assert.equal(E.SOULS.trait(a,'attackReduction'),hasSource?.1:0);
  const before=a.hp,hitRound=g.battle.round;g=T.turn(g,[pp,'wiki:10127']);
  const incoming=g.battle.damageEvents.filter(e=>e.round===hitRound&&e.sourceSide===1&&e.targetSide===0&&e.type==='attack').reduce((n,e)=>n+e.hpLoss,0);
  assert.ok(incoming>0);assert.equal(g.battle.fighters[0].hp,before-incoming);assert.ok(!g.battle.fighters[0].effects.id984);
  const attackRound=g.battle.round;g=T.turn(g,['wiki:37862',pp]);
  const dealt=g.battle.damageEvents.filter(e=>e.round===attackRound&&e.sourceSide===0&&e.targetSide===1&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);assert.ok(dealt>0);
  if(hasSource){assert.equal(a.soulState.hunt1948.inheritedSingleSources.length,1);const view=D.fighter(g.battle.fighters[0],g.battle.round,g.battle.moveDefinitions).items;assert.match(view.find(x=>x.name==='登场继承记录').value,/整句1种/);assert.match(view.find(x=>x.name==='继承咤克斯击败成长').value,/红伤\+10%.*减伤10%.*秒杀3%/);}
  return{dealt,incoming};
 });
 assert.ok(Math.abs(cases[1].dealt-cases[0].dealt*1.1)<=1);assert.ok(Math.abs(cases[1].incoming-cases[0].incoming*.9)<=1);
});
test('继承咤克斯真实击败后按原量成长，真下场重置且返场重新授本次狩杀',()=>{
 let g=gain(true);g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);let f=g.battle.fighters[0];assert.equal(f.soulState.hunt1948.souls,1);assert.equal(f.soulState.hunt1948.inheritedZakKills,undefined);assert.equal(E.SOULS.trait(f,'attackMultiplier'),1);assert.equal(E.SOULS.trait(f,'attackReduction'),0);
});
test('继承咤克斯3%秒杀用真实初始种子有成功和失败，未击败前不拥有来源初始15%秒杀',()=>{
 let hit=0,miss=0;
 for(let seed=0;seed<32;seed++){let g=T.create([[member(4745,{atk:9999,spa:9999}),member(3665)],[member(3102)]],[0,0],{seed,criticals:false});g=T.turn(g,['wiki:37862',pp]);assert.ok(g.battle.fighters[1].hp>0);assert.equal(g.battle.fighters[0].soulState.hunt1948.inheritedZakKills??0,0);assert.ok(!JSON.stringify(g.battle.turns.at(-1).events).includes('继承咤克斯击败成长秒杀'));}
 for(let seed=0;seed<96;seed++){let g=gain(true,seed);g=T.turn(g,['wiki:37862',pp]);const happened=JSON.stringify(g.battle.turns.at(-1).events).includes('继承咤克斯击败成长秒杀');if(happened){hit++;assert.equal(g.battle.fighters[1].hp,0);assert.equal(g.battle.fighters[0].soulState.hunt1948.inheritedZakKills,2);}else{miss++;assert.ok(g.battle.fighters[1].hp>0);assert.equal(g.battle.fighters[0].soulState.hunt1948.inheritedZakKills,1);}}
 assert.ok(hit>0);assert.ok(miss>0);
});
