'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function member(id,o={}){const snapshot=store.species(id);if(o.soul)snapshot.selectedSoulId=o.soul;return{snapshot,moves:loadout(snapshot,o.moves??[]),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...o.stats}}};}
test('统一下场重置奥菲利娅自援和第五转化，圣华真死亡后唯一存活激活、真实击败令圣华复活再换下，自援清除但每场一次不重开',()=>{
 for(const soul of[1901,1940]){const attack=E.WIKI.availableMoves(store.species(4706)).find(m=>m.power>0&&!m.fifth).id;let g=T.create([[member(4321,{stats:{maxHp:1,def:1}}),member(4706,{soul,moves:[attack],stats:{atk:9999,spa:9999}})],[member(2989,{moves:[10086],stats:{maxHp:1,def:1,spd:1,atk:9999}}),member(3013)]],[0,0],{seed:14,criticals:false});
  g=T.turn(g,['potion:pp','wiki:10086']);assert.equal(g.phase,'replace');assert.equal(g.battle.swordReforge[0],true);g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].soulState.ophelia4706.soleActive,true);assert.ok(g.battle.fighters[0].moves.some(k=>k.includes(':ophelia:')));
  g=T.turn(g,['wiki:'+attack,'potion:pp']);assert.equal(g.battle.fighters[1].hp,0);assert.equal(g.slots[0][0].fighter.hp,1,'圣剑重铸由队友真实击败触发复活圣华');assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);
  g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.slots[0][1].fighter.soulState.ophelia4706.soleActive,false,'本次自援没有明文下场保留');assert.equal(g.slots[0][1].fighter.soulState.ophelia4706.soleUsed,true,'每场一次真实激活已消耗，不能重开');
  g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.ophelia4706.soleActive,false);assert.equal(g.battle.fighters[0].soulState.ophelia4706.soleUsed,true);assert.equal(g.battle.fighters[0].moves.some(k=>k.includes(':ophelia:')),false,'返场恢复原第五技能而非保留旧转化');
 }
});
