'use strict';require('./deployed-4032-partial.test.cjs');

{const test=require('node:test').test,assert=require('node:assert/strict');test('4032 1065公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1065-atomic-heal.cjs')(4032);assert.equal(o.fighters[0].hp,8960);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('4032 34122效果907公共反转事件或PP保护真实回归',()=>{const o=require('./helpers/assert-656-907-protection.cjs')(4032,907,34122);assert.ok(o.fighters[0].hp>0);});}
