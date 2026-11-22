'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3291-native.cjs');
const trigger=s=>s.turns[0].events.some(e=>e.text.includes('星皇之怒判定')&&e.text.includes('：触发'));
test('3291原皇怒不建立原4898教皇受击防御观察窗，普通攻击仍建立真实受击窗',()=>{
 let seen=0;
 for(let seed=1;seed<=8;seed++)for(const mode of ['rage','ordinary']){
  const s=H.turn(H.make(10499,{seed,enemyId:4898,aStages:{acc:6},aEffects:mode==='rage'?{skillBlock:{start:1,end:1}}:{}}),10499),t=s.fighters[1];
  assert.equal(t.soulId,2084);assert.equal(t.soulHash,'86e95364');
  const windows=t.soulState.pope4898?.uses??[];
  if(mode==='rage'&&trigger(s)){seen++;assert.equal(windows.length,0,'额外攻击不能登记对方防御受击窗口');assert.ok(s.damageEvents.some(e=>e.round===1&&e.sourceSide===0&&e.starRage622&&e.settledDamage>0));}
  if(mode==='ordinary'){assert.equal(windows.length,1);assert.equal(windows[0].moveId,10499);assert.equal(windows[0].attackerSide,0);}
 }
 assert.ok(seen>0);
});
