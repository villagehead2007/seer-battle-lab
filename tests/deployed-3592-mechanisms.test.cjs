'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3592-battle.cjs');const {source,key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,allStages,pick,seedCase}=H;
const hp=s=>s.fighters.map(f=>f.hp),dmg=s=>s.fighters[0].lastAttackDamage,damage=dmg;
test('3592 清弱3保留正等级、无弱化与封招',()=>{
  const e=pick(3)[0],s=make(e);s.fighters[0].stages.atk=-6;s.fighters[0].stages.def=2;const o=turn(s);assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[0].stages.def,2);assert.equal(turn(make(e)).fighters[0].stages.atk,0);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].stages.atk,-6);
});

test('3592 回复532与1065四回合实际回血等量粉伤、半血和禁疗',()=>{
  for(const id of [532,1065]){const e=pick(id)[0];let s=make(e,{hp:1000});for(let r=1;r<=5;r++){s.fighters[0].hp=1000;s.fighters[1].hp=9000;s=turn(s,r===1?e.moveId:IDLE);const n=r<=4?(id===1065?6000:3000):0;assert.deepEqual(hp(s),[1000+n,9000-n]);}
    assert.deepEqual(hp(turn(make(e,{hp:4500}))),[7500,6000]);assert.deepEqual(hp(turn(make(e,{hp:8900}))),[9000,8900]);const ban=make(e,{hp:1000});timer(ban,0,'技能禁疗');assert.deepEqual(hp(turn(ban)),[1000,9000]);assert.deepEqual(hp(turn(make(e))),[9000,9000]);
  }
});

test('3592 已损体力514包含当次攻击、取整、残血和免伤',()=>{
 const e=pick(514)[0];for(const targetHp of [9000,8000]){const o=turn(make(e,{targetHp}));assert.equal(targetHp-o.fighters[1].hp-damage(o),Math.floor((9000-targetHp+damage(o))*.35));}
 const low=turn(make(e,{targetHp:10}));assert.equal(low.fighters[1].hp,0);const s=make(e);timer(s,1,'当回合免伤');assert.equal(turn(s).fighters[1].hp,9000);const miss=make(e,{hit:false});timer(miss,0,'攻击必失');assert.equal(turn(miss).fighters[1].hp,9000);
});

test('3592 反弹191四回合免疫反弹、双方免疫及到期',()=>{
 const e=pick(191)[0];let s=turn(make(e));s.rng=8;let o=turn(s,IDLE,FEAR);assert.equal(o.fighters[0].ailments['麻痹'],undefined);assert.ok(o.fighters[1].ailments['麻痹']);
 const both=turn(make(e));timer(both,1,'免异常');both.rng=8;assert.deepEqual(turn(both,IDLE,FEAR).fighters.map(f=>f.ailments),[{},{}]);s=wait(wait(wait(s)));assert.equal(s.round,5);s.rng=8;o=turn(s,IDLE,FEAR);assert.ok(o.fighters[0].ailments['麻痹']);
});
function receiver(e,n,extra={}){const s=make(e,{bStats:{atk:9000},...extra});timer(s,0,'攻击伤害上限',{amount:n});return s;}

test('3592 强化1014严格半血、禁强化和六级上限',()=>{
 const e=pick(1014)[0];for(const n of [4499,4500,4501])assert.deepEqual(Object.values(turn(make(e,{hp:n})).fighters[0].stages),Array(6).fill(n>4500?2:1));const s=make(e);H.allStages(s,0,6);assert.deepEqual(Object.values(turn(s).fighters[0].stages),Array(6).fill(6));timer(s,0,'禁强化');H.allStages(s,0,0);assert.deepEqual(Object.values(turn(s).fighters[0].stages),Array(6).fill(0));
});


test('3592 回复1065半血边界实际等量粉伤、禁疗、满血与到期',()=>{
 const e=pick(1065)[0];for(const n of [1000,4499,4500,4501,8999,9000]){const o=turn(make(e,{hp:n})),gain=Math.min(9000-n,n<4500?6000:3000);assert.deepEqual(hp(o),[n+gain,9000-gain]);}
 const s=make(e,{hp:1000});timer(s,0,'技能禁疗');assert.deepEqual(hp(turn(s)),[1000,9000]);const im=make(e,{hp:1000});timer(im,1,'当回合免伤');assert.deepEqual(hp(turn(im)),[7000,9000]);let o=turn(make(e));for(let r=2;r<=5;r++){o.fighters[0].hp=8999;const before=o.fighters[1].hp;o=wait(o);assert.equal(o.fighters[0].hp,r<=4?9000:8999);assert.equal(before-o.fighters[1].hp,r<=4?1:0);}
});
