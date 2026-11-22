'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const pp='potion:pp';function member(id,stats={}){const snapshot=store.species(id);return{snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:180,spa:180,def:30,spd:4000,spe:1000,...stats}}};}
test('落败真实3102第五击败艾欧丽娅仍造成完整伤害，但纯击败840不授下一位吸血；普通实战对照正常授予并实际吸取',()=>{
 for(const fallen of [false,true]){
  let g=T.create([[member(fallen?4911:3102,{maxHp:10}),member(4925)],[member(3102,{atk:9999}),member(3056)]],[0,0],{seed:14,criticals:false});
  if(fallen){g=T.turn(g,[pp,{switchTo:1}]);g=T.turn(g,[pp,{switchTo:0}]);assert.equal(g.battle.fighters[1].soulState.knightDuel4911.kind,'defeat');assert.equal(g.battle.fighters[1].soulState.knightDuel4911.inactiveLast,false);}
  g=T.turn(g,[pp,'wiki:19565']);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.phase,'replace');assert.ok(g.battle.damageEvents.some(e=>e.sourceSide===1&&e.targetSide===0&&e.settledDamage>10));const queue=g.battle.teamEntryGrants?.[0]??[];assert.equal(queue.some(x=>x.effectId===840),!fallen);
  g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].hp,fallen?9000:6000);
 }
});
test('落败下真实帝皇之戎第五击败不经队伍补发路径伪增额外星皇，普通第五真实击败仍可增星皇',()=>{
 for(const fallen of [false,true]){
  let g=T.create([[member(fallen?4911:3102,{maxHp:10}),member(4925)],[member(4950,{atk:9999,spa:9999}),member(3056)]],[0,0],{seed:14,criticals:false});
  if(fallen){g=T.turn(g,[pp,{switchTo:1}]);g=T.turn(g,[pp,{switchTo:0}]);assert.equal(g.battle.fighters[1].soulState.knightDuel4911.kind,'defeat');}
  g=T.turn(g,[pp,'wiki:38567']);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.phase,'replace');assert.equal(Boolean(g.battle.extraStar2584?.[1]?.alive),!fallen);assert.equal(g.battle.fighters[0].soulState.teamDefeater,1);assert.ok(g.battle.damageEvents.some(e=>e.sourceSide===1&&e.targetSide===0&&e.settledDamage>10));
 }
});
test('落败下无限自由真实天雷之剑击败不触发魂印回满PP，普通击败则实际把初始亏损槽回满',()=>{
 for(const fallen of [false,true]){
  let g=T.create([[member(fallen?4911:3102,{maxHp:10}),member(4925)],[member(3383,{atk:9999}),member(3056)]],[0,0],{seed:14,criticals:false});g.slots[1][0].fighter.pp['wiki:25517']=1;
  if(fallen){g=T.turn(g,[pp,{switchTo:1}]);g=T.turn(g,[pp,{switchTo:0}]);assert.equal(g.battle.fighters[1].soulState.knightDuel4911.kind,'defeat');}
  g=T.turn(g,[pp,'wiki:30820']);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.battle.fighters[1].pp['wiki:25517'],fallen?1:g.battle.fighters[1].teamPPDefinitions['wiki:25517'].pp);assert.equal(g.battle.fighters[0].soulState.teamDefeater,1);
 }
});
test('骑士落败抑制至序圣华真实被击败后重铸与授剑，普通死亡仍授剑并重铸',()=>{
 for(const fallen of [false,true]){
  let g=T.create([[member(4321,{maxHp:10}),member(3056)],[member(fallen?4911:3102,{atk:9999}),member(4925)]],[0,0],{seed:14,criticals:false});g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);if(fallen)assert.equal(g.battle.fighters[0].soulState.knightDuel4911.kind,'defeat');const swords=g.battle.holySwords[0];g=T.turn(g,[pp,fallen?'wiki:38419':'wiki:19564']);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.phase,'replace');assert.equal(Boolean(g.battle.swordReforge?.[0]),!fallen);assert.equal(g.battle.holySwords[0],swords+Number(!fallen));assert.equal(Boolean(g.battle.swordReforgeUsed?.[0]),!fallen);
 }
});
test('无为觉者真实零PP属性技进阶后击败，落败不触发万相重置或尸体消逝，普通击败仍重置与消逝',()=>{
 for(const fallen of [false,true]){
  let g=T.create([[member(fallen?4911:3102,{maxHp:10}),member(4925)],[member(4661,{atk:9999}),member(3056)]],[0,0],{seed:14,criticals:false});g.slots[1][0].fighter.pp['wiki:28780']=0;g=T.turn(g,[pp,{switchTo:1}]);g=T.turn(g,[pp,{switchTo:0}]);g=T.turn(g,[pp,'wiki:28780']);const before=g.battle.fighters[1].soulState.wuwei1862;assert.equal(before.power,50);assert.deepEqual(before.cancelled,[0]);g=T.turn(g,[pp,'wiki:37458']);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.phase,'replace');const st=g.battle.fighters[1].soulState.wuwei1862;assert.equal(st.power,fallen?50:0);assert.deepEqual(st.cancelled,fallen?[0]:[]);assert.equal(Boolean(g.battle.fighters[0].soulState.vanished),!fallen);assert.equal(g.battle.fighters[0].soulState.teamDefeater,1);
 }
});
