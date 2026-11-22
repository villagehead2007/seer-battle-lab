'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[],stats={}){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
function holyStatus(g){const original=E.SOULS,seen=[];E.SOULS={...original,run(event,c){const out=original.run(event,c);if(event==='afterUse'&&c.a.side===1&&c.m.id==='wiki:20500')seen.push({critical:structuredClone(c.a.effects['必定暴击']),pp:c.a.pp['wiki:20500']});return out;}};let after;try{after=T.turn(g,[pp,'wiki:20500']);}finally{E.SOULS=original;}return{g:after,atUse:seen.at(-1)};}
test('2121完整原魂真下场清神圣之霆并计减少，返场新一层且敌荣光之裁真换返保留',()=>{
 let g=T.create([[member(4004,2121),member(2989)],[member(3056),member(2988)]],[0,0],{seed:14,criticals:false});assert.equal(g.battle.fighters[0].soulState.holyThunder,1);assert.equal(g.battle.fighters[1].soulState.holyVerdict,1);
 g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.equal(g.slots[0][0].fighter.soulState.holyThunder,0);assert.equal(g.slots[0][0].fighter.soulState.holyThunderSpentSerial,1);assert.equal(g.slots[1][0].fighter.soulState.holyVerdict,1);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.holyThunder,1);assert.equal(g.battle.fighters[1].soulState.holyVerdict,1);g=T.turn(g,[pp,{switchTo:0}]);assert.equal(g.battle.fighters[1].soulState.holyVerdict,1);
});
test('2121实际原抓耗层并麻痹成功赚增长，真下场清增长但零层不伪造减少，后续序号继续递增',()=>{
 let g=T.create([[member(4004,2121,[10006]),member(3056)],[member(2989)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:10006',pp]);assert.equal(g.battle.fighters[0].soulState.holyThunder,0);assert.equal(g.battle.fighters[0].soulState.holyThunderGainBonus,1);assert.equal(g.battle.fighters[0].soulState.holyThunderSpentSerial,1);
 g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.slots[0][0].fighter.soulState.holyThunder??0,0);assert.equal(g.slots[0][0].fighter.soulState.holyThunderGainBonus??0,0);assert.equal(g.slots[0][0].fighter.soulState.holyThunderSpentSerial,1);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.holyThunder,1);g=T.turn(g,['wiki:10006',pp]);assert.equal(g.battle.fighters[0].soulState.holyThunderSpentSerial,2);
});
test('2551原38473真实击败封继任者，原抓消耗或源真下场清层均解除封属且返场不复封',()=>{
 for(const route of ['attack','leave']){
  let g=T.create([[member(4004,2121,[38473,10006],{spe:9999}),member(2989)],[member(2988),member(5000,753,[20500]),member(3012)]],[0,0],{seed:14,criticals:false});g.battle.fighters[1].hp=1;
  g=T.turn(g,['wiki:38473',pp]);assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);const serial=g.battle.fighters[0].soulState.holyThunderSpentSerial,seal=g.battle.fighters[1].soulState.thunderSeal2551;assert.equal(seal.serial,serial);assert.ok(g.battle.fighters[0].soulState.holyThunder>0);
  const before=g.battle.fighters[1].pp['wiki:20500'];let status=holyStatus(g);g=status.g;assert.equal(status.atUse.pp,before-1);assert.equal(status.atUse.critical,undefined,'original status effects really sealed');
  g=T.turn(g,[pp,{switchTo:2}]);assert.equal(g.slots[1][1].fighter.soulState.thunderSeal2551.serial,serial);g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.battle.fighters[1].soulState.thunderSeal2551.serial,serial);status=holyStatus(g);g=status.g;assert.equal(status.atUse.critical,undefined,'holder leave/return keeps seal until source thunder really decreases');
  g=T.turn(g,[route==='attack'?'wiki:10006':{switchTo:1},pp]);const owner=route==='attack'?g.battle.fighters[0]:g.slots[0][0].fighter;assert.equal(owner.soulState.holyThunder,0);assert.equal(owner.soulState.holyThunderSpentSerial,serial+1);
  status=holyStatus(g);g=status.g;assert.ok(status.atUse.critical,'reduction event released actual original status');if(route==='leave'){
   g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.holyThunder,1);
   status=holyStatus(g);g=status.g;assert.ok(status.atUse.critical,'actual original status applies after source return before soul cleanup');assert.equal(g.battle.fighters[1].effects['必定暴击'],undefined,'original soul immunity-response cleanup still occurs');
  }
 }
});
