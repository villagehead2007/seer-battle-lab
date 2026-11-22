'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3036-native.cjs');
test('3036原95命中自然种子覆盖MISS耗一PP且两项弱化均不执行，第五必中在负六命中仍实际红伤',()=>{
 let miss=false,hit=false;for(let seed=1;seed<=64;seed++){const s=turn(make(19288,{seed}),19288),red=(s.damageEvents??[]).find(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(s.fighters[0].pp['wiki:19288'],9);if(red){hit=true;assert.equal(s.fighters[1].stages.spd,-1);assert.equal(s.fighters[1].stages.acc,-1);}else{miss=true;assert.equal(s.fighters[1].hp,9000);assert.equal(s.fighters[1].stages.spd,0);assert.equal(s.fighters[1].stages.acc,0);assert.ok(s.turns.at(-1).events.some(e=>e.text.includes('未命中')));}}assert.ok(miss&&hit);const s=turn(make(19295,{aStages:{acc:-6}}),19295);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0&&e.settledDamage>0));assert.equal(s.fighters[0].pp['wiki:19295'],4);
});
