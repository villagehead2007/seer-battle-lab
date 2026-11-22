'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3056-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
test('3056气力战意蒸汽荷枪霸威按真实各项加成，六封顶和禁强化仍保其他技能效果',()=>{
 for(const[id,values]of[[20117,{atk:1}],[20307,{def:1}],[20380,{spa:2,spd:2}],[23286,{atk:2,def:1,spd:1,spe:1,acc:1}],[24780,Object.fromEntries(keys.map(k=>[k,1]))]])for(const mode of['normal','cap','blocked']){const s=turn(make(id,{aStages:mode==='cap'?Object.fromEntries(keys.map(k=>[k,6])):{},aEffects:mode==='blocked'?{禁强化:{start:1,end:2}}:{}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='blocked'?0:values[k]??0);if(id===24780)assert.ok(s.fighters[0].effects.reflect);}
});
test('3056疾动33实际消除原生双防二保留负级，清完才不影响已结算红伤，空正级不造变化',()=>{
 let s=make(15965,{enemyMoves:[24624]});s=turn(s,pp,24624);assert.equal(s.fighters[1].stages.def,2);s=turn(s,15965);assert.equal(s.fighters[1].stages.def,0);assert.equal(s.fighters[1].stages.spd,0);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.type==='attack').detail.includes('防御 8000'));s=turn(make(15965,{bStages:{def:-2}}),15965);assert.equal(s.fighters[1].stages.def,-2);
});
test('3056破阵521当前红伤先按负特攻600，然后仅反负级保正级并六级封顶',()=>{
 for(const n of[-2,-6]){const s=turn(make(19367,{aStages:{spa:n,def:2,acc:6}}),19367);assert.equal(s.damageEvents.find(e=>e.type==='attack').attackValue,n===-2?600:300);assert.equal(s.fighters[0].stages.spa,-n);assert.equal(s.fighters[0].stages.def,2);assert.equal(s.fighters[0].stages.acc,6);}
});
test('3056狂绝859原生吸双防成功才附最大体力三分一3000百分比，不改变上限；保护失败仍独立授下两轮红伤翻倍',()=>{
 let s=make(19366,{enemyMoves:[24624]});s=turn(s,pp,24624);s=turn(s,19366);assert.equal(s.fighters[0].stages.def,2);assert.equal(s.fighters[1].stages.def,0);assert.equal(s.damageEvents.find(e=>e.round===2&&e.type==='percent'&&e.sourceSide===0).settledDamage,3000);assert.equal(s.fighters[1].stats.maxHp,9000);s=make(19366,{enemyId:3549,enemyMoves:[29392]});s=turn(s,pp,29392);assert.ok(Object.values(s.fighters[1].stages).some(n=>n>0));s=turn(s,19366);assert.ok(Object.values(s.fighters[1].stages).some(n=>n>0));assert.ok(!s.damageEvents.some(e=>e.round===2&&e.type==='percent'&&e.sourceSide===0));assert.ok(s.fighters[0].effects.doubleDamage);
});
test('3056第五901只实际清除回合成功后攻速各二，红伤先用原攻，空目标不强化且禁强化不挡清除与40%固定',()=>{
 for(const blocked of[false,true]){let s=make(19369,{enemyId:3036,enemyMoves:[24740],aEffects:blocked?{禁强化:{start:1,end:3}}:{}});s=turn(s,pp,24740);s=turn(s,19369);assert.equal(s.fighters[1].effects['免弱'],undefined);assert.equal(s.fighters[0].stages.atk,blocked?0:2);assert.equal(s.fighters[0].stages.spe,blocked?0:2);assert.equal(s.damageEvents.find(e=>e.round===2&&e.type==='attack'&&e.sourceSide===0).attackValue,1200);}const s=turn(make(19369),19369);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===0));
});
test('3056两项15%降防与多重三项30%弱化均原生抽样成功失败，多重三项独立且同种子星皇免弱',()=>{
 for(const id of[10380,10717,15968]){let yes=0,no=0,first,partial=false;const patterns=new Set();for(let seed=1;seed<=48;seed++){const s=turn(make(id,{seed,aStages:{acc:6}}),id),st=s.fighters[1].stages,affected=id===15968?['acc','def','spe']:['def'],n=affected.filter(k=>st[k]===-1).length;if(n){yes++;first??=seed;}else no++;patterns.add(affected.map(k=>st[k]).join(','));partial||=n>0&&n<affected.length;for(const k of keys)assert.ok(st[k]===0||affected.includes(k)&&st[k]===-1);}assert.ok(yes>0&&no>0);if(id===15968){assert.ok(partial);assert.ok(patterns.size>2);}const immune=turn(make(id,{seed:first,enemyId:3291,aStages:{acc:6}}),id);assert.ok(Object.values(immune.fighters[1].stages).every(n=>n===0));}
});
