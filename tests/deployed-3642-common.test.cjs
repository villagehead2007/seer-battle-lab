'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3642-battle.cjs');
const {source,keys,key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,allStages,pick,seedCase}=H;
const dmg=s=>s.fighters[0].lastAttackDamage??0,hp=s=>s.fighters.map(f=>f.hp),entry=id=>pick(id)[0];
test('3642 15两种概率实例害怕成功失败、免疫与控制不扣PP',()=>{
 for(const e of pick(15)){const yes=seedCase(e,o=>!!o.fighters[1].ailments['害怕']),no=seedCase(e,o=>!o.fighters[1].ailments['害怕']);assert.ok(yes.out.fighters[1].ailments['害怕']);assert.deepEqual(no.out.fighters[1].ailments,{});const immune=make(e,{seed:yes.seed});timer(immune,1,'免异常');assert.deepEqual(turn(immune).fighters[1].ailments,{});const o=turn(yes.out,IDLE,HIT);assert.equal(o.fighters[1].pp[key(HIT)],yes.out.fighters[1].pp[key(HIT)]);}
});
test('3642 126三回合攻速各一、六级截断与禁强化',()=>{
 let s=turn(make(entry(126)));for(let n=1;n<=3;n++){assert.equal(s.fighters[0].stages.atk,n);assert.equal(s.fighters[0].stages.spe,n);assert.equal(s.fighters[0].stages.def,0);s=wait(s);}assert.equal(s.fighters[0].stages.atk,3);const cap=allStages(make(entry(126)),0,6);assert.equal(turn(cap).fighters[0].stages.atk,6);const ban=make(entry(126));timer(ban,0,'禁强化');assert.deepEqual(turn(ban).fighters[0].stages,ban.fighters[0].stages);
});
test('3642 57用技能四回合回复、控制不触发和禁疗',()=>{
 const e=entry(57);let s=turn(make(e,{hp:1}));assert.equal(s.fighters[0].hp,3001);s=wait(s);assert.equal(s.fighters[0].hp,6001);s=wait(s);assert.equal(s.fighters[0].hp,9000);s.fighters[0].hp=1;s=wait(s);assert.equal(s.fighters[0].hp,3001);s=wait(s);assert.equal(s.fighters[0].hp,3001);const ban=make(e,{hp:1});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1);const control=turn(make(e,{hp:1}));control.fighters[0].ailments['疲惫']=99;assert.equal(wait(control).fighters[0].hp,3001);
});
