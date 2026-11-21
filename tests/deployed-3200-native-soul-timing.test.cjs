'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3200-native.cjs'),pp='potion:pp';
test('3200两魂按原文战阶末高体授免异，不按稍后中毒跌破半体改为害怕；恰半两分支均无',()=>{
 for(const soul of[523,532]){let s=H.turn(H.make(10006,{soul,aHp:5001,aAilments:{中毒:2}}),pp);assert.equal(s.fighters[0].hp,3876);assert.equal(s.fighters[1].ailments['害怕'],undefined);assert.equal(s.fighters[0].effects['免异常'].start,2);assert.equal(s.fighters[0].effects['免异常'].end,soul===523?2:3);s=H.turn(H.make(10006,{soul}),pp);assert.equal(s.fighters[1].ailments['害怕'],undefined);assert.equal(s.fighters[0].effects['免异常'],undefined);}
});
test('3200两魂战阶末低体先施害怕，自身随后中毒死亡不抹去已生效异常；真实用招满回则走高体',()=>{
 for(const soul of[523,532]){let s=H.turn(H.make(10006,{soul,aHp:1,aAilments:{中毒:2}}),pp);assert.equal(s.fighters[0].hp,0);assert.ok(s.fighters[1].ailments['害怕']>=2);s=H.turn(H.make(25089,{soul,aHp:1000}),25089);assert.equal(s.fighters[0].hp,9000);assert.equal(s.fighters[1].ailments['害怕'],undefined);assert.equal(s.fighters[0].effects['免异常'].end,soul===523?2:3);}
});
test('3200魂原高体下一轮免异与强化下两轮按真实睡眠验证，后续低体和药剂不延长已有期限',()=>{
 for(const soul of[523,532]){let s=H.make(10006,{soul,aHp:5001,aAilments:{中毒:2},enemyId:3205,enemyMoves:[22053],bStages:{acc:6},bEffects:{免异常:{start:1,end:8}}});s=H.turn(s,pp);s=H.turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);s=H.turn(s,pp,22053);assert.equal(!!s.fighters[0].ailments['睡眠'],soul===523);s=H.turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']);}
});
