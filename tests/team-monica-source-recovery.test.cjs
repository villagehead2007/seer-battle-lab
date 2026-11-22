'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('觉醒莫妮卡最优系别取真实上一对手与当前对手，实际自然攻击由微弱提升至二倍克制',()=>{
 let g=T.create([[member(3711,30671)],[member(2988),member(3056,20117)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['potion:pp',{switchTo:1}]);g=T.turn(g,['potion:pp','wiki:20117']);
 assert.ok(g.battle.fighters[0].effects['最优对手系别']);assert.equal(g.battle.lastActivePosition[1],0);
 const ordinary=structuredClone(g);delete ordinary.battle.fighters[0].effects['最优对手系别'];
 function hit(s){const r=s.battle.round;s=T.turn(s,['wiki:30671','potion:pp']);return s.battle.damageEvents.find(e=>e.round===r&&e.sourceSide===0&&e.type==='attack').settledDamage;}
 const base=hit(ordinary),best=hit(g);assert.ok(base>0);assert.ok(Math.abs(best-base*4)<=3);
});
test('用户确认莫妮卡只对仍存活上只队友回PP授庇：真实阵亡补位不触发且不消费对应自身PP',()=>{
 const enemy=member(3056,10127);enemy.build.overrides.atk=9999;
 let g=T.create([[member(2988),member(3711)],[enemy]],[0,0],{seed:13,criticals:false});const old=g.battle.fighters[0],key=old.moves[1];old.pp[key]=0;old.hp=1;
 g=T.turn(g,['potion:hp','wiki:10127']);assert.equal(g.phase,'replace');assert.equal(g.slots[0][0].fighter.hp,0);assert.equal(g.slots[0][0].fighter.pp[key],0);const before={...g.slots[0][1].fighter.pp};
 g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].soulId,2072);assert.deepEqual(g.battle.fighters[0].pp,before);assert.equal(g.slots[0][0].fighter.pp[key],0);assert.equal(g.slots[0][0].fighter.soulState.qionghua,undefined);
});
test('莫妮卡真实换入只处理上只活队友零PP且自身对应槽可实际消费的位置，多槽同次只授一道庇',()=>{
 let g=T.create([[member(2988),member(3711),member(3056)],[member(3056)]],[0,0],{seed:13,criticals:false});
 const old=g.battle.fighters[0],incoming=g.slots[0][1].fighter,empty=old.moves[1],eligible=old.moves[3];old.pp[empty]=0;old.pp[eligible]=0;incoming.pp[incoming.moves[1]]=0;assert.ok(incoming.pp[incoming.moves[3]]>0);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.pp[empty],0);assert.equal(g.slots[0][0].fighter.pp[eligible],g.slots[0][0].fighter.teamPPDefinitions[eligible].pp);assert.equal(g.battle.fighters[0].pp[g.battle.fighters[0].moves[1]],0);assert.equal(g.battle.fighters[0].pp[g.battle.fighters[0].moves[3]],0);assert.equal(g.slots[0][0].fighter.soulState.qionghua,1);assert.equal(g.slots[0][2].fighter.soulState.qionghua,undefined);
});
test('宁界之律击败时剩余的一层封锁不被稍后回合结束的魂印消耗追溯撤销',()=>{
 let g=T.create([[member(3711)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].soulState.ningjie=1;g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:38319','potion:pp']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].soulState.ningjie,0);
 const before=structuredClone(g);assert.match(D.team(g,1).find(x=>x.name==='宁界之律封锁预告').value,/附加异常 1 回合/);assert.deepEqual(g,before);
 g=T.replace(g,[null,1]);assert.equal(g.battle.teamOutputBlock2426?.[1],g.battle.round);
});
test('宁界之律击败后一层封锁也阻止真实继任者登场魂印臣服',()=>{
 let g=T.create([[member(3711)],[member(2988,10056),member(4468,36386)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].effects['攻击必中']={start:1,end:4};g.battle.fighters[0].soulState.ningjie=1;g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:38319','wiki:10056']);assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);
 assert.ok(g.battle.teamOutputBlock2426[1]>=g.battle.round);assert.equal(g.battle.fighters[0].ailments['臣服'],undefined);
 assert.ok(g.battle.entryStatusEvents.some(e=>e.sourceSide===1&&e.status==='臣服'&&e.reason==='ningjie-output-block'));
 g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.round,3);assert.ok(g.battle.teamOutputBlock2426[1]<g.battle.round);assert.equal(g.battle.fighters[0].soulState.ningjie,0);
 g=T.turn(g,['potion:pp','wiki:36386']);assert.equal(g.battle.fighters[0].ailments['疲惫'],4);
});
