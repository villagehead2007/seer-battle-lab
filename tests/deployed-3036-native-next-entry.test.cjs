'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3036-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,stats={},moves=[]){const snapshot=store.species(id);return{snapshot,moves:H.loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:1200,spa:1200,def:4000,spd:4000,spe:1000,...stats}}};}
test('3036第五892真实击败才对玩家指定下一只给25%百分比伤害，上限9000不改且另一只不重复承受',()=>{
 for(const knockout of[false,true]){let g=T.create([[member(3036,{},[19295])],[member(2989,{maxHp:knockout?1:9000}),member(3102),member(3056)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:19295',pp]);assert.equal(g.slots[1][0].fighter.hp===0,knockout);if(knockout){assert.equal(g.phase,'replace');g=T.replace(g,[null,2]);}else g=T.turn(g,[pp,{switchTo:2}]);assert.equal(Number(g.battle.fighters[1].number),3056);assert.equal(g.battle.fighters[1].stats.maxHp,9000);assert.equal(g.battle.fighters[1].hp,knockout?6750:9000);g=T.turn(g,[pp,{switchTo:1}]);assert.equal(Number(g.battle.fighters[1].number),3102);assert.equal(g.battle.fighters[1].hp,9000);}
});
test('3036第五833未击败回合末百分比2250按理论回同量，目标保1、满体上限与技能禁疗分别遵守',()=>{
 for(const blocked of[false,true]){const s=H.turn(H.make(19295,{aHp:1000,enemyId:3141,bHp:1,aEffects:blocked?{'无法通过自身技能恢复体力':{start:1,end:2}}:{}}),19295),red=s.damageEvents.find(e=>e.type==='attack'),drain=s.damageEvents.find(e=>e.type==='percent');assert.equal(red.hpLoss,0);assert.equal(s.fighters[1].hp,1);assert.equal(drain.settledDamage,2250);assert.equal(drain.hpLoss,0);assert.equal(s.fighters[0].hp,blocked?1000:3250);}const capped=H.turn(H.make(19295,{aHp:8999}),19295);assert.equal(capped.fighters[0].hp,9000);
});
