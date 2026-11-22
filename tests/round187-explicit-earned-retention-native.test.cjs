'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp',stats=['maxHp','atk','def','spa','spd','spe'];
function member(id,soul,ids=[],overrides={}){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul&&ids.every(id=>E.WIKI.selectedMove(x,id)))||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...overrides}}};}
test('尸骸原携带自然召一具，原天道剥双系得契约100并真实致死得六面板50，真下场返场两种已获效果均保留',()=>{
 assert.equal(S.species(3847).moves.find(m=>m.id===38455).hash,'e96d1fda');assert.equal(S.species(3847).moves.find(m=>m.id===29011).hash,'f9272df2');
 let g=T.create([[member(3847,1620,[38455,29011,10250]),member(2989)],[member(3383,697),member(2989)]],[0,0],{seed:14,criticals:false});const base={...g.battle.fighters[0].stats};assert.equal(g.battle.fighters[0].soulState.corpseCount,1);
 g=T.turn(g,['wiki:29011',pp]);assert.equal(g.battle.fighters[1].type,'普通');assert.equal(g.battle.fighters[0].soulState.contractDamageBonus,100);
 for(let i=0;i<6&&g.phase==='action';i++)g=T.turn(g,['wiki:10250',pp]);assert.equal(g.phase,'replace','original attacks and native drains actually defeated the first target');assert.equal(g.battle.fighters[0].soulState.corpsePanelGain,50);for(const k of stats)assert.equal(g.battle.fighters[0].stats[k],base[k]+50,k);
 g=T.replace(g,[null,1]);g=T.turn(g,[{switchTo:1},pp]);const f=g.slots[0][0].fighter;assert.equal(f.soulState.contractDamageBonus,100);assert.equal(f.soulState.corpsePanelGain,50);for(const k of stats)assert.equal(f.stats[k],base[k]+50,k);
 g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.contractDamageBonus,100);assert.equal(g.battle.fighters[0].soulState.corpsePanelGain,50);for(const k of stats)assert.equal(g.battle.fighters[0].stats[k],base[k]+50,k);
});
test('凯旋原两预言真实消费自然获得后真下场保留，返场原重击真KO才消费并回满HP和PP，再换返不重授',()=>{
 assert.equal(S.species(4498).souls.find(s=>s.id===1713).hash,'12e539ee');
 let g=T.create([[member(4498,1713,[10047],{atk:9999,spe:9999}),member(2989)],[member(3056,410,[10127,20117],{maxHp:200,def:1000}),member(2989)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=7000;
 g=T.turn(g,[pp,'wiki:10127']);assert.ok(g.battle.fighters[1].soulState.prophecyHistory.frustration);g=T.turn(g,[pp,'wiki:20117']);assert.ok(g.battle.fighters[1].soulState.prophecyHistory.lost);assert.ok(g.battle.fighters[0].soulState.prophecies.triumph);
 g=T.turn(g,[{switchTo:1},pp]);assert.ok(g.slots[0][0].fighter.soulState.prophecies.triumph);g=T.turn(g,[{switchTo:0},pp]);assert.ok(g.battle.fighters[0].soulState.prophecies.triumph);
 const round=g.battle.round;g=T.turn(g,['wiki:10047',pp]);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].soulState.prophecies?.triumph,undefined);const recoil=g.battle.damageEvents.filter(e=>e.round===round&&e.targetSide===0).reduce((n,e)=>n+e.hpLoss,0);assert.equal(g.battle.fighters[0].hp,9000-recoil);for(const k of g.battle.fighters[0].moves)assert.equal(g.battle.fighters[0].pp[k],g.battle.moveDefinitions[k].pp);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('凯旋预言击败回复')));
 g=T.replace(g,[null,1]);g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.prophecies?.triumph,undefined,'newly granted prophecies are unconsumed, so old consumed history cannot recreate triumph');
});
