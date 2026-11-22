'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('帝君之援在出战背包即可授满体继任者当回合先制，非满体或来源消逝则不授',()=>{
 for(const state of ['alive','dead','vanished'])for(const full of [false,true]){
  const friend=member(3056,10127),foe=member(3056,10127);friend.build.overrides.spe=1;foe.build.overrides.spe=9999;foe.build.overrides.atk=1000;
  let g=T.create([[member(2988),member(3550),friend],[foe]],[0,0],{seed:13,criticals:false});
  g.battle.fighters[0].hp=1;if(state!=='alive')g.slots[0][1].fighter.hp=0;if(state==='vanished'){g.slots[0][1].fighter.soulState.vanished=true;g.slots[0][1].fighter.stats.maxHp=0;}if(!full)g.slots[0][2].fighter.hp=8000;
  g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.phase,'replace');g=T.replace(g,[2,null]);
  const expected=state!=='vanished'&&full,round=g.battle.round;assert.equal(g.battle.fighters[0].soulState.emperorAidRound849===round,expected,JSON.stringify({state,full,hp:g.battle.fighters[0].hp,max:g.battle.fighters[0].stats.maxHp,sourceHp:g.slots[0][1].fighter.hp,round}));
  g=T.turn(g,['wiki:10127','wiki:10127']);assert.equal(g.battle.turns.at(-1).first,expected?0:1);
 }
});
test('帝君之阵按实际一只两只阵亡队友分别增加红伤并减少红伤，零阵亡作同源对照',()=>{
 function resolve(dead){
  const owner=member(3550,10004),foe=member(3056,10127);owner.build.overrides.atk=500;owner.build.overrides.spe=9999;foe.build.overrides.atk=500;
  let g=T.create([[owner,member(2988),member(2987)],[foe]],[0,0],{seed:13,criticals:false});
  for(let i=0;i<dead;i++)g.slots[0][i+1].fighter.hp=0;
  g=T.turn(g,['wiki:10004','wiki:10127']);return [0,1].map(side=>g.battle.damageEvents.find(e=>e.round===1&&e.sourceSide===side&&e.type==='attack').settledDamage);
 }
 const base=resolve(0);assert.ok(base.every(n=>n>0));
 for(const dead of [1,2]){const actual=resolve(dead);assert.ok(Math.abs(actual[0]-base[0]*(1+dead*.1))<=2);assert.ok(Math.abs(actual[1]-base[1]*(1-dead*.1))<=2);}
});
