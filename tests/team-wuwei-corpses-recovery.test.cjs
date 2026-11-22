'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,skills=[]){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:1000,spa:1000,def:1000,spd:1000,spe:1000}}};}
const pp='potion:pp';
function make(target=2988){const g=T.create([[member(4661,[37450]),member(3102),member(4647)],[member(target),member(3056),member(4648),member(4649)]],[0,0],{seed:14,criticals:false});g.slots[0][1].fighter.hp=0;g.slots[1][1].fighter.hp=0;g.slots[1][2].fighter.hp=0;return g;}
test('无为觉者原生律实际击败后当前与场下敌尸体全部消逝，己方尸体与敌存活者不受影响',()=>{
 let g=make();g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:37450',pp]);assert.equal(g.phase,'replace');for(const i of [0,1,2])assert.equal(g.slots[1][i].fighter.soulState.vanished,true);assert.equal(g.slots[1][3].fighter.soulState.vanished,undefined);assert.equal(g.slots[0][1].fighter.soulState.vanished,undefined);assert.equal(g.battle.fighters[0].soulState.wuwei1862.power,0);assert.deepEqual(T.candidates(g,1,true),[3]);g=T.replace(g,[null,3]);assert.equal(g.active[1],3);
});
test('无为觉者未击败与圣光灵神实际立即复活均不消逝历史场下尸体',()=>{
 for(const mode of ['alive','revive']){let g=make(mode==='revive'?3311:2988);if(mode==='revive')g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:37450',pp]);assert.ok(g.battle.fighters[1].hp>0,JSON.stringify({mode,events:g.battle.turns.at(-1).events,source:g.battle.fighters[0].stats}));assert.equal(g.slots[1][1].fighter.soulState.vanished,undefined);assert.equal(g.slots[1][2].fighter.soulState.vanished,undefined);assert.equal(g.slots[0][1].fighter.soulState.vanished,undefined);}
});
