'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {make,turn,pick,timer,key}=require('./helpers/3847-battle.cjs');
test('3847 761削减实际回复、满血与禁疗边界及消除到期',()=>{
 const s=make(pick(761)[0],{opponentMove:25512,opponentEffectId:77,targetHp:1000});
 let o=turn(s,undefined,900042);const dealt=o.fighters[0].lastAttackDamage;
 assert.equal(o.fighters[1].hp,1000-dealt+100);
 assert.equal(o.fighters[1].effects['回复效果削减'].end,3);
 o=turn(o,900031,900042);assert.equal(o.fighters[1].hp,1100-dealt+100);
 const banned=make(pick(761)[0],{opponentMove:25512,opponentEffectId:77,targetHp:1000});timer(banned,1,'技能禁疗');
 const blocked=turn(banned,undefined,900042);assert.equal(blocked.fighters[1].hp,1000-blocked.fighters[0].lastAttackDamage);
 const expired=structuredClone(o);expired.round=4;const hp=expired.fighters[1].hp;
 assert.equal(turn(expired,900031,900042).fighters[1].hp,hp+200);
 const full=structuredClone(o);full.fighters[1].hp=9000;assert.equal(turn(full,900031,900042).fighters[1].hp,9000);
 const cleared=structuredClone(o);delete cleared.fighters[1].effects['回复效果削减'];const before=cleared.fighters[1].hp;
 assert.equal(turn(cleared,900031,900042).fighters[1].hp,before+200);
});
test('3847 1221反弱成功免疫次数、无弱化和禁止反转失败',()=>{
 const s=make(pick(1221)[0]);s.fighters[0].stages.atk=-6;s.fighters[0].stages.def=2;
 let o=turn(s);assert.equal(o.fighters[0].stages.atk,6);assert.equal(o.fighters[0].stages.def,2);assert.equal(o.fighters[0].counts.immune,1);
 assert.equal(turn(make(pick(1221)[0])).fighters[0].counts.immune??0,0);
 for(const effect of ['弱化不可解除反转','禁强化']){const no=structuredClone(s);timer(no,0,effect);const out=turn(no);assert.equal(out.fighters[0].stages.atk,-6);assert.equal(out.fighters[0].counts.immune??0,0);}
 const immune=make(pick(1221)[0],{opponentMove:30813,opponentEffectId:451});immune.fighters[0].stages.spe=-1;
 o=turn(immune,undefined,900042);assert.equal(o.fighters[0].counts.immune,0);assert.deepEqual(o.fighters[0].ailments,{});
 o=turn(o,900031,900042);assert.equal(Object.keys(o.fighters[0].ailments).length,1);assert.equal(o.fighters[0].pp[key(900031)],98);
});
