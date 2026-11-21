'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3082-native.cjs'),pp='potion:pp';
test('3082灵魂444真实逐槽敌PP减一自身各加一，含当次自身耗PP、敌已零槽和双方PP保护',()=>{
 for(const blocked of[false,true]){const s=make(24833,{enemyMoves:[10086],bEffects:blocked?{PP保护:{start:1,end:3}}:{}});for(const k of s.fighters[0].moves)s.fighters[0].pp[k]-=2;s.fighters[1].pp['wiki:10086']=1;const old=structuredClone(s),o=turn(s,24833,10086);for(const k of s.fighters[0].moves)assert.equal(o.fighters[0].pp[k],old.fighters[0].pp[k]+(k==='wiki:24833'?0:1));for(const k of s.fighters[1].moves)assert.equal(o.fighters[1].pp[k],k==='wiki:10086'?0:Math.max(0,old.fighters[1].pp[k]-(blocked?0:1)));assert.deepEqual(s,old);}
});
test('3082灵魂440当前三轮原生冲顶每次耗二，第四恢复耗一，444独立额外扣一次',()=>{
 let s=make(24833,{enemyMoves:[10086]});for(let r=1;r<=4;r++){s=turn(s,r===1?24833:pp,10086);assert.equal(s.fighters[1].pp['wiki:10086'],r===1?32:r===2?30:r===3?28:27);}
});
test('3082黄泉912只看自身清PP前旧负级，后续749首次造弱不倒算；原负级随机一槽归零且PP保护阻止',()=>{
 let s=turn(make(24836),24836);assert.equal(Object.values(s.fighters[1].pp).filter(n=>n===0).length,0);const seen=new Set();for(let seed=1;seed<=24;seed++){s=turn(make(24836,{seed,bStages:{def:-1},enemyMoves:[10086],bStats:{spe:9999}}),24836,10086);const zero=Object.keys(s.fighters[1].pp).filter(k=>s.fighters[1].pp[k]===0);assert.equal(zero.length,1);seen.add(zero[0]);}assert.ok(seen.size>2);s=turn(make(24836,{bStages:{def:-1},bEffects:{PP保护:{start:1,end:3}}}),24836);assert.equal(Object.values(s.fighters[1].pp).filter(n=>n===0).length,0);assert.ok(Object.values(s.fighters[1].stages).every(n=>n<0));
});
