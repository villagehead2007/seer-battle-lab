'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),D=require('../dist/battle-display.js');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill)){const index=moves.findIndex((m,i)=>i>0);assert.ok(index>0);moves[index]=skill;}return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
const pp='potion:pp';
test('统一下场重置灰蛾无视首次时点资格：真实星皇免粉取得后下场清除，换普通目标返场仅首次叠渐烬',()=>{
 let g=T.create([[member(4912,10086),member(2988)],[member(3291),member(2989)]],[0,0],{seed:14,criticals:false});
 g=T.turn(g,['wiki:10086',pp]);assert.equal(g.battle.fighters[0].soulState.moth2099.timingFree,true);assert.equal(g.battle.fighters[0].soulState.moth2099.embers,1);let before=structuredClone(g);assert.match(D.fighter(g.battle.fighters[0],g.battle.round,g.battle.moveDefinitions,g.battle).items.find(x=>x.name==='渐烬触发').value,/每次使用攻击技能/);assert.deepEqual(g,before);
 g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.slots[0][0].fighter.soulState.moth2099.timingFree,false,'没有明确下场保留的时点资格应在真实离场时清除');
 g=T.turn(g,[{switchTo:0},{switchTo:1}]);assert.equal(Number(g.battle.fighters[1].number),2989);assert.equal(g.battle.fighters[0].soulState.moth2099.embers,0);assert.equal(g.battle.fighters[0].soulState.moth2099.ownFirst,false);
 for(let i=0;i<2;i++){g=T.turn(g,['wiki:10086',pp]);assert.equal(g.battle.fighters[0].soulState.moth2099.timingFree,false);assert.equal(g.battle.fighters[0].soulState.moth2099.embers,1);}before=structuredClone(g);assert.match(D.fighter(g.battle.fighters[0],g.battle.round,g.battle.moveDefinitions,g.battle).items.find(x=>x.name==='渐烬触发').value,/首次攻击已使用/);assert.deepEqual(g,before);
});
