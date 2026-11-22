'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round39-original1510-native.cjs');
function pos(id){const xs=H.success(id);for(const x of xs){assert.equal(x.armed,1);assert.equal(x.selected,2);assert.equal(x.unselectedUnchanged,true);assert.equal(x.draws.length,['expired','death'].includes(x.mode)?0:x.count);if(x.mode==='immune')for(const d of x.draws)assert.equal(x.ailments[d.name],undefined);if(x.mode==='ok')for(const d of x.draws)assert.ok(x.ailments[d.name]>=d.round);}return xs;}
function neg(id){const xs=H.failures(id);for(const x of xs){if(x.mode==='zero'){assert.equal(x.zeroRejected,true);assert.equal(x.unchanged,true);}else{assert.equal(x.armed,0);assert.deepEqual(x.draws,[]);assert.equal(x.selected,2);}}return xs;}
test('4642原27109/1510两回监听第三槽仅一异常，免疫不补抽、过期及原自爆真死补位不触发',()=>{const x=pos(4642);assert.equal(x[0].through,2);assert.equal(x[0].draws.length,1);assert.equal(x[3].deathReplacement,true);});
test('4642原27109/1510封命中无效受控药剂不授监听，零PP拒绝整个状态不变',()=>{const x=neg(4642);assert.equal(x[0].armed,0);assert.equal(x.at(-1).unchanged,true);});
test('4915原29378/1510三回监听第三槽仅一异常，原魂凝滞保留、免疫过期及原自爆真死补位分别核',()=>{const x=pos(4915);assert.equal(x[0].through,3);assert.equal(x[0].draws.length,1);assert.equal(x[3].deathReplacement,true);});
test('4915原29378/1510封命中无效受控药剂不授监听，零PP拒绝整个状态不变',()=>{const x=neg(4915);assert.equal(x[0].armed,0);assert.equal(x.at(-1).unchanged,true);});
test('4951原38571/1510三回监听第三槽真实两异常，完整临时上限原魂保留、免疫过期真死分别核',()=>{const x=pos(4951);assert.equal(x[0].through,3);assert.equal(x[0].draws.length,2);assert.equal(x[3].deathReplacement,true);});
test('4951原38571/1510封命中无效受控药剂MISS均不授监听，零PP拒绝整个状态不变',()=>{const x=neg(4951);assert.equal(x[0].armed,0);assert.equal(x.at(-1).mode,'miss');assert.deepEqual(x.at(-1).draws,[]);});
test.after(()=>console.log('ROUND39_ORIGINAL1510_COUNTS '+JSON.stringify(H.report())));
