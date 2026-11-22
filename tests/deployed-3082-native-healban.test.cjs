'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3082-native.cjs'),pp='potion:pp';
test('3082朽梦905真实清双防成功的三轮技能禁疗包含施放轮，第三轮内原生回复为零第四轮恢复',()=>{
 let s=make(19474,{enemyId:3036,enemyMoves:[24740,19293],bHp:5000,aStages:{acc:6}});s=turn(s,pp);s=turn(s,pp);s=turn(s,pp,24740);assert.ok(s.fighters[1].stages.def>0);s=turn(s,19474);assert.equal(s.fighters[1].effects['技能禁疗'].start,4);assert.equal(s.fighters[1].effects['技能禁疗'].end,6);const hp=s.fighters[1].hp;for(let r=5;r<=7;r++){s=turn(s,pp,19293);if(r<=6)assert.equal(s.fighters[1].hp,hp);else assert.ok(s.fighters[1].hp>=hp+100&&s.fighters[1].hp<=hp+200);}
});
