'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round74-3407-wind-native.cjs');
test('3407两合法原魂原25584完整四序原3847攻击DOT真反弹且原1089两抽，四轮自然到期第五轮同原攻击DOT进入而反击到期',()=>{for(const x of H.reflect()){assert.equal(x.reflected,true);assert.ok(x.expiredOwnDOT);}});
test('3407两原魂原25584反属性原469真用原20889强化后麻痹，免异三轮真实属性仍各强化、第四轮免异与监听皆过期同原招不麻痹',()=>{for(const x of H.attribute()){assert.equal(x.actualPositive,true);assert.equal(x.expiredSpeed,4);}});
test('3407两原魂原25584原1165真受原冲顶后下两轮原属性仅封命中仍用招耗PP，第三轮同原20889恢复强化，1089免异两抽不补',()=>{for(const x of H.attackSeal()){assert.equal(x.blockedActualStatusMoves,2);assert.equal(x.expiredSpeed,1);assert.equal(x.immuneDraws,2);}});
test('3407两原魂原25584原1089真受攻自然双抽瘫痪凝滞与真实禁换，全部相关异常自然到期后实际换入，原池无放回独立时长保留',()=>{const xs=H.teamLocks();assert.equal(xs.length,4);for(const x of xs){assert.equal(x.actualSwitched,true);assert.equal(x.draws.length,2);}});
test('3407两原魂原25584全四实例单挑首次失败门槛，封命中无效控制药剂零PP不授任何监听反弹而原必中阳性真双抽',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.positive,x.mode==='always');}});
test('3407两原魂原25584全四实例队伍首次失败门槛，无监听可真正换入，原必中阳性自然双抽真瘫痪禁换且原魂不删',()=>{for(const x of H.failures(true)){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.positive,x.mode==='always');}});
test.after(()=>console.log('ROUND74_3407_WIND_COUNTS '+JSON.stringify(H.report())));
