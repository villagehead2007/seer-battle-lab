'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3036-native.cjs'),pp='potion:pp';
const red=(s,side)=>(s.damageEvents??[]).find(e=>e.round===s.turns.at(-1).round&&e.type==='attack'&&e.sourceSide===side),detail=(s,side)=>s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===side)?.detail;
test('3036百战693只下两轮红伤额外100第三恢复，免一次攻击不被药剂消费且固定75独立穿过',()=>{
 let s=turn(make(24738,{extraMoves:[10004]}),24738);for(let r=2;r<=4;r++){s=turn(s,10004);assert.ok(detail(s,0).includes('增减伤 '+(r<=3?2:1)+' ×'));}s=turn(make(24738,{enemyId:3017,enemyMoves:[10761],aStats:{def:1000},bStats:{atk:9999,spa:9999}}),24738);s=turn(s,pp);assert.equal(s.fighters[0].counts.attackNullify,1);s=turn(s,pp,10761);assert.equal(red(s,1).settledDamage,0);assert.equal(s.damageEvents.find(e=>e.round===3&&e.type==='fixed').settledDamage,75);assert.equal(s.fighters[0].counts.attackNullify,0);s=turn(s,pp,10761);assert.ok(red(s,1).settledDamage>0);
});
test('3036千秋77当前四轮实际用技能回200，第五不回；技能禁疗阻挡与满体封顶',()=>{
 let s=make(24739,{extraMoves:[10004]});for(let r=1;r<=5;r++){s=turn(s,r===1?24739:10004);assert.equal(s.fighters[0].hp,4500+Math.min(r,4)*200);}s=turn(make(24739,{aHp:8999}),24739);assert.equal(s.fighters[0].hp,9000);s=turn(make(24739,{aEffects:{'无法通过自身技能恢复体力':{start:1,end:2}}}),24739);assert.equal(s.fighters[0].hp,4500);
});
test('3036千秋48当前四轮免原生睡眠第五恢复，狂暴191当前五轮反异常第六不反',()=>{
 for(const[id,last,reflect]of[[24739,4,false],[24742,5,true]]){let s=turn(make(id,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),id);assert.equal(s.fighters[0].effects[reflect?'reflect':'免异常'].end,last);s=turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);assert.equal(!!s.fighters[1].ailments['睡眠'],reflect);for(let r=3;r<=last;r++)s=turn(s,pp,pp);s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']>=2);}
});
test('3036驰骋165当前三轮双防逐回合二到零后到期，47免弱四轮第五可被原生威慑削弱',()=>{
 let s=make(24740,{aStages:{def:-6,spd:-6},enemyId:3036,enemyMoves:[20041]});for(let r=1;r<=5;r++){s=turn(s,r===1?24740:pp,20041);assert.equal(s.fighters[0].stages.def,r<=3?-6+r*2:0);assert.equal(s.fighters[0].stages.spd,r<=3?-6+r*2:0);assert.equal(s.fighters[0].stages.atk,r<=4?0:-1);}
});
test('3036驰骋658原生来袭完整红伤回馈100为真实伤害，只消费一次且不含固定75',()=>{
 let s=turn(make(24740,{enemyId:3017,enemyMoves:[10761],aStats:{def:1000},bStats:{spa:9999}}),24740);assert.equal(s.fighters[0].counts.nextDamageReturn,1);s=turn(s,pp,10761);const incoming=red(s,1).settledDamage,feedback=s.damageEvents.find(e=>e.round===2&&e.type==='true'&&e.sourceSide===0);assert.ok(incoming>0);assert.equal(feedback.settledDamage,incoming);assert.equal(s.damageEvents.find(e=>e.round===2&&e.type==='fixed').settledDamage,75);assert.equal(s.fighters[0].counts.nextDamageReturn??0,0);s=turn(s,pp,10761);assert.ok(!s.damageEvents.some(e=>e.round===3&&e.type==='true'&&e.sourceSide===0));
});
test('3036洪荒582未击败才下两轮必暴，第四恢复，真实KO不发必暴且672回满',()=>{
 let s=turn(make(19291,{extraMoves:[10004],aStages:{acc:6}}),19291);assert.equal(s.fighters[0].effects['必定暴击'].start,2);assert.equal(s.fighters[0].effects['必定暴击'].end,3);for(let r=2;r<=4;r++){s=turn(s,10004);assert.equal(detail(s,0).includes('暴击 2'),r<=3);}s=turn(make(19291,{bHp:1,aHp:1000,aStages:{acc:6}}),19291);assert.equal(s.fighters[1].hp,0);assert.equal(s.fighters[0].hp,9000);assert.equal(s.fighters[0].effects['必定暴击'],undefined);
});
