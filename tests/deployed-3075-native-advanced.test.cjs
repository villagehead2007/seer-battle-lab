'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3075-native.cjs'),pp='potion:pp';
test('3075怨能29固定90独立于红伤与魂印吸取150，固定抗性100仅挡相应类别',()=>{
 for(const blocked of[false,true]){const s=turn(make(15915,{bGear:blocked?{resistance:{fixed:100}}:{}}),15915),fixed=s.damageEvents.filter(e=>e.type==='fixed'&&e.sourceSide===0);assert.equal(fixed[0].settledDamage,blocked?0:90);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));}
});
test('3075魅影797仅清回合成功后两轮技能禁疗，实际乔特鲁德回血受阻后恢复，空清不授禁疗',()=>{
 let s=make(19451,{enemyId:3036,enemyMoves:[24740,19293]});s=turn(s,pp,24740);s=turn(s,19451);assert.equal(s.fighters[1].effects['免弱'],undefined);assert.ok(s.fighters[1].effects['技能禁疗']);const hp=s.fighters[1].hp;s=turn(s,pp,19293);assert.equal(s.fighters[1].hp,hp-150);s=turn(s,pp,19293);assert.ok(s.fighters[1].hp>hp-300);s=turn(make(19451),19451);assert.equal(s.fighters[1].effects['技能禁疗'],undefined);
});
test('3075血色170先手免当前攻击且回2250，后手无该回复，843只下两轮全技能先制二第三恢复',()=>{
 for(const first of[false,true]){const s=turn(make(24824,{enemyMoves:[10086],aStats:{spe:first?1000:10}}),24824,10086),red=s.damageEvents.filter(e=>e.type==='attack'&&e.targetSide===0).reduce((n,e)=>n+e.hpLoss,0);assert.equal(s.fighters[0].hp,4500-red+(first?2250:0)+150);assert.equal(red===0,first);}
 let s=make(24824,{extraMoves:[21153],enemyMoves:[10086],aStats:{spe:10}});for(let r=1;r<=4;r++){s=turn(s,r===1?24824:21153,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,r===2||r===3?2:0);assert.equal(s.turns.at(-1).first,r===2||r===3?0:1);}
});
test('3075魅影426当前轮20闪避有初始种子成功失败，次轮真实攻击不再闪避',()=>{
 const seen=new Set();for(let seed=1;seed<=24;seed++){let s=turn(make(16182,{seed,enemyMoves:[10086]}),16182,10086),n=s.damageEvents.filter(e=>e.type==='attack'&&e.targetSide===0).reduce((n,e)=>n+e.settledDamage,0);seen.add(n===0);s=turn(s,pp,10086);assert.ok(s.damageEvents.some(e=>e.round===2&&e.type==='attack'&&e.targetSide===0&&e.settledDamage>0));}assert.equal(seen.size,2);
});
test('3075赤瞳456红伤后299秒杀300不秒，普通MISS不执行附效但回合末魂吸150独立',()=>{
 const base=turn(make(19453,{aStages:{acc:6}}),19453),damage=base.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).settledDamage;for(const n of[299,300]){const s=turn(make(19453,{aStages:{acc:6},bHp:damage+n}),19453);assert.equal(s.fighters[1].hp,n===299?0:150);}let found=false;for(let seed=1;seed<=48&&!found;seed++){const s=turn(make(19453,{seed,aStages:{acc:-6},bHp:299}),19453);if(!s.damageEvents?.some(e=>e.type==='attack'&&e.sourceSide===0)){found=true;assert.equal(s.fighters[1].hp,149);assert.equal(s.fighters[0].pp['wiki:19453'],4);}}assert.ok(found);
});
