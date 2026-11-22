'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H4=require('./helpers/3004-native.cjs'),H10=require('./helpers/3010-native.cjs'),H14=require('./helpers/3014-native.cjs'),H87=require('./helpers/2987-native.cjs'),pp='potion:pp';
const events=(s,type,side)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type===type&&e.sourceSide===side);
test('银雾双清成功按答复合计对手下轮先制负四，单项负二原测试保留且下下轮恢复零',()=>{
 for(const soul of[372,574]){let s=H87.make(19100,{soul,extraMoves:[10004],enemyMoves:[20355,20889,10086],aStats:{spe:100},bStats:{spe:9999}});s=H87.turn(s,pp,20355);s=H87.turn(s,pp,20889);assert.ok(s.fighters[1].effects['必定暴击']);assert.equal(s.fighters[1].stages.spe,1);s=H87.turn(s,19100);assert.equal(s.fighters[1].effects['必定暴击'],undefined);assert.equal(s.fighters[1].stages.spe,0);assert.equal(s.fighters[1].effects.id984.amount,-4);s=H87.turn(s,10004,10086);assert.equal(s.fighters[1].soulState.resolvedPriority.value,-4);assert.equal(s.turns.at(-1).first,0);s=H87.turn(s,10004,10086);assert.equal(s.fighters[1].soulState.resolvedPriority.value,0);}
});
test('野蛮撞击原6自身反伤为百分比，按完整红伤四分一，百分比抗性挡而固定抗性不挡',()=>{
 for(const percent of[0,100]){const s=H4.turn(H4.make(10973,{aGear:{resistance:{fixed:100,percent}}}),10973),red=events(s,'attack',0)[0],recoil=events(s,'percent',0).filter(e=>e.targetSide===0);assert.ok(red.settledDamage>0);assert.equal(recoil.length,1);assert.equal(recoil[0].settledDamage,percent?0:Math.floor(red.settledDamage/4));assert.ok(!events(s,'true',0).some(e=>e.targetSide===0));}
});
test('玄武166反馈百分比且致死保1在抗性之后处理，不截断完整反馈或误放大减免',()=>{
 for(const[hp,resistance]of[[1,0],[1000,60],[1000,100]]){const s=H10.turn(H10.make(20276,{aHp:100,enemyMoves:[10086],aStats:{def:100,spe:1},bHp:hp,bStats:{atk:9999,spe:9999},bGear:{resistance:{fixed:100,percent:resistance}}}),pp,10086),incoming=events(s,'attack',1)[0],feedback=events(s,'percent',0)[0],expected=Math.floor(incoming.settledDamage*.5*(1-resistance/100));assert.ok(incoming.settledDamage>100);assert.equal(s.fighters[0].hp,0);assert.ok(feedback);assert.equal(feedback.settledDamage,expected);assert.equal(s.fighters[1].hp,Math.max(1,hp-expected));}
});
test('幻灵101回复完整红伤半数，目标仅1实际损1仍回复完整量，技能禁疗只挡技能不挡魂印200',()=>{
 for(const blocked of[false,true]){const s=H14.turn(H14.make(19199,{aHp:1000,bHp:1,aEffects:blocked?{'无法通过自身技能恢复体力':{start:1,end:3}}:{}}),19199),red=events(s,'attack',0)[0];assert.ok(red.settledDamage>1);assert.equal(red.hpLoss,1);assert.equal(s.fighters[0].hp,1200+(blocked?0:Math.floor(red.settledDamage*.5)));}const s=H14.turn(H14.make(19199,{aHp:8999}),19199);assert.equal(s.fighters[0].hp,9000);
});
