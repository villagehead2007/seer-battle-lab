'use strict';const {test}=require('node:test'),assert=require('node:assert/strict');
require('./deployed-4002-partial.test.cjs');

test("4002 持续比例吸取在基础攻击击败后仍按理论量回复，免疫/溢出/禁疗分开",()=>{const o=require('./helpers/assert-597-nominal-after-kill.cjs')(4002);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[1].hp,0);});

{const test=require('node:test').test,assert=require('node:assert/strict');test('4002 1065公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1065-atomic-heal.cjs')(4002);assert.equal(o.fighters[0].hp,8960);});}
