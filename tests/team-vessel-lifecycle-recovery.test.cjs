'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
const pp='potion:pp';
function member(id,stats={}){const snapshot=store.species(id);return{snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
test('SP首发或场下均在开战获得真实四记录，仅本人绑定神魂之器且双方资源独立',()=>{
 for(const lead of [0,1]){const g=T.create([[member(3102),member(13311)],[member(13311),member(3056)]],[lead,0],{seed:14,criticals:false});
  for(const side of [0,1]){const field=g.battle.teamVessel2162[side];assert.equal(field.sourceHash,'3838a9fb');assert.deepEqual(field.state.records,['ailment','weakness','percent','fixed']);assert.equal(field.state.removed,0);const owner=g.slots[side].find(x=>x.fighter.soulId===2162).fighter;assert.strictEqual(owner.soulState.divineVessel,field.state);assert.equal(g.slots[side].find(x=>x.fighter.soulId!==2162).fighter.soulState.divineVessel,undefined);}
  assert.notStrictEqual(g.battle.teamVessel2162[0].state,g.battle.teamVessel2162[1].state);
  const before=structuredClone(g);assert.equal(D.team(g,0).find(x=>x.name==='神魂之器').value,'异常状态、能力下降、百分比伤害、固定伤害');D.team(g,1);assert.deepEqual(g,before);
 }
});
test('SP真实第五变神灵移末记录，实际换出恢复来源属性，反复登场按固定百分比弱化异常顺序耗尽且不重置',()=>{
 let g=T.create([[member(13311,{maxHp:1000,def:30}),member(3102)],[member(3102,{maxHp:9999,atk:9999})]],[0,0],{seed:14,criticals:false});const original=g.battle.fighters[0].type;assert.equal(original,'远古 圣灵');
 const order=['fixed','percent','weakness','ailment'];
 for(let i=0;i<4;i++){
  // 第五只在记录数大于1时发自身致死信号；最后一项必须由真实敌方致死攻击移除。
  g=T.turn(g,i<3?['wiki:38626',pp]:[pp,'wiki:19564']);let f=g.battle.fighters[0],st=g.battle.teamVessel2162[0].state;
  assert.equal(f.type,'神灵');assert.equal(st.removed,i+1);assert.equal(st.history.filter(e=>e.kind==='lethal-immunity').at(-1).removed,order[i]);assert.equal(st.records.length,3-i);assert.strictEqual(f.soulState.divineVessel,st);
  const hp=f.hp,spent=f.pp['wiki:38626'];g=T.turn(g,[{switchTo:1},pp]);f=g.slots[0][0].fighter;st=g.battle.teamVessel2162[0].state;
  assert.equal(f.type,original);assert.equal(f.hp,hp);assert.equal(f.pp['wiki:38626'],spent);assert.equal(st.removed,i+1);assert.equal(st.records.length,3-i);assert.strictEqual(f.soulState.divineVessel,st);assert.equal(g.battle.fighters[0].soulState.divineVessel,undefined);
  g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].type,original);assert.equal(g.battle.fighters[0].soulState.divineVessel.removed,i+1);
 }
 assert.deepEqual(g.battle.teamVessel2162[0].state.records,[]);assert.equal(g.battle.teamVessel2162[0].state.removed,4);
 const before=structuredClone(g);assert.equal(D.team(g,0).find(x=>x.name==='神魂之器').value,'记录已耗尽');assert.match(D.team(g,0).find(x=>x.name==='神魂已移除记录').value,/4 项/);assert.deepEqual(g,before);
});
