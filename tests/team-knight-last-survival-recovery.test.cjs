'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const pp='potion:pp';
function member(id,stats={}){const snapshot=store.species(id);return{snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:1000,atk:180,spa:180,def:30,spd:30,spe:1000,...stats}}};}
test('艾欧丽娅真实唯一存活按面板169/170/339/340/509/510保命并逐次减速到零，下次真实攻击阵亡',()=>{
 for(const speed of [169,170,339,340,509,510]){
  let g=T.create([[member(4911,{spe:speed})],[member(3102,{atk:9999,maxHp:9000})]],[0,0],{seed:14,criticals:false});const count=Math.ceil(speed/170);
  for(let i=1;i<=count;i++){g=T.turn(g,[pp,'wiki:19564']);const f=g.battle.fighters[0];assert.equal(f.hp,1);assert.equal(f.stats.spe,Math.max(0,speed-170*i));assert.equal(f.soulState.lastSurvival4911.events.length,i);assert.ok(g.battle.damageEvents.some(e=>e.targetSide===0&&e.type==='attack'&&e.settledDamage>=1000));}
  g=T.turn(g,[pp,'wiki:19564']);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.phase,'finished');assert.equal(g.battle.fighters[0].soulState.lastSurvival4911.events.length,count);
 }
});
test('既有用户确认额外星皇参与存活数：帝皇之戎真正击败获得星皇并阵亡后，艾欧丽娅仍非最后存活而正常阵亡',()=>{
 let g=T.create([[member(4950,{maxHp:10,atk:9999}),member(4911,{spe:340})],[member(4925,{maxHp:10}),member(3102,{atk:180,maxHp:9000})]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:38567',pp]);assert.equal(g.phase,'replace');assert.equal(g.battle.extraStar2584[0].alive,true);g=T.replace(g,[null,1]);for(let i=0;i<8&&g.phase==='action';i++)g=T.turn(g,[pp,'wiki:19564']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);g=T.replace(g,[1,null]);assert.equal(E.teamPopulation(g.battle,0).live,2);assert.equal(g.battle.fighters[0].stats.spe,340);g=T.turn(g,[pp,'wiki:19564']);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.battle.fighters[0].stats.spe,340);assert.equal(g.battle.fighters[0].soulState.lastSurvival4911,undefined);assert.equal(g.battle.extraStar2584[0].alive,true);assert.equal(g.phase,'finished');
});
test('艾欧丽娅背包另有真实活队友不保命，阵亡或消逝队友不算存活，非致死命中不损速度',()=>{
 for(const mode of ['alive','dead','vanished','nonlethal']){
  let g=T.create([[member(4911,{spe:340,maxHp:9000,def:mode==='nonlethal'?9999:30}),member(3056)],[member(3102,{atk:mode==='nonlethal'?1:9999,maxHp:9000})]],[0,0],{seed:14,criticals:false});const ally=g.slots[0][1].fighter;if(mode!=='alive'){ally.hp=0;if(mode==='vanished'){ally.stats.maxHp=0;ally.soulState.vanished=true;}}
  g=T.turn(g,[pp,'wiki:19564']);const f=g.battle.fighters[0];if(mode==='alive'){assert.equal(f.hp,0);assert.equal(f.stats.spe,340);assert.equal(f.soulState.lastSurvival4911,undefined);assert.equal(g.phase,'replace');}else if(mode==='nonlethal'){assert.ok(f.hp>1);assert.equal(f.stats.spe,340);assert.equal(f.soulState.lastSurvival4911,undefined);}else{assert.equal(f.hp,1);assert.equal(f.stats.spe,170);}
 }
});
test('真实天奔连击与段间固伤分别消费保命速度，固定抗性对照隔离固伤后第三红段同次技能内击败',()=>{
 for(const fixedResistance of [0,100]){const owner=member(4911,{spe:340});owner.build.resistance={fixed:fixedResistance};let g=T.create([[owner],[member(4422,{atk:9999,maxHp:9000})]],[0,0],{seed:14,criticals:false});g=T.turn(g,[pp,'wiki:36147']);const f=g.battle.fighters[0];assert.equal(f.hp,0);assert.equal(f.stats.spe,0);assert.equal(f.soulState.lastSurvival4911.events.length,2);assert.deepEqual(f.soulState.lastSurvival4911.events.map(e=>[e.before,e.after]),[[340,170],[170,0]]);assert.deepEqual(f.soulState.lastSurvival4911.events.map(e=>e.type),fixedResistance?['attack','attack']:['attack','fixed']);const hits=g.battle.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===1&&e.targetSide===0);assert.equal(hits.length,fixedResistance?3:2);assert.ok(hits.every(e=>e.settledDamage>=1000));assert.deepEqual(hits.map(e=>e.hpLoss),fixedResistance?[999,0,1]:[999,1]);assert.equal(g.phase,'finished');}
});
