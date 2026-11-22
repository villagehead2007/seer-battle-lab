'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3075-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
test('3075幻光盾月下魅影按原能力提升，魂421独立再加特攻速度，六封顶与禁强化',()=>{
 for(const[id,v]of[[21153,{def:1,spd:1}],[23402,{def:1,spa:1,spd:1,spe:1} ]])for(const mode of['normal','cap','blocked']){const s=turn(make(id,{aStages:mode==='cap'?Object.fromEntries(keys.map(k=>[k,6])):{},aEffects:mode==='blocked'?{禁强化:{start:1,end:2}}:{}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='blocked'?0:(v[k]??0)+(['spa','spe'].includes(k)?1:0));if(id===23402)assert.equal(s.fighters[0].hp,4770);}
});
test('3075幻色622每次全属性同加一或同加二，初始种子成败与封顶禁强化，独立魂印不混入翻倍',()=>{
 const seen=new Set();for(let seed=1;seed<=24;seed++){const s=turn(make(24825,{seed}),24825),n=s.fighters[0].stages.atk;seen.add(n);assert.ok(n===1||n===2);for(const k of keys)assert.equal(s.fighters[0].stages[k],n+(['spa','spe'].includes(k)?1:0));assert.equal(s.fighters[0].hp,7650);}assert.deepEqual([...seen].sort(),[1,2]);for(const mode of['cap','blocked']){const s=turn(make(24825,{aStages:mode==='cap'?Object.fromEntries(keys.map(k=>[k,6])):{},aEffects:mode==='blocked'?{禁强化:{start:1,end:3}}:{}}),24825);assert.ok(Object.values(s.fighters[0].stages).every(n=>n===(mode==='cap'?6:0)));assert.equal(s.fighters[0].hp,7650);}
});
test('3075哀叹闪光赤月真实削弱原项目，负六封底且原生星皇免弱不挡独立其他效果',()=>{
 for(const[id,key,n]of[[20491,'spd',-1],[20741,'acc',-2],[23401,'acc',-2]]){let s=turn(make(id),id);assert.equal(s.fighters[1].stages[key],n);assert.ok(keys.filter(k=>k!==key).every(k=>s.fighters[1].stages[k]===0));s=turn(make(id,{bStages:{[key]:-6}}),id);assert.equal(s.fighters[1].stages[key],-6);s=turn(make(id,{enemyId:3291}),id);assert.ok(Object.values(s.fighters[1].stages).every(n=>n===0));}
 const s=turn(make(24824),24824);assert.ok(Object.values(s.fighters[1].stages).every(n=>n===-1));
});
test('3075米加33消真实双防提升与魅影85吸收双防，当前红伤按清除前防御且保原负级',()=>{
 for(const id of[16180,19451]){let s=make(id,{enemyMoves:[24624],aStages:{acc:6}});s=turn(s,pp,24624);s=turn(s,id);assert.equal(s.fighters[1].stages.def,0);assert.equal(s.fighters[1].stages.spd,0);assert.equal(s.fighters[0].stages.def,id===19451?2:0);assert.equal(s.fighters[0].stages.spd,id===19451?2:0);assert.ok(s.turns.at(-1).events.find(e=>e.damage?.type==='attack').detail.includes('防御 8000'));s=turn(make(id,{bStages:{def:-2},aStages:{acc:6}}),id);assert.equal(s.fighters[1].stages.def,-2);assert.equal(s.fighters[0].stages.def,0);}
});
test('3075暗红3清负级与剑破521反负级分别生效，当前物理按负攻600且保已有正级',()=>{
 for(const id of[16181,19452]){const s=turn(make(id,{aStages:{atk:-2,def:2,acc:6}}),id);assert.equal(s.damageEvents.find(e=>e.type==='attack').attackValue,600);assert.equal(s.fighters[0].stages.atk,id===16181?0:2);assert.equal(s.fighters[0].stages.def,2);assert.equal(s.fighters[0].stages.acc,6);}
});
