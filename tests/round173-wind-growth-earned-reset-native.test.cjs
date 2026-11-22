'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[]){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
const rates=f=>{const s=f.soulState.wind2151;return[s.capacityRate,s.damageRate,s.fullRate];};
test('2151完整原魂三比例实际成长，真下场全部回60且返场临时上限附粉和满体增红按初值执行',()=>{
 let g=T.create([[member(4951,2151,[10001]),member(3056)],[member(2989)]],[0,0],{seed:14,criticals:false});
 assert.equal(g.battle.fighters[0].soulId,2151);assert.equal(S.species(4951).souls.find(s=>s.id===2151).hash,'35e1e75a');
 for(let i=0;i<2;i++)g=T.turn(g,[pp,pp]);
 assert.deepEqual(rates(g.battle.fighters[0]),[60,60,100],'actual full-HP round starts independently earn full-rate growth');
 for(const [bonus,damage]of [[600,360],[800,640]]){
  g=T.turn(g,['wiki:10001',pp]);const f=g.battle.fighters[0],st=f.soulState.wind2151;
  assert.equal(f.stats.maxHp,9000+bonus);assert.equal(f.hp,9000,'capacity never refills HP');
  assert.equal(st.events.filter(e=>e.kind==='lost-hp').at(-1).amount,damage);
  assert.ok(g.battle.damageEvents.some(e=>e.round===g.battle.round-1&&e.type==='percent'&&e.targetSide===1&&e.settledDamage===damage));
 }
 assert.deepEqual(rates(g.battle.fighters[0]),[100,100,120]);
 g=T.turn(g,[{switchTo:1},pp]);const resting=g.slots[0][0].fighter;assert.equal(resting.stats.maxHp,9000);assert.equal(resting.hp,9000);assert.deepEqual(rates(resting),[60,60,60]);assert.deepEqual(resting.soulState.wind2151.events,[]);
 g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].stats.maxHp,9000);assert.deepEqual(rates(g.battle.fighters[0]),[60,60,80]);assert.equal(g.battle.fighters[0].soulState.wind2151.events.find(e=>e.kind==='full').rate,60,'return round itself starts full and earns the first fresh full-rate step');
 g=T.turn(g,['wiki:10001',pp]);const f=g.battle.fighters[0],st=f.soulState.wind2151;
 assert.equal(f.stats.maxHp,9600);assert.equal(f.hp,9000);assert.deepEqual(rates(f),[80,80,100]);
 for(const kind of ['capacity','lost-hp'])assert.equal(st.events.filter(e=>e.kind===kind).at(-1).rate,60,kind);
 assert.deepEqual(st.events.filter(e=>e.kind==='full').map(e=>e.rate),[60,80]);assert.equal(st.fullBonus,.8);assert.equal(st.events.filter(e=>e.kind==='lost-hp').at(-1).amount,360);
});
