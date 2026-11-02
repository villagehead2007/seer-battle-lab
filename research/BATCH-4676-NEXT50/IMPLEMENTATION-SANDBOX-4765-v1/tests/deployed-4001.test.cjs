'use strict';

{const test=require('node:test').test,assert=require('node:assert/strict');test('4001 1165实际用攻触发或原子回复量公共修复',()=>{const o=require('./helpers/assert-1165-use-trigger.cjs')(4001);assert.equal(o.fighters[1].effects.statusBlock,undefined);});}
