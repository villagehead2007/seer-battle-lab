'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round36-original1478-native.cjs');
function checkSuccess(id){const xs=H.success(id);for(const x of xs){assert.ok(x.lock);assert.equal(x.selected,2);if(x.mode==='defeat')assert.equal(x.actualDefeat,true);else{assert.equal(x.rejected,x.lock.end-x.lock.start+1);assert.equal(x.ownSelected,1);}}return xs;}
function checkFailure(id){const xs=H.failures(id);for(const x of xs){if(x.mode==='zero'){assert.equal(x.zeroRejected,true);assert.equal(x.unchanged,true);}else if(x.mode==='always'){assert.equal(x.alwaysHit,true);assert.ok(x.lock);}else{assert.equal(x.lock,null);assert.equal(x.selected,2);if(x.mode==='miss')assert.equal(x.alwaysHit,false);}}return xs;}
test('3886原26781/1478次回两轮封换、原玄武拒绝到期指定及真实自爆死亡补位',()=>{const xs=checkSuccess(3886);assert.equal(xs[0].lock.end,3);assert.equal(xs[2].actualDefeat,true);});
test('3886原26781/1478封命中整招无效受控药剂不封换且零PP拒绝状态不变',()=>{const xs=checkFailure(3886);assert.equal(xs[0].lock,null);assert.equal(xs.at(-1).unchanged,true);});
test('4329原35660/1478次回一轮封换、原玄武拒绝到期指定及真实自爆死亡补位',()=>{const xs=checkSuccess(4329);assert.equal(xs[0].lock.end,2);assert.equal(xs[2].actualDefeat,true);});
test('4329原35660/1478封命中无效受控药剂零PP及真实攻击MISS不封换',()=>{const xs=checkFailure(4329);assert.equal(xs[0].lock,null);assert.equal(xs.at(-1).mode,'miss');assert.equal(xs.at(-1).lock,null);});
test('4386原27996/1478次回两轮封换、原玄武拒绝到期指定及真实自爆死亡补位',()=>{const xs=checkSuccess(4386);assert.equal(xs[0].lock.end,3);assert.equal(xs[2].actualDefeat,true);});
test('4386原27996/1478封命中整招无效受控药剂不封换且零PP拒绝状态不变',()=>{const xs=checkFailure(4386);assert.equal(xs[0].lock,null);assert.equal(xs.at(-1).unchanged,true);});
test('4541原36791/1478次回一轮封换、原玄武拒绝到期指定及真实自爆死亡补位',()=>{const xs=checkSuccess(4541);assert.equal(xs[0].lock.end,2);assert.equal(xs[2].actualDefeat,true);});
test('4541原36791/1478封命中无效受控药剂零PP及原必中不被伪造成MISS',()=>{const xs=checkFailure(4541);assert.equal(xs[0].lock,null);assert.equal(xs.at(-1).alwaysHit,true);assert.ok(xs.at(-1).lock);});
test.after(()=>console.log('ROUND36_ORIGINAL1478_COUNTS '+JSON.stringify(H.report())));
