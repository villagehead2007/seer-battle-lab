'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),H=require('./helpers/report-restriction-native.cjs'),{loadout}=require('./helpers/3001-native.cjs');
const {T,member,pp}=H;
const defs=[{id:3311,move:38634,effect:1307,amount:70},{id:3550,move:31582,effect:1307,amount:100},{id:3311,move:29506,effect:2613,amount:180},{id:4553,move:28436,effect:2076,amount:200,other:10004},{id:4676,move:28809,effect:2076,amount:200,other:12258},{id:4911,move:29370,effect:2076,amount:170,other:10001}];
function source(d,stats={}){const raw=H.S.species(d.id),snapshot=E.WIKI.versionSnapshots(raw).find(v=>E.WIKI.defaultMoves(v).includes(d.move))??raw;return{snapshot,moves:loadout(snapshot,[d.move,...(d.other?[d.other]:[])]),build:member(d.id,[],stats).build};}
function ready(d,{immune=true,knockout=false,woundSource=false}={}){
 const attack=knockout?10001:10234;
 const enemy=member(knockout?3008:3575,[attack],{maxHp:knockout?1:9000,atk:180,spe:100});enemy.build.resistance.percent=immune?100:0;
 let g=T.create([[source(d,{atk:1,spa:1,def:woundSource?1:4000,spe:2000}),member(3002,[10250],{def:1}),member(3004,[10611],{def:1}),member(3001,[19144,23108],{atk:1,spa:1}),member(3008)],[enemy,member(knockout?3004:3008,[],{def:1,spd:1})]],[3,1],{seed:14,criticals:false});
 g=T.turn(g,['wiki:19144',pp]);assert.ok(g.battle.fighters[1].hp>0&&g.battle.fighters[1].hp<9000);
 g=T.turn(g,['wiki:23108',{switchTo:0}]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 g=T.turn(g,[pp,'wiki:'+attack]);assert.ok(g.battle.fighters[0].hp>0&&g.battle.fighters[0].hp<6000);
 g=T.turn(g,[{switchTo:2},'wiki:'+attack]);assert.ok(g.battle.fighters[0].hp>0&&g.battle.fighters[0].hp<6000);
 g=T.turn(g,[{switchTo:0},woundSource?'wiki:'+attack:pp]);
 while(Object.values(g.battle.fighters[0].ailments).some(end=>end>=g.battle.round))g=T.turn(g,[pp,pp]);
 if(d.id===4911){g=T.turn(g,['wiki:10001',pp]);assert.equal(g.battle.fighters[0].soulState.knightDuel4911.transformNext,false);}
 assert.ok(g.slots[1][1].fighter.hp>0&&g.slots[1][1].fighter.hp<9000);
 assert.ok(g.slots[0][1].fighter.hp>0&&g.slots[0][1].fighter.hp<9000);assert.ok(g.slots[0][2].fighter.hp>0&&g.slots[0][2].fighter.hp<9000);
 assert.equal(g.slots[0][3].fighter.hp,0);assert.equal(g.slots[0][4].fighter.hp,9000);
 return g;
}
const bench=g=>[1,2,3,4].map(i=>g.slots[0][i].fighter.hp);
function expectBench(g,before,amount){assert.deepEqual(bench(g),[Math.min(9000,before[0]+amount),Math.min(9000,before[1]+amount),0,9000]);}
function direct(d,knockout=false){let g=ready(d,{knockout}),before=bench(g),foe=g.slots[1][1].fighter.hp;g=T.turn(g,['wiki:'+d.move,pp]);expectBench(g,before,knockout?0:d.amount);assert.equal(g.slots[1][1].fighter.hp,d.id===3550?Math.max(1,foe-100):foe);assert.equal(g.battle.fighters[1].hp===0,knockout);return g;}
function fullRecovery(wounded){const d=defs[2];let g=ready(d,{woundSource:wounded}),before=bench(g),hp=g.battle.fighters[0].hp;assert.equal(hp===9000,!wounded);g=T.turn(g,['wiki:'+d.move,pp]);expectBench(g,before,wounded?0:180);assert.equal(g.battle.fighters[0].hp,wounded?Math.min(9000,hp+9000/3*(hp<4500?2:1)):9000);return g;}
const markers=f=>Object.entries(f.effects).filter(([key])=>['北鸟用招低体吸取','星光用招低体比例吸取'].includes(key));
function monitor(d){let g=ready(d),before=bench(g);g=T.turn(g,['wiki:'+d.move,pp]);expectBench(g,before,d.amount);assert.equal(markers(g.battle.fighters[0]).length,1);const end=markers(g.battle.fighters[0])[0][1].end;before=bench(g);g=T.turn(g,['wiki:'+d.other,pp]);expectBench(g,before,d.amount);before=bench(g);g=T.turn(g,[pp,pp]);expectBench(g,before,0);while(g.battle.round<=end)g=T.turn(g,[pp,pp]);before=bench(g);g=T.turn(g,['wiki:'+d.other,pp]);expectBench(g,before,0);return g;}
function successfulDrain(d){let g=ready(d,{immune:false}),before=bench(g),hp=g.battle.fighters[1].hp;g=T.turn(g,['wiki:'+d.move,pp]);assert.equal(markers(g.battle.fighters[0]).length,1);assert.ok(g.battle.fighters[1].hp<hp);expectBench(g,before,0);return g;}
function leave(d){let g=ready(d);g=T.turn(g,['wiki:'+d.move,pp]);assert.equal(markers(g.battle.fighters[0]).length,1);g=T.turn(g,[{switchTo:1},pp]);assert.equal(markers(g.battle.fighters[0]).length,0);let before=g.slots[0][2].fighter.hp;g=T.turn(g,['wiki:10250',pp]);assert.equal(g.slots[0][2].fighter.hp,before);g=T.turn(g,[{switchTo:0},pp]);assert.equal(markers(g.battle.fighters[0]).length,0);assert.equal(g.slots[0][2].fighter.hp,before);return g;}
function death(d){const lethalMove=d.id===4911?19144:10996;const enemy=member(d.id===4911?3001:5000,[lethalMove],{maxHp:8000,atk:9999,spa:9999,spe:100});enemy.build.resistance.percent=100;let g=T.create([[source(d,{def:1,spd:1,spe:4000}),member(3002,[10250]),member(3004)],[enemy]],[0,0],{seed:14,criticals:false});while(Object.values(g.battle.fighters[0].ailments).some(end=>end>=g.battle.round))g=T.turn(g,[pp,pp]);if(d.id===4911){g=T.turn(g,['wiki:10001',pp]);assert.equal(g.battle.fighters[0].soulState.knightDuel4911.transformNext,false);while(g.battle.fighters.some(f=>Object.values(f.ailments).some(end=>end>=g.battle.round)))g=T.turn(g,[pp,pp]);}g=T.turn(g,['wiki:'+d.move,'wiki:'+lethalMove]);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);assert.equal(markers(g.battle.fighters[0]).length,1);g=T.replace(g,[1,null]);assert.equal(markers(g.battle.fighters[0]).length,0);assert.equal(markers(g.slots[0][0].fighter).length,0);g=T.turn(g,['wiki:10250',pp]);assert.equal(g.slots[0][0].fighter.hp,0);return g;}
test('3311原1307真实未击败只回复所有存活场下各70，尸体不复活满体不超限',()=>{const g=direct(defs[0]);assert.equal(g.slots[0][3].fighter.hp,0);});
test('3550原1307零参数原100回复保留并列敌场下扣100，尸体不复活',()=>{const g=direct(defs[1]);assert.equal(g.slots[0][3].fighter.hp,0);});
test('3311原1307本体真实击败对手时不回复己方场下',()=>{const g=direct(defs[0],true);assert.equal(g.battle.fighters[1].hp,0);});
test('3550原1307本体真实击败对手时不回复己方场下',()=>{const g=direct(defs[1],true);assert.equal(g.battle.fighters[1].hp,0);});
test('3311原2613满体分支回复全部存活场下各180，尸体与满体不产生新收益',()=>{const g=fullRecovery(false);assert.equal(g.slots[0][3].fighter.hp,0);});
test('3311原2613真实红伤降至非满后只回复本人，场下不获180',()=>{const g=fullRecovery(true);assert.equal(g.battle.fighters[0].hp,9000);});
test('4553原2076用招吸取未减HP才回复场下各200，药剂和到期后不触发',()=>{const g=monitor(defs[3]);assert.equal(g.slots[0][3].fighter.hp,0);});
test('4676原2076用招吸取未减HP才回复场下各200，药剂和到期后不触发',()=>{const g=monitor(defs[4]);assert.equal(g.slots[0][3].fighter.hp,0);});
test('4911原2076用招吸取未减HP才回复场下各170，药剂和到期后不触发',()=>{const g=monitor(defs[5]);assert.equal(g.slots[0][3].fighter.hp,0);});
test('4553原2076对手确实损失体力时不回复场下',()=>{const g=successfulDrain(defs[3]);assert.ok(g.battle.fighters[1].hp>0);});
test('4676原2076对手确实损失体力时不回复场下',()=>{const g=successfulDrain(defs[4]);assert.ok(g.battle.fighters[1].hp>0);});
test('4911原2076对手确实损失体力时不回复场下',()=>{const g=successfulDrain(defs[5]);assert.ok(g.battle.fighters[1].hp>0);});
test('4553原2076本人用招监听真实换下不转授且返场不重授',()=>{const g=leave(defs[3]);assert.equal(markers(g.battle.fighters[0]).length,0);});
test('4676原2076本人用招监听真实换下不转授且返场不重授',()=>{const g=leave(defs[4]);assert.equal(markers(g.battle.fighters[0]).length,0);});
test('4911原2076本人用招监听真实换下不转授且返场不重授',()=>{const g=leave(defs[5]);assert.equal(markers(g.battle.fighters[0]).length,0);});
test('4553原2076施法后真实红伤阵亡，死亡补位不继承本人用招监听',()=>{const g=death(defs[3]);assert.equal(g.slots[0][0].fighter.hp,0);});
test('4676原2076施法后真实红伤阵亡，死亡补位不继承本人用招监听',()=>{const g=death(defs[4]);assert.equal(g.slots[0][0].fighter.hp,0);});
test('4911原2076施法后真实红伤阵亡，死亡补位不继承本人用招监听',()=>{const g=death(defs[5]);assert.equal(g.slots[0][0].fighter.hp,0);});
