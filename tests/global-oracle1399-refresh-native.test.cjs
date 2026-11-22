'use strict';const test=require('node:test'),assert=require('node:assert/strict'),run=require('./helpers/oracle1399-native.cjs');
test('4894两版完整原魂1399真实清幻变后控免才刷新同源一次，异源两次保留，真实安魂曲优先消费新来源',()=>{
 for(const soul of [2081,2104]){const states=run(soul);for(const i of [0,1]){assert.equal(states[i].fighters[0].soulId,soul);assert.equal(states[i].fighters[0].counts.immune,3);assert.equal(states[i].fighters[0].soulState.ailmentImmuneSources.filter(e=>e.key==='1399:57f7210d:0:0').length,1);}const f=states[2].fighters[0];assert.equal(f.counts.immune,2);assert.equal(f.ailments.睡眠,undefined);assert.equal(f.soulState.ailmentImmuneSources.some(e=>e.key==='1399:57f7210d:0:0'&&e.count>0),false);}
});
