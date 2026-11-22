'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id){const snapshot=store.species(id);return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000}}};}
test('场下启灵元神神印真实主动换入逐只累计一二三层，伤害按来源上限计算且第三层封顶',()=>{
 const source=member(3986);source.build.overrides.maxHp=6000;let g=T.create([[member(3056),source],[member(2987),member(2988)]],[0,0],{seed:13,criticals:false});
 const entries=[1,0,1,0,1,0,1];
 for(const [i,target]of entries.entries()){
  const r=g.battle.round;g=T.turn(g,['potion:pp',{switchTo:target}]);const n=Math.min(3,1+Math.floor(i/2));assert.equal(g.battle.fighters[1].soulState.holyMarks,n);
  const before=structuredClone(g);assert.match(D.fighter(g.battle.fighters[1],g.battle.round).items.find(x=>x.name==='神印').value,new RegExp(String(n)));assert.deepEqual(g,before);
  const hits=g.battle.damageEvents.filter(e=>e.round===r&&e.targetSide===1&&e.type==='true');assert.equal(hits.length,1);assert.equal(hits[0].settledDamage,[0,750,1000,1500][n]);
 }
});
test('神照只在实际首发首次登场授来源上限三成盾，换回首发不重复授盾',()=>{
 const source=member(3986);source.build.overrides.maxHp=6000;let g=T.create([[member(3056),source],[member(2988)]],[0,0],{seed:13,criticals:false});
 assert.equal(g.battle.fighters[0].suitState.shield,1800);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].suitState.shield,0);
 g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].suitState.shield,0);
});
test('神秘结界按真实二至六只存活人数限制名额，不含在场及阵亡成员，源下场解除',()=>{
 for(let count=2;count<=6;count++){
  const foes=[3056,2987,2988,3102,3311,3432].slice(0,count).map(member);let g=T.create([[member(3986),member(2987)],foes],[0,0],{seed:13,criticals:false});
  const positions=g.battle.teamExile1246[1].positions,max=Math.min(count-2,count>=5?3:2);
  assert.ok(positions.length>=Math.min(1,max)&&positions.length<=max);assert.ok(positions.every(i=>i!==0&&g.slots[1][i].fighter.hp>0));
  assert.ok(positions.every(i=>!T.candidates(g,1).includes(i)&&T.candidates(g,1,true).includes(i)));
  g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.teamExile1246[1],null);assert.equal(T.candidates(g,1).length,count-1);
 }
});
