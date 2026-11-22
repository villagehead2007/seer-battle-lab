'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3022-native.cjs'),pp='potion:pp';
test('3022两真实王龙低体按回初资格在战斗阶段末回三分一，必须先于1125真实毒伤且不死后复活',()=>{
 for(const soul of [395,396]){let s=make(10613,{soul,aHp:1000});const max=s.fighters[0].stats.maxHp;s.fighters[0].ailments['中毒']=3;s=turn(s,pp);assert.equal(s.fighters[0].hp,1000+Math.floor(max/3)-Math.floor(max/8));const dead=make(10613,{soul,aHp:1,enemyMoves:[10086],aStats:{def:1},bStats:{atk:9999}}),out=turn(dead,pp,10086);assert.equal(out.fighters[0].hp,0);}
});
test('3022未标明类型减伤仅红伤，两版满体或低体均不减原生固定75和面板百分比800',()=>{
 for(const soul of [395,396])for(const hp of [1000,9000])for(const[move,type,n]of[[10761,'fixed',75],[16397,'percent',800]]){let s=make(10613,{soul,aHp:hp,enemyId:3017,enemyMoves:[move],bStats:{def:4000,spd:4000}});s=turn(s,pp,move);assert.equal(s.damageEvents.find(e=>e.targetSide===0&&e.type===type).settledDamage,n);}
});
test('3022王龙真实养成强化上限增20%，红伤75起每失10百分点降15，强化另20百分比相乘',()=>{
 const normal=make(10613,{soul:395,aStats:{maxHp:null}}),enhanced=make(10613,{soul:396,aStats:{maxHp:null}});assert.equal(enhanced.fighters[0].stats.maxHp,Math.floor(normal.fighters[0].stats.maxHp*1.2));
 for(const soul of [395,396])for(let tier=0;tier<=5;tier++){const max=9000,hp=max*(10-tier)/10,s=make(10613,{soul,aHp:hp,enemyMoves:[10086],aStats:{def:100},bStats:{atk:9999}});assert.equal(s.fighters[0].stats.maxHp,max);const enemy=s.fighters[1],self=s.fighters[0],move=s.moveDefinitions['wiki:10086'],base=Math.floor(Math.floor(42*move.power*enemy.stats.atk/self.stats.def)/50)+2,factor=require('../dist/engine.js').sameTypeBonus(move.type,enemy.type,s.typeChart)*require('../dist/engine.js').typeEffectiveness(move.type,self.type,s.typeChart)*(1-Math.max(0,.75-.15*tier))*(soul===396?.8:1),out=turn(s,pp,10086),n=out.damageEvents.find(e=>e.type==='attack'&&e.targetSide===0).settledDamage;assert.ok(n>=Math.max(1,Math.floor(base*factor*.85))&&n<=Math.max(1,Math.floor(base*factor)),JSON.stringify({soul,tier,n,base,factor}));}
});
