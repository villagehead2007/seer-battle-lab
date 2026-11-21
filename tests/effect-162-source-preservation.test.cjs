'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),factory=require('./helpers/remaining-battle.cjs'),A=factory(require('../research/BATCH-4816-REMAINING/4854/snapshot.json')),B=factory(require('../research/BATCH-4816-REMAINING/4909/snapshot.json'));
test('162已答4854精确38205版本：运行态仅revision仍按异常附固定300，无异常或免固定不附实际固定伤害',()=>{
 for(const mode of ['none','poison','paralysis','immune','expired']){
  const s=A.make({move:38205,index:2}),f=s.fighters[1],before=f.hp;
  assert.equal(s.moveDefinitions[A.key(38205)].hash,undefined);
  assert.equal(s.moveDefinitions[A.key(38205)].revision,'seerapi:28b9a548');
  if(mode==='poison'||mode==='immune')f.ailments['中毒']=3;
  if(mode==='paralysis')f.ailments['麻痹']=3;
  if(mode==='expired')f.ailments['中毒']=0;
  if(mode==='immune')A.timer(s,1,'固定百分比免疫');
  const expected=mode==='poison'||mode==='paralysis'?300:0;
  A.turn(s,38205,20117);
  assert.equal(s.round,2,mode);
  assert.equal(A.sum(s,'fixed'),expected,mode);
  assert.equal(A.sum(s,'percent'),0,mode);
  assert.equal(A.sum(s,'true'),0,mode);
  const packets=s.damageEvents.filter(e=>e.sourceSide===0&&e.targetSide===1&&e.type==='fixed');
  assert.equal(packets.reduce((n,e)=>n+e.hpLoss,0),expected,mode);
  if(mode!=='poison')assert.equal(before-s.fighters[1].hp,A.sum(s)+expected+(mode==='immune'?Math.floor(f.stats.maxHp/8):0),mode+' actual target HP');
  else assert.ok(before-s.fighters[1].hp>=A.sum(s)+expected,'poison retains its independent round-end damage');
 }
});
test('162精确4909仍附固定100并受固定免疫，已答4854固定300独立保留且错hash错参数继续拒绝',()=>{
 for(const immune of [false,true]){
  const s=B.make({move:34543,index:0});s.fighters[1].ailments['中毒']=3;
  if(immune)B.timer(s,1,'固定百分比免疫');
  B.turn(s,34543,20309);assert.equal(B.sum(s,'fixed'),immune?0:100);
 }
 const x=structuredClone(A.source),m=x.moves.find(m=>m.id===38205);m.hash='00000000';
 assert.ok(A.E.WIKI.assess(x,[38205,38203,20565,10340,20249]).issues.length>0);
 const y=structuredClone(A.source);y.moves.find(m=>m.id===38205).effectInstances[2].args=[301];
 assert.ok(A.E.WIKI.assess(y,[38205,38203,20565,10340,20249]).issues.length>0);
 const z=structuredClone(A.source);z.moves.find(m=>m.id===38205).revision='seerapi:bad';
 assert.ok(A.E.WIKI.assess(z,[38205,38203,20565,10340,20249]).issues.length>0);
});
