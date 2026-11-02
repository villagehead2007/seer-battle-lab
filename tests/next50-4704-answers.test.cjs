'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {source,make,turn,key,sum}=require('./helpers/4704-battle.cjs');
const index=source.moves.find(m=>m.id===28919).effectInstances.findIndex(e=>e.id===874);
function fixture(enabled,hits){const s=make({move:28919,index:enabled?index:-1,enemyMove:10254,bStats:{atk:1000}});s.moveDefinitions[key(10254)].power=100;s.moveDefinitions[key(10254)].operations=[{effectId:31,phase:'beforeUse',params:[hits,hits],index:0}];return s;}
test('4704小额免伤按整次红伤：三段各低于500但合计达标不免，单段不足免疫',()=>{
 for(const hits of[1,3]){const base=fixture(false,hits),s=fixture(true,hits);turn(base,28919,10254);turn(s,28919,10254);
  const raw=base.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===1),actual=s.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===1);
  assert.equal(raw.length,hits);assert.equal(actual.length,hits);assert.ok(raw.every(e=>e.settledDamage<500));assert.equal(sum(s,'attack',1),hits===1?0:sum(base,'attack',1));if(hits===3)assert.ok(sum(base,'attack',1)>=500);
  assert.equal(s.fighters[1].pp[key(10254)],source.moves.find(m=>m.id===10254).pp-1);assert.equal(s.rng,base.rng);
 }
});
