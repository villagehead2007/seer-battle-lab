'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3665-battle.cjs');const {E,source,key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,allStages,pick,seedCase}=H;
const dmg=s=>s.fighters[0].lastAttackDamage??0,hp=s=>s.fighters.map(f=>f.hp);

test('3665 属性4与5逐实例概率、六级边界及免弱禁强',()=>{
 for(const e of [...pick(4),...pick(5)]){const side=e.id===4?0:1,k=H.keys[e.params[0]],n=e.params[2],yes=seedCase(e,o=>o.fighters[side].stages[k]===n);assert.equal(yes.out.fighters[side].stages[k],n);
 if(e.params[1]<100)assert.equal(seedCase(e,o=>o.fighters[side].stages[k]===0).out.fighters[side].stages[k],0);
 const cap=make(e,{seed:yes.seed});cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 const block=make(e,{seed:yes.seed});timer(block,side,n>0?'禁强化':'免弱');assert.equal(turn(block).fighters[side].stages[k],0);
 }
 const duplicate=make({moveId:23752,index:null}),o=turn(duplicate);assert.equal(o.fighters[0].stages.def,1);assert.equal(o.fighters[0].stages.spd,1);
});
test('3665 191四回合免疫反弹、双方免疫及到期',()=>{
 const e=pick(191)[0];let s=turn(make(e));s.rng=8;const o=turn(s,IDLE,FEAR);assert.equal(o.fighters[0].ailments['麻痹'],undefined);assert.ok(o.fighters[1].ailments['麻痹']);const both=structuredClone(s);timer(both,1,'免异常');assert.deepEqual(turn(both,IDLE,FEAR).fighters.map(f=>f.ailments),[{},{}]);s=wait(wait(wait(s)));s.rng=8;assert.ok(turn(s,IDLE,FEAR).fighters[0].ailments['麻痹']);
});
test('3665 693与843下一回合起两回合增伤及先制、不提前且到期',()=>{
 for(const e of [...pick(693),...pick(843)]){let s=turn(make(e,{aStats:{spe:1}}));assert.equal(s.turns[0].first,1);for(let r=2;r<=4;r++){s.rng=0;const plain=structuredClone(s);delete plain.fighters[0].effects[e.id===693?'id913':'id984'];const a=turn(s,10001),b=turn(plain,10001);if(e.id===693)assert.equal(dmg(a),Math.floor((Math.floor(Math.floor(42*35*180/300)/50)+2)*E.typeEffectiveness('普通',s.fighters[1].type,s.typeChart)*.89*(r<=3?1+e.params[1]/100:1)));else assert.equal(a.turns.at(-1).first,r<=3?0:1);s=a;}const block=make(e);timer(block,0,'skillBlock');assert.equal(turn(block).fighters[0].effects[e.id===693?'id913':'id984'],undefined);}
});
