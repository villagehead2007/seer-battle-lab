'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round70-3407-drain-ban-current-native.cjs');
test('3407原2093魂原29361完整四实例常一异常二与封顶禁强，半体3333低体6666吸取回血独立且实际损血时不授禁疗',()=>{for(const x of H.boosts()){if(x.mode==='half')assert.equal(x.drain,3333);if(x.mode==='below')assert.equal(x.drain,6666);if(x.mode==='healban')assert.equal(x.hp,1);}});
test('3407通用原2093吸取未减HP按原两回合即时禁疗，原3322同轮与次轮真实回血攻击受阻、第三轮到期同招恢复',()=>{const xs=H.healingBan();assert.equal(xs.length,1);for(const x of xs){assert.equal(x.actualBlockedHealCount,2);assert.ok(x.expiredActualHeal>0);}});
test('3407原29361原2479目标9999满体低于三成1000及2999真封先制而3000不封，三轮后真实恢复，四轮吸取既授无效仍吸药剂不吸自然到期',()=>{const xs=H.priorityAndPeriod();assert.equal(xs.length,5);assert.equal(xs[0].initialEnemyHP,1000);assert.equal(xs[1].initialEnemyHP,2999);assert.equal(xs[2].initialEnemyHP,3000);});
test('3407原2093魂原29361完整原槽首次门槛，封命中无效控制药剂零PP不授原强化吸取低体封先制或先制二，原必中阳性',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.positive,x.mode==='always');}});
test.after(()=>console.log('ROUND70_3407_DRAIN_BAN_CURRENT_COUNTS '+JSON.stringify(H.report())));
