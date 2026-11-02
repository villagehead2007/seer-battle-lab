'use strict';
require('./deployed-3940-partial.test.cjs');

{const test=require('node:test').test,assert=require('node:assert/strict');test('3940 583真实实例PP保护及免疫PP削减公共修复状态验证',()=>{const o=require('./helpers/assert-583-pp-protection.cjs')(3940);assert.ok(o.fighters[1].moves.every(k=>o.fighters[1].pp[k]>0));});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3940 532原子回复或无能力等级面板百分比公共修复',()=>{const o=require('./helpers/assert-4208-public-rules.cjs')(3940,532);assert.equal(o.fighters[0].hp,8960);});}
