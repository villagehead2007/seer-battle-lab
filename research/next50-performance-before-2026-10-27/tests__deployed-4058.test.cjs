'use strict';require('./deployed-4058-partial.test.cjs');

{const test=require('node:test').test,assert=require('node:assert/strict');test('4058 1674用招后理论吸取不因基础攻击击杀丢失',()=>{const o=require('./helpers/assert-717-1674-after-kill.cjs')(4058,1674);assert.equal(o.fighters[1].hp,0);assert.ok(o.fighters[0].hp>5000);});}
