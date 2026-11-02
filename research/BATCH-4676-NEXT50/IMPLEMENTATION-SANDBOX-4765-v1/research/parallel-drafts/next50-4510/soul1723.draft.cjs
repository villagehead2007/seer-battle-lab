'use strict';
const shields=require('../../../dist/shield-rules.js');
const shield='weiyue:1723:embrace',barrier='weiyue:1723:insulate';
function hasShield(f){const n=shields.sourceValue(f,shield);if(n<=0&&f.soulState.weiyueShieldHeld)throw Error('4510盾容量耗尽后的持有语义待确认');return n>0;}
function hasBarrier(f){const n=shields.barrierSourceValue(f,barrier);if(n<=0&&f.soulState.weiyueBarrierHeld)throw Error('4510罩容量耗尽后的持有语义待确认');return n>0;}
function open(c,kind){if(c.a.hp<=0)return false;if(kind==='shield'){if(hasShield(c.a))return false;c.addShield(c.a,300,shield);c.a.soulState.weiyueShieldHeld=true;}else{if(hasBarrier(c.a))return false;c.addBarrier(c.a,300,barrier);c.a.soulState.weiyueBarrierHeld=true;}return true;}
function release(c){const a=hasShield(c.a),b=hasBarrier(c.a);if(a){c.a.soulState.weiyueShieldHeld=false;c.refreshShield(c.a,0,shield);}if(b){c.a.soulState.weiyueBarrierHeld=false;c.refreshBarrier(c.a,0,barrier);}return {shield:a,barrier:b};}
function entry(c){const st=c.a.soulState;st.weiyueEntryRound=c.round??1;st.weiyueEnemyUsed=false;delete st.weiyueBothRound;}
module.exports={name:'卫岳',sourceHash:'667a59a9',partial:true,unimplemented:['双防映射较低双攻的能力等级/动态口径待确认','盾罩容量耗尽/清除后持有及特性的存续待确认'],traits:{
 opponentHealingMultiplier:f=>f.hp>0?.5:1,
 attackMultiplier:f=>hasShield(f)?1.5:1,
 pinkDamageMultiplier:f=>hasBarrier(f)?1.25:1,
 immuneAilments:f=>[...(hasShield(f)?['臣服']:[]),...(hasBarrier(f)?['麻痹']:[])]
},abilities:{openShield:c=>open(c,'shield'),openBarrier:c=>open(c,'barrier'),hasShield,hasBarrier,release},deferred:['再次真实登场的首回合响应，当前首次在场已实现','死亡后己方其他精灵攻击伤害提升100%/固百提升50%的两回合承接','双解放后对方其他精灵的2回合禁疗，当前对手禁疗已实现'],hooks:{
 battleStart:entry,entryTriggered:entry,
 roundStart(c){if(c.a.soulState.weiyueBothRound===c.round){delete c.a.soulState.weiyueBothRound;open(c,'shield');open(c,'barrier');}},
 opponentBeforeUse(c){const st=c.a.soulState;if(c.a.hp<=0||c.round!==st.weiyueEntryRound||c.m.kind==='item')return;st.weiyueEnemyUsed=true;open(c,c.m.kind==='status'?'barrier':'shield');},
 combatEnd(c){const st=c.a.soulState;if(c.a.hp>0&&c.round===st.weiyueEntryRound&&!st.weiyueEnemyUsed)st.weiyueBothRound=c.round+1;},
 death(c){const st=c.a.soulState;if(st.weiyueReleased)return;const a=hasShield(c.a),b=hasBarrier(c.a);st.weiyueReleased={round:c.round,shield:a,barrier:b};if(a){c.a.soulState.weiyueShieldHeld=false;c.refreshShield(c.a,0,shield);}if(b){c.a.soulState.weiyueBarrierHeld=false;c.refreshBarrier(c.a,0,barrier);}if(a&&b)c.timed(c.t,'回复效果削减',2,{fraction:1});}
}};


