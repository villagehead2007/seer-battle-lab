'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round80-3425-basic-windows-native.cjs');
test('原3425四原魂第五组合变幻原426三轮40概率闪避真实敌攻PP照扣且自然出现命中与闪避，第四轮到期真受攻',()=>{assert.equal(H.dodge().length,4);});
test('原3425四原魂第五组合痛苦压制原125三轮红伤250上限，真实原3407雷霆狂炎灼另350固伤不封顶，第四轮红伤恢复',()=>{assert.equal(H.cap().length,4);});
test('原3425四原魂第五组合变幻痛苦压制完整原槽首次封命中无效控制药剂零PP不授，原必中面对必失阳性',()=>{assert.equal(H.failures([22660,22661]).length,48);});
test.after(()=>console.log('ROUND80_3425_DEFENSE_WINDOWS_COUNTS '+JSON.stringify(H.report())));
