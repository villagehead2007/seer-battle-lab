'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,stats={}){const snapshot=store.species(id);return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
function make(source,next=2988){const g=T.create([[member(4745,{atk:9999,spa:9999}),member(source)],[member(4925,{maxHp:40}),member(next)]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=5000;return g;}
test('继承战争猎魔实际敌方阵亡后下一位登场吸取三分一且己方全属性加一，不复制普通回末随机三强化或异常',()=>{
 let g=make(3840);g=T.turn(g,[pp,pp]);assert.deepEqual(g.battle.fighters[0].stages,{atk:0,def:0,spa:0,spd:0,spe:0,acc:0});assert.deepEqual(g.battle.fighters[1].ailments,{});g=T.turn(g,['wiki:37862',pp]);assert.equal(g.phase,'replace');assert.equal(g.battle.teamEntryGrants[1].filter(x=>x.soulId===1113).length,1);assert.equal(g.battle.fighters[0].hp,5000);g=T.replace(g,[null,1]);assert.equal(g.battle.fighters[1].hp,6000);assert.equal(g.battle.fighters[0].hp,8000);for(const value of Object.values(g.battle.fighters[0].stages))assert.equal(value,1);assert.equal(g.battle.teamEntryGrants[1].length,0);
});
test('继承战争猎魔面对下一位真实免粉星皇仍按理论三分一回血并全属性加一',()=>{
 let g=make(3840,3291);g=T.turn(g,['wiki:37862',pp]);g=T.replace(g,[null,1]);assert.equal(g.battle.fighters[1].hp,9000);assert.equal(g.battle.fighters[0].hp,8000);assert.ok(Object.values(g.battle.fighters[0].stages).every(n=>n===1));
});
test('继承嬴政仅敌方阵亡回末清实际永昌玺，未击败保留且未附送初始玺、君临、臣服或冻结耗竭',()=>{
 for(const resource of [undefined,3]){let g=make(4468),f=g.battle.fighters[0];assert.equal(f.soulState.yongchang,undefined);assert.equal(g.battle.fighters[1].ailments['臣服'],undefined);if(resource!==undefined)f.soulState.yongchang=resource;g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[0].soulState.yongchang,resource);g=T.turn(g,['wiki:37862',pp]);f=g.battle.fighters[0];assert.equal(g.phase,'replace');assert.equal(f.soulState.yongchang,resource===undefined?undefined:0);assert.equal(f.soulState.emperorReignEnd,undefined);assert.equal(f.soulState.emperorExhaustThrough,undefined);assert.equal(f.soulState.emperorRoundSeals,undefined);assert.equal(f.soulState.emperorFreezeEnd,undefined);}
});
