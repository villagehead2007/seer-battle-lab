'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3425-native.cjs');
test('3425原740和1030四真实版本低回复奖励只限下回合，药剂度过后红增伤与回血翻倍不得延至第三回合',()=>{
 for(const source of H.versions){let x=H.turn(H.make(source));assert.equal(x.observed.length,1);assert.ok(x.observed[0].restored>0&&x.observed[0].restored<300);x=H.turn(x.s,false);assert.equal(x.observed.length,0);x=H.turn(x.s);assert.equal(x.observed.length,1);const h=x.observed[0];assert.equal(h.round,3);assert.ok(h.red>0);assert.equal(h.request,h.red*.5,'第三回合过期，原50%回复率恢复');assert.equal(x.s.fighters[0].counts.nextAttackBoost??0,0,'魂印下回合奖励不得污染无期限下N次攻击储备');}
});
test('3425原740和1030四真实版本低回复阈值按实际0和299触发、300与301不触发，下一回合按完整红伤50%或100%实际回血',()=>{
 for(const source of H.versions)for(const restored of[0,299,300,301]){let x=H.turn(H.make(source,{hp:9000-restored,atk:9999,retain:true}));assert.equal(x.observed.length,1);assert.ok(x.observed[0].request>301);assert.equal(x.observed[0].restored,restored);assert.equal(x.s.fighters[1].hp,1);x=H.turn(x.s);assert.equal(x.observed.length,1);const h=x.observed[0];assert.equal(h.round,2);assert.ok(h.red>0);assert.equal(h.request,h.red*(restored<300?1:.5));assert.equal(x.s.fighters[0].hp,9000);assert.equal(x.s.fighters[1].hp,1);}
});
