'use strict';
const attack=m=>m&&!['status','item'].includes(m.kind);
const getForm=f=>f.soulState.huoguangForm??'strong';
function hasFrenzy(c){const st=c.a.soulState;if(st.huoguangFrenzyPendingBoundary===c.round)throw Error('Q-N50-4515-001：击败后第三个后续回合仍否持有北冥狂刃待确认');return (st.huoguangFrenzyEnd??0)>=c.round;}
function setForm(c,form){if(!['strong','unbound','break'].includes(form))throw Error('1727非法形态');c.a.soulState.huoguangForm=form;}
module.exports={name:'霍光',sourceHash:'3832fb4a',partial:true,unimplemented:['Q-N50-4515-001：狂刃3回合含击败当回合与否的边界待确认'],deferred:['威破形态对手主动换宠后为新精灵附加束缚/狂刃改害怕','武器与战斗形态下场保留、再登场持续；真实换宠后的狂刃跨对手状态保存/调用（当前在场载荷已实现）'],traits:{},abilities:{setForm,getForm:c=>getForm(c.a),hasFrenzy},hooks:{
 battleStart(c){c.a.soulState.huoguangForm='strong';},
 beforeCrit(c){if(attack(c.m))c.forceCrit=true;},
 beforeDamage(c){if(!attack(c.m))return;const frenzy=hasFrenzy(c),form=getForm(c.a);if(form==='strong'&&c.crit)c.modifier*=frenzy?2:1.5;if(form==='unbound')c.affinity=Math.max(frenzy?2:1,c.affinity);},
 damageDealt(c){if(c.a.hp<=0||c.t.hp>0||!c.t.soulState.deathResolved)return;const st=c.a.soulState;if(st.huoguangLastDefeatedRound===c.round&&st.huoguangLastDefeatedSide===c.t.side)return;st.huoguangLastDefeatedRound=c.round;st.huoguangLastDefeatedSide=c.t.side;st.huoguangDefeatAttackDamage=c.outgoingAttackEvents().reduce((n,e)=>n+e.settledDamage,0);st.huoguangFrenzyEnd=c.round+2;st.huoguangFrenzyPendingBoundary=c.round+3;},
 afterUse(c){if(c.a.hp<=0||c.t.hp<=0||!attack(c.m)||!hasFrenzy(c))return;c.hurt(c.t,c.a.soulState.huoguangDefeatAttackDamage??0,'北冥狂刃追加','true');},
 combatEnd(c){const st=c.a.soulState;if(st.huoguangLastDefeatedRound===c.round)st.huoguangDefeatAttackDamage=c.outgoingAttackEvents().reduce((n,e)=>n+e.settledDamage,0);}
}};

