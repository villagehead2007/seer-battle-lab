'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3629-battle.cjs');const {E,source,key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,allStages,pick,seedCase}=H;
const dmg=s=>s.fighters[0].lastAttackDamage??0,hp=s=>s.fighters.map(f=>f.hp);

test('3629 属性4与5逐实例概率、六级边界及免弱禁强',()=>{
 for(const e of [...pick(4),...pick(5)]){const side=e.id===4?0:1,k=H.keys[e.params[0]],n=e.params[2],yes=seedCase(e,o=>o.fighters[side].stages[k]===n);assert.equal(yes.out.fighters[side].stages[k],n);
 if(e.params[1]<100)assert.equal(seedCase(e,o=>o.fighters[side].stages[k]===0).out.fighters[side].stages[k],0);
 const cap=make(e,{seed:yes.seed});cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 const block=make(e,{seed:yes.seed});timer(block,side,n>0?'禁强化':'免弱');assert.equal(turn(block).fighters[side].stages[k],0);
 }
 const duplicate=make({moveId:20464,index:null}),o=turn(duplicate);assert.equal(o.fighters[1].stages.atk,-1);assert.equal(o.fighters[1].stages.spa,-1);
});
test('3629 191四回合免疫反弹、双方免疫及到期',()=>{
 const e=pick(191)[0];let s=turn(make(e));s.rng=8;const o=turn(s,IDLE,FEAR);assert.equal(o.fighters[0].ailments['麻痹'],undefined);assert.ok(o.fighters[1].ailments['麻痹']);const both=structuredClone(s);timer(both,1,'免异常');assert.deepEqual(turn(both,IDLE,FEAR).fighters.map(f=>f.ailments),[{},{}]);s=wait(wait(wait(s)));s.rng=8;assert.ok(turn(s,IDLE,FEAR).fighters[0].ailments['麻痹']);
});
test('3629 440两倍PP消费、低PP归零、控制与到期',()=>{
 const e=pick(440)[0];let s=make(e),pp=s.fighters[1].pp[key(HIT)];for(let r=1;r<=4;r++){s=turn(s,r===1?e.moveId:IDLE,HIT);pp-=r<=3?2:1;assert.equal(s.fighters[1].pp[key(HIT)],pp);}const low=make(e);low.fighters[1].pp[key(HIT)]=1;assert.equal(turn(low,e.moveId,HIT).fighters[1].pp[key(HIT)],0);const control=make(e);control.fighters[1].ailments['疲惫']=1;assert.equal(turn(control,e.moveId,HIT).fighters[1].pp[key(HIT)],99);
});
