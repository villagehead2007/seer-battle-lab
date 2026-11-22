'use strict';
const assert=require('node:assert/strict');
const {make,turn}=require('./round68-3407-drain-ban-native.cjs');
function healingBan(which=[3407,4586,4748,4942]){
 const xs=[];
 for(const [id,move] of [[3407,29361],[4586,28535],[4748,37879],[4942,29445]].filter(([id])=>which.includes(id))){
  const o=make({id,move,hp:1,enemyId:3322,enemyMoves:[10016],enemyHP:5000,enemyStats:{maxHp:9000,atk:3000,spa:3000}});
  const defender=o.s.fighters[1];
  defender.effects.固定百分比免疫={start:1,end:1};
  defender.effects.免异常={start:1,end:4};
  const key=id===4748?'超算全禁疗':'回复效果削减';
  const window=id===4748?{start:1,end:2}:{start:1,end:2,fraction:1,sourceEffect:2093};
  for(let round=1;round<=2;round++){
   const pp=o.s.fighters[1].pp['wiki:10016'],beforeHP=o.s.fighters[1].hp;
   turn(o,round===1?move:'potion:pp',10016);
   const target=o.s.fighters[1];
   const red=(o.s.damageEvents??[]).filter(e=>e.round===round&&e.sourceSide===1&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);
   assert.ok(red>=2,JSON.stringify({id,move,round,red}));
   const hpBeforeAttack=round===1?o.atUse.enemyHP:beforeHP;
   assert.ok(hpBeforeAttack>0);
   assert.equal(target.hp,hpBeforeAttack,'受限时实际攻击未回血 '+id);
   assert.equal(target.pp['wiki:10016'],pp-1);
   assert.deepEqual(target.effects[key],round===1?window:undefined);
  }
  const before=o.s.fighters[1].hp;
  turn(o,'potion:pp',10016);
  const expiredActualHeal=o.s.fighters[1].hp-before;
  assert.ok(expiredActualHeal>0);
  xs.push({id,move,actualBlockedHealCount:2,windowStart:1,windowEnd:2,expiredActualHeal});
 }
 return xs;
}
module.exports=healingBan;
