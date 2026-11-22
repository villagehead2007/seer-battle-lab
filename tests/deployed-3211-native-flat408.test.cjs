'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3211-native.cjs');
test('3211异能408原招定额减红200，真实王雷伊属性直伤260减至60，攻防强化和随机不混入对照',()=>{
 const options={aHp:5000,enemyId:3142,enemyMoves:[24970],aEffects:{id984:{start:1,end:1,amount:4}}};
 const reduced=H.turn(H.make(25112,options),25112,24970),plain=H.turn(H.make(19991,options),19991,24970);assert.equal(reduced.turns[0].first,0);assert.equal(plain.turns[0].first,0);assert.equal(H.damage(plain,'attack',1),260);assert.equal(H.damage(reduced,'attack',1),60);assert.equal(reduced.fighters[0].hp,5000+3000-60);assert.equal(plain.fighters[0].hp,5000-260);assert.equal(reduced.fighters[0].effects.伤害定额减免.amount,200);assert.equal(reduced.fighters[0].effects.伤害定额减免.end,3);
});
test('3211异能408当轮起三回合，原57回血并存而药剂不触发回血，第三轮末实际到期',()=>{
 let s=H.turn(H.make(25112,{aHp:5000}),25112);assert.equal(s.fighters[0].hp,8000);assert.equal(s.fighters[0].effects.伤害定额减免.end,3);assert.equal(s.fighters[0].effects.id57.end,4);s=H.turn(s,'potion:pp');assert.equal(s.fighters[0].hp,8000);assert.equal(s.fighters[0].effects.伤害定额减免.end,3);s=H.turn(s,'potion:pp');assert.equal(s.fighters[0].effects.伤害定额减免,undefined);assert.equal(s.fighters[0].effects.id57.end,4);s=H.turn(s,'potion:pp');assert.equal(s.fighters[0].effects.id57,undefined);
});
test('3211异能原57当前四回合已用技能MISS也回复，原538未命中不吸取，两个来源不混同',()=>{
 let s=H.turn(H.make(25112,{aHp:1000,extraMoves:[10499],aEffects:{攻击必失:{start:2,end:2}}}),25112);assert.equal(s.fighters[0].hp,4000);s=H.turn(s,10499);assert.equal(H.damage(s,'attack'),0);assert.equal(H.damage(s,'percent'),0);assert.equal(s.fighters[0].hp,7000);assert.equal(s.fighters[0].pp['wiki:10499'],H.source.moves.find(m=>m.id===10499).pp-1);
});
