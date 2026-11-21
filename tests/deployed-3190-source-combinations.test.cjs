'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3190-native.cjs'),pp='potion:pp';
const red=(s,side=0)=>s.turns.at(-1).events.find(e=>e.damage?.sourceSide===side&&e.damage.type==='attack');
test('3190保留原逐招接入，补全部原实例多阶段有序参数绑定与两版零PP疲惫，不改原档',()=>{
 const before=structuredClone(H.source);for(const m of H.source.moves){const c=H.E.WIKI.compile(m,H.source);assert.equal(c.issue,'');assert.deepEqual([...new Set(c.operations.map(o=>o.index))],m.effectInstances.map((_,i)=>i));for(const o of c.operations){assert.equal(o.effectId,m.effectInstances[o.index].id);assert.deepEqual(o.sourceArgs,m.effectInstances[o.index].args);}}
 for(const soul of[516,531])for(const id of[10405,21090,19926]){let s=H.make(id,{soul}),k='wiki:'+id;s.fighters[0].pp[k]=0;assert.throws(()=>H.turn(s,id),/有 PP/);s=H.turn(H.make(id,{soul,aAilments:{疲惫:2}}),id);assert.equal(s.fighters[0].pp[k],H.source.moves.find(m=>m.id===id).pp);assert.equal(s.fighters[1].hp,9000);}assert.deepEqual(H.source,before);
});
test('3190邪灵66仅本招实际击败回复四分一，夜影37严格低四分一翻倍而双重107按本体红伤不足250才攻一',()=>{
 for(const ko of[false,true]){const s=H.turn(H.make(12110,{bHp:ko?1:9000,aStages:{acc:6}}),12110);assert.equal(s.fighters[0].hp,ko?6750:4500);}
 for(const hp of[2249,2250,2251]){const s=H.turn(H.make(15855,{aHp:hp,aStages:{acc:6}}),15855);assert.ok(red(s).detail.includes('威力 '+(hp<2250?160:80)+' '));}
 for(const atk of[180,9999]){const s=H.turn(H.make(12112,{aStats:{atk},aStages:{acc:6}}),12112),n=red(s).damage.settledDamage;assert.equal(s.fighters[0].stages.atk,n<250?1:0);}
});
test('3190黎夜931吸强成功才清两不同PP，防消吸禁强化及PP保护分开阻挡，1029低于200只授下一轮先制一',()=>{
 for(const mode of['normal','noBoost','protect','ban','pp']){const s=H.turn(H.make(19923,{enemyMoves:[10086],bStats:{spe:9999},bStages:mode==='noBoost'?{}:{def:2},aEffects:mode==='ban'?{禁强化:{start:1,end:4}}:{},bEffects:mode==='protect'?{强化保护:{start:1,end:4}}:mode==='pp'?{PP保护:{start:1,end:4}}:{}}),19923,10086);const stolen=!['noBoost','protect','ban'].includes(mode);assert.equal(s.fighters[1].stages.def,mode==='protect'?2:0);assert.equal(s.fighters[0].stages.def,stolen?2:0);assert.equal(Object.values(s.fighters[1].pp).filter(n=>n===0).length,mode==='normal'?2:0);}
 for(const atk of[180,9999]){let s=H.turn(H.make(19923,{aStats:{atk},extraMoves:[21090]}),19923),small=red(s).damage.settledDamage<200;s=H.turn(s,21090);assert.equal(s.fighters[0].soulState.resolvedPriority.value,small?1:0);s=H.turn(s,21090);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);}
});
test('3190碎梦1030真实反馈负级清自身且成功害怕，无负级不控，免弱阻目标但不混作反转',()=>{
 for(const mode of['normal','empty','immune']){const s=H.turn(H.make(25068,{aStages:mode==='empty'?{}:{atk:-2},bEffects:mode==='immune'?{免弱:{start:1,end:4}}:{}}),25068);assert.equal(s.fighters[0].stages.atk,0);assert.equal(s.fighters[1].stages.atk,mode==='normal'?-2:0);assert.equal(!!s.fighters[1].ailments['害怕'],mode!=='empty');}
});
test('3190幽茫1031按出手时当轮已受完整伤害决定次轮封属，零伤盾与真正命中不同；第五1032清回合成功次轮封攻',()=>{
 for(const shield of[false,true]){let s=H.make(19925,{aStats:{spe:1},bStats:{spe:2000},enemyMoves:[10086,20889],aEffects:shield?{攻击伤害免疫:{start:1,end:1}}:{}});s=H.turn(s,19925,10086);const wasHit=red(s,1)?.damage.settledDamage>0;assert.equal(!!s.fighters[1].effects.statusBlock,!wasHit);s=H.turn(s,pp,20889);assert.equal(s.fighters[1].stages.atk,wasHit?1:0);}
 for(const clear of[false,true]){let s=H.make(19926,{enemyId:3205,enemyMoves:[21042,10499],bStats:{spe:2000},aStages:{acc:6}});s=H.turn(s,19926,clear?21042:pp);assert.equal(!!s.fighters[1].effects.attackBlock,clear);s=H.turn(s,pp,10499);assert.equal(!!red(s,1),!clear);s=H.turn(s,pp,10499);assert.equal(s.fighters[1].pp['wiki:10499'],s.moveDefinitions['wiki:10499'].pp-2);}
});
