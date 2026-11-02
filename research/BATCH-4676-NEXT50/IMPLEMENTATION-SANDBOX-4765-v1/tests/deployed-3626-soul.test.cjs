'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {key,IDLE,HIT,FEAR,make,turn,wait,timer}=require('./helpers/3626-battle.cjs');
const e={moveId:10086,index:null},opt={soul:919,omit:true},status={moveId:20231,index:null};
test('3626 魂印919首回合受攻减半、下次属性无效只消费一次',()=>{
 const s=make(e,opt),plain=make(e,{omit:true});const o=turn(s,e.moveId,HIT),p=turn(plain,e.moveId,HIT);assert.equal(9000-o.fighters[0].hp,Math.floor((9000-p.fighters[0].hp)*.5));assert.equal(o.fighters[1].counts.nextStatusInvalid,1);
 let n=turn(o,e.moveId,FEAR);assert.equal(n.fighters[1].counts.nextStatusInvalid,0);assert.deepEqual(n.fighters[0].ailments,{});n.rng=1;n=turn(n,e.moveId,FEAR);assert.ok(n.fighters[0].ailments['麻痹']);
 const reset=structuredClone(o);reset.fighters[0].hp=9000;reset.rng=0;assert.equal(9000-turn(reset,e.moveId,HIT).fighters[0].hp,9000-p.fighters[0].hp);
 const controlled=make(e,opt);controlled.fighters[1].ailments['疲惫']=1;assert.equal(turn(controlled,e.moveId,HIT).fighters[1].counts.nextStatusInvalid,undefined);
});
test('3626 魂印919首回合对手用属免异常并封下一攻、次回合无免疫',()=>{
 const s=make(e,{...opt,seed:1}),o=turn(s,e.moveId,FEAR);assert.equal(o.fighters[0].ailments['麻痹'],undefined);assert.equal(o.fighters[1].counts.nextAttackInvalid,1);
 const n=turn(o,e.moveId,HIT);assert.equal(n.fighters[0].hp,9000);assert.equal(n.fighters[1].counts.nextAttackInvalid,0);assert.ok(turn(n,e.moveId,HIT).fighters[0].hp<9000);o.rng=1;assert.ok(turn(o,e.moveId,FEAR).fighters[0].ailments['麻痹']);
 const blocked=make(e,opt);timer(blocked,1,'skillBlock');const b=turn(blocked,e.moveId,FEAR);assert.equal(b.fighters[1].counts.nextAttackInvalid,1);
});
test('3626 魂印919用属五成害怕、未触发清回合及免断交互',()=>{
 const seen=new Set();let yesSeed,noSeed;for(let seed=0;seed<48;seed++){const s=make(status,{...opt,seed});timer(s,1,'id913',{bonus:1});const o=turn(s);const fear=o.turns[0].events.some(x=>x.text.includes('陷入害怕'));seen.add(fear);if(fear){yesSeed=seed;assert.ok(o.fighters[1].effects.id913);}else{noSeed=seed;assert.equal(o.fighters[1].effects.id913,undefined);}}assert.deepEqual(seen,new Set([true,false]));
 const immune=make(status,{...opt,seed:yesSeed});immune.fighters[1].counts.immune=1;timer(immune,1,'id913',{bonus:1});const o=turn(immune);assert.equal(o.fighters[1].counts.immune,0);assert.equal(o.fighters[1].effects.id913,undefined);assert.deepEqual(o.fighters[1].ailments,{});
 const protect=make(status,{...opt,seed:noSeed});timer(protect,1,'protect');timer(protect,1,'id913',{bonus:1});assert.ok(turn(protect).fighters[1].effects.id913);
 const control=make(status,{...opt,seed:yesSeed});control.fighters[0].ailments['疲惫']=1;timer(control,1,'id913',{bonus:1});assert.ok(turn(control).fighters[1].effects.id913);assert.deepEqual(turn(control).fighters[1].ailments,{});
 const blocked=make(status,{...opt,seed:yesSeed});timer(blocked,0,'skillBlock');assert.ok(turn(blocked).turns[0].events.some(x=>x.text.includes('陷入害怕')));
 const attack=make(e,{...opt,seed:yesSeed});timer(attack,1,'id913',{bonus:1});assert.ok(turn(attack).fighters[1].effects.id913);assert.deepEqual(turn(attack).fighters[1].ailments,{});
});

