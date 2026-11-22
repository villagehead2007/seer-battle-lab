'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3079-native.cjs'),pp='potion:pp';
test('3079雷皇57当前两轮用招回血第三停，极鸣791四轮低体双倍第五停，真实中毒使到期不被满体掩盖',()=>{
 for(const[id,last,n]of[[23360,2,3000],[24839,4,6000]]){let s=make(id,{extraMoves:[20004],aHp:1,aAilments:{中毒:7}}),hp=1;for(let r=1;r<=last+1;r++){s=turn(s,r===1?id:20004);hp=Math.min(9000,hp+(r<=last?n:0))-1125;assert.equal(s.fighters[0].hp,hp);}}
 for(const id of[23360,24839]){const s=turn(make(id,{aHp:1000,aEffects:{无法通过自身技能恢复体力:{start:1,end:3}}}),id);assert.equal(s.fighters[0].hp,1000);}
});
test('3079舞空48五轮免真实睡眠第六恢复，万劫191四轮反睡第五恢复并且47四轮免真实弱化',()=>{
 for(const[id,last]of[[23358,5],[24838,4]]){let s=turn(make(id,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),id);s=turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);if(id===24838)assert.ok(s.fighters[1].ailments['睡眠']);for(let r=3;r<=last;r++)s=turn(s,pp);s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']);}
 let s=make(24838,{enemyId:3075,enemyMoves:[20491]});for(let r=1;r<=5;r++){s=turn(s,r===1?24838:pp,20491);assert.equal(s.fighters[0].stages.spd,r<=4?0:-1);}
});
test('3079万劫776仅下两轮红伤翻倍第三轮恢复，独立百分比吸取不翻倍且普通系红也获得加成',()=>{
 let s=turn(make(24838,{extraMoves:[10006]}),24838);for(let r=2;r<=4;r++){s=turn(s,10006);const e=s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0);assert.ok(e.detail.includes('增减伤 '+(r<=3?2:1)+' ×'),e.detail);assert.equal(s.damageEvents.find(e=>e.round===r&&e.sourceSide===0&&e.type==='percent').settledDamage,1800);}
});
test('3079狂雷843下两轮先制一和极鸣843下两轮先制二，属性招低速也生效且第三轮恢复',()=>{
 for(const[id,n]of[[19478,1],[24839,2]]){let s=turn(make(id,{extraMoves:[20004],enemyMoves:[10086],aStats:{spe:1}}),id,10086);for(let r=2;r<=4;r++){s=turn(s,20004,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,r<=3?n:0);assert.equal(s.turns.at(-1).first,r<=3?0:1);}}
});
test('3079激雷44当前三轮特殊红伤减半第四恢复，78当前三轮普通物理MISS第四恢复',()=>{
 let s=make(23359,{enemyMoves:[13601]});for(let r=1;r<=4;r++){s=turn(s,r===1?23359:pp,13601);const e=s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===1);assert.ok(e.detail.includes('增减伤 '+(r<=3?.5:1)+' ×'),e.detail);}
 s=make(23359,{enemyMoves:[10086]});for(let r=1;r<=4;r++){s=turn(s,r===1?23359:pp,10086);assert.equal(s.damageEvents?.some(e=>e.round===r&&e.type==='attack'&&e.sourceSide===1&&e.settledDamage>0)??false,r===4);}
});
