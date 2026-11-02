'use strict';

const test=require('node:test').test,assert=require('node:assert/strict'),check1126=require('./deployed-4258-1126-answers.cjs');
test('4258真实1126已命中零伤计入、MISS无效不计且先用后受击不补清，PP保护独立',()=>{const o=check1126(4258);assert.equal(Object.values(o.fighters[1].pp).filter(v=>v>0).length,5);});
test('3311真实1126已命中零伤计入、MISS无效不计且先用后受击不补清，PP保护独立',()=>{const o=check1126(3311);assert.equal(Object.values(o.fighters[1].pp).filter(v=>v>0).length,5);});
