'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,soul=null){const snapshot=store.species(id);if(soul!==null)snapshot.selectedSoulId=soul;const moves=id===3056?[19369,20117,20307,20380,23285]:E.WIKI.defaultMoves(snapshot);return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000}}};}
{
 const soul=1797;test('文森特1797真实首次晚登场按敌实际零至五个已耗PP槽授一至六回烧伤，返场重新按当前PP与满体判断',()=>{
  const skills=[20117,20307,20380,23285,19369];for(let used=0;used<=5;used++){
   let g=T.create([[member(3056),member(4589,soul)],[member(3056)]],[0,0],{seed:14,criticals:false});assert.ok(!g.battle.fighters[1].ailments['烧伤']);for(const id of skills.slice(0,used))g=T.turn(g,['potion:pp','wiki:'+id]);const foe=g.battle.fighters[1];assert.equal(foe.hp,foe.stats.maxHp);assert.equal(foe.moves.filter(k=>foe.pp[k]===g.battle.moveDefinitions[k].pp).length,5-used);const round=g.battle.round;g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].soulId,soul);const applied=g.battle.entryStatusEvents.find(e=>e.targetSide===1&&e.status==='烧伤');assert.ok(applied.applied);assert.equal(applied.endRound,round+5-used);assert.equal(applied.appliedDuration,6-used);assert.equal(g.battle.fighters[1].ailments['烧伤'],used===5?undefined:round+5-used);assert.ok(g.battle.damageEvents.some(e=>e.round===round&&e.targetSide===1&&e.type==='true'&&e.settledDamage===1125));
   g=T.turn(g,[{switchTo:0},'wiki:23285']);assert.equal(g.battle.fighters[1].hp,9000);assert.ok(!g.battle.fighters[1].ailments['烧伤']);const next=g.battle.round;g=T.turn(g,[{switchTo:1},'potion:hp']);assert.equal(g.battle.fighters[1].ailments['烧伤'],next+4);
  }
 });
 test('文森特1797真实返场敌差一HP不施烧伤，实际英勇圣甲免异常阻挡且不误授',()=>{
  let g=T.create([[member(3056),member(4589,soul)],[member(3056)]],[0,0],{seed:14,criticals:false});g.battle.fighters[1].hp=8999;g=T.turn(g,[{switchTo:1},'potion:pp']);assert.ok(!g.battle.fighters[1].ailments['烧伤']);
  const foe=member(3056);foe.moves[1]=23287;g=T.create([[member(3056),member(4589,soul)],[foe]],[0,0],{seed:14,criticals:false});g=T.turn(g,['potion:pp','wiki:23287']);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.ok(!g.battle.fighters[1].ailments['烧伤']);assert.ok(g.battle.fighters[1].effects['免异常'].end>=g.battle.round);
 });

}

{
 const soul=1864;test('文森特1864真实首次晚登场按敌实际零至五个已耗PP槽授一至六回烧伤，返场重新按当前PP与满体判断',()=>{
  const skills=[20117,20307,20380,23285,19369];for(let used=0;used<=5;used++){
   let g=T.create([[member(3056),member(4589,soul)],[member(3056)]],[0,0],{seed:14,criticals:false});assert.ok(!g.battle.fighters[1].ailments['烧伤']);for(const id of skills.slice(0,used))g=T.turn(g,['potion:pp','wiki:'+id]);const foe=g.battle.fighters[1];assert.equal(foe.hp,foe.stats.maxHp);assert.equal(foe.moves.filter(k=>foe.pp[k]===g.battle.moveDefinitions[k].pp).length,5-used);const round=g.battle.round;g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].soulId,soul);const applied=g.battle.entryStatusEvents.find(e=>e.targetSide===1&&e.status==='烧伤');assert.ok(applied.applied);assert.equal(applied.endRound,round+5-used);assert.equal(applied.appliedDuration,6-used);assert.equal(g.battle.fighters[1].ailments['烧伤'],used===5?undefined:round+5-used);assert.ok(g.battle.damageEvents.some(e=>e.round===round&&e.targetSide===1&&e.type==='true'&&e.settledDamage===1125));
   g=T.turn(g,[{switchTo:0},'wiki:23285']);assert.equal(g.battle.fighters[1].hp,9000);assert.ok(!g.battle.fighters[1].ailments['烧伤']);const next=g.battle.round;g=T.turn(g,[{switchTo:1},'potion:hp']);assert.equal(g.battle.fighters[1].ailments['烧伤'],next+4);
  }
 });
 test('文森特1864真实返场敌差一HP不施烧伤，实际英勇圣甲免异常阻挡且不误授',()=>{
  let g=T.create([[member(3056),member(4589,soul)],[member(3056)]],[0,0],{seed:14,criticals:false});g.battle.fighters[1].hp=8999;g=T.turn(g,[{switchTo:1},'potion:pp']);assert.ok(!g.battle.fighters[1].ailments['烧伤']);
  const foe=member(3056);foe.moves[1]=23287;g=T.create([[member(3056),member(4589,soul)],[foe]],[0,0],{seed:14,criticals:false});g=T.turn(g,['potion:pp','wiki:23287']);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.ok(!g.battle.fighters[1].ailments['烧伤']);assert.ok(g.battle.fighters[1].effects['免异常'].end>=g.battle.round);
 });

}
