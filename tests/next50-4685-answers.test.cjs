'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {E,source,make,turn,sum,key}=require('./helpers/4685-battle.cjs');
function capped(){
  const move=source.moves.find(m=>m.effectIds.includes(798)),index=move.effectInstances.findIndex(e=>e.id===798);
  const s=make({move:move.id,index,bStats:{atk:1000}});s.fighters[1].stages.acc=1;
  turn(s,move.id,28865);assert.equal(s.fighters[1].effects['攻击输出上限'].amount,300);
  // Synthetic valid effect31 three-hit probe exercises the cap; source data is unchanged.
  s.moveDefinitions[key(37618)].operations=[{effectId:31,phase:'beforeUse',params:[3,3],index:0}];
  s.moveDefinitions[key(37618)].power=300;return s;
}
test('4685真实798三段攻击共享300上限，每次攻击重置并在到期后恢复',()=>{
  const s=capped();for(let r=2;r<=3;r++){
    turn(s,28865,37618);const events=(s.damageEvents??[]).filter(e=>e.round===r&&e.sourceSide===1&&e.type==='attack');
    assert.equal(events.length,3);assert.equal(sum(s,'attack',1),300);
    assert.equal(events[0].settledDamage,300);assert.equal(events[1].settledDamage,0);assert.equal(events[2].settledDamage,0);
  }
  turn(s,28865,37618);assert.ok(sum(s,'attack',1)>300);
});
test('4685真实798同回合另一次独立攻击另有300上限，不误按全回合累计',()=>{
  const s=capped(),old=E.SOULS;let extra=0;
  E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterUse'&&c.a.side===1){c.typedAttack(100000,'普通');extra++;}}};
  try{turn(s,28865,37618);}finally{E.SOULS=old;}
  assert.equal(extra,1);assert.equal(sum(s,'attack',1),600);
});
