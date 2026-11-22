'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3066-native.cjs');
const detail=s=>s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0)?.detail;
test('3066魂416对手已有真实初始烧伤才所有技能先制一及本体威力二倍，攻击和属性均按低速排序',()=>{
 for(const burned of[false,true])for(const id of[10001,20030]){const s=turn(make(id,{aStats:{spe:1},enemyMoves:[10086],bAilments:burned?{烧伤:3}:{}}),id,10086);assert.equal(s.turns[0].first,burned?0:1);assert.equal(s.fighters[0].soulState.resolvedPriority.value,burned?1:0);if(id===10001)assert.ok(detail(s).includes('威力 '+(burned?70:35)+' ·'));else assert.equal(s.fighters[0].stages.spe,1);}
});
test('3066飞燕本次命中后才烧伤不追溯翻本次85威力，下一次撞击立即70威力；原先制二加魂一为三',()=>{
 let found=false;for(let seed=1;seed<=48&&!found;seed++){let s=turn(make(16072,{seed,extraMoves:[10001],aStages:{acc:6}}),16072);if(s.fighters[1].ailments['烧伤']){found=true;assert.ok(detail(s).includes('威力 85 ·'));s=turn(s,10001);assert.ok(detail(s).includes('威力 70 ·'));}}assert.ok(found);const s=turn(make(16072,{bAilments:{烧伤:3},aStages:{acc:6}}),16072);assert.equal(s.fighters[0].soulState.resolvedPriority.value,3);assert.ok(detail(s).includes('威力 170 ·'));
});
test('3066火光40先手威力二倍可与魂416烧伤二倍乘为四，后手无40而只有已有烧伤魂倍',()=>{
 for(const burned of[false,true])for(const first of[false,true]){const enemyMove=burned?19294:10004,s=turn(make(11167,{enemyId:3036,aStats:{spe:first?2000:1},bStats:{spe:1000},bAilments:burned?{烧伤:3}:{},enemyMoves:[enemyMove]}),11167,enemyMove);assert.equal(s.turns[0].first,first?0:1);assert.ok(detail(s).includes('威力 '+70*(first?2:1)*(burned?2:1)+' ·'));}
});
