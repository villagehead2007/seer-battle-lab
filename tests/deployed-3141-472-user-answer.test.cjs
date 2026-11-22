'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3141-native.cjs');
test('3141紫电472人答完整结算红伤回复，敌1HP保命不截断为零，没害怕和技能禁疗不回复',()=>{
 for(const soul of[480,611])for(const mode of['fear','none','ban']){const s=H.turn(H.make(14117,{soul,aHp:1000,bHp:1,bAilments:mode==='none'?{}:{害怕:3},bEffects:{致命保留:{start:1,end:3,hp:1}},aEffects:mode==='ban'?{无法通过自身技能恢复体力:{start:1,end:3}}:{},aStages:{acc:6}}),14117),e=s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0);assert.ok(e.settledDamage>1);assert.equal(e.hpLoss,0);assert.equal(s.fighters[0].hp,1000+(mode==='fear'?e.settledDamage:0));}
});

