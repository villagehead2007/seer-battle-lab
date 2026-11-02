'use strict';
const fs=require('fs'),assert=require('node:assert/strict');
const soulFile='dist/range-souls.js',engineFile='dist/souls.js';
let engine=fs.readFileSync(engineFile,'utf8');
const anchor='maxPP:key=>battleMoves[key].pp,missingPP:';
assert.ok(engine.includes(anchor));
engine=engine.replace(anchor,'moveKind:key=>battleMoves[key]?.kind,maxPP:key=>battleMoves[key].pp,missingPP:');
fs.writeFileSync(engineFile,engine);
let souls=fs.readFileSync(soulFile,'utf8');
const next="for(const [id,hash,denominator]of [[1362,'56119652',3]";
assert.ok(souls.includes(next));
const addition=`// User Q022/Q024/Q093. These resource rules do not certify the remaining 2051 branches.
{const original=registry[2051],hooks=original.hooks;
registry[2051]={...original,hooks:{...hooks,
 roundStart(c){hooks.roundStart(c);const st=c.a.soulState;
  st.leonOldDialUses??=st.leonOldDialLayers??0;
  const threshold=12-(st.leonOldDialThresholdReduction??0);
  if((st.leonOldDialLayers??0)>0&&c.missingPP(c.a)>=threshold){c.heal(c.a,c.a.stats.maxHp,'旧日之晷回满体力');c.restorePP(c.a,Infinity);st.leonOldDialUses++;}
 },
 opponentBeforeUse(c){if(c.m.kind==='item'||c.a.hp<=0)return;const st=c.a.soulState;
  if(!(st.leonOldDialUses>0))return;
  // opponentBeforeUse runs after PP consumption: the immutable use snapshot is required.
  const before=c.t.soulState.ppBeforeUse??c.t.pp;
  if(c.t.moves.some(key=>before[key]===1&&c.moveKind(key)===c.m.kind)){
   st.leonOldDialUses--;c.t.soulState.skillInvalidRound=c.round;
   c.emit('旧日之晷按扣除前PP判定，消耗1次无效机会。');
  }
 },
 afterUse(c){const st=c.a.soulState,had=!!st.leonLastKind;hooks.afterUse(c);
  if(c.m.kind!=='item'&&c.a.hp>0&&!had){const old=st.leonOldDialLayers??0;st.leonOldDialLayers=Math.min(5,old+1);st.leonOldDialUses=(st.leonOldDialUses??0)+st.leonOldDialLayers-old;st.leonOldDialObtained=true;delete st.leonOldDialPending;delete st.leonFirstPending;}
 }
}};}

`;
souls=souls.replace(next,addition+next);fs.writeFileSync(soulFile,souls);
console.log('4125旧日之晷PP扣除前判断及资源次数已接入；2051其余缺口仍partial。');
