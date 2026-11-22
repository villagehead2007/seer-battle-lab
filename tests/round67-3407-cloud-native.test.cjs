'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round67-3407-cloud-native.cjs');
test('3407完整原2093魂原38407清强成功两轮攻免，敌原冲顶耗PP两轮真零红第三轮正红，保护空强化不授',()=>{for(const x of H.shield())assert.equal(x.immune,x.mode==='clear');});
test('3407原2093魂原38407红伤后低体真麻痹高体当前HP三分一附粉严格等体皆不触发，原2482真清一二项各2700回复、束缚解除先扣血及禁疗封顶独立',()=>{const xs=H.conditions();for(const x of xs){if(x.mode==='equal'){assert.equal(x.pink,0);assert.equal(x.low,false);assert.equal(x.high,false);}if(x.mode==='ban')assert.equal(x.healed,0);if(x.mode==='cap'){assert.equal(x.healed,1126);assert.equal(x.netHP,1);};}assert.ok(xs.some(x=>x.mode==='one'&&x.healed===2700));assert.ok(xs.some(x=>x.mode==='two'&&x.healed===5400));});
test('3407原2093魂原38407完整五槽失败门槛，封命中无效控制药剂零PP原MISS不清强化不授攻免不清自身原异常',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.cleared,false);}});
test.after(()=>console.log('ROUND67_3407_CLOUD_COUNTS '+JSON.stringify(H.report())));
