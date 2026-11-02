'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),file='dist/souls.js';let s=fs.readFileSync(file,'utf8');
const from=s.indexOf('    function scatterFatalMarks(f,count,source,effectId=null){'),to=s.indexOf('    function context(a,t,m=null)',from);assert.ok(from>0&&to>from);let helper=s.slice(from,to);
s=s.slice(0,from)+s.slice(to);
helper=helper.replace('function scatterFatalMarks(f,count,source,effectId=null)','function scatterFatalMarks(s,f,count,source,effectId=null,emit=null)').replace('round:r,sourceSide:','round:s.round,sourceSide:').replace("emit(name(f)+' '+battleMoves[id].name+","emit?.((f.side===0?'A':'B')+' 方 '+(s.moveDefinitions??E.MOVES)[id].name+");
const anchor='  E.createBattle = function';assert.ok(s.includes(anchor));s=s.replace(anchor,helper+'\n'+anchor);
const use='scatterFatalMarks:(f,n,effectId=null)=>scatterFatalMarks(actualFighter(f),n,a,effectId),';assert.ok(s.includes(use));s=s.replace(use,'scatterFatalMarks:(f,n,effectId=null)=>scatterFatalMarks(s,actualFighter(f),n,a,effectId,emit),');
const initial="E.SOULS.run('battleStart',{a,t:s.fighters[1-a.side],addShield:shieldRules.add,";assert.ok(s.includes(initial));s=s.replace(initial,initial+'scatterFatalMarks:(f,n,effectId=null)=>scatterFatalMarks(s,f,n,a,effectId),');fs.writeFileSync(file,s);
console.log('公共印记散布同时接入真实战斗初始化和回合上下文，使用同一随机与状态处理。');
