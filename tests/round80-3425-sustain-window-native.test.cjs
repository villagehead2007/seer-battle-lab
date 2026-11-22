'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round80-3425-basic-windows-native.cjs');
test('原3425四配置禁忌魔光406五轮真受攻回150，技能禁疗独立、满体按实际损血封顶，第六轮真受攻不回',()=>{assert.equal(H.receivedHealing().length,4);});
test('原3425四配置御灵圣光1226减300至真实零红仍可末尾吸300，正红不吸，技能禁疗与固免不改变理论300回复，三轮自然到期',()=>{assert.equal(H.sustainedDrain().length,16);});
test('原3425四配置御灵圣光849三轮实际用招每次自然吸三项，整招无效仍用招触发，第四轮到期不再吸',()=>{assert.equal(H.stealWindow().length,4);});
test('原3425四配置御灵圣光191真实反弹原3847附异常，四轮后原攻击真实异常进入本人',()=>{assert.equal(H.reflectedWindow().length,4);});
test.after(()=>console.log('ROUND82_3425_SUSTAIN_WINDOW_COUNTS '+JSON.stringify(H.report())));
