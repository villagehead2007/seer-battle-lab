'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[],stats={}){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
test('1844完整原魂被原攻击真实击败消逝，玩家选第三补位后原槽零上限及终结标记保持',()=>{
 let g=T.create([[member(4643,1844,[],{def:1}),member(2989),member(3056)],[member(3056,undefined,[10127],{atk:9999})]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=1;g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].soulState.vanished,true);g=T.replace(g,[2,null]);
 const terminal=()=>g.slots[0][0].fighter;assert.equal(g.active[0],2);for(let i=0;i<3;i++){assert.equal(terminal().hp,0);assert.equal(terminal().stats.maxHp,0);assert.equal(terminal().soulState.vanished,true);assert.equal(terminal().soulState.deathResolved,true);assert.ok(!T.candidates(g,0).includes(0));if(i<2)g=T.turn(g,[pp,pp]);}
});
test('1394原首次自然散布致命印记后持有者真实离场按统一规则清除，返场不重新散布',()=>{
 let g=T.create([[member(4169,1394),member(3012)],[member(3056),member(2989)]],[0,0],{seed:13,criticals:false});const count=f=>Object.values(f.soulState.fatalMarks??{}).reduce((n,v)=>n+v,0);assert.ok(count(g.battle.fighters[1])>0,'original scatter actually marked active holder');assert.equal(g.slots[1].reduce((n,s)=>n+count(s.fighter),0),5);
 g=T.turn(g,[pp,{switchTo:1}]);assert.equal(count(g.slots[1][0].fighter),0);g=T.turn(g,[pp,{switchTo:0}]);assert.equal(count(g.battle.fighters[1]),0);
});
