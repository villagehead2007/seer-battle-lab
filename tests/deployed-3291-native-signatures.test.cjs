'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3291-native.cjs');
const active=(start=1,end=4)=>({start,end});

test('3291五专属注册实例严格绑定原技能版本、实例零与空参数，未知版本不得静默执行',()=>{
 for(const [id,move]of [[1094,30376],[1095,25294],[1096,25295],[1097,30380],[1098,30381]]){
  const m=H.source.moves.find(x=>x.id===move),rule=H.E.WIKI.effectsEngine.registry[id];
  assert.doesNotThrow(()=>rule.validate([],m,0));
  assert.throws(()=>rule.validate([],{...m,revision:'seerapi:unreviewed'},0),/source mismatch/);
  assert.throws(()=>rule.validate([],m,1),/source mismatch/);
  assert.throws(()=>rule.validate([1],m,0));
 }
});

test('3291原1094消强遵守独立强化保护，消回合受保护失败不清PP，不授皇怒概率奖励',()=>{
 const s=H.turn(H.make(30376,{aStages:{acc:6},bStages:{atk:2},bEffects:{protect:active(),强化保护:active()}}),30376);
 assert.equal(s.fighters[1].stages.atk,2);assert.equal(s.fighters[0].effects.rageBonus,undefined);
 assert.ok(s.fighters[1].effects.protect);assert.ok(s.fighters[1].effects.强化保护);
 assert.ok(s.fighters[1].moves.every(k=>s.fighters[1].pp[k]>0));
});

test('3291原1094先消除可清PP保护再随机两项PP归零，消强奖励独立且从下一回合起两回合',()=>{
 const s=H.turn(H.make(30376,{enemyMoves:[10086],bStats:{spe:9999},aStages:{acc:6},bStages:{atk:2},bEffects:{免弱:active(),PP保护:active()}}),30376,10086);
 assert.equal(s.fighters[1].effects.免弱,undefined);assert.equal(s.fighters[1].stages.atk,0);
 assert.equal(s.fighters[0].effects.rageBonus.start,2);assert.equal(s.fighters[0].effects.rageBonus.end,3);
 assert.equal(s.fighters[1].effects.PP保护,undefined);assert.equal(s.fighters[1].moves.filter(k=>s.fighters[1].pp[k]===0).length,2);
});

test('3291原1095次数免异同源刷新为二且异源三次保留，再次用门不累加同源次数',()=>{
 let s=H.make(25294,{aCounts:{immune:3},enemyMoves:[10086]});s=H.turn(s,25294,10086);
 assert.equal(s.fighters[0].counts.immune,5);assert.equal(s.fighters[0].effects.gate.start,1);assert.equal(s.fighters[0].effects.gate.end,3);
 s=H.turn(s,25294,10086);assert.equal(s.fighters[0].counts.immune,5);
 const records=s.fighters[0].soulState.ailmentImmuneSources;
 assert.ok(records.some(e=>e.kind==='legacy'&&e.count===3));assert.equal(records.filter(e=>e.key.includes('1095')).length,1);
});

test('3291原1097低伤疲惫和未击败下回合封攻为独立条件，高红伤未击败仍封攻',()=>{
 for(const atk of [180,5000]){
  const s=H.turn(H.make(30380,{aStats:{atk},bStats:{def:400},bHp:9000}),30380),f=s.fighters[1];
  const normal=s.turns[0].events.find(e=>e.kind==='damage'&&!e.text.includes('星皇之怒'));
  assert.ok(normal);assert.equal(Boolean(f.ailments.疲惫),normal.damage.settledDamage<280);
  assert.equal(f.effects.attackBlock.start,2);assert.equal(f.effects.attackBlock.end,2);
 }
});

test('3291原1098未命中不成长，命中零红仍成长，暴击授予后两次不减威力不追溯本次皇怒',()=>{
 for(const mode of ['invalid','zero','critical']){
  const input=H.make(30381,{seed:4,criticals:mode==='critical',aEffects:mode==='invalid'?{skillBlock:active()}:mode==='critical'?{必定暴击:active()}:{},bEffects:mode==='zero'?{攻击伤害免疫:active()}:{} });
  const s=H.turn(input,30381);assert.equal(s.fighters[0].fifthUses,mode==='invalid'?0:1);
  if(mode==='critical'){assert.equal(s.fighters[0].counts.rageFull,2);const extra=s.turns[0].events.find(e=>e.kind==='damage'&&e.text.includes('星皇之怒'));if(extra)assert.match(extra.detail,/威力 80 ·/);}
 }
});
