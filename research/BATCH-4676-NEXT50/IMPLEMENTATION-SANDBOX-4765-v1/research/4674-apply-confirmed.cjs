'use strict';const fs=require('fs'),assert=require('node:assert/strict'),base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/',dir=base+'4674-before/';fs.mkdirSync(dir,{recursive:true});function edit(file,pairs){let s=fs.readFileSync(file,'utf8');fs.writeFileSync(dir+file.split('/').pop(),s,{flag:'wx'});for(const[a,b]of pairs){assert.ok(s.includes(a),a);s=s.replace(a,b);}fs.writeFileSync(file,s);}
edit('dist/range-souls.js',[
 ['const mode=c.a.soulState.qualified1876Accounting;',"const mode=c.a.soulState.qualified1876Accounting??'raw-stage';"],
 ['const mode=c.a.soulState.qualified1876FailedNext;',"const mode=c.a.soulState.qualified1876FailedNext??'retain';"]]);
edit('dist/range-effects.js',[
 ['{amount:p[4],polar803:true}','{amount:p[4],polar803:true,attackOnly:true}'],
 ["if(c.a.counts.immune>0||c.on(c.a,'免异常')||c.on(c.a,'reflect'))throw Error('Q-N50-4511-006：4674反弹与未消费免异资源重合待确认');",''],
 ['mode=c.a.soulState.qualified77First4674;',"mode=c.a.soulState.qualified77First4674??'grant-use';"],
 ["function cap803(c,n,shield=0){const e=c.a.effects['伤害上限'];if(!e?.polar803||!(n>0))return n;const prior=c.settledReceived4658(c.a),mode=c.a.soulState.qualified803Unit4674,roundCap=Math.max(0,e.amount-prior);if(Math.min(n,e.amount)!==Math.min(n,roundCap)&&!['event','round-settled'].includes(mode))throw Error('Q-N50-4633-001：4674/803每事件或整回合限伤额度待确认');const cap=mode==='round-settled'?roundCap:e.amount,order=c.a.soulState.qualified803Shield4674;if(shield>0&&n>cap&&!['before','after'].includes(order))throw Error('Q-N50-4633-001：4674/803与护盾护罩扣除先后待确认');return shield>0&&order==='after'?n:Math.min(n,cap);}","function cap803(c,n,shield=0){const e=c.a.effects['伤害上限'];if(!e?.polar803||!(n>0))return n;return Math.min(n,Math.max(0,e.amount-c.settledRedReceivedThisUse4658(c.a)));}"]]);
edit('dist/souls.js',[
 ["if(!bypass&&on(f,'伤害上限')&&f.effects['伤害上限'].polar803)amount=", "if(type==='attack'&&!bypass&&on(f,'伤害上限')&&f.effects['伤害上限'].polar803)amount="],
 ["if(!bypass&&on(f,'伤害上限')&&f.effects['伤害上限'].polar803)amount=", "if(type==='attack'&&!bypass&&on(f,'伤害上限')&&f.effects['伤害上限'].polar803)amount="],
 ['mode=a.soulState.qualified992First4674;',"mode=a.soulState.qualified992First4674??'grant-use';"]]);
const c=JSON.parse(fs.readFileSync('research/batch5-answer-preparation-2026-10-29/4674-index.json'));Object.assign(c,{accepted:false,status:'state-testing',pending:[],proofs:[],testRenames:[],implementedAnswers:{1876:'按本魂印这一步减免的差值累计，无论后续护盾或免疫；MISS/整招无效保留至下次攻击',803:'每次技能的完整红伤合计上限300，护盾前限额，按最终结算红伤扣额度；固定、百分比和真实伤害不限制',191:'回合免反优先不消费次数免异，重授刷新',77:'授予当次触发',992:'授予当次触发'}});fs.writeFileSync(base+'4674-user-confirmations.json',JSON.stringify(c,null,2)+'\n');
