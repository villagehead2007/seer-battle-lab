'use strict';const test=require('node:test'),assert=require('node:assert/strict'),rows=require('../research/4208-PUBLIC-INSTANCE-INVENTORY.json'),check=require('./helpers/assert-4208-public-rules.cjs');
test('532全部旧真实实例的一蛊/二蛊、满血、禁疗及500溢出实际回复附伤',()=>{for(const row of rows.filter(x=>x.effect===532)){const o=check(row.id,532);assert.equal(o.fighters[0].hp,8960);}});
test('853全部旧真实实例的速度负六/零/正六面板百分比基数一致',()=>{for(const row of rows.filter(x=>x.effect===853)){const o=check(row.id,853);assert.ok(o.fighters[1].hp<9000);}});
