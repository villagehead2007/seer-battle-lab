'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3482-native.cjs');
test('3482原792两真实版本回初高体仅红翻倍、等低体不倍；原攻击储存下次封属，药剂保留且一次消费后真实属性恢复',()=>{
 const status=H.enemy.moves.find(m=>m.kind==='status'&&m.effectInstances.length===1&&m.effectInstances[0].id===4&&m.effectInstances[0].args[1]===100);assert.ok(status,'真实对手单项强化属性技能');
 for(const source of H.versions){
  const rounds=[6000,5000,4000].map(hp=>H.turn(H.make(source,{hp,enemyHp:5000}))),reds=rounds.map(s=>H.sum(s,'attack'));
  assert.ok(reds.every(n=>n>0));assert.equal(reds[1],reds[2]);assert.ok(Math.abs(reds[0]-2*reds[1])<=1,'整数伤害取整后的二倍边界');assert.equal(H.E.SOULS.trait(rounds[0].fighters[0],'damageMultiplier'),2);assert.equal(H.E.SOULS.trait(rounds[1].fighters[0],'damageMultiplier'),1);assert.equal(H.E.SOULS.trait(rounds[2].fighters[0],'damageMultiplier'),1);
  let s=H.turn(H.make(source,{hp:6000,enemyHp:5000,enemyMoves:[status.id]}));assert.equal(s.fighters[1].counts.nextStatusInvalid,1,'对手药剂不消费封属');const firstPP=s.fighters[1].pp['wiki:'+status.id],k=H.keys[status.effectInstances[0].args[0]],amount=status.effectInstances[0].args[2];
  s=H.turn(s,'potion:pp',status.id);assert.equal(s.fighters[1].pp['wiki:'+status.id],firstPP-1);assert.equal(s.fighters[1].stages[k],0,'原属性已实际扣PP但被封无强化');assert.equal(s.fighters[1].counts.nextStatusInvalid,0);
  s=H.turn(s,'potion:pp',status.id);assert.equal(s.fighters[1].pp['wiki:'+status.id],firstPP-2);assert.equal(s.fighters[1].stages[k],amount,'储备只消费一次，后续真实原属性恢复');
 }
});
