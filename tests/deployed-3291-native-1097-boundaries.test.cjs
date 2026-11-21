'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3291-native.cjs');
const rage=s=>s.turns[0].events.some(e=>e.text.startsWith('A 方 星皇之怒判定')&&e.text.includes('：触发'));

test('3291原1097主红严格279疲惫/280不疲惫，125整回合额度令额外攻击不得挪用或重复触发阈值',()=>{
 for(const cap of [279,280]){
  let s=H.turn(H.make(30380,{seed:14,aStats:{atk:9999},enemyMoves:[10086],bEffects:{攻击伤害上限:{start:1,end:1,amount:cap,global125RoundRed:true}}}),30380);
  const events=s.damageEvents.filter(e=>e.round===1&&e.sourceSide===0&&e.type==='attack'),main=events.find(e=>!e.starRage622);
  assert.equal(main.settledDamage,cap);assert.equal(H.damage(s,'attack'),cap);assert.equal(s.fighters[1].hp,9000-cap);
  assert.equal(!!s.fighters[1].ailments.疲惫,cap===279);assert.equal(s.fighters[1].effects.attackBlock.start,2);assert.equal(s.fighters[1].effects.attackBlock.end,2);
  if(cap===280){s=H.turn(s,'potion:pp',10086);assert.equal(H.damage(s,'attack',1),0);assert.equal(s.fighters[1].pp['wiki:10086'],s.moveDefinitions['wiki:10086'].pp-1);}
 }
});

test('3291原1097阈值按完整红伤280而非保命实际损血199；击败对手时不授封攻也不额外皇怒',()=>{
 for(const floor of [false,true]){
  const s=H.turn(H.make(30380,{seed:14,aStats:{atk:9999},bHp:200,bEffects:{攻击伤害上限:{start:1,end:1,amount:280,global125RoundRed:true},...(floor?{致命保留:{start:1,end:1,hp:1}}:{})}}),30380),main=s.damageEvents.find(e=>e.round===1&&e.sourceSide===0&&e.type==='attack'&&!e.starRage622);
  assert.equal(main.settledDamage,280);assert.equal(main.hpLoss,floor?199:200);assert.equal(s.fighters[1].hp,floor?1:0);assert.equal(s.fighters[1].ailments.疲惫,undefined);
  assert.equal(!!s.fighters[1].effects.attackBlock,floor);if(!floor)assert.equal(s.turns[0].events.some(e=>e.text.startsWith('A 方 星皇之怒判定')),false);
 }
});

test('3291原1097皇怒实际失明成功不封属，随机未触发则封属，先手两回与后手延后一回',()=>{
 for(const late of [false,true]){const seen=new Set();for(let seed=1;seed<=24;seed++){
  const s=H.turn(H.make(30380,{seed,enemyMoves:[10086],aStats:{spe:late?1:9999}}),30380,10086);if(!rage(s))continue;
  const t=s.fighters[1],blind=!!t.ailments.失明;seen.add(blind);assert.equal(!!t.effects.statusBlock,!blind);
  if(!blind){assert.equal(t.effects.statusBlock.start,1);assert.equal(t.effects.statusBlock.end,late?3:2);}
 }assert.deepEqual(seen,new Set([true,false]));}
});

test('3291原1097皇怒后续失明按用户确认无视原星皇之佑，随机失败封属按真实行动到期',()=>{
 for(const late of [false,true]){let s;const seen=new Set();
  for(let seed=1;seed<=24;seed++){const out=H.turn(H.make(30380,{seed,enemyId:3291,enemyMoves:[20530],aStats:{spe:late?1:9999}}),30380,20530);if(rage(out)){const blind=!!out.fighters[1].ailments.失明;seen.add(blind);assert.equal(!!out.fighters[1].effects.statusBlock,!blind);if(!blind)s??=out;}}
  assert.deepEqual(seen,new Set([true,false]));assert.ok(s);assert.equal(s.fighters[1].soulId,622);assert.equal(s.fighters[1].soulHash,'2f1e3f2');assert.equal(s.fighters[1].ailments.失明,undefined);assert.ok(s.fighters[1].effects.statusBlock);
  const initialRank=s.fighters[1].stages.acc;for(let round=2;round<=4;round++){s=H.turn(s,'potion:pp',20530);assert.equal(s.fighters[1].stages.acc,initialRank+Math.max(0,round-(late?3:2)));}
 }
});
