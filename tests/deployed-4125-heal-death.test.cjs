'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn,timer}=require('./helpers/4125-battle.cjs');
test('4125两版不同类回复反噬死亡后不继续恢复量附伤或随机异常',()=>{
 for(const soul of [1356,2051]){const s=make({moveId:14102,index:null},{soul,omit:true,hp:1});s.fighters[0].soulState.leonLastKind='physical';timer(s,0,'回复效果削减',{fraction:.999});s.fighters[0].soulState.soulGu=[{sourceSide:1,usedRound:0}];const o=turn(s,900031);assert.equal(o.fighters[0].hp,0);assert.equal((o.damageEvents??[]).filter(e=>e.type==='percent'&&e.targetSide===1).length,0);assert.equal(o.randomStatusEvents,undefined);assert.deepEqual(o.fighters[1].ailments,{});assert.equal(o.fighters[1].hp,9000);assert.ok(o.damageEvents.some(e=>e.type==='true'&&e.targetSide===0&&e.hpLoss===4));}
});
