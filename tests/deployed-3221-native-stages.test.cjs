'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3221-native.cjs');
const all=['atk','def','spa','spd','spe','acc'];
test('3221原果断战将之魂及三种全属性原招真实强化，六级截断与禁强化分别执行',()=>{
 const rows=[[20496,['acc']],[23642,['atk','def','spd','spe']],[24873,all],[24895,all],[19590,['atk','spe','acc']]];
 for(const[move,keys]of rows)for(const mode of['normal','cap','blocked']){const initial=Object.fromEntries(all.map(k=>[k,mode==='cap'?6:0]));let s=H.make(move,{aStages:initial,aEffects:mode==='blocked'?{禁强化:{start:1,end:5}}:{}});s=H.turn(s,move);for(const k of all)assert.equal(s.fighters[0].stages[k],mode==='cap'?6:mode==='blocked'?0:keys.includes(k)?1:0,move+':'+mode+':'+k);}
});
test('3221原恐怖嚎叫与完整第五的弱化分别命中真实目标，负六截断及受保护免弱生效',()=>{
 for(const[move,keys]of[[20546,['def','spd']],[19590,['atk','spe','acc']]])for(const mode of['normal','cap','immune']){const bStages=Object.fromEntries(all.map(k=>[k,mode==='cap'?-6:0]));let s=H.make(move,{aStages:{acc:6},bStages,bEffects:mode==='immune'?{免弱:{start:1,end:5},protect:{start:1,end:5}}:{}});s=H.turn(s,move);for(const k of all)assert.equal(s.fighters[1].stages[k],mode==='cap'?-6:mode==='immune'?0:keys.includes(k)?-1:0,move+':'+mode+':'+k);}
});
test('3221战将浑天破战意杀戮真实清除自身负级并保留正级，九天揽月真实反转且服从既有禁强化裁定',()=>{
 for(const move of[16601,19545])for(const lock of[false,true]){const s=H.turn(H.make(move,{aStages:{atk:-3,def:-6,spa:2,acc:6},aEffects:lock?{弱化不可解除反转:{start:1,end:5}}:{}}),move);assert.equal(s.fighters[0].stages.atk,lock?-3:0);assert.equal(s.fighters[0].stages.def,lock?-6:0);assert.equal(s.fighters[0].stages.spa,2);}
 for(const blocked of['none','ban','lock']){const s=H.turn(H.make(19588,{aStages:{atk:-3,def:-6,spa:2,acc:6},aEffects:blocked==='ban'?{禁强化:{start:1,end:5}}:blocked==='lock'?{弱化不可解除反转:{start:1,end:5}}:{}}),19588);assert.equal(s.fighters[0].stages.atk,blocked==='ban'?0:blocked==='lock'?-3:3);assert.equal(s.fighters[0].stages.def,blocked==='ban'?0:blocked==='lock'?-6:6);assert.equal(s.fighters[0].stages.spa,2);}
});
test('3221战将怒攻实际消除强化保留负级，对手强化保护使消除失败',()=>{
 for(const protectedBoost of[false,true]){const s=H.turn(H.make(16600,{aStages:{acc:6},bStages:{atk:3,def:6,spa:-2},bEffects:protectedBoost?{强化保护:{start:1,end:5}}:{}}),16600);assert.equal(s.fighters[1].stages.atk,protectedBoost?3:0);assert.equal(s.fighters[1].stages.def,protectedBoost?6:0);assert.equal(s.fighters[1].stages.spa,-2);}
});
test('3221战将之心与九念无动真实三四回合免弱，原对手降攻在窗口内失败且到期恢复',()=>{
 for(const[move,duration]of[[23641,3],[24872,4]]){let s=H.make(move,{enemyMoves:[20241],aStats:{spe:4000},bStats:{spe:100}});s=H.turn(s,move,20241);assert.equal(s.fighters[0].stages.atk,0);for(let round=2;round<=duration;round++){s=H.turn(s,'potion:pp',20241);assert.equal(s.fighters[0].stages.atk,0,'免弱第'+round+'回合');}s=H.turn(s,'potion:pp',20241);assert.equal(s.fighters[0].stages.atk,-2,'原招免弱到期');}
});


