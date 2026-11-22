'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('卡布达真实雷祭三次被登场免疫后计数三，实际换下返场重新按当前HP授免疫且本次计数归零',()=>{
 let g=T.create([[member(4829),member(2987)],[member(3576,20085)]],[0,0],{seed:require('../research/TEAM-STAGE-2/kabuda-entry-seeds-v2.json').numeric,criticals:false});
 for(let i=1;i<=3;i++){g=T.turn(g,['potion:pp','wiki:20085']);assert.equal(g.battle.fighters[0].soulState.kabuda2019.count,i);assert.ok(!g.battle.fighters[0].ailments['麻痹']);}
 g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);let f=g.battle.fighters[0];assert.equal(f.soulState.kabuda2019.count,0);assert.equal(f.soulState.kabuda2019.entryEnd,g.battle.round+1);
 const before=structuredClone(g),items=D.fighter(f,g.battle.round).items;assert.equal(items.find(x=>x.name==='本次在场免疫或转化').value,'0 / 4 次');assert.equal(items.find(x=>x.name==='攻击后吸取比例').value,'20%');assert.deepEqual(g,before);
 g=T.turn(g,['potion:pp','wiki:20085']);assert.equal(g.battle.fighters[0].soulState.kabuda2019.count,1);assert.ok(!g.battle.fighters[0].ailments['麻痹']);
});
test('卡布达首次晚入场按进入时HP的30%严格分档，战阶随后回血不追补登场免疫',()=>{
 for(const hp of [2699,2700,5399,5400]){
  let g=T.create([[member(2987),member(4829)],[member(3056)]],[0,0],{seed:42,criticals:false});g.slots[0][1].fighter.hp=hp;const round=g.battle.round;
  g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.kabuda2019.entryEnd,round+Math.floor(hp/2700)-1);assert.equal(g.battle.fighters[0].soulState.kabuda2019.count,0);assert.equal(g.battle.fighters[0].hp,hp+3000);
 }
});
