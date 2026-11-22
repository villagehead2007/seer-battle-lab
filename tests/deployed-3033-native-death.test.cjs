'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3033-native.cjs'),pp='potion:pp';
function member(id,moves=[],stats={}){const snapshot=store.species(id);return{snapshot,moves:loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
function setup(){const g=T.create([[member(3033,[],{def:1}),member(2988),member(3056)],[member(2989,[24624,10086],{atk:9999})]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=100;return g;}
test('3033真实393被敌原生攻击击败才吸双防正二清敌全部PP和回合，玩家指定第二替补独享继承',()=>{
 let g=setup();g=T.turn(g,[pp,'wiki:24624']);assert.equal(g.battle.fighters[1].stages.def,2);assert.equal(g.battle.fighters[1].stages.spd,2);assert.ok(Object.keys(g.battle.fighters[1].effects).length>0);g=T.turn(g,[pp,'wiki:10086']);assert.equal(g.slots[0][0].fighter.hp,0);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[1].stages.def,0);assert.equal(g.battle.fighters[1].stages.spd,0);assert.ok(Object.values(g.battle.fighters[1].pp).every(n=>n===0));assert.deepEqual(g.battle.fighters[1].effects,{});g=T.replace(g,[2,null]);assert.equal(g.active[0],2);assert.equal(g.battle.fighters[0].stages.def,2);assert.equal(g.battle.fighters[0].stages.spd,2);assert.ok(Object.values(g.slots[0][1].fighter.stages).every(n=>n===0));g=T.turn(g,[{switchTo:1},pp]);assert.ok(Object.values(g.battle.fighters[0].stages).every(n=>n===0));
});
test('3033真实主动换下不触发393，敌方正双防回合及PP保持，继任者不获强化',()=>{
 let g=setup();g=T.turn(g,[pp,'wiki:24624']);g=T.turn(g,[{switchTo:2},pp]);assert.ok(g.slots[0][0].fighter.hp>0);assert.equal(g.battle.fighters[1].stages.def,2);assert.ok(Object.keys(g.battle.fighters[1].effects).length>0);assert.ok(Object.values(g.battle.fighters[1].pp).every(n=>n>0));assert.ok(Object.values(g.battle.fighters[0].stages).every(n=>n===0));
});
test('3033真实393敌无正级仍清PP，不把原有负级转给继任者也不将其清零',()=>{
 let g=setup();g.battle.fighters[1].stages.def=-2;g=T.turn(g,[pp,'wiki:10086']);assert.equal(g.battle.fighters[1].stages.def,-2);assert.ok(Object.values(g.battle.fighters[1].pp).every(n=>n===0));g=T.replace(g,[2,null]);assert.ok(Object.values(g.battle.fighters[0].stages).every(n=>n===0));
});
