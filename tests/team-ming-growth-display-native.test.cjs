'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id){const snapshot=store.species(id);return{snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
test('铭唤真实汲取翻倍及返场重置的显示准确且读取不改状态',()=>{
 let g=T.create([[member(4785),member(2989)],[member(2989)]],[0,0],{seed:1,criticals:false});function read(){const before=structuredClone(g),items=D.team(g,0);assert.deepEqual(g,before);return items.find(x=>x.name==='铭唤当前积累')?.value;}
 g=T.turn(g,['potion:pp','potion:pp']);g=T.turn(g,['potion:pp','potion:pp']);assert.match(read(),/汲取 4%.*威力 \+0.*下场重置/);g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.match(read(),/汲取 2%.*威力 \+0.*下场重置/);
});
