'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round43-original1562-native.cjs');
function positive(id){const xs=H.success(id);assert.equal(xs[0].armed,1);assert.ok(xs[0].ailments[xs[0].watchStatus]);assert.equal(xs[1].armed,0);for(const x of xs.slice(1))assert.equal(x.ailments[x.watchStatus],undefined);assert.equal(xs[4].deathReplacement,true);return xs;}
function negative(id){const xs=H.failures(id);for(const x of xs){if(x.mode==='zero'){assert.equal(x.zeroRejected,true);assert.equal(x.unchanged,true);}else{assert.equal(x.armed,x.mode==='always'?1:0);assert.equal(!!x.ailments[x.watchStatus],x.mode==='always');}}return xs;}
test('4364原35847/1562首段真实麻痹才授三回合束缚传播，先天免异不授、继任免异到期死补不传',()=>{const x=positive(4364);assert.equal(x[0].initial,'麻痹');assert.ok(x[0].ailments.束缚);assert.equal(x[4].deathMethod,'initialBothHP1-first-hit-zero-red-second-original-hit-real-KO');});
test('4364原35847/1562原准确0非必中用初始通用必中隔离正分支，MISS封命中无效受控药剂零PP均不授监听',()=>{const x=negative(4364);assert.equal(x.at(-1).mode,'miss');assert.equal(x[0].armed,0);});
test('4605原37135/1562首段真实束缚才授两回合换入后束缚，免异到期真自爆死补均不传播',()=>{const x=positive(4605);assert.ok(x[0].ailments.束缚);assert.equal(x[4].deathReplacement,true);});
test('4605原37135/1562同招478与2060原序保留，MISS封命中无效受控药剂零PP均不授换宠监听',()=>{const x=negative(4605);assert.equal(x[0].armed,0);assert.equal(x[4].zeroRejected,true);});
test('4898原29339/1562首段真实狂信才授两回合第三槽狂信，原2474与2475条件保留，免疫到期死补不传',()=>{const x=positive(4898);assert.ok(x[0].ailments.狂信);assert.equal(x[4].deathReplacement,true);});
test('4898原29339/1562原必中面对必失仍实际传播，原魂完整且封命中无效受控药剂零PP分别核',()=>{const x=negative(4898);assert.ok(x.at(-1).ailments.狂信);assert.equal(x[0].armed,0);});
test.after(()=>console.log('ROUND43_ORIGINAL1562_COUNTS '+JSON.stringify(H.report())));
