'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/round78-3407-phase-native.cjs');
test('原3407旧魂722战阶结束低体真麻痹2烧伤3，回合初异常快照同战阶回复按实际量追加，封顶禁疗等体和新异常不倒填',()=>{assert.equal(H.original().length,4);});
test('原3407强化魂2093低体麻痹烧伤在战阶结束，免异失败自然百炼1层；真实DOT翻转体力比较后才回合末异常回复',()=>{assert.equal(H.advanced().length,2);});
test.after(()=>console.log('ROUND78_3407_PHASE_COUNTS '+JSON.stringify(H.report())));
