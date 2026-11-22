'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round38-original883-native.cjs');
function pos(id){const xs=H.success(id);for(const x of xs){assert.equal(x.maxHp,9000);assert.equal(x.queueConsumed,true);assert.equal(x.unselectedUnchanged,true);if(x.mode==='immune'){assert.equal(x.selectedHp,9000);assert.equal(x.returned,9000);}else{assert.equal(x.selectedHp,9000-x.expectedDamage-x.expectedFixedDamage);if(x.mode==='cap')assert.equal(x.steps.at(-1),x.cap);}}return xs;}
function neg(id){const xs=H.failures(id);for(const x of xs){if(x.mode==='zero'){assert.equal(x.zeroRejected,true);assert.equal(x.unchanged,true);}else if(x.mode==='always'){assert.equal(x.alwaysHit,true);assert.equal(x.selectedHp,9000-x.expectedDamage);assert.ok(x.expectedDamage>0);}else{assert.equal(x.selectedHp,9000);assert.deepEqual(x.steps,[]);}}return xs;}
test('3524原31567/883真实累积10至40封顶，第三槽原百分比3600与魂四层荒古固伤3240分别结算',()=>{const x=pos(3524);assert.deepEqual(x[1].steps,[10,20,30,40,40]);assert.equal(x[0].selectedHp,8100);assert.equal(x[1].expectedDamage,3600);assert.equal(x[1].dread,4);assert.equal(x[1].expectedFixedDamage,3240);assert.equal(x[1].selectedHp,2160);});
test('3524原31567/883封命中无效受控药剂零PP及原非必中MISS不发继任队列',()=>{const x=neg(3524);assert.equal(x.at(-1).mode,'miss');assert.equal(x.at(-1).selectedHp,9000);});
test('3592原31928/883真实累积10至40封顶，实际第三槽百分比扣当前HP上限不变，免疫消费返场不重扣',()=>{const x=pos(3592);assert.deepEqual(x[1].steps,[10,20,30,40,40]);assert.equal(x[0].selectedHp,8100);});
test('3592原31928/883封命中无效受控药剂零PP负门槛，原必中不伪造成MISS',()=>{const x=neg(3592);assert.equal(x.at(-1).alwaysHit,true);assert.equal(x.at(-1).selectedHp,8100);});
test('4186原34898/883真实累积10至30封顶，实际第三槽百分比扣当前HP上限不变，免疫消费返场不重扣',()=>{const x=pos(4186);assert.deepEqual(x[1].steps,[10,20,30,30]);assert.equal(x[0].selectedHp,8100);});
test('4186原34898/883封命中无效受控药剂零PP及原非必中MISS不发继任队列',()=>{const x=neg(4186);assert.equal(x.at(-1).mode,'miss');assert.equal(x.at(-1).selectedHp,9000);});
test('4216原35055/883真实累积10至50封顶，实际第三槽百分比扣当前HP上限不变，免疫消费返场不重扣',()=>{const x=pos(4216);assert.deepEqual(x[1].steps,[10,20,30,40,50,50]);assert.equal(x[0].selectedHp,8100);});
test('4216原35055/883封命中无效受控药剂零PP及原非必中MISS不发继任队列',()=>{const x=neg(4216);assert.equal(x.at(-1).mode,'miss');assert.equal(x.at(-1).selectedHp,9000);});
test.after(()=>console.log('ROUND38_ORIGINAL883_COUNTS '+JSON.stringify(H.report())));
