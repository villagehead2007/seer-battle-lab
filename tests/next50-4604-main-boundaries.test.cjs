'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,pick,turn,timer}=require('./helpers/4604-battle.cjs');
const sum=(s,type,side)=>(s.damageEvents??[]).filter(x=>x.round===s.round-1&&x.type===type&&x.targetSide===side).reduce((n,x)=>n+x.settledDamage,0);
test('4604真实1563自身固定百分比免疫不阻止直接损失及低HP翻倍',()=>{for(const hp of [9000,199]){const s=make(pick(1563)[0],{hp});timer(s,0,'固定百分比免疫');const o=turn(s);assert.equal(o.fighters[0].hp,hp-Math.min(hp,200));assert.equal(sum(o,'fixed',1),hp<200?600:300);}});
test('4604真实1563敌固定百分比免疫挡固定伤害但不挡自身损失和基础红伤',()=>{for(const hp of [9000,199]){const s=make(pick(1563)[0],{hp});timer(s,1,'固定百分比免疫');const o=turn(s);assert.equal(o.fighters[0].hp,hp-Math.min(hp,200));assert.equal(sum(o,'fixed',1),0);assert.ok(sum(o,'attack',1)>0);assert.equal(o.fighters[1].hp,9000-sum(o,'attack',1));}});
