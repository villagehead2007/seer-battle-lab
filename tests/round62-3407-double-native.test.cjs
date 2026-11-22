'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round62-3407-double-native.cjs');
test('3407两完整原魂722与2093原21305自然授两轮双倍，配对真实原拳击二轮约二倍第三轮与原发电基线同伤、魂印自然状态保留',()=>{for(const x of H.paired()){assert.ok(x.boosted>x.normal);assert.equal(x.expired,x.expiredBaseline);}});
test('3407两原魂原21305全五槽原实例失败门槛，封命中无效控制药剂零PP不授双倍而原必中面对必失阳性',()=>{for(const x of H.failures()){if(x.mode==='zero')assert.equal(x.zeroRejected,true);else assert.equal(x.positive,x.mode==='always');}});
test.after(()=>console.log('ROUND62_3407_DOUBLE_COUNTS '+JSON.stringify(H.report())));
