'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
const pp='potion:pp';
function member(id,stats={},skills=[]){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const skill of skills)if(!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100,...stats}}};}
function finish(g){while(g.phase==='action'&&g.battle.turns.length<50)g=T.turn(g,[pp,pp]);return g;}
function golden(){return T.create([[member(4000,{maxHp:1}),member(3056),member(3102)],[member(3102,{atk:9999,spe:1000},[10127]),member(3056)]],[0,0],{seed:13,criticals:false});}
test('50回合双方实际存活相同判平局，49回合未结束，禁止第51次指令且显示不改变状态',()=>{
 let g=T.create([[member(3056),member(3102)],[member(3102),member(3056)]],[0,0],{seed:13,criticals:false});for(let i=0;i<49;i++)g=T.turn(g,[pp,pp]);assert.equal(g.phase,'action');assert.equal(g.battle.round,50);g=T.turn(g,[pp,pp]);assert.equal(g.phase,'finished');assert.equal(g.battle.winner,'draw');assert.equal(g.battle.turns.length,50);assert.deepEqual(g.battle.teamRoundLimit.counts,[{real:2,golden:0,total:2},{real:2,golden:0,total:2}]);assert.throws(()=>T.turn(g,[pp,pp]),/当前不能提交/);const before=structuredClone(g);assert.match(D.team(g,0).find(x=>x.name==='50回合存活计数').value,/2 只/);assert.deepEqual(g,before);assert.match(g.history.at(-1),/50回合结算.*平局/);
});
test('薇尔诗真实阵亡并消耗一份黄金万象，剩余一份令50回合按三比二获胜',()=>{
 let g=T.turn(golden(),[pp,'wiki:10127']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.slots[0][1].fighter.soulState.verse2098.golden,true);assert.equal(g.slots[0][2].fighter.soulState.verse2098.golden,true);g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].soulState.verse2098.golden,false);assert.deepEqual(E.victoryPopulation50(g.battle,0),{real:2,golden:1,total:3});g=finish(g);assert.equal(g.battle.winner,0);assert.equal(g.battle.teamRoundLimit.counts[0].golden,1);assert.equal(g.slots[0][0].fighter.hp,0);assert.match(D.team(g,0).find(x=>x.name==='50回合存活计数').value,/黄金万象视为存活 1 只/);
});
test('黄金万象最后一份实际换人消耗后不再虚计阵亡薇尔诗，50回合二比二平局',()=>{
 let g=T.turn(golden(),[pp,'wiki:10127']);g=T.replace(g,[1,null]);g=T.turn(g,[{switchTo:2},pp]);assert.deepEqual(E.victoryPopulation50(g.battle,0),{real:2,golden:0,total:2});g=finish(g);assert.equal(g.battle.winner,'draw');assert.equal(g.battle.teamRoundLimit.counts[0].golden,0);
});
test('黄金万象不提供真实补位或延缓全队阵亡，50回合前仍按普通胜负结束',()=>{
 let g=T.create([[member(4000,{maxHp:1}),member(3056,{maxHp:1})],[member(3102,{atk:9999,spe:1000},[10127])]], [0,0],{seed:13,criticals:false});g=T.turn(g,[pp,'wiki:10127']);g=T.replace(g,[1,null]);g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.phase,'finished');assert.equal(g.battle.winner,1);assert.equal(g.battle.teamRoundLimit,undefined);assert.deepEqual(T.candidates(g,0,true),[]);
});
test('真正击败获得的额外星皇参与魂印人口但不参与50回合胜负人数',()=>{
 let g=T.create([[member(4950,{atk:9999}),member(3056)],[member(4925,{maxHp:10}),member(3102),member(3056)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:38567',pp]);assert.equal(g.phase,'replace');assert.equal(g.battle.extraStar2584[0].alive,true);g=T.replace(g,[null,1]);assert.equal(E.teamPopulation(g.battle,0).live,3);assert.deepEqual(E.victoryPopulation50(g.battle,0),{real:2,golden:0,total:2});g=finish(g);assert.equal(g.battle.winner,'draw');
});
test('第50回合薇尔诗真正阵亡先发放万象再计数，不要求第51回合补位或提前消耗令牌',()=>{
 let g=golden();for(let i=0;i<49;i++)g=T.turn(g,[pp,pp]);g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.phase,'finished');assert.equal(g.battle.winner,0);assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.active[0],0);assert.deepEqual(g.pending,[]);assert.deepEqual(g.battle.teamRoundLimit.counts[0],{real:2,golden:1,total:3});assert.equal(g.slots[0][1].fighter.soulState.verse2098.golden,true);assert.equal(g.slots[0][2].fighter.soulState.verse2098.golden,true);assert.throws(()=>T.replace(g,[1,null]),/请选择阵亡方的替补/);
});
test('第50回合真实全灭优先普通胜负，不把仍存活人数相等误判为平局',()=>{
 let g=T.create([[member(4000,{maxHp:1})],[member(3102,{atk:9999,spe:1000},[10127])]], [0,0],{seed:13,criticals:false});for(let i=0;i<49;i++)g=T.turn(g,[pp,pp]);g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.phase,'finished');assert.equal(g.battle.winner,1);assert.equal(g.battle.teamRoundLimit,undefined);assert.equal(g.battle.turns.length,50);
});
