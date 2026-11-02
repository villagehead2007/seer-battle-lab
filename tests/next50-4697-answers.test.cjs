'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {E,source,make,turn,key}=require('./helpers/4697-battle.cjs');
const row=id=>{const m=source.moves.find(m=>m.effectIds.includes(id));return {move:m.id,index:m.effectInstances.findIndex(e=>e.id===id)};};
test('4697重生与回合保留1HP按授予先后，红伤和真实伤害都只触发后得资源',()=>{
 for(const latest of['rebirth','floor'])for(const kind of['attack','true']){
  const s=make(row(2243)),old=E.SOULS;let deaths=0;
  E.SOULS={...old,run(e,c){old.run(e,c);if(e==='death'||e==='opponentDefeated')deaths++;
   if(e==='beforeUse'&&c.a.side===0&&latest==='rebirth')c.timed(c.a,'致命保留',3,{hp:1});
   if(e==='afterUse'&&c.a.side===0&&latest==='floor')c.timed(c.a,'致命保留',3,{hp:1});
   if(e==='afterUse'&&c.a.side===1){if(kind==='attack')c.typedAttack(100000,'普通');else c.hurt(c.t,20000,'重生顺序探针','true');}
  }};
  try{turn(s,28906,28907);}finally{E.SOULS=old;}
  assert.equal(s.fighters[0].hp,latest==='rebirth'?9000:1);assert.equal(s.fighters[0].soulState.rebirth2243.armed,latest!=='rebirth');assert.equal(deaths,0);
 }
});
test('4697重生与死亡技能回复后得先用，未用资源保留，重生不触死亡击败事件',()=>{
 for(const latest of['rebirth','heal']){
  const s=make(row(2243)),old=E.SOULS;let deaths=0;
  E.SOULS={...old,run(e,c){old.run(e,c);if(e==='death'||e==='opponentDefeated')deaths++;
   if(e==='beforeUse'&&c.a.side===0&&latest==='rebirth')c.timed(c.a,'死亡时技能回复',3,{});
   if(e==='afterUse'&&c.a.side===0&&latest==='heal')c.timed(c.a,'死亡时技能回复',3,{});
   if(e==='afterUse'&&c.a.side===1){c.t.stages.atk=-2;c.t.ailments['中毒']=8;c.hurt(c.t,20000,'复活顺序探针','true');assert.equal(c.t.hp,9000);assert.equal(c.t.stages.atk,latest==='rebirth'?-2:0);assert.equal(!!c.t.ailments['中毒'],latest==='rebirth');}
  }};
  try{turn(s,28906,28907);}finally{E.SOULS=old;}
  assert.equal(s.fighters[0].soulState.rebirth2243.armed,latest!=='rebirth');assert.equal(!!s.fighters[0].effects['死亡时技能回复'],latest==='rebirth');assert.equal(deaths,0);
 }
});
test('4697随机两异常一次免疫造成部分失败仍触发回合末吸取，不补抽',()=>{
 const s=make({...row(1294),hp:1000});s.fighters[1].stages.atk=1;s.fighters[1].counts.immune=1;turn(s,28906,28907);
 const draws=s.randomStatusEvents.filter(e=>e.sourceKey==='effect:1294');assert.equal(draws.length,2);assert.notEqual(draws[0].name,draws[1].name);assert.equal(s.fighters[1].ailments[draws[0].name],undefined);assert.ok(s.fighters[1].ailments[draws[1].name]);assert.equal(s.fighters[0].hp,4000);
});
