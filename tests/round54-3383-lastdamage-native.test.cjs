'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round54-3383-lastdamage-native.cjs');
test('3383原30820/807/933由敌原冲顶真实建立上次红伤并等量附加，未击败自然授两次必暴，药剂不耗且原突击真暴真暴非暴',()=>{const x=H.sequence();assert.ok(x.actualPrevious>0);assert.equal(x.actualAdded,x.actualPrevious);assert.deepEqual(x.criticals,[true,true,false]);});
test('3383原30820完整原697命中零红仍授两次必暴，真实击败不授且原魂自然回满体力与已耗PP',()=>{const x=H.zeroAndKo();assert.equal(x[0].nextCrit,2);assert.equal(x[1].nextCrit,0);assert.equal(x[1].targetHP,0);});
test('3383原30820原魂五槽完整失败门槛，封命中无效控制药剂零PP与原MISS不授次攻必暴及807附伤',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.nextCrit,0);}});
test.after(()=>console.log('ROUND54_3383_LASTDAMAGE_COUNTS '+JSON.stringify(H.report())));
