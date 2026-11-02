'use strict';require('./deployed-4050-partial.test.cjs');

{const test=require('node:test').test,assert=require('node:assert/strict');test('4050 1065公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1065-atomic-heal.cjs')(4050);assert.equal(o.fighters[0].hp,8960);});}
