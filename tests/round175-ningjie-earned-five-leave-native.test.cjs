'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[]){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;const moves=loadout(snapshot,ids);if(id!==3711&&ids.length){const i=moves.indexOf(ids[0]);[moves[i],moves[1]]=[moves[1],moves[i]];}return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:9999,spd:9999,spe:1000}}};}
test('2072完整原魂五名队友真实用尽PP并受回补授庇，原繁嚣此寂自然得五律后真离场不保五层',()=>{
 assert.equal(S.species(3711).souls.find(s=>s.id===2072).hash,'43159cba');
 const allies=[[2989,10086],[2994,10710],[2996,10018],[2997,10018],[2998,10683]];
 let g=T.create([[member(3711,2072,[10001,29299]),...allies.map(([id,m])=>member(id,undefined,[m]))],[member(2989,undefined,[10086])]],[1,0],{seed:14,criticals:false});
 // Legal pre-first-turn PP setup only. Each zero-PP slot and each blessing below is earned by real use/entry.
 allies.forEach(([,m],i)=>{g.slots[0][i+1].fighter.pp['wiki:'+m]=1;});g.battle.fighters[0].pp['wiki:'+allies[0][1]]=1;
 const total=()=>g.slots[0].reduce((n,x)=>n+(x.fighter.soulState.qionghua??0),0);
 for(let i=0;i<allies.length;i++){
  const key='wiki:'+allies[i][1];if(i)g=T.turn(g,[{switchTo:i+1},'wiki:10086']);assert.equal(g.battle.fighters[0].pp[key],1);
  g=T.turn(g,[key,'wiki:10086']);assert.equal(g.battle.fighters[0].pp[key],0,'real original attack consumed its last PP');const slot=g.battle.fighters[0].moves.indexOf(key),source=g.slots[0][0].fighter;assert.ok(source.pp[source.moves[slot]]>0,JSON.stringify({i,slot,sourceMoves:source.moves,sourcePP:source.pp,key}));
  g=T.turn(g,[{switchTo:0},'wiki:10086']);const restored=g.slots[0][i+1].fighter;assert.equal(restored.pp[key],restored.teamPPDefinitions[key].pp);assert.equal(restored.soulState.qionghua,1);assert.equal(total(),i+1);
  if(i<allies.length-1)g=T.turn(g,[pp,'wiki:10086']);
 }
 g=T.turn(g,['wiki:29299','wiki:10086']);assert.equal(g.battle.fighters[0].soulState.ningjie,5);assert.equal(total(),5);
 g=T.turn(g,[{switchTo:1},'wiki:10086']);assert.equal(g.slots[0][0].fighter.soulState.ningjie??0,0,'unannotated five-layer state is cleared on true leave');assert.equal(g.battle.fighters[0].soulState.qionghua,1,'mark granted on the bench still exists on its first return');
 g=T.turn(g,[{switchTo:0},'wiki:10086']);assert.equal(g.battle.fighters[0].soulState.ningjie,4,'new entry grants four; an opponent actually choosing a skill does not consume it');assert.equal(g.slots[0][1].fighter.soulState.qionghua??0,0,'blessing with no explicit leave retention clears when its holder truly leaves');for(let i=2;i<=5;i++)assert.equal(g.slots[0][i].fighter.soulState.qionghua,1,'unmoved bench holders keep their real grants');
});
