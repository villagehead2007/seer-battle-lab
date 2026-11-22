'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3141-native.cjs');
test('3141天雷阵真实七成命中和天雷地动两成减速存在成败，免异免弱分别阻附效',()=>{
 const fear=new Set(),slow=new Set();for(let seed=1;seed<=32;seed++){let s=H.turn(H.make(22200,{seed}),22200);fear.add(!!s.fighters[1].ailments['害怕']);s=H.turn(H.make(14116,{seed,aStages:{acc:6}}),14116);slow.add(s.fighters[1].stages.spe);}
 assert.equal(fear.size,2);assert.deepEqual([...slow].sort(),[-1,0]);let s=H.turn(H.make(22200,{aStages:{acc:6},bEffects:{免异常:{start:1,end:3}}}),22200);assert.equal(s.fighters[1].ailments['害怕'],undefined);s=H.turn(H.make(14116,{enemyId:3291,aStages:{acc:6}}),14116);assert.equal(s.fighters[1].stages.spe,0);
});
test('3141无尽450原生随机回复80至120，多个初始种子且禁疗和满体溢出不改红伤',()=>{
 const heals=new Set();for(let seed=1;seed<=24;seed++){const s=H.turn(H.make(17178,{seed,aStages:{acc:6}}),17178),n=s.fighters[0].hp-4500;assert.ok(n>=80&&n<=120);heals.add(n);}assert.ok(heals.size>2);let s=H.turn(H.make(17178,{aStages:{acc:6},aHp:8990}),17178);assert.equal(s.fighters[0].hp,9000);s=H.turn(H.make(17178,{aStages:{acc:6},aEffects:{无法通过自身技能恢复体力:{start:1,end:3}}}),17178);assert.equal(s.fighters[0].hp,4500);
});
test('3141灾变973仅真正清回合成功才五成麻痹，清真实21042免异后可麻痹，空清无麻痹',()=>{
 const seen=new Set();for(let seed=1;seed<=32;seed++){let s=H.make(19724,{seed,enemyId:3205,enemyMoves:[21042]});s=H.turn(s,'potion:pp',21042);assert.ok(s.fighters[1].effects['免异常']);s=H.turn(s,19724);assert.equal(s.fighters[1].effects['免异常'],undefined);seen.add(!!s.fighters[1].ailments['麻痹']);}assert.equal(seen.size,2);for(let seed=1;seed<=8;seed++){const s=H.turn(H.make(19724,{seed}),19724);assert.equal(s.fighters[1].ailments['麻痹'],undefined);}
});
