'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3102-native.cjs');
test('3102拳风与斗气后手不触发先手40翻倍，破元闪真实先制一在低速度时仍先手',()=>{
 for(const soul of[449,456])for(const id of[10636,19561]){const s=H.turn(H.make(id,{soul,aStats:{spe:1},enemyMoves:[10086]}),id,10086);assert.equal(s.turns.at(-1).first,1);const e=s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack');assert.ok(e.detail.includes('威力 '+H.source.moves.find(m=>m.id===id).power+' '),e.detail);}
 const s=H.turn(H.make(10710,{aStats:{spe:1},enemyMoves:[10086]}),10710,10086);assert.equal(s.turns.at(-1).first,0);assert.equal(s.fighters[0].soulState.resolvedPriority.value,1);
});
test('3102两魂储备固伤遇命中零红仍消费，非MISS失败保留；预设第二回合免伤不改变真实第一回合储备产生',()=>{
 for(const soul of[449,456]){let s=H.turn(H.make(19565,{soul,bEffects:{当回合免伤:{start:2,end:2}}}),19565);assert.ok(s.fighters[0].soulState.ruierFixedNext>0);s=H.turn(s,19565);assert.equal(s.damageEvents.find(e=>e.round===2&&e.sourceSide===0&&e.type==='attack').settledDamage,0);assert.equal(s.fighters[0].soulState.ruierFixedNext,0);assert.equal(s.fighters[0].soulState.ruierFixedThis,0);}
});
