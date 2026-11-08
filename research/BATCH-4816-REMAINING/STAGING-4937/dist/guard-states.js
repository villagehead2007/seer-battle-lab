(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BattleGuardStates=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
// Separate from the older blue/gold/black scales: these sourced guards have
// different removal reactions. State records contain data, never callbacks.
const names={red:'红色龙鳞',yellow:'黄色龙鳞',blue:'蓝色龙鳞',white:'白色龙鳞'};
function state(f,key,round){const e=f.soulState?.royalGuards?.[key];return e&&e.start<=round&&(e.untilRemoved||e.end>=round)?e:null;}
function grant(f,key,round,source,{turns=null,start=round}={}){if(!Object.hasOwn(names,key)||!source?.revision||!Number.isInteger(round)||!Number.isInteger(start)||start<round||turns!==null&&(!Number.isInteger(turns)||turns<1))throw Error('守护状态/时限/来源无效');if(key!=='white'&&f.soulState?.royalGuards?.white)return null;const old=state(f,key,round),e={key,name:names[key],start,source:old?.source??{...source},lastGrantSource:{...source},...(turns===null?{untilRemoved:true}:{end:start+turns-1})};if(key==='white')for(const color of ['red','yellow','blue'])remove(f,color);(f.soulState.royalGuards??={})[key]=e;return e;}
function remove(f,key){const e=f.soulState?.royalGuards?.[key];if(e)delete f.soulState.royalGuards[key];return e;}
const colored=family=>family==='ailment'?'yellow':family==='weakness'?'blue':'red';
function available(f,family,round){return !!(state(f,colored(family),round)||state(f,'white',round)||family==='attack'&&Number.isInteger(round)&&f.soulState?.royalRedImmuneRound===round);}
function applied(c,family){if(c.a.hp<=0)return;const color=colored(family),one=state(c.a,color,c.round),white=state(c.a,'white',c.round);if(c.otherImmunity)return;if(white){const st=c.a.soulState;if(st.royalWhiteRound!==c.round){st.royalWhiteRound=c.round;st.royalWhiteSuccess={};}st.royalWhiteSuccess[family]=true;return;}if(!one)return;if(family==='attack')c.a.soulState.royalRedImmuneRound=c.round;remove(c.a,color);c.emit?.(names[color]+' 成功免疫后消失。');const target=c.opponent??c.t;if(color==='red')c.clear(target);else if(color==='yellow')c.clearBoost(target);else{c.consumeShields(target,c.a);c.consumeBarrier(target);}}
function trait(f,key,round){if(key==='pinkImmune'&&available(f,'fixed',round))return true;if(key==='pinkImmunityLabel'&&available(f,'fixed',round))return state(f,'white',round)?'白色龙鳞':'红色龙鳞';}
function run(event,c,intrinsic=()=>undefined){const f=c.a,st=f.soulState;if(!st)return;
 if(event==='beforeIncomingAttack'&&available(f,'attack',c.round)&&!c.attackImmunityIgnored){if(!c.immuneAttack){c.immuneAttack=true;c.guardImmunity=true;}}
 if(event==='overlappingDamageImmunities')return;
 if(event==='attackImmunityApplied'&&c.amount>0&&available(f,'attack',c.round)&&c.resourceGuard)applied(c,'attack');
 if(event==='pinkImmunityApplied'&&c.amount>0&&available(f,c.type,c.round)){applied({...c,otherImmunity:!!c.otherImmunity||!!intrinsic('pinkImmune')},c.type);}
 if(event==='beforeAilment'&&available(f,'ailment',c.round)&&!c.blocked&&!(f.counts?.immune>0)){applied(c,'ailment');c.blocked=true;c.guardImmunityHandled=true;}
 if(event==='otherAilmentImmunity')return;
 if(event==='beforeStageChange'&&c.delta<0&&!c.blocked&&available(f,'weakness',c.round)){applied(c,'weakness');c.blocked=true;}
 if(event==='otherWeaknessImmunity')return;
 if(event==='beforeDamage'&&(st.guardAttackRewards>0||Number.isInteger(c.round)&&st.guardAttackBoostRound===c.round))c.modifier*=2;
 if(event==='afterUse'&&(c.actionAttackDamage??0)>0&&st.guardAttackRewards>0&&st.guardAttackBoostRound!==c.round){st.guardAttackRewards--;st.guardAttackBoostRound=c.round;}
 if(event==='combatEnd'&&f.hp>0&&state(f,'white',c.round)&&st.royalWhiteRound===c.round){const done=st.royalWhiteSuccess??{};if(done.attack)st.guardAttackRewards=(st.guardAttackRewards??0)+1;if(done.fixed&&c.t.hp>0)c.hurt(c.t,300,'白色龙鳞固定反应','fixed');if(done.percent&&c.t.hp>0)c.hurt(c.t,f.stats.maxHp*.3,'白色龙鳞百分比反应','percent');if(done.ailment&&c.t.hp>0)c.randomFromSharedPool(2,true);if(done.weakness&&c.t.hp>0)c.stage(c.t,-2);}
 if(event==='afterStateExpiry'&&f.hp>0){const white=f.soulState.royalGuards?.white;if(white?.end<=c.round)disappearWhite(c);}
 if(event==='battlePhaseEnd'&&f.hp>0&&st.royalScaleContract?.armed&&!st.royalScaleContract.whiteIssued&&['red','yellow','blue'].every(k=>!state(f,k,c.round))){st.royalScaleContract.whiteIssued=true;st.royalScaleContract.unlocked=true;grant(f,'white',c.round,st.royalScaleContract.source,{turns:3,start:c.round+1});}
}
function disappearWhite(c){const removed=remove(c.a,'white');if(!removed)return false;c.clear(c.t);c.clearBoost(c.t);c.consumeShields(c.t,c.a);c.consumeBarrier(c.t);return true;}
function describe(f,round){return Object.entries(names).flatMap(([k,n])=>{const e=state(f,k,round);return e?[n+(e.end?' · 余 '+(e.end-round+1)+' 回合':'')]:[];});}
return Object.freeze({state,grant,remove,available,applied,trait,run,describe,disappearWhite,names:Object.freeze(names)});
});
