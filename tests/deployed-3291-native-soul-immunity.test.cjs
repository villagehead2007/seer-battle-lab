'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3291-native.cjs');
test('3291原622对原3242固定与原3079百分比附伤均免疫，派生双抗始终100不随养成面板变化',()=>{
 for(const configured of [0,30,55])for(const [enemy,move,soul]of[[3242,17492,568],[3079,16103,425]]){const s=H.turn(H.make(10499,{aHp:1000,enemyId:enemy,enemyMoves:[move],aStages:{acc:6},bStages:{acc:6},aGear:{resistance:{fixed:configured,percent:configured}}}),10499,move);assert.equal(s.fighters[1].soulId,soul);assert.ok(H.damage(s,'attack',1)>0);assert.equal(H.damage(s,'fixed',1),0);assert.equal(H.damage(s,'percent',1),0);assert.equal(s.fighters[0].hp,2125-H.damage(s,'attack',1));const before=structuredClone(s);assert.equal(H.E.GEAR.damageResistance(s.fighters[0],'fixed'),100);assert.equal(H.E.GEAR.damageResistance(s.fighters[0],'percent'),100);assert.equal(H.E.GEAR.mitigate(s.fighters[0],1000,'fixed',{ignoreImmunity:true}),0);assert.equal(H.E.GEAR.mitigate(s.fighters[0],1000,'percent',{ignoreImmunity:true}),0);assert.deepEqual(s,before,'只读派生抗性和公共减伤计算不伪造伤害事件');}
});
test('3291原622天生免弱在前三回星皇之佑到期后仍挡原断水五项，原专注命中加一保留',()=>{
 let s=H.make(20530,{enemyId:3242,enemyMoves:[24118],aStats:{spe:4000}});for(let r=1;r<=3;r++)s=H.turn(s,'potion:pp');s=H.turn(s,20530,24118);for(const k of ['atk','def','spa','spd','spe'])assert.equal(s.fighters[0].stages[k],0);assert.equal(s.fighters[0].stages.acc,1);assert.equal(s.fighters[0].effects['PP消耗倍增'].multiple,2);const pp=s.fighters[0].pp['wiki:20530'];s=H.turn(s,20530);assert.equal(s.fighters[0].pp['wiki:20530'],pp-2);
});
test('3291首发星皇之佑前三回真实安魂曲均免，第四回正常睡眠，第五回被控未出无PP消耗也无星皇之赐',()=>{
 let s=H.make(10499,{aHp:1000,enemyId:3205,enemyMoves:[22053],bStages:{acc:6}});for(let r=1;r<=4;r++){s=H.turn(s,'potion:pp',22053);assert.equal(Boolean(s.fighters[0].ailments.睡眠),r===4);assert.equal(s.fighters[0].hp,1000+r*1125);}const pp=s.fighters[0].pp['wiki:10499'];s=H.turn(s,10499);assert.equal(s.fighters[0].pp['wiki:10499'],pp);assert.equal(s.fighters[0].hp,5500);
});
test('3291原622免固百分与双抗100不免真实反馈，原3242战霸200比例真实HP损失保留，禁疗仅阻星赐回复',()=>{
 const s=H.turn(H.make(10499,{enemyId:3242,enemyMoves:[25183],aStats:{spe:100},bStats:{spe:4000},aStages:{acc:6},aEffects:{四杀鬼囹:{start:1,end:1}}}),10499,25183),n=H.damage(s,'true',1);assert.ok(n>0);assert.equal(s.fighters[0].hp,9000-n);assert.equal(H.E.GEAR.damageResistance(s.fighters[0],'true'),0);assert.equal(H.damage(s,'fixed',1)+H.damage(s,'percent',1),0);
});
