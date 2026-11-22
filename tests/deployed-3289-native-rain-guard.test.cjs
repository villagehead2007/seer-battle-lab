'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3289-native.cjs');
test('3289雨狂龙卷463三回原定额红减100到第四回失效，462两回固定反弹150到第三回失效，原618伤疗独立',()=>{
 let s=H.make(23554,{aHp:1000,enemyMoves:[10086],aStats:{def:1000},bStats:{atk:6000},bStages:{acc:6}});s=H.turn(s,23554);for(let r=2;r<=4;r++){s=H.turn(s,'potion:pp',10086);const event=s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===1);assert.ok(event);const beforeFlat=Number(event.detail.match(/暴击伤害抗性 0% 后 (\d+)/)?.[1]);assert.ok(beforeFlat>=100);assert.equal(event.damage.settledDamage,beforeFlat-(r<=3?100:0));assert.equal(H.damage(s,'fixed'),r===2?150:0);assert.equal(s.fighters[0].hp>0,true);}
});
test('3289雨狂龙卷462受击零红仍固定150而MISS不反弹，原魂实际攻击用招追击不混作反弹',()=>{
 for(const mode of ['zero','miss','pink']){let s=H.make(23554,{aHp:1000,enemyMoves:[10086],aEffects:mode==='zero'?{攻击伤害免疫:{start:2,end:2}}:{},bEffects:mode==='miss'?{攻击必失:{start:2,end:2}}:mode==='pink'?{固定百分比免疫:{start:1,end:3}}:{},bStages:{acc:6}});s=H.turn(s,23554);s=H.turn(s,'potion:pp',10086);assert.equal(H.damage(s,'fixed'),mode==='zero'?150:0);assert.equal(H.damage(s,'attack',1),0);assert.equal(H.damage(s,'percent'),mode==='pink'?0:3000);}
});
test('3289雨狂龙卷463只减红伤不减原425百分比1800，源16103原多段原魂完整保留',()=>{
 let s=H.make(23554,{aHp:3000,enemyId:3079,enemyMoves:[16103],bStages:{acc:6}});s=H.turn(s,23554);s=H.turn(s,'potion:pp',16103);assert.equal(H.damage(s,'attack',1),0);assert.equal(H.damage(s,'percent',1),1800);assert.equal(s.fighters[0].hp,4200);assert.equal(H.damage(s,'percent'),3000);
});
test('3289雨狂龙卷48原五回免异包含第五回，第六回真实安魂曲才能睡眠，反弹不替代免异',()=>{
 let s=H.make(23554,{enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStages:{acc:6}});for(let r=1;r<=6;r++){s=H.turn(s,r===1?23554:'potion:pp',22053);assert.equal(Boolean(s.fighters[0].ailments.睡眠),r===6);assert.equal(s.fighters[1].ailments.睡眠,undefined);}
});
