'use strict';

const mark1847=(f,r)=>{const e=f.soulState.starEntangle1847;return e?.sourceHash==='5521fbf2'&&e.start<=r&&e.end>=r?e:null;};
function grant1847(c,target=c.t){const previous=mark1847(target,c.round);target.soulState.starEntangle1847={start:c.round,end:Math.max(previous?.end??0,c.round+2),sourceSide:c.a.side,sourceHash:'5521fbf2'};return{...target.soulState.starEntangle1847};}
function received1847(c){const e=mark1847(c.t,c.round);if(!e||!(c.settledDamage>0))return;
  const nominalPercent=c.settledDamage*.5,hpBefore=c.t.hp,percentLoss=c.hurt(c.t,nominalPercent,'星芳之缠附加百分比','percent');
  const holderOpponentFire=c.isFireType1847(c.a),publisherOpponentFire=c.isFireType1847(c.t),policy=c.a.soulState.qualifiedStarFireView1847;
  let fire;if(holderOpponentFire===publisherOpponentFire)fire=holderOpponentFire;else if(policy==='holder-opponent')fire=holderOpponentFire;else if(policy==='publisher-opponent')fire=publisherOpponentFire;else{const err=Error('Q-N50-4647-001：星芳之缠对手为火系的状态拥有者或施加者视角待确认');err.starFireView1847={round:c.round,sourceSide:e.sourceSide,attackerType:c.a.type,holderType:c.t.type,holderOpponentFire,publisherOpponentFire,settledDamage:c.settledDamage,hpBefore,percentLoss,hpAfterPercent:c.t.hp,attackerPP:c.a.pp[c.m.id],mark:{...e}};throw err;}
  let trueLoss=0;if(fire){delete c.t.soulState.starEntangle1847;trueLoss=c.hurt(c.t,c.settledDamage,'星芳之缠火系额外真实','true');}
  (c.a.soulState.starEntangleEvents1847??=[]).push({round:c.round,move:c.m.id,holderSide:c.t.side,settledDamage:c.settledDamage,nominalPercent,percentLoss,fire,policy:policy??'common',trueNominal:fire?c.settledDamage:0,trueLoss,hpBefore,hpAfter:c.t.hp});
}
module.exports={name:'星光·丽莎布布',sourceHash:'5521fbf2',partial:true,unimplemented:['Q-N50-4647-001：星芳之缠对手为火系视角'],deferred:['每次登场的真实再次上场触发：仅换宠/再入场调度延期，初次登场与当前双方所有星芳分支单精灵'],traits:{attackReduction:f=>f.soulState.starRound1847?.high?.5:0},abilities:{
  grantEntangle:grant1847,hasEntangle:(c,target=c.t)=>!!mark1847(target,c.round),receivedAttack:received1847,
  outgoingMultiplier(c){return mark1847(c.a,c.round)?.sourceHash==='5521fbf2'?.5:1;}
},hooks:{
  battleStart(c){if(c.typeEffectiveness(c.a.type,c.t.type)>1)grant1847(c);},
  roundStart(c){c.a.soulState.starRound1847={round:c.round,high:c.a.hp>c.t.hp,low:c.a.hp<c.t.hp};},
  afterUse(c){if(['physical','special'].includes(c.m?.kind))grant1847(c);},
  roundEnd(c){if(c.a.soulState.starRound1847?.round===c.round&&c.a.soulState.starRound1847.low&&c.a.hp>0)c.heal(c.a,c.a.stats.maxHp*.35,'星芳低HP回末回复');}
}};

