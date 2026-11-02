'use strict';const fs=require('fs'),assert=require('node:assert/strict'),base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/';const file='dist/range-effects.js';let s=fs.readFileSync(file,'utf8');fs.writeFileSync(base+'4663-before/range-effects.final-answers.js',s,{flag:'wx'});for(const[a,b]of[
["if((c.a.counts.attackNullify??0)>0)throw Error('Q-N50-4511-006：4663免攻未消费重授待确认');",''],
["if(c.shieldValue(c.a)>0)throw Error('Q-N50-4600-005：4663低伤盾与已有盾合并待确认');c.addShield(c.a,p[1],'4663/37475/1120');","c.refreshShield(c.a,p[1],'4663/37475/1120');"]]){assert.ok(s.includes(a));s=s.replace(a,b);}fs.writeFileSync(file,s);
const cp=base+'4663-user-confirmations.json',c=JSON.parse(fs.readFileSync(cp));c.latestAnswers=[{call:'call_7bb84ab067184ff79f85239525972676',answer:'是，是'}];c.pending=[];c.status='implementing-confirmed-answers';c.implementedAnswers[570]='两实例各同源刷新1，异源独立后得先消费';c.implementedAnswers[1120]+='；同源刷新300、异源保留合计，刷新不触发消失';
const f='tests/next50-4663-skills.test.cjs';s=fs.readFileSync(f,'utf8');for(const[a,b]of[
["assert.throws(()=>turn(repeat),/Q-N50-4511-006/);","turn(repeat);assert.equal(repeat.fighters[0].counts.attackNullify,1);"],
["assert.throws(()=>turn(s),/Q-N50-4600-005/);","turn(s);assert.equal(s.fighters[0].suitState.shield,301);"]]){assert.ok(s.includes(a));s=s.replace(a,b);}fs.writeFileSync(f,s);fs.writeFileSync(cp,JSON.stringify(c,null,2)+'\n');
