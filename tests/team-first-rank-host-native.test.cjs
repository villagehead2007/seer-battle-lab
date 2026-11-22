'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function member(id,moves,spe,soul){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;return {snapshot,moves:loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe}}};}
test('真实燃血1090/1129与753同一档，双方换座位后同档房主先行，胜过对手数值先制与速度且身份跨回合固定',()=>{
 for(const soul of [1090,1129])for(const bloodSide of [0,1])for(const host of [0,1]){
  const bloodHost=host===bloodSide,blood=member(3815,[10499,33031],bloodHost?1:4000,soul),pony=member(5000,[10993,17912],bloodHost?4000:1),teams=bloodSide?[[pony],[blood]]:[[blood],[pony]];
  let g=T.create(teams,[0,0],{seed:14,criticals:false,challengedSide:host});g.battle.fighters[bloodSide].hp=1000;
  assert.equal(g.battle.challengedSide,host);g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[bloodSide].soulState.bloodBurnRound,2);
  const choices=[];choices[bloodSide]='wiki:'+(bloodHost?10499:33031);choices[1-bloodSide]='wiki:'+(bloodHost?17912:10993);g=T.turn(g,choices);
  assert.equal(g.battle.turns.at(-1).first,host);assert.equal(g.battle.challengedSide,host);
  const order=g.battle.firstOrderComparisons.at(-1);assert.equal(order.winner,host);assert.equal(Math.min(...order.candidates[0].map(p=>p.rank)),1);assert.equal(Math.min(...order.candidates[1].map(p=>p.rank)),1);
 }
});
test('真实队伍默认随机房主可由初始种子复现，两方皆可被选中，替换不改变本场身份',()=>{
 const hosts=new Set();for(let seed=1;seed<=12;seed++){const teams=[[member(2989,[10086],1000),member(3013,[],1000)],[member(5000,[10993],100)]];const a=T.create(teams,[0,0],{seed,criticals:false}),b=T.create(teams,[0,0],{seed,criticals:false});assert.equal(a.battle.challengedSide,b.battle.challengedSide);hosts.add(a.battle.challengedSide);const entered=T.turn(a,[{switchTo:1},'potion:pp']);assert.equal(entered.active[0],1);assert.equal(entered.battle.challengedSide,a.battle.challengedSide);}assert.deepEqual([...hosts].sort(),[0,1]);
});
