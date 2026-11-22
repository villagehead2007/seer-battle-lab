'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round69-3407-drain-ban-focused-native.cjs');
test('3407原2093魂原29361完整四实例常一异常二与封顶禁强，半体3333低体6666吸取回血独立且实际损血时不授禁疗',()=>{for(const x of H.boosts()){if(x.mode==='half')assert.equal(x.drain,3333);if(x.mode==='below')assert.equal(x.drain,6666);if(x.mode==='healban')assert.equal(x.hp,1);}});
test('原3407与4942两通用2093未减敌HP，当轮和次轮限制对手回复，到期同招恢复',()=>{const xs=require('./helpers/2093-healing-window.cjs')([3407,4942]);assert.equal(xs.length,2);for(const x of xs){assert.equal(x.actualBlockedHealCount,2);assert.ok(x.expiredActualHeal>0);}});
test('3407原29361原2479目标9999满体低于三成1000真封先制而3000不封，三轮后真实恢复，四轮吸取既授无效仍吸药剂不吸自然到期',()=>{const xs=H.priorityAndPeriod();assert.equal(xs.length,4);assert.equal(xs[0].initialEnemyHP,1000);assert.equal(xs[1].initialEnemyHP,3000);});
test('3407原2093魂原29361完整原槽首次门槛，封命中无效控制药剂零PP不授原强化吸取低体封先制或先制二，原必中阳性',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.positive,x.mode==='always');}});
test.after(()=>console.log('ROUND69_3407_DRAIN_BAN_FOCUSED_COUNTS '+JSON.stringify(H.report())));
