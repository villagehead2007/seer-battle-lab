'use strict';
// Independent effect instances. Passing these does not certify the random pools or soul versions.
const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3667-battle.cjs');
const {make,turn,wait,timer,pick,seedCase,IDLE,WAIT,HIT,FEAR,key,keys}=H;
const e=id=>pick(id)[0],damage=s=>s.fighters[0].lastAttackDamage??0;
const blocked=x=>{const s=make(x);timer(s,0,'skillBlock');return turn(s);};
// 雷祭的真实命中率为50%；用公共命中等级保证本组测试只测免疫/反弹。
const sureFear=s=>{s.fighters[1].stages.acc=6;s.rng=5;return s;};
// Effect 511/1242 consumes one random draw before the damage roll. The omitted
// reference advances that draw, so both cases use the same damage variance.
const afterDraw=seed=>(seed+0x6D2B79F5)>>>0;
function expectedRandomDamage(x,seed,powerFactor=1,multiplier=1,probabilityDraw=true){
 let v=probabilityDraw?afterDraw(afterDraw(seed)):afterDraw(seed),t=v;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);
 const roll=85+Math.floor(((t^t>>>14)>>>0)/4294967296*16),m=H.source.moves.find(m=>m.id===x.moveId),s=make(x);
 const base=Math.floor(Math.floor(42*m.power*powerFactor*180/300)/50)+2;
 const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);
 return Math.floor(base*stab*H.E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*multiplier*roll/100);
}

test('3667 4和5逐实例概率能力变化、上下限、免弱及封招',()=>{
 for(const x of [...pick(4),...pick(5)]){
  const side=x.id===4?0:1,k=keys[x.params[0]],n=x.params[2];
  const yes=seedCase(x,o=>o.fighters[side].stages[k]===n);assert.equal(yes.out.fighters[side].stages[k],n);
  if(x.params[1]<100)assert.equal(seedCase(x,o=>o.fighters[side].stages[k]===0).out.fighters[side].stages[k],0);
  assert.equal(blocked(x).fighters[side].stages[k],0);
  const cap=make(x,{seed:yes.seed});cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
  if(side===1){const im=make(x,{seed:yes.seed});timer(im,1,'免弱');assert.equal(turn(im).fighters[1].stages[k],0);}
 }
});

test('3667 3和63清除或反馈负面等级、保留正面与免弱边界',()=>{
 for(const id of [3,63]){
  const x=e(id),s=make(x);s.fighters[0].stages.atk=-2;s.fighters[0].stages.acc=-6;s.fighters[0].stages.def=3;
  const out=turn(s);assert.equal(out.fighters[0].stages.atk,0);assert.equal(out.fighters[0].stages.acc,0);assert.equal(out.fighters[0].stages.def,3);
  assert.equal(out.fighters[1].stages.atk,id===63?-2:0);assert.equal(out.fighters[1].stages.acc,id===63?-6:0);
  assert.deepEqual(turn(make(x)).fighters[1].stages,make(x).fighters[1].stages);
  const no=structuredClone(s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[0].stages.atk,-2);
  const im=structuredClone(s);timer(im,1,'免弱');const io=turn(im);assert.equal(io.fighters[1].stages.atk,0);assert.equal(io.fighters[0].stages.atk,0);
 }
});

test('3667 22疲惫明确两回合、控制不扣PP、到期与免疫反弹',()=>{
 const x=e(22),s=turn(make(x),x.moveId,HIT);assert.equal(s.fighters[1].ailments['疲惫'],2);assert.equal(s.fighters[1].pp[key(HIT)],99);
 const second=turn(s,IDLE,HIT);assert.equal(second.fighters[1].pp[key(HIT)],99);
 const third=turn(second,IDLE,HIT);assert.equal(third.fighters[1].pp[key(HIT)],98);assert.ok(third.fighters[0].hp<9000);
 const im=make(x);im.fighters[1].counts.immune=1;const io=turn(im,x.moveId,HIT);assert.equal(io.fighters[1].ailments['疲惫'],undefined);assert.equal(io.fighters[1].counts.immune,0);assert.ok(io.fighters[0].hp<9000);
 const refl=make(x);timer(refl,1,'reflect');const ro=turn(refl);assert.equal(ro.fighters[1].ailments['疲惫'],undefined);assert.equal(ro.fighters[0].ailments['疲惫'],2);
 assert.equal(blocked(x).fighters[1].ailments['疲惫'],undefined);
});

test('3667 33和1099消强保留负面、成功授予一次免控并消费',()=>{
 for(const id of [33,1099]){
  const x=e(id),s=make(x);s.fighters[1].stages.atk=6;s.fighters[1].stages.def=-2;
  let o=turn(s);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].stages.def,-2);assert.equal(o.fighters[0].counts.immune??0,id===1099?1:0);
  assert.equal(turn(make(x)).fighters[0].counts.immune??0,0);
  const no=structuredClone(s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[1].stages.atk,6);
  if(id===1099){o=turn(sureFear(o),IDLE,FEAR);assert.equal(o.fighters[0].ailments['麻痹'],undefined);assert.equal(o.fighters[0].counts.immune,0);o=turn(sureFear(o),IDLE,FEAR);assert.ok(o.fighters[0].ailments['麻痹']>=3);}
 }
});

test('3667 585两组强化向量、封招及正六级截断',()=>{
 for(const x of pick(585)){
  assert.deepEqual(keys.map(k=>turn(make(x)).fighters[0].stages[k]),x.params);
  assert.deepEqual(keys.map(k=>blocked(x).fighters[0].stages[k]),[0,0,0,0,0,0]);
  const cap=make(x);keys.forEach(k=>cap.fighters[0].stages[k]=6);assert.deepEqual(keys.map(k=>turn(cap).fighters[0].stages[k]),[6,6,6,6,6,6]);
  const neg=make(x);keys.forEach(k=>neg.fighters[0].stages[k]=-1);assert.deepEqual(keys.map(k=>turn(neg).fighters[0].stages[k]),x.params.map(n=>n-1));
 }
});

test('3667 77和57用招回复真实体力、期限、受控禁疗与上限',()=>{
 for(const id of [77,57]){
  const x=e(id),n=id===77?180:3000,duration=x.params[0];let s=make(x,{hp:1000});
  for(let r=1;r<=duration+1;r++){s.fighters[0].hp=1000;s=r===1?turn(s):wait(s);assert.equal(s.fighters[0].hp,1000+(r<=duration?n:0));}
  const cap=turn(make(x,{hp:8999}));assert.equal(cap.fighters[0].hp,9000);
  const ban=make(x,{hp:1000});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);
  const control=turn(make(x,{hp:1000}));control.fighters[0].ailments['疲惫']=9;control.fighters[0].hp=1000;assert.equal(wait(control).fighters[0].hp,1000);
  const no=make(x,{hp:1000});timer(no,0,'skillBlock');assert.equal(turn(no).fighters[0].hp,1000);
 }
});

test('3667 433和448回合能力变化、期限、限幅及免弱',()=>{
 for(const id of [433,448]){
  const x=e(id),side=id===433?0:1,vector=x.params.slice(1);let s=make(x);
  for(let r=1;r<=4;r++){s=r===1?turn(s):wait(s);assert.deepEqual(keys.map(k=>s.fighters[side].stages[k]),vector.map(n=>Math.max(-6,Math.min(6,n*Math.min(3,r)))));}
  assert.deepEqual(keys.map(k=>blocked(x).fighters[side].stages[k]),[0,0,0,0,0,0]);
  const cap=make(x);keys.forEach(k=>cap.fighters[side].stages[k]=id===433?6:-6);assert.deepEqual(keys.map(k=>turn(cap).fighters[side].stages[k]),keys.map(()=>id===433?6:-6));
  if(id===448){const im=make(x);timer(im,1,'免弱');assert.deepEqual(keys.map(k=>turn(im).fighters[1].stages[k]),[0,0,0,0,0,0]);}
 }
});

test('3667 619和843下一回合起改变先制、真实行动顺序和到期',()=>{
 for(const id of [619,843]){
  const x=e(id),side=id===619?1:0,amount=id===619?-1:2;
  let s=turn(make(x,{aStats:{spe:1}}));assert.deepEqual(s.fighters[side].effects.id984,{start:2,end:3,amount});
  for(let r=2;r<=4;r++){s=turn(s,IDLE,HIT);assert.equal(s.turns.at(-1).first,r<=3?0:1);}
  assert.equal(blocked(x).fighters[side].effects.id984,undefined);
 }
});

test('3667 1167实际解弱回满、无负面不触发与禁疗',()=>{
 const x=e(1167),s=make(x,{hp:1000});s.fighters[0].stages.spa=-6;s.fighters[0].stages.spe=2;const o=turn(s);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[0].stages.spa,0);assert.equal(o.fighters[0].stages.spe,2);
 assert.equal(turn(make(x,{hp:1000})).fighters[0].hp,1000);
 const ban=structuredClone(s);timer(ban,0,'技能禁疗');const b=turn(ban);assert.equal(b.fighters[0].hp,1000);assert.equal(b.fighters[0].stages.spa,0);
 const no=structuredClone(s);timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[0].hp,1000);assert.equal(n.fighters[0].stages.spa,-6);
});

test('3667 726仅封下两回合对手先手攻击、后手和属性不封',()=>{
 const x=e(726);let s=turn(make(x,{aStats:{spe:1}}));assert.deepEqual(s.fighters[0].effects['对手先手攻击无效'],{start:2,end:3});
 for(let r=2;r<=4;r++){s.fighters[0].hp=9000;const pp=s.fighters[1].pp[key(HIT)];s=turn(s,IDLE,HIT);assert.equal(s.fighters[1].pp[key(HIT)],pp-1);if(r<=3)assert.equal(s.fighters[0].hp,9000);else assert.ok(s.fighters[0].hp<9000);}
 let late=turn(make(x));late=turn(late,IDLE,HIT);assert.ok(late.fighters[0].hp<9000);
 let status=turn(make(x,{aStats:{spe:1}}));status=turn(sureFear(status),IDLE,FEAR);assert.ok(status.fighters[0].ailments['麻痹']>=2);
 assert.equal(blocked(x).fighters[0].effects['对手先手攻击无效'],undefined);
});

test('3667 191两期限免控反弹、双向反弹终止与到期',()=>{
 for(const x of pick(191)){
  let s=turn(make(x));assert.deepEqual(s.fighters[0].effects.reflect,{start:1,end:x.params[0]});
  s=turn(sureFear(s),IDLE,FEAR);assert.equal(s.fighters[0].ailments['麻痹'],undefined);assert.ok(s.fighters[1].ailments['麻痹']>=2);
  for(let r=3;r<=x.params[0];r++)s=wait(s);s.fighters[1].ailments={};s=turn(sureFear(s),IDLE,FEAR);assert.ok(s.fighters[0].ailments['麻痹']>=x.params[0]+1);
  const double=turn(make(x));timer(double,1,'reflect');const o=turn(sureFear(double),IDLE,FEAR);assert.equal(o.fighters[0].ailments['麻痹'],undefined);assert.equal(o.fighters[1].ailments['麻痹'],undefined);
  assert.equal(blocked(x).fighters[0].effects.reflect,undefined);
 }
});

test('3667 683随机附加固定伤害两端、残血、免伤及封招',()=>{
 const x=e(683),seen=new Set();for(let seed=0;seed<4096&&seen.size<151;seed++){const o=turn(make(x,{seed}));const extra=9000-o.fighters[1].hp-damage(o);assert.ok(extra>=150&&extra<=300);seen.add(extra);}assert.equal(seen.size,151);
 const low=turn(make(x,{targetHp:1}));assert.equal(low.fighters[1].hp,0);assert.equal(blocked(x).fighters[1].hp,9000);
 const im=make(x);timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);
});

test('3667 494无视强化的伤害和顺序但不清除等级、不无视弱化',()=>{
 const x=e(494),s=make(x);s.fighters[1].stages.spd=6;s.fighters[1].stages.spe=6;
 const o=turn(s);assert.equal(o.fighters[1].stages.spd,6);assert.equal(o.fighters[1].stages.spe,6);assert.equal(damage(o),damage(turn(make(x))));
 const plain=make(x,{omit:true});plain.fighters[1].stages.spd=6;assert.ok(damage(o)>damage(turn(plain)));
 const weak=make(x);weak.fighters[1].stages.spd=-2;assert.ok(damage(turn(weak))>damage(o));assert.equal(damage(blocked(x)),0);
});

test('3667 1070仅对手负面时增加先制、实际顺序及负六边界',()=>{
 const x=e(1070);for(const n of [0,1,-1,-6]){const s=make(x,{aStats:{spe:1}});s.fighters[1].stages.def=n;const o=turn(s,x.moveId,HIT);assert.equal(o.turns.at(-1).first,n<0?0:1);}
});

test('3667 976消回合成功才封一次属性、攻击保留次数并实际消费',()=>{
 const x=e(976),s=make(x);timer(s,1,'攻击必中');s.fighters[1].stages.atk=2;
 let o=turn(s);assert.equal(o.fighters[1].effects['攻击必中'],undefined);assert.equal(o.fighters[1].stages.atk,2);assert.equal(o.fighters[1].counts.nextStatusInvalid,0); // 对手本回合WAIT已消费
 const later=make(x,{aStats:{spe:1}});timer(later,1,'攻击必中');o=turn(later);assert.equal(o.fighters[1].counts.nextStatusInvalid,1);
 o=turn(o,IDLE,HIT);assert.equal(o.fighters[1].counts.nextStatusInvalid,1);assert.ok(o.fighters[0].hp<9000);
 o=turn(sureFear(o),IDLE,FEAR);assert.equal(o.fighters[1].counts.nextStatusInvalid,0);assert.equal(o.fighters[0].ailments['麻痹'],undefined);
 o=turn(sureFear(o),IDLE,FEAR);assert.ok(o.fighters[0].ailments['麻痹']>=4);
 assert.equal(turn(make(x)).fighters[1].counts.nextStatusInvalid??0,0);assert.ok(blocked(x).fighters[1].hp===9000);
});

test('3667 408三回合定额减免攻击和粉伤、零下限与到期',()=>{
 const x=e(408);let s=turn(make(x,{bStats:{atk:3000}}),x.moveId,HIT),plain=turn(make(x,{omit:true,bStats:{atk:3000}}),x.moveId,HIT);
 assert.equal(s.fighters[0].hp-plain.fighters[0].hp,100);
 for(let r=2;r<=4;r++){s.fighters[0].hp=plain.fighters[0].hp=9000;s.rng=plain.rng=0;s=turn(s,IDLE,HIT);plain=turn(plain,IDLE,HIT);assert.equal(s.fighters[0].hp-plain.fighters[0].hp,r<=3?100:0);}
 assert.equal(turn(make(x),x.moveId,HIT).fighters[0].hp,9000);
 const pink=make(x,{opponentEffect:{moveId:32309,index:0}}); // 先制不造成粉伤；用持续固定伤害隔离共同扣血入口。
 timer(pink,0,'持续固定伤害',{amount:150});assert.equal(turn(pink).fighters[0].hp,8950);
 assert.equal(blocked(x).fighters[0].effects['伤害定额减免'],undefined);
});

test('3667 439仅自身异常或负面时五回合固定伤害、免伤和清除',()=>{
 const x=e(439);assert.equal(turn(make(x)).fighters[1].hp,9000);
 let s=make(x);s.fighters[0].stages.atk=-1;for(let r=1;r<=6;r++){s.fighters[1].hp=9000;s=r===1?turn(s):wait(s);assert.equal(s.fighters[1].hp,r<=5?8800:9000);}
 const ail=make(x);ail.fighters[0].ailments['中毒']=9;assert.equal(turn(ail).fighters[1].hp,8800);
 const im=make(x);im.fighters[0].stages.atk=-6;timer(im,1,'当回合免伤');assert.equal(turn(im).fighters[1].hp,9000);
 let clear=make(x);clear.fighters[0].stages.atk=-1;clear=turn(clear);clear.fighters[0].stages.atk=0;assert.equal(wait(clear).fighters[1].hp,8800);
 assert.equal(blocked(x).fighters[0].effects['异常弱化回合固伤'],undefined);
});

test('3667 511威力双倍概率、严格半血边界、成功失败及封招',()=>{
 const x=e(511);let specialSeed;
 for(let seed=0;seed<128;seed++){
  const high=turn(make(x,{seed,hp:4500})),low=turn(make(x,{seed,hp:4499})),normal=turn(make(x,{seed:afterDraw(seed),omit:true,hp:4500}));
  if(damage(high)===damage(normal)&&damage(low)>damage(normal)){specialSeed=seed;assert.equal(damage(low),expectedRandomDamage(x,seed,2));break;}
 }
 assert.notEqual(specialSeed,undefined);
 for(const hp of [4499,4500,9000]){
  const yes=seedCase(x,(o,s)=>damage(o)>damage(turn(make(x,{seed:afterDraw(s.rng),hp,omit:true}))),{hp});
  assert.equal(damage(yes.out),expectedRandomDamage(x,yes.seed,2));
  const no=seedCase(x,(o,s)=>damage(o)===damage(turn(make(x,{seed:afterDraw(s.rng),hp,omit:true}))),{hp});assert.equal(damage(no.out),expectedRandomDamage(x,no.seed));
 }
 assert.equal(damage(blocked(x)),0);
});

test('3667 1242失败累计概率并改三倍、成功重置及未命中保留',()=>{
 const x=e(1242),move=key(x.moveId);
 const fail=seedCase(x,o=>o.fighters[0].soulState.effect1242Boost?.[move]===25);
 const yes=seedCase(x,o=>!o.fighters[0].soulState.effect1242Boost?.[move]);
 assert.equal(damage(yes.out),expectedRandomDamage(x,yes.seed,1,2));
 let second;for(let seed=0;seed<128;seed++){const s=structuredClone(fail.out);s.rng=seed;const o=turn(s);if(o.fighters[0].soulState.effect1242Boost?.[move]===50){second=o;break;}}assert.ok(second);
 second.rng=0;
 const third=turn(second);assert.equal(third.fighters[0].soulState.effect1242Boost[move],undefined);
 assert.equal(damage(third),expectedRandomDamage(x,0,1,3,false)); // 概率达到100%时公共roll不消耗随机数
 const miss=structuredClone(fail.out);delete miss.fighters[0].effects['攻击必中'];timer(miss,0,'攻击必失');const missed=turn(miss);assert.equal(missed.fighters[0].soulState.effect1242Boost[move],25);assert.equal(missed.fighters[1].hp,miss.fighters[1].hp);
 assert.equal(blocked(x).fighters[0].soulState.effect1242Boost,undefined);
});

test('3667 681下两回合必中必暴真实伤害、起止窗口与失效消费',()=>{
 const x=e(681);let s=turn(make(x));assert.deepEqual(s.fighters[0].effects['必定暴击'],{start:2,end:3});assert.deepEqual(s.fighters[0].effects['攻击必中'],{start:2,end:3});
 for(let r=2;r<=4;r++){s.rng=0;const plain=structuredClone(s);delete plain.fighters[0].effects['必定暴击'];const o=turn(s,10250),p=turn(plain,10250);assert.ok(Math.abs(damage(o)-(r<=3?2:1)*damage(p))<=1);s=o;}
 const sure=turn(make(x));timer(sure,0,'攻击必失');assert.ok(damage(turn(sure,10250))>0);
 const sealed=turn(make(x));timer(sealed,0,'skillBlock');const out=turn(sealed,10250);assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(10250)],39);
 assert.equal(blocked(x).fighters[0].effects['必定暴击'],undefined);
});

test('3667 470四回合命中附加睡眠走公共控制、概率失败与免疫',()=>{
 const x=e(470),yes=seedCase(x,o=>o.fighters[1].ailments['睡眠']>=2),no=seedCase(x,o=>!o.turns[0].events.some(e=>e.text.includes('陷入睡眠')));
 assert.deepEqual(yes.out.fighters[0].effects['攻击附加异常'],{start:1,end:4,chance:30,ailment:'睡眠'});assert.equal(yes.out.fighters[1].pp[key(WAIT)],99);assert.equal(no.out.fighters[1].pp[key(WAIT)],98);
 const im=make(x,{seed:yes.seed});timer(im,1,'免异常');assert.equal(turn(im).fighters[1].ailments['睡眠'],undefined);
 const miss=make(x,{seed:yes.seed,hit:false});timer(miss,0,'攻击必失');assert.equal(turn(miss).fighters[0].effects['攻击附加异常'],undefined);
 let s=yes.out;for(let r=2;r<=4;r++){s.fighters[1].ailments={};s=wait(s);assert.equal(s.fighters[1].ailments['睡眠'],undefined);}
 assert.equal(s.fighters[0].effects['攻击附加异常'],undefined);assert.equal(blocked(x).fighters[1].ailments['睡眠'],undefined);
});

test('3667 2074伙伴技能实际调用公共池、两种过滤、时长刷新与免疫',()=>{
 const x=e(2074),safe=['麻痹','睡眠','害怕','疲惫','石化','失明'];let selected;
 for(let seed=0;seed<2048;seed++){
  const s=make(x,{seed}),o=turn(s),draws=o.randomStatusEvents.filter(e=>e.type==='draw');
  assert.equal(draws.length,2);assert.equal(new Set(draws.map(x=>x.id)).size,2);assert.ok(draws.every(x=>!['瘫痪','凝滞'].includes(x.name)&&x.duration>=2&&x.duration<=3));
  if(draws.some(x=>x.name==='中毒'&&x.duration===3)&&draws.some(x=>safe.includes(x.name))){selected={s,o};break;}
 }
 assert.ok(selected);const {s,o}=selected;assert.equal(o.fighters[1].ailments['中毒'],3);assert.equal(o.fighters[1].hp,7875);
 const old=structuredClone(s);old.fighters[1].ailments['中毒']=9;assert.equal(turn(old).fighters[1].ailments['中毒'],9);
 const short=structuredClone(s);short.fighters[1].ailments['中毒']=1;assert.equal(turn(short).fighters[1].ailments['中毒'],3);
 const immune=structuredClone(s);immune.fighters[1].counts.immune=2;const im=turn(immune);assert.deepEqual(im.fighters[1].ailments,{});assert.equal(im.fighters[1].counts.immune,0);assert.equal(im.randomStatusEvents.filter(x=>x.type==='draw').length,2);assert.equal(im.fighters[1].hp,9000);
 assert.equal(blocked(x).randomStatusEvents,undefined);
 // Full partner move: the same public pool coexists with reflection, sure crit
 // and per-use debuffs, without a separate species status/type implementation.
 const full=make({moveId:28684,index:null},{seed:s.rng}),all=turn(full);assert.equal(all.randomStatusEvents.filter(x=>x.type==='draw').length,2);assert.deepEqual(all.fighters[0].effects.reflect,{start:1,end:4});assert.deepEqual(all.fighters[0].effects['必定暴击'],{start:2,end:3});assert.equal(all.fighters[1].stages.spd,-1);assert.equal(all.fighters[1].stages.spe,-1);
});

test('3667 2074按用户规则施加白板魇昧并排除PVE山神守护',()=>{
 const x=e(2074),found=seedCase(x,o=>o.randomStatusEvents?.some(x=>x.name==='魇昧'&&x.type==='application'&&x.applied));assert.ok(found.out.randomStatusEvents.some(x=>x.type==='draw'&&x.name==='魇昧'));assert.ok(!found.out.randomStatusEvents.some(x=>x.name==='山神守护'));assert.ok(!found.out.pendingStatusBehaviors?.some(x=>x.name==='魇昧'));assert.ok(found.out.turns[0].events.some(x=>x.text.includes('魇昧')&&x.text.includes('陷入')));
});
