'use strict';
// STATIC ONLY: no test execution authorized yet. Pure resource API is separately frozen.
const base=require('./frozen-resource1845-v1.cjs'),count=c=>base.abilities.constructionCount(c),mode=c=>base.abilities.mode(c);
function snapshot1845(c){const n=count(c);c.a.soulState.constructionRound1845={round:c.round,count:n,missing:4-n,mode:mode(c)};}
function extraAction1845(c,policy=c.a.soulState.qualifiedExtra1845){
  if(c.a.hp<=0)return{performed:false,reason:'owner-dead'};
  const state=mode(c);
  if(state==='guard'){
    const paralysis=c.ailment(c.t,'麻痹',c.a,false,false,null,{probabilityPercent:100,origin:'soul'});
    const existing=c.a.suitState?.shield??0;
    if(existing>0&&!['add','replace','maximum'].includes(policy?.shield))throw Error('Q-N50-4600-005：1845守备300盾与真实已有普通盾的同源/多源重授待确认');
    if(policy?.shield==='replace')c.a.suitState.shield=300;
    else if(policy?.shield==='maximum')c.a.suitState.shield=Math.max(existing,300);
    else c.addShield(c.a,300);
    return{performed:true,state,paralysis,shieldBefore:existing,shieldAfter:c.a.suitState.shield};
  }
  const candidates=['电','机械','电机械'].map(type=>({type,multiplier:c.typeAffinity(type,c.t.type)})),maximum=Math.max(...candidates.map(x=>x.multiplier)),best=candidates.filter(x=>x.multiplier===maximum);
  if(policy?.typed!=='independent-typed')throw Error('Q-N50-4586-006：1845核威强袭以最高克制系别造成300的独立通道/防御暴击/减免待确认');
  const selected=best.find(x=>x.type===policy.type)??best[0];
  c.a.soulState.extraResolving1845={round:c.round,move:c.m?.id,use:c.effectUseCount(),beforeHP:c.t.hp,state};
  let hpLoss;try{hpLoss=c.typedSoulAttack1845(300,selected.type);}finally{delete c.a.soulState.extraResolving1845;}
  return{performed:true,state,candidates,best,type:selected.type,nominal:300,hpLoss,qualified:true};
}
function endRestore1845(c){
  const e=c.a.soulState.constructionRound1845;if(c.a.hp<=0||e?.round!==c.round||e.mode!=='guard')return;
  const moves=c.a.moves.filter(k=>['physical','special'].includes(c.moveKind(k))),policy=c.a.soulState.qualifiedGuardPP1845;
  if(!['once','per-missing'].includes(policy)&&moves.some(k=>c.maxPP(k)-c.a.pp[k]>1))throw Error('Q-N50-4644-001：每空缺构造是否也使回末攻击PP恢复按空缺数累加');
  const amount=policy==='per-missing'?e.missing:1;
  const rows=c.restorePP({...c.a,moves},amount,'soul');
  (c.a.soulState.constructPPRestores1845??=[]).push({round:c.round,missing:e.missing,policy:policy??'common-cap-at-most-one',amount,rows});
}
module.exports={...base,name:'克雷弗德',partial:true,unimplemented:['Q-N50-4644-001：守备PP每空缺作用域','Q-N50-4586-006：核威强袭300系别伤害核算','Q-N50-4600-005：守备300普通盾重授'],deferred:['构造数下场重置：仅真实下场与再次登场流程延期；当前自身构造收集、守备/激发和额外行动全部单体'],traits:{
  attackReduction:f=>f.soulState.constructionRound1845?.mode==='guard'?f.soulState.constructionRound1845.missing*.1:0,
  attackPriority:f=>f.soulState.constructionRound1845?.mode==='active'?1:0
},abilities:{...base.abilities,extraAction:extraAction1845},hooks:{
  battleStart:base.hooks.battleStart,
  roundStart:snapshot1845,
  beforeDamage(c){const e=c.a.soulState.constructionRound1845;if(e?.round===c.round&&e.mode==='active')c.modifier*=1+e.count*.15;},
  actionSkipped(c){if(c.m&&c.m.kind!=='item')c.a.soulState.constructSkipped1845={round:c.round,move:c.m.id,reason:c.reason};},
  actionEnd(c){const e=c.a.soulState.constructSkipped1845;if(e?.round!==c.round||e.move!==c.m?.id)return;delete c.a.soulState.constructSkipped1845;const event=extraAction1845(c);(c.a.soulState.constructExtraEvents1845??=[]).push({round:c.round,reason:e.reason,...event});},
  roundEnd:endRestore1845
}};
