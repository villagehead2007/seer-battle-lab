'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,{soul,move,extra=[],stats={}}={}){
 const original=store.species(id),snapshot=soul==null?original:E.WIKI.versionSnapshots(original).find(s=>s.selectedSoulId===soul);
 assert.ok(snapshot,'真实魂印版本 '+id+'/'+soul);
 const moves=E.WIKI.defaultMoves(snapshot);if(move&&!moves.includes(move))moves[1]=move;
 for(const id of extra)if(!moves.includes(id))moves[2]=id;
 return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};
}
test('1948真实继承队友霍光击败效果后换下返场保留狂刃绝对期限与完整击败红伤，过期不再附真伤',()=>{
 let g=T.create([[member(4745),member(4515)],[member(4925,{stats:{maxHp:1000,def:20}}),member(3102,{stats:{maxHp:9999}})]],[0,0],{seed:14,criticals:false});
 assert.equal(g.battle.fighters[0].soulState.hunt1948.souls,1);
 g=T.turn(g,['wiki:37862',pp]);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[1].hp,0);
 const earned=structuredClone(g.battle.fighters[0].soulState),red=g.battle.damageEvents.filter(e=>e.round===1&&e.sourceSide===0&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);
 assert.ok(earned.hunt1948.inheritedHuoguang);assert.ok(red>260);assert.equal(earned.huoguangDefeatAttackDamage,red);assert.equal(earned.huoguangFrenzyEnd,4);
 g=T.replace(g,[null,1]);g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);
 const returned=g.battle.fighters[0];assert.equal(returned.soulState.huoguangFrenzyEnd,4);assert.equal(returned.soulState.huoguangDefeatAttackDamage,red);assert.ok(returned.soulState.hunt1948.inheritedHuoguang);
 // 1948没有霍光自身的形态切换技能；此处只证明真实取得的狂刃字段，不宣称非默认形态。
 assert.equal(returned.soulState.huoguangForm,earned.huoguangForm);
 g=T.turn(g,['wiki:37862',pp]);assert.ok(g.battle.damageEvents.some(e=>e.round===4&&e.sourceSide===0&&e.type==='true'&&e.settledDamage===red));
 assert.ok(g.battle.turns.at(-1).events.some(e=>e.text?.includes('北冥狂刃追加')));
 g=T.turn(g,['wiki:37862',pp]);assert.ok(!g.battle.turns.at(-1).events.some(e=>e.text?.includes('北冥狂刃追加')));assert.ok(g.battle.fighters.every(f=>f.hp>0));
});
test('2030真实星辉幻尘致死重生后换下返场保留六项已扣面板与已重生标记，不重授辰星石也不二次重生',()=>{
 let g=T.create([[member(3983,{soul:2030,stats:{maxHp:9000,atk:180,spa:180,def:2,spd:2,spe:1000}}),member(2989)],[member(3986,{move:33888,extra:[33887],stats:{atk:9999,spa:1}}),member(2988)]],[0,0],{seed:14,criticals:false});
 const initial=g.battle.fighters[0];assert.equal(initial.soulId,2030);initial.hp=40;const before={...initial.stats};
 g=T.turn(g,[pp,'wiki:33888']);let f=g.battle.fighters[0];assert.equal(f.hp,4500);assert.equal(f.soulState.chenReborn,true);
 const cost={};for(const key of ['maxHp','atk','spa','def','spd','spe']){assert.equal(f.stats[key],Math.max(1,Math.floor(before[key]/2)));cost[key]=before[key]-f.stats[key];}assert.deepEqual(f.soulState.chenRebirthCost,cost);
 assert.ok(g.battle.damageEvents.some(e=>e.round===1&&e.sourceSide===1&&e.type==='true'&&e.settledDamage===50&&e.hpLoss===40));
 const reduced={...f.stats};g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);f=g.battle.fighters[0];assert.deepEqual(f.stats,reduced);assert.equal(f.hp,3375);assert.equal(f.soulState.chenReborn,true);assert.deepEqual(f.soulState.chenRebirthCost,cost);assert.equal(f.suitState.shield,0);
 g=T.turn(g,[pp,'wiki:33887']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.battle.fighters[0].soulState.chenReborn,true);assert.equal(g.battle.fighters[0].stats.maxHp,4500);
});
