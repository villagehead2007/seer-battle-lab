'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3237-native.cjs');
function modifier(move,o,action){const old=H.E.WIKI.effectsEngine;let seen;H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const before=c.modifier,out=old.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0)seen={before,after:c.modifier};return out;}};try{const s=H.turn(H.make(move,o),move,action??'potion:pp');assert.ok(H.damage(s,'attack')>0);assert.ok(seen);return{s,...seen};}finally{H.E.WIKI.effectsEngine=old;}}
test('3237神秘之光500仅对害怕目标红伤翻倍，金刚华台986实际先手才增红五成',()=>{
 for(const fear of[false,true]){const p=modifier(14486,{aStages:{acc:6},bAilments:fear?{害怕:2}:{}});assert.equal(p.after,p.before*(fear?2:1));}for(const fast of[false,true]){const p=modifier(30133,{aStages:{acc:6},aStats:{spe:fast?4000:1},bStats:{spe:fast?100:4000},enemyMoves:[10086]},10086);assert.equal(p.s.turns[0].first,fast?0:1);assert.equal(p.after,p.before*(fast?1.5:1));}
});
test('3237神照714及大智779仅对方正级时各先制三或二，714当排序时清强且保护不阻先制',()=>{
 for(const move of[16961,30134])for(const mode of['positive','zero','negative','protect']){const s=H.turn(H.make(move,{aStages:{acc:6},aStats:{spe:1},bStats:{spe:4000},enemyMoves:[10086],bStages:mode==='zero'?{}:mode==='negative'?{atk:-1}:{atk:1},bEffects:mode==='protect'?{强化保护:{start:1,end:5}}:{}}),move,10086);assert.equal(s.turns[0].first,['positive','protect'].includes(mode)?0:1);assert.equal(s.fighters[1].stages.atk,mode==='protect'?1:mode==='negative'?-1:0);}
});
test('3237净火39全原技能PP各减一，先手耗尽所选招阻止行动，PP保护使原冲顶照常执行',()=>{
 for(const protect of[false,true]){const initial=H.make(14109,{aStages:{acc:6},aStats:{spe:4000},enemyMoves:[10086],bEffects:protect?{PP保护:{start:1,end:2}}:{}});initial.fighters[1].pp['wiki:10086']=1;const before=structuredClone(initial.fighters[1].pp),s=H.turn(initial,14109,10086);assert.equal(s.fighters[1].pp['wiki:10086'],0);assert.equal(H.damage(s,'attack',1)>0,protect);for(const key of s.fighters[1].moves.filter(k=>k!=='wiki:10086'))assert.equal(s.fighters[1].pp[key],protect?before[key]:Math.max(0,before[key]-1));}
});
function threshold(wanted,fast){for(const def of[1000,1001,999,2000,2001]){let lo=1,hi=9999;while(lo<=hi){const atk=Math.floor((lo+hi)/2),s=H.turn(H.make(30134,{aStages:{acc:6},aStats:{atk,spe:fast?4000:1},bStats:{def,spe:fast?100:4000},enemyMoves:[10086]}),30134,10086),red=H.damage(s,'attack');if(red===wanted)return s;if(red<wanted)lo=atk+1;else hi=atk-1;}}throw Error('合法初始面板无法命中原红伤'+wanted);}
test('3237第五1066原完整红299才附固，300与301不附，先手450后手300且免固独立',()=>{
 for(const fast of[false,true])for(const red of[299,300,301]){const s=threshold(red,fast);assert.equal(H.damage(s,'attack'),red);assert.equal(H.damage(s,'fixed'),red<300?(fast?450:300):0);}const immune=H.turn(H.make(30134,{aStages:{acc:6},bGear:{resistance:{fixed:100}}}),30134);assert.ok(H.damage(immune,'attack')<300);assert.equal(H.damage(immune,'fixed'),0);
});
test('3237轮转797先真实消回合成功才授技能禁疗，空或保护不授，最后一轮禁而到期原57回血',()=>{
 const duration=H.source.moves.find(m=>m.id===30131).effectInstances.find(e=>e.id===797).args[0];for(const mode of['clear','empty','protect']){let s=H.turn(H.make(30131,{enemyId:3227,enemyMoves:[24484,20013],bHp:1000,bEffects:mode==='empty'?{}:{攻击必中:{start:1,end:6},...(mode==='protect'?{protect:{start:1,end:6}}:{})}}),30131,24484);const red=H.damage(s,'attack'),afterRed=1000-red;assert.ok(red>0);assert.equal(s.fighters[1].hp,afterRed+(mode==='clear'?0:2250));if(mode!=='clear')continue;for(let r=2;r<=duration+1;r++){s=H.turn(s,'potion:pp',20013);assert.equal(s.fighters[1].hp,afterRed+(r<=duration?0:2250));}}
});
