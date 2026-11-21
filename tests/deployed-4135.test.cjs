'use strict';const{test}=require('node:test'),assert=require('node:assert/strict'),{E,source,key,keys,make,turn,pick,timer,op}=require('./helpers/4135-battle.cjs');
const damage=(o,type,side=1)=>(o.damageEvents??[]).filter(d=>d.targetSide===side&&d.type===type).reduce((v,d)=>v+d.settledDamage,0);
test('4135 509按已损失体力三分之一回复，满体零与禁疗仍执行基础攻击',()=>{for(const hp of [9000,3000])for(const ban of [false,true]){const s=make(pick(509)[0],{hp});if(ban)timer(s,0,'技能禁疗');const o=turn(s);assert.equal(o.fighters[0].hp,hp+(ban?0:Math.floor((9000-hp)/3)));assert.ok(damage(o,'attack')>0);}});
