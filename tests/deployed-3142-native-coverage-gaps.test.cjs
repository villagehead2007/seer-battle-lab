'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3142-native.cjs'),pp='potion:pp';
test('3142天雷583在真实整招中只清一槽且保护阻清，免弱与后两轮翻倍独立生成；不重复改旧PP实现',()=>{
 const seen=new Set();for(const mode of['none','PP保护','免疫PP削减'])for(let seed=1;seed<=8;seed++){const s=H.turn(H.make(24376,{seed,enemyMoves:[10086],bStats:{spe:9999},bEffects:mode==='none'?{}:{[mode]:{start:1,end:3}}}),24376,10086),zero=Object.keys(s.fighters[1].pp).filter(k=>s.fighters[1].pp[k]===0);assert.equal(zero.length,mode==='none'?1:0);if(zero.length)seen.add(zero[0]);assert.equal(s.fighters[0].effects['免弱'].end,5);assert.deepEqual(s.fighters[0].effects.doubleDamage,{start:2,end:3});}assert.ok(seen.size>1);
 let s=H.make(24376,{enemyId:3075,enemyMoves:[20491],bEffects:{PP保护:{start:1,end:1}}});for(let r=1;r<=6;r++){s=H.turn(s,r===1?24376:pp,20491);assert.equal(s.fighters[0].stages.spd,r<=5?0:-1);}
});
test('3142充电164只在三轮受真实攻击触发麻痹，第四轮不再触发；惊颤固定500不随未注明红伤翻倍放大',()=>{
 let s=H.make(23244,{enemyMoves:[10086]});s=H.turn(s,23244,10086);assert.ok(s.fighters[1].ailments['麻痹']);s=H.turn(s,pp);s=H.turn(s,pp);s=H.turn(s,pp,10086);assert.equal(s.fighters[1].ailments['麻痹'],undefined);
 s=H.make(24376,{extraMoves:[19732]});s=H.turn(s,24376);s=H.turn(s,19732);assert.equal(s.damageEvents.find(e=>e.round===2&&e.sourceSide===0&&e.type==='fixed').settledDamage,500);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('增减伤 2 ×'));
});
test('3142免异48五轮、反弹191四轮与五轮在真实睡眠下按期生效再结束，魂免断不延长期限',()=>{
 for(const[id,last,reflect]of[[23245,5,false],[24377,4,true],[24971,5,true]]){let s=H.make(id,{seed:require('../research/TEAM-STAGE-2/3142-native-sleep-fixture-seeds.json').rows.find(row=>row.id===id).seed,enemyId:3205,enemyMoves:[22053]});s=H.turn(s,id);s=H.turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);if(reflect)assert.ok(s.fighters[1].ailments['睡眠']);for(let r=3;r<=last;r++)s=H.turn(s,pp);s=H.turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']);}
});
test('3142金翼570真实抵挡一次攻击归零再恢复受伤，极光33只清当轮新正级；雷鸣联盟当前非长老无额外倍率',()=>{
 let s=H.make(19731,{enemyMoves:[10086],aStages:{acc:6}});s=H.turn(s,19731,10086);assert.equal(s.damageEvents.find(e=>e.round===1&&e.sourceSide===1&&e.type==='attack').settledDamage,0);s=H.turn(s,pp,10086);assert.ok(s.damageEvents.find(e=>e.round===2&&e.sourceSide===1&&e.type==='attack').settledDamage>0);
 s=H.turn(H.make(10823,{enemyMoves:[24624],bStats:{spe:2000},aStats:{spe:1},aStages:{acc:6}}),10823,24624);assert.equal(s.fighters[1].stages.def,0);assert.equal(s.fighters[0].stages.def,0);s=H.turn(H.make(30122),30122);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack').detail.includes('增减伤 1 ×'));
});
