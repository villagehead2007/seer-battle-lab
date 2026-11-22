'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[],stats={}){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const levels=g=>g.slots[0].map(x=>x.fighter.soulState.futureLink??0);
test('1806完整原魂战初真授链接，原旋风消耗场下成员至一级，持有者真下场清零返场不重授',()=>{
 let g=T.create([[member(4647),member(4600,1806),member(4648),member(4649)],[member(2988,undefined,[10054],{spa:1800})]],[0,0],{seed:14,criticals:false});assert.deepEqual(levels(g),[3,0,3,3]);for(let i=0;i<2;i++){g=T.turn(g,[pp,'wiki:10054']);assert.equal(levels(g)[2],2-i);}
 g=T.turn(g,[{switchTo:2},pp]);assert.equal(g.battle.fighters[0].soulState.futureLink,1);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.slots[0][2].fighter.soulState.futureLink??0,0);assert.equal(levels(g)[3],3,'unmoved fire member keeps its actual grant');g=T.turn(g,[{switchTo:2},pp]);assert.equal(g.battle.fighters[0].soulState.futureLink??0,0);const before=levels(g);g=T.turn(g,[pp,'wiki:10054']);assert.deepEqual(levels(g),before,'non-linked active no longer consumes a bench link for defense');assert.ok(g.battle.damageEvents.some(e=>e.round===g.battle.round-1&&e.type==='attack'&&e.targetSide===0&&e.settledDamage>0));
});
test('1806原三级链接真实交接同步上限HP及实际用招后的PP，持有者真离场还原上限而保当前HP和PP',()=>{
 const attack=S.species(4600).moves.find(m=>m.id===37118);assert.ok(attack);
 for(const[sourceMax,targetMax,hp]of [[6000,9000,3000],[9000,6000,8000]]){
  let g=T.create([[member(4600,1806,[attack.id],{maxHp:sourceMax,spe:9999}),member(2989,undefined,[],{maxHp:targetMax}),member(3056)],[member(2989)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=hp;g.slots[0][1].fighter.hp=2000;const key='wiki:'+attack.id,before=g.battle.fighters[0].pp[key];g=T.turn(g,[key,pp]);assert.equal(g.battle.fighters[0].pp[key],before-1);const sourcePP=g.battle.fighters[0].moves.map(k=>g.battle.fighters[0].pp[k]);
  g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.battle.fighters[0].stats.maxHp,sourceMax);assert.equal(g.battle.fighters[0].hp,hp);g.battle.fighters[0].moves.forEach((k,i)=>assert.equal(g.battle.fighters[0].pp[k],Math.min(sourcePP[i],g.battle.fighters[0].teamPPDefinitions[k].pp)));const ppSynced={...g.battle.fighters[0].pp};
  g=T.turn(g,[{switchTo:2},pp]);assert.equal(g.slots[0][1].fighter.stats.maxHp,targetMax);assert.equal(g.slots[0][1].fighter.hp,Math.min(hp,targetMax));assert.equal(g.slots[0][1].fighter.soulState.syncMaxHp1806,undefined);assert.equal(g.slots[0][1].fighter.soulState.futureLink??0,0);g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.battle.fighters[0].stats.maxHp,targetMax);assert.equal(g.battle.fighters[0].hp,Math.min(hp,targetMax));assert.deepEqual(g.battle.fighters[0].pp,ppSynced);
 }
});
