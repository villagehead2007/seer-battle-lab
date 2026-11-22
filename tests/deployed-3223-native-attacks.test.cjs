'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3223-native.cjs');
function observe(move,o,field){const old=H.E.WIKI.effectsEngine,seen=[];H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const before=c[field],result=old.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0)seen.push({before,after:c[field]});return result;}};try{const s=H.turn(H.make(move,o),move,o.enemyAction??'potion:pp');assert.ok(H.damage(s,'attack')>0);assert.equal(seen.length,1);return seen[0];}finally{H.E.WIKI.effectsEngine=old;}}
test('3223两魂拳风与斗气激荡40原先手才威力翻倍，真实后手不翻倍',()=>{
 for(const soul of[558,566])for(const move of[10636,19561])for(const fast of[false,true]){const p=observe(move,{soul,aStages:{acc:6},aStats:{spe:fast?4000:1},bStats:{spe:fast?100:4000},enemyMoves:[10086],enemyAction:10086},'power');assert.equal(p.after,p.before*(fast?2:1));}
});
test('3223两魂圣裂冲混天狂武1025真实吸强成功才回复三千，空正级保护禁疗及体力封顶独立',()=>{
 for(const soul of[558,566])for(const move of[30066,30071])for(const mode of['normal','empty','protect','heal-ban','cap']){const s=H.turn(H.make(move,{soul,aHp:mode==='cap'?8950:5000,aStages:{acc:6},bStages:mode==='empty'?{}:{atk:2,def:1},bEffects:mode==='protect'?{强化保护:{start:1,end:5}}:{},aEffects:mode==='heal-ban'?{技能禁疗:{start:1,end:5}}:{}}),move);assert.equal(s.fighters[0].hp,mode==='cap'?9000:mode==='normal'?8000:5000);assert.equal(s.fighters[1].stages.atk,mode==='protect'?2:0);assert.equal(s.fighters[0].stages.atk,['empty','protect'].includes(mode)?0:2);}
});
function threshold(soul,wanted){let lo=1,hi=9999;while(lo<=hi){const atk=Math.floor((lo+hi)/2),s=H.turn(H.make(30071,{soul,aHp:5000,enemyId:3056,aStats:{atk},bStats:{def:2000},aStages:{acc:6}}),30071),n=H.damage(s,'attack');if(n===wanted)return s;if(n<wanted)lo=atk+1;else hi=atk-1;}throw Error('找不到合法初始面板红伤 '+wanted);}
test('3223两魂混天狂武793真实完整红199和200及201严格低于才次两回合固定150，不混同3221的400阈值',()=>{
 for(const soul of[558,566])for(const red of[199,200,201]){let s=threshold(soul,red);assert.equal(H.damage(s,'fixed'),0);for(let r=2;r<=4;r++){s=H.turn(s,'potion:pp');assert.equal(H.damage(s,'fixed'),red<200&&r<=3?150:0);}}
});
test('3223王天裂圣威760原真实弱效目标提升克制至普通，非弱效不降克制倍率',()=>{
 const seen=new Set;for(const enemyId of[2989,3013,3056,3079,3102]){const p=observe(30074,{enemyId,aStages:{acc:6}},'affinity');assert.equal(p.after,Math.max(1,p.before));seen.add(p.before<1?'weak':'normal');}assert.ok(seen.has('weak'));assert.ok(seen.has('normal'));
});

