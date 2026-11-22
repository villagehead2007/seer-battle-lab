'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3066-native.cjs'),pp='potion:pp';
test('3066后起77当前三轮用招回100第四停止，天谋57四轮回复三分一第五停止，持续原生毒伤避免满体掩盖到期',()=>{
 for(const[id,last,n]of[[23343,3,100],[24805,4,3200]]){let s=make(id,{extraMoves:[10001],aHp:1,aStats:{maxHp:id===24805?9600:9000},aAilments:id===24805?{中毒:7}:{}}),hp=1;for(let r=1;r<=last+1;r++){s=turn(s,r===1?id:10001);hp+=r<=last?n:0;if(id===24805)hp-=1200;assert.equal(s.fighters[0].hp,hp);}s=turn(make(id,{aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:3}}}),id);assert.equal(s.fighters[0].hp,1000);s=turn(make(id,{aHp:1000}),id);const before=s.fighters[0].hp;s=turn(s,pp);assert.equal(s.fighters[0].hp,before);}
});
test('3066后起免异常五轮天谋免异常四轮，均挡原生睡眠并在下一轮恢复',()=>{
 for(const[id,last]of[[23343,5],[24805,4]]){let s=turn(make(id,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),id);for(let r=2;r<=last;r++){s=turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);}s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']);}
});
test('3066卧牛408当前三轮红伤定额减120第四恢复，固定75百分比800和真毒1125不受该减免',()=>{
 let s=make(23345,{aStats:{def:1000},enemyMoves:[10086],bStats:{atk:9999}});for(let r=1;r<=4;r++){s=turn(s,r===1?23345:pp,10086);const e=s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===1),raw=Number(e.detail.match(/= (\d+)；暴击/)[1]);assert.equal(e.damage.settledDamage,Math.max(0,raw-(r<=3?120:0)));}for(const[m,type,n]of[[10761,'fixed',75],[16397,'percent',800]]){s=turn(make(23345,{enemyId:3017,enemyMoves:[m]}),23345,m);assert.equal(s.damageEvents.find(e=>e.type===type&&e.targetSide===0).settledDamage,n);}s=turn(make(23345,{aAilments:{中毒:3}}),23345);assert.equal(s.damageEvents.find(e=>e.type==='true').settledDamage,1125);
});
test('3066连营843只下两轮全技能先制二第三恢复，状态技能也适用但不触发攻击命中烧伤',()=>{
 let s=turn(make(24804,{extraMoves:[20030],aStats:{spe:1},enemyMoves:[10086]}),24804,10086);for(let r=2;r<=4;r++){s=turn(s,20030,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,r<=3?2:0);assert.equal(s.turns.at(-1).first,r<=3?0:1);assert.equal(s.fighters[1].ailments['烧伤'],undefined);}
});
