'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const potion='potion:pp';
function member(id,soul){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000}}};}
function gammaEntries(soul){
 const enemy=member(3443);enemy.moves[1]=20592;enemy.moves[2]=10008;enemy.build.overrides.atk=300;
 let g=T.create([[member(3896,soul),member(2988)],[enemy]],[1,0],{seed:13,criticals:false});
 const observations=[];
 for(let entry=1;entry<=3;entry++){
  g=T.turn(g,[potion,'wiki:20592']);const round=g.battle.round;
  g=T.turn(g,[{switchTo:0},'wiki:10008']);assert.match(g.battle.turns.at(-1).events.find(e=>e.damage?.sourceSide===1&&e.damage.type==='attack')?.detail??'',/暴击 (?:1\.5|2)/);
  const f=g.battle.fighters[0];
  observations.push({entry:g.slots[0][0].entries,hp:f.hp,ready:f.soulState.gammaCritReady,overclock:(f.ailments['超频']??0)>=round});
  g=T.turn(g,[{switchTo:1},potion]);
 }
 return observations;
}
test('伽玛原版前两次真实登场抵挡必暴红伤，第三次登场已失去防护',()=>{
 const entries=gammaEntries(1165);
 assert.deepEqual(entries.map(x=>x.entry),[1,2,3]);
 assert.deepEqual(entries.map(x=>x.hp===9000),[true,true,false]);
 assert.ok(entries[2].hp>0);
});
test('强化伽玛每次真实返场重获首次必暴抵挡，实际消费后附加超频',()=>{
 const entries=gammaEntries(1959);
 assert.deepEqual(entries.map(x=>x.entry),[1,2,3]);
 assert.deepEqual(entries.map(x=>x.hp),[9000,9000,9000]);
 assert.deepEqual(entries.map(x=>x.ready),[false,false,false]);
 assert.deepEqual(entries.map(x=>x.overclock),[true,true,true]);
});
test('原版莫妮卡首登四层自然祝福，离场清空，再登只授两层且不用技能后只增一层',()=>{
 let g=T.create([[member(3711,987),member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 assert.equal(g.battle.fighters[0].soulState.natureBlessings,4);
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState.natureBlessings??0,0);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.natureBlessings,3);
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].soulState.natureBlessings,4);
 g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},potion]);
 assert.equal(g.battle.fighters[0].soulState.natureBlessings,3);
});
test('乔列尼德真实使用逆命技能后离场保层，返场附慑并在敌换入时逐层按90与九百分比取高值',()=>{
 for(const cap of [900,2000]){
  const joe=member(3524,2005);joe.moves[1]=29142;
  const reserve=member(3056);reserve.build.overrides.maxHp=cap;
  let g=T.create([[joe,member(2988)],[member(2988),reserve]],[0,0],{seed:13,criticals:false});
  g.battle.fighters[1].stages.def=1;
  g=T.turn(g,['wiki:29142',potion]);
  assert.equal(g.battle.fighters[0].soulState.inverseMight,1);
  g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState.inverseMight,1);
  g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.inverseMight,1);
  g=T.turn(g,['wiki:29142',potion]);assert.equal(g.battle.fighters[0].soulState.inverseMight,2);
  g=T.turn(g,['wiki:29142',potion]);const layers=g.battle.fighters[1].soulState.ancientDread;
  assert.ok(layers>=1);
  const round=g.battle.round;g=T.turn(g,[potion,{switchTo:1}]);
  const damage=g.battle.damageEvents.filter(e=>e.round===round&&e.type==='fixed'&&e.targetSide===1);
  assert.deepEqual(damage.map(e=>e.settledDamage),Array(layers).fill(Math.max(90,cap*.09)));
  assert.equal(g.battle.fighters[1].hp,cap-layers*Math.max(90,cap*.09));
 }
});
test('逆命技能施放时没有逆命且复制未增等级，不凭空附慑或扣接替者体力',()=>{
 const joe=member(3524,2005);joe.moves[1]=29142;
 let g=T.create([[joe,member(3056)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
 assert.equal(g.battle.fighters[0].soulState.inverseMight??0,0);
 g=T.turn(g,['wiki:29142',potion]);assert.equal(g.battle.fighters[1].soulState.ancientDread??0,0);
 const round=g.battle.round;g=T.turn(g,[potion,{switchTo:1}]);
 assert.equal(g.battle.fighters[1].hp,9000);
 assert.ok(!g.battle.damageEvents?.some(e=>e.round===round&&e.targetSide===1&&e.type==='fixed'));
});
