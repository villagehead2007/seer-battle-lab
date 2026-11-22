'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function member(id,moves=[],hp=9000,spe=1000){const snapshot=store.species(id);return{snapshot,moves:loadout(snapshot,moves),build:{overrides:{maxHp:hp,atk:180,spa:180,def:4000,spd:4000,spe}}};}
function create(seed,side,ownSpeed,ponySpeed,ponyMove){const rosters=[[member(3512,[31505]),member(2989,[10086],6000,ownSpeed)],[member(5000,[ponyMove],9000,ponySpeed)]];let g=T.create(side?rosters.slice().reverse():rosters,[0,0],{seed,criticals:false});g=T.turn(g,side?['potion:pp','wiki:31505']:['wiki:31505','potion:pp']);assert.equal(g.phase,'replace');g=T.replace(g,side?[null,1]:[1,null]);assert.equal(g.battle.fighters[side].soulState.teamFirstCrit1275,2);return g;}
function attack(g,side,ponyMove){const round=g.battle.round,out=T.turn(g,side?['wiki:'+ponyMove,'wiki:10086']:['wiki:10086','wiki:'+ponyMove]);assert.equal(out.battle.fighters[1-side].soulState.pony753.firstRound,round);assert.equal(out.battle.fighters[side].soulState.teamFirstCrit1275,1);return out.battle.turns.at(-1).first;}
test('31505真实KO传承三档必先与753高体一档同场，双座位一档始终优先，不被数值先制和速度反超',()=>{
 for(const side of[0,1]){assert.equal(attack(create(14,side,4000,100,17912),side,17912),1-side,'grade1 pony');assert.equal(attack(create(14,side,4000,100,10993),side,10993),1-side,'grade1 beats faster grade3');assert.equal(attack(create(14,side,100,4000,10993),side,10993),1-side,'grade1 remains first');}
});
test('31505与753不同档必先且同数值先制同速度，真实初始种子改变也不能推翻一档753',()=>{
 const results=new Set();for(let seed=1;seed<=8;seed++)results.add(attack(create(seed,0,1000,1000,10993),0,10993));assert.deepEqual([...results],[1]);
});
