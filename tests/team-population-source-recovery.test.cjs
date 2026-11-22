'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('堕魂格特鲁德每个真实阵亡队友增加十个百分点红伤，25%原增伤保留且界面计数一致',()=>{
 function resolve(dead){
  const owner=member(4182,10004);owner.build.overrides.atk=500;
  let g=T.create([[owner,member(3056),member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
  for(let i=0;i<dead;i++)g.slots[0][i+1].fighter.hp=0;
  g.battle.fighters[1].ailments['睡眠']=10;
  const before=structuredClone(g);assert.deepEqual(E.teamPopulation(g.battle,0),{live:3-dead,dead});
  const labels=D.team(g,0);assert.equal(labels.find(x=>x.name==='堕魂攻击增伤').value,'+'+(25+dead*10)+'% · 阵亡 '+dead+' 只');
  assert.equal(!!labels.find(x=>x.name==='背包全阵亡附伤'),dead===2);assert.deepEqual(g,before);
  g=T.turn(g,['wiki:10004','potion:pp']);
  return g.battle.damageEvents.find(e=>e.round===1&&e.sourceSide===0&&e.type==='attack').settledDamage;
 }
 const base=resolve(0);assert.ok(base>0);
 for(const dead of [1,2])assert.ok(Math.abs(resolve(dead)-base*(1.25+dead*.1)/1.25)<=2);
});
