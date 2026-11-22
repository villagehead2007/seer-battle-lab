'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,soul,skill){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;const moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('原霍德尔真实种黑暗之种后击败，只令实际下一位随机两槽PP归零',()=>{
 let g=T.create([[member(3941,1204,33695)],[member(2988),member(3056),member(2987)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:33695','potion:pp']);assert.ok(g.battle.fighters[1].soulState.darkSeed);
 const before=structuredClone(g);assert.match(D.fighter(g.battle.fighters[1],g.battle.round).items.find(x=>x.name==='黑暗之种').value,/来源 A 方/);assert.deepEqual(g,before);
 g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:33695','potion:pp']);assert.equal(g.phase,'replace');const untouched={...g.slots[1][1].fighter.pp};
 const queued=structuredClone(g);assert.ok(D.team(g,1).some(x=>x.name==='霍德尔 · 随机 2 招 PP 归零'));assert.deepEqual(g,queued);
 g=T.replace(g,[null,2]);assert.equal(Object.values(g.battle.fighters[1].pp).filter(n=>n===0).length,2);assert.deepEqual(g.slots[1][1].fighter.pp,untouched);
});
test('用户确认晦暗之因场下暂停：真实换下多个回合不扣PP不成长，回场当回合只继续一级且源不在场不误回PP',()=>{
 let g=T.create([[member(3941,1834,37239),member(3056)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:37239','potion:pp']);assert.equal(g.battle.fighters[1].soulState.darkCause.level,2);const pp={...g.battle.fighters[1].pp};
 g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.slots[1][0].fighter.soulState.darkCause.level,2);assert.deepEqual(g.slots[1][0].fighter.pp,pp);
 const paused=structuredClone(g);assert.match(D.team(g,1).find(x=>x.name.endsWith('· 晦暗之因')).value,/场下不扣PP、不成长/);assert.deepEqual(g,paused);
 g=T.turn(g,[{switchTo:1},'potion:pp']);for(let i=0;i<2;i++){g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.slots[1][0].fighter.soulState.darkCause.level,2);assert.deepEqual(g.slots[1][0].fighter.pp,pp);}
 const sourcePP={...g.slots[0][0].fighter.pp};for(const k of g.battle.fighters[0].moves)g.battle.fighters[0].pp[k]=0;
 g=T.turn(g,['potion:hp',{switchTo:0}]);assert.equal(g.battle.fighters[1].soulState.darkCause.level,3);for(const k of g.battle.fighters[1].moves)assert.equal(g.battle.fighters[1].pp[k],Math.max(0,pp[k]-1));assert.ok(Object.values(g.battle.fighters[0].pp).every(n=>n===0));assert.deepEqual(g.slots[0][0].fighter.pp,sourcePP);
});
test('晦暗之因仍从在场持有者扣PP，霍德尔下场后不把吸取PP误回给接替队友',()=>{
 let g=T.create([[member(3941,1834,37239),member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:37239','potion:pp']);assert.equal(g.battle.fighters[1].soulState.darkCause.level,2);
 for(const k of g.slots[0][1].fighter.moves)g.slots[0][1].fighter.pp[k]=0;
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[1].soulState.darkCause.level,3);
 assert.ok(Object.values(g.battle.fighters[0].pp).every(n=>n===0));
 for(const k of g.battle.fighters[1].moves)assert.equal(g.battle.fighters[1].pp[k],g.battle.moveDefinitions[k].pp-1);
});
test('觉醒霍德尔真实成熟后收获一根，根离场保留且击败只清实际继任者一槽PP',()=>{
 let g=T.create([[member(3941,1834,37239),member(3056)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:37239','potion:pp']);for(let i=0;i<3;i++)g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[1].soulState.darkCause.level,5);
 const mature=structuredClone(g);assert.equal(D.fighter(g.battle.fighters[1],g.battle.round).items.find(x=>x.name==='晦暗之因成熟').value,'回复效果 -25%');assert.deepEqual(g,mature);
 g=T.turn(g,['wiki:37239','potion:pp']);assert.equal(g.battle.fighters[0].soulState.darkRoots,1);assert.equal(g.battle.fighters[1].soulState.darkCause,undefined);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.soulState.darkRoots,1);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.darkRoots,1);
 g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:37239','potion:pp']);assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);assert.equal(Object.values(g.battle.fighters[1].pp).filter(n=>n===0).length,1);
});
