'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),D=require('../dist/battle-display.js');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const pp='potion:pp';
test('伏尔格安真实受伤换下再登场重取体差并授予三回命印，到期反转后再次登场刷新',()=>{
 let g=T.create([[member(4625),member(2988)],[member(3102,[10127]),member(2988)]],[0,0],{seed:14,criticals:false});
 assert.equal(g.battle.fighters[0].soulState.lifeMarks1831?.lost,undefined);
 g=T.turn(g,[pp,'wiki:10127']);assert.ok(g.battle.fighters[0].hp<9000);const damaged=g.battle.fighters[0].hp;
 g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);
 let a=g.battle.fighters[0],b=g.battle.fighters[1];assert.equal(a.soulState.lifeEntry1831.round,3);assert.equal(a.soulState.lifeEntry1831.halfDifference,(9000-damaged)/2);assert.deepEqual(a.soulState.lifeMarks1831.lost,{start:3,end:5,sourceSide:0});assert.deepEqual(b.soulState.lifeMarks1831.return,{start:3,end:5,sourceSide:0});
 const before=structuredClone(g);D.fighter(a,g.battle.round,g.battle.moveDefinitions);D.team(g,0);assert.deepEqual(g,before);
 g=T.turn(g,[pp,pp]);g=T.turn(g,[pp,pp]);a=g.battle.fighters[0];b=g.battle.fighters[1];assert.equal(a.soulState.lifeMarks1831.lost,undefined);assert.equal(b.soulState.lifeMarks1831.return,undefined);assert.equal(a.hp,9000-damaged);assert.equal(b.hp,1);assert.equal(a.soulState.lifeReversals1831.length,1);
 g=T.turn(g,[{switchTo:1},{switchTo:1}]);g=T.turn(g,[{switchTo:0},pp]);a=g.battle.fighters[0];b=g.battle.fighters[1];assert.equal(a.soulState.lifeEntry1831.round,7);assert.equal(a.soulState.lifeEntry1831.halfDifference,(9000-a.hp)/2);assert.deepEqual(a.soulState.lifeMarks1831.lost,{start:7,end:9,sourceSide:0});assert.deepEqual(b.soulState.lifeMarks1831.return,{start:7,end:9,sourceSide:0});assert.equal(g.slots[1][0].fighter.soulState.lifeMarks1831?.return,undefined);
});
test('伏尔格安真实晚登场只在当前体力严格较低时加印，等值及较高不加印',()=>{
 for(const hp of[8999,9000,9001]){let g=T.create([[member(2988),member(4625,[],{maxHp:9999})],[member(3102)]],[0,0],{seed:14,criticals:false});g.slots[0][1].fighter.hp=hp;g=T.turn(g,[{switchTo:1},pp]);const a=g.battle.fighters[0],b=g.battle.fighters[1];assert.equal(a.soulState.lifeEntry1831.halfDifference,Math.abs(hp-9000)/2);assert.equal(!!a.soulState.lifeMarks1831?.lost,hp<9000);assert.equal(!!b.soulState.lifeMarks1831?.return,hp<9000);assert.equal(a.hp,hp);}
});

