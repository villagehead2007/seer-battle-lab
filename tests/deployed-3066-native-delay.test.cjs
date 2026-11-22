'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3066-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,stats={},moves=[]){const snapshot=store.species(id);return{snapshot,moves:H.loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:1200,spa:1200,def:4000,spd:4000,spe:1000,...stats}}};}
test('3066原生62按既有人答绑定双方，施放后五轮即第六轮直接秒杀无伤害事件且免死可保一',()=>{
 for(const protectedTarget of[false,true]){let s=H.make(23344,{bEffects:protectedTarget?{致命保留:{start:6,end:6,hp:1}}:{}});for(let r=1;r<=6;r++){s=H.turn(s,r===1?23344:pp);assert.equal(s.fighters[1].hp,r<6?9000:protectedTarget?1:0);assert.ok(!s.damageEvents?.some(e=>e.sourceSide===0));assert.equal(s.fighters[0].pp['wiki:23344'],r===1?9:10);}}
});
test('3066原生62任一方真实主动换人即解除绑定，过第六轮原目标与当前队员均不死亡',()=>{
 for(const side of[0,1]){let g=T.create([[member(3066,{},[23344]),member(3004)],[member(2989),member(3014)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:23344',pp]);const choices=[pp,pp];choices[side]={switchTo:1};g=T.turn(g,choices);for(let r=3;r<=7;r++)g=T.turn(g,[pp,pp]);assert.equal(g.phase,'action');assert.ok(g.slots.flat().every(x=>x.fighter.hp>0));}
});
test('3066原生62任一侧实际被消回合就失效，真实天马19199清未来绑定后第六轮不杀对手',()=>{
 let s=H.make(23344,{enemyId:3014,enemyMoves:[19199]});s=H.turn(s,23344);assert.ok(s.fighters[0].effects['延迟决胜']);s=H.turn(s,pp,19199);assert.equal(s.fighters[0].effects['延迟决胜'],undefined);for(let r=3;r<=7;r++)s=H.turn(s,pp);assert.equal(s.fighters[1].hp,9000);assert.ok(s.fighters[0].hp>0);
});
test('3066原生62施放者真实被击败补位后不能借队友存活兑现死亡绑定',()=>{
 let g=T.create([[member(3066,{maxHp:1,def:1,spe:2000},[23344]),member(3004)],[member(2989,{atk:9999,spe:100},[10086])]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:23344','wiki:10086']);assert.equal(g.slots[0][0].fighter.hp,0);g=T.replace(g,[1,null]);for(let r=2;r<=7;r++)g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[1].hp,9000);assert.equal(g.phase,'action');
});
