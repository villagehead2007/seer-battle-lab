'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),D=require('../dist/battle-display.js');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const pp='potion:pp';
function make(aStats={},bStats={}){return T.create([[member(4871,[10018,20065],aStats),member(2988)],[member(3102,[20117],bStats),member(3056)]],[0,0],{seed:14,criticals:false});}
test('嘲风预约反转失败后本回和下一回真实禁换，源实际离场不解除，到期下一回可真正换入',()=>{
 let g=make();assert.deepEqual(T.candidates(g,1),[1]);g=T.turn(g,[pp,pp]);assert.equal(g.battle.round,2);const lock=g.battle.fighters[1].effects['不能主动切换'];assert.deepEqual([lock.start,lock.end],[2,3]);assert.deepEqual(T.candidates(g,1),[]);const before=structuredClone(g);assert.throws(()=>T.turn(g,[pp,{switchTo:1}]),/不可换入/);assert.deepEqual(g,before);D.team(g,1);D.fighter(g.battle.fighters[1],g.battle.round);assert.deepEqual(g,before);
 g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.battle.round,3);assert.deepEqual(T.candidates(g,1),[]);g=T.turn(g,[pp,pp]);assert.equal(g.battle.round,4);assert.deepEqual(T.candidates(g,1),[1]);g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.active[1],1);
});
test('嘲风真实气力正强化被预约反转成功则不禁换，仅相应回合粉伤半减；真实敌换入不会逃过预定判定',()=>{
 let g=make();g=T.turn(g,[pp,'wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,-1);assert.equal(g.battle.fighters[0].soulState.wind2058.reductionRound,2);assert.deepEqual(T.candidates(g,1),[1]);g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.active[1],1);
 let h=make();h=T.turn(h,[pp,pp]);assert.throws(()=>T.turn(h,[pp,{switchTo:1}]),/不可换入/);assert.equal(h.active[1],0);
});
test('嘲风真实禁换不阻止阵亡后选继任，风龙结与转龙按统一规则下场重置',()=>{
 let g=make({atk:9999,spe:9999},{maxHp:10,def:1});g=T.turn(g,[pp,pp]);assert.deepEqual(T.candidates(g,1),[]);g=T.turn(g,['wiki:10018',pp]);assert.equal(g.phase,'replace');assert.deepEqual(T.candidates(g,1,true),[1]);g=T.replace(g,[null,1]);assert.equal(g.active[1],1);
 // Initial 951-count boundary; the following actual 100%异常 execution performs the documented conversion.
 let h=T.create([[member(4871),member(2988)],[member(3102),member(4822)]],[0,0],{seed:14,criticals:false});h.battle.fighters[0].soulState.wind2058.count=951;h=T.turn(h,[pp,{switchTo:1}]);assert.equal(h.battle.fighters[0].type,'龙');assert.equal(h.battle.fighters[0].soulState.wind2058.count,0);h=T.turn(h,[{switchTo:1},pp]);h=T.turn(h,[{switchTo:0},pp]);assert.equal(h.battle.fighters[0].type,store.species(4871).type);assert.equal(h.battle.fighters[0].soulState.wind2058.count,0);
});
