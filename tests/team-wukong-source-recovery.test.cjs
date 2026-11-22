'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id){const snapshot=store.species(id);return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000}}};}
test('孙悟空法天象地离场立即消失但每场一次资格不恢复，返场低体异常不再回满',()=>{
 let g=T.create([[member(4524),member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 assert.equal(D.fighter(g.battle.fighters[0],g.battle.round).items.find(x=>x.name==='法天象地·圣').value,'可用 1 次');
 g.battle.fighters[0].hp=4000;g.battle.fighters[0].ailments['睡眠']=3;
 g=T.turn(g,['potion:pp','potion:pp']);
 assert.equal(g.battle.fighters[0].hp,9000);assert.equal(g.battle.fighters[0].soulState.wukongSaintSpent,true);
 assert.equal(g.battle.fighters[0].soulState.wukongSaintEnd,3);assert.equal(g.battle.fighters[0].ailments['睡眠'],undefined);
 assert.equal(D.fighter(g.battle.fighters[0],g.battle.round).items.find(x=>x.name==='法天象地·圣').value,'本场已使用');
 assert.match(D.fighter(g.battle.fighters[0],g.battle.round).items.find(x=>x.name==='法天象地·圣强化').value,/余 2 回合/);
 g=T.turn(g,[{switchTo:1},'potion:pp']);const reserve=g.slots[0][0].fighter;
 assert.equal(reserve.soulState.wukongSaintSpent,true);assert.equal(reserve.soulState.wukongSaintEnd,undefined);
 assert.equal(D.team(g,0).find(x=>x.name==='孙悟空 · 法天象地·圣').value,'本场已使用');
 assert.equal(D.team(g,0).find(x=>x.name==='孙悟空 · 法天象地·圣强化'),undefined);
 g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.wukongSaintSpent,true);
 // Independent reachable initial spent-qualification boundary, after the native earning and return above.
 g=T.create([[member(4524),member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});const f=g.battle.fighters[0];f.soulState.wukongSaintSpent=true;f.hp=4000;f.ailments['睡眠']=g.battle.round+2;
 g=T.turn(g,['potion:pp','potion:pp']);
 assert.equal(g.battle.fighters[0].hp,4000);assert.equal(g.battle.fighters[0].soulState.wukongSaintEnd,undefined);
 assert.ok(g.battle.fighters[0].ailments['睡眠']>=g.battle.round);
});
