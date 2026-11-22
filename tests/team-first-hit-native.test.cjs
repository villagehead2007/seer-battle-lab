'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function member(id,moves,hp=9000,spe=1000){const snapshot=store.species(id);return{snapshot,moves:loadout(snapshot,moves),build:{overrides:{maxHp:hp,atk:180,spa:180,def:4000,spd:4000,spe}}};}
function inherit(effect,seed,accuracy){const giver=effect===1275?3512:3001,move=effect===1275?31505:23108;let g=T.create([[member(giver,[move]),member(2989,[10086],6000)],[member(3205,[23505])]], [0,0],{seed,criticals:false});g.slots[0][1].fighter.stages.acc=accuracy;g=T.turn(g,['potion:pp','wiki:23505']);g=T.turn(g,['wiki:'+move,'potion:pp']);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].stages.acc,accuracy);assert.ok(g.battle.fighters[1].effects['概率闪避'].end>=g.battle.round);return g;}
const red=g=>g.battle.turns.at(-1).events.filter(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0).reduce((n,e)=>n+e.damage.settledDamage,0);
test('真实31505继承伪必中无视23505真实55%闪避，基础命中提高100%，仍保留命中等级弱化',()=>{
 const outcomes=new Set();for(let seed=1;seed<=12;seed++)for(const acc of [0,-6]){let g=inherit(1275,seed,acc);g=T.turn(g,['wiki:10086','potion:pp']);assert.equal(g.battle.fighters[0].soulState.firstOrderThisUse.hit,'pseudo');assert.equal(g.battle.fighters[0].soulState.teamFirstCrit1275,1);assert.equal(g.battle.fighters[0].soulState.teamFirstCritAttack1275,1);if(acc===0)assert.ok(red(g)>0);else outcomes.add(red(g)>0);}assert.deepEqual([...outcomes].sort(),[false,true]);
});
test('真实23108继承真必中无视23505真实55%闪避和命中负6，下一次命中攻击必暴独立兑现',()=>{
 for(let seed=1;seed<=8;seed++){let g=inherit(574,seed,-6);g=T.turn(g,['wiki:10086','potion:pp']);assert.equal(g.battle.fighters[0].soulState.firstOrderThisUse.hit,'true');assert.ok(red(g)>0);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('致命一击')));assert.equal(!!g.battle.fighters[0].soulState.ji574NextSkill,false);}
});
test('真实753一档必先独立于先制封锁及束缚，双方换座位后低速仍先用实际攻击',()=>{
 for(const side of [0,1])for(const key of ['先制效果失效','攻击先制效果失效','束缚']){const teams=[[member(5000,[10993],9000,1)],[member(2989,[10086],6000,4000)]];let g=T.create(side?teams.slice().reverse():teams,[0,0],{seed:14,criticals:false});const f=g.battle.fighters[side];if(key==='束缚')f.ailments[key]=3;else f.effects[key]={start:1,end:3};const prior=f.pp['wiki:10993'];g=T.turn(g,side?['wiki:10086','wiki:10993']:['wiki:10993','wiki:10086']);assert.equal(g.battle.turns.at(-1).first,side);assert.ok(g.battle.turns.at(-1).events.some(e=>e.damage?.type==='attack'&&e.damage.sourceSide===side));assert.ok(g.battle.fighters[side].pp['wiki:10993']>=prior-1);}
});
