'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3031-native.cjs'),pp='potion:pp';
const attacks=(s,side)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type==='attack'&&e.sourceSide===side),redDetail=(s,side)=>s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===side)?.detail;
test('3031狂热58下两轮真实攻击必暴，第三后续轮归正常；绝代48完整五轮免原生睡眠第六恢复',()=>{
 let s=turn(make(20769,{extraMoves:[10127]}),20769);assert.equal(s.fighters[0].effects['必定暴击'].start,2);assert.equal(s.fighters[0].effects['必定暴击'].end,3);for(let r=2;r<=4;r++){s=turn(s,10127);assert.equal(/暴击 2/.test(redDetail(s,0)),r<=3);}
 s=turn(make(24731,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),24731);assert.equal(s.fighters[0].effects['免异常'].end,5);for(let r=2;r<=5;r++){s=turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);}s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']>=2);
});
test('3031一骑440当前三回合PP倍耗第四恢复，478当前三回封属性第四实际加速',()=>{
 let s=make(24729,{enemyMoves:[10086]}),n=s.fighters[1].pp['wiki:10086'];for(let r=1;r<=4;r++){s=turn(s,r===1?24729:pp,10086);n-=r<=3?2:1;assert.equal(s.fighters[1].pp['wiki:10086'],n);}
 s=make(24730,{enemyMoves:[20889]});for(let r=1;r<=4;r++){s=turn(s,r===1?24730:pp,20889);assert.equal(s.fighters[1].stages.spe,r<=3?0:1);}
});
test('3031一骑790只有当前三轮忽红伤上限，第4轮恢复真实50上限，不修改敌上限状态',()=>{
 let s=make(24729,{extraMoves:[13527],bStats:{def:1000},bEffects:{伤害上限:{start:1,end:10,amount:50,attackOnly:true}}});s=turn(s,24729);assert.equal(s.fighters[0].effects['无视伤害限制'].end,3);for(let r=2;r<=4;r++){s=turn(s,13527);const n=attacks(s,0)[0].settledDamage;if(r<=3)assert.ok(n>50);else assert.equal(n,50);assert.equal(s.fighters[1].effects['伤害上限'].amount,50);}
});
test('3031邪念599三轮物理与特殊红伤各减60第4恢复，原生固定75百分比800独立不减',()=>{
 let s=turn(make(19271,{enemyId:3014,enemyMoves:[10004,11042],aStages:{acc:6}}),19271,10004);assert.equal(s.fighters[0].effects['分类攻击减伤'].end,3);assert.ok(redDetail(s,1).includes('增减伤 0.4'));s=turn(s,pp,11042);assert.ok(redDetail(s,1).includes('增减伤 0.4'));s=turn(s,pp,10004);assert.ok(redDetail(s,1).includes('增减伤 0.4'));s=turn(s,pp,10004);assert.ok(redDetail(s,1).includes('增减伤 1 ×'));
 for(const[move,type,n]of[[10761,'fixed',75],[16397,'percent',800]]){const out=turn(make(19271,{enemyId:3017,enemyMoves:[move],aStages:{acc:6}}),19271,move);assert.equal(out.damageEvents.filter(e=>e.type===type&&e.targetSide===0).reduce((sum,e)=>sum+e.settledDamage,0),n);}
 let clear=turn(make(19271,{enemyId:3014,enemyMoves:[19199],aStages:{acc:6}}),19271);assert.ok(clear.fighters[0].effects['分类攻击减伤']);clear=turn(clear,pp,19199);assert.ok(redDetail(clear,1).includes('增减伤 0.4'));assert.equal(clear.fighters[0].effects['分类攻击减伤'],undefined);
});
test('3031人中816真实免一次攻击并按完整免疫量反真实，下次属性和药剂不消费，第二攻击正常',()=>{
 let s=turn(make(24730,{enemyMoves:[10086]}),24730);s=turn(s,pp,pp);s=turn(s,pp,10086);assert.equal(attacks(s,1)[0].settledDamage,0);const reflected=s.damageEvents.filter(e=>e.round===s.turns.at(-1).round&&e.type==='true'&&e.sourceSide===0&&e.targetSide===1);assert.equal(reflected.length,1);assert.ok(reflected[0].settledDamage>0);s=turn(s,pp,10086);assert.ok(attacks(s,1)[0].settledDamage>0);assert.ok(!s.damageEvents.some(e=>e.round===s.turns.at(-1).round&&e.type==='true'&&e.sourceSide===0));
});
