'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3289-native.cjs');
test('3289敌我同伤80原半当前体力直接消耗并等量百分比，奇数向下及1HP零消耗，免粉不退成本',()=>{
 for(const [hp,pink]of[[9000,false],[3001,false],[1,false],[3001,true]]){const s=H.turn(H.make(20466,{aHp:hp,bEffects:pink?{固定百分比免疫:{start:1,end:1}}:{}}),20466),n=Math.floor(hp/2);assert.equal(s.fighters[0].hp,hp-n);assert.equal(H.damage(s,'percent'),pink?0:n);assert.equal(H.damage(s,'fixed'),0);assert.equal(s.fighters[1].hp,9000-(pink?0:n));assert.equal((s.damageEvents??[]).filter(e=>e.targetSide===0).length,0);}const q=H.turn(H.make(20466,{aHp:3001,aEffects:{statusBlock:{start:1,end:1}}}),20466);assert.equal(q.fighters[0].hp,3001);assert.equal(H.damage(q,'percent'),0);
});
test('3289圣龙九重天1092仅后手冰封失败附当前体力三分一，先手无补偿，后手成功不附伤',()=>{
 for(const mode of ['early','late-success','late-immune','late-pink']){const s=H.turn(H.make(30371,{aHp:3000,aStats:{spe:mode==='early'?4000:1},enemyMoves:[20355],bEffects:mode==='late-immune'?{免异常:{start:1,end:1}}:mode==='late-pink'?{免异常:{start:1,end:1},固定百分比免疫:{start:1,end:1}}:{}}),30371,20355);assert.equal(s.turns.at(-1).first,mode==='early'?0:1);assert.equal(Boolean(s.fighters[1].ailments.冰封),mode==='late-success');assert.equal(H.damage(s,'percent'),mode==='late-immune'?1000:0);assert.ok(H.damage(s,'attack')>0);}
});
test('3289圣龙九重天1052清强化成功才全能力一阶，保护无正无收益，自身禁强化只挡奖励而清强仍成功',()=>{
 for(const mode of ['success','protect','none','own-ban']){const s=H.turn(H.make(30371,{aHp:3000,aStats:{spe:4000},enemyMoves:[20355],bStages:mode==='none'?{}:{atk:2},aEffects:mode==='own-ban'?{禁强化:{start:1,end:1}}:{},bEffects:mode==='protect'?{强化保护:{start:1,end:1}}:{}}),30371,20355);assert.equal(s.fighters[1].stages.atk,mode==='protect'?2:0);for(const k of ['atk','def','spa','spd','spe','acc'])assert.equal(s.fighters[0].stages[k],mode==='success'?1:0);assert.equal(H.damage(s,'percent'),0);}
});
