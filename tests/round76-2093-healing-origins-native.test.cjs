'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round76-2093-healing-origins-native.cjs');
test('原3407雷之脉动2093即时两轮禁止真实410魂印回复，血药250不受限且第三轮魂回复3000',()=>{assert.equal(H.scenario(3407,29361).heals.length,3);});
test('原4586告命诗途2093即时两轮禁止真实410魂印回复，血药250不受限且第三轮魂回复3000',()=>{assert.equal(H.scenario(4586,28535).heals.length,3);});
test('原4748多彩宏光2093即时两轮禁止真实410魂印回复，血药250不受限且第三轮魂回复3000',()=>{assert.equal(H.scenario(4748,37879).heals.length,3);});
test('原4942冰凌雪舞2093即时两轮禁止真实410魂印回复，血药250不受限且第三轮魂回复3000',()=>{assert.equal(H.scenario(4942,29445).heals.length,3);});
test.after(()=>console.log('ROUND76_2093_HEALING_ORIGINS_COUNTS '+JSON.stringify(H.report())));
