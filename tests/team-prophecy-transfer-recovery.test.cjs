'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const D=require('../dist/battle-display.js');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const make=(next=3056)=>T.create([[member(4709,[10001],{atk:9999}),member(3102)],[member(3102,[],{def:1}),member(4647),member(next)]],[0,0],{seed:14,criticals:false});
test('吉尼亚斯真实低半体用撞击先麻痹后击败，将死亡目标尚存异常和当时剩余回合转给所选第三后继',()=>{
 let g=make();g.battle.fighters[0].hp=4000;g.battle.fighters[1].ailments['烧伤']=5;g.battle.fighters[1].ailments['沉默']=4;g=T.turn(g,['wiki:10001','potion:pp']);assert.equal(g.phase,'replace');const corpse=g.battle.fighters[1],expected=Object.fromEntries(Object.entries(corpse.ailments).filter(([k,end])=>end>=g.battle.round-1).map(([k,end])=>[k,end-(g.battle.round-1)+1]));assert.ok(expected['麻痹']>0);console.log(JSON.stringify({pending:g.battle.teamEntryGrants,source:g.battle.fighters[0].soulState.prophecyTransfer1912,corpse:corpse.ailments}));g=T.replace(g,[null,2]);for(const[k,n]of Object.entries(expected))assert.equal(g.battle.fighters[1].ailments[k],g.battle.round+n-1);assert.equal(g.slots[1][1].fighter.ailments['麻痹'],undefined);assert.equal(g.battle.teamEntryGrants[1].length,0);
});
test('吉尼亚斯真实转移逐种经过后继免异常与库比转换，原剩余时长入场传递且预约中文只读',()=>{
 for(const next of [3056,4658]){let g=make(next);if(next===3056)g.slots[1][2].fighter.counts.immune=1;g.battle.fighters[0].hp=4000;g.battle.fighters[1].ailments['烧伤']=5;g.battle.fighters[1].ailments['沉默']=4;g=T.turn(g,['wiki:10001','potion:pp']);const before=structuredClone(g);assert.match(D.team(g,1).find(x=>x.name==='下只登场异常转移').value,/A 方吉尼亚斯.*烧伤 5 回合.*沉默 4 回合.*麻痹.*登场消费/);assert.deepEqual(g,before);g=T.replace(g,[null,2]);const f=g.battle.fighters[1];if(next===3056){assert.equal(f.ailments['烧伤'],undefined);assert.equal(f.counts.immune,0);assert.equal(f.ailments['沉默'],g.battle.round+3);assert.ok(f.ailments['麻痹']>=g.battle.round);}else{assert.equal(f.ailments['烧伤'],undefined);assert.equal(f.ailments['麻痹'],undefined);assert.equal(f.ailments['沉默'],g.battle.round+2);assert.deepEqual(f.soulState.memory1860.records.map(x=>x.name),['烧伤','沉默','麻痹']);assert.equal(f.soulState.memory1860.records[0].requestedDuration,5);}}
});
test('吉尼亚斯真实满体一击击败无麻目标不转任何异常，保留己方魂印严格低半体条件',()=>{
 let g=make();g.battle.fighters[1].ailments['烧伤']=4;g=T.turn(g,['wiki:10001','potion:pp']);assert.equal(g.phase,'replace');g=T.replace(g,[null,2]);assert.equal(g.battle.fighters[1].ailments['烧伤'],undefined);assert.equal(g.battle.fighters[1].ailments['麻痹'],undefined);
});

