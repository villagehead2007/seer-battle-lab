'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3223-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
test('3223两原魂558及566按每次战斗阶段结束增长30或35，五次各封顶150或175且真实后续红伤上升',()=>{
 for(const[soul,step]of[[558,.30],[566,.35]]){let s=H.make(10127,{soul,aStats:{atk:4000},aStages:{acc:6}}),first;for(let r=1;r<=7;r++){s=H.turn(s,10127);if(r===1)first=H.damage(s,'attack');assert.ok(Math.abs(s.fighters[0].soulState.arslanBonus-Math.min(5,r)*step)<1e-10);if(r>=6)assert.ok(H.damage(s,'attack')>first*2,'真实增长后红伤');}}
});
test('3223两原魂必须在战斗阶段结束已加本次增伤，不能延到回合结束阶段才增长',()=>{
 for(const[soul,step]of[[558,.30],[566,.35]]){const seen=[],old=H.E.SOULS;H.E.SOULS={...old,run(event,c){if(c.a.side===0&&['combatEnd','roundEnd'].includes(event)){const before=c.a.soulState.arslanBonus??0;old.run(event,c);seen.push({event,before,after:c.a.soulState.arslanBonus??0});return;}return old.run(event,c);}};try{H.turn(H.make(10127,{soul}),'potion:pp');}finally{H.E.SOULS=old;}assert.deepEqual(seen.find(x=>x.event==='combatEnd'),{event:'combatEnd',before:0,after:step});assert.deepEqual(seen.find(x=>x.event==='roundEnd'),{event:'roundEnd',before:step,after:step});}
});
test('3223两原魂明文下场保留实际两次增伤，场下不成长，返场战阶末只再增一次并最终封顶',()=>{
 function m(id,soul){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:H.E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
 for(const[soul,step]of[[558,.30],[566,.35]]){let g=T.create([[m(3223,soul),m(2989)],[m(2989)]],[0,0],{seed:14,criticals:false});for(let i=0;i<2;i++)g=T.turn(g,['potion:pp','potion:pp']);assert.ok(Math.abs(g.battle.fighters[0].soulState.arslanBonus-step*2)<1e-10);g=T.turn(g,[{switchTo:1},'potion:pp']);for(let i=0;i<2;i++)g=T.turn(g,['potion:pp','potion:pp']);assert.ok(Math.abs(g.slots[0][0].fighter.soulState.arslanBonus-step*2)<1e-10);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.ok(Math.abs(g.battle.fighters[0].soulState.arslanBonus-step*3)<1e-10);for(let i=0;i<3;i++)g=T.turn(g,['potion:pp','potion:pp']);assert.ok(Math.abs(g.battle.fighters[0].soulState.arslanBonus-step*5)<1e-10);}
});
