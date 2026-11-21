'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,make,turn}=require('./helpers/3004-native.cjs'),pp='potion:pp';
const damage=(s,type,side=0)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type===type&&e.sourceSide===side).reduce((n,e)=>n+e.settledDamage,0);
test('3004魂378按最新规则后手仅红伤减半且固定50不减，回复200与先后手每轮重判',()=>{
 for(const late of [true,false]){let s=make(20369,{enemyId:3056,enemyMoves:[10716],aHp:4000,aStats:{spe:late?10:1000},bStats:{spe:100,spa:4000}});s=turn(s,20369,10716);assert.equal(s.turns[0].first,late?1:0);assert.equal(damage(s,'fixed',1),50);const raw=Math.floor(Math.floor(42*20*4000/4000)/50)+2,factor=E.sameTypeBonus(s.moveDefinitions['wiki:10716'].type,s.fighters[1].type,s.typeChart)*E.typeEffectiveness(s.moveDefinitions['wiki:10716'].type,s.fighters[0].type,s.typeChart)*(late?.5:1),red=damage(s,'attack',1);assert.ok(red>=Math.floor(raw*factor*.85)&&red<=Math.floor(raw*factor));assert.equal(s.fighters[0].hp,4000-red-50+(late?200:0));}
 let s=make(20369,{enemyMoves:[20889,10086],aHp:4000,aStats:{spe:125},bStats:{spe:100,atk:4000}});s=turn(s,20369,20889);assert.equal(s.turns[0].first,0);assert.equal(s.fighters[0].hp,4000);s=turn(s,20369,10086);assert.equal(s.turns[1].first,1);const red=damage(s,'attack',1),raw=Math.floor(Math.floor(42*40*4000/4000)/50)+2;assert.ok(red>=Math.floor(raw*.5*.85)&&red<=Math.floor(raw*.5));assert.equal(s.fighters[0].hp,4000-red+200);
});
test('3004魂378后手回复不受仅技能禁疗影响且满体封顶，控制未出手与药剂不回200',()=>{
 let s=turn(make(20369,{aHp:8999,enemyMoves:[20889],bStats:{spe:9999},aEffects:{'无法通过自身技能恢复体力':{start:1,end:2}}}),20369,20889);assert.equal(s.turns[0].first,1);assert.equal(s.fighters[0].hp,9000);s=make(20369,{aHp:4000});s.fighters[0].ailments['疲惫']=2;s=turn(s,20369);assert.equal(s.fighters[0].hp,4000);s=turn(make(20369,{aHp:4000}),pp);assert.equal(s.fighters[0].hp,4000);
});
test('3004魂378按最新规则先后手真实碎星249百分比均不减，面板基数不含正防等级',()=>{
 for(const late of [true,false]){let s=make(20369,{enemyId:3056,enemyMoves:[15969],aHp:4000,aStats:{def:623,spe:late?10:1000},bStats:{spe:100},aStages:{def:2}});s=turn(s,20369,15969);assert.equal(s.turns[0].first,late?1:0);assert.equal(damage(s,'percent',1),249);assert.equal(s.fighters[0].hp,4000-damage(s,'attack',1)-damage(s,'percent',1)+(late?200:0));}
});
test('3004三种10%原生异常各自然成功失败，疲惫准确两回合，烧伤周期1125真伤且真实免异阻挡',()=>{
 for(const [id,status]of [[10976,'睡眠'],[10977,'烧伤'],[10974,'疲惫']]){let yes=0,no=0;for(let seed=1;seed<=64;seed++){const s=turn(make(id,{seed}),id);if(s.fighters[1].ailments[status]>=1){yes++;if(status==='疲惫')assert.equal(s.fighters[1].ailments[status],2);if(status==='烧伤')assert.equal(damage(s,'true'),1125);}else no++;}assert.ok(yes>0&&no>0,id);const s=turn(make(id,{enemyId:3550}),id);assert.equal(s.fighters[1].ailments[status],undefined);}
});
test('3004威武579未击败回复2250且650只在真实击败双防二，近满体封顶禁疗禁强化与正六边界',()=>{
 let s=turn(make(19152,{aHp:4000,enemyMoves:[10086]}),19152,10086);assert.equal(s.turns[0].first,0);assert.equal(s.fighters[0].hp,6250-damage(s,'attack',1));assert.equal(s.fighters[0].stages.def,0);assert.equal(s.fighters[0].stages.spd,0);s=turn(make(19152,{aHp:4000,bHp:1,enemyMoves:[10086]}),19152,10086);assert.equal(s.fighters[1].hp,0);assert.equal(s.fighters[0].hp,4000);assert.equal(s.fighters[0].stages.def,2);assert.equal(s.fighters[0].stages.spd,2);s=turn(make(19152,{aHp:8999,enemyMoves:[10086]}),19152,10086);assert.equal(s.fighters[0].hp,9000-damage(s,'attack',1));s=turn(make(19152,{aHp:4000,enemyMoves:[10086],aEffects:{'无法通过自身技能恢复体力':{start:1,end:2}}}),19152,10086);assert.equal(s.fighters[0].hp,4000-damage(s,'attack',1));for(const blocked of [false,true]){s=turn(make(19152,{bHp:1,aStages:{def:5,spd:5},aEffects:blocked?{禁强化:{start:1,end:2}}:{}}),19152);assert.equal(s.fighters[0].stages.def,blocked?5:6);assert.equal(s.fighters[0].stages.spd,blocked?5:6);}
});
test('3004乾坤664真实先手只当回合令敌方红伤零，原生固定50仍结算且次回合正常红伤',()=>{
 let s=make(19153,{extraMoves:[20369],enemyId:3056,enemyMoves:[10716]});s=turn(s,19153,10716);assert.equal(s.turns[0].first,0);assert.equal(damage(s,'attack',1),0);assert.equal(damage(s,'fixed',1),50);assert.equal(s.fighters[0].hp,8950);s=turn(s,20369,10716);assert.ok(damage(s,'attack',1)>0);assert.equal(damage(s,'fixed',1),50);
});
test('3004乾坤499只有真实后手授予下回合先制一，次轮实际慢速抢先，再下一轮恢复后手',()=>{
 let s=make(19153,{extraMoves:[10614],enemyMoves:[10086],aStats:{spe:1},bStats:{spe:9999}});s=turn(s,19153,10086);assert.equal(s.turns[0].first,1);assert.ok(damage(s,'attack',1)>0);assert.equal(s.fighters[0].effects.id984.amount,1);s=turn(s,10614,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,1);assert.equal(s.turns[1].first,0);s=turn(s,10614,10086);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);assert.equal(s.turns[2].first,1);s=turn(make(19153,{enemyMoves:[10086]}),19153,10086);assert.equal(s.fighters[0].effects.id984,undefined);
});
