'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3221-native.cjs');
function exactRed(wanted){let lo=1,hi=9999;while(lo<=hi){const atk=Math.floor((lo+hi)/2),s=H.turn(H.make(19546,{aHp:1000,aStats:{atk},bStats:{def:2000},aStages:{acc:6}}),19546),red=H.damage(s,'attack');if(red===wanted)return s;if(red<wanted)lo=atk+1;else hi=atk-1;}throw Error('合法攻防与固定种子找不到完整红伤边界 '+wanted);}
test('3221厉刃天魂斩原完整招真实打出399和400及401，低于高于严格区分，固定200延后两回合',()=>{
 for(const red of[399,400,401]){let s=exactRed(red);assert.equal(H.damage(s,'attack'),red);assert.equal(s.fighters[0].hp,red>400?3340:1090);assert.equal(H.damage(s,'fixed'),90,'当轮只含魂印');for(let r=2;r<=4;r++){s=H.turn(s,'potion:pp');assert.equal(H.damage(s,'fixed'),(r===2?180:270)+(red<400&&r<=3?200:0),'红伤'+red+'第'+r+'回合');}}
});
test('3221四方无敌624原消强成功才授当前两回合减红150，强化保护与空强化均不给奖励',()=>{
 for(const mode of['clear','none','protect']){let s=H.turn(H.make(19544,{aHp:8000,bHp:5000,aStats:{spe:4000},enemyId:3142,enemyMoves:[24970],bStages:mode==='none'?{}:{atk:2},bEffects:{禁强化:{start:1,end:5},...(mode==='protect'?{强化保护:{start:1,end:5}}:{})},aStages:{acc:6}}),19544,24970);assert.equal(s.turns[0].first,0);assert.equal(s.fighters[1].stages.atk,mode==='protect'?2:0);assert.equal(H.damage(s,'attack',1),mode==='clear'?110:mode==='protect'?286:260);assert.equal(!!s.fighters[0].effects.伤害定额减免,mode==='clear');if(mode==='clear'){s=H.turn(s,'potion:pp',24970);assert.equal(H.damage(s,'attack',1),110);s=H.turn(s,'potion:pp',24970);assert.equal(H.damage(s,'attack',1),260);}}
});
test('3221九转归魂手原847真实生成260护盾挡住当轮属性直伤，护盾消耗后下次受攻正常',()=>{
 let s=H.turn(H.make(30075,{aHp:8000,bHp:5000,aStats:{spe:4000},enemyId:3142,enemyMoves:[24970],bEffects:{禁强化:{start:1,end:5}},aStages:{acc:6}}),30075,24970);assert.equal(s.turns[0].first,0);assert.equal(H.damage(s,'attack',1),0);assert.equal(s.fighters[0].hp,8090);s=H.turn(s,'potion:pp',24970);assert.equal(H.damage(s,'attack',1),260);assert.equal(s.fighters[0].hp,8010);
});

