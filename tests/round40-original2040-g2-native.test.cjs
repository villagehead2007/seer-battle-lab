'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round40-original2040-native.cjs');
function pos(id){const xs=H.success(id);for(const x of xs){assert.equal(x.armed,1);assert.equal(x.selected,2);assert.equal(x.unselectedUnchanged,true);if(x.mode==='ok')assert.ok(x.ailments[x.status]);else assert.equal(x.ailments[x.status],undefined);if(x.mode==='death')assert.equal(x.deathReplacement,true);}return xs;}
function neg(id){const xs=H.failures(id);for(const x of xs){if(x.mode==='zero'){assert.equal(x.zeroRejected,true);assert.equal(x.unchanged,true);}else{assert.equal(x.armed,0);assert.equal(x.ailments[x.status],undefined);assert.equal(x.selected,2);}}return xs;}
test('4674原37540技能2040三回真换第三槽瘫痪，圣谱免疫到期与原自爆死切不施加',()=>{const x=pos(4674);assert.equal(x[0].through,3);assert.ok(x[0].ailments.瘫痪);});
test('4674原37540技能2040封命中无效受控药剂无监听，原零PP拒绝不变不伪造原必中MISS',()=>{const x=neg(4674);assert.equal(x[0].armed,0);assert.equal(x.at(-1).unchanged,true);});
test('4750原29014技能2040三回真换第三槽中毒且受原魂替换为琼花行动真伤1500，免疫到期死切分别核',()=>{const x=pos(4750);assert.equal(x[0].through,3);assert.ok(x[0].ailments.中毒);assert.equal(x[0].originalFlowerTrue,1500);});
test('4750原29014技能2040封命中无效受控药剂无监听，独立1605不冒充且原零PP拒绝不变',()=>{const x=neg(4750);assert.equal(x[0].armed,0);assert.equal(x.at(-1).unchanged,true);});
test('4930原38485技能2040三回真换第三槽臣服，五行原魂保留且免疫到期原自爆死切分别核',()=>{const x=pos(4930);assert.equal(x[0].through,3);assert.ok(x[0].ailments.臣服);});
test('4930原38485技能2040封命中无效受控药剂无监听，原零PP拒绝不变不伪造原必中MISS',()=>{const x=neg(4930);assert.equal(x[0].armed,0);assert.equal(x.at(-1).unchanged,true);});
test.after(()=>console.log('ROUND40_ORIGINAL2040_COUNTS '+JSON.stringify(H.report())));
