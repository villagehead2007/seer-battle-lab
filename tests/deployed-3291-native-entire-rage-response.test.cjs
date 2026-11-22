'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3291-native.cjs');
const rage=(s,round)=>s.turns.find(t=>t.round===round)?.events.some(e=>e.text.startsWith('A 方 星皇之怒判定')&&e.text.includes('：触发'));
// Entire-rage scope follows the direct human selection archived in USER-CONFIRMATION-STAR-RAGE-ENTIRE-NO-RESPONSE-2026-11-12.json.
test('3291原1094皇怒后续百分比按用户确认不触发原3242战霸反馈，储备留待普通攻击',()=>{
 let seen=0;for(let seed=1;seed<=12;seed++){
  let s=H.make(30376,{seed,extraMoves:[20530,10499],enemyId:3242,enemyMoves:[25183],aStages:{acc:6}});s=H.turn(s,20530,25183);assert.equal(s.fighters[1].counts.nextDamageReturn,2);
  s.fighters[0].effects.skillBlock={start:2,end:2};s=H.turn(s,30376);if(!rage(s,2))continue;seen++;
  assert.equal(H.damage(s,'percent'),3000);assert.equal(H.damage(s,'true',1),0);assert.equal(s.fighters[1].counts.nextDamageReturn,2);
  s=H.turn(s,10499);assert.ok(H.damage(s,'true',1)>0);assert.equal(s.fighters[1].counts.nextDamageReturn,undefined);
 }assert.ok(seen>0);
});

test('3291原1094皇怒后续百分比击败原3056也不触发魂410临终反击',()=>{
 let seen=0;for(let seed=1;seed<=12;seed++){
  const s=H.turn(H.make(30376,{seed,enemyId:3056,bHp:2000,aStages:{acc:6},aEffects:{skillBlock:{start:1,end:1}}}),30376);if(!rage(s,1))continue;seen++;
  assert.equal(H.damage(s,'percent'),3000);assert.equal(s.fighters[1].hp,0);assert.equal(H.damage(s,'true',1),0);assert.equal(s.fighters[0].hp,9000);
 }assert.ok(seen>0);
});
