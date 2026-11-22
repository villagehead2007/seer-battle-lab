'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3289-native.cjs');
test('3289怒涛震天533清双方正负遵守强化保护与弱化锁，禁强化不阻清除，整招无效不清',()=>{
 for(const mode of ['normal','protect','lock','own-ban','invalid']){const s=H.turn(H.make(23556,{aStages:{atk:2,def:-1},bStages:{spa:2,spd:-2},aEffects:mode==='lock'?{弱化不可解除反转:{start:1,end:1}}:mode==='own-ban'?{禁强化:{start:1,end:1}}:mode==='invalid'?{statusBlock:{start:1,end:1}}:{},bEffects:mode==='protect'?{强化保护:{start:1,end:1}}:mode==='lock'?{弱化不可解除反转:{start:1,end:1}}:{}}),23556);assert.equal(s.fighters[0].stages.atk,mode==='invalid'?2:0);assert.equal(s.fighters[0].stages.def,['lock','invalid'].includes(mode)?-1:0);assert.equal(s.fighters[1].stages.spa,['protect','invalid'].includes(mode)?2:0);assert.equal(s.fighters[1].stages.spd,['lock','invalid'].includes(mode)?-2:0);}
});
test('3289怒涛震天533真实清强必须派发原690反应，当前回合封属性而非静默归零',()=>{
 let s=H.make(23556,{enemyId:3242,enemyMoves:[24120],aStats:{spe:4000}});s=H.turn(s,'potion:pp',24120);s=H.turn(s,23556);assert.equal(s.fighters[0].effects.statusBlock.start,2);assert.equal(s.fighters[0].effects.statusBlock.end,4);
});
test('3289怒涛震天与天龙出水原58只令下两回实际暴击，第四回到期，原完整技能其他效果保留',()=>{
 for(const move of [23556,25290]){let s=H.make(move,{extraMoves:[10004],aStages:{acc:6}});s=H.turn(s,move);for(let r=2;r<=4;r++){s=H.turn(s,10004);const reds=s.turns.at(-1).events.filter(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0);assert.ok(reds.length>0);assert.equal(s.turns.at(-1).events.some(e=>e.text.includes('致命一击')),r<=3);}}
});
