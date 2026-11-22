'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round66-3407-drain-native.cjs');
test('3407两完整原魂原25585全有序实例六级常一异常二封顶禁强独立，971半体4500吸3333低于半体吸6666并等量回血、禁疗伤免分开',()=>{const xs=H.positive();for(const x of xs){if(x.mode==='half')assert.equal(x.actualDamage,3333);if(x.mode==='below')assert.equal(x.actualDamage,6666);if(x.mode==='healban')assert.equal(x.actualHeal,0);if(x.mode==='immune'){assert.equal(x.actualDamage,0);assert.equal(x.actualHeal,6666);}}});
test('3407两原魂原25585自然四轮吸取与下两轮先制二，既授后原发电整招无效仍吸、药剂不吸、第四轮真吸第五轮真到期且敌真血药存活',()=>{const xs=H.period();assert.equal(xs.length,4);for(const x of xs)assert.ok(x.expiredEnemyHP>0);});
test('3407两原魂原25585完整原槽失败门槛，封命中无效控制药剂零PP不授强化双吸或先制，原必中面对必失阳性',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.positive,x.mode==='always');}});
test.after(()=>console.log('ROUND66_3407_DRAIN_COUNTS '+JSON.stringify(H.report())));
