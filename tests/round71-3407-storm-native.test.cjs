'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round71-3407-storm-native.cjs');
test('3407原2093魂原38408按敌零一二三异常优先零一二三、红伤一二三四倍及2700每项附粉，无异常真回全槽三PP含本次消耗及封顶',()=>{const xs=H.positive();assert.equal(xs.length,6);for(const x of xs){assert.equal(x.priority,x.count);assert.equal(x.pink,x.mode==='immune'?0:2700*x.count);assert.equal(x.sourcePP,x.mode==='capPP'?5:x.count?0:3);}});
test('3407原38408对原4338真技能授双盾后清除并真麻痹焚烬、同招后续5400附粉且不回PP，免异独立；单盾原授单罩原攻击破盾保罩均不清',()=>{const xs=H.shields();assert.equal(xs[0].statuses.length,2);assert.equal(xs[0].sourcePP,0);assert.equal(xs[1].statuses.length,0);assert.equal(xs[1].sourcePP,3);assert.ok(xs[2].shield>0);assert.equal(xs[3].barrier,250);});
test('3407原38408完整2093原魂五槽全部原序门槛，封命中无效控制药剂零PP不附异常百分伤、原必中面对必失真实附粉',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.pink,x.mode==='always'?2700:0);}});
test.after(()=>console.log('ROUND71_3407_STORM_COUNTS '+JSON.stringify(H.report())));
