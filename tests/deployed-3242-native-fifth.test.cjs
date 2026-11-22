'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3242-native.cjs');
test('3242王圣勇战意1022吸强成功吸取300，禁强清对手不获强化无奖励，满六仍成功与保护无正失败',()=>{
 for(const mode of ['normal','ban','cap','protected','empty']){const s=H.turn(H.make(30158,{aHp:1000,aStages:{atk:mode==='cap'?6:0},bStages:{atk:mode==='empty'?-1:2},aEffects:mode==='ban'?{禁强化:{start:1,end:1}}:{},bEffects:mode==='protected'?{强化保护:{start:1,end:1}}:{}}),30158),success=['normal','cap'].includes(mode);assert.equal(s.fighters[0].stages.atk,mode==='cap'?6:mode==='normal'?2:0);assert.equal(s.fighters[1].stages.atk,mode==='empty'?-1:mode==='protected'?2:0);assert.equal(H.damage(s,'fixed'),success?300:0);assert.equal(s.fighters[0].hp,success?3610:3400);assert.equal(s.fighters[1].hp,9000-H.damage(s,'attack')-(success?300:0));assert.ok(H.damage(s,'attack')>0);}
});
test('3242第五779只要求对手当前有正强化，保护或自身禁强化不挡先制加二，无正则原0先制慢速后手',()=>{
 for(const mode of ['normal','protected','own-ban','empty']){const s=H.turn(H.make(30158,{enemyMoves:[10086],aStats:{spe:1},bStats:{spe:4000},bStages:{atk:mode==='empty'?0:2},aEffects:mode==='own-ban'?{禁强化:{start:1,end:1}}:{},bEffects:mode==='protected'?{强化保护:{start:1,end:1}}:{}}),30158,10086);assert.equal(s.turns.at(-1).first,mode==='empty'?1:0);assert.ok(H.damage(s,'attack')>0);}
});
test('3242第五760微弱0点5改为普通1，中性1与克制2保留，完整原魂和吸强实例均执行',()=>{
 for(const [enemyId,raw]of [[3205,.5],[3001,1],[2989,2]]){const values=[],old=H.E.WIKI.effectsEngine;H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const result=old.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0)values.push(c.affinity);return result;}};let s;try{s=H.turn(H.make(30158,{enemyId}),30158);}finally{H.E.WIKI.effectsEngine=old;}assert.equal(H.E.typeEffectiveness('战斗',s.fighters[1].type),raw);assert.deepEqual(values,[Math.max(1,raw)]);assert.ok(H.damage(s,'attack')>0);}
});
