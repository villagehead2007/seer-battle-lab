'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {E,source,make,turn,sum,key}=require('./helpers/4696-battle.cjs');
function capped(){
 const move=source.moves.find(m=>m.id===28904),index=move.effectInstances.findIndex(e=>e.id===800);
 const s=make({move:move.id,index,bStats:{spa:9000}});turn(s,28904,28905);
 s.moveDefinitions[key(37679)].operations=[{effectId:31,phase:'beforeUse',params:[3,3],index:0}];
 s.moveDefinitions[key(37679)].power=300;return s;
}
test('4696真实800三段红伤共享300上限，到期恢复且非红不占额度',()=>{
 const s=capped();for(let r=2;r<=3;r++){
  turn(s,28905,37679);const events=s.damageEvents.filter(e=>e.round===r&&e.sourceSide===1&&e.type==='attack');
  assert.equal(events.length,3);assert.deepEqual(events.map(e=>e.settledDamage),[300,0,0]);assert.equal(sum(s,'attack',1),300);
 }
 turn(s,28905,37679);assert.ok(sum(s,'attack',1)>300);
});
test('4696真实800同回合另一次独立攻击重新有300额度，非红400不受限制',()=>{
 const s=capped(),old=E.SOULS;let extra=0;
 E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterUse'&&c.a.side===1){c.hurt(c.t,400,'独立固伤','fixed');c.typedAttack(100000,'普通');extra++;}}};
 try{turn(s,28905,37679);}finally{E.SOULS=old;}
 assert.equal(extra,1);assert.equal(sum(s,'attack',1),600);assert.equal(sum(s,'fixed',1),400);
});
