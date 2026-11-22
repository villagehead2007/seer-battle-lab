'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3102-native.cjs'),pp='potion:pp';
test('3102不败191真实反弹睡眠四轮第五恢复，冲霄47三轮和不败47五轮真实免弱后恢复',()=>{
 let s=turn(make(24881,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6},bEffects:{PP保护:{start:1,end:7}}}),24881,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);assert.ok(s.fighters[1].ailments['睡眠']);for(let r=2;r<=4;r++)s=turn(s,pp);s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']);
 for(const[id,last]of[[24880,3],[24881,5]]){s=make(id,{enemyId:3075,enemyMoves:[20491],bEffects:{PP保护:{start:1,end:7}}});for(let r=1;r<=last+1;r++){s=turn(s,r===1?id:pp,20491);assert.equal(s.fighters[0].stages.spd,r<=last?0:-1);}}
});
test('3102气载57及597真实四轮每次属性出招回血3333并按9000三分一吸取，第五均停，三种真实周期伤使到期可见',()=>{
 let s=make(24882,{extraMoves:[20117],aHp:1,aStats:{maxHp:9999},bGear:{resistance:{percent:100}},aAilments:{中毒:7,烧伤:7,冻伤:7}}),hp=1;for(let r=1;r<=5;r++){s=turn(s,r===1?24882:20117);hp=Math.min(9999,hp+(r<=4?6333:0))-3747;assert.equal(s.fighters[0].hp,hp);assert.equal(s.fighters[1].hp,9000);assert.equal((s.damageEvents??[]).filter(e=>e.round===r&&e.type==='percent'&&e.sourceSide===0).length,r<=4?1:0);}s=turn(make(24882,{aHp:1000,aEffects:{无法通过自身技能恢复体力:{start:1,end:4}}}),24882);assert.equal(s.fighters[0].hp,1000);assert.equal(s.fighters[1].hp,6000);s=turn(make(24882),24882);const hp2=s.fighters[0].hp,target=s.fighters[1].hp;s=turn(s,pp);assert.equal(s.fighters[0].hp,hp2);assert.equal(s.fighters[1].hp,target);
});
test('3102气载597攻击先击败仍按理论回复，完整57同时执行不会掩盖少一份回复的HP差额',()=>{
 let s=make(24882,{extraMoves:[19565],aHp:9000,bHp:5000,aStats:{def:50},bStats:{atk:9999,def:1,spd:1,spe:2000},enemyMoves:[10086]});s=turn(s,24882);assert.equal(s.fighters[1].hp,2000);s=turn(s,19565,10086);const incoming=s.damageEvents.find(e=>e.round===2&&e.type==='attack'&&e.sourceSide===1);assert.ok(incoming.settledDamage>3000&&incoming.settledDamage<9000);assert.equal(s.fighters[1].hp,0);assert.equal(s.fighters[0].soulState.ruierHigh,true);assert.equal(s.fighters[0].hp,9000);assert.ok(s.turns.at(-1).events.some(e=>e.kind==='heal'&&e.text.includes('用招吸取')));
});
test('3102气载790仅当前三轮忽原50红伤上限，第四恢复；天武843仅下两轮先制一',()=>{
 let s=turn(make(24882,{extraMoves:[19561],bStats:{def:1000,spd:1000},bGear:{resistance:{percent:100}},bEffects:{伤害上限:{start:1,end:10,amount:50,attackOnly:true}}}),24882);for(let r=2;r<=4;r++){s=turn(s,19561);const e=s.damageEvents.find(e=>e.round===r&&e.type==='attack'&&e.sourceSide===0);if(r<=3)assert.ok(e.settledDamage>50);else assert.equal(e.settledDamage,50);assert.equal(s.fighters[1].effects['伤害上限'].amount,50);}
 s=turn(make(19560,{extraMoves:[20117],aStats:{spe:1},enemyMoves:[10086]}),19560,10086);for(let r=2;r<=4;r++){s=turn(s,20117,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,r<=3?1:0);assert.equal(s.turns.at(-1).first,r<=3?0:1);}
});
test('3102天武928仅实际清回合成功授一次免异，魂封属性结束后真实睡眠消费一次，空清不授',()=>{
 let s=make(19560,{enemyId:3205,enemyMoves:[21042,22053],bStages:{acc:6}});s=turn(s,pp,21042);assert.ok(s.fighters[1].effects['免异常']);s=turn(s,19560);assert.equal(s.fighters[1].effects['免异常'],undefined);assert.equal(s.fighters[0].counts.immune,1);s=turn(s,pp,22053);assert.equal(s.fighters[0].counts.immune,1);s=turn(s,pp,22053);assert.equal(s.fighters[0].counts.immune,0);assert.equal(s.fighters[0].ailments['睡眠'],undefined);s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']);s=turn(make(19560),19560);assert.equal(s.fighters[0].counts.immune??0,0);
});
