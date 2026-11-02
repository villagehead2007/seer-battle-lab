'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4620-battle.cjs');
const e=H.entries.find(x=>x.id===2118),sum=(s,type='attack')=>(s.damageEvents??[]).filter(x=>x.round===s.round-1&&x.targetSide===1&&x.type===type).reduce((n,x)=>n+x.settledDamage,0);
function stable(s){for(const f of s.fighters)for(const k of f.moves)f.pp[k]=1;s.fighters[0].pp[H.key(e.moveId)]=4;s.fighters[1].pp[H.key(920041)]=10;return s;}
function capture(s){const old=H.E.SOULS,power=[];H.E.SOULS={...old,run(event,c){old.run(event,c);if(event==='beforeDamage'&&c.a.soulId===1826)power.push(c.power);}};try{return {state:H.turn(s),power};}finally{H.E.SOULS=old;}}
test('4620主线2118本招熄烛不倒改本次红伤，下次暗烛最高PP倍威力且按敌最大HP理论吸取',()=>{
  const s=stable(H.make(e,{soul:1826,naturalRank:true,hp:3000})),plain=stable(H.make({...e,index:-1},{soul:1826,naturalRank:true,hp:3000})),firstRun=capture(s),first=firstRun.state,controlFirst=H.turn(plain);
  assert.equal(s.fighters[0].soulState.qualifiedRank1826,undefined);
  assert.deepEqual(firstRun.power,[85]);
  assert.equal(sum(first),sum(controlFirst));assert.ok(sum(first)>0);assert.equal(first.fighters[0].soulState.candleLit1826,false);assert.ok(first.fighters[1].effects.statusBlock);assert.equal(first.fighters[0].pp[H.key(e.moveId)],3);assert.equal(first.fighters[0].hp,3000);
  const lit=structuredClone(first);lit.fighters[0].soulState.candleLit1826=true;
  const darkRun=capture(first),litRun=capture(lit),second=darkRun.state,controlSecond=litRun.state;
  assert.deepEqual(darkRun.power,[170]);assert.deepEqual(litRun.power,[85]);assert.ok(sum(second)>sum(controlSecond));assert.equal(sum(second,'percent'),2250);assert.equal(sum(controlSecond,'percent'),0);assert.equal(second.fighters[0].hp,5250);assert.equal(second.fighters[0].pp[H.key(e.moveId)],2);assert.equal(second.fighters[0].soulState.candleLit1826,false);assert.equal(second.fighters[1].hp,first.fighters[1].hp-sum(second)-2250);
});
