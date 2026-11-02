'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3592-battle.cjs');const {key,IDLE,WAIT,HIT,make,turn,wait,timer,pick}=H;
const plain={moveId:11077,index:null},dmg=s=>s.fighters[0].lastAttackDamage;
test('3592 魂印886满血所有技能先制二、残血不加及回合开始锁定',()=>{
 for(const moveId of [11077,20307])for(const hp of [8999,9000]){const s=make({moveId,index:null},{soul:true,hp,aStats:{spe:1}});assert.equal(turn(s).turns[0].first,hp===9000?0:1);}
 const s=make(plain,{soul:true,aStats:{spe:1}});timer(s,1,'id984',{amount:3});const o=turn(s,11077,HIT);assert.equal(o.turns[0].first,1);assert.ok(o.fighters[0].hp<9000);assert.equal(o.fighters[0].soulState.netherFull,true);const control=make(plain,{aStats:{spe:1}});timer(control,1,'id984',{amount:3});assert.equal(dmg(o),dmg(turn(control,11077,HIT)));
 const r=make(plain,{soul:true,hp:8999});timer(r,1,'id984',{amount:3});assert.equal(turn(r).turns[0].first,1);
});
test('3592 魂印886残血攻击固伤粉伤提升50%、回血不改变当回合判定',()=>{
 const normal=turn(make(plain)),low=turn(make(plain,{soul:true,hp:8999}));assert.ok(Math.abs(dmg(low)-dmg(normal)*1.5)<=1);
 const fixed=turn(make(pick(29)[0],{soul:true,hp:8999}));assert.equal(9000-fixed.fighters[1].hp-dmg(fixed),75);
 const pink=turn(make(pick(532)[0],{soul:true,hp:1000}));assert.equal(pink.fighters[0].hp,4000);assert.equal(pink.fighters[1].hp,4500);
 const heal=turn(make(pick(532)[0],{soul:true,hp:8999}));assert.equal(heal.fighters[0].hp,9000);assert.equal(heal.fighters[1].hp,8999); // one actual HP healed, then 1.5 floored
 const im=make(pick(29)[0],{soul:true,hp:8999});timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);
});
test('3592 魂印886攻击未击败下回合必暴、属性和控制不授予、到期',()=>{
 let s=turn(make(plain,{soul:true}));assert.equal(s.fighters[0].effects['必定暴击'].start,2);assert.equal(s.fighters[0].effects['必定暴击'].end,2);s.rng=0;const c=structuredClone(s);delete c.fighters[0].effects['必定暴击'];assert.ok(Math.abs(dmg(turn(s))-2*dmg(turn(c)))<=1);
 const attr=turn(make({moveId:20307,index:null},{soul:true}));assert.equal(attr.fighters[0].effects['必定暴击'],undefined);
 const block=make(plain,{soul:true});block.fighters[0].ailments['疲惫']=2;assert.equal(turn(block).fighters[0].effects['必定暴击'],undefined);
 const expired=wait(s);assert.equal(expired.fighters[0].effects['必定暴击'],undefined);expired.rng=0;assert.equal(dmg(turn(expired)),dmg(turn(make(plain,{soul:true}))));
 const miss=make(plain,{soul:true,hit:false});timer(miss,0,'攻击必失');const m=turn(miss);assert.equal(m.fighters[1].hp,9000);assert.equal(m.fighters[0].effects['必定暴击'].start,2);
 const kill=turn(make(plain,{soul:true,targetHp:1,hp:1000}));assert.equal(kill.fighters[1].hp,0);assert.equal(kill.fighters[0].hp,1000);assert.equal(kill.fighters[0].effects['必定暴击'],undefined);
});
test('3592 魂印必暴传递到第五496回血、封招不回血与独立追加技能',()=>{
 const e={moveId:31929,index:null};let s=make(e,{soul:true,hp:1000});s=turn(s,11077);s.fighters[1].hp=9000;s=turn(s,31929);assert.equal(s.fighters[0].hp,9000);
 let b=turn(make(e,{soul:true,hp:1000}),11077);timer(b,0,'skillBlock');assert.equal(turn(b,31929).fighters[0].hp,1000);
 const multi={moveId:32624,index:null},m=make(multi,{soul:true,hp:1000});m.fighters[0].stages.acc=-2;const o=turn(m);assert.equal(o.fighters[0].stages.acc,2);assert.equal(o.fighters[0].hp,9000);assert.ok(9000-o.fighters[1].hp>0);assert.equal(o.fighters[0].pp[key(32624)],4);
});
