'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round63-3407-critical-native.cjs');
test('3407两完整原魂原11222自然授五轮要害加十六分一，真实暴击按原RNG状态离线读出核对首轮六轮十六分一与二至五轮八分一',()=>{const xs=H.windows();assert.equal(xs.length,192);for(const x of xs)assert.equal(x.critical,x.critDraw<x.chance);for(const soul of [722,2093])assert.ok(xs.some(x=>x.soul===soul&&x.chance===1/8&&x.critDraw>=1/16&&x.critDraw<1/8&&x.critical));});
test('3407两原魂原11222完整五槽失败门槛，封命中无效控制药剂零PP和原MISS不授要害概率加成',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.granted,false);}});
test.after(()=>console.log('ROUND63_3407_CRITICAL_COUNTS '+JSON.stringify(H.report())));
