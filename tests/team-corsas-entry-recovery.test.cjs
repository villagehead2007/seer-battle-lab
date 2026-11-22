'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('科萨斯首次受攻后实际血药恢复削减九成，离场终止并在返场恢复正常，下一次受攻重新触发',()=>{
 const foe=member(3056,10127);foe.build.overrides.atk=500;
 let g=T.create([[member(4432),member(2988)],[foe]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=5000;g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.battle.fighters[0].soulState.corsasAttackTriggered,true);
 const initial=g.battle.fighters[0].hp;assert.ok(initial<8750);const normal=structuredClone(g);normal.battle.fighters[0].soulState.corsasAttackTriggered=false;
 const regular=T.turn(normal,['potion:hp','potion:pp']).battle.fighters[0].hp-initial;
 g=T.turn(g,['potion:hp','potion:pp']);assert.ok(regular>0);assert.equal(g.battle.fighters[0].hp-initial,Math.floor(regular*.1));
 assert.match(D.fighter(g.battle.fighters[0],g.battle.round).items.find(x=>x.name==='首次攻击命中资格').value,/恢复减少 90%/);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.soulState.corsasAttackTriggered,undefined);
 g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.corsasAttackTriggered,undefined);
 const returned=g.battle.fighters[0].hp;assert.ok(returned<8750);g=T.turn(g,['potion:hp','potion:pp']);assert.equal(g.battle.fighters[0].hp-returned,regular);
 g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.battle.fighters[0].soulState.corsasAttackTriggered,true);
});
