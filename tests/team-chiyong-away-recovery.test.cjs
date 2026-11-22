'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:2000,spd:2000}}};}
function marked(foe){let g=T.create([[member(4676),member(2987)],[foe]],[0,0],{seed:14,criticals:false});g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[1].soulState.chiyong1878.layers,2);return g;}
test('蚩庸之锁来源真实离场后每回合减一层，最后一层仍禁属性，消失后真实气力可强化',()=>{
 let g=marked(member(3056,20117));g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[1].soulState.chiyong1878.layers,1);
 const before=structuredClone(g);assert.match(D.team(g,1).find(x=>x.name==='蚩庸之锁来源').value,/A 方.*不在场.*每回合减 1 层.*属性技能无效/);assert.deepEqual(g,before);
 const pp=g.battle.fighters[1].pp['wiki:20117'];g=T.turn(g,['potion:pp','wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,0);assert.equal(g.battle.fighters[1].pp['wiki:20117'],pp-1);assert.ok(!g.battle.fighters[1].soulState.chiyong1878?.layers);
 g=T.turn(g,['potion:pp','wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,1);
});
test('蚩庸之锁来源离场的最后一层仍阻断真实必中负荷电频附麻痹，消失后再次攻击实际附麻痹',()=>{
 let g=marked(member(4829,38133));g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,['potion:pp','wiki:38133']);assert.ok(!g.battle.fighters[0].ailments['麻痹']);assert.ok(!g.battle.fighters[1].soulState.chiyong1878?.layers);
 g=T.turn(g,['potion:pp','wiki:38133']);assert.ok(g.battle.fighters[0].ailments['麻痹']>=g.battle.round-1);
});
test('蚩庸之锁在来源在场时不衰减，来源返场重授登场窗口且加锁封顶三；场下锁不额外封攻击弱化',()=>{
 let g=marked(member(3056));g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[1].soulState.chiyong1878.layers,2);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[1].soulState.chiyong1878.layers,1);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[1].soulState.chiyong1878.layers,3);assert.equal(g.battle.fighters[1].effects.statusBlock.end,g.battle.round);
 g=marked(member(4676,19470));g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,['potion:pp','wiki:19470']);assert.equal(g.battle.fighters[0].stages.spd,-1);assert.equal(g.battle.fighters[0].stages.acc,-1);
});
test('米斯蒂克真实被击败视为不在场，持锁者逐回合衰减且强制补位后最后一层仍封属性',()=>{
 let g=marked(member(4829,38133));g.battle.fighters[0].hp=1;g=T.turn(g,['potion:pp','wiki:38133']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.battle.fighters[1].soulState.chiyong1878.layers,1);g=T.replace(g,[1,null]);g=T.turn(g,['potion:pp','wiki:29180']);assert.equal(g.battle.fighters[1].stages.atk,0);assert.ok(!g.battle.fighters[1].soulState.chiyong1878?.layers);
});
