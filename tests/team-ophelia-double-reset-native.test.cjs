'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function member(id,{soul,moves=[],maxHp=9000,atk=180}={}){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,moves),build:{overrides:{maxHp,atk,spa:180,def:4000,spd:4000,spe:1000}}};}
test('统一下场重置奥菲利娅2236的下三次支援翻倍，真实原招授予后下场清零，队友KO只获正常30或35回复',()=>{
 for(const [soul,fraction]of[[1901,.3],[1940,.35]]){let g=T.create([[member(4706,{soul,moves:[28886]}),member(2989,{moves:[10086],atk:9999})],[member(2989),member(3013,{maxHp:1})]],[0,0],{seed:14,criticals:false});g.slots[0][1].fighter.hp=1000;
  g=T.turn(g,['wiki:28886','potion:pp']);assert.equal(g.battle.fighters[0].soulState.ophelia4706.doubleCharges,3);g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.equal(g.slots[0][0].fighter.soulState.ophelia4706.doubleCharges,0,'2236无下场保留，不能跟命运晨星整个对象一并保留');g=T.turn(g,['wiki:10086','potion:pp']);assert.equal(g.battle.fighters[1].hp,0);assert.equal(g.battle.fighters[0].hp,1000+9000*fraction);assert.equal(g.slots[0][0].fighter.soulState.ophelia4706.stars,1);assert.equal(g.slots[0][0].fighter.soulState.ophelia4706.doubleCharges,0);
 }
});
