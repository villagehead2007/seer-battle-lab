(()=>{'use strict';
function memory1868(c){return c.a.soulState.rebirth1868??(c.a.soulState.rebirth1868={sourceHash:'6b41a90d'});}
registry[1868]={name:'重塑之子·利塞特',sourceHash:'6b41a90d',partial:true,traits:{},unimplemented:['Q-N50-4665-001：完整0伤是否触发低于300','Q-N50-4514-001：技能无效是否包含MISS/命中效果失效/免攻'],hooks:{
battleStart:memory1868,
afterAttack(c){if(c.a.hp<=0)return;const n=c.settledDamage??c.dealt;if(n===0){const p=c.a.soulState.qualified1868Zero;if(!['trigger','skip'].includes(p))throw Error('Q-N50-4665-001：完整结算0是否触发造成攻击伤害低于300待确认');if(p==='skip')return;}if(n<300&&c.t.hp>0)c.timed(c.t,'statusBlock',2,{});if(n>300)c.timed(c.a,'攻击伤害免疫',2,{});(memory1868(c).thresholds??=[]).push({round:c.round,damage:n,branch:n<300?'below':n>300?'above':'equal'});},
opponentAfterUse(c){if(!c.actualUsed)return;const reason=c.invalidReason??{},known=!!reason.blocked,ambiguous=!known&&(!!(reason.miss||reason.blind||reason.forcedMiss||reason.evaded)||!!c.hitEffectsDisabled||c.m?.kind!=='status'&&c.attackDamage===0&&!c.payloadAllowed);memory1868(c).opponent={round:c.round,knownInvalid:known,ambiguous,move:c.m.wikiId??c.m.id,reason};},
roundStart(c){const e=memory1868(c).opponent;if(!e||e.round!==c.round-1)return;let trigger=e.knownInvalid;if(e.ambiguous){const p=c.a.soulState.qualified1868Invalid;if(!['invalid','not-invalid'].includes(p))throw Error('Q-N50-4514-001：1868上轮MISS/命中效果失效/免攻是否技能无效待确认');trigger=p==='invalid';}if(trigger){const applied=c.ailment(c.a,'狂暴',c.a);(memory1868(c).rages??=[]).push({round:c.round,applied:!!applied});}},
beforeDamage(c){if((c.a.ailments['狂暴']??0)>=c.round)c.modifier*=1.5;}
}};
})();
