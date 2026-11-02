'use strict';const test=require('node:test'),assert=require('node:assert/strict'),{verify}=require('./helpers/next50-base-probe.cjs');
test('4676全部26招基础先制、负命中下命中失败、必中与暴击实际状态',()=>{const result=verify(require('./helpers/4676-battle.cjs'));assert.equal(result.length,26);assert.ok(result.every(x=>x.hits>0&&x.ppSpent===1));});
test('4677全部17招基础先制、负命中下命中失败、必中与暴击实际状态',()=>{const result=verify(require('./helpers/4677-battle.cjs'));assert.equal(result.length,17);assert.ok(result.every(x=>x.hits>0&&x.ppSpent===1));});
test('4678全部5招基础先制、负命中下命中失败、必中与暴击实际状态',()=>{const result=verify(require('./helpers/4678-battle.cjs'));assert.equal(result.length,5);assert.ok(result.every(x=>x.hits>0&&x.ppSpent===1));});
test('4679全部5招基础先制、负命中下命中失败、必中与暴击实际状态',()=>{const result=verify(require('./helpers/4679-battle.cjs'));assert.equal(result.length,5);assert.ok(result.every(x=>x.hits>0&&x.ppSpent===1));});
test('4680全部5招基础先制、负命中下命中失败、必中与暴击实际状态',()=>{const result=verify(require('./helpers/4680-battle.cjs'));assert.equal(result.length,5);assert.ok(result.every(x=>x.hits>0&&x.ppSpent===1));});
