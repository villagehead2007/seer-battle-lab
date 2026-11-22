'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,soul,skills=[]){const snapshot=structuredClone(store.species(id));if(soul)snapshot.selectedSoulId=soul;const moves=E.WIKI.defaultMoves(snapshot);for(const skill of skills)if(!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:9999,spa:180,def:4000,spd:4000,spe:9999}}};}
test('奥菲利娅原与强化真实场下终命支援遵守活薇尔诗的场下指定限制，未支援不获晨星',()=>{
 for(const version of [1901,1940]){let g=T.create([[member(3102,null,[10127]),member(4706,version),member(4000)],[member(4925),member(2988)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=3000;g.battle.fighters[1].hp=1;assert.equal(E.benchCanTarget(g.battle,g.slots[0][1].fighter,g.battle.fighters[0]),false);g=T.turn(g,['wiki:10127',pp]);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,3000);assert.equal(g.slots[0][1].fighter.soulState.ophelia4706.stars,0);}
});
test('奥菲利娅原与强化真实离开骑士决斗获得落败后，不再从场下触发队友KO终命支援',()=>{
 for(const version of [1901,1940]){let g=T.create([[member(4706,version),member(3102,null,[10127])],[member(4911),member(4925)]],[0,0],{seed:14,criticals:false});g.slots[0][1].fighter.hp=3000;g.battle.fighters[1].hp=1;g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.slots[0][0].fighter.soulState.knightDuel4911.kind,'defeat');g=T.turn(g,['wiki:10127',pp]);assert.equal(g.battle.fighters[1].hp,0);assert.equal(g.battle.fighters[0].hp,3000);assert.equal(g.slots[0][0].fighter.soulState.ophelia4706.stars,0);}
});
