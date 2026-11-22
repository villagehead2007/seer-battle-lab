'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3056-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
const hit=(s,side)=>s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===side);
test('3056逆转544仅清烧冻毒和3清负级保正级，43回满；58下两轮必暴及481仅下轮先制二',()=>{
 let s=turn(make(23285,{extraMoves:[10127],aHp:1000,aStats:{spe:1},aAilments:{烧伤:3,冻伤:3,中毒:3},aStages:{atk:-2,def:2},enemyMoves:[10086]}),23285);for(const k of['烧伤','冻伤','中毒'])assert.equal(s.fighters[0].ailments[k],undefined);assert.equal(s.fighters[0].stages.atk,0);assert.equal(s.fighters[0].stages.def,2);assert.equal(s.fighters[0].hp,9000);assert.equal(s.fighters[0].pp['wiki:23285'],0);for(let r=2;r<=4;r++){s=turn(s,10127,10086);assert.equal(s.turns.at(-1).first,r===2?0:1);assert.equal(hit(s,0).detail.includes('暴击 2'),r<=3);}s=turn(make(23285,{aAilments:{流血:3}}),23285);assert.ok(s.fighters[0].ailments['流血']);
});
test('3056英勇408当前三轮每次红伤定额减120第四恢复，原生固定75百分比800真毒1125均不减',()=>{
 let s=make(23287,{aStats:{def:1000},enemyMoves:[10086],bStats:{atk:9999}});for(let r=1;r<=4;r++){s=turn(s,r===1?23287:pp,10086);const e=hit(s,1),raw=Number(e.detail.match(/= (\d+)；暴击/)[1]);assert.equal(e.damage.settledDamage,Math.max(0,raw-(r<=3?120:0)));}for(const[move,type,n]of[[10761,'fixed',75],[16397,'percent',800]]){s=turn(make(23287,{enemyId:3017,enemyMoves:[move]}),23287,move);assert.equal(s.damageEvents.find(e=>e.type===type&&e.targetSide===0).settledDamage,n);}s=turn(make(23287,{aAilments:{中毒:3}}),23287);assert.equal(s.damageEvents.find(e=>e.type==='true'&&e.targetSide===0).settledDamage,1125);
});
test('3056英勇48免异常五轮与霸威191免反五轮，原生睡眠第六恢复且前者不反后者反',()=>{
 for(const[id,reflect]of[[23287,false],[24780,true]]){let s=turn(make(id,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),id);s=turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);assert.equal(!!s.fighters[1].ailments['睡眠'],reflect);for(let r=3;r<=5;r++)s=turn(s,pp);s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']);}
});
test('3056圣甲气魄60当前四轮每轮固定150包括药剂轮，第五停止；478当前两轮封原生加速第三恢复',()=>{
 let s=make(24779,{enemyMoves:[20889]});for(let r=1;r<=5;r++){s=turn(s,r===1?24779:pp,20889);const fixed=s.damageEvents.filter(e=>e.round===r&&e.type==='fixed'&&e.sourceSide===0);assert.equal(fixed.filter(e=>e.settledDamage===150).length,r<=4?1:0);if(r===1)assert.equal(fixed.find(e=>e.settledDamage===400).settledDamage,400);assert.equal(s.fighters[1].stages.spe,r<=2?0:r-2);}
});
test('3056霸威806当前三轮按对方实际攻击技能每招只全强一，药剂不触发，原生3至5段也只一',()=>{
 let s=make(24780,{enemyMoves:[10086]});for(let r=1;r<=4;r++){s=turn(s,r===1?24780:pp,r===2?pp:10086);for(const k of keys)assert.equal(s.fighters[0].stages[k],r<=2?2:3);}s=turn(make(24780,{enemyId:3056,enemyMoves:[15966]}),24780,15966);assert.ok(s.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===1).length>=3);for(const k of keys)assert.equal(s.fighters[0].stages[k],2);
});
test('3056狂绝776仅下两轮红伤翻倍第三恢复，后手圣战402固定100各轮不放大，先手不附100',()=>{
 let s=turn(make(19366,{extraMoves:[15967],enemyMoves:[10086],aStats:{spe:1}}),19366,10086);for(let r=2;r<=4;r++){s=turn(s,15967,10086);assert.ok(hit(s,0).detail.includes('增减伤 '+(r<=3?2:1)+' ×'));assert.equal(s.damageEvents.find(e=>e.round===r&&e.type==='fixed'&&e.sourceSide===0).settledDamage,100);}s=turn(make(15967,{enemyMoves:[10086]}),15967,10086);assert.equal(s.turns.at(-1).first,0);assert.ok(!s.damageEvents.some(e=>e.type==='fixed'&&e.sourceSide===0));
});
