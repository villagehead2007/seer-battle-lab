'use strict';
const fs=require('fs'),assert=require('assert/strict'),p='dist/characteristics.js';let s=fs.readFileSync(p,'utf8');assert.ok(!s.includes('selectionOverrides2059'));s=s.replace('function active(f){const e=selected(f);','const selectionOverrides2059=new WeakMap();\nfunction active(f){if(selectionOverrides2059.has(f))return selectionOverrides2059.get(f);const e=selected(f);');s=s.replace("function chance(f,e,r){const turbulence", "function chance(f,e,r){if(e.copied2059)return 99;const turbulence");s=s.replace("if(state[e.id]===token)return false;state[e.id]=token;", "const key=e.id+(e.copied2059?':borrowed2059':'');if(state[key]===token)return false;state[key]=token;");
const anchor='for(const m of metadata)Object.freeze(m);return Object.freeze(';assert.equal(s.split(anchor).length,2);
const block=`
function entries2059(f){const result=[],own=active(f);if(own)result.push(own);const st=f.soulState?.lotus2059;if(st?.form==='mesh'&&st.meshEnd>=(f.soulState.calculationRound??1)&&st.borrowedGroupId&&!f.soulState.petEffectDisabled){const row=catalog.get(st.borrowedGroupId,5),base=compile(row);if(base){const restriction=f.soulState.compute1987;if(!(restriction?.limited&&['瞬杀','回神','顽强'].includes(base.name)))result.push({...base,attackKind:null,copied2059:true});}}return result;}
function with2059(f,e,fn){const had=selectionOverrides2059.has(f),prior=selectionOverrides2059.get(f);selectionOverrides2059.set(f,e);try{return fn();}finally{if(had)selectionOverrides2059.set(f,prior);else selectionOverrides2059.delete(f);}}
function product2059(f,fn){return entries2059(f).reduce((n,e)=>n*with2059(f,e,fn),1);}
function sum2059(f,fn){return entries2059(f).reduce((n,e)=>n+with2059(f,e,fn),0);}
function each2059(f,fn){for(const e of entries2059(f))with2059(f,e,fn);}
const enhanced2059={
powerFactor:(f,m,parts)=>product2059(f,()=>powerFactor(f,m,parts)),
accuracyFactor:(a,t)=>entries2059(a).filter(e=>e.kind==='accuracy').reduce((n,e)=>n*(1+e.fraction),1)*entries2059(t).filter(e=>e.kind==='evasion').reduce((n,e)=>n*(1-e.fraction),1),
criticalOffset:(a,t)=>entries2059(a).filter(e=>e.kind==='critical').reduce((n,e)=>n+e.fraction,0)-entries2059(t).filter(e=>e.kind==='antiCritical').reduce((n,e)=>n+e.fraction,0),
attackFactor:(f,m)=>product2059(f,()=>attackFactor(f,m)),outgoingFlat:c=>sum2059(c.a,()=>outgoingFlat(c)),
incomingAttack(c){let flat=0;each2059(c.a,()=>{delete c.characteristicFlatReduction;incomingAttack(c);flat+=c.characteristicFlatReduction??0;});if(flat)c.characteristicFlatReduction=flat;},
incomingOther:c=>each2059(c.a,()=>incomingOther(c)),fatal:c=>each2059(c.a,()=>fatal(c)),received:c=>each2059(c.a,()=>received(c)),used:c=>each2059(c.a,()=>used(c)),damageDealt:c=>each2059(c.a,()=>damageDealt(c)),healthLost:c=>each2059(c.a,()=>healthLost(c))};
`;
s=s.replace(anchor,block+anchor);s=s.replace('damageDealt,healthLost});','damageDealt,healthLost,...enhanced2059});');fs.writeFileSync(p,s);console.log('installed copied characteristics2059');
