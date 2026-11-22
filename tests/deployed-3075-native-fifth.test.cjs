'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3075-native.cjs');
test('3075第五737睡眠50初始种子有成败，未睡眠回合末2250按人答百分比，下一轮不再重复',()=>{
 const seen=new Set();for(let seed=1;seed<=24;seed++){let s=turn(make(19454,{seed,aHp:1}),19454),sleep=!!s.fighters[1].ailments['睡眠'];seen.add(sleep);const pink=(s.damageEvents??[]).filter(e=>e.type==='percent'&&e.sourceSide===0);assert.equal(pink.length,sleep?0:1);if(!sleep)assert.equal(pink[0].settledDamage,2250);s=turn(s,'potion:pp');assert.equal((s.damageEvents??[]).filter(e=>e.round===2&&e.type==='percent'&&e.sourceSide===0).length,0);}assert.equal(seen.size,2);
});
test('3075第五737未睡眠扣血受百分比抗性与免伤阻挡，原生冥王保1仍记完整2250百分比',()=>{
 let seed;for(let n=1;n<=24;n++){const s=turn(make(19454,{seed:n,aHp:1}),19454);if(!s.fighters[1].ailments['睡眠']){seed=n;break;}}assert.ok(seed);
 for(const mode of['resistance','immunity']){const s=turn(make(19454,{seed,aHp:1,bGear:mode==='resistance'?{resistance:{percent:100}}:{},bEffects:mode==='immunity'?{当回合免伤:{start:1,end:2}}:{}}),19454);assert.equal(s.fighters[1].ailments['睡眠'],undefined);assert.ok(!(s.damageEvents??[]).some(e=>e.type==='percent'&&e.sourceSide===0&&e.settledDamage>0));const red=(s.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0).reduce((n,e)=>n+e.hpLoss,0);assert.equal(s.fighters[1].hp,9000-red-(mode==='immunity'?0:150));}
 let found=false;for(let n=1;n<=24&&!found;n++){const s=turn(make(19454,{seed:n,aHp:1,enemyId:3141,bHp:1}),19454),pink=(s.damageEvents??[]).find(e=>e.type==='percent'&&e.sourceSide===0);if(pink){found=true;assert.equal(pink.settledDamage,2250);assert.equal(pink.hpLoss,0);assert.equal(s.fighters[1].hp,1);}}assert.ok(found);
});
test('3075第五903比较红伤结算后当前体力，严格较高附自身最大体力30%百分比，等低不附且百分比抗性独立',()=>{
 const base=turn(make(19454,{aHp:4500,bHp:8000}),19454),red=base.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).settledDamage;
 for(const delta of[-1,0,1]){const s=turn(make(19454,{aHp:4500,bHp:4500+red+delta}),19454);assert.equal((s.damageEvents??[]).filter(e=>e.type==='percent'&&e.sourceSide===0&&e.settledDamage===2700).length,delta<0?1:0);}
 const s=turn(make(19454,{aHp:8999,bHp:8000,bGear:{resistance:{percent:100}}}),19454);assert.ok(!s.damageEvents.some(e=>e.type==='percent'&&e.sourceSide===0&&e.settledDamage>0));assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.settledDamage>0));
});
