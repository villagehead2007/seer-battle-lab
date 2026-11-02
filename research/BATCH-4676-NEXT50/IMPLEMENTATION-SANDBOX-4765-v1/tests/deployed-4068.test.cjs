'use strict';
{const test=require('node:test').test,assert=require('node:assert/strict');test('4068 1239实际回复附伤不减去后续蛊反噬公共修复',()=>{const o=require('./helpers/assert-1239-atomic-heal.cjs')(4068);assert.equal(o.fighters[0].hp,8960);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('4068 717用招后理论吸取不因基础攻击击杀丢失',()=>{const o=require('./helpers/assert-717-1674-after-kill.cjs')(4068,717);assert.equal(o.fighters[1].hp,0);assert.ok(o.fighters[0].hp>5000);});}
