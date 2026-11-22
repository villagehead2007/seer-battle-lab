'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round65-3407-ailment-native.cjs');
test('3407两完整原魂原30954二元异常条件优先一红伤二倍附350，无异常均无增益、两种异常仍各一次且伤免独立',()=>{const xs=H.positive();assert.equal(xs.length,8);for(const x of xs){assert.equal(x.priority,x.mode==='none'?0:1);assert.equal(x.factor,x.mode==='none'?1:2);assert.equal(x.fixed,x.mode==='none'||x.mode==='immune'?0:350);}});
test('3407两原魂原30954原五槽与全部实例失败门槛，封命中无效控制药剂零PP不附350、原必中面对必失真红真附伤',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.fixed,x.positive?350:0);}});
test.after(()=>console.log('ROUND65_3407_AILMENT_COUNTS '+JSON.stringify(H.report())));
