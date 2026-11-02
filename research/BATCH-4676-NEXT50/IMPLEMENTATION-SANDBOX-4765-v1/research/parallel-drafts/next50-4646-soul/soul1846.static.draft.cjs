'use strict';
// Static preparation only. No test has run and no source scope has been inferred from old runtime behavior.
const statusRules=require('../../../dist/status-rules.js');
function frame1846(c){const high=c.a.hp>c.t.hp,low=c.a.hp<c.t.hp;c.a.soulState.clockFrame1846={round:c.round,high,low};}
function guardMixedImmunity1846(c){const e=c.a.soulState.clockFrame1846;if(e?.round!==c.round||!(e.low||e.high&&statusRules.isWeakening(c.status)))return;
  if((c.a.counts.immune??0)>0||c.on(c.a,'reflect')||c.on(c.a,'控制异常反弹')||(c.a.soulState.immunity1757Charges?.length??0)>0){const err=Error('Q-N50-4511-006：1846回初免异常与真实次数或反弹来源共存消费待确认');err.clockAilmentConflict1846={round:c.round,hp:c.a.hp,pp:{...c.a.pp},status:c.status,ailments:{...c.a.ailments}};throw err;}
}
function beforeAilment1846(c){const e=c.a.soulState.clockFrame1846;if(e?.round!==c.round||!(e.low||e.high&&statusRules.isWeakening(c.status)))return;guardMixedImmunity1846(c);c.blocked=true;}
function endUsed1846(c){if(!c.m||c.m.kind==='item'||c.a.pp[c.m.id]!==0)return;
  if(c.m.kind==='status'){
    const policy=c.a.soulState.qualifiedFloorStatusScope1846;
    if(!['attack-only','all-skills'].includes(policy))throw Error('Q-N50-4646-001：formatted攻击技能额外效果标题是否限定属性技能PP0不累加下限');
    if(policy==='attack-only')return;
  }
  const token=c.round+':'+c.m.id+':'+c.effectUseCount();if(c.a.soulState.clockFloorToken1846===token)return;
  c.a.soulState.clockFloorToken1846=token;
  const before=c.a.soulState.clockFloor1846??0;c.a.soulState.clockFloor1846=Math.min(600,before+150);
  (c.a.soulState.clockFloorEvents1846??=[]).push({round:c.round,move:c.m.id,use:c.effectUseCount(),pp:0,before,after:c.a.soulState.clockFloor1846});
}
function resolveFloorConflict1846(c){const floor=c.a.soulState.clockFloor1846??0;if(!floor||!(c.amount>0)||!(c.cap<floor)||c.ignoreLimit)return c.amount;
  const policy=c.a.soulState.qualifiedFloorCap1846;
  if(policy==='cap-priority')return c.amount;
  if(policy==='floor-priority')return Math.max(c.amount,floor);
  const err=Error('Q-N50-4646-002：1846已授伤害下限与真实较低攻击上限同时成立优先关系待确认');
  err.clockFloorConflict1846={round:c.round,move:c.m.id,floor,cap:c.cap,beforeHP:c.t.hp,pp:c.a.pp[c.m.id],postCapDamage:c.amount};throw err;
}
module.exports={name:'时钟试炼官·极',sourceHash:'ddacacad',partial:true,unimplemented:['Q-N50-4646-001：标题作用域/属性技能PP0是否累加下限','Q-N50-4646-002：下限与更低真实硬封顶的优先关系'],traits:{
  attackReduction:f=>f.soulState.clockFrame1846?.low?.3:0,
  ignorePP:f=>f.soulState.clockFreePPRound1846===f.soulState.calculationRound,
  minimumAttackDamage:f=>f.soulState.clockFloor1846??0
},abilities:{floor:c=>c.a.soulState.clockFloor1846??0,resolveFloorConflict:resolveFloorConflict1846,guardMixedImmunity:guardMixedImmunity1846},hooks:{
  roundStart:frame1846,
  opponentPriority(c){if(c.a.soulState.clockFrame1846?.round===c.round&&c.a.soulState.clockFrame1846.high)c.priority-=1;},
  beforeAilment:beforeAilment1846,
  afterAttack(c){if(c.settledDamage>300)c.a.soulState.clockFreePPRound1846=c.round+1;},
  afterUse:endUsed1846
}};
