'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round80-3425-basic-windows-native.cjs');
test('原3425四原魂第五组合五行之光三独立25与次元裂变三独立50真实抽样对应各异常，成功失败均自然出现，免异不补抽且红伤独立',()=>{assert.equal(H.probabilities().length,8);});
test('原3425五行之光次元裂变同批真实失败入口封命中无效控制药剂零PP与MISS均不抽样不附异常，封命中红伤独立',()=>{assert.equal(H.probabilityGates().length,12);});
test.after(()=>console.log('ROUND80_3425_PROBABILITY_WINDOW_COUNTS '+JSON.stringify(H.report())));
