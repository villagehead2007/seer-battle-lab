'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skills=[]){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);let index=1;for(const skill of skills)if(!moves.includes(skill))moves[index++]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:2000,spd:2000}}};}
test('紫烬魔兽实际首次晚登场附三回命，真实返场已有回命仅在清强或清回合成功时焚烬',()=>{
 let g=T.create([[member(2987),member(4669)],[member(3056)]],[0,0],{seed:14,criticals:false});assert.ok(!g.battle.fighters[1].soulState.lifeMarks1831?.return);g=T.turn(g,['potion:pp','potion:pp']);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[1].soulState.lifeMarks1831.return.end,g.battle.round+1);assert.ok(!g.battle.fighters[1].ailments['焚烬']);
 for(const skill of [null,20117,23285]){
  g=T.create([[member(4669),member(2987)],[member(3056,skill?[skill]:[])]],[0,0],{seed:14,criticals:false});
  g=T.turn(g,[{switchTo:1},skill?'wiki:'+skill:'potion:pp']);if(skill===20117)assert.equal(g.battle.fighters[1].stages.atk,1);if(skill===23285)assert.ok(g.battle.fighters[1].effects['必定暴击']);
  g=T.turn(g,[{switchTo:0},'potion:pp']);const foe=g.battle.fighters[1];assert.equal(foe.stages.atk,0);assert.equal(foe.effects['必定暴击'],undefined);assert.equal((foe.ailments['焚烬']??0)>=g.battle.round-1,!!skill);assert.equal(foe.soulState.lifeMarks1831.return.end,g.battle.round+1);
  const before=structuredClone(g);D.fighter(foe,g.battle.round);assert.deepEqual(g,before);
 }
});
