'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3194-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
test('3194魂519严格满体受真实红伤才令敌全弱一和下轮先制一，非满无奖励且次次恢复',()=>{
 for(const hp of[8999,9000]){let s=H.turn(H.make(20044,{aHp:hp,enemyMoves:[10086]}),20044,10086);assert.ok(Object.values(s.fighters[1].stages).every(n=>n===(hp===9000?-1:0)));s=H.turn(s,20044);assert.equal(s.fighters[0].soulState.resolvedPriority.value,hp===9000?1:0);s=H.turn(s,20044);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);}
});
test('3194魂519原生普通攻击15秒杀有初始种子成败，属性技能不触发魂秒杀',()=>{
 const seen=new Set();for(let i=1;i<=48&&seen.size<2;i++){const s=H.turn(H.make(10001,{seed:'3194-soul-'+i,aStages:{acc:6}}),10001);seen.add(s.fighters[1].hp===0);}assert.equal(seen.size,2);for(let i=1;i<=8;i++){const s=H.turn(H.make(20044,{seed:'3194-status-'+i}),20044);assert.equal(s.fighters[1].hp,9000);}
});
test('3194魂519从真实开局连续击败两名初始1HP敌人成长2次，依最新统一规则下场清空，队友击败不算自身',()=>{
 function member(id,moves=[],stats={}){const snapshot=store.species(id);return{snapshot,moves:H.loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:1200,spa:1200,def:4000,spd:4000,spe:1000,...stats}}};}
 let g=T.create([[member(3194,[10001],{atk:9999}),member(3056)],[member(2989,[],{maxHp:1,def:1,spd:1}),member(3004,[],{maxHp:1,def:1,spd:1}),member(3014)]],[0,0],{seed:'3194-two-real-ko',criticals:false});for(let n=1;n<=2;n++){g=T.turn(g,['wiki:10001',pp]);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].soulState.teamKills519,n);g=T.replace(g,[null,n]);}g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.slots[0][0].fighter.soulState.teamKills519??0,0);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.teamKills519??0,0);
 const allyAttack=store.species(3056).moves.find(m=>m.power>0).id;g=T.create([[member(3194),member(3056,[allyAttack],{atk:9999})],[member(2989,[],{maxHp:1,def:1,spd:1}),member(3014)]],[1,0],{seed:'3194-team-ko',criticals:false});g=T.turn(g,['wiki:'+allyAttack,pp]);g=T.replace(g,[null,1]);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.teamKills519??0,0);
});
