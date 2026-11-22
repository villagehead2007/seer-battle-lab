'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skill=null){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000}}};}
test('幽美真实每次登场回合敌主动换入才加诡符，四道封顶、下场保留且每次主动下场真实扣每道50体力',()=>{
 let g=T.create([[member(4535),member(3056)],[member(3056),member(3102)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.battle.fighters[1].soulState.guiFu1747,1);let expected=9000;
 for(let cycle=1;cycle<=5;cycle++){
  const n=Math.min(cycle,4);assert.equal(g.battle.fighters[1].soulState.guiFu1747,n);g=T.turn(g,[{switchTo:1},{switchTo:0}]);expected-=n*50;assert.equal(g.slots[1][1].fighter.hp,expected);assert.equal(g.slots[1][1].fighter.soulState.guiFu1747,n);assert.equal(g.battle.fighters[1].soulState.guiFu1747,undefined);g=T.turn(g,[{switchTo:0},{switchTo:1}]);assert.equal(g.battle.fighters[1].soulState.guiFu1747,Math.min(4,n+1));assert.equal(g.battle.fighters[1].hp,expected);
 }
 const before=structuredClone(g),items=D.fighter(g.battle.fighters[1],g.battle.round).items;assert.equal(items.filter(x=>x.name==='诡符').length,1);assert.equal(items.find(x=>x.name==='诡符').value,'4 / 4 道');assert.match(items.find(x=>x.name==='诡符下场扣血').value,/200 点.*至少剩1体力.*60%/);assert.deepEqual(g,before);
});
test('幽美非登场回合敌主动换人不补诡符，诡符低体主动下场只扣至一且不被盾罩免伤阻挡',()=>{
 let g=T.create([[member(4535),member(3056)],[member(3056),member(3102)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['potion:pp','potion:pp']);g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.battle.fighters[1].soulState.guiFu1747,undefined);g=T.turn(g,[{switchTo:1},{switchTo:0}]);g=T.turn(g,[{switchTo:0},{switchTo:1}]);assert.equal(g.battle.fighters[1].soulState.guiFu1747,1);
 // Isolated legal initial low-HP boundary; the native earning path is proved above and in the previous case.
 g=T.create([[member(4535),member(3056)],[member(3056),member(3102)]],[0,1],{seed:14,criticals:false});g.battle.fighters[1].soulState.guiFu1747=1;g.battle.fighters[1].hp=50;g.battle.fighters[1].effects['攻击伤害免疫']={start:1,end:99};g.battle.fighters[1].suitState.shield=500;g.battle.fighters[1].suitState.barrier=500;const round=g.battle.round;g=T.turn(g,['potion:pp',{switchTo:0}]);assert.equal(g.slots[1][1].fighter.hp,1);assert.equal(g.slots[1][1].fighter.soulState.guiFu1747,1);assert.ok(g.battle.healthLossEvents.some(x=>x.round===round&&x.targetSide===1&&x.requested===50&&x.hpLoss===49));
});
test('幽美真实返场重新消敌实际气力强化并施害怕，无可消强化时不凭空施加',()=>{
 let g=T.create([[member(4535),member(3056)],[member(3056,20117)]],[0,0],{seed:14,criticals:false});assert.ok(!g.battle.fighters[1].ailments['害怕']);g=T.turn(g,[{switchTo:1},'wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,1);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[1].stages.atk,0);assert.ok(g.battle.fighters[1].ailments['害怕']>=g.battle.round);
});
