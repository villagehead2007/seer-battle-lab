'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3036-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
test('3036瞄准只命中一千秋只特攻速度命中一，六封顶与禁强化均遵守',()=>{
 for(const[id,affected]of[[20065,['acc']],[24739,['spa','spe','acc']]])for(const mode of['normal','cap','blocked']){const s=turn(make(id,{aStages:mode==='cap'?Object.fromEntries(keys.map(k=>[k,6])):{},aEffects:mode==='blocked'?{禁强化:{start:1,end:2}}:{}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='blocked'?0:affected.includes(k)?1:0);}
});
test('3036威慑悲鸣龙承按原项目降一级，负六封底与真实星皇免弱',()=>{
 for(const[id,affected]of[[20041,['atk']],[20660,['def','spd']],[19288,['spd','acc']]])for(const mode of['normal','floor','immune']){const s=turn(make(id,{enemyId:mode==='immune'?3291:2989,bStages:mode==='floor'?Object.fromEntries(keys.map(k=>[k,-6])):{},aStages:{acc:6}}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],mode==='floor'?-6:mode==='immune'?0:affected.includes(k)?-1:0);}
});
test('3036狂暴885严格高于对手六项二，等体与低体仅一，禁强化不阻同招固定吸取',()=>{
 for(const[aHp,bHp,n]of[[5001,5000,2],[5000,5000,1],[4999,5000,1]]){const s=turn(make(24742,{aHp,bHp}),24742);for(const k of keys)assert.equal(s.fighters[0].stages[k],n);assert.ok(s.damageEvents.some(e=>e.type==='fixed'&&e.sourceSide===0));}const s=turn(make(24742,{aEffects:{禁强化:{start:1,end:2}}}),24742);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===0));assert.equal(s.damageEvents.find(e=>e.type==='fixed').settledDamage,400);
});
test('3036飞龙521仅反自身负级保正级，当次物理红伤先用原负攻600，负六反正六',()=>{
 for(const negative of[-2,-6]){const s=turn(make(19290,{aStages:{atk:negative,def:2,acc:-6}}),19290);assert.equal(s.fighters[0].stages.atk,-negative);assert.equal(s.fighters[0].stages.def,2);assert.equal(s.fighters[0].stages.acc,6);assert.equal(s.damageEvents.find(e=>e.type==='attack').attackValue,negative===-2?600:300);}
});
test('3036双龙85吸真实敌方双防正二，当次红伤用原特攻1200；无正级不造强化保负级',()=>{
 let s=make(19289,{enemyMoves:[24624],aStages:{acc:6}});s=turn(s,pp,24624);s=turn(s,19289);assert.equal(s.fighters[1].stages.def,0);assert.equal(s.fighters[1].stages.spd,0);assert.equal(s.fighters[0].stages.def,2);assert.equal(s.fighters[0].stages.spd,2);assert.equal(s.damageEvents.find(e=>e.round===2&&e.type==='attack').attackValue,1200);s=turn(make(19289,{bStages:{atk:-2},aStages:{acc:6}}),19289);assert.equal(s.fighters[1].stages.atk,-2);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===0||n===6));
});
test('3036轰天813两倍反馈并清自身负级，原正级保留，负六封底及敌免弱仍清自己',()=>{
 for(const enemyId of[2989,3291]){const s=turn(make(24741,{enemyId,aStages:{atk:-2,def:-6,spa:2}}),24741);assert.equal(s.fighters[0].stages.atk,0);assert.equal(s.fighters[0].stages.def,0);assert.equal(s.fighters[0].stages.spa,2);assert.equal(s.fighters[1].stages.atk,enemyId===3291?0:-4);assert.equal(s.fighters[1].stages.def,enemyId===3291?0:-6);assert.equal(s.fighters[0].hp,9000);}const empty=turn(make(24741),24741);assert.ok(Object.values(empty.fighters[1].stages).every(n=>n===0));
});
