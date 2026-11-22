'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3289-native.cjs');
test('3289碧雨尘声原521反弱为正，禁强负级归零，负锁保留，原正级不改且MISS无效不反转',()=>{
 for(const mode of ['normal','ban','lock','miss','invalid']){const s=H.turn(H.make(30369,{aStages:{atk:-2,def:-1,spa:1,acc:6},aEffects:mode==='ban'?{禁强化:{start:1,end:1}}:mode==='lock'?{弱化不可解除反转:{start:1,end:1}}:mode==='miss'?{攻击必失:{start:1,end:1}}:mode==='invalid'?{skillBlock:{start:1,end:1}}:{}}),30369);assert.equal(s.fighters[0].stages.atk,mode==='normal'?2:mode==='ban'?0:-2);assert.equal(s.fighters[0].stages.def,mode==='normal'?1:mode==='ban'?0:-1);assert.equal(s.fighters[0].stages.spa,1);}
});
test('3289盛世川河856真消回合成功回三千，保护空场MISS失败不回血，1029低红只授下回先制二',()=>{
 for(const mode of ['clear','protect','empty','miss','invalid','high']){let s=H.make(30368,{aHp:1000,extraMoves:[10004],aStats:{spe:1,...(mode==='high'?{spa:6000}:{})},bStats:mode==='high'?{spd:1000}:{},enemyMoves:[20355],aStages:{acc:6},aEffects:mode==='miss'?{攻击必失:{start:1,end:1}}:mode==='invalid'?{skillBlock:{start:1,end:1}}:{},bEffects:mode==='empty'?{}:mode==='protect'?{免异常:{start:1,end:5},protect:{start:1,end:5}}:{免异常:{start:1,end:5}}});s=H.turn(s,30368);assert.equal(s.fighters[0].hp,['clear','high'].includes(mode)?4000:1000);assert.equal(Boolean(s.fighters[1].effects.免异常),['protect','miss','invalid'].includes(mode));const awarded=!['miss','invalid','high'].includes(mode);s=H.turn(s,10004,20355);assert.equal(s.turns.at(-1).first,awarded?0:1);s=H.turn(s,10004,20355);assert.equal(s.turns.at(-1).first,1);}
});
test('3289万水苍天浪836仅体力严格高于对手先制一，1091未击败授下两回免反，击败不授',()=>{
 for(const hp of [3000,6000,7000]){const s=H.turn(H.make(30370,{aHp:hp,bHp:6000,aStats:{spe:1},enemyMoves:[20355],aStages:{acc:6}}),30370,20355);assert.equal(s.turns.at(-1).first,hp>6000?0:1);assert.equal(s.fighters[0].effects.reflect.start,2);assert.equal(s.fighters[0].effects.reflect.end,3);}const killed=H.turn(H.make(30370,{bHp:1,aStages:{acc:6}}),30370);assert.equal(killed.fighters[1].hp,0);assert.equal(killed.fighters[0].effects.reflect,undefined);
 let s=H.make(30370,{enemyId:3205,enemyMoves:[22053],aStages:{acc:6},bStages:{acc:6},bEffects:{免异常:{start:1,end:5}}});s=H.turn(s,30370);for(let r=2;r<=4;r++){s=H.turn(s,'potion:pp',22053);assert.equal(Boolean(s.fighters[0].ailments.睡眠),r===4);assert.equal(s.fighters[1].ailments.睡眠,undefined);}
});
test('3289水龙盾52先手才使原属性招无效，慢速后手不撤回已执行效果，次回自然到期',()=>{
 for(const early of [false,true]){let s=H.make(20465,{aStats:{spe:early?4000:1},enemyMoves:[20355]});s=H.turn(s,20465,20355);assert.equal(s.turns.at(-1).first,early?0:1);assert.equal(Boolean(s.fighters[1].effects.必定暴击),!early);s=H.turn(s,'potion:pp',20355);assert.deepEqual(s.fighters[1].effects.必定暴击,{start:3,end:4});}
});
