'use strict';
// Static only, untested. Natural lethal lifecycle is deliberately not guessed.
const soak1848=(f,r)=>{const e=f.soulState.starSoak1848;return e?.sourceHash==='206637ec'&&e.start<=r&&e.end>=r?e:null;};
function grant1848(c,target=c.t){const old=soak1848(target,c.round);target.soulState.starSoak1848={start:c.round,end:Math.max(old?.end??0,c.round+2),sourceSide:c.a.side,sourceHash:'206637ec'};return{...target.soulState.starSoak1848};}
function received1848(c){const mark=soak1848(c.t,c.round);if(!mark||!(c.settledDamage>0))return;const n=c.settledDamage,hpBefore=c.t.hp,percentLoss=c.hurt(c.t,n*.5,'星海之浸附加百分比','percent'),holderOpponentGrass=c.isGrassType1848(c.a),publisherOpponentGrass=c.isGrassType1848(c.t),policy=c.a.soulState.qualifiedStarGrassView1848;
  let grass;if(holderOpponentGrass===publisherOpponentGrass)grass=holderOpponentGrass;else if(policy==='holder-opponent')grass=holderOpponentGrass;else if(policy==='publisher-opponent')grass=publisherOpponentGrass;else{const error=Error('Q-N50-4647-001：1848星海之浸对手为草系的视角待确认');error.starGrassView1848={round:c.round,attackerType:c.a.type,holderType:c.t.type,holderOpponentGrass,publisherOpponentGrass,settledDamage:n,hpBefore,percentLoss,hpAfterPercent:c.t.hp,pp:c.a.pp[c.m.id],mark:{...mark}};throw error;}
  let trueLoss=0;if(grass){delete c.t.soulState.starSoak1848;trueLoss=c.hurt(c.t,n,'星海之浸草系额外真实','true');}(c.a.soulState.starSoakEvents1848??=[]).push({round:c.round,move:c.m.id,settledDamage:n,nominalPercent:n*.5,percentLoss,grass,trueNominal:grass?n:0,trueLoss,hpBefore,hpAfter:c.t.hp});
}
function payload1848(c,qualification){if(!qualification?.confirmedLethalPayload)throw Error('1848致死载荷须明确研究输入，不能冒充自然死亡时序');
  if(c.a.level!==100||c.a.soulState.starLethalUsed1848)return{performed:false,reason:c.a.level!==100?'not-level100':'already-used'};
  if(c.a.hp<=0&&!qualification.explicitZeroHPRecovery)throw Error('1848实际HP0回复时序未确认');
  c.a.soulState.starLethalUsed1848=true;
  const clearBoost=c.clearBoost(c.t),clearRound=c.clear(c.t),hpBefore=c.a.hp,ppBefore={...c.a.pp};
  if(c.a.hp<=0)c.qualifiedZeroHeal1848(c.a,c.a.stats.maxHp);else c.heal(c.a,c.a.stats.maxHp,'星海限1次恢复全部体力');
  const ppRows=c.restorePP(c.a,Infinity,'soul'),amount=c.a.hp,shieldBefore=c.a.suitState.shield??0,barrierBefore=c.a.suitState.barrier??0,policy=c.a.soulState.qualifiedStarShields1848;
  if((shieldBefore>0||barrierBefore>0)&&!['add','replace','maximum'].includes(policy)){const error=Error('Q-N50-4600-005：1848一次致死回复后按当前HP授盾罩与真实既有来源重授关系');error.starShields1848={round:c.round,amount,hpBefore,hpAfter:c.a.hp,ppBefore,ppAfter:{...c.a.pp},shieldBefore,barrierBefore,clearBoost,clearRound};throw error;}
  if(policy==='replace'){c.a.suitState.shield=amount;c.a.suitState.barrier=amount;}else if(policy==='maximum'){c.a.suitState.shield=Math.max(shieldBefore,amount);c.a.suitState.barrier=Math.max(barrierBefore,amount);}else{c.addShield(c.a,amount);c.addBarrier(c.a,amount);}
  const e={round:c.round,clearBoost,clearRound,hpBefore,hpAfter:c.a.hp,ppBefore,ppAfter:{...c.a.pp},ppRows,amount,shieldBefore,barrierBefore,shieldAfter:c.a.suitState.shield,barrierAfter:c.a.suitState.barrier,qualified:true};(c.a.soulState.starLethalEvents1848??=[]).push(e);return{performed:true,...e};
}
function beginFatal1848(c){if(c.a.level!==100||c.a.soulState.starLethalUsed1848||c.a.hp<=0||!(c.amount>c.a.hp))return;
 c.a.soulState.starPendingLethal1848={round:c.round,amount:c.amount,type:c.type,hpBefore:c.a.hp,policy:c.a.soulState.qualifiedStarLethalPhase1848??null};
}
function finishFatal1848(c,phase){const e=c.a.soulState.starPendingLethal1848;if(!e||e.round!==c.round)return;
 if(c.a.hp>0){if(phase!=='before-death')return;delete c.a.soulState.starPendingLethal1848;const result=payload1848(c,{confirmedLethalPayload:true});(c.a.soulState.starLethalLifecycles1848??=[]).push({...e,phase:'common-survived-positive-lethal',hpLoss:c.hpLoss,deathRound:null,hpAfter:c.a.hp,result});return;}
 if(!['before-death','after-death'].includes(e.policy)){const error=Error('Q-N50-4648-001：1848受到致死伤害时恢复与死亡结算先后待确认');error.starLethal1848={...e,hpAfterDamage:c.a.hp,hpLoss:c.hpLoss,pp:{...c.a.pp},used:!!c.a.soulState.starLethalUsed1848};throw error;}
 if(phase!==e.policy)return;delete c.a.soulState.starPendingLethal1848;
 let result;if(e.policy==='before-death')c.a.soulState.starRecoveringBeforeDeath1848={round:c.round};
 try{result=payload1848(c,{confirmedLethalPayload:true,explicitZeroHPRecovery:true});}finally{delete c.a.soulState.starRecoveringBeforeDeath1848;}
 if(e.policy==='after-death'&&c.a.hp>0)c.a.soulState.deathResolved=false;
 (c.a.soulState.starLethalLifecycles1848??=[]).push({...e,phase,hpLoss:c.hpLoss,deathRound:c.a.soulState.lastDefeatRound??null,hpAfter:c.a.hp,result});
}
module.exports={name:'星光·鲁斯王',sourceHash:'206637ec',partial:true,unimplemented:['Q-N50-4647-001：星海草系视角','Q-N50-4648-001：致死一次完整结算顺序','Q-N50-4600-005：真实既有盾罩重授'],deferred:['每次登场的再次上场天敌附星海：仅真实换宠/再入场调度延期；当前初登场和在场标记自身分支立即做'],traits:{},abilities:{
  grantSoak:grant1848,hasSoak:(c,target=c.t)=>!!soak1848(target,c.round),receivedAttack:received1848,
  statusBlocked(c){return c.m?.kind==='status'&&!!soak1848(c.a,c.round);},qualifiedLethalPayload:payload1848,finishFatal:finishFatal1848
},hooks:{battleStart(c){if(c.typeEffectiveness(c.a.type,c.t.type)>1)grant1848(c);},beforeCrit(c){c.forceCrit=true;},beforeFatalDamage:beginFatal1848,afterUse(c){if(['physical','special'].includes(c.m?.kind))grant1848(c);}}};

