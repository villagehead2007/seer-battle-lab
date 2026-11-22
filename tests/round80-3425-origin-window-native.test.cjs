'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round80-3425-basic-windows-native.cjs');
test('公共1226来源回归原4853回响和4902两原魂蓄势回击真实授予末尾吸取，正常理论回血200或300且技能禁疗只阻回血不阻目标损血',()=>{const rows=H.originRegression();assert.ok(rows.some(x=>x.id===4853&&x.ban));assert.ok(rows.some(x=>x.id===4902&&x.ban));assert.ok(rows.some(x=>x.id===4902&&!x.ban));});
test.after(()=>console.log('ROUND82_PUBLIC_1226_ORIGIN_COUNTS '+JSON.stringify(H.report())));
