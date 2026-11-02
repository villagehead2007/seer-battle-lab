'use strict';
require('./deployed-3941-partial.test.cjs');

{const test=require('node:test').test,assert=require('node:assert/strict');test('3941 532原子回复或无能力等级面板百分比公共修复',()=>{const o=require('./helpers/assert-4208-public-rules.cjs')(3941,532);assert.equal(o.fighters[0].hp,8960);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3941 495条件概率或反转保护或原子回复公共修复',()=>{const o=require('./helpers/assert-4215-public-rules.cjs')(3941,495);assert.ok(o.fighters[0].hp>0);});}
