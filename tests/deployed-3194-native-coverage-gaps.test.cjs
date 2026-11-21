'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3194-native.cjs'),pp='potion:pp';
test('3194不幸11原三成中毒和死亡603各八成流血疲惫独立原生成败，603持续两轮，免异常阻状态',()=>{
 const poison=new Set(),blood=new Set(),tired=new Set();for(let i=1;i<=32;i++){let s=H.turn(H.make(15877,{seed:'3194-poison-'+i,aStages:{acc:6}}),15877);poison.add(!!s.fighters[1].ailments['中毒']);s=H.turn(H.make(23785,{seed:'3194-603-'+i}),23785);const b=s.fighters[1].ailments['流血'],t=s.fighters[1].ailments['疲惫'];blood.add(!!b);tired.add(!!t);if(b)assert.equal(b,2);if(t)assert.equal(t,2);}for(const seen of[poison,blood,tired])assert.equal(seen.size,2);for(const id of[15877,23785]){const s=H.turn(H.make(id,{aStages:{acc:6},bEffects:{免异常:{start:1,end:3}}}),id);for(const name of['中毒','流血','疲惫'])assert.equal(s.fighters[1].ailments[name],undefined);}
});
test('3194两招786真实全快照按原一或二种无放回抽取，独立两或三回合、免异不补抽且目标无异常',()=>{
 const durations=new Set();for(const[id,count]of[[19938,2],[30128,1]])for(let i=1;i<=24;i++){
  const options={seed:'3194-random-'+i,aStages:{acc:6}};let s=H.turn(H.make(id,options),id),rows=s.randomStatusEvents.filter(x=>x.effectId===786);
  assert.equal(rows.length,count);assert.equal(new Set(rows.map(x=>x.name)).size,count);const draws=rows.map(x=>[x.name,x.duration]);for(const row of rows){assert.notEqual(row.name,'山神守护');assert.ok([2,3].includes(row.duration));durations.add(row.duration);}
  s=H.turn(H.make(id,{...options,bEffects:{免异常:{start:1,end:4}}}),id);rows=s.randomStatusEvents.filter(x=>x.effectId===786);assert.equal(rows.length,count);assert.deepEqual(rows.map(x=>[x.name,x.duration]),draws);assert.deepEqual(s.fighters[1].ailments,{});
 }assert.deepEqual([...durations].sort(),[2,3]);
});
test('3194无尽125原260红伤上限当前两轮，真实大攻击第3轮不再限，独立693不改变受伤边界',()=>{
 let s=H.make(23769,{enemyMoves:[10086],aStats:{def:100},bStats:{atk:9999}});for(let r=1;r<=3;r++){s=H.turn(s,r===1?23769:pp,10086);const d=s.damageEvents.find(e=>e.round===r&&e.sourceSide===1&&e.type==='attack').settledDamage;assert.ok(r<=2?d===260:d>260);}
});
