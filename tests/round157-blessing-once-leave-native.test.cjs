'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function make(){const member=(id,ids,stats)=>{const snapshot=S.species(id);return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:100,...stats}}};};const g=T.create([[member(3586,[],{def:1}),member(2989,[],{})],[member(2989,[10086],{atk:9999,spe:3000})]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=1000;return g;}
test('879原API每场一次圣战祝福真实触发后换下返场仍已消费，次轮致命不得再触发',()=>{
 let g=make();g=T.turn(g,[pp,'wiki:10086']);assert.equal(g.battle.fighters[0].hp,4500);assert.equal(g.battle.fighters[0].soulState.warBlessed,true);g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.warBlessed,true,'once-per-battle consumed flag retained');assert.equal(g.battle.fighters[0].soulState.warBlessingRound,1,'original protection absolute round retained');g=T.turn(g,[pp,'wiki:10086']);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[1].hp,4500,'no repeated half-HP percentage payload');
});
test('879原祝福未触发就真实换下返场不虚记消费，之后首次真实致命仍保半体附半体',()=>{
 let g=make();g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.warBlessed,undefined);g=T.turn(g,[pp,'wiki:10086']);assert.equal(g.battle.fighters[0].hp,4500);assert.equal(g.battle.fighters[1].hp,4500);assert.equal(g.battle.fighters[0].soulState.warBlessingRound,3);
});
