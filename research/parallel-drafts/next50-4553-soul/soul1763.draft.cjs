'use strict';
function entryPayload(c,armBefore){
  if(typeof armBefore!=='boolean')throw Error('Q-N50-4553-001/ENTRY：登场混乱和记录启用顺序未确认');
  const st=c.a.soulState;st.beiniaoCaptureArmed=armBefore;
  const apply=(f)=>c.entryAilment?c.entryAilment(f,'混乱',2):c.ailment(f,'混乱',c.a,false,false,2);
  apply(c.t);if(apply(c.a)&&armBefore)capture(c,'混乱');
  if(!armBefore)st.beiniaoCaptureArmed=true;
}
function capture(c,status){
  const st=c.a.soulState;if(!st.beiniaoCaptureArmed)return;
  st.beiniaoCaptureArmed=false;st.beiniaoRecorded={name:status};
  c.convertAilment(c.a,status,'混乱',3);
}
function springCry(c){
  let n=0;for(const f of[c.a,c.t])for(const[k,end]of Object.entries({...f.ailments}))if(end>=c.round&&c.clearAilment(f,k))n++;
  if(n&&c.t.hp>0)c.stage(c.t,-n);
  c.a.soulState.beiniaoSpringCry={round:c.round,removed:n};
  return n;
}
function settleTotal(c,total){
  if(!Number.isInteger(total)||total<0)throw Error('异常回合数负载必须为非负整数');
  if(c.a.hp<=0)return;
  c.a.soulState.beiniaoSettlementDoneRound=c.round;
  c.heal(c.a,total*60,'万里春双方异常回合回复');
  if(total>5)springCry(c);
}
function attackRecord(c){
  const rec=c.a.soulState.beiniaoRecorded;if(!rec||c.a.hp<=0||c.t.hp<=0||c.m.kind==='status'||c.m.kind==='item')return;
  if(!Number.isInteger(rec.duration)||rec.duration<1)throw Error('Q-N50-4553-003/RECORD：记录异常附加时长未确认');
  if(!c.ailment(c.t,rec.name,c.a,false,false,rec.duration))c.timed(c.t,'statusBlock',2,{});
}
module.exports={name:'万里春·北鸟',sourceHash:'e0721474',partial:true,unimplemented:['Q-N50-4553-001：登场混乱和捕获启用先后','Q-N50-4553-002：战阶异常回合数定义','Q-N50-4553-003：记录异常复施时长'],traits:{attackReduction:f=>f.soulState.beiniaoRecorded?0:.3},
  abilities:{qualifiedEntry:entryPayload,capture,qualifiedSettlement:settleTotal,springCry,
    resolveRecordDuration(c,n){if(!c.a.soulState.beiniaoRecorded)throw Error('不存在记录');if(!Number.isInteger(n)||n<1)throw Error('异常时长必须为正整数');c.a.soulState.beiniaoRecorded.duration=n;},
    attackRecord},
  deferred:['每次真实再次登场重新令双方混乱2回合并赋予下次异常记录/转化；当前初登场载荷独立实现，启用先后待确认',
    '万里春啼实际解除计数后，下回合对手精灵真实出战时附加同等数量非限制类异常；成功且自身仍在场时清除自身记录并附加目标。真实换宠事件及继任目标尚缺，当前解除/每项全属性-1已实现'],
  hooks:{battleStart(){throw Error('Q-N50-4553-001/ENTRY：登场混乱和记录启用顺序未确认');},
    roundStart(c){if([c.a,c.t].some(f=>Object.values(f.ailments).some(end=>end>=c.round)))c.a.soulState.beiniaoAbnormalHistory=true;},
    ailmentApplied(c){capture(c,c.status);},afterUse:attackRecord,
    combatEnd(c){if(c.a.hp<=0||c.a.soulState.beiniaoSettlementDoneRound===c.round)return;const active=[c.a,c.t].some(f=>Object.values(f.ailments).some(end=>end>=c.round));if(active||c.a.soulState.beiniaoAbnormalHistory)throw Error('Q-N50-4553-002/TOTAL：异常回合数是剩余和还是经过累计待确认');}}};
