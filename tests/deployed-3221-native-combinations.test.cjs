'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3221-native.cjs');
test('3221完整第五180真实清回合且免断保护阻止，强化弱化子句保留原顺序',()=>{
 for(const protect of[false,true]){const s=H.turn(H.make(19590,{aStages:{acc:6},bEffects:{攻击必中:{start:1,end:5},...(protect?{protect:{start:1,end:5}}:{})}}),19590);assert.equal(!!s.fighters[1].effects.攻击必中,protect);assert.equal(s.fighters[0].stages.atk,1);assert.equal(s.fighters[1].stages.atk,-1);}
});
test('3221王者之战57与九武圣尊532当前四回合用招才回复，药剂不触发，预设技能禁疗及到期独立',()=>{
 for(const move of[24873,24895]){let s=H.turn(H.make(move,{aHp:1000,extraMoves:[20496],aEffects:{技能禁疗:{start:4,end:4}}}),move);assert.equal(s.fighters[0].hp,4090);assert.equal(H.damage(s,'percent'),move===24895?3000:0);s=H.turn(s,'potion:pp');assert.equal(s.fighters[0].hp,4270);assert.equal(H.damage(s,'percent'),0);s=H.turn(s,20496);assert.equal(s.fighters[0].hp,7540);assert.equal(H.damage(s,'percent'),move===24895?3000:0);s=H.turn(s,20496);assert.equal(s.fighters[0].hp,7810);assert.equal(H.damage(s,'percent'),0);s=H.turn(s,20496);assert.equal(s.fighters[0].hp,8080);assert.equal(H.damage(s,'percent'),0);}
});
test('3221九武圣尊原58仅下两回合攻击必暴，第三回合后不保留，完整532免粉目标仍正常回复',()=>{
 let s=H.turn(H.make(24895,{aHp:1000,extraMoves:[10004],bGear:{resistance:{percent:100}},aStages:{acc:6}}),24895);assert.equal(H.damage(s,'percent'),0);assert.equal(s.fighters[0].hp,4090);const seen=[],old=H.E.SOULS;H.E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterAttack'&&c.a.side===0)seen.push(!!c.crit);}};try{for(let r=2;r<=4;r++)s=H.turn(s,10004);}finally{H.E.SOULS=old;}assert.deepEqual(seen,[true,true,false]);
});
