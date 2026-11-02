'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3623-battle.cjs');const {E,source,key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,allStages,pick,seedCase}=H;
const dmg=s=>s.fighters[0].lastAttackDamage??0,hp=s=>s.fighters.map(f=>f.hp);

test('3623 属性4与5逐实例概率、六级边界及免弱禁强',()=>{
 for(const e of [...pick(4),...pick(5)]){const side=e.id===4?0:1,k=H.keys[e.params[0]],n=e.params[2],yes=seedCase(e,o=>o.fighters[side].stages[k]===n);assert.equal(yes.out.fighters[side].stages[k],n);
 if(e.params[1]<100)assert.equal(seedCase(e,o=>o.fighters[side].stages[k]===0).out.fighters[side].stages[k],0);
 const cap=make(e,{seed:yes.seed});cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 const block=make(e,{seed:yes.seed});timer(block,side,n>0?'禁强化':'免弱');assert.equal(turn(block).fighters[side].stages[k],0);
 }
 const duplicate=make({moveId:22064,index:null}),o=turn(duplicate);assert.equal(o.fighters[1].stages.spe,-1);assert.equal(o.fighters[1].stages.acc,-1);
});
test('3623 清弱3与1167清弱回血保留正等级、无弱化和禁疗',()=>{
 for(const e of [...pick(3),...pick(1167)]){const s=make(e,{hp:1000});s.fighters[0].stages.atk=-6;s.fighters[0].stages.def=2;const o=turn(s);assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[0].stages.def,2);assert.equal(o.fighters[0].hp,e.id===1167?9000:1000);
 assert.equal(turn(make(e,{hp:1000})).fighters[0].hp,1000);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);assert.equal(turn(s).fighters[0].stages.atk,0);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].stages.atk,-6);
 }
});
test('3623 40先手威力和129真实性别威力、边界与免伤',()=>{
 for(const e of [...pick(40),...pick(129)]){const opts=e.id===129?{gender:1}:{},s=make(e,opts),o=turn(s),plain=turn(make(e,{...opts,omit:true}));const row=o.turns[0].events.find(x=>x.kind==='damage');assert.ok(row.detail.includes('威力 '+source.moves.find(m=>m.id===e.moveId).power*2));assert.ok(dmg(o)>dmg(plain));
 const no=make(e,e.id===129?{gender:2}:{aStats:{spe:1}}),n=turn(no),base=turn(make(e,{omit:true,...(e.id===129?{gender:2}:{aStats:{spe:1}})}));assert.equal(dmg(n),dmg(base));timer(s,1,'当回合免伤');assert.equal(turn(s).fighters[1].hp,9000);
 }const unknown=make(pick(129)[0]);delete unknown.fighters[1].gender;assert.throws(()=>turn(unknown),/真实性别来源/);
});
test('3623 1061反转复制两实例、无强化失败、免弱禁强与六级封顶',()=>{
 for(const e of pick(1061)){const s=make(e);s.fighters[1].stages.atk=2;s.fighters[1].stages.spe=1;const o=turn(s);assert.equal(o.fighters[1].stages.atk,-2);assert.equal(o.fighters[0].stages.atk,2);
 assert.deepEqual(turn(make(e)).fighters[0].stages,make(e).fighters[0].stages);const immune=structuredClone(s);timer(immune,1,'免弱');const i=turn(immune);assert.equal(i.fighters[1].stages.atk,0);assert.equal(i.fighters[0].stages.atk,0);
 timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.atk,0);const cap=make(e);allStages(cap,0,5);allStages(cap,1,2);assert.deepEqual(Object.values(turn(cap).fighters[0].stages),Array(6).fill(6));
 }
});
test('3623 432必失与1975闪避命中异常、必中交互和到期',()=>{
 for(const e of [...pick(432),...pick(1975)]){const s=make(e),o=turn(s,e.moveId,HIT);assert.equal(o.fighters[0].hp,9000);
 const hit=make(e);hit.moveDefinitions[key(HIT)].alwaysHit=true;const a=turn(hit,e.moveId,HIT);assert.ok(a.fighters[0].hp<9000);if(e.id===1975)assert.ok(Object.keys(a.fighters[1].ailments).some(k=>['混乱','失明'].includes(k))||a.turns[0].events.some(x=>/陷入混乱|陷入失明/.test(x.text)));
 let exp=wait(o);const third=turn(exp,IDLE,HIT);assert.ok(third.fighters[0].hp<9000);const blocked=make(e);timer(blocked,0,'skillBlock');assert.ok(turn(blocked,e.moveId,HIT).fighters[0].hp<9000);
 if(e.id===1975){const im=make(e);im.moveDefinitions[key(HIT)].alwaysHit=true;timer(im,1,'免异常');assert.deepEqual(turn(im,e.moveId,HIT).fighters[1].ailments,{});}
 }
});
test('3623 576低于300免伤、300等值与持续三回合',()=>{
 const e=pick(576)[0];for(const amount of [299,300,301]){const s=make(e,{bStats:{atk:9000}});timer(s,0,'攻击伤害上限',{amount});assert.equal(turn(s,e.moveId,HIT).fighters[0].hp,amount<300?9000:9000-amount);}
 let s=turn(make(e));s=wait(wait(s));assert.equal(s.round,4);assert.ok(turn(s,IDLE,HIT).fighters[0].hp<9000);const b=make(e);timer(b,0,'skillBlock');assert.ok(turn(b,e.moveId,HIT).fighters[0].hp<9000);
});
test('3623 31十至二十段端点、逐段伤害、免伤与击败停止',()=>{
 const e=pick(31)[0],counts=new Set();for(let seed=0;seed<160;seed++){const o=turn(make(e,{seed})),rows=o.turns[0].events.filter(x=>x.kind==='damage');counts.add(rows.length);assert.ok(rows.length>=10&&rows.length<=20);assert.equal(dmg(o),rows.reduce((n,x)=>n+Number(x.text.match(/损失 (\d+)/)[1]),0));}assert.ok(counts.has(10));assert.ok(counts.has(20));const low=turn(make(e,{targetHp:1}));assert.equal(low.fighters[1].hp,0);assert.equal(low.turns[0].events.filter(x=>x.kind==='damage').length,1);const im=make(e);timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);
});
test('3623 191四回合免疫反弹、双方免疫及到期',()=>{
 const e=pick(191)[0];let s=turn(make(e));s.rng=8;const o=turn(s,IDLE,FEAR);assert.equal(o.fighters[0].ailments['麻痹'],undefined);assert.ok(o.fighters[1].ailments['麻痹']);const both=structuredClone(s);timer(both,1,'免异常');assert.deepEqual(turn(both,IDLE,FEAR).fighters.map(f=>f.ailments),[{},{}]);s=wait(wait(wait(s)));s.rng=8;assert.ok(turn(s,IDLE,FEAR).fighters[0].ailments['麻痹']);
});
test('3623 440三倍PP消费、低PP归零、控制与到期',()=>{
 const e=pick(440)[0];let s=make(e),pp=s.fighters[1].pp[key(HIT)];for(let r=1;r<=4;r++){s=turn(s,r===1?e.moveId:IDLE,HIT);pp-=r<=3?3:1;assert.equal(s.fighters[1].pp[key(HIT)],pp);}const low=make(e);low.fighters[1].pp[key(HIT)]=1;assert.equal(turn(low,e.moveId,HIT).fighters[1].pp[key(HIT)],0);const control=make(e);control.fighters[1].ailments['疲惫']=1;assert.equal(turn(control,e.moveId,HIT).fighters[1].pp[key(HIT)],99);
});
test('3623 683随机固伤200与400端点、残血免伤与禁疗',()=>{
 const e=pick(683)[0],amounts=new Set();for(let seed=0;seed<1400&&!(amounts.has(200)&&amounts.has(400));seed++){const o=turn(make(e,{seed})),n=9000-o.fighters[1].hp-dmg(o);assert.ok(n>=200&&n<=400);amounts.add(n);}assert.ok(amounts.has(200));assert.ok(amounts.has(400));const low=turn(make(e,{targetHp:1}));assert.equal(low.fighters[1].hp,0);const im=make(e);timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);const ban=make(e,{hp:1000});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);
});
test('3623 622六项强化60%翻倍、失败分支、六级和禁强化',()=>{
 const e=pick(622)[0];for(const n of [1,2]){const found=seedCase(e,o=>o.fighters[0].stages.atk===n);assert.deepEqual(Object.values(found.out.fighters[0].stages),Array(6).fill(n));const cap=make(e,{seed:found.seed});allStages(cap,0,5);assert.deepEqual(Object.values(turn(cap).fighters[0].stages),Array(6).fill(6));timer(cap,0,'禁强化');allStages(cap,0,0);assert.deepEqual(Object.values(turn(cap).fighters[0].stages),Array(6).fill(0));}
});
test('3623 971四回合用招吸取、严格半血、禁疗与实际损血',()=>{
 const e=pick(971)[0];for(const n of [1000,4499,4500,4501,8999,9000]){const o=turn(make(e,{hp:n})),drain=n<4500?6000:3000;assert.deepEqual(hp(o),[Math.min(9000,n+drain),9000-drain]);}
 let s=make(e,{hp:1000});for(let r=1;r<=5;r++){s.fighters[0].hp=1000;s.fighters[1].hp=9000;s=turn(s,r===1?e.moveId:IDLE);assert.deepEqual(hp(s),r<=4?[7000,3000]:[1000,9000]);}
 const low=make(e,{hp:1000,targetHp:50});assert.deepEqual(hp(turn(low)),[1050,0]);const ban=make(e,{hp:1000});timer(ban,0,'技能禁疗');assert.deepEqual(hp(turn(ban)),[1000,3000]);timer(ban,1,'当回合免伤');assert.deepEqual(hp(turn(ban)),[1000,9000]);
});
test('3623 693与843下一回合起两回合增伤及先制、不提前且到期',()=>{
 for(const e of [...pick(693),...pick(843)]){let s=turn(make(e,{aStats:{spe:1}}));assert.equal(s.turns[0].first,1);for(let r=2;r<=4;r++){s.rng=0;const plain=structuredClone(s);delete plain.fighters[0].effects[e.id===693?'id913':'id984'];const a=turn(s,10535),b=turn(plain,10535);if(e.id===693)assert.ok(Math.abs(dmg(a)-dmg(b)*(r<=3?2:1))<=1);else assert.equal(a.turns.at(-1).first,r<=3?0:1);s=a;}const block=make(e);timer(block,0,'skillBlock');assert.equal(turn(block).fighters[0].effects[e.id===693?'id913':'id984'],undefined);}
});
test('3623 478与1284封属成功、后手条件、两回合到期和封招',()=>{
 for(const e of [...pick(478),...pick(1284)]){const opts={opponentEffect:pick(4)[0]},s=make(e,opts),o=turn(s,e.moveId,900023);assert.equal(o.fighters[1].stages.acc,0);let n=turn(o,IDLE,900023);assert.equal(n.fighters[1].stages.acc,0);n=turn(n,IDLE,900023);assert.equal(n.fighters[1].stages.acc,1);
 const late=make(e,{...opts,aStats:{spe:1}});late.moveDefinitions[key(900023)].priority=5;const l=turn(late,e.moveId,900023);assert.equal(l.fighters[1].stages.acc,1);if(e.id===1284)assert.equal(turn(l,IDLE,900023).fighters[1].stages.acc,2);
 timer(s,0,'skillBlock');assert.equal(turn(s,e.moveId,900023).fighters[1].stages.acc,1);}
});
test('3623 1003害怕60%或全属性减一、异常免疫补偿和免弱下限',()=>{
 const e=pick(1003)[0],yes=seedCase(e,o=>o.turns[0].events.some(x=>/陷入害怕/.test(x.text))),no=seedCase(e,o=>o.fighters[1].stages.atk===-1);assert.equal(yes.out.fighters[1].stages.atk,0);assert.deepEqual(Object.values(no.out.fighters[1].stages),Array(6).fill(-1));const im=make(e,{seed:yes.seed});timer(im,1,'免异常');assert.deepEqual(Object.values(turn(im).fighters[1].stages),Array(6).fill(-1));timer(im,1,'免弱');assert.deepEqual(Object.values(turn(im).fighters[1].stages),Array(6).fill(0));allStages(im,1,-6);assert.deepEqual(Object.values(turn(im).fighters[1].stages),Array(6).fill(-6));
});
test('3623 928两实例消回合成功才获得一次免疫并消费',()=>{
 for(const e of pick(928)){const s=make(e);timer(s,1,'id913',{bonus:1});let o=turn(s);assert.equal(o.fighters[1].effects.id913,undefined);assert.equal(o.fighters[0].counts.immune,1);o.rng=8;const n=turn(o,IDLE,FEAR);assert.equal(n.fighters[0].counts.immune,0);assert.equal(n.fighters[0].ailments['麻痹'],undefined);n.rng=8;assert.ok(turn(n,IDLE,FEAR).fighters[0].ailments['麻痹']);assert.equal(turn(make(e)).fighters[0].counts.immune,undefined);const p=make(e);timer(p,1,'protect');timer(p,1,'id913',{bonus:1});assert.equal(turn(p).fighters[0].counts.immune,undefined);}
});
test('3623 697穿透限伤与699穿透免攻、独立边界和封招',()=>{
 for(const e of [...pick(697),...pick(699)]){const block=e.id===697?'攻击伤害上限':'鬼王攻击免疫',s=make(e);timer(s,1,block,{amount:1});const o=turn(s),b=make(e,{omit:true});timer(b,1,block,{amount:1});assert.ok(dmg(o)>1);assert.equal(dmg(turn(b)),e.id===697?1:0);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[1].hp,9000);}
});
test('3623 1867先手四分之一吸取和当回合零攻击、后手禁疗与残血',()=>{
 const e=pick(1867)[0],s=make(e,{hp:1000}),o=turn(s,e.moveId,HIT);assert.equal(o.fighters[0].hp,3250);assert.equal(9000-o.fighters[1].hp-dmg(o),2250);assert.ok(turn(o,IDLE,HIT).fighters[0].hp<3250);const late=make(e,{hp:1000,aStats:{spe:1}});assert.equal(9000-turn(late).fighters[1].hp-dmg(turn(late)),0);timer(s,0,'技能禁疗');assert.equal(turn(s,e.moveId,HIT).fighters[0].hp,1000);const low=make(e,{hp:1000,targetHp:10});assert.equal(turn(low).fighters[0].hp,1000);
});
