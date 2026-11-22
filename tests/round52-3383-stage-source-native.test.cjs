'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round52-3383-stage-source-native.cjs');
test('3383原30818/813完整697下负级双倍反馈并清自身负级，敌免弱仍清己方、负六封底且正级保留',()=>{const x=H.feedback();assert.equal(x[0].enemyAtk,-4);assert.equal(x[1].ownAtk,0);assert.equal(x[1].enemyAtk,0);assert.equal(x[2].enemyAtk,-6);assert.equal(x[3].ownAtk,2);});
test('3383原25517三个有序实例先六级各一再清负级，原负一被首强化归零不获增伤、负二成功才授且禁强独立',()=>{const x=H.wings();assert.equal(x[0].damageGrant,true);assert.equal(x[1].damageGrant,false);assert.equal(x[3].damageGrant,true);assert.equal(x[4].actualAtk,6);});
test('3383原25517自然授150增伤与下两轮先制二，真实同原突击配对出招二三轮增伤并先制二、第四轮均到期',()=>{const x=H.timed();assert.ok(x[0].boosted>x[0].baseline);assert.equal(x[1].priority,2);assert.equal(x[2].priority,0);assert.equal(x[2].boosted,x[2].baseline);});
test('3383原30818与25517完整五槽原魂失败门槛，封命中整招无效受控药剂零PP及攻击MISS不反馈或授予',()=>{for(const move of [30818,25517])for(const x of H.failures(move)){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else if(!x.positive)assert.equal(x.ownAtk,-2);}});
test.after(()=>console.log('ROUND52_3383_STAGE_SOURCE_COUNTS '+JSON.stringify(H.report())));
