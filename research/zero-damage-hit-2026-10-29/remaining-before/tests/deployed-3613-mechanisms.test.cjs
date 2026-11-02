'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3613-battle.cjs');const {source,key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,allStages,pick,seedCase}=H;
const hp=s=>s.fighters.map(f=>f.hp),dmg=s=>s.fighters[0].lastAttackDamage,damage=dmg;
test('3613 清弱3保留正等级、无弱化与封招',()=>{
  const e=pick(3)[0],s=make(e);s.fighters[0].stages.atk=-6;s.fighters[0].stages.def=2;const o=turn(s);assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[0].stages.def,2);assert.equal(turn(make(e)).fighters[0].stages.atk,0);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].stages.atk,-6);
});


test('3613 强化1014严格半血、禁强化和六级上限',()=>{
 const e=pick(1014)[0];for(const n of [4499,4500,4501])assert.deepEqual(Object.values(turn(make(e,{hp:n})).fighters[0].stages),Array(6).fill(n>4500?2:1));const s=make(e);H.allStages(s,0,6);assert.deepEqual(Object.values(turn(s).fighters[0].stages),Array(6).fill(6));timer(s,0,'禁强化');H.allStages(s,0,0);assert.deepEqual(Object.values(turn(s).fighters[0].stages),Array(6).fill(0));
});



test('3613 后手939真实吸取三分之一、先手失败、残血禁疗与免伤',()=>{
 for(const e of pick(939)){const o=turn(make(e,{hp:1000,aStats:{spe:1}}));assert.deepEqual(hp(o),[4000,6000-damage(o)]);const first=make(e,{hp:1000,aStats:{spe:1}});first.fighters[0].counts.nextSkillPriority=1;first.fighters[0].soulState.nextSkillPriorityAmount=4;assert.equal(turn(first).fighters[0].hp,1000);
 const noheal=make(e,{hp:1000,aStats:{spe:1}});timer(noheal,0,'技能禁疗');const n=turn(noheal);assert.deepEqual(hp(n),[1000,6000-damage(n)]);const im=make(e,{hp:1000,aStats:{spe:1}});timer(im,1,'当回合免伤');assert.deepEqual(hp(turn(im)),[1000,9000]);const low=turn(make(e,{hp:1000,targetHp:1000,aStats:{spe:1}}));assert.equal(low.fighters[1].hp,0);assert.equal(low.fighters[0].hp,4000);
}});
test('3613 清强33保留负等级、无强化和封招',()=>{const e=pick(33)[0],s=make(e);s.fighters[1].stages.atk=3;s.fighters[1].stages.def=-2;const o=turn(s);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].stages.def,-2);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[1].stages.atk,3);assert.deepEqual(turn(make(e)).fighters[1].stages,s.fighters[0].stages);});

test('3613 反馈922保留真实弱化幅度、免弱与四回合到期',()=>{const e=pick(922)[0],s=make(e);s.fighters[0].stages.atk=-3;s.fighters[0].stages.def=-6;s.fighters[0].stages.spe=2;const o=turn(s);assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[0].stages.spe,2);assert.equal(o.fighters[1].stages.atk,-3);assert.equal(o.fighters[1].stages.def,-6);const im=make(e);im.fighters[0].stages.atk=-2;timer(im,1,'免弱');const b=turn(im);assert.equal(b.fighters[0].stages.atk,0);assert.equal(b.fighters[1].stages.atk,0);let x=wait(wait(wait(o)));x.fighters[0].stages.atk=-1;assert.equal(wait(x).fighters[0].stages.atk,-1);});

