'use strict';const test=require('node:test'),assert=require('node:assert/strict');
test('4222公共修复旧3301无认证实例1061实际反转事件与保护回归',()=>{const o=require('./helpers/assert-1061-reversal-path.cjs')(3301,30434);assert.equal(o.fighters[1].stages.atk,0);});
test('4222公共修复旧3082/3200/3476无认证实例907真实负面反转及PP保护',()=>{for(const [id,move]of [[3082,19477],[3200,19964],[3476,31323]]){const o=require('./helpers/assert-656-907-protection.cjs')(id,907,move);assert.equal(o.fighters[0].stages.atk,2);assert.equal(Object.values(o.fighters[1].pp).filter(n=>n===0).length,0);}});
