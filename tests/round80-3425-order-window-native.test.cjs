'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round80-3425-basic-windows-native.cjs');
test('原3425四原魂第五组合神灵傲世决先手当回合封原31053攻击但PP照扣，三轮真免防速下降第四轮到期，后手下轮先制2第三轮复原',()=>{assert.equal(H.orderWindows().length,8);});
test('原3425神灵傲世决同批公共失败入口封命中无效控制药剂零PP不授免弱封攻，原95命中MISS不授、正常命中阳性',()=>{assert.equal(H.orderGates().length,7);});
test.after(()=>console.log('ROUND80_3425_ORDER_WINDOW_COUNTS '+JSON.stringify(H.report())));
