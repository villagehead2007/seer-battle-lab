'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3075-native.cjs');
test('3075魂421每回合特攻速度各一独立于药剂与技能，六级封顶且吸取150按理论回复',()=>{
 let s=make(10499);for(let r=1;r<=7;r++){s=turn(s,'potion:pp');assert.equal(s.fighters[0].stages.spa,Math.min(6,r));assert.equal(s.fighters[0].stages.spe,Math.min(6,r));assert.equal(s.fighters[0].hp,4500+150*r);assert.equal(s.fighters[1].hp,9000-150*r);const e=s.damageEvents.filter(e=>e.round===r&&e.sourceSide===0);assert.equal(e.length,1);assert.equal(e[0].settledDamage,150);}
 const low=turn(make(10499,{bHp:1}),'potion:pp');assert.equal(low.fighters[1].hp,0);assert.equal(low.fighters[0].hp,4650);assert.equal(low.damageEvents.find(e=>e.sourceSide===0).settledDamage,150);
 const full=turn(make(10499,{aHp:8999}),'potion:pp');assert.equal(full.fighters[0].hp,9000);assert.equal(full.fighters[1].hp,8850);
});
test('3075魂421禁强化不阻吸取，技能禁疗不挡魂印回复，吸取不受红伤免疫影响',()=>{
 const s=make(10499,{aEffects:{禁强化:{start:1,end:3},无法通过自身技能恢复体力:{start:1,end:3}},bStages:{atk:-1},bEffects:{任一方弱化免攻:{start:1,end:3}}}),o=turn(s,'potion:pp');assert.equal(o.fighters[0].stages.spa,0);assert.equal(o.fighters[0].stages.spe,0);assert.equal(o.fighters[0].hp,4650);assert.equal(o.fighters[1].hp,8850);
 const blocked=turn(make(10499,{bEffects:{当回合免伤:{start:1,end:3}}}),'potion:pp');assert.equal(blocked.fighters[1].hp,9000);assert.equal(blocked.fighters[0].hp,4650);assert.equal((blocked.damageEvents??[]).filter(e=>e.sourceSide===0&&e.settledDamage>0).length,0);
});
