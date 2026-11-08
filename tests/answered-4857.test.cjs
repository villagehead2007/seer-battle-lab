'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4857/snapshot.json');
const {E,make,turn,timer,sum}=require('./helpers/remaining-battle.cjs')(source),move=source.moves.find(m=>m.kind==='status').id;
function hit(s,amount=1000,type='fixed'){const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterUse'&&c.a.side===1)c.hurt(c.t,amount,'2044致死交互实际伤害',type);}};try{turn(s,move,20309);}finally{E.SOULS=old;}}
test('4857已答2044：奇数两防半值向上取整，回复按实际减少量，正零负等级不改变面板基数，先扣损失再回复',()=>{
 for(const stage of [-6,0,6]){const s=make({move,index:-1,soul:true,hp:100,aStats:{def:401,spd:403}});s.fighters[0].stages.def=stage;s.fighters[0].stages.spd=stage;hit(s);const a=s.fighters[0],e=a.soulState.phalanx2044.survivalEvents[0];assert.equal(a.stats.def,201);assert.equal(a.stats.spd,202);assert.equal(a.stages.def,stage);assert.equal(a.stages.spd,stage);assert.equal(e.total,401);assert.equal(e.hpBefore,1);assert.equal(e.restored,401);assert.equal(a.hp,402);assert.equal(s.damageEvents.find(e=>e.type==='fixed').settledDamage,1000);assert.equal(s.damageEvents.find(e=>e.type==='fixed').hpLoss,99);}
});
test('4857已答2044：实际攻击伤害路径也在保1后减两防回复，原本1HP零HP损失仍触发一次',()=>{
 const red=make({move,index:-1,soul:true,hp:100,aStats:{def:301,spd:303},bStats:{atk:9999}});turn(red,move,10127);assert.ok(sum(red,'attack',1)>100);assert.equal(red.fighters[0].hp,302);assert.equal(red.fighters[0].stats.def,151);assert.equal(red.fighters[0].stats.spd,152);
 const one=make({move,index:-1,soul:true,hp:1});hit(one);assert.equal(one.fighters[0].hp,301);assert.equal(one.damageEvents.find(e=>e.type==='fixed').hpLoss,0);assert.equal(one.damageEvents.find(e=>e.type==='fixed').settledDamage,1000);assert.equal(one.fighters[0].soulState.phalanx2044.survivalEvents.length,1);
});
test('4857已答2044：降低同步或替换后的面板，不改基础或对手面板，回复仍取两项实际减少之和',()=>{
 for(const mode of ['sync','preset']){const s=make({move,index:-1,soul:true,hp:100,aStats:{def:201,spd:203},bStats:{def:777,spd:779}});if(mode==='sync'){timer(s,0,'面板同步:def',{sourceSide:1});timer(s,0,'面板同步:spd',{sourceSide:1});}else timer(s,0,'面板数值设定',{values:{def:501,spd:503}});hit(s);const a=s.fighters[0],expected=mode==='sync'?[389,390,777]:[251,252,501];assert.equal(E.panelStat(a,'def'),expected[0]);assert.equal(E.panelStat(a,'spd'),expected[1]);assert.equal(a.stats.def,201);assert.equal(a.stats.spd,203);assert.equal(s.fighters[1].stats.def,777);assert.equal(s.fighters[1].stats.spd,779);assert.equal(a.hp,1+expected[2]);assert.equal(a.soulState.phalanx2044.survivalEvents[0].total,expected[2]);}
});
test('4857已答2044：最低1不增加，非致死或免疫不消费；禁疗只阻回复，技能禁疗不阻魂印；第二次致死不重授',()=>{
 const minimum=make({move,index:-1,soul:true,hp:100,aStats:{def:1,spd:1}});hit(minimum);assert.equal(minimum.fighters[0].stats.def,1);assert.equal(minimum.fighters[0].stats.spd,1);assert.equal(minimum.fighters[0].hp,1);
 const small=make({move,index:-1,soul:true,hp:100});hit(small,50);assert.equal(small.fighters[0].hp,50);assert.equal(small.fighters[0].soulState.phalanx2044.survivalUsed,false);assert.equal(small.fighters[0].stats.def,300);
 const immune=make({move,index:-1,soul:true,hp:100});timer(immune,0,'固定百分比免疫');hit(immune);assert.equal(immune.fighters[0].hp,100);assert.equal(immune.fighters[0].soulState.phalanx2044?.survivalUsed??false,false);
 for(const skill of [false,true]){const s=make({move,index:-1,soul:true,hp:100});if(skill)timer(s,0,'技能禁疗');else timer(s,0,'回复效果削减',{fraction:1});hit(s);assert.equal(s.fighters[0].hp,skill?301:1);assert.equal(s.fighters[0].stats.def,150);assert.equal(s.fighters[0].soulState.phalanx2044.survivalUsed,true);}
 const once=make({move,index:-1,soul:true,hp:100});hit(once);hit(once);assert.equal(once.fighters[0].hp,0);assert.equal(once.fighters[0].stats.def,150);assert.equal(once.fighters[0].soulState.phalanx2044.survivalEvents.length,1);
});
