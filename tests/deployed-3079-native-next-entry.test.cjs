'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3079-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,hp=9000,moves=[]){const snapshot=store.species(id);return{snapshot,moves:H.loadout(snapshot,moves),build:{overrides:{maxHp:hp,atk:1200,spa:1200,def:4000,spd:4000,spe:1000}}};}
test('3079雷暴67依人答真实KO后指定继任者扣2250当前HP但上限9000不变，未KO及第二继任者不扣',()=>{
 for(const ko of[false,true]){let g=T.create([[member(3079,9000,[16105])],[member(2989,ko?1:9000),member(3004),member(3014)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:16105',pp]);if(ko)g=T.replace(g,[null,1]);else g=T.turn(g,[pp,{switchTo:1}]);assert.equal(Number(g.battle.fighters[1].number),3004);assert.equal(g.battle.fighters[1].stats.maxHp,9000);assert.equal(g.battle.fighters[1].hp,ko?6750:9000);assert.equal(g.slots[1][2].fighter.hp,9000);g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[1].hp,ko?6750:9000);g=T.turn(g,[pp,{switchTo:2}]);assert.equal(g.battle.fighters[1].hp,9000);assert.equal(g.battle.fighters[1].stats.maxHp,9000);}
});
test('3079第五910真实本招KO后继任者两轮属性无效仍扣PP，第三轮恢复；未KO主动换人不封',()=>{
 for(const ko of[false,true]){let g=T.create([[member(3079,9000,[19481])],[member(2989,ko?1:9000),member(3004,9000,[20444]) ]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:19481',pp]);if(ko)g=T.replace(g,[null,1]);else g=T.turn(g,[pp,{switchTo:1}]);const firstRound=g.battle.round;for(let n=0;n<3;n++){g=T.turn(g,[pp,'wiki:20444']);assert.equal(g.battle.fighters[1].stages.def,ko?Math.max(0,n-1):n+1);assert.equal(g.battle.fighters[1].pp['wiki:20444'],20-n-1);if(ko)assert.equal(firstRound,2);}}
});
