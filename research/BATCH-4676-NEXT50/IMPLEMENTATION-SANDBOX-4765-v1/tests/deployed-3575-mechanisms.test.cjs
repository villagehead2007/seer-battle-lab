'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const H=require('./helpers/3575-battle.cjs');
const {make,turn,wait,timer,pick,IDLE,WAIT,FEAR,key}=H;

test('3575 1006免疫在下一回合行动前生效，不追溯保护施放回合',()=>{
  const e=pick(1006)[0],s=make(e,{aStats:{atk:2000,spe:1},bStats:{spe:999}});
  timer(s,1,'伤害上限',{amount:301},1);const next=turn(s);
  assert.deepEqual(next.fighters[0].effects['免异常'],{start:2,end:2});
  next.rng=1;const protectedState=turn(next,IDLE,FEAR);
  assert.equal(protectedState.turns.at(-1).first,1);assert.deepEqual(protectedState.fighters[0].ailments,{});
  assert.equal(protectedState.fighters[0].pp[key(IDLE)],98);
  assert.equal(protectedState.fighters[0].effects['免异常'],undefined);
  const current=make(e,{aStats:{atk:2000},seed:1});timer(current,0,'id984',{amount:5},1);timer(current,1,'伤害上限',{amount:301},1);
  const unprotected=turn(current,e.moveId,FEAR);assert.equal(unprotected.turns[0].first,0);
  assert.ok(unprotected.fighters[0].ailments['害怕']>=2,'下一回合免疫不阻止施放当回合的异常');
});

test('3575 58必暴与702回血联动，非必中暴击无效和禁疗优先阻止回血',()=>{
  const e={moveId:23812,index:null},s=turn(make(e,{hp:1000}));assert.equal(s.fighters[0].hp,1250);
  const good=turn(s,10234);assert.equal(good.fighters[0].hp,9000);assert.ok(good.fighters[0].lastAttackDamage>0);
  const invalid=structuredClone(s);timer(invalid,1,'非必中暴击无效');
  const stopped=turn(invalid,10234);assert.equal(stopped.fighters[0].hp,1250);assert.equal(stopped.fighters[1].hp,9000);assert.equal(stopped.fighters[0].lastAttackDamage,0);
  const inherentHit=turn(invalid,31835);assert.equal(inherentHit.fighters[0].hp,9000);assert.ok(inherentHit.fighters[0].lastAttackDamage>0,'原生必中攻击不受非必中暴击无效影响');
  const noHeal=structuredClone(s);timer(noHeal,0,'技能禁疗');const no=turn(noHeal,10234);assert.ok(no.fighters[0].lastAttackDamage>0);assert.equal(no.fighters[0].hp,1250);
});

test('3575 非必中暴击无效不冒充普通命中，也不能触发732或1330',()=>{
  const s=make({moveId:31834,index:null});timer(s,0,'必定暴击');timer(s,1,'非必中暴击无效');
  const o=turn(s);assert.equal(o.fighters[1].hp,9000);assert.equal(o.fighters[0].stages.atk,0);
  assert.equal(o.fighters[0].counts.nextCrit??0,0);assert.equal(o.fighters[0].soulState.dragonEaterStacks??0,0);
  assert.equal(o.fighters[0].pp[key(31834)],4);
});

test('3575 731被清除或到期时只取消自身额度，不吞掉其他必暴次数',()=>{
  const e=pick(731)[0],s=make(e,{opponentEffect:pick(180)[0]});timer(s,0,'必定暴击',{},1);const prepared=turn(s);
  assert.equal(prepared.fighters[0].counts.nextCrit,1);prepared.fighters[0].counts.nextCrit++;
  const ordinary=structuredClone(prepared);ordinary.fighters[0].counts.nextCrit=1;
  const a=turn(prepared,10234,900023),b=turn(ordinary,10234,900023);
  assert.equal(a.fighters[0].effects['其他攻击必暴'],undefined);assert.equal(a.fighters[0].counts.nextCrit,0);
  assert.ok(a.fighters[0].lastAttackDamage>=2*b.fighters[0].lastAttackDamage);
  const expired=wait(prepared);assert.equal(expired.fighters[0].counts.nextCrit,1);assert.equal(expired.fighters[0].soulState.otherCritReserved,0);
});

test('3575 邪龙之噬逐次消费，一层只提升一次攻击先制且属性或控制不消费',()=>{
  const s=make({moveId:10234,index:null},{hp:1000,aStats:{spe:1},bStats:{spe:999}});s.fighters[0].soulState.dragonEaterStacks=2;
  const idle=wait(s);assert.equal(idle.fighters[0].soulState.dragonEaterStacks,2);assert.equal(idle.turns[0].first,1);
  let x=idle;for(let remaining=1;remaining>=0;remaining--){const hp=x.fighters[0].hp,enemy=x.fighters[1].hp;x=turn(x,10234);const drain=enemy-x.fighters[1].hp-x.fighters[0].lastAttackDamage;
    assert.equal(x.turns.at(-1).first,0);assert.equal(x.fighters[0].soulState.dragonEaterStacks,remaining);assert.ok(drain>=150&&drain<=300);assert.equal(x.fighters[0].hp,hp+drain);}
  const hp=x.fighters[0].hp;x=turn(x,10234);assert.equal(x.turns.at(-1).first,1);assert.equal(x.fighters[0].hp,hp);
  const controlled=structuredClone(s);controlled.fighters[0].ailments['疲惫']=1;const stopped=turn(controlled,10234);assert.equal(stopped.fighters[0].soulState.dragonEaterStacks,2);assert.equal(stopped.fighters[0].pp[key(10234)],40);
});

test('3575 邪龙之噬实际吸取按残血截断、禁疗不回复、免伤无吸取',()=>{
  const e={moveId:10234,index:null};
  const low=make(e,{hp:1000,targetHp:20});low.fighters[0].soulState.dragonEaterStacks=1;const a=turn(low);
  assert.equal(a.fighters[0].lastAttackDamage,19);assert.equal(a.fighters[1].hp,0);assert.equal(a.fighters[0].hp,1001);
  const blocked=make(e,{hp:1000});blocked.fighters[0].soulState.dragonEaterStacks=1;timer(blocked,0,'技能禁疗');const b=turn(blocked);
  assert.equal(b.fighters[0].hp,1000);const drain=9000-b.fighters[1].hp-b.fighters[0].lastAttackDamage;assert.ok(drain>=150&&drain<=300);assert.equal(b.fighters[0].soulState.dragonEaterStacks,0);
  const immune=make(e,{hp:1000});immune.fighters[0].soulState.dragonEaterStacks=1;timer(immune,1,'当回合免伤');const c=turn(immune);assert.equal(c.fighters[1].hp,9000);assert.equal(c.fighters[0].hp,1000);assert.equal(c.fighters[0].soulState.dragonEaterStacks,0);
});

test('3575 邪龙攻击失误消费本次层数且不吸取，新获得层数不能用于本次攻击',()=>{
  const miss=make({moveId:10234,index:null},{hp:1000,hit:false});miss.fighters[0].soulState.dragonEaterStacks=1;timer(miss,0,'攻击必失');const a=turn(miss);
  assert.equal(a.fighters[1].hp,9000);assert.equal(a.fighters[0].hp,1000);assert.equal(a.fighters[0].soulState.dragonEaterStacks,0);
  for(const e of pick(1330)){const s=make(e,{hp:1000}),o=turn(s);assert.equal(o.fighters[0].soulState.dragonEaterStacks,2);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[1].hp,9000-o.fighters[0].lastAttackDamage);}
});

test('3575 2462消费全部邪龙之噬后不残留攻击先制或吸取',()=>{
  const s=make(pick(2462)[0],{hp:1000,aStats:{spe:1},bStats:{spe:999}});s.fighters[0].soulState.dragonEaterStacks=3;
  const o=turn(s);assert.equal(o.fighters[0].soulState.dragonEaterStacks,0);assert.deepEqual(o.fighters[0].soulState.dragonScales,{blue:true,gold:true,black:true});
  const a=turn(o,10234);assert.equal(a.turns.at(-1).first,1);assert.equal(a.fighters[0].hp,1000);assert.equal(o.fighters[1].hp-a.fighters[1].hp,a.fighters[0].lastAttackDamage);
});

test('3575 849再次施放每回合仅吸取三项，不在旧buff与新注册之间重复执行',()=>{
  let s=turn(make(pick(849)[0]));assert.equal(Object.values(s.fighters[0].stages).reduce((a,b)=>a+b,0),3);
  s=turn(s);assert.equal(Object.values(s.fighters[0].stages).reduce((a,b)=>a+b,0),6);assert.equal(Object.values(s.fighters[1].stages).reduce((a,b)=>a+b,0),-6);
  s=wait(s);assert.equal(Object.values(s.fighters[0].stages).reduce((a,b)=>a+b,0),9);
});
