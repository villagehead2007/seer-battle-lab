'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3578-battle.cjs');
const {source,keys,key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,allStages,pick,seedCase}=H;
const hp=s=>s.fighters.map(f=>f.hp),base={moveId:10250,index:null};

test('3578 消强736成功封属两回合、无强化失败与负等级保留',()=>{
  const e=pick(736)[0],s=make(e,{opponentBoost:true});s.fighters[1].stages.atk=2;s.fighters[1].stages.spa=-1;let o=turn(s,e.moveId,900023);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].stages.spa,-1);assert.equal(o.fighters[1].stages.def,0);assert.equal(o.fighters[1].pp[key(900023)],9);
  o=turn(o,IDLE,900023);assert.equal(o.fighters[1].stages.def,0);o=turn(o,IDLE,900023);assert.equal(o.fighters[1].stages.def,2);
  const empty=turn(make(e,{opponentBoost:true}),e.moveId,900023);assert.equal(empty.fighters[1].stages.def,2);assert.equal(empty.fighters[1].effects.statusBlock,undefined);
});
test('3578 反弱1194成功反转后免弱四回合、无弱化和禁强不登记',()=>{
  const e=pick(1194)[0],s=make(e,{opponentEffect:pick(5).find(e=>e.params[0]===5)});s.fighters[0].stages.acc=-2;s.fighters[0].stages.def=-6;let o=turn(s,e.moveId,900023);assert.equal(o.fighters[0].stages.acc,2);assert.equal(o.fighters[0].stages.def,6);assert.equal(o.fighters[0].effects['免弱'].end,4);
  for(let r=2;r<=5;r++){o=turn(o,IDLE,900023);assert.equal(o.fighters[0].stages.acc,r<=4?2:1);}assert.equal(turn(make(e)).fighters[0].effects['免弱'],undefined);
  const ban=make(e);ban.fighters[0].stages.atk=-2;timer(ban,0,'禁强化');const b=turn(ban);assert.equal(b.fighters[0].stages.atk,-2);assert.equal(b.fighters[0].effects['免弱'],undefined);
});
test('3578 免异常48两个实例分别四或五回合、到期及次数免疫互不混淆',()=>{
  for(const e of pick(48)){let s=make(e);s.fighters[0].counts.immune=1;for(let r=1;r<=e.params[0];r++){s.rng=0;s=turn(s,r===1?e.moveId:IDLE,FEAR);assert.deepEqual(s.fighters[0].ailments,{});assert.equal(s.fighters[0].counts.immune,1);}s.rng=0;s=turn(s,IDLE,FEAR);assert.equal(s.fighters[0].counts.immune,0);assert.deepEqual(s.fighters[0].ailments,{});s.rng=8;s=turn(s,IDLE,FEAR);assert.ok(s.fighters[0].ailments['麻痹']);}
});
test('3578 概率88真实百分之十五翻倍、阈值两侧与失误',()=>{
  const e=pick(88)[0];let yes=0,no=0;for(let seed=0;seed<80;seed++){const s=make(e,{seed}),o=turn(s),c=make(e,{seed:(seed+0x6D2B79F5)>>>0,omit:true}),b=turn(c);if(o.fighters[0].lastAttackDamage>b.fighters[0].lastAttackDamage){yes++;assert.ok(Math.abs(o.fighters[0].lastAttackDamage-2*b.fighters[0].lastAttackDamage)<=1);}else{no++;assert.equal(o.fighters[0].lastAttackDamage,b.fighters[0].lastAttackDamage);}}assert.ok(yes>0&&no>0);
  const miss=make(e,{hit:false});timer(miss,0,'攻击必失');assert.equal(turn(miss).fighters[1].hp,9000);
});
test('3578 反射692仅暴击伤害反射、两回合到期与非暴击照常受伤',()=>{
  const e=pick(692)[0],s=make(e),c=make(e,{omit:true});timer(s,1,'必定暴击');timer(c,1,'必定暴击');const o=turn(s,e.moveId,HIT),b=turn(c,e.moveId,HIT),reflected=b.fighters[1].lastAttackDamage;assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[1].hp,b.fighters[1].hp-reflected);
  const normal=turn(make(e),e.moveId,HIT);assert.equal(normal.fighters[0].hp,9000-normal.fighters[1].lastAttackDamage);assert.ok(normal.fighters[0].hp<9000);
  const second=turn(o,IDLE,HIT);assert.equal(second.fighters[0].hp,9000);assert.ok(turn(second,IDLE,HIT).fighters[0].hp<9000);
});
test('3578 受攻1195四回合疲惫或免疫后固定300、属性和失误不触发',()=>{
  const e=pick(1195)[0],s=make(e,{seed:1}),o=turn(s,e.moveId,HIT);assert.ok(o.fighters[1].ailments['疲惫']);assert.equal(o.fighters[1].hp,9000);
  let immune=make(e);timer(immune,1,'免异常');for(let r=1;r<=5;r++){const before=immune.fighters[1].hp;immune=turn(immune,r===1?e.moveId:IDLE,HIT);assert.equal(immune.fighters[1].hp,before-(r<=4?300:0));}
  assert.deepEqual(hp(turn(make(e))),[9000,9000]);const miss=make(e,{opponentEffect:pick(88)[0]});timer(miss,1,'攻击必失');assert.deepEqual(hp(turn(miss,e.moveId,900023)),[9000,9000]);
  const protectedTarget=make(e);timer(protectedTarget,1,'免异常');timer(protectedTarget,1,'当回合免伤');assert.equal(turn(protectedTarget,e.moveId,HIT).fighters[1].hp,9000);
});
test('3578 翻倍776仅下两回合攻击伤害翻倍、封招失败与到期',()=>{
  const e=pick(776)[0];let s=turn(make(e));for(let r=2;r<=3;r++){const c=structuredClone(s);delete c.fighters[0].effects.doubleDamage;const b=turn(c,10250);s=turn(s,10250);assert.ok(Math.abs(s.fighters[0].lastAttackDamage-2*b.fighters[0].lastAttackDamage)<=1);}assert.equal(s.fighters[0].effects.doubleDamage,undefined);
  const blocked=make(e);timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[0].effects.doubleDamage,undefined);
});
test('3578 固伤683随机150至300包含两端、免伤与失误',()=>{
  const e=pick(683)[0],ends=new Set();for(let seed=0;seed<2000&&ends.size<2;seed++){const o=turn(make(e,{seed})),n=9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage;assert.ok(n>=150&&n<=300);if(n===150||n===300)ends.add(n);}assert.deepEqual([...ends].sort((a,b)=>a-b),[150,300]);
  const immune=make(e);timer(immune,1,'当回合免伤');assert.equal(turn(immune).fighters[1].hp,9000);const miss=make(e,{hit:false});timer(miss,0,'攻击必失');assert.equal(turn(miss).fighters[1].hp,9000);
});
test('3578 强化946体力比较严格低于才翻倍、等级上限和禁强',()=>{
  const e=pick(946)[0];for(const n of [4999,5000,5001]){const o=turn(make(e,{hp:n,targetHp:5000}));assert.deepEqual(Object.values(o.fighters[0].stages),Array(6).fill(n<5000?2:1));}
  const cap=make(e,{hp:1000});allStages(cap,0,6);assert.deepEqual(Object.values(turn(cap).fighters[0].stages),Array(6).fill(6));const ban=make(e);timer(ban,0,'禁强化');assert.deepEqual(Object.values(turn(ban).fighters[0].stages),Array(6).fill(0));
});
test('3578 吸取597四次用招实际损血回复、残血禁疗与免伤',()=>{
  const e=pick(597)[0];let s=make(e,{hp:1000});for(let r=1;r<=5;r++){s.fighters[0].hp=1000;s.fighters[1].hp=9000;s=turn(s,r===1?e.moveId:IDLE);assert.deepEqual(hp(s),r<=4?[4000,6000]:[1000,9000]);}
  assert.deepEqual(hp(turn(make(e,{hp:1000,targetHp:100}))),[1100,0]);const ban=make(e,{hp:1000});timer(ban,0,'技能禁疗');assert.deepEqual(hp(turn(ban)),[1000,6000]);const immune=make(e,{hp:1000});timer(immune,1,'当回合免伤');assert.deepEqual(hp(turn(immune)),[1000,9000]);
  const stop=turn(make(e,{hp:1000}));stop.fighters[0].ailments['疲惫']=2;assert.deepEqual(hp(wait(stop)),hp(stop));
});
test('3578 先制843下两回合包含属性和攻击、到期及更高先制',()=>{
  const e=pick(843)[0];let s=turn(make(e,{aStats:{spe:1},bStats:{spe:999}}));assert.equal(s.turns[0].first,1);s=wait(s);assert.equal(s.turns[1].first,0);s=turn(s,10250);assert.equal(s.turns[2].first,0);assert.equal(wait(s).turns[3].first,1);
  const other=turn(make(e,{aStats:{spe:1},bStats:{spe:999}}));timer(other,1,'id984',{amount:3});assert.equal(wait(other).turns[1].first,1);
});
test('3578 先手792只封当前攻击、后手失败且属性照常执行',()=>{
  const e=pick(792)[0],o=turn(make(e),e.moveId,HIT);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[1].pp[key(HIT)],98);assert.ok(turn(o,IDLE,HIT).fighters[0].hp<9000);
  const slow=turn(make(e,{aStats:{spe:1},bStats:{spe:999}}),e.moveId,HIT);assert.ok(slow.fighters[0].hp<9000);const status=turn(make(e,{opponentBoost:true}),e.moveId,900023);assert.equal(status.fighters[1].stages.def,2);
});
test('3578 免异常1258严格高于300才授予一次免疫并实际消费',()=>{
  const e=pick(1258)[0];for(const n of [299,300,301]){const s=make(e,{aStats:{atk:2000}});timer(s,1,'攻击伤害上限',{amount:n},1);const o=turn(s);assert.equal(o.fighters[0].lastAttackDamage,n);assert.equal(o.fighters[0].counts.immune??0,n>300?1:0);const b=turn(o,IDLE,FEAR);assert.equal(b.fighters[0].counts.immune??0,0);if(n>300)assert.deepEqual(b.fighters[0].ailments,{});}
});
test('3578 消回合1032成功仅封下一回合攻击、失败及免断',()=>{
  const e=pick(1032)[0],s=make(e);timer(s,1,'doubleDamage');let o=turn(s,e.moveId,HIT);assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.ok(o.fighters[0].hp<9000);const before=o.fighters[0].hp;o=turn(o,IDLE,HIT);assert.equal(o.fighters[0].hp,before);assert.ok(turn(o,IDLE,HIT).fighters[0].hp<before);
  assert.equal(turn(make(e)).fighters[1].effects.attackBlock,undefined);const protect=make(e);timer(protect,1,'protect');assert.equal(turn(protect).fighters[1].effects.attackBlock,undefined);
});
test('3578 未击败933下一次攻击真实必暴、属性不消费且击败不授予',()=>{
  const e=pick(933)[0];let s=turn(make(e));assert.equal(s.fighters[0].counts.nextCrit,1);s=wait(s);assert.equal(s.fighters[0].counts.nextCrit,1);const c=structuredClone(s);c.fighters[0].counts.nextCrit=0;const o=turn(s,10250),b=turn(c,10250);assert.ok(Math.abs(o.fighters[0].lastAttackDamage-2*b.fighters[0].lastAttackDamage)<=1);assert.equal(o.fighters[0].counts.nextCrit,0);assert.equal(turn(make(e,{targetHp:1})).fighters[0].counts.nextCrit??0,0);
});
test('3578 第五原招未击败获得必暴并封攻，击败后的826不伪造当前目标异常',()=>{
  const e={moveId:31853,index:null},s=make(e);timer(s,1,'doubleDamage');const o=turn(s);assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.equal(o.fighters[1].effects.attackBlock.start,2);assert.equal(o.fighters[0].counts.nextCrit,1);
  const dead=turn(make(e,{targetHp:1}));assert.equal(dead.finished,true);assert.equal(dead.fighters[1].hp,0);assert.deepEqual(dead.fighters[1].ailments,{});assert.equal(dead.fighters.length,2);assert.equal(dead.fighters[0].counts.nextCrit??0,0);
});
test('3578 魂印882回合初严格高于半血攻击速度加一、等级上限禁强',()=>{
  for(const n of [4499,4500,4501]){const o=wait(make(base,{soul:true,hp:n}));assert.equal(o.fighters[0].stages.atk,n>4500?1:0);assert.equal(o.fighters[0].stages.spe,n>4500?1:0);assert.equal(o.fighters[0].stages.def,0);}
  const cap=make(base,{soul:true});allStages(cap,0,6);assert.deepEqual(Object.values(wait(cap).fighters[0].stages),Array(6).fill(6));const ban=make(base,{soul:true});timer(ban,0,'禁强化');assert.deepEqual(Object.values(wait(ban).fighters[0].stages),Array(6).fill(0));
});
test('3578 魂印882受实际攻击授予下一次双倍、重复受击不累积且属性保留',()=>{
  let s=turn(make(base,{soul:true}),IDLE,HIT);assert.equal(s.fighters[0].counts.nextAttackBoost,1);s=turn(s,IDLE,HIT);assert.equal(s.fighters[0].counts.nextAttackBoost,1);const c=structuredClone(s);c.fighters[0].counts.nextAttackBoost=0;const o=turn(s),b=turn(c);assert.ok(Math.abs(o.fighters[0].lastAttackDamage-2*b.fighters[0].lastAttackDamage)<=1);assert.equal(o.fighters[0].counts.nextAttackBoost,0);
  const stop=structuredClone(s);stop.fighters[0].ailments['疲惫']=3;assert.equal(turn(stop).fighters[0].counts.nextAttackBoost,1);
  const immune=make(base,{soul:true});timer(immune,0,'鬼王攻击免疫');assert.equal(turn(immune,IDLE,HIT).fighters[0].counts.nextAttackBoost??0,0);
});
test('3578 魂印882固定百分比伤害不授予攻击增伤且死亡不获益',()=>{
  const fixed=make(base,{soul:true,opponentEffect:pick(683)[0]});timer(fixed,0,'鬼王攻击免疫');const a=turn(fixed,IDLE,900023);assert.ok(a.fighters[0].hp<9000);assert.equal(a.fighters[0].counts.nextAttackBoost??0,0);
  const percent=turn(make(base,{soul:true,opponentEffect:pick(597)[0]}),IDLE,900023);assert.equal(percent.fighters[0].counts.nextAttackBoost??0,0);
  const dead=turn(make(base,{soul:true,hp:1}),IDLE,HIT);assert.equal(dead.fighters[0].hp,0);assert.equal(dead.finished,true);assert.equal(dead.fighters[0].counts.nextAttackBoost??0,0);
});
test('3578 魂印882阶段末低半血吸取并获下回合全技能先制、半血等值不触发',()=>{
  for(const n of [4499,4500,4501]){const o=wait(make(base,{soul:true,hp:n}));assert.deepEqual(hp(o),n<4500?[7499,6000]:[n,9000]);assert.equal(!!o.fighters[0].effects.id984,n<4500);}
  let s=wait(make(base,{soul:true,hp:1000,aStats:{spe:1},bStats:{spe:999}}));assert.equal(s.turns[0].first,1);s=wait(s);assert.equal(s.turns[1].first,0); // Remains below half at round 2 start, heals above it at round end.
  s=wait(s);assert.equal(s.turns[2].first,0);assert.equal(wait(s).turns[3].first,1);
  const low=wait(make(base,{soul:true,hp:1000,targetHp:100}));assert.deepEqual(hp(low),[1100,0]);const immune=make(base,{soul:true,hp:1000});timer(immune,1,'当回合免伤');assert.deepEqual(hp(wait(immune)),[1000,9000]);
});
test('3578 原招交叉格挡自身强化吸取先制与魂印阶段结算有序',()=>{
  const s=make({moveId:26035,index:null},{soul:true,hp:1000,aStats:{spe:1},bStats:{spe:999}}),o=turn(s);assert.deepEqual(Object.values(o.fighters[0].stages),Array(6).fill(2));assert.deepEqual(hp(o),[7000,3000]);assert.equal(o.fighters[0].effects.id984.start,2);assert.equal(o.turns[0].first,1);
  o.fighters[1].hp=9000;const b=turn(o,10250);assert.equal(b.turns[1].first,0);assert.equal(b.fighters[0].stages.atk,3);assert.equal(b.fighters[0].hp,9000);
});
test('3578 来源完整保留魂印版本、17招、参数枚举及伙伴分类事实',()=>{
  const pet=require('../research/seerapi-cache/3578/pet-3578.json'),soul=require('../research/seerapi-cache/3578/soulmark-882.json');assert.equal(pet.hash,source.source.revision);assert.deepEqual(source.moves.map(m=>m.id),pet.skill.map(x=>x.skill.id));assert.equal(soul.hash,source.souls[0].hash);assert.equal(soul.intensified_to,null);assert.equal(pet.advance,null);assert.equal(soul.advance,null);
  const R=H.E.WIKI.effectsEngine;assert.throws(()=>R.registry[1195].validate([4,100,8,300]));assert.doesNotThrow(()=>R.registry[1195].validate([4,100,7,300]));assert.doesNotThrow(()=>R.registry[1195].validate([4,100,19,300]));
});
