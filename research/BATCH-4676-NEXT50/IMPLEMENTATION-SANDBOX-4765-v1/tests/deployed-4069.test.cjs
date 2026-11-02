'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {make,turn,key,timer}=require('./helpers/4069-battle.cjs');
test('4069两魂印攻击结束失明并追加百分比，强化理论回血与禁疗倍率免疫交互',()=>{
 for(const soul of [1315,1562])for(const immune of [false,true]){
  const s=make(undefined,{soul,hp:1000});if(immune)timer(s,1,'固定百分比免疫');
  const o=turn(s),ds=o.damageEvents.filter(e=>e.type==='percent');
  assert.ok(o.fighters[1].ailments['失明']);assert.equal(o.fighters[0].hp,soul===1562?4000:1000);
  assert.equal(ds.some(e=>e.settledDamage===3000),!immune);
  assert.equal(o.damageEvents.some(e=>e.type==='fixed'),false);
 }
 for(const fraction of [0,.5,1]){const s=make(undefined,{soul:1562,hp:1000});timer(s,0,'回复效果削减',{fraction});
  const o=turn(s);assert.equal(o.fighters[0].hp,1000+3000*(1-fraction));
 }
});
test('4069已使用攻击MISS和封攻仍触发，属性技能及控制未使用不触发',()=>{
 for(const soul of [1315,1562])for(const mode of ['miss','invalid','status','control']){
  const s=make(undefined,{soul,hp:1000,hit:mode!=='miss'});
  if(mode==='miss'){s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;}
  if(mode==='invalid')s.fighters[0].counts.nextAttackInvalid=1;
  if(mode==='control')s.fighters[0].ailments['疲惫']=3;
  const o=turn(s,mode==='status'?900031:undefined),triggers=['miss','invalid'].includes(mode);
  assert.equal(!!o.fighters[1].ailments['失明'],triggers);
  assert.equal((o.damageEvents??[]).some(e=>e.type==='percent'&&e.settledDamage===3000),triggers);
  assert.equal(o.fighters[0].hp,soul===1562&&triggers?4000:1000);
 }
});
test('4069击败和死亡不虚造后继目标，攻击结束早于对手行动，失明免疫不阻附伤',()=>{
 for(const soul of [1315,1562]){
  let s=make(undefined,{soul,targetHp:1,hp:1000}),o=turn(s);
  assert.equal(o.fighters[1].hp,0);assert.equal(o.fighters[0].hp,1000);assert.equal(o.damageEvents.some(e=>e.type==='percent'),false);
  s=make(undefined,{soul,hp:1000});timer(s,1,'免异常');o=turn(s);
  assert.equal(o.fighters[1].ailments['失明'],undefined);assert.ok(o.damageEvents.some(e=>e.type==='percent'&&e.settledDamage===3000));
  const events=o.turns.at(-1).events.map(e=>e.text);assert.ok(events.findIndex(t=>t.includes('幽冥之荷'))<events.findIndex(t=>t.includes('B 方 使用')));
  s=make(undefined,{soul,hp:1,aStats:{spe:1},bStats:{spe:1000}});o=turn(s,undefined,900040);
  assert.equal(o.fighters[0].hp,0);assert.equal(o.damageEvents.some(e=>e.type==='percent'),false);
 }
});
test('4069强化溢出伤害仍理论回复且满HP封顶，原版附伤不回复，多段整次攻击只追加一次',()=>{
 for(const soul of [1315,1562])for(const hp of [1000,8900]){
  const s=make(undefined,{soul,hp,targetHp:100}),o=turn(s);
  assert.equal(o.fighters[1].hp,0);assert.equal(o.fighters[0].hp,soul===1562?Math.min(9000,hp+3000):hp);
  const e=o.damageEvents.find(e=>e.type==='percent');assert.equal(e.settledDamage,3000);assert.ok(e.hpLoss<3000);
 }
 // The real two-to-three-hit move is selected by its source effect, preserving its ID.
 const {source,pick}=require('./helpers/4069-battle.cjs'),entry=pick(31)[0];assert.ok(source.moves.some(m=>m.id===entry.moveId));
 const o=turn(make(entry,{soul:1315}));assert.ok(o.damageEvents.filter(e=>e.type==='attack').length>=2);
 assert.equal(o.damageEvents.filter(e=>e.type==='percent').length,1);
});
