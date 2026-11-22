'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),D=require('../dist/battle-display.js');
function member(id,skills=[],soul=null){const snapshot=store.species(id);if(soul!==null)snapshot.selectedSoulId=soul;const moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
const pp='potion:pp';
test('拉克希斯真实天破百战2446在非重铸场按印记附着己方最高一二三号圣剑并消费一柄',()=>{
 for(const soul of [1434,1703])for(const level of [1,2,3]){let g=T.create([[member(4216,[38454],soul)],[member(3056)]],[0,0],{seed:14,criticals:false});g.battle.holySwords=[level,3];g.battle.swordReforge=[false,false];g.battle.fighters[1].soulState.executionMarks=1;const before=structuredClone(g);assert.match(D.team(g,0).find(x=>x.name==='天破百战附剑').value,new RegExp('最高 '+level+' 号.*消耗1柄'));assert.deepEqual(g,before);g=T.turn(g,['wiki:38454',pp]);assert.equal(g.battle.holySwords[0],level-1);assert.equal(g.battle.holySwords[1],3);assert.equal(g.battle.fighters[0].soulState.swordUse1547.level,level);assert.ok(g.battle.damageEvents.some(e=>e.round===1&&e.sourceSide===0&&e.type==='true'&&e.settledDamage===50+50*level));}
});
test('天破百战无处决印记或己方无剑不附着，其他技能即使有印记有剑也不走2446',()=>{
 for(const mode of ['no-mark','no-sword','other-move']){let g=T.create([[member(4216,[38454,10086])],[member(3056)]],[0,0],{seed:14,criticals:false});g.battle.holySwords=[mode==='no-sword'?0:3,3];g.battle.swordReforge=[false,false];if(mode!=='no-mark')g.battle.fighters[1].soulState.executionMarks=1;g=T.turn(g,[mode==='other-move'?'wiki:10086':'wiki:38454',pp]);assert.equal(g.battle.holySwords[0],mode==='no-sword'?0:3);assert.equal(g.battle.fighters[0].soulState.swordUse1547,undefined);}
});
test('圣华原生生杀予夺实际生成三剑，剑灵晚入标记当前敌，拉克希斯随后真实接替天破百战消费最高三号',()=>{
 let g=T.create([[member(4321,[35620]),member(4400),member(4216,[38454])],[member(3056),member(2988)]],[0,0],{seed:14,criticals:false});for(let i=0;i<3;i++)g=T.turn(g,['wiki:35620',pp]);assert.equal(g.battle.holySwords[0],3);assert.equal(!!g.battle.swordReforge?.[0],false);g=T.turn(g,[{switchTo:1},pp]);assert.ok(g.battle.fighters[1].soulState.executionMarks>0);g=T.turn(g,[{switchTo:2},pp]);g=T.turn(g,['wiki:38454',pp]);assert.equal(g.battle.fighters[0].soulState.swordUse1547.level,3);assert.equal(g.battle.holySwords[0],2);
});
