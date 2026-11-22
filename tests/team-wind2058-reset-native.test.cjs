'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function member(id,moves=[]){const snapshot=store.species(id);return{snapshot,moves:loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
test('统一下场重置嘲风风龙结数量及预约，真实低半获得50后离场清零，返场不重领战斗开始的一枚',()=>{
 let g=T.create([[member(4871),member(2989)],[member(2989)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=4499;
 g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[0].soulState.wind2058.count,51);assert.equal(g.battle.fighters[0].hp,4999);
 g=T.turn(g,[{switchTo:1},'potion:pp']);const st=g.slots[0][0].fighter.soulState.wind2058;assert.equal(st.count,0,'风龙结未写下场保留');assert.equal(st.reverseDue,undefined);assert.equal(st.converted,false);
 g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.wind2058.count,0,'战斗开始时获得一次不应返场重新发放');assert.equal(g.battle.fighters[0].soulState.wind2058.reverseDue,undefined,'中切不重放已过去的回合开始时点');
});
test('统一下场重置嘲风本场转系，真实敌方两次烧伤附加执行达到千枚后变龙，离场恢复原系并取消旧预约',()=>{
 let checked=0;for(let seed=1;seed<=40;seed++){
  let g=T.create([[member(4871),member(2989)],[member(2989,[13693])]],[0,0],{seed,criticals:false});const original=g.battle.fighters[0].type;
  g=T.turn(g,['potion:pp','wiki:13693']);if(g.battle.fighters[0].soulState.wind2058.count!==255)continue;
  g=T.turn(g,['potion:pp','wiki:13693']);if(!g.battle.fighters[0].soulState.wind2058.converted)continue;assert.equal(g.battle.fighters[0].type,'龙');assert.equal(g.battle.fighters[0].soulState.wind2058.count,0);
  g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.soulState.wind2058.converted,false);assert.equal(g.slots[0][0].fighter.soulState.wind2058.reverseDue,undefined);
  g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].type,original);assert.equal(g.battle.fighters[0].soulState.wind2058.count,0);checked++;break;
 }assert.equal(checked,1,'至少真实执行两次20%附加并转换成功后检查返场');
});
