'use strict';
require('./deployed-3983-partial.test.cjs');

{const test=require('node:test').test,assert=require('node:assert/strict');test('3983 1290条件概率或反转保护或原子回复公共修复',()=>{const o=require('./helpers/assert-4215-public-rules.cjs')(3983,1290);assert.equal(o.fighters[0].hp,1000);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3983 1165实际用攻触发或原子回复量公共修复',()=>{const o=require('./helpers/assert-1165-use-trigger.cjs')(3983);assert.equal(o.fighters[1].effects.statusBlock,undefined);});}

require('./panel-comparison-confirmations.test.cjs');
