'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round80-3425-basic-windows-native.cjs');
test('原3425四原魂第五组合圣灵觉醒原58下两轮真实原重击必定暴击，第三次重击到期真实出现普通攻击，原魂回血增伤保留',()=>{assert.equal(H.critical().length,4);});
test('原3425四原魂第五组合圣灵觉醒完整原槽首次封命中无效控制药剂零PP不授必暴，原必中面对必失阳性',()=>{assert.equal(H.failures([22662]).length,24);});
test.after(()=>console.log('ROUND80_3425_CRITICAL_WINDOW_COUNTS '+JSON.stringify(H.report())));
