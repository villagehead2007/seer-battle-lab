'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn,timer}=require('./helpers/4075-battle.cjs');
test('4075两版吸取回复反噬死亡后不继续清空对手PP',()=>{
 for(const soul of [1320,1544]){const s=make({moveId:14102,index:null},{soul,omit:true,hp:1});timer(s,0,'回复效果削减',{fraction:.999});s.fighters[0].soulState.soulGu=[{sourceSide:1,usedRound:0}];const o=turn(s,900031);assert.equal(o.fighters[0].hp,0);assert.equal(Object.values(o.fighters[1].pp).filter(v=>v===0).length,0);assert.equal(o.damageEvents.find(e=>e.type==='percent').settledDamage,3000);assert.ok(o.damageEvents.some(e=>e.type==='true'&&e.targetSide===0&&e.hpLoss===4));}
});
test('4075两版战阶回复反噬死亡后不继续按回合初弱化种类附固定伤害',()=>{
 for(const soul of [1320,1544]){const s=make({moveId:14102,index:null},{soul,omit:true,hp:1});s.fighters[0].stages.atk=1;s.fighters[1].stages.def=-1;timer(s,0,'回复效果削减',{fraction:.9});s.fighters[0].soulState.soulGu=[{sourceSide:1,usedRound:0}];const o=turn(s,900031);assert.equal(o.fighters[0].hp,0);assert.equal((o.damageEvents??[]).filter(e=>e.type==='fixed'&&e.targetSide===1).length,0);assert.equal(o.fighters[1].hp,9000);}
});
