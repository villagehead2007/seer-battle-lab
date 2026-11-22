'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[],maxHp=9000){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
test('2190树海原技自然创造后真下场保留，场下三次原生70威力耗尽临时区才消失并返场重创',()=>{
 assert.equal(S.species(3739).moves.find(m=>m.id===29211).hash,'b6dad453');
 let g=T.create([[member(3739,1017,[29211],1000),member(2989)],[member(5000,753,[10996])]],[0,0],{seed:14,criticals:false});
 const forest=f=>{assert.equal(f.stats.maxHp,1210);assert.equal(f.soulState.forest.life,210);assert.equal(f.soulState.temporaryHp.forest.bonus,210);};
 forest(g.battle.fighters[0]);assert.equal(g.battle.fighters[0].hp,1210);
 g=T.turn(g,[{switchTo:1},pp]);forest(g.slots[0][0].fighter);assert.equal(g.slots[0][0].fighter.hp,1210);
 for(let i=1;i<=3;i++){g=T.turn(g,[pp,'wiki:10996']);const f=g.slots[0][0].fighter;assert.equal(f.hp,1210-70*i);if(i<3)forest(f);else{assert.equal(f.stats.maxHp,1000);assert.equal(f.soulState.forest,undefined);assert.equal(f.soulState.temporaryHp?.forest,undefined);}}
 g=T.turn(g,[{switchTo:0},pp]);forest(g.battle.fighters[0]);assert.equal(g.battle.fighters[0].hp,1210);
});
test('1638龙胆原技能七次命中自然满七免PP，真下场逐轮降至五返场再命中恢复耗PP并得第六枚',()=>{
 assert.equal(S.species(4421).souls.find(s=>s.id===1638).hash,'baef8d5a');
 let g=T.create([[member(4421,1638,[11531]),member(2989)],[member(2989)]],[0,0],{seed:14,criticals:false});const key='wiki:11531';
 for(let i=1;i<=7;i++){const before=g.battle.fighters[0].pp[key];g=T.turn(g,[key,pp]);assert.equal(g.battle.fighters[0].soulState.dragonGall,i);assert.equal(g.battle.fighters[0].pp[key],before-1);}
 const full=g.battle.fighters[0].pp[key];g=T.turn(g,[key,pp]);assert.equal(g.battle.fighters[0].soulState.dragonGall,7);assert.equal(g.battle.fighters[0].pp[key],full);
 g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.slots[0][0].fighter.soulState.dragonGall,6);g=T.turn(g,[pp,pp]);assert.equal(g.slots[0][0].fighter.soulState.dragonGall,5);
 const returnRound=g.battle.round;g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.dragonGall,5);assert.equal(E.SOULS.trait(g.battle.fighters[0],'entryAilmentRounds'),returnRound);
 const before=g.battle.fighters[0].pp[key];g=T.turn(g,[key,pp]);assert.equal(g.battle.fighters[0].soulState.dragonGall,6);assert.equal(g.battle.fighters[0].pp[key],before-1);
});
test('1617原登场自然处决一层随持有者真下场保留，来源再登场至二层且持有者真实阵亡清空',()=>{
 assert.equal(S.species(4400).souls.find(s=>s.id===1617).hash,'db6c9a19');
 let g=T.create([[member(4400,1617,[10047]),member(2989)],[member(2989),member(2994)]],[0,0],{seed:14,criticals:false});
 g.battle.fighters[1].hp=1;g.slots[1][0].fighter.hp=1;
 assert.equal(g.battle.fighters[1].soulState.executionMarks,1);
 g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.slots[1][0].fighter.soulState.executionMarks,1);
 g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[pp,{switchTo:0}]);assert.equal(g.battle.fighters[1].soulState.executionMarks,1);
 g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[1].soulState.executionMarks,2);
 g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.slots[1][0].fighter.soulState.executionMarks,2);g=T.turn(g,[pp,{switchTo:0}]);assert.equal(g.battle.fighters[1].soulState.executionMarks,2);
 g=T.turn(g,['wiki:10047',pp]);assert.equal(g.phase,'replace');assert.equal(g.slots[1][0].fighter.soulState.executionMarks??0,0);assert.equal(g.battle.fighters[0].stages.atk,1);
 g=T.replace(g,[null,1]);assert.equal(g.battle.fighters[1].soulState.executionMarks??0,0);
});
