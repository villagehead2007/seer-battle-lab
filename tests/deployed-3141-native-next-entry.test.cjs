'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3141-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,hp=9000,moves=[],resist=false){const snapshot=structuredClone(store.species(id));if(id===3141)snapshot.selectedSoulId=480;return{snapshot,moves:H.loadout(snapshot,moves),build:{overrides:{maxHp:hp,atk:1200,spa:1200,def:4000,spd:4000,spe:1000},...(resist?{resistance:{percent:100}}:{})}};}
test('3141无尽与灾变两个67依既有人答：真实KO后指定第二后继扣4500百分比，上限不降，其他替补无损且只消费一次',()=>{
 for(const id of[17178,19724]){let g=T.create([[member(3141,9000,[id])],[member(2989,1),member(3014),member(3004)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:'+id,pp]);assert.equal(g.phase,'replace');g=T.replace(g,[null,2]);assert.equal(Number(g.battle.fighters[1].number),3004);assert.equal(g.battle.fighters[1].stats.maxHp,9000);assert.equal(g.battle.fighters[1].hp,4500);assert.equal(g.slots[1][1].fighter.hp,9000);assert.equal(g.battle.damageEvents.find(e=>e.type==='percent'&&e.sourceSide===0).settledDamage,4500);g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.battle.fighters[1].hp,9000);g=T.turn(g,[pp,{switchTo:2}]);assert.equal(g.battle.fighters[1].hp,4500);}
});
test('3141两个67未KO不预发奖励，真正后继百分比抗性100阻扣血且不改最大HP',()=>{
 for(const id of[17178,19724])for(const ko of[false,true]){let g=T.create([[member(3141,9000,[id])],[member(2989,ko?1:9000),member(3004,9000,[],ko)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:'+id,pp]);g=ko?T.replace(g,[null,1]):T.turn(g,[pp,{switchTo:1}]);assert.equal(g.battle.fighters[1].hp,9000);assert.equal(g.battle.fighters[1].stats.maxHp,9000);}
});
