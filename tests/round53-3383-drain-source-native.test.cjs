'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round53-3383-drain-source-native.cjs');
test('3383原30816/894完整697与五槽原序，真实250与低血500吸取等量回复，禁疗只阻回复且8999封顶9000',()=>{const x=H.quantity();assert.equal(x[0].drain,250);assert.equal(x[1].drain,500);assert.equal(x[1].ownHP,5500);assert.equal(x[2].ownHP,5000);assert.equal(x[3].ownHP,9000);});
test('3383原30816/478真实先制三令敌原20889当回合与次轮无效耗PP，第三轮原速度强化实际恢复',()=>{const x=H.window();assert.equal(x.expiredSpeed,1);assert.equal(x.actualPP,27);assert.equal(x.ownHP,9000);});
test('3383原30816完整原697失败门槛，封命中无效控制药剂零PP与原攻击MISS不吸取不封属、敌原加速真成功',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else{assert.equal(x.enemySpeed,1);assert.equal(x.drain,0);}}});
test.after(()=>console.log('ROUND53_3383_DRAIN_SOURCE_COUNTS '+JSON.stringify(H.report())));
