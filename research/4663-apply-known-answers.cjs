'use strict';const fs=require('fs'),assert=require('node:assert/strict'),base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/',dir=base+'4663-before/';fs.mkdirSync(dir,{recursive:true});function edit(file,changes){let s=fs.readFileSync(file,'utf8');fs.writeFileSync(dir+file.split('/').pop(),s,{flag:'wx'});for(const[a,b]of changes){assert.ok(s.includes(a),a);s=s.replace(a,b);}fs.writeFileSync(file,s);}
edit('dist/range-souls.js',[
 ['const p=c.a.soulState.qualified1867CapProbability;',"const p=c.a.soulState.qualified1867CapProbability??'arrival';"],
 ['const p=c.a.soulState.qualified1867BurnDuration;',"const p=c.a.soulState.qualified1867BurnDuration??'next-round';"]]);
edit('dist/range-effects.js',[
 ['const zero=c.a.soulState.qualified1120Zero4663;',"const zero=c.a.soulState.qualified1120Zero4663??'trigger';"],
 ['p=c.a.soulState.qualified597First4663;',"p=c.a.soulState.qualified597First4663??'grant-use';"],
 ['const p=c.a.soulState.qualified1200Zero4663;',"const p=c.a.soulState.qualified1200Zero4663??'trigger';"],
 ["if((c.t.soulState.attackSegmentsThisUse??1)>1)throw Error('Q-A60-4075-012：4663/1200受多段时异常反应单位待确认');",'']]);
edit('dist/souls.js',[
 ["if(!rage&&t.hp>0&&a.hp>0&&on(t,'凌虎受击反应'))E.WIKI.effectsEngine.registry[1200].received4663({...context(t,a,m),settledDamage,dealt});",''],
 ["if(m.kind!=='status'&&on(t,'凌虎受击反应'))throw Error('Q-N50-4618-002：4663/1200未命中或整招无效是否受攻待确认');",''],
 ["suitAfterAttack(a,t,hit);}finishYoumei1011", "if(!rage&&t.hp>0&&a.hp>0&&on(t,'凌虎受击反应'))E.WIKI.effectsEngine.registry[1200].received4663({...context(t,a,m),settledDamage:totalSettled,dealt:total});suitAfterAttack(a,t,hit);}finishYoumei1011"]]);
const c=JSON.parse(fs.readFileSync('research/batch5-answer-preparation-2026-10-29/4663-index.json'));Object.assign(c,{status:'implementing-confirmed-subset',accepted:false,pending:['570同源重授与异源消费','1120护盾刷新合并'],proofs:[],testRenames:[],implementedAnswers:{1867:'第三次达到120%即增加焚烬概率10个百分点；补偿烧伤仅紧接下回合',597:'授予当次立即触发',1200:'实际命中零伤仍反应，MISS/整招无效不反应；完整攻击结束每招一次',1120:'护盾零红伤满足低于300，命中免攻零伤按最新命中规则执行词条'}});fs.writeFileSync(base+'4663-user-confirmations.json',JSON.stringify(c,null,2)+'\n');
