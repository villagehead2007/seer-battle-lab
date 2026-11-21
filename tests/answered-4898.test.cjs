'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/remaining-4898.cjs'),{E,key,make,turn,timer,sum}=H,S=require('../dist/shield-rules.js');
function observe(fn,run){const old=E.SOULS;E.SOULS={...old,run(e,c){old.run(e,c);fn(e,c);}};try{return run();}finally{E.SOULS=old;}}
test('4898已答归信：非教皇信仰对象的暴击由教皇抵挡并改信教皇，已信教皇不再抵挡；暴击零红不误触四分一回血',()=>{
 for(const faith of[undefined,1,0]){const s=make({move:20276,index:-1,soul:true,hp:1000});(s.fighters[1].statusState??={}).faithSourceSide=faith;timer(s,1,'必定暴击');turn(s,20276,10127);const st=s.fighters[0].soulState.pope4898,blocked=st.uses.filter(e=>e.blocked>0);if(faith===0){assert.equal(blocked.length,0);assert.ok(sum(s,'attack',1)>0);assert.equal(s.fighters[0].hp,1000-sum(s,'attack',1));}else{assert.equal(blocked.length,1);assert.equal(sum(s,'attack',1),0);assert.equal(s.fighters[0].hp,1000);assert.equal(s.fighters[1].statusState.faithSourceSide,0);assert.equal(sum(s,'percent'),blocked[0].blocked);}assert.equal(st.opponentCritRound,1);assert.equal(s.fighters[1].ailments['狂信'],undefined);}
});
test('4898已答最终量：完整技能多段共享抵挡资格，盾和减伤及其他免疫先算，按每次技能最终抵挡量附粉；不是理论量或HP损失',()=>{
 const abilities=E.SOULS.registry[2084].abilities,original=abilities.block;
 for(const mode of['normal','reduction-shield','immune','full-shield']){const create=()=>{const s=make({move:20276,index:-1,soul:true,hp:8000,enemyLoadout:[10713,20117,10127,20309,37911]});timer(s,1,'必定暴击');if(mode==='reduction-shield'){timer(s,0,'额外攻击减伤',{fraction:.5});timer(s,0,'伤害定额减免',{amount:1});S.refresh(s.fighters[0],10,'pope-test-shield');S.refreshBarrier(s.fighters[0],20,'pope-test-barrier');}if(mode==='immune')timer(s,0,'攻击伤害免疫');if(mode==='full-shield')S.refresh(s.fighters[0],10000,'pope-test-full');return s;};const a=create(),b=create();turn(a,20276,10713);try{abilities.block=(c,use)=>{original(c,use);return Math.max(0,c.amount);};turn(b,20276,10713);}finally{abilities.block=original;}const st=a.fighters[0].soulState.pope4898,use=st.uses[0],expected=sum(b,'attack',1);assert.ok(use.segments.length>=2);assert.equal(use.blocked,expected);assert.equal(sum(a,'attack',1),0);assert.equal(a.fighters[0].hp,8000);assert.equal(sum(a,'percent'),expected);if(expected>0){assert.equal(a.fighters[1].statusState.faithSourceSide,0);assert.equal(st.events.filter(e=>e.event==='retaliation').length,1);}else{assert.equal(a.fighters[1].statusState?.faithSourceSide,undefined);assert.equal(st.events.filter(e=>e.event==='retaliation').length,0);}if(mode==='reduction-shield'){assert.equal(S.sourceValue(a.fighters[0],'pope-test-shield'),S.sourceValue(b.fighters[0],'pope-test-shield'));assert.equal(S.barrierSourceValue(a.fighters[0],'pope-test-barrier'),S.barrierSourceValue(b.fighters[0],'pope-test-barrier'));}}
 const low=make({move:20276,index:-1,soul:true,hp:1});timer(low,1,'必定暴击');turn(low,20276,10127);const blocked=low.fighters[0].soulState.pope4898.uses[0].blocked;assert.ok(blocked>1);assert.equal(low.fighters[0].hp,1);assert.equal(sum(low,'percent'),blocked);
});
test('4898已答整次技能：真实星皇额外攻击另开一次，首次归信后后续暴击正常承伤；抵挡统计不并入下一次技能',()=>{
 const emperor=require('../local-species.cjs').species(3291);
 const ids=[30376,25294,25295,30380,30381],seen=new Set();
 for(let seed=1;seed<=16;seed++){
  const s=make({move:20276,index:-1,soul:true,enemySource:emperor,enemyLoadout:ids,enemySoul:true,seed:Math.imul(seed,0x9e3779b1)>>>0});
  timer(s,1,'必定暴击');
  turn(s,20276,30380);
  const state=s.fighters[0].soulState.pope4898;
  const received=s.damageEvents.filter(e=>e.type==='attack'&&e.targetSide===0);
  const normal=received.filter(e=>!e.starRage622),rage=received.filter(e=>e.starRage622);
  assert.equal(normal.length,1);
  assert.equal(normal[0].settledDamage,0);
  assert.equal(state.uses.length,1);
  assert.equal(state.uses[0].eligibleAtStart,true);
  assert.ok(state.uses[0].blocked>0);
  assert.equal(s.fighters[1].statusState.faithSourceSide,0);
  assert.deepEqual(state.events.filter(e=>e.event==='retaliation').map(e=>e.amount),[state.uses[0].blocked]);
  seen.add(rage.length);
  assert.equal(sum(s,'attack',1),rage.reduce((total,event)=>{
   assert.ok(event.settledDamage>0);
   return total+event.settledDamage;
  },0));
 }
 assert.deepEqual([...seen].sort(),[0,1]);
});
test('4898已答1689：本次非暴击结束立即回全PP2并削敌全PP1，当前暴击不执行；零红仍执行、PP保护和回复封锁分别生效',()=>{
 for(const mode of['normal','crit','zero','protect','restore-blocked']){const s=make({move:38374,index:2});s.fighters[0].pp[key(38374)]=2;for(const k of s.fighters[0].moves.filter(k=>k!==key(38374)))s.fighters[0].pp[k]=Math.max(0,s.moveDefinitions[k].pp-2);for(const k of s.fighters[1].moves)s.fighters[1].pp[k]=5;if(mode==='crit')timer(s,0,'必定暴击');if(mode==='zero')timer(s,1,'攻击伤害免疫');if(mode==='protect')timer(s,1,'PP保护');if(mode==='restore-blocked'){timer(s,1,'机械领域',{fraction:.6});s.fighters[1].soulState.bedPartnerPP=true;}let checked=false;observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1){assert.equal(c.t.pp[key(38374)],['crit','restore-blocked'].includes(mode)?1:3);for(const k of c.a.moves)assert.equal(c.a.pp[k],(['crit','protect'].includes(mode)?5:4)-(k===key(20117)?1:0));checked=true;}},()=>turn(s,38374,20117));assert.equal(checked,true);assert.equal(s.fighters[1].pp[key(20117)],['crit','protect'].includes(mode)?4:3);assert.ok(Number.isFinite(s.fighters[1].hp));}
});
