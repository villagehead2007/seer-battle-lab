'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3205-native.cjs'),store=require('../local-species.cjs'),primary=require('../research/TEAM-STAGE-2/3205-local-elder-identities-current-source.json');
const D=require('../dist/battle-display.js');
function observed(enemyId){for(let seed=1;seed<=8;seed++){const old=H.E.WIKI.effectsEngine;let captured;H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const before=c.modifier,result=old.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0)captured={before,after:c.modifier,sourceNumber:c.a.number,targetNumber:c.t.number};return result;}};try{const s=H.turn(H.make(30125,{enemyId,seed}),30125);if(captured){assert.equal(Number(s.fighters[1].number),enemyId);assert.ok(captured.before>0);return captured;}}finally{H.E.WIKI.effectsEngine=old;}}throw Error('no naturally used attack in eight initial seeds for '+enemyId);}
test('3205联盟1064对SeerAPI明确为长老的既有3194魔王3592修罗3673艾夏拉真实整招增伤50%',()=>{
 for(const id of [3194,3592,3673]){const raw=primary.rows.find(x=>x.data?.id===id);assert.ok(raw.data.introduction.includes('长老'));assert.equal(raw.data.name,store.species(id).name);const state=observed(id);assert.equal(state.after,state.before*1.5,String(id)+' primary-source elder identity');}
});
test('3205联盟1064资格展示只读同一真实名单，明确长老加50而普通目标不触发，不改技能原文或状态',()=>{
 for(const id of [3194,3592,3673,2989,4933]){const s=H.make(30125,{enemyId:id}),before=structuredClone(s),out=D.fighter(s.fighters[0],s.round,s.moveDefinitions,s).items,row=out.find(x=>x.name==='王·联盟审判 · 长老加成');assert.ok(row);assert.match(row.value,[3194,3592,3673].includes(id)?/触发.*红伤 \+50%/:/未触发/);assert.deepEqual(s,before);assert.equal(H.source.moves.find(m=>m.id===30125).description,'对大暗黑天长老造成的伤害提高50%；35%概率使对手陷入睡眠状态2回合');}
});
test('3205联盟1064不把普通卡多奇或名字含修罗的修罗铠甲当成长老，真实原魂原招保留',()=>{
 for(const id of [2989,4933]){const state=observed(id);assert.equal(state.after,state.before,String(id)+' no name-based group guess');}
});

