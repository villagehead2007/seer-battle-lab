'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round57-3383-reflect-native.cjs');
test('3383原25516完整1065/191/1089当前行为，原3847攻击DOT反弹且真实反击随机抽一项，四轮反弹与反击自然到期第五轮DOT进入',()=>{const x=H.duration();assert.equal(x.firstCounterDraws,1);assert.equal(x.expiredOwnDots,1);assert.equal(x.ownImmune,0);});
test('3383原25516完整原697低体回血6000附粉6000，高体3000、实际封顶一与禁疗零，真实PP药不触发回复附粉',()=>{const x=H.heal();assert.equal(x[0].actualHeal,6000);assert.equal(x[1].actualPercent,3000);assert.equal(x[2].actualPercent,1);assert.equal(x[3].actualHeal,0);});
test('3383原25516完整原魂五槽失败门槛，封命中无效控制药剂零PP不授回血反弹或反击，原攻击DOT真进入而原必中阳性保留',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.positive,x.mode==='always');}});
test.after(()=>console.log('ROUND57_3383_REFLECT_COUNTS '+JSON.stringify(H.report())));
