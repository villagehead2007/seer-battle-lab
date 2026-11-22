'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[]){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
test('2472原蔑天行真打全队，帝君原免固使下次乘至16，源真下场清累计返场原技再次只打场下4',()=>{
 assert.equal(S.species(4444).moves.find(m=>m.id===38384).hash,'861ebb39');let g=T.create([[member(4444,2085,[38384]),member(2989)],[member(3550,849),member(2989)]],[0,0],{seed:14,criticals:false});const hp=g.slots[1][1].fighter.hp;
 g=T.turn(g,['wiki:38384',pp]);assert.equal(g.slots[1][1].fighter.hp,hp-4);assert.equal(g.battle.fighters[0].soulState.ghostFixedAmount,16,'the real active849 native immunity made exactly one target fail to take fixed damage');
 g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.slots[0][0].fighter.soulState.ghostFixedAmount,undefined);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.ghostFixedAmount,undefined);
 const before=g.slots[1][1].fighter.hp;g=T.turn(g,['wiki:38384',pp]);assert.equal(g.slots[1][1].fighter.hp,before-4,'new entry uses original4 rather than old16');assert.equal(g.battle.fighters[0].soulState.ghostFixedAmount,16);
});
