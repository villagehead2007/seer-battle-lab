'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round80-3425-basic-windows-native.cjs');
test('原3425两魂真实圣元遗光阵1241半体300低体600理论回复，封顶禁疗固免及原清回合顺序KO独立，792先手真封敌攻并耗PP，984只下一轮先制2',()=>{assert.equal(H.fifthDrain().length,14);});
test('原3425剩余持续及新第五同批真实首次封命中无效控制药剂零PP不授，正常命中阳性且零PP状态不变',()=>{assert.equal(H.remainingGates().length,24);});
test.after(()=>console.log('ROUND82_3425_FIFTH_WINDOW_COUNTS '+JSON.stringify(H.report())));
