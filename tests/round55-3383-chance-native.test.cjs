'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round55-3383-chance-native.cjs');
test('3383原14042/88完整697下原15概率二倍，天然种子两侧真实红伤严格按当次浮动重算，封命中不抽概率且按一倍结算',()=>{const xs=H.samples();assert.equal(xs.length,48);for(const x of xs){assert.equal(x.factor,!x.seal&&x.draw<.15?2:1);assert.ok(x.red>0);}assert.ok(xs.some(x=>x.factor===2));assert.ok(xs.some(x=>x.factor===1));});
test('3383原14042完整原魂五槽失败门槛，整招无效控制未用药剂零PP与原MISS没有真实红伤',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.red,0);}});
test.after(()=>console.log('ROUND55_3383_CHANCE_COUNTS '+JSON.stringify(H.report())));
