'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),shields=require('../dist/shield-rules.js'),store=require('../local-species.cjs');
function member(id,soul,skill){let snapshot=store.species(id);if(soul)snapshot=E.WIKI.versionSnapshots(snapshot).find(v=>v.selectedSoulId===soul);assert.ok(snapshot);const moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,def:300,spd:300}}};}
test('原乔列尼德八存活仍最多600盾，觉醒版按真实六成员加两额外龙授800盾及四次清回合必暴',()=>{
 for(const soul of [832,2005]){
  const g=T.create([[member(3524,soul),member(4186,2028),...[3056,2988,2987,3311].map(id=>member(id))],[member(3056)]],[0,0],{seed:13,criticals:false});
  assert.deepEqual(E.teamPopulation(g.battle,0),{live:8,dead:0});const f=g.battle.fighters[0];assert.equal(f.suitState.shield,soul===832?600:800);assert.equal(f.soulState.jolieClearCrit,soul===832?1:4);if(soul===2005)assert.equal(f.soulState.jolieCritGuards,2);
 }
});
test('乔列尼德两版先消费入场攻击资格，真实离场后按二活四亡重新授全部本次资源',()=>{
 for(const soul of [832,2005]){
  const own=member(3524,soul),attack=own.snapshot.moves.find(m=>m.power>0&&m.effectInstances.length===0);assert.ok(attack);own.moves[1]=attack.id;
  let g=T.create([[own,...[3056,2988,2987,3223,3311].map(id=>member(id))],[member(3056)]],[0,0],{seed:13,criticals:false});
  assert.equal(g.battle.fighters[0].soulState.jolieClearCrit,soul===832?1:3);g=T.turn(g,['wiki:'+attack.id,'potion:pp']);assert.equal(g.battle.fighters[0].soulState.jolieClearCrit,soul===832?0:2);
  g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.jolieClearCrit,soul===832?1:3);
  // Independent two-living/four-fallen initial population; no mid-battle deaths are fabricated.
  g=T.create([[own,...[3056,2988,2987,3223,3311].map(id=>member(id))],[member(3056)]],[1,0],{seed:13,criticals:false});for(const i of [2,3,4,5])g.slots[0][i].fighter.hp=0;g=T.turn(g,[{switchTo:0},'potion:pp']);const f=g.battle.fighters[0];
  assert.equal(f.suitState.shield,200);assert.equal(f.soulState.jolieEntryBonus,40);assert.equal(f.soulState.jolieReduceCharges,2);assert.equal(f.soulState.jolieClearCrit,soul===832?0:1);
  if(soul===2005){assert.equal(f.soulState.jolieCritGuards,0);assert.equal(f.soulState.jolieDreadBonus,1);assert.equal(f.soulState.jolieEvolutionEnds,2);}
  const before=structuredClone(g),items=D.fighter(f,g.battle.round).items;assert.match(items.find(x=>x.name==='受击减伤').value,new RegExp(soul===832?'攻击伤害':'非真实伤害'));if(soul===2005)assert.equal(items.find(x=>x.name==='荒古之慑额外层数').value,'1 层');assert.deepEqual(g,before);
 }
});
test('两版乔列尼德入场二次减伤真实只消费两次用攻，原版只减红，觉醒同回合另减固定伤害',()=>{
 for(const soul of [832,2005]){
  const foe=member(3056,null,19369);foe.build.overrides.atk=600;
  let g=T.create([[member(2988),member(3524,soul),...[2987,3223,3311,3432].map(id=>member(id))],[foe]],[0,0],{seed:13,criticals:false});for(const i of [2,3,4,5])g.slots[0][i].fighter.hp=0;
  g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].suitState.shield,200);
  // Shield removal below is only an isolated numerical reduction component cloned from the native entry above.
  g=structuredClone(g);shields.consume(g.battle.fighters[0]);
  for(const remaining of [1,0,0]){
   const ordinary=structuredClone(g);ordinary.battle.fighters[0].soulState.jolieReduceCharges=0;ordinary.battle.fighters[0].soulState.jolieReduceRound=0;const r=g.battle.round;
   const base=T.turn(ordinary,['potion:pp','wiki:19369']);g=T.turn(g,['potion:pp','wiki:19369']);assert.equal(g.battle.fighters[0].soulState.jolieReduceCharges,remaining);
   const sum=(s,type)=>s.battle.damageEvents.filter(e=>e.round===r&&e.sourceSide===1&&e.type===type).reduce((n,e)=>n+e.settledDamage,0),active=r<4;
   assert.ok(sum(base,'attack')>0);assert.ok(Math.abs(sum(g,'attack')-sum(base,'attack')*(active?.5:1))<=2);
   assert.ok(Math.abs(sum(g,'fixed')-sum(base,'fixed')*(active?(soul===832?.5:.25):1))<=3);
  }
 }
});
