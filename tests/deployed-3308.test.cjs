'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3308-native.cjs');
test('3308真实原集合20276仅特攻加一，禁强化与整招封属无强化，六级封顶且实际消耗原PP，完整635保留',()=>{
 for(const mode of['normal','ban','invalid','cap']){let s=H.make({stages:mode==='cap'?{spa:6}:{},effects:mode==='ban'?{禁强化:{start:1,end:1}}:mode==='invalid'?{statusBlock:{start:1,end:1}}:{}}),pp=s.fighters[0].pp['wiki:20276'];s=H.turn(s);assert.equal(s.fighters[0].pp['wiki:20276'],pp-1);for(const k of['atk','def','spa','spd','spe','acc'])assert.equal(s.fighters[0].stages[k],k==='spa'?(mode==='cap'?6:mode==='normal'?1:0):0);assert.equal(s.fighters[0].soulId,635);}
});
test('3308完整原635实际先手清一个真实敌招PP，后手附双防总和250固定并回250，技能禁疗不挡魂回复而全禁疗只挡回复',()=>{
 let s=H.make({fast:true});const original={...s.fighters[1].pp};s=H.turn(s);assert.equal(s.turns.at(-1).first,0);const zeros=s.fighters[1].moves.filter(k=>s.fighters[1].pp[k]===0&&original[k]>0);assert.equal(zeros.length,1);assert.equal(s.fighters[0].hp,1000);assert.equal((s.damageEvents??[]).filter(e=>e.sourceSide===0&&e.type==='fixed').length,0);
 for(const mode of['normal','skill-ban','all-ban']){s=H.make({effects:mode==='skill-ban'?{技能禁疗:{start:1,end:1}}:mode==='all-ban'?{四杀鬼囹:{start:1,end:1}}:{}});s=H.turn(s);assert.equal(s.turns.at(-1).first,1);assert.equal(s.damageEvents.filter(e=>e.sourceSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),250);assert.equal(s.fighters[1].hp,8750);assert.equal(s.fighters[0].hp,mode==='all-ban'?1000:1250);}
});
test('3308完整原635双防无正强化及负级免真实小火球烧伤，双防都强化时原30%烧伤可实际命中，不用注入异常或伪造随机',()=>{
 let selected;for(let i=0;i<48;i++){const seed='3308-true-burn-'+i,s=H.turn(H.make({seed,hp:9000,stages:{def:1,spd:1},enemyId:3012,enemyMoves:[12567]}),'wiki:20276','wiki:12567');if(s.fighters[0].ailments.烧伤!=null){selected={seed,s};break;}}assert.ok(selected,'finite real30% original burn samples include success');assert.ok(selected.s.damageEvents.some(e=>e.sourceSide===1&&e.type==='attack'&&e.settledDamage>0));for(const stages of[{}, {def:-1,spd:-1}]){const s=H.turn(H.make({seed:selected.seed,hp:9000,stages,enemyId:3012,enemyMoves:[12567]}),'wiki:20276','wiki:12567');assert.equal(s.fighters[0].ailments.烧伤,undefined);assert.ok(s.damageEvents.some(e=>e.sourceSide===1&&e.type==='attack'&&e.settledDamage>0));}
});
