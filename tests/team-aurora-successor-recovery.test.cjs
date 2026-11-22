'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skills=[]){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);let index=1;for(const skill of skills)if(!moves.includes(skill))moves[index++]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('极光仙子真实攻击击败只封实际下一位首次属性整招，药剂和攻击不消耗且第二次属性正常',()=>{
 const owner=member(4430,[12897]);owner.build.overrides.atk=9999;
 let g=T.create([[owner],[member(2988),member(3056,[20117,10127]),member(2987)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:12897','potion:pp']);assert.equal(g.phase,'replace');
 assert.equal(g.battle.teamEntryGrants[1].filter(x=>x.soulId===1645).length,1);
 assert.equal(D.team(g,1).find(x=>x.name==='极光仙子 · 首次属性技能无效').value,'下只登场');
 g=T.replace(g,[null,1]);assert.equal(g.battle.fighters[1].counts.nextStatusInvalid,1);assert.equal(g.slots[1][2].fighter.counts.nextStatusInvalid,undefined);
 assert.ok(E.describeEffects(g.battle.fighters[1],g.battle.round).some(x=>x.includes('属性技能无效')));
 g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[1].counts.nextStatusInvalid,1);
 g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.battle.fighters[1].counts.nextStatusInvalid,1);
 const before=g.battle.fighters[1].pp['wiki:20117'];g=T.turn(g,['potion:pp','wiki:20117']);
 assert.equal(g.battle.fighters[1].counts.nextStatusInvalid,0);assert.equal(g.battle.fighters[1].pp['wiki:20117'],before-1);assert.equal(g.battle.fighters[1].stages.atk,0);
 g=T.turn(g,['potion:pp','wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,1);
});
test('极光仙子未击败与对手立即重生均不授继任封锁，保留原未击败特攻提升',()=>{
 for(const enemy of [3056,3311]){
  const owner=member(4430,[12897]);owner.build.overrides.atk=500;
  let g=T.create([[owner],[member(enemy),member(2988)]],[0,0],{seed:13,criticals:false});
  if(enemy===3311)g.battle.fighters[1].hp=1;
  g=T.turn(g,['wiki:12897','potion:pp']);assert.equal(g.phase,'action');assert.ok(g.battle.fighters[1].hp>0);
  assert.equal(g.battle.teamEntryGrants?.[1]?.filter(x=>x.soulId===1645).length??0,0);
  assert.equal(g.battle.fighters[0].stages.spa,2);
 }
});
