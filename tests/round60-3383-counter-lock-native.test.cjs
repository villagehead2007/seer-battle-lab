'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round60-3383-counter-lock-native.cjs');
test('3383原25516/1089完整697原槽真受攻击自然抽瘫痪凝滞各阻合法换宠、自然到期真实换入，免疫不补抽及无受攻或监听到期无锁',()=>{const x=H.positive();assert.equal(x[0].status,'瘫痪');assert.equal(x[1].status,'凝滞');for(const y of x)assert.equal(y.actualSwitched,1);assert.equal(x[2].draws,1);assert.equal(x[3].draws,0);assert.equal(x[4].draws,0);});
test('3383原25516/1089完整原魂原招队伍门槛，封命中无效控制药剂零PP不授反击锁且可真换，原必中面对必失自然瘫痪真禁换',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.positive,x.mode==='always');}});
test.after(()=>console.log('ROUND60_3383_COUNTER_LOCK_COUNTS '+JSON.stringify(H.report())));
