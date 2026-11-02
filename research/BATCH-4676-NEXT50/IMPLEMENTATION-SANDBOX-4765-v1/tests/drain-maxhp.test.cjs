'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const h=require('./helpers/3686-battle.cjs');
const entry=h.pick(2386)[0];
test('最大体力吸取独立回复：免疫减伤护罩与残血不缩减比例回复',()=>{
 for(const mode of ['normal','immune','resistance','barrier','low']){
  const s=h.make(entry,{hp:1000,targetHp:mode==='low'?100:9000});
  s.moveDefinitions[h.key(s.auditMoveId)].power=0; // Isolate ordinary attack; percent immunity remains independent.
  if(mode==='immune'){s.fighters[1].soulId=622;s.fighters[1].ailments['疲惫']=1;}
  if(mode==='resistance')s.fighters[1].build.resistance.percent=50;
  if(mode==='barrier')s.fighters[1].suitState.barrier=3000;
  const o=h.turn(s);assert.equal(o.fighters[0].hp,3250,mode);
  const loss=mode==='low'?100:mode==='immune'||mode==='barrier'?0:mode==='resistance'?1125:2250;
  assert.equal(o.fighters[1].hp,s.fighters[1].hp-loss,mode);
  if(mode==='barrier')assert.equal(o.fighters[1].suitState.barrier,750);
 }
});
test('最大体力吸取独立回复：禁疗上限回复增幅和封招控制仍有效',()=>{
 for(const mode of ['ban','full','cap','boost','block','control']){
  const s=h.make(entry,{hp:mode==='full'?9000:mode==='cap'?8999:1000});s.moveDefinitions[h.key(s.auditMoveId)].power=0; // Isolate ordinary attack; percent immunity remains independent.
  if(mode==='ban')h.timer(s,0,'技能禁疗');
  if(mode==='boost')s.fighters[0].ailments['星赎']=3;
  if(mode==='block')h.timer(s,0,'skillBlock');
  if(mode==='control')s.fighters[0].ailments['疲惫']=3;
  const o=h.turn(s);assert.equal(o.fighters[0].hp,{ban:1000,full:9000,cap:9000,boost:3925,block:1000,control:1000}[mode]);
  assert.equal(o.fighters[1].hp,['block','control'].includes(mode)?9000:6750);
  assert.equal(o.fighters[0].pp[h.key(s.auditMoveId)],s.fighters[0].pp[h.key(s.auditMoveId)]-(mode==='control'?0:1));
 }
});
test('最大体力吸取独立回复：持续用招窗口仍按四回合到期',()=>{
 let s=h.make(h.pick(971)[0],{hp:1000});
 h.timer(s,1,'当回合免伤');
 for(let r=1;r<=5;r++){s.fighters[0].hp=1000;s=h.turn(s,r===1?s.auditMoveId:900031);assert.equal(s.fighters[0].hp,r<=4?7000:1000);assert.equal(s.fighters[1].hp,9000);}
});
test('最大体力吸取独立回复：魂印低伤分支与300等值条件保持',()=>{
 const q=require('./helpers/3679-battle.cjs');
 for(const damage of [0,299,300]){const s=q.make(undefined,{soul:965,hp:1000});s.fighters[1].soulId=622;s.fighters[1].ailments['疲惫']=1;
  s.fighters[0].stats.atk=9999;s.fighters[0].stats.spa=9999;
  q.timer(s,1,'攻击伤害上限',{amount:damage});const o=q.turn(s,900030);
  assert.equal(o.fighters[0].lastAttackDamage,damage);assert.equal(o.fighters[0].hp,damage<300?4000:1000);
 }
});
test('最大体力吸取独立回复：回合末吸取免疫后照常回复',()=>{
 const q=require('./helpers/3724-battle.cjs'),s=q.make(q.pick(1839)[0],{hp:1000});s.fighters[1].soulId=622;s.fighters[1].ailments['疲惫']=1;
 const o=q.turn(s);assert.equal(o.fighters[0].hp,8500);assert.equal(o.fighters[1].hp,9000);
});
test('理论回复统一覆盖固定吸取，速度吸取和回复后等量追加保持原规则',()=>{
 const q=require('./helpers/3705-battle.cjs');
 const fixed=q.make(q.pick(894)[0],{hp:1000});fixed.fighters[1].soulId=622;fixed.fighters[1].ailments['疲惫']=1;assert.equal(q.turn(fixed).fighters[0].hp,1440);
 const speed=q.make(undefined,{soul:1781,hp:1000});speed.fighters[1].soulId=622;speed.fighters[1].ailments['疲惫']=1;assert.equal(q.turn(speed,900031).fighters[0].hp,1000);
 for(const hp of [1000,8999,9000]){const s=q.make(q.pick(532)[0],{hp}),o=q.turn(s);const amount=Math.min(4500,9000-hp);assert.equal(o.fighters[0].hp,hp+amount);assert.equal(o.fighters[1].hp,9000-amount);}
});
test('旧魂印吸收最大HP同义词使用比例回复，异常寄生仍按明确扣除量回复',()=>{
 const s=h.make(undefined,{hp:1000});s.fighters[0].soulId=367;
 s.fighters[1].soulId=622;s.fighters[1].ailments['疲惫']=1;
 const o=h.turn(s,900031);assert.equal(o.fighters[0].hp,3250);assert.equal(o.fighters[1].hp,9000);
 const p=h.make(undefined,{hp:1000});p.fighters[1].ailments['寄生']=3;p.fighters[1].soulId=622;p.fighters[1].ailments['疲惫']=1;
 const no=h.turn(p,900031);assert.equal(no.fighters[0].hp,1000);assert.equal(no.fighters[1].hp,9000);
});
test('最大体力吸取1327低伤回复独立，护盾既有基数与阈值保持',()=>{
 const source=require('../data/species/3568.json').snapshot;
 const move=source.moves.find(m=>m.effectInstances.some(e=>e.id===1327));
 const op=h.E.WIKI.compile(move,source).operations.find(o=>o.effectId===1327);
 for(const immune of [false,true]){
  const s=h.make(entry,{hp:1000});s.moveDefinitions[h.key(s.auditMoveId)].operations=[structuredClone(op)];s.moveDefinitions[h.key(s.auditMoveId)].power=0; // Isolate ordinary attack; percent immunity remains independent.
  if(immune){s.fighters[1].soulId=622;s.fighters[1].ailments['疲惫']=1;}
  const o=h.turn(s);assert.equal(o.fighters[0].hp,4000);assert.equal(o.fighters[1].hp,immune?9000:6000);
  assert.equal(o.fighters[0].suitState.shield,immune?0:3000);
 }
 const no=h.make(entry,{hp:1000});no.moveDefinitions[h.key(no.auditMoveId)].operations=[structuredClone(op)];no.fighters[0].stats.atk=9999;no.fighters[0].stats.spa=9999;h.timer(no,1,'攻击伤害上限',{amount:300});const n=h.turn(no);assert.equal(n.fighters[0].lastAttackDamage,300);assert.equal(n.fighters[0].hp,1000);assert.equal(n.fighters[0].suitState.shield,0);
});
