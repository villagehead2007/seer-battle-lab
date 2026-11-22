'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skills=[]){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const [i,k]of skills.entries())if(!moves.includes(k))moves[i+1]=k;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('武心婵红鳞实际免攻消耗后，余下黄蓝下场保留，返场不重授红鳞',()=>{
 let g=T.create([[member(4500),member(2988)],[member(3056,[10127])]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.battle.fighters[0].soulState.royalGuards.red,undefined);assert.ok(g.battle.fighters[0].soulState.royalGuards.yellow);assert.ok(g.battle.fighters[0].soulState.royalGuards.blue);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.deepEqual(Object.keys(g.slots[0][0].fighter.soulState.royalGuards).sort(),['blue','yellow']);
 const before=structuredClone(g);assert.match(D.team(g,0).find(x=>x.name.includes('三色龙鳞')).value,/黄色、蓝色.*下场保留/);assert.deepEqual(g,before);
 g=T.turn(g,[{switchTo:0},'potion:pp']);assert.deepEqual(Object.keys(g.battle.fighters[0].soulState.royalGuards).sort(),['blue','yellow']);
});
test('武心婵真实耗尽三色获白解封第五，白鳞下场消失并真实清敌强化回合盾罩，返场不重授首次三色',()=>{
 let g=T.create([[member(4500),member(2988)],[member(4516,[36662,20060])]],[0,0],{seed:13,criticals:false});const fifth=g.battle.fighters[0].moves.find(k=>g.battle.moveDefinitions[k].fifth);assert.ok(!E.availableMoves(g.battle.fighters[0]).includes(fifth));
 g=T.turn(g,['potion:pp','wiki:36662']);assert.equal(g.battle.fighters[0].soulState.royalGuards.red,undefined);assert.equal(g.battle.fighters[0].soulState.royalGuards.yellow,undefined);
 g=T.turn(g,['potion:pp','wiki:20060']);assert.ok(g.battle.fighters[0].soulState.royalGuards.white);assert.ok(g.battle.fighters[0].soulState.royalScaleContract.unlocked);assert.ok(E.availableMoves(g.battle.fighters[0]).includes(fifth));
 // The real earning path above is retained; the clear-all boundary uses a separate legal white-scale initial resource profile.
 const white=structuredClone(g.battle.fighters[0].soulState.royalGuards.white),contract=structuredClone(g.battle.fighters[0].soulState.royalScaleContract);let natural=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(natural.slots[0][0].fighter.soulState.royalGuards.white,undefined);natural=T.turn(natural,[{switchTo:0},'potion:pp']);assert.deepEqual(natural.battle.fighters[0].soulState.royalGuards,{});assert.equal(natural.battle.fighters[0].soulState.royalScaleContract.unlocked,true);
 g=T.create([[member(4500),member(2988)],[member(4516,[36662,20060])]],[0,0],{seed:13,criticals:false});g.battle.fighters[0].soulState.royalGuards={white};g.battle.fighters[0].soulState.royalScaleContract=contract;const foe=g.battle.fighters[1];foe.effects['攻击必中']={start:1,end:99};foe.stages.atk=2;foe.suitState.shield=100;foe.suitState.barrier=100;
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.soulState.royalGuards.white,undefined);assert.equal(g.battle.fighters[1].effects['攻击必中'],undefined);assert.equal(g.battle.fighters[1].stages.atk,0);assert.equal(g.battle.fighters[1].suitState.shield,0);assert.equal(g.battle.fighters[1].suitState.barrier,0);
 g=T.turn(g,[{switchTo:0},'potion:pp']);assert.deepEqual(g.battle.fighters[0].soulState.royalGuards,{});assert.equal(g.battle.fighters[0].soulState.royalScaleContract.unlocked,true);assert.ok(E.availableMoves(g.battle.fighters[0]).includes(fifth));
});
