'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round38-original883-native.cjs');
function pos(id){const xs=H.success(id);for(const x of xs){assert.equal(x.maxHp,9000);assert.equal(x.queueConsumed,true);assert.equal(x.unselectedUnchanged,true);if(x.mode==='immune'){assert.equal(x.selectedHp,9000);assert.equal(x.returned,9000);}else{assert.equal(x.selectedHp,9000-x.expectedDamage);if(x.mode==='cap')assert.equal(x.steps.at(-1),x.cap);}}return xs;}
function neg(id){const xs=H.failures(id);for(const x of xs){if(x.mode==='zero'){assert.equal(x.zeroRejected,true);assert.equal(x.unchanged,true);}else{assert.equal(x.selectedHp,9000);assert.deepEqual(x.steps,[]);}}return xs;}
test('4288原35441/883真实累积20至40封顶，实际第三槽百分比扣当前HP上限不变，免疫消费返场不重扣',()=>{const x=pos(4288);assert.deepEqual(x[1].steps,[20,40,40]);assert.equal(x[0].selectedHp,7200);});
test('4288原35441/883封命中无效受控药剂零PP及原非必中MISS不发继任队列',()=>{const x=neg(4288);assert.equal(x.at(-1).mode,'miss');assert.equal(x.at(-1).selectedHp,9000);});
test('4686原37622/883真实累积15至60封顶，实际第三槽百分比扣当前HP上限不变，免疫消费返场不重扣',()=>{const x=pos(4686);assert.deepEqual(x[1].steps,[15,30,45,60,60]);assert.equal(x[0].selectedHp,7650);});
test('4686原37622/883封命中无效受控药剂零PP及原非必中MISS不发继任队列',()=>{const x=neg(4686);assert.equal(x.at(-1).mode,'miss');assert.equal(x.at(-1).selectedHp,9000);});
test('4712原37742/883真实累积20至100封顶，第三槽百分比扣至阵亡但上限不变，免疫消费返场不重扣',()=>{const x=pos(4712);assert.deepEqual(x[1].steps,[20,40,60,80,100,100]);assert.equal(x[1].selectedHp,0);assert.equal(x[0].selectedHp,7200);});
test('4712原37742/883封命中无效受控药剂零PP及原非必中MISS不发继任队列',()=>{const x=neg(4712);assert.equal(x.at(-1).mode,'miss');assert.equal(x.at(-1).selectedHp,9000);});
test.after(()=>console.log('ROUND38_ORIGINAL883_COUNTS '+JSON.stringify(H.report())));
