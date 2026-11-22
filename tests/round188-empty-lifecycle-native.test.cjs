'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[],overrides={}){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul&&ids.every(id=>E.WIKI.selectedMove(x,id)))||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...overrides}}};}
test('1791原第五真KO后卪成长与自然收录上限真下场重置，明确保留的自然诗章仍在且返场不重复收录',()=>{
 assert.equal(S.species(4586).souls.find(s=>s.id===1791).hash,'e1c0f316');assert.equal(S.species(4586).moves.find(m=>m.id===37005).hash,'4211afa0');
 const own=member(4586,1791,[37005],{atk:9999,spa:9999}),slot=own.moves.indexOf(37005);[own.moves[slot],own.moves[4]]=[own.moves[4],own.moves[slot]];
 let g=T.create([[own,member(2989)],[member(2988,null,[],{maxHp:1000,def:30,spd:30}),member(2989)]],[0,0],{seed:14,criticals:false});assert.equal(g.battle.fighters[0].moves[4],'wiki:37005');
 g=T.turn(g,['wiki:37005',pp]);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].soulState.emptyFifthWins1791,1);assert.equal(g.battle.fighters[0].stats.maxHp,7200);
 g=T.replace(g,[null,1]);g=T.turn(g,[pp,pp]);assert.equal(g.slots[1][0].fighter.soulState.vanished,true);assert.equal(g.battle.fighters[0].soulState.emptyVerses1791,1);assert.equal(g.battle.fighters[0].soulState.poemCapacity1791,100);assert.equal(g.battle.fighters[0].stats.maxHp,7300);
 g=T.turn(g,[{switchTo:1},pp]);const resting=g.slots[0][0].fighter;assert.equal(resting.soulState.emptyVerses1791,1);assert.equal(resting.soulState.emptyFifthWins1791,undefined);assert.equal(resting.soulState.poemCapacity1791,undefined);assert.equal(resting.stats.maxHp,9000);
 g=T.turn(g,[{switchTo:0},pp]);const returned=g.battle.fighters[0];assert.equal(returned.soulState.emptyVerses1791,1);assert.equal(returned.soulState.emptyFifthWins1791,undefined);assert.equal(returned.soulState.poemCapacity1791,undefined);assert.equal(returned.stats.maxHp,9000);assert.equal(E.SOULS.trait(returned,'attackMultiplier'),1);assert.equal(E.SOULS.trait(returned,'attackReduction'),0);
});
test('1791原首次真实致死保一后真下场清当次收益且保留已用资格，返场第二次原生致死正常阵亡',()=>{
 let g=T.create([[member(4586,1791,[],{def:1}),member(2989)],[member(3056,410,[10127],{atk:1000})]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=1;
 g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.phase,'action');assert.equal(g.battle.fighters[0].hp,1);assert.equal(g.battle.fighters[0].soulState.emptyProfane1791,true);assert.equal(g.battle.fighters[0].stats.maxHp,8800);
 g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.slots[0][0].fighter.soulState.emptyProfane1791,undefined);assert.equal(g.slots[0][0].fighter.stats.maxHp,9000);
 g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].hp,1);assert.equal(g.battle.fighters[0].stats.maxHp,9000);g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.battle.fighters[0].hp,0,'the first lethal qualification must not be reissued after real leave');assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].soulState.emptyProfaneUsed1791,true);
});
