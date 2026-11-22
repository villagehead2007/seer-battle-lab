'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3082-native.cjs'),pp='potion:pp';
test('3082驱魂57四轮用招回三分一第五停，索命77两轮用招回250第三停，用药禁疗分别阻本技能回复',()=>{
 for(const[id,last,n]of[[24835,4,3000],[19475,2,250]]){let s=make(id,{extraMoves:[20077],aHp:id===24835?1:4500,aAilments:id===24835?{中毒:7}:{}}),hp=id===24835?1:4500;for(let r=1;r<=last+1;r++){s=turn(s,r===1?id:20077);hp=Math.min(9000,hp+(r<=last?n:0))-(id===24835?1125:0);assert.equal(s.fighters[0].hp,hp);}s=turn(make(id,{aHp:1000,aEffects:{无法通过自身技能恢复体力:{start:1,end:3}}}),id);assert.equal(s.fighters[0].hp,1000);s=turn(make(id),id);const before=s.fighters[0].hp;s=turn(s,pp);assert.equal(s.fighters[0].hp,before);}
});
test('3082驱魂48免四轮黄泉48免五轮真实睡眠，下一轮恢复；无声47四轮免真实弱化第五恢复',()=>{
 for(const[id,last]of[[24835,4],[24836,5]]){let s=turn(make(id,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),id);for(let r=2;r<=last;r++){s=turn(s,pp,22053);assert.equal(s.fighters[0].ailments['睡眠'],undefined);}s=turn(s,pp,22053);assert.ok(s.fighters[0].ailments['睡眠']);}
 let s=make(24834,{enemyId:3075,enemyMoves:[20491],bStages:{acc:6}});for(let r=1;r<=5;r++){s=turn(s,r===1?24834:pp,20491);assert.equal(s.fighters[0].stages.spd,r<=4?0:-1);}
});
test('3082无声60当前三轮包括药剂固定150第四停，790仅三轮无视原有50红伤上限且上限源不改',()=>{
 let s=make(24834);for(let r=1;r<=4;r++){s=turn(s,r===1?24834:pp);const pink=s.damageEvents?.filter(e=>e.round===r&&e.type==='fixed'&&e.sourceSide===0)??[];assert.equal(pink.length,r<=3?1:0);if(r<=3)assert.equal(pink[0].settledDamage,150);}
 s=turn(make(24834,{extraMoves:[19469],bStats:{def:1000,spd:1000},bEffects:{伤害上限:{start:1,end:10,amount:50,attackOnly:true}}}),24834);for(let r=2;r<=4;r++){s=turn(s,19469);const red=s.damageEvents.find(e=>e.round===r&&e.type==='attack'&&e.sourceSide===0);if(r<=3)assert.ok(red.settledDamage>50);else assert.equal(red.settledDamage,50);assert.equal(s.fighters[1].effects['伤害上限'].amount,50);}
});
test('3082朽梦776只下两轮红伤翻倍第三恢复；黄泉843下两轮先制二属性招低速亦生效后恢复',()=>{
 let s=turn(make(19474,{extraMoves:[11027]}),19474);for(let r=2;r<=4;r++){s=turn(s,11027);const e=s.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0);assert.ok(e.detail.includes('增减伤 '+(r<=3?2:1)+' ×'));}
 s=turn(make(24836,{extraMoves:[20077],enemyMoves:[10086],aStats:{spe:1}}),24836,10086);for(let r=2;r<=4;r++){s=turn(s,20077,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,r<=3?2:0);assert.equal(s.turns.at(-1).first,r<=3?0:1);}
});
test('3082朽梦741原生完整300不免301免，仅两轮第三恢复，百分比800和固定444不受大红伤免疫',()=>{
 const found=new Set();for(let atk=900;atk<=920&&found.size<2;atk++){const s=turn(make(19474,{enemyMoves:[10086],aStats:{def:100},bStats:{atk}}),19474,10086),e=s.turns.at(-1).events.find(e=>e.damage?.sourceSide===1&&e.damage.type==='attack'),raw=Number(e.detail.match(/= (\d+)；暴击/)[1]);if(raw===300||raw===301){found.add(raw);assert.equal(e.damage.settledDamage,raw===300?300:0);}}assert.equal(found.size,2);
 let s=make(19474,{enemyMoves:[10086],aStats:{def:100},bStats:{atk:1000},bEffects:{免弱:{start:1,end:5}}});for(let r=1;r<=3;r++){s=turn(s,r===1?19474:pp,10086);const e=s.turns.at(-1).events.find(e=>e.damage?.sourceSide===1&&e.damage.type==='attack'),raw=Number(e.detail.match(/= (\d+)；暴击/)[1]);assert.ok(raw>300);assert.equal(e.damage.settledDamage,r<=2?0:raw);}
 s=turn(make(19474,{enemyId:3017,enemyMoves:[16397]}),19474,16397);assert.equal(s.damageEvents.find(e=>e.type==='percent'&&e.targetSide===0).settledDamage,800);let seen=false;for(let seed=1;seed<=48&&!seen;seed++){s=turn(make(19474,{seed,enemyId:3082,enemyMoves:[19475],bStages:{acc:6}}),19474,19475);const fixed=s.damageEvents?.find(e=>e.type==='fixed'&&e.targetSide===0);if(fixed){seen=true;assert.equal(fixed.settledDamage,444);}}assert.ok(seen);
});
