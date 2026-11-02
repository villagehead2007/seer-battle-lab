'use strict';
const fs=require('fs'),assert=require('node:assert/strict');let text=fs.readFileSync('dist/range-souls.js','utf8');
const start=text.indexOf("for(const [id,hash]of [[1389,'d8add77a']"),end=text.indexOf('\n',start);assert.ok(start>0&&end>start);let rule=text.slice(start,end);
const flag="partial:true,unimplemented:[...(id===1690?['Q-A60-4163-037：有盾时的70%盾值吸取伤害类型/回复基数及依赖后序']:[]),'Q-A60-4163-038：反转是否触发消除/吸取反制'],";assert.ok(rule.includes(flag));rule=rule.replace(flag,'');
const reverse="if(c.operation==='reverse')throw Error('强化反转是否触发消除/吸取反制待Q-A60-4163-038');";assert.ok(rule.includes(reverse));rule=rule.replace(reverse,'');
const a=rule.indexOf('if(id===1690&&shield){'),b=rule.indexOf('const n=Object.values',a);assert.ok(a>0&&b>a);
rule=rule.slice(0,a)+`if(id===1690&&shield){healthRules.drainPercent(c,c.shieldValue(c.a)*.7,'逆魂护盾70%吸取');if(c.t.hp>0){const chance=c.statusProbability(70);if(!(c.random()<chance/100&&c.ailment(c.t,'石化',c.a,false,false,null,{probabilityPercent:70})))c.stage(c.a,1);}}`+rule.slice(b);
text=text.slice(0,start)+rule+text.slice(end);fs.writeFileSync('dist/range-souls.js',text);console.log('4163仅当前两魂印反转按消强反制，1690先百分比理论吸取与石化补偿再固定附伤；未扩大其他反转规则。');
