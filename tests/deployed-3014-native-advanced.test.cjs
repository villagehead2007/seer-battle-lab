'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,make,turn}=require('./helpers/3014-native.cjs'),pp='potion:pp';
const damage=(s,type,side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type===type&&e.sourceSide===side).reduce((n,e)=>n+e.settledDamage,0);
test('3014疾羽405实际先手附100固定，后手不附，真实星皇免粉不影响本体命中',()=>{
 for(const fast of[true,false]){const s=turn(make(15424,{enemyId:3014,enemyMoves:[15424],aStats:{spe:fast?9999:1},bStats:{spe:1000}}),15424,15424);assert.equal(s.turns[0].first,fast?0:1);assert.equal(damage(s,'fixed'),fast?100:0);assert.ok(damage(s,'attack')>0);}
 const s=turn(make(15424,{enemyId:3291}),15424);assert.equal(damage(s,'fixed'),0);assert.ok(damage(s,'attack')>0);
});
test('3014圣穹57当前四回合仅实际用技能回复三分一，170仅先手本轮免红并回四分一，独立魂印200',()=>{
 let s=make(24691,{aHp:1000,extraMoves:[20230],enemyMoves:[10086]});s=turn(s,24691,10086);assert.equal(damage(s,'attack',1),0);assert.equal(s.fighters[0].hp,6450);assert.equal(s.fighters[0].effects.id57.end,4);s=turn(s,pp,10086);assert.ok(damage(s,'attack',1)>0);assert.ok(!s.turns.at(-1).events.some(e=>e.kind==='heal'&&e.text.includes('持续用招回复')));s=turn(s,pp);s=turn(s,20230);assert.equal(s.fighters[0].hp,9000);assert.ok(s.turns.at(-1).events.some(e=>e.kind==='heal'&&e.text.includes('持续用招回复')));s=turn(s,20230);assert.ok(!s.turns.at(-1).events.some(e=>e.kind==='heal'&&e.text.includes('持续用招回复')));
 s=turn(make(24691,{aHp:1000,aStats:{spe:1},bStats:{spe:9999},enemyMoves:[10086]}),24691,10086);assert.equal(damage(s,'attack',1),2);assert.equal(s.fighters[0].hp,4198);
 s=turn(make(24691,{aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:5}},enemyMoves:[10086]}),24691,10086);assert.equal(damage(s,'attack',1),0);assert.equal(s.fighters[0].hp,1200);
});
test('3014神清48当前五轮免睡第六轮恢复，光矛191当前四轮反弹睡眠第五轮不反弹',()=>{
 for(const[id,last,reflect]of[[20651,5,false],[24690,4,true]])for(const when of[last,last+1]){let s=make(id,{enemyId:3205,enemyMoves:[22053],bStages:{acc:6}});s=turn(s,id);for(let r=2;r<=when;r++)s=turn(s,pp,r===when?22053:pp);if(when===last){assert.equal(s.fighters[0].ailments['睡眠'],undefined);if(reflect)assert.ok(s.fighters[1].ailments['睡眠']>=last);}else{assert.ok(s.fighters[0].ailments['睡眠']>=when);assert.equal(s.fighters[1].ailments['睡眠'],undefined);}}
});
test('3014神羽478当前两轮封真实属性第三轮可强化，481仅下一轮攻击先制一且属性不受益',()=>{
 let s=make(22977,{extraMoves:[10004],enemyMoves:[20889],aStats:{spe:100},bStats:{spe:9999}});s=turn(s,22977);assert.equal(s.fighters[1].effects.statusBlock.end,2);s=turn(s,10004,20889);assert.equal(s.turns.at(-1).first,0);assert.equal(s.fighters[0].soulState.resolvedPriority.value,1);assert.equal(s.fighters[1].stages.spe,0);s=turn(s,10004,20889);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);assert.equal(s.fighters[1].stages.spe,1);
 s=turn(make(22977,{extraMoves:[20230]}),22977);s=turn(s,20230);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);assert.equal(s.fighters[0].stages.acc,1);
});
test('3014灵羽448当前三次回末降速后停止，飞灭433当前三次末特攻速度一且初次红伤不提前加级',()=>{
 for(const id of[15422,19198]){let s=make(id,{aStages:{acc:6},aStats:{spa:180}});for(let r=1;r<=4;r++){s=turn(s,r===1?id:pp);if(id===15422){assert.equal(s.fighters[1].stages.spe,-Math.min(r,3));assert.equal(s.fighters[1].stages.atk,0);}else{assert.equal(s.fighters[0].stages.spa,Math.min(r,3));assert.equal(s.fighters[0].stages.spe,Math.min(r,3));if(r===1)assert.equal(s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).attackValue,180);}}}
 let s=turn(make(15422,{enemyId:3291,aStages:{acc:6}}),15422);assert.equal(s.fighters[1].stages.spe,0);s=turn(make(19198,{aEffects:{禁强化:{start:1,end:4}}}),19198);assert.equal(s.fighters[0].stages.spa,0);assert.equal(s.fighters[0].stages.spe,0);
});
test('3014天使之翼565仅先手回最大半体，魂印另回200，后手不回半体且技能禁疗只挡技能回复',()=>{
 for(const[fast,expected]of[[true,5700],[false,1200]]){const s=turn(make(22978,{aHp:1000,aStats:{spe:fast?9999:1},bStats:{spe:1000},enemyMoves:[20889]}),22978,20889);assert.equal(s.fighters[0].hp,expected);assert.equal(s.turns[0].first,fast?0:1);}
 let s=turn(make(22978,{aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:3}}}),22978);assert.equal(s.fighters[0].hp,1200);s=turn(make(22978,{aHp:8999}),22978);assert.equal(s.fighters[0].hp,9000);
});
test('3014凌空660真正消除穿梭强化才回满，空正级或繁苍保护不回满，技能禁疗仍消强清自身负级',()=>{
 let s=make(19196,{aHp:1000,enemyMoves:[20889]});s=turn(s,pp,20889);assert.equal(s.fighters[0].hp,1200);assert.equal(s.fighters[1].stages.spe,1);s=turn(s,19196);assert.equal(s.fighters[1].stages.spe,0);assert.equal(s.fighters[0].hp,9000);
 s=turn(make(19196,{aHp:1000}),19196);assert.equal(s.fighters[0].hp,1200);
 s=make(19196,{aHp:1000,enemyId:3549,enemyMoves:[29392]});s=turn(s,pp,29392);const before={...s.fighters[1].stages};assert.ok(Object.values(before).some(n=>n>0));s=turn(s,19196);assert.deepEqual(s.fighters[1].stages,before);assert.equal(s.fighters[0].hp,1400);
 s=turn(make(19196,{aHp:1000,aStages:{spa:-1},bStages:{spe:1},aEffects:{'无法通过自身技能恢复体力':{start:1,end:3}}}),19196);assert.equal(s.fighters[1].stages.spe,0);assert.equal(s.fighters[0].stages.spa,0);assert.equal(s.fighters[0].hp,1200);
});
test('3014光矛843下两轮所有技能先制二真实低速抢先，第三轮恢复零，583随机仅一原生PP槽清零',()=>{
 let s=make(24690,{extraMoves:[20230,10004],enemyMoves:[10086,13601],aStats:{spe:1},bStats:{spe:9999}});const before={...s.fighters[1].pp};s=turn(s,24690,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);const cleared=Object.keys(before).filter(k=>before[k]>0&&s.fighters[1].pp[k]===0);assert.equal(cleared.length,1);assert.equal(s.fighters[1].pp[cleared[0]],0);for(const[id,priority]of[[20230,2],[10004,2],[10004,0]]){const enemy=[10086,13601].find(id=>s.fighters[1].pp['wiki:'+id]>0);s=turn(s,id,enemy);assert.equal(s.fighters[0].soulState.resolvedPriority.value,priority);assert.equal(s.turns.at(-1).first,priority?0:1);}
 const choices=new Set();for(let seed=1;seed<=12;seed++){const initial=make(24690,{seed,enemyMoves:[10086],bStats:{spe:9999}}),before={...initial.fighters[1].pp},out=turn(initial,24690,10086),slots=Object.keys(before).filter(k=>before[k]>0&&out.fighters[1].pp[k]===0);assert.equal(slots.length,1);assert.equal(out.fighters[1].pp[slots[0]],0);choices.add(slots[0]);}assert.ok(choices.size>1);
 const protectedState=make(24690,{bEffects:{PP保护:{start:1,end:3}}}),protectedPP={...protectedState.fighters[1].pp},out=turn(protectedState,24690);assert.deepEqual(out.fighters[1].pp,protectedPP);assert.equal(out.fighters[0].effects.id984.start,2);
});
test('3014神翼683随机100至200固定与450随机100至200技能回复独立，MISS不附不回且免粉只挡固定',()=>{
 const fixed=new Set(),heals=new Set();for(let seed=1;seed<=24;seed++){const s=turn(make(19197,{seed,aHp:1000,aStages:{acc:6}}),19197),n=damage(s,'fixed'),heal=s.fighters[0].hp-1200;assert.ok(n>=100&&n<=200);assert.ok(heal>=100&&heal<=200);fixed.add(n);heals.add(heal);}assert.ok(fixed.size>1&&heals.size>1);
 let s=turn(make(19197,{aHp:1000,aStages:{acc:-6}}),19197);assert.equal(damage(s,'attack'),0);assert.equal(damage(s,'fixed'),0);assert.equal(s.fighters[0].hp,1200);
 s=turn(make(19197,{aHp:1000,aStages:{acc:6},enemyId:3291}),19197);assert.equal(damage(s,'fixed'),0);assert.ok(s.fighters[0].hp>=1300&&s.fighters[0].hp<=1400);
 s=turn(make(19197,{aHp:1000,aStages:{acc:6},aEffects:{'无法通过自身技能恢复体力':{start:1,end:3}}}),19197);assert.equal(s.fighters[0].hp,1200);assert.ok(damage(s,'fixed')>=100);
 s=turn(make(19197,{aHp:8999,aStages:{acc:6}}),19197);assert.equal(s.fighters[0].hp,9000);
});
test('3014飞灭456按红伤后严格低于300秒杀，恰300存活301亦存活，初始残血击败不复活',()=>{
 for(const[hp,expected]of[[304,0],[305,300],[306,301],[1,0]]){const s=turn(make(19198,{aStats:{spa:180},aStages:{acc:6},bHp:hp}),19198),red=s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0);assert.equal(red.settledDamage,5);assert.equal(s.fighters[1].hp,expected);}
});
test('3014原第五180实际消除原生狙击必暴回合且空目标可用，未裁定101过量回复不充作已审核',()=>{
 let s=make(19199,{enemyMoves:[20355]});s=turn(s,pp,20355);assert.ok(E.describeEffects(s.fighters[1],s.round).some(x=>x.includes('必定暴击')));s=turn(s,19199);assert.ok(!E.describeEffects(s.fighters[1],s.round).some(x=>x.includes('必定暴击')));assert.equal(s.fighters[1].effects['必定暴击'],undefined);assert.ok(damage(s,'attack')>0);s=turn(make(19199),19199);assert.ok(damage(s,'attack')>0);assert.equal(s.fighters[0].pp['wiki:19199'],4);
});
