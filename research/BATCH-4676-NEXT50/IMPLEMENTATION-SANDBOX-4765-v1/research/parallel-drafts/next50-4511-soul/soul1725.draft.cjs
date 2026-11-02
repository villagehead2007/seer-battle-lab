'use strict';
const statuses=require('../../../dist/status-rules.js'),pools=require('../../../dist/status-pools.js');
const keys=['atk','def','spa','spd','spe','acc'],controls=pools.pool().map(x=>x.name).filter(statuses.isControl);
function entry(c){c.a.soulState.nanEntryRound=c.round??1;c.stage(c.a,1);c.stage(c.t,1);}
// Payloads isolated from the unresolved entry-window/condition snapshot trigger.
function qualifiedCopy(c){if(c.a.hp<=0||c.t.hp<=0)return false;const values=Object.fromEntries(keys.filter(k=>c.t.stages[k]>0).map(k=>[k,c.t.stages[k]]));if(c.weaknessBlocked?.(c.a)||c.on(c.a,'禁强化')||c.on(c.a,'强化保护')||c.on(c.a,'弱化不可解除反转'))throw Error('Q-N50-4511-002：复制保护交互待确认，4505特定答案不自动扩展');let ok=false;for(const [k,n]of Object.entries(values)){const before=c.a.stages[k];if(n!==before)c.stage(c.a,n-before,[k]);ok ||= c.a.stages[k]!==before;}if(ok){c.ailment(c.a,'凝滞',c.a,false,false,null,{probabilityPercent:100});c.ailment(c.t,'凝滞',c.a,false,false,null,{probabilityPercent:100});}return ok;}
function qualifiedBarrier(c,positiveLevelSum){if(!Number.isInteger(positiveLevelSum)||positiveLevelSum<0||positiveLevelSum>36)throw Error('魂印1725护罩正级总和无效');if(c.a.hp>0)c.addBarrier(c.a,positiveLevelSum*60,'nan1725-copy:'+c.round);}
function punish(c){const st=c.a.soulState;st.nanPunishRound=c.round+1;st.nanControlImmuneUntil=c.round+1;for(const k of Object.keys(c.a.ailments))if(statuses.isControl(k))c.clearAilment(c.a,k);}
module.exports={name:'不破帝·南霜',sourceHash:'7224df48',partial:true,unimplemented:['登场后复制/护罩触发窗口及等级判定/护罩取值时点待核实','Q-N50-4511-002：1725复制保护及反制交互缺独立来源，4505特定确认不自动扩展','Q-N50-4511-003：非整30份盾值增伤算法待确认'],deferred:['真实再次换宠登场：双方全属性+1并重新建立来源登场条件'],traits:{attackMultiplier:f=>{if(f.soulState.nanDamageRound!==f.soulState.calculationRound)return 1;if(f.soulState.nanDamageUnresolved)throw Error('Q-N50-4511-003：非整30盾增伤算法待确认');return 1+(f.soulState.nanDamageBonus??0);},immuneAilments:f=>(f.soulState.nanControlImmuneUntil??0)>=(f.soulState.calculationRound??1)?controls:[]},abilities:{qualifiedCopy,qualifiedBarrier,punish},hooks:{
 battleStart:entry,entryTriggered:entry,
 choiceLocked(c){if(c.a.soulState.nanPunishRound===c.round&&c.m.kind!=='item')c.a.soulState.opponentBoostsAsWeakThis=true;},
 opponentPriority(c){if(c.a.soulState.nanPunishRound===c.round)c.priority=Math.min(c.priority,c.ownPriority);},
 combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;const n=c.shieldValue(c.t),st=c.a.soulState;st.nanDamageRound=c.round+1;st.nanDamageUnresolved=n%30!==0;st.nanDamageBonus=st.nanDamageUnresolved?null:n/30*.06;if(n>=300){c.consumeShields(c.t,c.a,false);if(c.t.hp>0)c.addShield(c.t,n-300,'nan1725-remainder:'+c.round);if(c.a.hp>0)punish(c);}}
}};


