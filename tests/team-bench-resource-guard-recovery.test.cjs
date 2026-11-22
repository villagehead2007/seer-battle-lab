'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skill,stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,...stats}}};}
test('娜诺在场下存活时真实36662不能扣非满体队友，满体第一次仍可扣，源实际阵亡后不再保护',()=>{
 for(const nano of [false,true]){
  let g=T.create([[member(3056),member(nano?4814:2987),member(2988)],[member(4516,36662)]],[0,0],{seed:13,criticals:false});
  for(const slot of g.slots[0].slice(1))slot.fighter.hp=4000;g.battle.fighters[0].stages.def=1;
  if(nano){const before=structuredClone(g);assert.ok(D.team(g,0).some(x=>x.name==='娜诺场下守护'));assert.deepEqual(g,before);}
  g=T.turn(g,['potion:pp','wiki:36662']);assert.equal(g.slots[0].slice(1).reduce((n,s)=>n+s.fighter.hp,0),nano?8000:5750);
 }
 let g=T.create([[member(3056),member(4814),member(2988)],[member(4516,36662)]],[0,0],{seed:13,criticals:false});g.battle.fighters[0].stages.def=1;
 g=T.turn(g,['potion:pp','wiki:36662']);assert.equal(g.slots[0].slice(1).reduce((n,s)=>n+s.fighter.hp,0),15750);
 // Separate non-full initial profile; the first full-member real loss is asserted above.
 g=T.create([[member(3056),member(4814),member(2988)],[member(4516,36662)]],[0,0],{seed:13,criticals:false});for(const slot of g.slots[0].slice(1))slot.fighter.hp=4000;const before=g.slots[0].slice(1).map(s=>s.fighter.hp);g.battle.fighters[0].stages.def=1;
 g=T.turn(g,['potion:pp','wiki:36662']);assert.deepEqual(g.slots[0].slice(1).map(s=>s.fighter.hp),before);
 const foe=member(4516,36662,{atk:9999});const pure=foe.snapshot.moves.find(m=>m.power>0&&m.effectInstances.length===0);assert.ok(pure);foe.moves[2]=pure.id;
 g=T.create([[member(4814),member(2988),member(3056)],[foe]],[0,0],{seed:13,criticals:false});g.slots[0][2].fighter.hp=4000;g.slots[0][1].fighter.stages.def=1;g.battle.fighters[0].hp=1;
 g=T.turn(g,['potion:pp','wiki:'+pure.id]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 g=T.turn(g,['potion:pp','wiki:36662']);assert.equal(g.slots[0][2].fighter.hp,1750);
});
test('武心婵在背包时真实神游众生归渺不能扣敌场下PP，在场用招仍正常扣自身PP',()=>{
 for(const royal of [false,true]){
  let g=T.create([[member(3986,33894),member(royal?4500:2987)],[member(3056),member(2987),member(2988)]],[0,0],{seed:13,criticals:false});
  const before=g.slots[1].slice(1).map(s=>({...s.fighter.pp})),key='wiki:33894',own=g.battle.fighters[0].pp[key];g=T.turn(g,[key,'potion:pp']);assert.equal(g.battle.fighters[0].pp[key],own-1);
  const decreased=g.slots[1].slice(1).filter((s,i)=>s.fighter.moves.some(k=>s.fighter.pp[k]<before[i][k])).length;assert.equal(decreased,royal?0:1);
 }
});
test('武心婵保护双方场下HP，真实36662消强成功仍不扣双方场下满体成员',()=>{
 for(const royalSide of [0,1]){
  let g=T.create([[member(3056),...(royalSide===0?[member(4500)]:[]),member(2988)],[member(4516,36662),...(royalSide===1?[member(4500)]:[])]],[0,0],{seed:13,criticals:false});g.battle.fighters[0].stages.def=1;
  const before=structuredClone(g);for(const side of [0,1])assert.match(D.team(g,side).find(x=>x.name==='场下资源保护').value,new RegExp('来源 '+(royalSide===0?'A 方':'B 方')+' 武心婵'));assert.deepEqual(g,before);
  g=T.turn(g,['potion:pp','wiki:36662']);assert.equal(g.battle.fighters[0].stages.def,0);assert.ok(g.slots[0].slice(1).every(s=>s.fighter.hp===9000));
 }
});
