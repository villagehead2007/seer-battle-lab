
function ensure1860(c){const st=c.a.soulState;if(!st.memory1860)st.memory1860={entryRound:c.round??1,records:[],conversions:[],sourceHash:'f822be8f'};return st.memory1860;}
function admitted1860(c,k,n){const st=ensure1860(c);if(c.a.hp<=0||c.round>st.entryRound+2)return null;
 const repeated=k==='沉默'&&c.a.ailments['沉默']>=c.round,policy=c.a.soulState.qualifiedSilenceRefresh1860;
 if(repeated&&st.records.length<4&&!['record','no-record'].includes(policy)){const e=Error('Q-N50-4658-001：1860已有沉默的成功同名刷新是否再记录待确认');e.memory1860={round:c.round,original:k,requestedDuration:n,records:structuredClone(st.records),silenceEnd:c.a.ailments['沉默']};throw e;}
 const record=!repeated||policy!=='no-record';if(record&&st.records.length<4)st.records.push({name:k,enteredRound:c.round,requestedDuration:n});
 st.conversions.push({round:c.round,from:k,to:'沉默',duration:3,recorded:record,records:st.records.length});return {kind:'沉默',duration:3};
}
function drain1860(c){const st=ensure1860(c);if(c.a.hp<=0||!['physical','special'].includes(c.m?.kind)||c.round<=st.entryRound+2||!st.records.length)return;
 const removed=st.records.shift(),nominal=c.t.stats.maxHp/3,dealt=healthRules.drainPercent(c,nominal,'仿生兽记录FIFO百分比吸取');(st.drains??=[]).push({round:c.round,move:c.m.id,removed,nominal,dealt,remaining:st.records.length});
}
registry[1860]={name:'仿生兽·库比',sourceHash:'f822be8f',partial:true,unimplemented:['Q-N50-4658-001：已有沉默的成功同名刷新是否再记录'],deferred:['自身真实下场清除记录并依次附加给己方下只出战精灵：需要真实离场/队伍/后继精灵载体，当前在场记录、转化、增伤、回复与FIFO消费均当前实现'],traits:{},abilities:{admitted:admitted1860,recordCount:c=>ensure1860(c).records.length,records:c=>structuredClone(ensure1860(c).records)},hooks:{beforeBattleStart:ensure1860,battleStart:ensure1860,beforeDamage(c){if(['physical','special'].includes(c.m?.kind))c.modifier*=1+ensure1860(c).records.length*.3;},afterUse:drain1860,roundEnd(c){if(c.a.hp>0){const n=ensure1860(c).records.length;if(n)c.heal(c.a,c.a.stats.maxHp*.15*n,'仿生兽每记录回合末回复');}}}};
