'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id){const snapshot=store.species(id);return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:500,spa:100}}};}
const potion='potion:pp';
test('天启星魂真实星赐到期转一刻，主动离场保盘且场下不回返，再登场重新星启',()=>{
 let g=T.create([[member(4677),member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 assert.ok(g.battle.fighters[0].ailments['星赐']>=1);
 g=T.turn(g,[potion,potion]);g=T.turn(g,[potion,potion]);
 assert.equal(g.battle.fighters[0].soulState.astrolabe1879.ticks,1);
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState.astrolabe1879.ticks,1);
 assert.equal(D.team(g,0).find(x=>x.name==='星辰万象·天启星魂 · 星盘').value,'1 / 12 刻 · 前进');
 g=T.turn(g,[potion,potion]);assert.equal(g.slots[0][0].fighter.soulState.astrolabe1879.ticks,1);
 g=T.turn(g,[{switchTo:0},potion]);const f=g.battle.fighters[0];
 assert.equal(f.soulState.astrolabe1879.ticks,1);assert.ok(f.ailments['星赐']>=g.battle.round-1);
 assert.equal(f.soulState.astrolabe1879.lastEnlightenment.round,g.battle.round-1);
 const before=structuredClone(g);assert.equal(D.fighter(f,g.battle.round).items.find(x=>x.name==='星盘').value,'1 / 12 刻 · 前进');assert.deepEqual(g,before);
});
test('天启星魂十二刻回返中离场不消刻，返场额外行动才实际扣一刻并显示回返',()=>{
 let g=T.create([[member(4677),member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].soulState.astrolabe1879.ticks=11;g.battle.fighters[0].ailments['烧伤']=1;
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].soulState.astrolabe1879.ticks,12);assert.equal(g.battle.fighters[0].soulState.astrolabe1879.rewinding,true);
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState.astrolabe1879.ticks,12);
 g=T.turn(g,[potion,potion]);assert.equal(g.slots[0][0].fighter.soulState.astrolabe1879.ticks,12);
 const round=g.battle.round;g=T.turn(g,[{switchTo:0},potion]);const f=g.battle.fighters[0];
 assert.equal(f.soulState.astrolabe1879.ticks,11);assert.equal(f.soulState.astrolabe1879.rewinding,true);
 assert.ok(g.battle.damageEvents.some(e=>e.round===round&&e.sourceSide===0&&e.moveKey==='soul:1879:rewind'&&e.settledDamage===120));
 assert.equal(D.fighter(f,g.battle.round).items.find(x=>x.name==='星盘').value,'11 / 12 刻 · 回返');
});
