'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3667-battle.cjs');
const {E,make,turn,timer,key,IDLE,HIT,WAIT}=H,entry={moveId:10250,index:null};
function soulGame(options={}){const s=make(entry,{soul:955,...options});timer(s,1,'免异常');timer(s,1,'攻击必中');return s;}
const cases=new Map();
function received(n){
 if(cases.has(n))return structuredClone(cases.get(n));
 for(let atk=2800;atk<3300;atk++){
  const s=soulGame({aStats:{spe:1},bStats:{atk}}),o=turn(s,IDLE,HIT);
  if(o.fighters[1].lastAttackDamage===n){cases.set(n,{s,o});return {s,o};}
 }
 assert.fail('真实伤害夹具未覆盖 '+n);
}

test('3667 原魂印955真实299、300、301伤害对应扣PP与增减伤边界',()=>{
 assert.equal(E.SOULS.registry[955].sourceHash,H.source.souls.find(x=>x.id===955).hash);
 for(const n of [299,300,301]){
  const {s,o}=received(n),loss=n<300?1:n>300?2:0;
  assert.equal(s.fighters[0].hp-o.fighters[0].hp,n);
  for(const id of s.fighters[1].moves)assert.equal(o.fighters[1].pp[id],s.fighters[1].pp[id]-loss-(id===key(HIT)?1:0));
  assert.equal(o.fighters[0].counts.nextAttackBoost??0,n<300?1:0);
  assert.equal(o.fighters[0].counts.nextAttackReductionUses??0,n>300?1:0);
 }
 const {s}=received(299);for(const id of s.fighters[1].moves)s.fighters[1].pp[id]=id===key(HIT)?1:0;
 assert.ok(Object.values(turn(s,IDLE,HIT).fighters[1].pp).every(n=>n===0));
});

test('3667 原魂印955下次增伤经公共伤害计算消费、属性保留且不叠层',()=>{
 let {o}=received(299);o=turn(o,IDLE,HIT);assert.equal(o.fighters[0].counts.nextAttackBoost,1);
 o=turn(o,IDLE,WAIT);assert.equal(o.fighters[0].counts.nextAttackBoost,1);
 o.rng=0;const plain=structuredClone(o);plain.fighters[0].counts.nextAttackBoost=0;
 const boosted=turn(o,10250),normal=turn(plain,10250);assert.ok(Math.abs(boosted.fighters[0].lastAttackDamage-2*normal.fighters[0].lastAttackDamage)<=1);assert.equal(boosted.fighters[0].counts.nextAttackBoost,0);
 boosted.rng=normal.rng=0;assert.equal(turn(boosted,10250).fighters[0].lastAttackDamage,turn(normal,10250).fighters[0].lastAttackDamage);
});

test('3667 原魂印955下次减伤真实减半、未受攻保留与一次消费',()=>{
 let {o}=received(301);o=turn(o,IDLE,WAIT);assert.equal(o.fighters[0].counts.nextAttackReductionUses,1);
 o.rng=0;const plain=structuredClone(o);plain.fighters[0].counts.nextAttackReductionUses=0;
 const reduced=turn(o,IDLE,HIT),normal=turn(plain,IDLE,HIT);assert.equal(reduced.fighters[1].lastAttackDamage,Math.floor(normal.fighters[1].lastAttackDamage/2));assert.equal(reduced.fighters[0].counts.nextAttackReductionUses,0);
});

test('3667 原魂印955零攻击伤害、粉伤、未命中及致死不产生受击奖励',()=>{
 for(const kind of ['immune','miss','fixed','dead']){
  const s=soulGame({aStats:{spe:1}});
  if(kind==='immune')timer(s,0,'当回合免伤');
  if(kind==='miss'){delete s.fighters[1].effects['攻击必中'];timer(s,1,'攻击必失');}
  if(kind==='fixed')timer(s,0,'持续固定伤害',{amount:150});
  if(kind==='dead')s.fighters[0].hp=1;
  const o=turn(s,IDLE,kind==='fixed'?WAIT:HIT);assert.equal(o.fighters[0].counts.nextAttackBoost??0,0);assert.equal(o.fighters[0].counts.nextAttackReductionUses??0,0);
  for(const id of s.fighters[1].moves)assert.equal(o.fighters[1].pp[id],s.fighters[1].pp[id]-(id===key(kind==='fixed'?WAIT:HIT)?1:0));
  if(kind==='fixed')assert.equal(o.fighters[0].hp,8850);if(kind==='dead')assert.equal(o.fighters[0].hp,0);
 }
});

test('3667 原魂印955按回合开始累加睡眠概率、公共睡眠控制与免疫',()=>{
 let s=soulGame();for(let r=1;r<=4;r++){s=turn(s,IDLE);assert.equal(s.fighters[0].soulState.serpentSleepChance,r===1?40:50);assert.equal(s.fighters[1].ailments['睡眠'],undefined);}
 let success,failure;for(let seed=0;seed<64&&(!success||!failure);seed++){
  const a=make(entry,{soul:955,seed}),o=turn(a,IDLE,HIT);
  if(o.fighters[1].ailments['睡眠']>=2)success={a,o};
  else if(!o.turns[0].events.some(e=>e.text.includes('陷入睡眠')))failure={a,o};
 }
 assert.ok(success&&failure);assert.equal(success.o.fighters[1].pp[key(HIT)],99);assert.equal(success.o.fighters[0].hp,9000);assert.ok(failure.o.fighters[0].hp<9000);
 const im=structuredClone(success.a);im.fighters[1].counts.immune=1;const no=turn(im,IDLE,HIT);assert.equal(no.fighters[1].ailments['睡眠'],undefined);assert.equal(no.fighters[1].counts.immune,0);assert.ok(no.fighters[0].hp<9000);
 const controlled=structuredClone(success.a);controlled.fighters[0].ailments['疲惫']=9;const c=turn(controlled,IDLE);assert.equal(c.fighters[0].pp[key(IDLE)],99);assert.equal(c.fighters[1].ailments['睡眠'],undefined);
});
