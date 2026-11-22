'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3001-native.cjs'),pp='potion:pp';
const damage=(s,type,side)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type===type&&e.sourceSide===side).reduce((n,e)=>n+e.settledDamage,0);
test('3001宙376高体严格比较真实命中随机清一个PP，等体或低体不清，24原生种子抽到不同槽',()=>{
 const slots=new Set();for(const [hp,enemyHp,expected]of [[9000,8999,1],[9000,9000,0],[8999,9000,0]])for(let seed=1;seed<=24;seed++){let s=make(20155,{seed,aHp:hp,bHp:enemyHp,enemyMoves:[20889]});s=turn(s,20155,20889);const zero=Object.entries(s.fighters[1].pp).filter(([,n])=>n===0);assert.equal(zero.length,expected);for(const [k]of zero)slots.add(k);assert.equal(s.fighters[0].soulId,376);}assert.ok(slots.size>1);
});
test('3001宙376先手当回合红伤减半而后手不减，后手回复2250及固定2250独立结算',()=>{
 for(const first of [true,false]){let s=make(20155,{enemyMoves:[10086],aHp:4000,aStats:{spe:first?1000:10},bStats:{spe:100,atk:4000}});s=turn(s,20155,10086);assert.equal(s.turns[0].first,first?0:1);const red=damage(s,'attack',1),base=Math.floor(Math.floor(42*40*4000/4000)/50)+2,mult=first?.5:1;assert.ok(red>=Math.floor(base*.85*mult)&&red<=Math.floor(base*mult));assert.equal(s.fighters[0].hp,4000-red+(first?0:2250));assert.equal(damage(s,'fixed',0),first?0:2250);assert.equal(s.fighters[1].hp,first?9000:6750);}
});
test('3001宙376后手魂印回复不受仅技能禁疗影响，真实星皇免粉只挡2250固定且接近满体不溢出',()=>{
 let s=make(20155,{enemyId:3291,enemyMoves:[10499],aHp:8999,aStats:{spe:10},bStats:{spe:100},aEffects:{'无法通过自身技能恢复体力':{start:1,end:3}}});s=turn(s,20155,10499);assert.equal(s.turns[0].first,1);assert.equal(s.fighters[0].hp,9000);assert.equal(damage(s,'fixed',0),0);assert.equal(s.fighters[1].hp,9000);
});
test('3001宙376控制无法出手与药剂不触发命中清PP后手回复或附伤，首次先手减伤不延长到下一回合',()=>{
 let s=make(20155,{enemyMoves:[10086],aHp:4000,aStats:{spe:10},bStats:{spe:100}});s.fighters[0].ailments['疲惫']=2;s=turn(s,20155,10086);assert.equal(s.fighters[0].hp,4000-damage(s,'attack',1));assert.equal(damage(s,'fixed',0),0);assert.ok(Object.values(s.fighters[1].pp).every(n=>n>0));s=turn(make(20155,{enemyMoves:[10086],aHp:4000}),pp,10086);assert.equal(s.fighters[0].hp,4000-damage(s,'attack',1));assert.equal(damage(s,'fixed',0),0);
 s=make(20155,{enemyMoves:[20889,10086],aHp:4000,aStats:{spe:125},bStats:{spe:100,atk:4000}});s=turn(s,20155,20889);assert.equal(s.turns[0].first,0);assert.equal(s.fighters[0].hp,4000);s=turn(s,20155,10086);assert.equal(s.turns[1].first,1);const red=damage(s,'attack',1),base=Math.floor(Math.floor(42*40*4000/4000)/50)+2;assert.ok(red>=Math.floor(base*.85)&&red<=base);assert.equal(s.fighters[0].hp,4000-red+2250);assert.equal(damage(s,'fixed',0),2250);
});
test('3001宙376先手减伤仅作用红伤，渗透劲固伤先后手均五十且后手自己追加2250',()=>{
 for(const first of [true,false]){let s=make(20155,{enemyId:3056,enemyMoves:[10716],aHp:4000,aStats:{spe:first?1000:10},bStats:{spe:100}});s=turn(s,20155,10716);assert.equal(s.turns[0].first,first?0:1);assert.equal(damage(s,'fixed',1),50);assert.equal(damage(s,'fixed',0),first?0:2250);assert.equal(s.fighters[0].hp,4000-damage(s,'attack',1)-damage(s,'fixed',1)+(first?0:2250));}
});
