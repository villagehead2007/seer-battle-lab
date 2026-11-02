'use strict';const test=require('node:test'),assert=require('node:assert/strict'),check=require('./helpers/assert-4215-public-rules.cjs');
test('495真实3941条件秒杀不受只作用异常附加的寒月概率规则压制',()=>{const o=check(3941,495);assert.ok(o.fighters[0].hp>0);});
test('1495真实4037反转尊重强化保护与免弱，实际反转成功才清PP',()=>{const o=check(4037,1495);assert.equal(o.fighters[1].stages.atk,-2);});
test('1290三个旧真实实例保留各自固定/用户确认百分比类型，原子实际回复附伤',()=>{for(const id of [3524,3672,3983])assert.equal(check(id,1290).fighters[0].hp,1000);});
