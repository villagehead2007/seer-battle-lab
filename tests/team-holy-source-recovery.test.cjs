'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('圣华真实场下首次阵亡授剑开启重铸，队友实际击败复活本体，复活后再死不重复授剑',()=>{
 let g;for(let seed=1;seed<=24;seed++){
  g=T.create([[member(3550),member(3056),{...member(2987,10004),build:{overrides:{maxHp:9000,atk:9999}}}],[member(2988),{...member(4321),build:{overrides:{maxHp:9000,def:1}}}]],[0,0],{seed,criticals:false});g.battle.fighters[0].hp=1;g=T.turn(g,['potion:pp','wiki:19123']);
  if(g.battle.swordReforgeUsed?.[1])break;
 }
 assert.equal(g.battle.swordReforgeUsed?.[1],true);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('帝君之殒')));assert.equal(g.battle.holySwords[1],1);assert.equal(g.battle.swordReforge[1],true);
 assert.match(D.team(g,1).find(x=>x.name==='圣铸资格').value,/已触发/);
 const revived=g.slots[1][1].fighter;assert.equal(revived.hp,revived.stats.maxHp);for(const k of revived.moves)assert.equal(revived.pp[k],revived.teamPPDefinitions[k].pp);assert.equal(g.battle.holySwords[1],1);
 g=T.replace(g,[1,null]);g=T.turn(g,['potion:pp','wiki:19123']);assert.equal(g.battle.holySwords[1],0);
 g=T.turn(g,[{switchTo:2},{switchTo:1}]);assert.ok(g.battle.fighters[1].hp>1);
 g=T.turn(g,['wiki:10004','potion:pp']);assert.equal(g.battle.fighters[1].hp,0);assert.equal(g.battle.holySwords[1],0);assert.equal(g.battle.swordReforgeUsed[1],true);assert.equal(g.battle.swordReforge[1],false);
});
test('被处决者真实登场解除处决后，圣华35620为下一回合重新选择实际场下目标',()=>{
 let g=T.create([[member(4321,35620)],[member(3056),member(2988),member(3102)]],[0,0],{seed:13,criticals:false});const target=g.slots[1].findIndex(s=>s.fighter.soulState.execution1547);assert.ok(target>0);
 g=T.turn(g,['potion:pp',{switchTo:target}]);assert.equal(g.battle.fighters[1].soulState.execution1547,undefined);assert.ok(!g.slots[1].some(s=>s.fighter.soulState.execution1547));
 const r=g.battle.round;g=T.turn(g,['wiki:35620','potion:pp']);assert.equal(g.battle.fighters[0].soulState.repeatExecutionRound,r+1);
 g=T.turn(g,['potion:pp','potion:pp']);const chosen=g.slots[1].flatMap((s,i)=>s.fighter.soulState.execution1547?[i]:[]);assert.equal(chosen.length,1);assert.notEqual(chosen[0],g.active[1]);assert.equal(g.slots[1][chosen[0]].fighter.soulState.execution1547.start,r+1);
});
test('圣华真实返场只补零PP至一，当前敌印记一层和两层分别授一回合与两回合登场免疫',()=>{
 const pure=store.species(4321).moves.find(m=>m.id===35610);assert.ok(pure);let g=T.create([[member(4321,pure.id),member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 const key='wiki:'+pure.id;g.battle.fighters[0].pp[key]=0;
 for(const marks of [1,2]){
  if(marks===2){g=T.turn(g,[key,'potion:pp']);assert.equal(g.battle.fighters[0].pp[key],0);}g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[1].soulState.executionMarks,marks);
  const entry=g.battle.round;g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].pp[key],1);assert.equal(g.battle.fighters[0].soulState.coronationEnd,entry+(marks===2?1:0));
 }
});
test('圣华真实35620只在被处决者严格低于半体时排下回合重处决，半体及以上不重排',()=>{
 for(const hp of [4499,4500,4501]){
  let g=T.create([[member(4321,35620)],[member(3056),member(2988),member(3102)]],[0,0],{seed:13,criticals:false});const index=g.slots[1].findIndex(s=>s.fighter.soulState.execution1547);assert.ok(index>0);g.slots[1][index].fighter.hp=hp+100;
  g=T.turn(g,['wiki:35620','potion:pp']);assert.equal(g.slots[1][index].fighter.hp,hp);assert.equal(g.battle.fighters[0].soulState.repeatExecutionRound===2,hp<4500,JSON.stringify({hp,index,max:g.slots[1][index].fighter.stats.maxHp,state:g.slots[1][index].fighter.soulState}));
  if(hp<4500){const before=structuredClone(g);assert.ok(D.fighter(g.battle.fighters[0],g.battle.round).items.some(x=>x.name==='再次处决'));assert.deepEqual(g,before);g=T.turn(g,['potion:pp','potion:pp']);const selected=g.slots[1].findIndex(s=>s.fighter.soulState.execution1547);assert.ok(selected>0&&selected!==index);assert.equal(g.slots[1][selected].fighter.soulState.execution1547.start,2);}
 }
});
test('圣华实际27840在敌实际用攻后只清两槽PP并加一剑，用药不触发',()=>{
 let g=T.create([[member(4321,27840)],[member(3056,10127),member(2988)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:27840','potion:pp']);assert.equal(g.battle.holySwords[0],0);
 g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.battle.holySwords[0],1);assert.equal(Object.values(g.battle.fighters[1].pp).filter(n=>n===0).length,2);
});
