'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3223-native.cjs');
test('3223两魂狂烈斗气57当前四回合用招回三千，药剂不回，初始合法禁疗窗口及到期独立',()=>{
 for(const soul of[558,566]){let s=H.turn(H.make(25141,{soul,aHp:1000,extraMoves:[20117],aEffects:{技能禁疗:{start:4,end:4}}}),25141);assert.equal(s.fighters[0].hp,4000);s=H.turn(s,'potion:pp');assert.equal(s.fighters[0].hp,4000);s=H.turn(s,20117);assert.equal(s.fighters[0].hp,7000);s=H.turn(s,20117);assert.equal(s.fighters[0].hp,7000);s=H.turn(s,20117);assert.equal(s.fighters[0].hp,7000);}
});
test('3223两魂狂烈斗气525原三回合50免攻自然成功失败，第四回合真实攻击不再被免疫',()=>{
 for(const soul of[558,566]){let yes=false,no=false;for(let seed=1;seed<=48&&!(yes&&no);seed++){let s=H.turn(H.make(25141,{soul,seed,aStats:{spe:4000,def:1000},bStats:{atk:4000},enemyMoves:[10086]}),25141,10086);assert.equal(s.fighters[0].effects.概率攻击免疫.end,3);if(H.damage(s,'attack',1)===0)yes=true;else no=true;for(let r=2;r<=4;r++)s=H.turn(s,'potion:pp',10086);assert.ok(H.damage(s,'attack',1)>0);assert.equal(s.fighters[0].effects.概率攻击免疫,undefined);}assert.ok(yes&&no);}
});
test('3223两魂圣武天战决540真实后手才授次两回合必暴，先手无奖励，之后不延续',()=>{
 for(const soul of[558,566])for(const fast of[false,true]){let s=H.turn(H.make(30070,{soul,aStats:{spe:fast?4000:1},bStats:{spe:fast?100:4000},extraMoves:[10127],enemyMoves:[10086],aStages:{acc:6}}),30070,10086);assert.equal(s.turns[0].first,fast?0:1);const seen=[],old=H.E.SOULS;H.E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterAttack'&&c.a.side===0)seen.push(!!c.crit);}};try{for(let r=2;r<=4;r++)s=H.turn(s,10127);}finally{H.E.SOULS=old;}assert.deepEqual(seen,fast?[false,false,false]:[true,true,false]);}
});
test('3223两魂原第五582未击败才次两回合必暴，真实KO不奖励',()=>{
 for(const soul of[558,566])for(const kill of[false,true]){let s=H.turn(H.make(30074,{soul,bHp:kill?1:9000,aStages:{acc:6},extraMoves:[10127]}),30074);assert.equal(s.fighters[1].hp===0,kill);assert.equal(!!s.fighters[0].effects.必定暴击,!kill);if(kill)continue;const seen=[],old=H.E.SOULS;H.E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterAttack'&&c.a.side===0)seen.push(!!c.crit);}};try{for(let r=2;r<=4;r++)s=H.turn(s,10127);}finally{H.E.SOULS=old;}assert.deepEqual(seen,[true,true,false]);}
});
test('3223原第五913实际消回合成功才次回合增红50，空效果和免断无奖励，成长魂印与必暴在对照中保留',()=>{
 function play(mode){let s=H.turn(H.make(30074,{aStats:{atk:2000},bStats:{def:1000},aStages:{acc:6},extraMoves:[10127],bEffects:mode==='none'?{}:{攻击必中:{start:1,end:5},...(mode==='protect'?{protect:{start:1,end:5}}:{})}}),30074);assert.equal(!!s.fighters[0].effects.id913,mode==='clear');const red=[],rng=[];for(let r=2;r<=3;r++){s=H.turn(s,10127);red.push(H.damage(s,'attack'));rng.push(s.rng);}return{red,rng};}const normal=play('none'),clear=play('clear'),protectedResult=play('protect');assert.deepEqual(clear.rng,normal.rng);assert.ok(Math.abs(clear.red[0]-normal.red[0]*1.5)<=2,'实际完整红伤按1.5倍');assert.equal(clear.red[1],normal.red[1]);assert.deepEqual(protectedResult,normal);
});
test('3223恐惧战意原5害怕自然成败，复用同初始种子真实次数免异阻止并消费一次',()=>{
 let yes=false,no=false;for(let seed=1;seed<=256&&!(yes&&no);seed++){const s=H.turn(H.make(10650,{seed,aStages:{acc:6}}),10650);assert.ok(H.damage(s,'attack')>0);if(s.fighters[1].ailments.害怕){yes=true;const q=H.turn(H.make(10650,{seed,aStages:{acc:6},bCounts:{immune:1}}),10650);assert.equal(q.fighters[1].ailments.害怕,undefined);assert.equal(q.fighters[1].counts.immune,0);}else no=true;}assert.ok(yes&&no);
});
