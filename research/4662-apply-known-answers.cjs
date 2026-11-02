'use strict';const fs=require('fs'),assert=require('node:assert/strict'),base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/',dir=base+'4662-before/';fs.mkdirSync(dir,{recursive:true});function edit(file,replacements){let s=fs.readFileSync(file,'utf8');fs.writeFileSync(dir+file.split('/').pop(),s,{flag:'wx'});for(const[a,b]of replacements){assert.ok(s.includes(a),a);s=s.replace(a,b);}fs.writeFileSync(file,s);}
edit('dist/range-souls.js',[
 ['const p=c.a.soulState.qualifiedZeroCritical1866;',"const p=c.a.soulState.qualifiedZeroCritical1866??(c.attackImmune?'not-critical':'critical');"],
 ['const p=c.a.soulState.qualifiedZeroReceived1866;',"const p=c.a.soulState.qualifiedZeroReceived1866??(c.attackImmune?'not-received':'received');"],
 ['p=c.a.soulState.qualifiedPowerBasis1866;',"p=c.a.soulState.qualifiedPowerBasis1866??'base';"]]);
edit('dist/range-effects.js',[
 ['const q=c.a.soulState.qualifiedZeroCritical1866;',"const q=c.a.soulState.qualifiedZeroCritical1866??(c.attackImmune?'not-critical':'critical');"],
 ['q=c.a.soulState.qualified1144Healing4662;',"q=c.a.soulState.qualified1144Healing4662??'nominal';"],
 ['const q=c.a.soulState.qualified1256Basis4662;',"const q=c.a.soulState.qualified1256Basis4662??'attack';"],
 ['q=c.a.soulState.qualifiedFirst7174662;',"q=c.a.soulState.qualifiedFirst7174662??'immediate';"],
 ['q=c.a.soulState.qualified181Sequence4662;',"q=c.a.soulState.qualified181Sequence4662??'same-skill';"]]);
const c=JSON.parse(fs.readFileSync('research/batch5-answer-preparation-2026-10-29/4662-index.json'));c.status='implementing-confirmed-subset';c.accepted=false;c.pending=['2165/2173转移免疫同名与原状态移除','948吸强两端限制','1115/1204/1256次数重授'];c.implementedAnswers={1866:'基础威力两倍真伤；护盾零伤算暴击、免攻零伤不算；受非暴零伤免攻排除',181:'仅连续本技能计数',1144:'理论随机固定数值回复',1256:'低300只看完整红伤',717:'按全局非下X回合规则授予当次立即触发'};c.testRenames=[];c.proofs=[];fs.writeFileSync(base+'4662-user-confirmations.json',JSON.stringify(c,null,2)+'\n');console.log('4662已明确规则已应用，其余三组保持待答');
