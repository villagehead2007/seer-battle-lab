'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id){const snapshot=store.species(id);return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000}}};}
function start(){return T.create([[member(4950),member(2988)],[member(3056),member(2987),member(3550)]],[0,0],{seed:13,criticals:false});}
test('讨在通用场下目标入口给实际己方提供者连诛，重复指定只受一笔八分之一真伤',()=>{
 let g=start();const target=g.battle.fighters[1],provider=g.slots[1][1].fighter,other=g.slots[1][2].fighter;
 target.soulState.tao2149={sourceSide:0,sourceHash:'d97331c9'};
 assert.equal(E.tryBenchTarget(g.battle,provider,target),true);
 assert.equal(E.tryBenchTarget(g.battle,provider,target),true);
 assert.equal(provider.soulState.lianzhu2149,true);assert.ok(!other.soulState.lianzhu2149);
 const hit=g.battle.fighters[0].moves.find(k=>g.battle.moveDefinitions[k].power>0&&k!=='wiki:38568');
 const hp=provider.hp;g=T.turn(g,[hit,'potion:pp']);
 assert.equal(g.slots[1][1].fighter.hp,hp-1125);
 assert.equal(g.battle.damageEvents.filter(e=>e.type==='true'&&e.settledDamage===1125).length,1);
});
test('讨指定被场下封锁拒绝、无讨、敌方来源或在场来源时不授连诛，纯合法性检查不授状态',()=>{
 for(const mode of ['blocked','unmarked','enemy','active','probe']){
  const g=start(),target=g.battle.fighters[1];target.soulState.tao2149={sourceSide:0,sourceHash:'d97331c9'};
  let provider=g.slots[1][1].fighter;
  if(mode==='blocked')g.battle.teamBenchTargetBlockThrough=[0,g.battle.round];
  if(mode==='unmarked')delete target.soulState.tao2149;
  if(mode==='enemy')provider=g.slots[0][1].fighter;
  if(mode==='active')provider=target;
  const before=JSON.stringify(g);
  const allowed=(mode==='probe'?E.benchCanTarget:E.tryBenchTarget)(g.battle,provider,target);
  assert.equal(allowed,mode!=='blocked');assert.ok(!provider.soulState.lianzhu2149);
  if(mode==='probe')assert.equal(JSON.stringify(g),before);
 }
});
test('圣荷慰心真实场下支援击败者时授连诛，场下封锁时不触发支援也不授标记',()=>{
 for(const blocked of [false,true]){
  const lotus=member(3888);lotus.moves[1]=38583;
  const attacker=member(2987);attacker.moves[1]=10004;attacker.build.overrides.spe=9999;
  let g=T.create([[member(3056),member(4950)],[attacker,lotus]],[0,0],{seed:13,criticals:false});
  g.battle.fighters[0].hp=1;g.battle.fighters[1].soulState.tao2149={sourceSide:0,sourceHash:'d97331c9'};
  g.slots[1][1].fighter.hp=2000;
  if(blocked)g.battle.teamBenchTargetBlockThrough=[0,g.battle.round];
  g=T.turn(g,['potion:pp','wiki:10004']);assert.equal(g.phase,'replace');
  assert.equal(!!g.slots[1][1].fighter.soulState.lianzhu2149,!blocked);
  assert.equal(g.slots[1][1].fighter.hp,blocked?2000:5000);
 }
});
test('帝皇之戎副位存活时星皇不能指定普通讨持有者，展示查询不授连诛且不改变随机序列',()=>{
 const D=require('../dist/battle-display.js');
 let g=T.create([[member(4950)],[member(3056),member(3291)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].soulState.tao2149={sourceSide:0,sourceHash:'d97331c9'};g.battle.fighters[1].hp=4000;
 const before=JSON.stringify(g);for(let i=0;i<3;i++){D.team(g,0);D.team(g,1);}
 assert.equal(JSON.stringify(g),before);
 g=T.turn(g,['potion:pp','potion:pp']);
 assert.equal(g.battle.fighters[1].hp,4000);assert.ok(!g.slots[1][1].fighter.soulState.lianzhu2149);
});
