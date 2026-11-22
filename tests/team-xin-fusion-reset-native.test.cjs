'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function member(id,o={}){const snapshot=store.species(id);return{snapshot,moves:loadout(snapshot,o.moves??[]),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...o.stats}}};}
test('统一下场重置天尊荒神融合增益，真实冲顶击败辛而主人存活后融合，离场返场不重新召唤或重放旧死亡事件',()=>{
 let checked=0;for(let seed=1;seed<=30;seed++){
  let g=T.create([[member(3788,{stats:{def:1}}),member(2989)],[member(2989,{moves:[10086],stats:{atk:500}})]],[0,0],{seed,criticals:false});g=T.turn(g,['potion:pp','wiki:10086']);const actor=g.battle.fighters[0];if(actor.hp<=0||actor.soulState.xin.hp!==0)continue;assert.equal(actor.soulState.xinFusion,true);const deadRound=actor.soulState.xin.deadRound;assert.equal(deadRound,1);
  g=T.turn(g,[{switchTo:1},'potion:pp']);const resting=g.slots[0][0].fighter;assert.equal(resting.soulState.xin.hp,0,'真实已死亡伴生体不会因主人下场复活');assert.equal(resting.soulState.xinFusion,false,'荒神融合未注明下场保留');assert.equal(resting.build.resistance.fixed,0);assert.equal(resting.build.resistance.percent,0);
  g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.xin.hp,0);assert.equal(g.battle.fighters[0].soulState.xin.deadRound,deadRound);assert.equal(g.battle.fighters[0].soulState.xinFusion,false,'不能把早先的辛死亡当新事件每回合重放');assert.equal(g.battle.fighters[0].build.resistance.fixed,0);checked++;break;
 }assert.equal(checked,1,'必须存在真实辛阵亡而主人仍活着的事件链');
});
