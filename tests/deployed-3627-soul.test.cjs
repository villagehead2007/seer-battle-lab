'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3627-battle.cjs');const {E,key,IDLE,HIT,FEAR,make,turn,timer,pick}=H;
const e={moveId:10250,index:null},opt={soul:921,omit:true},dmg=o=>o.fighters[0].lastAttackDamage??0;
test('3627 魂印921攻击命中前清回合、失误封招与免断',()=>{
 const s=make(e,opt);timer(s,1,'鬼王攻击免疫');timer(s,1,'id913',{bonus:1});const o=turn(s);assert.equal(o.fighters[1].effects.id913,undefined);assert.ok(dmg(o)>0);
 const miss=make(e,{...opt,hit:false});timer(miss,0,'攻击必失');timer(miss,1,'id913',{bonus:1});const m=turn(miss);assert.equal(m.fighters[1].effects.id913,undefined);assert.equal(m.fighters[1].hp,9000);
 const blocked=make(e,opt);timer(blocked,0,'skillBlock');timer(blocked,1,'id913',{bonus:1});assert.equal(turn(blocked).fighters[1].effects.id913,undefined);assert.equal(turn(blocked).fighters[1].hp,9000);
 const protect=make(e,opt);timer(protect,1,'protect');timer(protect,1,'id913',{bonus:1});assert.ok(turn(protect).fighters[1].effects.id913);
 const status=make({moveId:20496,index:null},opt);timer(status,1,'id913',{bonus:1});assert.ok(turn(status).fighters[1].effects.id913);const control=make(e,opt);control.fighters[0].ailments['疲惫']=1;timer(control,1,'id913',{bonus:1});assert.ok(turn(control).fighters[1].effects.id913);assert.equal(turn(control).fighters[0].pp[key(e.moveId)],H.source.moves[0].pp);
});
test('3627 魂印921先出手免弱和攻击增五成、粉伤不增与期限重置',()=>{
 const options={...opt,opponentEffect:pick(5)[0]},s=make(e,options),o=turn(s,e.moveId,900023);assert.equal(o.fighters[0].stages.def,0);assert.ok(o.turns[0].events.find(x=>x.kind==='damage').detail.includes('增减伤 1.5 '));const plain=make(e,{omit:true,opponentEffect:pick(5)[0]});assert.equal(turn(plain,e.moveId,900023).fighters[0].stages.def,-2);
 const t=structuredClone(o);t.fighters[0].stats.spe=1;const next=turn(t,e.moveId,900023);assert.equal(next.fighters[0].stages.def,-2);assert.ok(next.turns.at(-1).events.find(x=>x.kind==='damage').detail.includes('增减伤 1 '));
 const fixed=turn(make(pick(60)[0],{soul:921}));assert.equal(fixed.fighters[1].hp,8850);const attack=make(pick(853)[0],{soul:921});const a=turn(attack);assert.equal(9000-a.fighters[1].hp-dmg(a),2375);
 const noAction=make(e,options);noAction.fighters[0].ailments['疲惫']=1;assert.equal(turn(noAction,e.moveId,900023).fighters[0].stages.def,-2);
});
test('3627 魂印921对手先出手免异常与受攻减半、失效用招仍触发',()=>{
 const s=make(e,{...opt,aStats:{spe:1}}),o=turn(s,e.moveId,HIT),plain=turn(make(e,{omit:true,aStats:{spe:1}}),e.moveId,HIT);assert.ok(Math.abs((9000-o.fighters[0].hp)*2-(9000-plain.fighters[0].hp))<=1);assert.equal(dmg(o),dmg(plain));
 const im=make(e,{...opt,aStats:{spe:1},seed:1});im.moveDefinitions[key(FEAR)].alwaysHit=true;assert.equal(turn(im,e.moveId,FEAR).fighters[0].ailments['麻痹'],undefined);const without=make(e,{omit:true,aStats:{spe:1},seed:1});without.moveDefinitions[key(FEAR)].alwaysHit=true;assert.ok(turn(without,e.moveId,FEAR).turns[0].events.some(x=>x.text.includes('陷入麻痹')));
 const fast=structuredClone(o);fast.fighters[0].stats.spe=500;fast.rng=0;const n=turn(fast,e.moveId,HIT);assert.equal(n.fighters[0].soulState.freedomLate,false);assert.ok(o.fighters[0].hp-n.fighters[0].hp>9000-o.fighters[0].hp);
 const block=make(e,{...opt,aStats:{spe:1}});timer(block,1,'skillBlock');assert.equal(turn(block,e.moveId,HIT).fighters[0].soulState.freedomLate,true);const control=make(e,{...opt,aStats:{spe:1}});control.fighters[1].ailments['疲惫']=1;assert.equal(turn(control,e.moveId,HIT).fighters[0].soulState.freedomLate,false);
});
