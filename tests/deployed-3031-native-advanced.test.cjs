'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3031-native.cjs'),pp='potion:pp';
const events=(s,type,side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type===type&&e.sourceSide===side);
test('3031流轮88原15%二倍实际自然种子有两支，非满体魂印不混入50%红增伤',()=>{
 let normal=0,double=0;for(let seed=1;seed<=48;seed++){const s=turn(make(14042,{seed}),14042),d=s.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0).detail;if(d.includes('增减伤 2 ×'))double++;else{assert.ok(d.includes('增减伤 1 ×'));normal++;}assert.ok(events(s,'attack')[0].settledDamage>0);}assert.ok(normal>0&&double>0);
});
test('3031八荒683原100到200固定两端使用真实初始预选种子，固定抗性100归零且本体红伤仍在',()=>{
 const seeds=require('../research/TEAM-STAGE-2/3031-native-fixed-boundary-seeds.json').found;for(const n of[100,200]){const s=turn(make(19273,{seed:seeds[n]}),19273);assert.equal(events(s,'fixed')[0].settledDamage,n);assert.ok(events(s,'attack')[0].settledDamage>0);}const s=turn(make(19273,{bGear:{resistance:{fixed:100}}}),19273);assert.equal(events(s,'fixed')[0].settledDamage,0);assert.ok(events(s,'attack')[0].settledDamage>0);
});
test('3031一戟466独立技能回复200，技能禁疗不挡本招正常非溢出红伤的魂印回复，近满封顶',()=>{
 for(const blocked of[false,true]){const s=turn(make(19269,{aHp:1000,aEffects:blocked?{'无法通过自身技能恢复体力':{start:1,end:2}}:{}}),19269),red=events(s,'attack')[0].settledDamage;assert.equal(s.fighters[0].hp,1000+Math.floor(red/2)+(blocked?0:200));}const s=turn(make(19269,{aHp:8999}),19269);assert.equal(s.fighters[0].hp,9000);
});
test('3031人中708严格低半恢复500，等半与高半250，技能禁疗及满体封顶',()=>{
 for(const[aHp,n]of[[4499,500],[4500,250],[4501,250],[8999,1]]){const s=turn(make(24730,{aHp}),24730);assert.equal(s.fighters[0].hp,aHp+n);}const s=turn(make(24730,{aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:2}}}),24730);assert.equal(s.fighters[0].hp,1000);
});
test('3031人中816反真按同种子完整免疫红伤量，不以目标实际HP损失或仅1点为基数',()=>{
 const options={enemyMoves:[10086],bStats:{atk:9999}},control=turn(make(24730,options),pp,10086),raw=events(control,'attack',1)[0].settledDamage,s=turn(make(24730,options),24730,10086);assert.ok(raw>1);assert.equal(events(s,'attack',1)[0].settledDamage,0);assert.equal(events(s,'true',0)[0].settledDamage,raw);
});
test('3031第五180清真实必暴，606严格高体威力320否则160，888按出手低体锁定当轮2250百分比且不持续',()=>{
 for(const[aHp,bHp,power,pulse]of[[7000,1000,320,0],[5000,5000,160,0],[1000,5000,160,2250],[4999,5000,160,2250]]){let s=turn(make(19274,{aHp,bHp}),19274),d=s.turns[0].events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0).detail;assert.ok(d.includes('威力 '+power+' ·'));assert.equal(events(s,'percent').reduce((n,e)=>n+e.settledDamage,0),pulse);s=turn(s,pp);assert.equal(events(s,'percent').length,0);}let s=make(19274,{enemyMoves:[20355]});s=turn(s,pp,20355);assert.ok(s.fighters[1].effects['必定暴击']);s=turn(s,19274);assert.equal(s.fighters[1].effects['必定暴击'],undefined);
});
test('3031烽火456按红伤后严格不足280秒杀，等280不杀；真实MISS不执行低体秒杀',()=>{
 const control=turn(make(19272),19272),red=events(control,'attack')[0].settledDamage;for(const hp of[279,280]){const s=turn(make(19272,{bHp:hp+red}),19272);assert.equal(s.fighters[1].hp,hp===279?0:280);}
 let hit=0,miss=0;for(let seed=1;seed<=24;seed++){const s=turn(make(19272,{seed,bHp:200,aStages:{acc:-6}}),19272);if(events(s,'attack').length){hit++;assert.equal(s.fighters[1].hp,0);}else{miss++;assert.equal(s.fighters[1].hp,200);}}assert.ok(hit>0&&miss>0);
});
