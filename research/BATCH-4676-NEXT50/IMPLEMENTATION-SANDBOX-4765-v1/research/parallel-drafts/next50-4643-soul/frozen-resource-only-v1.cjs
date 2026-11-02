'use strict';// Frozen resource-only draft, no death dispatch and no claim of behavioral validation.
module.exports=function(registry){const conditionStatusRules=require('../../../dist/status-rules.js'),soulStatusPools=require('../../../dist/status-pools.js');

function profile1844(c,p){
 if(!p||typeof p.entries!=='object'||Array.isArray(p.entries)||![0,.05].includes(p.fullBonus??0))throw Error('1844实际抗性配置须entries和独立fullBonus(0或0.05)');
 const valid=new Set(soulStatusPools.pool(undefined,{includeRestricted:true}).map(x=>x.name)),entries={};
 for(const [k,v]of Object.entries(p.entries)){if(!valid.has(k)||!Number.isFinite(v)||v<0||v>.5)throw Error('1844实际异常抗性项目/概率非法 '+k);entries[k]=v;}
 c.a.soulState.resistanceProfile1844={entries,fullBonus:p.fullBonus??0,source:{page:'培养机制',revision:389166,configuration:'source-bound actual specific probabilities, fullBonus excluded from entries'}};
 return structuredClone(c.a.soulState.resistanceProfile1844);
}
function record1844(c){
 const f=c.a,st=f.soulState,p=st.resistanceProfile1844;
 const entries=p?{...p.entries}:Object.fromEntries([[f.build.resistance.major,.55],[f.build.resistance.minor,.18]].filter(([k])=>k));
 const maximum=Math.max(0,...Object.values(entries)),highest=Object.keys(entries).filter(k=>entries[k]===maximum);
 st.starRecord1844=maximum>0&&highest.length===1?highest[0]:null;
 st.starRecordProfile1844={entries,fullBonus:p?.fullBonus??0,mode:p?'explicit-source-bound':'existing-gear-profile'};
 st.starActive1844=true;st.starEntryMaxHP1844=f.stats.maxHp;
}
function chance1844(c,k,base){const p=c.a.soulState.resistanceProfile1844;return p?Math.min(1,(p.entries[k]??0)+p.fullBonus):base;}
function recordName1844(c,f=c.a){return f.soulState.starActive1844?f.soulState.starRecord1844??null:null;}

registry[1844]={name:'蓓丽安特',sourceHash:'552e3440',partial:true,traits:{},abilities:{configureResistance:profile1844,resistanceChance:chance1844,recordedAilment:recordName1844,recordedKind(c,f=c.a){const k=recordName1844(c,f);return k===null?null:conditionStatusRules.isControl(k)?'control':'non-control';}},hooks:{beforeBattleStart:record1844}};
};
