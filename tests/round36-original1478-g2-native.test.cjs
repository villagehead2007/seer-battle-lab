'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round36-original1478-native.cjs');
function checkSuccess(id){const xs=H.success(id);for(const x of xs){assert.ok(x.lock);assert.equal(x.selected,2);if(x.mode==='defeat')assert.equal(x.actualDefeat,true);else{assert.equal(x.rejected,x.lock.end-x.lock.start+1);assert.equal(x.ownSelected,1);}}return xs;}
function checkFailure(id){const xs=H.failures(id);for(const x of xs){if(x.nativeZeroAllowed){assert.equal(id,4604);assert.equal(x.ppBefore,0);assert.equal(x.ppAfter,0);assert.ok(x.lock);}else if(x.forcedNative){assert.equal(id,4604);assert.ok(x.lock);assert.equal(x.futureInstructions,2);}else if(x.mode==='zero'){assert.equal(x.zeroRejected,true);assert.equal(x.unchanged,true);}else if(x.mode==='always'){assert.equal(x.alwaysHit,true);assert.ok(x.lock);}else{assert.equal(x.lock,null);assert.equal(x.selected,2);if(x.mode==='miss')assert.equal(x.alwaysHit,false);}}return xs;}
test('4604原28604/1478次回两轮封换、原玄武拒绝到期指定及真实自爆死亡补位',()=>{const xs=checkSuccess(4604);assert.equal(xs[0].lock.end,3);assert.equal(xs[2].actualDefeat,true);});
test('4604原28604/1478原魂封命中无效仍强制并消费指令且零PP可用，控制药剂不封换',()=>{const xs=checkFailure(4604);assert.ok(xs[0].lock);assert.ok(xs[1].lock);assert.equal(xs[2].lock,null);assert.equal(xs[3].lock,null);assert.equal(xs.at(-1).nativeZeroAllowed,true);});
test('4679原37521/1478次回一轮封换、原玄武拒绝到期指定及真实自爆死亡补位',()=>{const xs=checkSuccess(4679);assert.equal(xs[0].lock.end,2);assert.equal(xs[2].actualDefeat,true);});
test('4679原37521/1478封命中无效受控药剂零PP及真实攻击MISS不封换',()=>{const xs=checkFailure(4679);assert.equal(xs[0].lock,null);assert.equal(xs.at(-1).mode,'miss');assert.equal(xs.at(-1).lock,null);});
test('4823原38113/1478次回一轮封换、原玄武拒绝到期指定及自爆冻伤双方死亡真补位',()=>{const xs=checkSuccess(4823);assert.equal(xs[0].lock.end,2);assert.equal(xs[2].actualDefeat,true);assert.equal(xs[2].ownDefeated,true);});
test('4823原38113/1478封命中无效受控药剂零PP及真实攻击MISS不封换',()=>{const xs=checkFailure(4823);assert.equal(xs[0].lock,null);assert.equal(xs.at(-1).mode,'miss');assert.equal(xs.at(-1).lock,null);});
test.after(()=>console.log('ROUND36_ORIGINAL1478_COUNTS '+JSON.stringify(H.report())));
