'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {E,source,make,turn,timer,key,sum}=require('./helpers/4706-battle.cjs');
const row=id=>{const m=source.moves.find(m=>m.effectIds.includes(id));return {move:m.id,index:m.effectInstances.findIndex(e=>e.id===id)};};
test('4706强化暴击翻倍支援70%与已有晨星10%相加为80%，消费一次并回合末减星',()=>{
 const base=make({soul:true,soulId:1940,move:37671,index:-1}),s=make({soul:true,soulId:1940,move:37671,index:-1});for(const a of[base,s])timer(a,0,'必定暴击');
 const old=E.SOULS;E.SOULS={...old,run(e,c){old.run(e,c);if(e==='beforeRoundStart'&&c.a.side===0){c.a.soulState.qualifiedSole4706=true;E.SOULS.registry[1940].abilities.activateSole(c);Object.assign(c.a.soulState.ophelia4706,{stars:1,doubleCharges:1});}}};
 try{turn(s,37671,28884);}finally{E.SOULS=old;}turn(base,37671,28884);
 assert.ok(Math.abs(sum(s)-sum(base)*1.8)<=2);assert.equal(s.fighters[0].soulState.ophelia4706.doubleCharges,0);assert.equal(s.fighters[0].soulState.ophelia4706.stars,1);
});
test('4706受击724多段整次只抽一次概率，普通零伤命中仍走受击条件',()=>{
 for(const zero of[false,true]){const s=make({...row(724),hp:1000,enemyMove:37671});s.moveDefinitions[key(37671)].operations=[{effectId:31,phase:'beforeUse',params:[3,3],index:0}];if(zero)timer(s,0,'当回合免伤');
  const engine=E.WIKI.effectsEngine,old=engine.registry[724];let draws=0;E.WIKI.effectsEngine={...engine,registry:{...engine.registry,724:{...old,heal4706(c,...args){return old.heal4706({...c,random(){draws++;return 0;}},...args);}}}};
  try{turn(s,s.auditMoveId,37671);}finally{E.WIKI.effectsEngine=engine;}
  assert.equal(draws,1);assert.equal(s.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===1).length,3);if(zero){assert.equal(sum(s,'attack',1),0);assert.equal(s.fighters[0].hp,9000);}else assert.ok(s.fighters[0].hp>8000);
 }
});
test('4706必暴与其他来源并存只消费后得一份，另一份留下一次攻击',()=>{
 for(const latest of['ophelia','generic']){const s=make(row(2271));timer(s,1,'免异常');turn(s);const raw=source.moves.find(m=>m.id===28886);s.moveDefinitions[key(28886)].operations=E.WIKI.effectsEngine.compileInstances(raw.effectInstances,source.effects,raw).operations.filter(x=>x.index===1);
  if(latest==='ophelia')s.fighters[0].counts.nextCrit=1;s.fighters[0].stages.atk=1;turn(s,28886);if(latest==='generic')s.fighters[0].counts.nextCrit=1;
  turn(s,37641);assert.equal(s.fighters[0].soulState.opheliaCrit2271.count,latest==='generic'?1:0);assert.equal(s.fighters[0].counts.nextCrit,latest==='generic'?0:1);
  turn(s,37641);assert.equal(s.fighters[0].soulState.opheliaCrit2271.count,0);assert.equal(s.fighters[0].counts.nextCrit,0);
 }
});
