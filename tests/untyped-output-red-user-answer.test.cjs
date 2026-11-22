'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3036-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,soul,stats={},moves=[]){const snapshot=structuredClone(store.species(id));if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:H.loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:1200,spa:1200,def:1000,spd:4000,spe:1000,...stats}}};}
function entered(soul,move){let g=T.create([[member(3004),member(3036,soul,{},[move]),member(3056)],[member(2989,null,{atk:9999},[10086])]],[0,0],{seed:14,criticals:false});g.slots[0][2].fighter.hp=0;return T.turn(g,[{switchTo:1},pp]);}
const events=g=>(g.battle??g).damageEvents??[];
test('用户未注明增伤仅红：满体吕布魂400红伤加50不放大其原生816返还真实伤害',()=>{
 const L=require('./helpers/3031-native.cjs'),returned=[];for(const hp of[1000,9000]){const s=L.turn(L.make(24730,{aHp:hp,enemyMoves:[10086],bStats:{atk:9999}}),24730,10086);returned.push(events(s).find(e=>e.type==='true'&&e.sourceSide===0).settledDamage);assert.equal(Etrait(s),hp===9000?1.5:1);}assert.ok(returned[0]>0);assert.equal(returned[1],returned[0]);
 function Etrait(s){return H.E.SOULS.trait(s.fighters[0],'damageMultiplier');}
});
test('用户未注明增伤仅红：乔特鲁德398与399一死增10不放大原生固定75或第五百分比2250',()=>{
 for(const soul of[398,399])for(const[move,type,n]of[[10761,'fixed',75],[19295,'percent',2250]]){let g=entered(soul,move);assert.equal(g.battle.fighters[0].soulState.fallenOnEntry,1);g=T.turn(g,['wiki:'+move,pp]);assert.equal(events(g).find(e=>e.type===type&&e.sourceSide===0).settledDamage,n);const red=g.battle.turns.at(-1).events.find(e=>e.damage?.type==='attack');assert.ok(red.detail.includes('增减伤 1.1 ×'));}
});
test('用户未注明翻倍仅红：浴火真实吸强成功后下轮固定75不翻倍，红伤仍有翻倍且期满消失',()=>{
 let s=H.make(19292,{extraMoves:[10761],bStages:{def:1}});s=H.turn(s,19292);assert.equal(s.fighters[1].stages.def,0);assert.equal(s.fighters[0].effects['全伤害翻倍'].start,2);s=H.turn(s,10761);assert.equal(events(s).find(e=>e.round===2&&e.type==='fixed').settledDamage,75);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.type==='attack').detail.includes('增减伤 2 ×'));s=H.turn(s,10761);assert.equal(events(s).find(e=>e.round===3&&e.type==='fixed').settledDamage,75);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.type==='attack').detail.includes('增减伤 1 ×'));
});
test('浴火891必须实际吸强成功：原生强化保护阻止吸收时不获得下一轮翻倍',()=>{
 let s=H.make(19292,{enemyId:3549,enemyMoves:[29392],bStats:{spe:2000}});s=H.turn(s,pp,29392);assert.ok(Object.values(s.fighters[1].stages).some(n=>n>0));s=H.turn(s,19292);assert.equal(s.fighters[0].effects['全伤害翻倍'],undefined);assert.ok(Object.values(s.fighters[1].stages).some(n=>n>0));
});
test('浴火891无正级与自身禁强化均不赋予翻倍，也不移除目标原有负级',()=>{
 for(const blocked of[false,true]){const s=H.turn(H.make(19292,{bStages:{atk:blocked?1:0,def:-2},aEffects:blocked?{'禁强化':{start:1,end:2}}:{}}),19292);assert.equal(s.fighters[0].effects['全伤害翻倍'],undefined);assert.equal(s.fighters[1].stages.atk,blocked?1:0);assert.equal(s.fighters[1].stages.def,-2);}
});
