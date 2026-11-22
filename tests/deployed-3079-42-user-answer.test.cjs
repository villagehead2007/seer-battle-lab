'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3079-native.cjs');
test('3079激雷23359效果42按用户答仅下回合电红翻倍，再下轮到期；普通红与魂百分比不翻倍',()=>{
 for(const grant of[20006,23359])for(const id of[10171,10006]){let s=turn(make(grant,{extraMoves:[id],bGear:{resistance:{percent:100}}}),grant);assert.deepEqual(s.fighters[0].effects['电系伤害翻倍'],{start:2,end:2});for(let r=2;r<=3;r++){s=turn(s,id);const hit=s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0);assert.ok(hit.detail.includes('增减伤 '+(r===2&&id===10171?2:1)+' ×'),hit.detail);assert.equal(s.damageEvents.find(e=>e.round===r&&e.type==='percent'&&e.sourceSide===0).settledDamage,0);}}
 let s=turn(make(23359,{extraMoves:[10171]}),23359);s=turn(s,10171);assert.equal(s.damageEvents.find(e=>e.round===2&&e.type==='percent'&&e.sourceSide===0).settledDamage,1800);
});
