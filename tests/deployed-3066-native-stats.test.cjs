'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3066-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
test('3066加速意志超声卧牛各项强化按原值，天谋严格低半全二等高全一，六封顶与禁强化',()=>{
 for(const[id,hp,v]of[[20030,4500,{spe:1}],[20044,4500,{def:1}],[20118,4500,{acc:2}],[23345,4500,{spa:2,spe:1,acc:1}],[24805,4499,Object.fromEntries(keys.map(k=>[k,2]))],[24805,4500,Object.fromEntries(keys.map(k=>[k,1]))],[24805,4501,Object.fromEntries(keys.map(k=>[k,1]))]])for(const mode of['normal','cap','blocked']){const s=turn(make(id,{aHp:hp,aStages:mode==='cap'?Object.fromEntries(keys.map(k=>[k,6])):{},aEffects:mode==='blocked'?{禁强化:{start:1,end:2}}:{}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='blocked'?0:v[k]??0);if(id===24805)assert.equal(s.fighters[0].hp,Math.min(9000,hp+3000));}
});
test('3066后起198原生24种子每次恰两种不同能力降一，负六封底且真实星皇免弱',()=>{
 const patterns=new Set();for(let seed=1;seed<=24;seed++){const s=turn(make(23343,{seed}),23343),negative=keys.filter(k=>s.fighters[1].stages[k]===-1);assert.equal(negative.length,2);assert.ok(keys.every(k=>s.fighters[1].stages[k]===0||s.fighters[1].stages[k]===-1));patterns.add(negative.join(','));}assert.ok(patterns.size>2);let s=turn(make(23343,{bStages:Object.fromEntries(keys.map(k=>[k,-6]))}),23343);assert.ok(Object.values(s.fighters[1].stages).every(n=>n===-6));s=turn(make(23343,{enemyId:3291}),23343);assert.ok(Object.values(s.fighters[1].stages).every(n=>n===0));
});
test('3066火烧33清实际双防正二保负级，引风85吸双防到自己且当前本体先按原攻与原防',()=>{
 for(const id of[16074,19414]){let s=make(id,{enemyMoves:[24624],aStages:{acc:6}});s=turn(s,pp,24624);s=turn(s,id);assert.equal(s.fighters[1].stages.def,0);assert.equal(s.fighters[1].stages.spd,0);assert.equal(s.fighters[0].stages.def,id===19414?2:0);assert.equal(s.fighters[0].stages.spd,id===19414?2:0);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.type==='attack').detail.includes('防御 8000'));s=turn(make(id,{bStages:{def:-2},aStages:{acc:6}}),id);assert.equal(s.fighters[1].stages.def,-2);assert.equal(s.fighters[0].stages.def,0);}
});
test('3066石亭3只清负级与无主521反负级不同，当次物理均先用负攻600而保原正级',()=>{
 for(const id of[16075,19415]){const s=turn(make(id,{aStages:{atk:-2,def:2,acc:6}}),id);assert.equal(s.damageEvents.find(e=>e.type==='attack').attackValue,600);assert.equal(s.fighters[0].stages.atk,id===16075?0:2);assert.equal(s.fighters[0].stages.def,2);assert.equal(s.fighters[0].stages.acc,6);}
});
test('3066引风765当前三轮对方原生加速不能形成提升，第四恢复；禁强化不抹原有正能力',()=>{
 let s=make(19414,{enemyMoves:[20889]});for(let r=1;r<=4;r++){s=turn(s,r===1?19414:pp,20889);assert.equal(s.fighters[1].stages.spe,r<=3?0:1);}s=turn(make(19414,{bStages:{spe:2}}),19414);assert.equal(s.fighters[0].stages.spe,2);assert.equal(s.fighters[1].stages.spe,0);
});
test('3066第五889仅真实清回合成功才烧伤，当前本体160不追溯倍增，下次撞击70；空效果不强行烧伤',()=>{
 let s=make(19417,{extraMoves:[10001],enemyId:3036,enemyMoves:[24740]});s=turn(s,pp,24740);s=turn(s,19417);assert.equal(s.fighters[1].effects['免弱'],undefined);assert.ok(s.fighters[1].ailments['烧伤']);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.type==='attack').detail.includes('威力 160 ·'));assert.equal(s.damageEvents.find(e=>e.round===2&&e.type==='true'&&e.targetSide===1).settledDamage,1125);s=turn(s,10001);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.type==='attack').detail.includes('威力 70 ·'));s=turn(make(19417),19417);assert.equal(s.fighters[1].ailments['烧伤'],undefined);
});
