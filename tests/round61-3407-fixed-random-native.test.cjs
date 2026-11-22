'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round61-3407-fixed-random-native.cjs');
test('3407两原魂722与2093完整原30952每种正级80固定伤，负级零不计、三种240六种480与固定伤免疫真实边界',()=>{const xs=H.stages();for(const x of xs)assert.equal(x.fixed,x.mode==='none'||x.mode==='immune'?0:x.mode==='six'?480:240);assert.deepEqual([...new Set(xs.map(x=>x.soul))],[722,2093]);});
test('3407两原魂版本完整原30953两独立天然抽样100至300固定伤与回复，实际HP在原魂阶段结束回复前核对、禁疗封顶及伤免分开',()=>{const xs=H.random();assert.equal(xs.length,32);for(const x of xs){assert.equal(x.actualFixed,x.mode==='immune'?0:x.damage);assert.equal(x.actual,x.mode==='ban'?0:x.mode==='cap'?1:x.heal);}assert.ok(xs.some(x=>x.damage!==x.heal));});
test('3407两原魂两原招完整五槽失败门槛，封命中无效控制药剂零PP与原MISS不授固定附伤或随机回血抽样',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.fixed,0);}});
test.after(()=>console.log('ROUND61_3407_FIXED_RANDOM_COUNTS '+JSON.stringify(H.report())));
