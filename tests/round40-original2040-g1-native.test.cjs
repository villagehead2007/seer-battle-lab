'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round40-original2040-native.cjs');
function pos(id){const xs=H.success(id);for(const x of xs){assert.equal(x.armed,1);assert.equal(x.selected,2);assert.equal(x.unselectedUnchanged,true);if(x.mode==='ok')assert.ok(x.ailments[x.status]);else assert.equal(x.ailments[x.status],undefined);if(x.mode==='death')assert.equal(x.deathReplacement,true);}return xs;}
function neg(id){const xs=H.failures(id);for(const x of xs){if(x.mode==='zero'){assert.equal(x.zeroRejected,true);assert.equal(x.unchanged,true);}else{assert.equal(x.armed,0);assert.equal(x.ailments[x.status],undefined);assert.equal(x.selected,2);}}return xs;}
test('4589原37039技能2040两回真换第三槽烧伤并真伤1125，圣谱免疫到期与原自爆死切不施加',()=>{const x=pos(4589);assert.equal(x[0].through,2);assert.equal(x[0].dotTrueDamage,1125);assert.equal(x[0].hp,7875);});
test('4589原37039技能2040封命中无效受控药剂无监听，原零PP拒绝不变不伪造原必中MISS',()=>{const x=neg(4589);assert.equal(x[0].armed,0);assert.equal(x.at(-1).unchanged,true);});
test('4642原28718技能2040三回真换第三槽失神，圣谱免疫到期与原自爆死切不施加',()=>{const x=pos(4642);assert.equal(x[0].through,3);assert.ok(x[0].ailments.失神);});
test('4642原28718技能2040封命中无效受控药剂无监听，原零PP拒绝完全不变',()=>{const x=neg(4642);assert.equal(x[0].armed,0);assert.equal(x.at(-1).unchanged,true);});
test('4654原28752技能2040三回真换第三槽冻伤并真伤1125，独立原冰封不冒充监听且免疫到期死切分别核',()=>{const x=pos(4654);assert.equal(x[0].through,3);assert.equal(x[0].dotTrueDamage,1125);assert.equal(x[0].hp,7875);});
test('4654原28752技能2040封命中无效受控药剂无监听，原零PP拒绝完全不变',()=>{const x=neg(4654);assert.equal(x[0].armed,0);assert.equal(x.at(-1).unchanged,true);});
test.after(()=>console.log('ROUND40_ORIGINAL2040_COUNTS '+JSON.stringify(H.report())));
