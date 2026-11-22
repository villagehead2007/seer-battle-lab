'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,make,turn}=require('./helpers/3033-native.cjs'),pp='potion:pp';
const attacks=(s,side)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type==='attack'&&e.sourceSide===side),detail=s=>s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0)?.detail;
test('3033炎王2严格低于半体才威力100，恰半及高半原威力50，原生固定50抗性独立归零',()=>{
 for(const[bHp,power]of[[4499,100],[4500,50],[4501,50]]){const s=turn(make(10251,{bHp}),10251);assert.ok(detail(s).includes('威力 '+power+' ·'));assert.ok(attacks(s,0)[0].settledDamage>0);}const s=turn(make(14733,{bGear:{resistance:{fixed:100}}}),14733);assert.equal(s.damageEvents.find(e=>e.type==='fixed').settledDamage,0);assert.ok(attacks(s,0)[0].settledDamage>0);
});
test('3033金轮697和699同招忽红伤上限及真实免攻反真，不消费被忽略免疫，后续普通攻击仍受免疫及上限',()=>{
 let s=make(19283,{extraMoves:[14730],enemyId:3031,enemyMoves:[24730],bStats:{def:1000},bEffects:{伤害上限:{start:1,end:10,amount:50,attackOnly:true}},aStages:{acc:6}});s=turn(s,pp,24730);s=turn(s,19283);assert.ok(attacks(s,0)[0].settledDamage>50);assert.ok(!s.damageEvents.some(e=>e.round===2&&e.type==='true'&&e.sourceSide===1));s=turn(s,14730);assert.equal(attacks(s,0)[0].settledDamage,0);assert.ok(s.damageEvents.some(e=>e.round===3&&e.type==='true'&&e.sourceSide===1&&e.settledDamage>0));s=turn(s,14730);assert.equal(attacks(s,0)[0].settledDamage,50);
});
test('3033第五795在场实际使用逐次30到120封顶，药剂及别招不中断，疲惫未出招不计次数',()=>{
 let s=make(19286,{extraMoves:[14730]});for(let count=1;count<=5;count++){if(count===3){s=turn(s,pp);s=turn(s,14730);}s=turn(s,19286);assert.equal(s.fighters[0].soulState.damageGrowth['wiki:19286'],count);assert.ok(detail(s).includes('增减伤 '+[0,1.3,1.6,1.9,2.2,2.2][count]+' ×'));assert.ok(attacks(s,0)[0].settledDamage>0);}s=make(19286);s.fighters[0].ailments['疲惫']=2;s=turn(s,19286);s=turn(s,19286);assert.equal(s.fighters[0].pp['wiki:19286'],5);s=turn(s,19286);assert.equal(s.fighters[0].soulState.damageGrowth['wiki:19286'],1);assert.ok(detail(s).includes('增减伤 1.3 ×'));
});
test('3033天地101在目标充足体力时回复本次红伤100%，技能禁疗阻挡，溢出另由统一规则专项验证',()=>{
 for(const blocked of[false,true]){const s=turn(make(19285,{aHp:1000,aEffects:blocked?{'无法通过自身技能恢复体力':{start:1,end:2}}:{}}),19285),hit=attacks(s,0)[0];assert.equal(hit.hpLoss,hit.settledDamage);assert.equal(s.fighters[0].hp,1000+(blocked?0:hit.settledDamage));}
});
