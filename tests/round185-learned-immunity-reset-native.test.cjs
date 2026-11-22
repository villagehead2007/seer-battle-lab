'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[]){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
test('2497原白皑两次真实束缚学给全队，受益者首次上场仍免而真下场清学习，源真下场同步清自身双份学习',()=>{
 assert.equal(S.species(4000).moves.find(m=>m.id===29371).hash,'6ea7f2c9');
 let g=T.create([[member(4000,2098,[29371]),member(2989),member(2994)],[member(4995,2144,[38549])]],[0,0],{seed:14,criticals:false});
 g=T.turn(g,[pp,'wiki:38549']);assert.ok(g.battle.fighters[0].soulState.verse2098.entryImmuneHistory.includes('束缚'));assert.equal(g.battle.fighters[0].ailments['束缚'],undefined);
 g=T.turn(g,[pp,'wiki:38549']);assert.ok(g.battle.fighters[0].ailments['束缚']>=g.battle.round-1);
 g=T.turn(g,['wiki:29371',pp]);assert.deepEqual(g.battle.fighters[0].soulState.permanentAilments2497,['束缚']);assert.deepEqual(g.battle.fighters[0].soulState.verse2098.permanentAilments,['束缚']);assert.deepEqual(g.slots[0][1].fighter.soulState.permanentAilments2497,['束缚']);assert.deepEqual(g.slots[0][2].fighter.soulState.permanentAilments2497,['束缚']);
 g=T.turn(g,[{switchTo:1},'wiki:38549']);assert.equal(g.battle.fighters[0].ailments['束缚'],undefined,'beneficiary first real entry keeps the previously granted immunity');
 assert.equal(g.slots[0][0].fighter.soulState.permanentAilments2497,undefined);assert.deepEqual(g.slots[0][0].fighter.soulState.verse2098?.permanentAilments??[],[],'source nested trait list also resets rather than silently retaining the learned immunity');
 g=T.turn(g,[{switchTo:2},pp]);assert.equal(g.slots[0][1].fighter.soulState.permanentAilments2497,undefined);assert.deepEqual(g.battle.fighters[0].soulState.permanentAilments2497,['束缚'],'untouched teammate keeps its own grant');
 g=T.turn(g,[{switchTo:1},'wiki:38549']);assert.ok(g.battle.fighters[0].ailments['束缚']>=g.battle.round-1,'returning beneficiary now actually receives original binding');assert.equal(g.battle.fighters[0].soulState.permanentAilments2497,undefined);
});
