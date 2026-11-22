'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,skills=[],overrides={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...overrides}}};}
test('哀目黑子真实瞄准后下回合痛击必暴附失神，敌下回合禁换，源离场后原期限结束真实可换',()=>{
 let g=T.create([[member(4642,[20065,10250]),member(3102)],[member(3056),member(3102)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:20065','potion:pp']);assert.deepEqual(T.candidates(g,1),[1]);g=T.turn(g,['wiki:10250','potion:pp']);assert.ok(g.battle.fighters[1].ailments['失神']>=g.battle.round-1);assert.deepEqual(T.candidates(g,1),[]);const original=structuredClone(g);assert.throws(()=>T.turn(g,['potion:pp',{switchTo:1}]),/不可|不能|切换/);assert.deepEqual(g,original);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.deepEqual(T.candidates(g,1),[1]);g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(Number(g.battle.fighters[1].number),3102);
});
test('哀目黑子真实失神被英勇圣甲免异挡住时不禁换，敌下一回合仍可实际切换',()=>{
 let g=T.create([[member(4642,[20065,10250]),member(3102)],[member(3056,[23287]),member(3102)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:20065','wiki:23287']);g=T.turn(g,['wiki:10250','potion:pp']);assert.ok(!g.battle.fighters[1].ailments['失神']);assert.deepEqual(T.candidates(g,1),[1]);g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(Number(g.battle.fighters[1].number),3102);
});

