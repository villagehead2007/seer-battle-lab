'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,make,turn,loadout}=require('./helpers/3001-native.cjs'),store=require('../local-species.cjs'),pp='potion:pp';
test('3001神王872成功吸强封属与180清回合同招共存，原生必暴被清而新封属当前两回合保留并到期',()=>{
 let s=make(19141,{enemyMoves:[20889,20355]});s=turn(s,pp,20889);s=turn(s,pp,20355);assert.ok(s.fighters[1].effects['必定暴击']);s=turn(s,19141);assert.equal(s.fighters[0].stages.spe,1);assert.equal(s.fighters[1].stages.spe,0);assert.equal(s.fighters[1].effects['必定暴击'],undefined);assert.equal(s.fighters[0].effects.heldStatusBlock?.start,3);assert.equal(s.fighters[0].effects.heldStatusBlock?.end,4);s=turn(s,pp,20889);assert.equal(s.fighters[1].stages.spe,0);s=turn(s,pp,20889);assert.equal(s.fighters[1].stages.spe,1);
});
test('3001神王872遇真实繁苍强化保护吸取失败不封属，180仍清原回合保护且下次真正吸取成功才封',()=>{
 let s=make(19141,{enemyId:3549,enemyMoves:[29392]});s=turn(s,pp,29392);const beforeA={...s.fighters[0].stages},beforeB={...s.fighters[1].stages};assert.ok(Object.values(beforeB).some(n=>n>0));s=turn(s,19141);assert.deepEqual(s.fighters[0].stages,beforeA);assert.deepEqual(s.fighters[1].stages,beforeB);assert.equal(s.fighters[0].effects.heldStatusBlock,undefined);s=turn(s,19141);assert.ok(s.fighters[0].effects.heldStatusBlock);for(const n of Object.values(s.fighters[1].stages))assert.equal(n,0);
});
test('3001神王没有正级或自身禁强化时不封属，失败不借同招清回合伪造吸取成功',()=>{
 let s=turn(make(19141),19141);assert.equal(s.fighters[0].effects.heldStatusBlock,undefined);s=make(19141,{enemyMoves:[20889],aEffects:{禁强化:{start:1,end:4}}});s=turn(s,pp,20889);s=turn(s,19141);assert.equal(s.fighters[1].stages.spe,0);assert.equal(s.fighters[0].stages.spe,0);assert.equal(s.fighters[0].effects.heldStatusBlock,undefined);
});
test('872共同失败门槛覆盖文森特两真实魂印曜灵重锋：受保护的正级不可吸取，也不能错误封属',()=>{
 for(const soul of [1797,1864]){const a=store.species(4589),b=store.species(3549);a.selectedSoulId=soul;const loadouts=[loadout(a,[37036]),loadout(b,[29392])];assert.equal(E.WIKI.assess(a,loadouts[0]).supported,true);let s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:loadouts,seed:2,criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}},{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:100}}]});s=E.resolveTurn(s,[pp,'wiki:29392']);const stages={...s.fighters[1].stages};assert.ok(Object.values(stages).some(n=>n>0));s=E.resolveTurn(s,['wiki:37036',pp]);assert.deepEqual(s.fighters[1].stages,stages);assert.equal(s.fighters[0].effects.heldStatusBlock,undefined);}
});
