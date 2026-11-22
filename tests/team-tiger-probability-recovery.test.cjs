'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,def:1000,spd:1000}}};}
test('关银屏按最新统一规则换下清40增伤与焚烬概率，返场50概率重新叠到最高60',()=>{
 let g=T.create([[member(4663,10001),member(2987)],[member(2988)]],[0,0],{seed:14,criticals:false});
 const probability=()=>E.SOULS.registry[1867].abilities.probability({a:g.battle.fighters[0]});
 for(let i=0;i<4;i++)g=T.turn(g,['wiki:10001','potion:pp']);assert.equal(g.battle.fighters[0].soulState.tiger1867.layers,3);assert.ok(Math.abs(probability()-.7)<1e-9);
 g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,['potion:pp','potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);
 assert.equal(g.battle.fighters[0].soulState.tiger1867.layers,0);assert.ok(Math.abs(probability()-.5)<1e-9);
 for(let i=1;i<=3;i++){g=T.turn(g,['wiki:10001','potion:pp']);assert.equal(g.battle.fighters[0].soulState.tiger1867.layers,i);assert.ok(Math.abs(probability()-(i===3?.6:.5))<1e-9);}
 const before=structuredClone(g),items=D.fighter(g.battle.fighters[0],g.battle.round).items;assert.match(items.find(x=>x.name==='本次在场攻击增伤').value,/120%/);assert.equal(items.find(x=>x.name==='本场焚烬概率').value,'60% · 下场重置');assert.deepEqual(g,before);
});
