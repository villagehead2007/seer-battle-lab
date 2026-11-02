'use strict';const status=require('../../../dist/status-rules.js');
const active=f=>(f.soulState.wukongSaintEnd??0)>=(f.soulState.calculationRound??f.soulState.wukongRound??1);
function saint(c){const conflict=c.healingMultiplier(c.a)!==1||c.on(c.a,'四杀鬼囹')||(c.a.soulState.soulGu??[]).some(g=>g.usedRound!==c.round);if(conflict)throw Error('Q-N50-4524-001：1738重置HP与禁疗/倍率/回复事件交互待确认');const st=c.a.soulState;st.wukongSaintSpent=true;st.wukongSaintEnd=c.round+2;c.clearAilments(c.a);for(const id of c.a.moves)c.a.pp[id]=c.maxPP(id);c.a.hp=c.a.stats.maxHp;}
module.exports={name:'孙悟空',sourceHash:'615c5edb',partial:true,unimplemented:['Q-N50-4524-001：重置HP与全回复抑制及回复事件交互待确认'],deferred:['法天象地·圣下场消失，需要真实换宠；每场一次的跨下场消费保留'],traits:{weaknessImmune:true,immuneAilments:['焚烬','烧伤'],ailmentImmune:f=>active(f),skillPriority:f=>(f.soulState.wukongLow?1:0)+(active(f)?1:0)},abilities:{qualifiedSaint:saint},hooks:{
 roundStart(c){const st=c.a.soulState;st.wukongRound=c.round;st.wukongHigh=c.t.hp>c.t.stats.maxHp/2;st.wukongLow=c.t.hp<c.t.stats.maxHp/2;if(c.a.hp>0&&!st.wukongSaintSpent&&c.a.hp<c.a.stats.maxHp/2&&status.conditionPresent(c.a,c.round))saint(c);},
 beforeCrit(c){if(c.m&&!['status','item'].includes(c.m.kind)&&active(c.a))c.forceCrit=true;},
 beforeDamage(c){if(c.a.soulState.wukongHigh&&c.m&&!['status','item'].includes(c.m.kind))c.modifier*=c.crit?2:1.5;},
 afterUse(c){if(c.a.hp>0&&c.t.hp>0&&c.m.kind!=='item'&&c.a.soulState.wukongLow)c.hurt(c.t,c.t.stats.maxHp/3,'孙悟空低体对手追加','percent');}
}};


