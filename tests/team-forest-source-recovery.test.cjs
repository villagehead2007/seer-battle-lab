'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('场下玛洛迪斯树海对实际在场队友受50真实伤害触发消强消回合，无树海对照保留',()=>{
 for(const forest of [false,true]){
  let g=T.create([[member(forest?3739:2988,forest?29211:null),member(3056)],[member(3986,33888)]],[0,0],{seed:13,criticals:false});
  const foe=g.battle.fighters[1];foe.stages.atk=2;foe.effects['攻击必中']={start:1,end:99};g=T.turn(g,[{switchTo:1},'potion:pp']);
  const r=g.battle.round;g=T.turn(g,['potion:pp','wiki:33888']);assert.ok(g.battle.damageEvents.some(e=>e.round===r&&e.targetSide===0&&e.type==='true'&&e.settledDamage===50));
  assert.equal(!!g.battle.fighters[1].effects['攻击必中'],!forest);assert.equal(g.battle.fighters[1].stages.atk,forest?0:2);
 }
});
test('场下树海回合末真实代触发灵魂指引回复在场队友并附粉，PP只回给玛洛迪斯',()=>{
 const own=member(3739,29211);own.build.overrides.maxHp=1000;
 let g=T.create([[own,member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});g.slots[0][1].fighter.hp=5000;
 const owner=g.battle.fighters[0],key=owner.moves[2];owner.pp[key]=0;
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.ok(g.battle.fighters[0].hp>=5100&&g.battle.fighters[0].hp<=5200);
 assert.equal(g.slots[0][0].fighter.pp[key],2);assert.equal(g.slots[0][0].fighter.hp,1210);
 assert.ok(g.battle.damageEvents.some(e=>e.round===1&&e.sourceSide===0&&e.type==='fixed'&&e.settledDamage>=100&&e.settledDamage<=200));
});
test('玛洛迪斯在场及场下树海生命力与代触发次数可见，展示不改变生命力或随机序列',()=>{
 const own=member(3739,29211);own.build.overrides.maxHp=1000;let g=T.create([[own,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 const before=structuredClone(g);assert.match(D.fighter(g.battle.fighters[0],g.battle.round).items.find(x=>x.name==='苍茫树海').value,/生命力 210.*1 次/);assert.deepEqual(g,before);
 g=T.turn(g,[{switchTo:1},'potion:pp']);const bench=structuredClone(g);assert.ok(D.team(g,0).some(x=>x.name.includes('苍茫树海')&&x.value.includes('210')));assert.deepEqual(g,bench);
});
