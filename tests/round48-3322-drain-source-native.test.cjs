'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round48-3322-drain-source-native.cjs');
test('3322原30510/33/870完整魂五槽实际清正与吸取100，空正保护及技能禁疗分别保留真实伤害回复',()=>{const x=H.clear();assert.equal(x[0].fixed,100);assert.equal(x[0].actorHP,5100);assert.equal(x[2].fixed,100);assert.equal(x[3].actorHP,5000);});
test('3322原30510/33/870封命中整招无效受控MISS无清强吸取，零PP拒绝不改原战斗',()=>{for(const x of H.failures(30510)){if(x.mode==='zero'){assert.equal(x.zeroRejected,true);assert.equal(x.unchanged,true);}else{assert.equal(x.fixed,0);assert.equal(x.actorHP,5000);}}});
test('3322原10016/1完整超级吸取实际红伤一半回血，满体上限和技能禁疗分别截断回复',()=>{const x=H.half();assert.ok(x[0].red>0);assert.equal(x[0].actorHP,5000+Math.floor(x[0].red/2));assert.equal(x[1].actorHP,9000);assert.equal(x[2].actorHP,5000);});
test('3322原10016/1封命中整招无效受控MISS不回半伤体力，零PP拒绝不改原战斗',()=>{for(const x of H.failures(10016)){if(x.mode==='zero'){assert.equal(x.zeroRejected,true);assert.equal(x.unchanged,true);}else assert.equal(x.actorHP,5000);}});
test('3322原30517/652/837自然命中吸取100到200到300封顶且理论等量回复，清强成功只授次回两轮必暴',()=>{const x=H.growth();assert.deepEqual(x[0].amounts,[100,200,300,300]);assert.deepEqual(x[0].crit,{start:2,end:3});assert.equal(x[0].finalHP,5900);assert.equal(x[1].crit,null);assert.equal(x[2].crit,null);assert.equal(x[3].actorHP,5000);});
test('3322原30517/652/837封命中无效受控MISS不增长，首次真正命中仍100且零PP拒绝不变',()=>{for(const x of H.failures(30517)){if(x.mode==='zero'){assert.equal(x.zeroRejected,true);assert.equal(x.unchanged,true);}else{assert.equal(x.fixed,0);assert.equal(x.firstLandedGrowth,100);}}});
test.after(()=>console.log('ROUND48_3322_DRAIN_SOURCE_COUNTS '+JSON.stringify(H.report())));
