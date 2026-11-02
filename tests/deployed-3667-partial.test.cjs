'use strict';
// 3667 未完成：仅验证已明确语义的独立实例，不能作为整只通过证据。
const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3667-battle.cjs');
const {key,IDLE,WAIT,HIT,make,turn,wait,timer,pick,seedCase}=H,e=id=>pick(id)[0],dmg=s=>s.fighters[0].lastAttackDamage??0;

test('3667 643命中逐回合下降三次、下限免弱和目标回合效果清除',()=>{
 const x=e(643);let s=turn(make(x));assert.equal(s.fighters[1].stages.acc,-1);s=wait(s);assert.equal(s.fighters[1].stages.acc,-2);s=wait(s);assert.equal(s.fighters[1].stages.acc,-3);s=wait(s);assert.equal(s.fighters[1].stages.acc,-3);
 const im=make(x);timer(im,1,'免弱');assert.equal(turn(im).fighters[1].stages.acc,0);
 const cap=make(x);cap.fighters[1].stages.acc=-6;assert.equal(turn(cap).fighters[1].stages.acc,-6);
 const blocked=make(x);timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[1].stages.acc,0);
 const clear=make(x,{opponentEffect:{moveId:32309,index:1}});let c=turn(clear);c=turn(c,IDLE,900023);assert.equal(c.fighters[1].stages.acc,-2); // 对手消除的是我方效果，不能清除自身的降命中计时。
 const ours=turn(make(x));delete ours.fighters[1].effects['逐回合能力变化'];assert.equal(wait(ours).fighters[1].stages.acc,-1);
 const combined=turn(make(x,{opponentEffect:{moveId:26259,index:1}}),x.moveId,900023);assert.equal(combined.fighters[1].stages.acc,-1);assert.equal(combined.fighters[1].stages.spa,1);assert.equal(combined.fighters[1].stages.spe,1);const next=wait(combined);assert.equal(next.fighters[1].stages.acc,-2);assert.equal(next.fighters[1].stages.spa,2);
});

test('3667 602对手用攻后降双攻、属性不触发、免弱及先后手期限',()=>{
 const x=e(602);let s=turn(make(x),x.moveId,HIT);assert.equal(s.fighters[1].stages.atk,-1);assert.equal(s.fighters[1].stages.spa,-1);
 s=turn(s,IDLE,HIT);assert.equal(s.fighters[1].stages.atk,-2);s=turn(s,IDLE,HIT);assert.equal(s.fighters[1].stages.atk,-2);
 assert.equal(turn(make(x)).fighters[1].stages.atk,0);
 const im=make(x);timer(im,1,'免弱');assert.equal(turn(im,x.moveId,HIT).fighters[1].stages.atk,0);
 const cap=make(x);cap.fighters[1].stages.atk=-6;assert.equal(turn(cap,x.moveId,HIT).fighters[1].stages.atk,-6);
 let late=turn(make(x,{aStats:{spe:1}}),x.moveId,HIT);assert.equal(late.fighters[1].stages.atk,0);late=turn(late,IDLE,HIT);assert.equal(late.fighters[1].stages.atk,-1);late=turn(late,IDLE,HIT);assert.equal(late.fighters[1].stages.atk,-2);late=turn(late,IDLE,HIT);assert.equal(late.fighters[1].stages.atk,-2);
});

test('3667 493用攻触发下两回合实伤暴击、属性控制无触发及后手延长',()=>{
 const x=e(493),s=turn(make(x),x.moveId,HIT);assert.deepEqual(s.fighters[0].effects['必定暴击'],{start:2,end:3});
 for(let r=2,b=s;r<=4;r++){b.rng=0;const plain=structuredClone(b);delete plain.fighters[0].effects['必定暴击'];const o=turn(b,10250),p=turn(plain,10250);assert.ok(Math.abs(dmg(o)-(r<=3?2:1)*dmg(p))<=1);b=o;}
 assert.equal(turn(make(x)).fighters[0].effects['必定暴击'],undefined);
 const control=make(x);control.fighters[1].ailments['疲惫']=9;assert.equal(turn(control,x.moveId,HIT).fighters[0].effects['必定暴击'],undefined);
 let late=turn(make(x,{aStats:{spe:1}}),x.moveId,HIT);assert.equal(late.fighters[0].effects['必定暴击'],undefined);late=turn(late,IDLE,HIT);assert.deepEqual(late.fighters[0].effects['必定暴击'],{start:3,end:4});
});

test('3667 1213四回合用招粉伤、受控不触发、免伤及消回合停止',()=>{
 const x=e(1213);let s=make(x);for(let r=1;r<=5;r++){s.fighters[1].hp=9000;s=r===1?turn(s):wait(s);assert.equal(s.fighters[1].hp,r<=4?6000:9000);}
 const im=make(x);timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);
 let c=turn(make(x));c.fighters[0].ailments['疲惫']=9;assert.equal(wait(c).fighters[1].hp,6000);
 let gone=turn(make(x,{opponentEffect:{moveId:32309,index:1}}),x.moveId,900023);assert.equal(gone.fighters[0].effects['用招附加最大体力粉伤'],undefined);assert.equal(wait(gone).fighters[1].hp,6000);
 const low=turn(make(x,{targetHp:10}));assert.equal(low.fighters[1].hp,0);
});

test('3667 2161每次用招弱化、实际失败才获下次增伤、部分成功与期限',()=>{
 const x=e(2161);let s=turn(make(x));assert.equal(s.fighters[1].stages.spd,-1);assert.equal(s.fighters[1].stages.spe,-1);assert.equal(s.fighters[0].counts.nextAttackBoost??0,0);
 s=wait(s);assert.equal(s.fighters[1].stages.spd,-2);s=wait(s);assert.equal(s.fighters[1].stages.spd,-3);s=wait(s);assert.equal(s.fighters[1].stages.spd,-3);
 const im=make(x);timer(im,1,'免弱');let blocked=turn(im);assert.equal(blocked.fighters[1].stages.spd,0);assert.equal(blocked.fighters[0].counts.nextAttackBoost,1);
 blocked=wait(wait(blocked));assert.equal(blocked.fighters[0].counts.nextAttackBoost,1);blocked.rng=0;const plain=structuredClone(blocked);plain.fighters[0].counts.nextAttackBoost=0;
 const boosted=turn(blocked,10250),normal=turn(plain,10250);assert.ok(Math.abs(dmg(boosted)-2*dmg(normal))<=1);assert.equal(boosted.fighters[0].counts.nextAttackBoost,0);
 const cap=make(x);cap.fighters[1].stages.spd=cap.fighters[1].stages.spe=-6;assert.equal(turn(cap).fighters[0].counts.nextAttackBoost,1);
 const partial=make(x);partial.fighters[1].stages.spd=-6;assert.equal(turn(partial).fighters[0].counts.nextAttackBoost??0,0);
 const invalid=make(x);timer(invalid,0,'skillBlock');assert.equal(turn(invalid).fighters[0].counts.nextAttackBoost??0,0);
});

test('3667 1362先手固定吸取理论300回复，后手不触发，残血免伤禁疗边界',()=>{
 const x=e(1362),o=turn(make(x,{hp:1000}));assert.equal(o.fighters[0].hp,1300);assert.equal(9000-o.fighters[1].hp-dmg(o),300);
 const late=turn(make(x,{hp:1000,aStats:{spe:1}}));assert.equal(late.fighters[0].hp,1000);assert.equal(9000-late.fighters[1].hp,dmg(late));
 const low=turn(make(x,{hp:1000,targetHp:dmg(o)+10}));assert.equal(low.fighters[0].hp,1300);assert.equal(low.fighters[1].hp,0);
 const full=turn(make(x,{hp:8999}));assert.equal(full.fighters[0].hp,9000);
 const ban=make(x,{hp:1000});timer(ban,0,'技能禁疗');const b=turn(ban);assert.equal(b.fighters[0].hp,1000);assert.equal(9000-b.fighters[1].hp-dmg(b),300);
 const immune=make(x,{hp:1000});timer(immune,1,'当回合免伤');assert.equal(turn(immune).fighters[0].hp,1300);
 const sealed=make(x,{hp:1000});timer(sealed,0,'skillBlock');assert.equal(turn(sealed).fighters[0].hp,1000);
});

test('3667 476后手回复定额体力、先手不回复、满血及禁疗',()=>{
 const x=e(476);assert.equal(turn(make(x,{hp:1000,aStats:{spe:1}})).fighters[0].hp,1300);assert.equal(turn(make(x,{hp:1000})).fighters[0].hp,1000);assert.equal(turn(make(x,{hp:8999,aStats:{spe:1}})).fighters[0].hp,9000);
 const ban=make(x,{hp:1000,aStats:{spe:1}});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);
 const sealed=make(x,{hp:1000,aStats:{spe:1}});timer(sealed,0,'skillBlock');assert.equal(turn(sealed).fighters[0].hp,1000);
});

test('3667 656两实例概率成功失败、不重复抽取、零PP边界与封招',()=>{
 for(const x of pick(656)){const n=x.params[1],zero=o=>Object.values(o.fighters[1].pp).filter(v=>v===0).length;
  const yes=seedCase(x,o=>zero(o)===n),no=seedCase(x,o=>zero(o)===0);assert.equal(zero(yes.out),n);assert.equal(zero(no.out),0);
  for(const [id,pp]of Object.entries(yes.out.fighters[1].pp))assert.ok(pp===0||pp===(id===key(WAIT)?98:99)||id===key(H.FEAR));
  const sealed=make(x,{seed:yes.seed});timer(sealed,0,'skillBlock');assert.equal(zero(turn(sealed)),0);
  const empty=make(x,{seed:yes.seed});for(const id of empty.fighters[1].moves)empty.fighters[1].pp[id]=id===key(WAIT)?1:0;const o=turn(empty);assert.ok(Object.values(o.fighters[1].pp).every(v=>v>=0));assert.equal(zero(o),4);
 }
});
