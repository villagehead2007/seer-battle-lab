'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),A=require('./helpers/3013-native.cjs'),B=require('./helpers/3020-native.cjs');
test('最新人答的泛减伤与限伤界面标明仅红伤及数值，真实状态只读不改动',()=>{
 let s=A.turn(A.make(19192),19192),before=structuredClone(s);assert.ok(A.E.describeEffects(s.fighters[1],s.round).some(x=>x.includes('伤害输出降低（仅红伤：50%）')));assert.deepEqual(s,before);
 s=B.turn(B.make(24702),24702);before=structuredClone(s);assert.ok(B.E.describeEffects(s.fighters[0],s.round).some(x=>x.includes('伤害定额减免（仅红伤：200点）')));assert.deepEqual(s,before);
 s=B.turn(B.make(24701,{enemyMoves:[20889]}),24701,20889);before=structuredClone(s);assert.ok(B.E.describeEffects(s.fighters[0],s.round).some(x=>x.includes('伤害上限（仅红伤：250点）')));assert.deepEqual(s,before);
});
