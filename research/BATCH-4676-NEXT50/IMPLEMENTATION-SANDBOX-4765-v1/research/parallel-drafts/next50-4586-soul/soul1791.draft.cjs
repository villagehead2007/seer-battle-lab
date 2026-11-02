'use strict';
const healthRules=require('../../../dist/health-rules.js');
const slot1791=(c,m=c.m)=>m?c.a.moves.indexOf(m.id)+1:0;
function count1791(c){return c.a.soulState.emptyVerses1791??0;}
function grant1791(c,n){if(!Number.isInteger(n)||n<0)throw Error('空妄诗章须非负整数');return c.a.soulState.emptyVerses1791=count1791(c)+n;}
function ensure1791(c,n){if(!Number.isInteger(n)||n<0)throw Error('诗章补足目标须非负整数');const add=Math.max(0,n-count1791(c));grant1791(c,add);return add;}
function clearThird1791(c,eligible){if(eligible)c.clearAilments(c.a);}
function fourth1791(c){if(c.a.hp<=0)return;healthRules.drainPercent(c,c.t.stats.maxHp*.4,'空元卌铭文吸取','空元卌铭文回复');c.t.soulState.emptyNextAttackOutput1791=.4;}
function fifth1791(c,repeatMode=null){if(c.a.hp<=0)return;const prior=c.a.soulState.emptyFifthWins1791??0;if(prior&&!['refresh','stack'].includes(repeatMode))throw Error('Q-N50-4586-007：卪铭文再次击败的永久攻增/减重复叠加规则未确认');c.reduceMaxHp(c.a,c.a.stats.maxHp*.2,'空元卪铭文降低自身上限');c.a.soulState.emptyFifthWins1791=repeatMode==='refresh'?1:prior+1;}
function fatal1791(c){
 const st=c.a.soulState;if(c.a.hp<=0||!(c.amount>0))return;
 if(st.emptyPreserveRound1791===c.round){c.hpFloor=Math.max(c.hpFloor??0,1);return;}
 if(st.emptyProfane1791||c.amount<c.a.hp)return;
 st.emptyProfane1791=true;st.emptyVerses1791=0;st.emptyPreserveRound1791=c.round;c.hpFloor=Math.max(c.hpFloor??0,1);c.clearAilments(c.a);
}
function poem1791(c,options={}){
 if(c.a.hp<=0)return {performed:false,reason:'dead'};
 const move=options.move??c.m;if(!move||!Array.isArray(move.operations))return {performed:false,reason:'no-poem'};
 const outcome=options.outcome??{},patch={...(options.contextPatch??{}),...(options.qualifiedLifecycle&&options.poemEffectEnabled===true?{hitEffectsDisabled:false}:null)};
 if(options.poemEffectEnabled===false)return {performed:false,reason:'poem-disabled'};
 const free=!!c.a.soulState.emptyProfane1791;if(!free&&count1791(c)<1)return {performed:false,reason:'no-verses'};
 const entries=c.poemEntries1791(move,outcome,patch);if(!entries.length)return {performed:false,reason:'condition-false'};
 if(options.poemEffectEnabled!==true||!options.qualifiedLifecycle)throw Error('Q-N50-4586-001：空元之诗额外行动载荷/结束时点/递归生命周期未确认');
 const before=count1791(c);if(!free)c.a.soulState.emptyVerses1791=before-1;
 const event={round:c.round,moveId:move.wikiId??move.id,moveKey:move.id,sourceRevision:move.revision,poemIds:entries.map(x=>x.effectId),free,cost:free?0:1,before,after:count1791(c),qualifiedLifecycle:true};
 (c.a.soulState.emptyPoemEvents1791??=[]).push(event);c.executePoem1791(move,outcome,patch);return {performed:true,...event};
}
function naturalEnd1791(c,ownerAction){
 if(c.a.hp<=0)return;
 const move=c.selectedMove(c.a),saved=c.a.soulState.emptyOwnOutcome1791;
 const outcome=saved?.round===c.round&&saved.moveKey===move.id?saved.outcome:{pendingOwnAction:true};
 if(outcome.pendingOwnAction&&(count1791(c)>0||c.a.soulState.emptyProfane1791)&&move.operations?.some(op=>op.phase==='poem1791'))throw Error('Q-N50-4586-001：自己或双方未完成原动作时的诗行动结束调度未确认');
 poem1791(c,{move,outcome,contextPatch:{first:c.first,actionOwnerSide:ownerAction?c.a.side:c.t.side}});
}
module.exports={name:'空元行者',sourceHash:'e1c0f316',partial:true,unimplemented:['Q-N50-4586-001：诗额外行动完整生命周期','Q-N50-4586-002：乂铭文的选择条件','Q-N50-4586-003：致死后maxHP<=200削减边界','Q-N50-4586-007：卪永久增减伤再次触发的叠加规则'],
 traits:{secondSlotIgnorePP:true,skillPriority:f=>f.soulState.emptySelectedSlot1791===1?1:0,ailmentImmune:f=>f.soulState.emptyPreserveRound1791===f.soulState.calculationRound&&Number.isInteger(f.soulState.emptyPreserveRound1791),attackMultiplier:f=>1+.1*(f.soulState.emptyFifthWins1791??0),attackReduction:f=>Math.min(1,.1*(f.soulState.emptyFifthWins1791??0))},
 abilities:{verseCount:count1791,grantVerses:grant1791,ensureVerses:ensure1791,qualifiedThird:clearThird1791,qualifiedFourth:fourth1791,qualifiedFifth:fifth1791,attemptPoem:poem1791},
 deferred:['空元之录：自身存活于出战背包时，双方已阵亡且不在场精灵消逝，转1篇空妄诗章，并按该精灵因此减少的最大HP10%增加自身上限，每次上限自身maxHP10%。需要真实背包/场下死亡/消逝精灵身份和上限；自身普通技能获诗、致死解锁免费诗、所有铭文及当前诗载荷不延期。'],
 hooks:{choiceLocked(c){const slot=slot1791(c);c.a.soulState.emptySelectedSlot1791=slot;if(slot===1){c.a.soulState.ignoreOwnWeakThis=true;c.a.soulState.ignoreTargetBoostWhenActingRound=c.round;}},
 roundStart(c){if(c.a.soulState.emptySelectedSlot1791===3)c.clearAilments(c.a);else if(Object.values(c.a.ailments).some(end=>end>=c.round))throw Error('Q-N50-4586-002：未选择槽3时乂铭文是否仍解除异常待确认');},
 beforeFatalDamage:fatal1791,
 afterHit(c){if(slot1791(c)===2&&c.a.hp>0)c.absorbPP(c.a,c.t,1);},
 afterUse(c){if(slot1791(c)===4)fourth1791(c);c.a.soulState.emptyOwnOutcome1791={round:c.round,moveKey:c.m.id,outcome:{successful:c.successful===true,invalid:c.invalidReason?.blocked===true,invalidReason:c.invalidReason??null,miss:!!(c.invalidReason?.miss||c.invalidReason?.blind||c.invalidReason?.forcedMiss||c.invalidReason?.evaded)}};},
 opponentDefeated(c){if(c.fromActualSkill1791&&slot1791(c)===5)fifth1791(c);},
 actionEnd(c){naturalEnd1791(c,true);},opponentActionEnd(c){naturalEnd1791(c,false);},
 roundEnd(c){if(!c.a.soulState.emptyProfane1791||c.a.hp<=0)return;if(c.a.stats.maxHp<=200)throw Error('Q-N50-4586-003：空元之渎200上限削减至0/底1/死亡规则待确认');c.reduceMaxHp(c.a,200,'空元之渎每回合削减');}}};
