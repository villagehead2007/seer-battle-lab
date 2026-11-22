'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3141-native.cjs'),pp='potion:pp';
test('3141雷电48三轮免睡第四恢复，死寂及控魂191四轮反弹第五恢复，控魂47五轮免弱第六恢复',()=>{
 for(const[id,last]of[[22201,3],[23949,4],[24965,4]]){let s=H.turn(H.make(id,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),id);s=H.turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);if(id!==22201)assert.ok(s.fighters[1].ailments['睡眠']);for(let r=3;r<=last;r++)s=H.turn(s,pp);s=H.turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']);}
 let s=H.make(24965,{enemyId:3075,enemyMoves:[20491]});for(let r=1;r<=6;r++){s=H.turn(s,r===1?24965:pp,20491);assert.equal(s.fighters[0].stages.spd,r<=5?0:-1);}
});
test('3141死寂46只挡下一次红伤并消费；枯萎972按实际出手低体授挡而非回初快照',()=>{
 let s=H.make(23949,{aHp:9000,enemyMoves:[10086]});s=H.turn(s,23949,10086);assert.equal(s.damageEvents.find(e=>e.round===1&&e.sourceSide===1&&e.type==='attack').settledDamage,0);s=H.turn(s,pp,10086);assert.ok(s.damageEvents.find(e=>e.round===2&&e.sourceSide===1&&e.type==='attack').settledDamage>0);
 s=H.turn(H.make(19723,{aHp:7001,bHp:7000,aStats:{spe:1,def:1000},bStats:{atk:9999,spe:2000},enemyMoves:[10086],aStages:{acc:6},bEffects:{免异常:{start:1,end:5}}}),19723,10086);assert.equal(s.fighters[0].soulState.hadesLow,false);assert.ok(s.fighters[0].hp<7000);const hp=s.fighters[0].hp;s=H.turn(s,pp,10086);assert.equal(s.damageEvents.find(e=>e.round===2&&e.sourceSide===1&&e.type==='attack').settledDamage,0);assert.equal(s.fighters[0].hp,hp);s=H.turn(H.make(19723,{aHp:9000,bHp:9000,aStages:{acc:6}}),19723);assert.equal(s.fighters[0].counts.attackNullify??0,0);
});
test('3141死寂和控魂681仅下两轮保证攻击命中与暴击，负六命中仍击中第三轮到期',()=>{
 for(const id of[23949,24965]){let s=H.turn(H.make(id,{extraMoves:[10074],aStages:{acc:-6}}),id);for(let r=2;r<=3;r++){s=H.turn(s,10074);const e=s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack');assert.ok(e&&e.detail.includes('暴击 2 ×'));}s=H.turn(s,pp);assert.ok(!s.fighters[0].effects['攻击必中']||s.fighters[0].effects['攻击必中'].end<4);assert.ok(!s.fighters[0].effects['必定暴击']||s.fighters[0].effects['必定暴击'].end<4);}
});
test('3141暗夜475按完整红伤低于300才给下两轮暴击，过量保1实际零损不误给；黑夜481只下轮攻击加一',()=>{
 let s=H.turn(H.make(14118,{extraMoves:[14115],aStages:{acc:6}}),14118);assert.ok(s.damageEvents.find(e=>e.sourceSide===0&&e.type==='attack').settledDamage<300);for(let r=2;r<=3;r++){s=H.turn(s,14115);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('暴击 2 ×'));}s=H.turn(s,14115);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('暴击 1 ×'));
 s=H.turn(H.make(14118,{bHp:1,aStats:{spa:9999},bStats:{spd:1000},aStages:{acc:6},bEffects:{致命保留:{start:1,end:4,hp:1}}}),14118);assert.ok(s.damageEvents.find(e=>e.sourceSide===0&&e.type==='attack').settledDamage>300);assert.equal(s.fighters[0].effects['必定暴击'],undefined);
 for(const next of[20496,14115]){s=H.turn(H.make(22202,{extraMoves:[next]}),22202);s=H.turn(s,next);assert.equal(s.fighters[0].soulState.resolvedPriority.value,next===20496?2:3);s=H.turn(s,next);assert.equal(s.fighters[0].soulState.resolvedPriority.value,2);}
});
test('3141冥府597四轮用招吸取第五停，亡灵971严格低半双吸并实时随回血恢复单吸，药剂及禁疗独立',()=>{
 let s=H.make(23950,{extraMoves:[20496],aHp:1,aAilments:{中毒:7},bGear:{resistance:{percent:100}}}),hp=1;for(let r=1;r<=5;r++){s=H.turn(s,r===1?23950:20496);hp=Math.min(9000,hp+(r<=4?3000:0))-1125;assert.equal(s.fighters[0].hp,hp);assert.equal(s.fighters[1].hp,9000);}
 for(const hp0 of[4499,4500,4501]){s=H.turn(H.make(24966,{extraMoves:[20496],aHp:hp0,bGear:{resistance:{percent:100}}}),24966);assert.equal(s.fighters[0].hp,Math.min(9000,hp0+(hp0<4500?6000:3000)));const hp=s.fighters[0].hp;s=H.turn(s,pp);assert.equal(s.fighters[0].hp,hp);}
 for(const id of[23950,24966]){s=H.turn(H.make(id,{aHp:1000,aEffects:{无法通过自身技能恢复体力:{start:1,end:4}}}),id);assert.equal(s.fighters[0].hp,1000);assert.equal(s.fighters[1].hp,id===24966?3000:6000);}
});
test('3141冥府164三轮受击害怕第四到期，负级747仅本招行动加一且强化后下一使用不再加',()=>{
 let s=H.make(23950,{aHp:9000,bHp:4500,enemyMoves:[10086],bEffects:{免异常:{start:1,end:1}}});s=H.turn(s,23950,10086);assert.equal(s.fighters[1].ailments['害怕'],undefined);s=H.turn(s,pp,10086);assert.ok(s.fighters[1].ailments['害怕']);for(let r=3;r<=4;r++)s=H.turn(s,pp);s=H.turn(s,pp,10086);assert.equal(s.fighters[1].ailments['害怕'],undefined);
 s=H.turn(H.make(23950,{aStages:{atk:-1},extraMoves:[20496]}),23950);assert.equal(s.fighters[0].soulState.resolvedPriority.value,3);assert.equal(s.fighters[0].stages.atk,0);s=H.turn(s,23950);assert.equal(s.fighters[0].soulState.hadesLow,false);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);
});
