'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skill,soul){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;const moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,def:4000}}};}
function foe(){const f=member(3056,10716);if(!f.moves.includes(10127))f.moves[2]=10127;f.build.overrides.atk=9999;return f;}

test('用户确认镇世原魂印末员减伤仅本次在场：队友恢复存活时仍保留，下场清除，返场重新按存亡授予',()=>{
 let g=T.create([[{...member(3056),build:{overrides:{maxHp:9000,def:1}}},member(4186,null,1409),member(2988)],[foe()]],[0,0],{seed:14,criticals:false});
 g.slots[0][2].fighter.hp=0;g.battle.fighters[0].hp=1;
 g=T.turn(g,['potion:pp','wiki:10716']);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 assert.equal(g.battle.fighters[0].suitState.shield,250);assert.equal(g.battle.fighters[0].soulState.townLastProtection,true);
 const before=structuredClone(g);assert.match(D.fighter(g.battle.fighters[0],g.battle.round).items.find(x=>x.name==='镇世守护').value,/本次在场.*下场清除/);assert.deepEqual(g,before);
 // The real last-member KO/entry has been proved above. This separate legal post-revival initial qualification tests retention, without claiming to run a revival skill.
 g=T.create([[{...member(3056),build:{overrides:{maxHp:9000,def:1}}},member(4186,null,1409),member(2988)],[foe()]],[1,0],{seed:14,criticals:false});g.slots[0][2].fighter.hp=0;g.battle.fighters[0].soulState.townLastProtection=true;g.battle.fighters[0].suitState.shield=250;
 function hit(){const round=g.battle.round;g=T.turn(g,['potion:pp','wiki:10716']);const event=g.battle.damageEvents.find(e=>e.round===round&&e.sourceSide===1&&e.type==='fixed');assert.ok(event,JSON.stringify(g.battle.turns.at(-1)));return event.settledDamage;}
 assert.equal(hit(),37);
 g=T.turn(g,[{switchTo:0},'potion:pp']);assert.ok(!g.slots[0][1].fighter.soulState.townLastProtection);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].suitState.shield,350);assert.ok(!g.battle.fighters[0].soulState.townLastProtection);
 assert.ok(!D.fighter(g.battle.fighters[0],g.battle.round).items.some(x=>x.name==='镇世守护'));
 assert.equal(hit(),50);
 g=T.turn(g,[{switchTo:0},'potion:pp']);assert.ok(g.battle.fighters[0].hp>1);
 g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 assert.equal(g.battle.fighters[0].soulState.townLastProtection,true);assert.equal(g.battle.fighters[0].suitState.shield,250);assert.equal(hit(),37);
});
