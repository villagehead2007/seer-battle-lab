'use strict';const test=require('node:test'),assert=require('node:assert/strict'),check=require('./helpers/assert-4200-public-heal.cjs');
test('927三个旧认证真实实例：低体实际回复附伤不扣后续蛊',()=>{for(const id of [3575,3867,3875]){const o=check(id,927);assert.ok(o.fighters[0].hp>1000);}});
test('1323旧3739真实暴击吸血附伤使用原子实际回复',()=>{const o=check(3739,1323);assert.ok(o.fighters[0].hp>1000);});
test('923旧3575真实先手固定吸取被技能禁疗时不回复',()=>{const o=check(3575,923);assert.equal(o.fighters[0].hp,1000);});
test('927/1323三个未认证旧实例仅效果回归不宣称整只完成',()=>{for(const [id,effect]of [[3211,927],[3529,927],[3564,1323]])assert.ok(check(id,effect).fighters[0].hp>1000);});
