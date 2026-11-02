
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
function death1844(c){
 const f=c.a,st=f.soulState;if(st.starBearer1844||st.vanished)return;
 const enemy=c.defeater1833?.side===1-f.side,qualified=st.qualifiedSelfDefeat1844;
 if(!enemy&&!['defeated','not-defeated'].includes(qualified))throw Error('Q-N50-4643-001：1844被击败是否包含37350自身百分比致死待确认');
 if(!enemy&&qualified==='not-defeated')return;
 if((c.on(f,'死亡时技能回复')||st.kingRevivalRound)&&st.qualifiedVanish1844!=='before-revival')throw Error('Q-N50-4604-007：1844消逝与已授临死复活的先后待确认');
 st.starActive1844=false;
 const initial=st.starEntryMaxHP1844; if(!Number.isFinite(initial)||initial<=0)throw Error('1844缺少本次登场最大体力快照');
 c.vanish1844(f);st.starBearer1844={initialEnergy:initial,energy:initial,sourceSoul:1844,sourceHash:'552e3440',awaitingAllyCarrier:true};
}
registry[1844]={name:'蓓丽安特',sourceHash:'552e3440',traits:{},partial:true,unimplemented:['Q-N50-4643-001：自身伤害致死是否被击败','Q-N50-4604-007：真实已授临死/复活与消逝顺序'],deferred:['己方其他精灵被击败使星执者增加300能量，需要真实队伍死亡事件','本体消逝后其他在场己方精灵的全异常转星赐及使用后消耗15%能量附等量真实伤害、回合末消耗15%回复和最少150，需要真实后继载体与队伍共享能量'],abilities:{configureResistance:profile1844,resistanceChance:chance1844,recordedAilment:recordName1844,recordedKind(c,f=c.a){const k=recordName1844(c,f);return k===null?null:conditionStatusRules.isControl(k)?'control':'non-control';},entryMaximum:c=>c.a.soulState.starEntryMaxHP1844,qualifiedDeath:death1844},hooks:{beforeBattleStart:record1844,death:death1844}};
