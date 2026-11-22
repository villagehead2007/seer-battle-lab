'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const potion='potion:pp';
function member(id,skills=[]){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);let index=1;for(const skill of skills)if(!moves.includes(skill))moves[index++]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('四象门出战四只但两只同为战斗系时不升阶，换入第五种无交集成员才升六芒阵',()=>{
 let g=T.create([[member(3549,[29392]),...[3056,3223,2987,2988,3809].map(id=>member(id))],[member(3056)]],[0,0],{seed:13,criticals:false});
 for(const i of [1,2,3,4])g=T.turn(g,[{switchTo:i},potion]);
 assert.equal(Object.keys(g.battle.salmonGates[0].visited).length,4);assert.equal(g.battle.salmonGates[0].tier,1);
 g=T.turn(g,[{switchTo:5},potion]);assert.equal(g.battle.salmonGates[0].tier,2);
});
test('四象门攻击附伤与阶段反转共享一次，药剂没有技能触发且不占用阶段末反转',()=>{
 let g=T.create([[member(3549,[29392,10004]),member(3056)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].stages.atk=-1;g.battle.fighters[1].stages.def=1;
 const round=g.battle.round;g=T.turn(g,['wiki:10004',potion]);
 assert.equal(g.battle.fighters[0].stages.atk,-1);
 assert.equal(g.battle.damageEvents.filter(e=>e.round===round&&e.sourceSide===0&&e.type==='fixed'&&e.settledDamage===70).length,1);
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].stages.atk,2);
});
test('实出四种系别后由六芒阵六项升至六级而升八方圻，萨尔蒙下场后敌实际消强仍失败',()=>{
 let g=T.create([[member(3549,[29392]),... [3056,2987,2988,3809].map(id=>member(id,id===3056?[20117]:[]))],[member(3056,[15965]),member(2988)]],[0,0],{seed:13,criticals:false});
 for(const i of [1,2,3,4,0])g=T.turn(g,[{switchTo:i},potion]);assert.equal(g.battle.salmonGates[0].tier,2);
 for(let i=0;i<6;i++)g=T.turn(g,['wiki:29392',{switchTo:1-g.active[1]}]);assert.ok(Object.values(g.battle.fighters[0].stages).every(n=>n===6));assert.equal(g.battle.salmonGates[0].tier,3);
 g=T.turn(g,[{switchTo:1},potion]);for(let i=0;i<2;i++)g=T.turn(g,['wiki:20117',potion]);assert.equal(g.battle.fighters[0].stages.atk,2);
 g=T.turn(g,[potion,'wiki:15965']);assert.equal(g.battle.fighters[0].stages.atk,2);
 assert.equal(g.battle.salmonGates[0].tier,3);
});
