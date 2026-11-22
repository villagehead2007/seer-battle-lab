'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3142-native.cjs');
test('3142惊雷37严格低半翻威力，天明88原10%概率四倍红伤有无分支',()=>{
 for(const hp of[4499,4500,4501]){const s=H.turn(H.make(10168,{aHp:hp,aStages:{acc:6}}),10168);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('威力 '+(hp<4500?110:55)+' '));}
 const seen=new Set();for(let seed=1;seed<=48&&seen.size<2;seed++){const s=H.turn(H.make(10825,{seed}),10825),e=s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack'),n=Number(e.detail.match(/增减伤 ([\d.]+) ×/)[1]);assert.ok([1,4].includes(n));seen.add(n);}assert.equal(seen.size,2);
});
test('3142七个基础5%麻痹实例各自原生成败，雷祭命中后100%与免异分开结算',()=>{
 for(const id of[10172,10010,10173,10169,10175,10176,10824]){const seen=new Set();for(let seed=1;seed<=80&&seen.size<2;seed++){const s=H.turn(H.make(id,{seed,aStages:{acc:6}}),id);seen.add(!!s.fighters[1].ailments['麻痹']);}assert.equal(seen.size,2,String(id));}
 let s=H.turn(H.make(20085,{aStages:{acc:6}}),20085);assert.ok(s.fighters[1].ailments['麻痹']);s=H.turn(H.make(20085,{aStages:{acc:6},bEffects:{免异常:{start:1,end:3}}}),20085);assert.equal(s.fighters[1].ailments['麻痹'],undefined);
});
test('3142寰宇982强化种类提高麻痹概率的原生同种子单调，联盟603有35概率成败并固定持续两轮',()=>{
 let added=false;const seen=new Set();for(let seed=1;seed<=24;seed++){const a=H.turn(H.make(19733,{seed}),19733),b=H.turn(H.make(19733,{seed,aStages:{atk:1,def:1,spa:1,spd:1,spe:1,acc:1}}),19733),x=!!a.fighters[1].ailments['麻痹'],y=!!b.fighters[1].ailments['麻痹'];assert.ok(!x||y);if(!x&&y)added=true;const s=H.turn(H.make(30122,{seed}),30122),end=s.fighters[1].ailments['麻痹'];seen.add(!!end);if(end)assert.equal(end,2);}assert.ok(added);assert.equal(seen.size,2);
});
