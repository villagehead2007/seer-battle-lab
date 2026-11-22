'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function member(id,moves,hp=9000){const snapshot=store.species(id);return{snapshot,moves:loadout(snapshot,moves),build:{overrides:{maxHp:hp,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
test('真实31505继承状态展示分开技能必先计数与攻击必暴计数，展示只读且不提前消费',()=>{
 let g=T.create([[member(3512,[31505]),member(2989,[20889,10086],6000)],[member(5000,[10993])]], [0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:31505','potion:pp']);g=T.replace(g,[1,null]);
 function view(){const before=structuredClone(g),f=g.battle.fighters[0],out=D.fighter(f,g.battle.round,g.battle.moveDefinitions,g.battle).items;assert.deepEqual(g,before);return out;}
 let rows=view();assert.match(rows.find(x=>x.name==='守御八方 · 必先').value,/第3档.*余 2 次技能.*伪必中/);assert.match(rows.find(x=>x.name==='守御八方 · 攻击必暴').value,/余 2 次攻击/);
 g=T.turn(g,['wiki:20889','potion:pp']);rows=view();assert.match(rows.find(x=>x.name==='守御八方 · 必先').value,/余 1 次技能/);assert.match(rows.find(x=>x.name==='守御八方 · 攻击必暴').value,/余 2 次攻击/);
 g=T.turn(g,['wiki:10086','potion:pp']);rows=view();assert.equal(rows.find(x=>x.name==='守御八方 · 必先'),undefined);assert.match(rows.find(x=>x.name==='守御八方 · 攻击必暴').value,/余 1 次攻击/);
});
