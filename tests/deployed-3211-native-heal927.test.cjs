'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3211-native.cjs');
test('3211绝瞳516低半全强化二恰半一，927按实际回血附百分比且只在回复前低半，570独立授下次免攻',()=>{
 for(const [hp,heal,pink,level]of[[1000,3000,3000,2],[4499,3000,3000,2],[4500,3000,0,1],[8950,50,0,1]]){const s=H.turn(H.make(25114,{aHp:hp}),25114);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===level));assert.equal(s.fighters[0].hp,hp+heal);assert.equal(H.damage(s,'percent'),pink);assert.equal(s.fighters[0].counts.attackNullify,1);assert.equal(s.fighters[0].effects['用招低体回血粉伤'].end,4);}
 for(const [effects,expected]of[[{技能禁疗:{start:1,end:4}},0],[{回复效果削减:{start:1,end:4,fraction:.5}},1500]]){const s=H.turn(H.make(25114,{aHp:1000,aEffects:effects}),25114);assert.equal(s.fighters[0].hp,1000+expected);assert.equal(H.damage(s,'percent'),expected);}
 const immune=H.turn(H.make(25114,{aHp:1000,bEffects:{固定百分比免疫:{start:1,end:4}}}),25114);assert.equal(immune.fighters[0].hp,4000);assert.equal(H.damage(immune,'percent'),0);
});
test('3211既授927后真实圣御授整招无效，实际用招仍回复并按实际恢复量附百分比，消费PP和无效次数',()=>{
 let s=H.turn(H.make(25114,{aHp:1000,enemyId:4321,enemyMoves:[35619],extraMoves:[10499],aStats:{spe:4000},bStats:{spe:100},bStages:{def:-1},aEffects:{id984:{start:1,end:1,amount:4}}}),25114,35619);assert.equal(s.turns[0].first,0);assert.equal(s.fighters[0].counts.nextSkillInvalid,1);const hp=s.fighters[0].hp,pp=s.fighters[0].pp['wiki:10499'];assert.equal(hp,4000);s=H.turn(s,10499);assert.equal(s.fighters[0].pp['wiki:10499'],pp-1);assert.equal(H.damage(s,'attack'),0);assert.equal(H.damage(s,'percent'),3000);assert.equal(s.fighters[0].hp,7000);assert.equal(s.fighters[0].counts.nextSkillInvalid??0,0);
});
test('3211既授927后实际使用攻击MISS仍在出手流程结束回复，药剂和疲惫未用不触发，到期不回复',()=>{
 let s=H.turn(H.make(25114,{aHp:1000,extraMoves:[10499],aEffects:{攻击必失:{start:2,end:2}}}),25114);assert.equal(s.fighters[0].hp,4000);s=H.turn(s,10499);assert.equal(H.damage(s,'attack'),0);assert.equal(s.fighters[0].hp,7000);assert.equal(H.damage(s,'percent'),3000);assert.equal(s.fighters[0].pp['wiki:10499'],H.source.moves.find(m=>m.id===10499).pp-1);
 let slept=false;for(let seed=1;seed<=12&&!slept;seed++){let controlled=H.turn(H.make(25114,{seed,aHp:1000,extraMoves:[10499],enemyId:3205,enemyMoves:[22053]}),25114);controlled=H.turn(controlled,'potion:pp',22053);if(!controlled.fighters[0].ailments['睡眠'])continue;slept=true;const pp=controlled.fighters[0].pp['wiki:10499'],hp=controlled.fighters[0].hp;controlled=H.turn(controlled,10499);assert.equal(controlled.fighters[0].pp['wiki:10499'],pp);assert.equal(controlled.fighters[0].hp,hp);assert.equal(H.damage(controlled,'percent'),0);}assert.equal(slept,true);
 let q=H.turn(H.make(25114,{aHp:1000,extraMoves:[10499]}),25114);q=H.turn(q,'potion:pp');assert.equal(q.fighters[0].hp,4000);q=H.turn(q,'potion:pp');q=H.turn(q,'potion:pp');assert.equal(q.fighters[0].effects['用招低体回血粉伤'],undefined);q=H.turn(q,10499);assert.equal(q.fighters[0].hp,7000,'927到期不回复；真实攻击原538低半另吸取3000');
});
