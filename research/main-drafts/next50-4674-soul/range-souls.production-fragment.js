(()=>{'use strict';
function state1876(f){return f.soulState.polar1876??(f.soulState.polar1876={sourceHash:'92b69ae1',pending:0});}
function record1876(c){const st=state1876(c.a),delta=Math.max(0,c.unreducedRaw-c.reducedRaw);if(!delta)return;let amount=delta;if(c.settledDamage!==c.reducedRaw){const mode=c.a.soulState.qualified1876Accounting;if(!['raw-stage','positive-settled-only'].includes(mode)){const err=Error('Q-N50-4674-001：1876本魂减免转附伤遇后续上限/护盾/免疫时统计基数待确认');err.polarAccounting={round:c.round,raw:c.reducedRaw,unreducedRaw:c.unreducedRaw,settledDamage:c.settledDamage,delta};throw err;}if(mode==='positive-settled-only'&&c.settledDamage===0)amount=0;}(st.reductions??=[]).push({round:c.round,unreducedRaw:c.unreducedRaw,reducedRaw:c.reducedRaw,settledDamage:c.settledDamage,amount});st.pending+=amount;}
registry[1876]={name:'无极使者',sourceHash:'92b69ae1',partial:true,unimplemented:['Q-N50-4674-001：减免转固伤与其他减免/盾/免疫基数','Q-N50-4511-006：下次附伤遇MISS/整招无效消费'],deferred:['真正再次登场时首回合命中效果失效；当前首次在场已实现'],traits:{skillPriority:f=>state1876(f).full?1:0},abilities:{recordReduction:record1876},hooks:{
battleStart(c){state1876(c.a);c.t.effects['攻击技能命中效果失效']={start:1,end:1,source1876:true};},
roundStart(c){const st=state1876(c.a);st.round=c.round;st.full=c.a.hp===c.a.stats.maxHp;},
beforeIncomingAttack(c){const st=state1876(c.a);if(st.round===c.round&&!st.full){c.reduction=1-(1-c.reduction)*.5;c.polar1876=true;}},
beforeUse(c){if(!['physical','special'].includes(c.m.kind))return;const st=state1876(c.a);if(st.pending>0){st.using={round:c.round,amount:st.pending,move:c.m.id};st.pending=0;}},
afterHit(c){if(!['physical','special'].includes(c.m.kind))return;const st=state1876(c.a),u=st.using;if(!u||u.round!==c.round||u.move!==c.m.id)return;u.executed=true;if(c.a.hp>0&&c.t.hp>0)c.hurt(c.t,u.amount,'无极减免转下次固定','fixed');},
afterUse(c){const st=state1876(c.a),u=st.using;if(!u||u.round!==c.round||u.move!==c.m.id)return;if(!u.executed){const mode=c.a.soulState.qualified1876FailedNext;if(!['consume','retain'].includes(mode))throw Error('Q-N50-4511-006：1876下次附伤未命中/整招无效时消费待确认');if(mode==='retain')st.pending+=u.amount;}delete st.using;}
}};
})();
