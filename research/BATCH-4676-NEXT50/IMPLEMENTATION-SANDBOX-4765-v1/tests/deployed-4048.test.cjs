'use strict';
{const test=require('node:test').test,assert=require('node:assert/strict');test('4048 1751公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1751-cold-probability.cjs')(4048);assert.equal(Object.keys(o.fighters[1].ailments).length,0);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('4048 532原子回复或无能力等级面板百分比公共修复',()=>{const o=require('./helpers/assert-4208-public-rules.cjs')(4048,532);assert.equal(o.fighters[0].hp,8960);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('4048两个真实魂印群星逆转免疫1693后额外真伤交互',()=>{const o=require('./helpers/assert-4048-1693-immunity.cjs')();assert.equal(o.fighters[1].hp,6200);});}
