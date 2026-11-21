(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SpMarsRules = factory();
})(globalThis, function() {
'use strict';

const FORMS = Object.freeze(['wall','swift','ruin']);
const BODY_STATS = Object.freeze({wall:['def','spd'],swift:['spe'],ruin:['spa']});
const SOUL_ID=20001;
const SPEC_HASH='52a98c968378fe1370f87349a33a149827f4ff1980c91a7c278e2408cb9b3d13';
const SOURCE_HASH='c5257459b91fe7e55ff62f84b34dad6bafb2f219839673a0dbba76c899bb9a3b';
const MOVES=Object.freeze({fifth:2000101,verdict:2000102,intercept:2000103,overdrive:2000104,rampart:2000105});
const FIFTH_KEY='wiki:'+MOVES.fifth;
const LABELS=Object.freeze({wall:'坚壁',swift:'极速',ruin:'毁灭'});
const BASE=Object.freeze({atk:80,spa:150,def:121,spd:121,spe:136,maxHp:182});
const SHIELD_SOURCE='custom:20001:wall';
const WALL={leadReduction:.4,reserveReduction:.2,leadShieldCap:400,reserveShieldCap:300,
  emergencyBelow:[1,3],emergencyBattleUses:1,emergencyGuardRounds:1,emergencyHeal:[1,3]};
const GUARD_TYPES=['attack','fixed','percent'];

function validSource(snapshot) {
  return snapshot.id===20001&&snapshot.source?.provider==='user-original'&&
    snapshot.source.sourceHash===SOURCE_HASH&&snapshot.source.specHash===SPEC_HASH&&
    snapshot.source.revision==='draft-v1.4'&&snapshot.type==='机械'&&
    Object.keys(BASE).every(k=>snapshot.base?.[k]===BASE[k])&&
    snapshot.souls?.length===1&&snapshot.souls[0].id===SOUL_ID&&snapshot.souls[0].hash===SPEC_HASH;
}

function owns(f) { return f.soulId===SOUL_ID&&f.soulHash===SPEC_HASH; }

function legalForms(f) {
  if(!owns(f)||f.hp<=0)return [];
  const state=f.soulState.spMars;
  return state ? FORMS.filter(form=>form===state.lead||state.bodies[form].hp>0) : FORMS.slice();
}

function projectedBody(f,round) {
  if(!owns(f))return null;
  const state=f.soulState.spMars,pending=state?.pending;
  if(pending?.round<=round&&pending.form!==state.lead&&state.bodies[pending.form].hp>0)
    return state.bodies[pending.form];
  return null;
}

function fifthForm(f, choice, round=f.soulState?.calculationRound??1) {
  const selected=typeof choice==='string'&&choice.startsWith('sp-mars-fifth:')?choice.slice('sp-mars-fifth:'.length):
    choice?.move===FIFTH_KEY?choice.form:null;
  if(selected&&legalForms(f).includes(selected))return selected;
  if(choice===FIFTH_KEY&&owns(f))return projectedBody(f,round)?f.soulState.spMars.pending.form:f.soulState.spMars?.lead??'wall';
  return null;
}

const choiceKey=form=>'sp-mars-fifth:'+form;

function initialize(fighter) {
  if (fighter.soulState.spMars) return fighter.soulState.spMars;
  const bodies = Object.fromEntries(FORMS.map(form => [form,{hp:fighter.stats.maxHp,pp:{...fighter.pp}}]));
  return (fighter.soulState.spMars = {
    lead:'wall', bodies, activeBonus:{}, linger:{}, allLead:null, pending:null,
    wallDamage:[], wallCover:0, firstSwiftUseAvailable:false,
  });
}

function liveForm(fighter, form) {
  const {lead,bodies} = initialize(fighter);
  return (form === lead ? fighter.hp : bodies[form]?.hp ?? 0)>0;
}

function effectsActive(fighter, form, round) {
  const state=initialize(fighter);
  return state.lead===form||state.linger[form]>=round||state.allLead?.round===round;
}

function leading(f,form,round) {
  const inherited=f.soulState?.spMarsInheritance;
  return f.hp>0&&(owns(f)&&effectsActive(f,form,round)||inherited?.form===form&&inherited.layers>0);
}

function main(f,form,round){
  const state=initialize(f);
  return state.lead===form||state.allLead?.round===round;
}

function spareActive(f,form,round) {
  return owns(f)&&(liveForm(f,form)||initialize(f).allLead?.round===round);
}

function panelBonus(f,key,round) {
  if(!owns(f))return 0;
  const state=f.soulState.spMars;
  return (state?.allLead?.round===round?state.allLead.bonus[key]:state?.activeBonus[key])??0;
}

function mark2Layers(f,round) {
  const mark=f.soulState?.spMarsMark2;
  return mark?.end>=round?mark.layers:0;
}

function mark2(f,round,stacking) {
  if(f.hp<=0||f.soulState.spMarsMark2Blocked>=round)return;
  const previous=mark2Layers(f,round);
  f.soulState.spMarsMark2={layers:Math.min(2,stacking?previous+1:Math.max(1,previous)),end:round+1};
}

function mark1(f) {
  const st=initialize(f);
  st.mark1=Math.min(3,(st.mark1??0)+1);
}

function shieldBonus(stats, form, shield, capRatio) {
  return Object.fromEntries(BODY_STATS[form].map(key=>[key,Math.max(0,Math.min(shield,Math.floor(stats[key]*capRatio)))]));
}

function changeLead(fighter, form, {round, shield, lingerRounds=1, capRatio=1}) {
  const state=initialize(fighter);
  if (state.lead===form||!liveForm(fighter,form)) return false;
  const outgoing=state.lead;
  const extra=state.extraLinger??0;
  state.bodies[outgoing]={hp:fighter.hp,pp:{...fighter.pp}};
  state.linger[outgoing]=Math.max(state.linger[outgoing]??0,round+lingerRounds+extra-1);
  delete state.extraLinger;
  state.lead=form;
  fighter.hp=state.bodies[form].hp;
  fighter.pp={...state.bodies[form].pp};
  state.activeBonus=shieldBonus(fighter.stats,form,shield,capRatio);
  state.firstSwiftUseAvailable=form==='swift';
  return true;
}

function promoteOnDeath(fighter, services) {
  if (fighter.hp>0) return false;
  const available=FORMS.find(form=>liveForm(fighter,form));
  return available ? changeLead(fighter,available,services) : false;
}

function selectEntry(fighter, kind, services) {
  const form=kind==='status'?'swift':['physical','special'].includes(kind)?'wall':'ruin';
  return {form,changed:changeLead(fighter,form,services),grantsMark:form==='ruin'};
}

function reserveFifth(fighter, form, round, delay=1) {
  const state=initialize(fighter);
  if (!liveForm(fighter,form)||state.lead===form) return false;
  // Store the reservation before the real-damage cost can retire the current body.
  state.pending={form,round:round+delay};
  return true;
}

function settleFifth(fighter, services) {
  const state=initialize(fighter), pending=state.pending;
  if (!pending||pending.round>services.round) return null;
  state.pending=null;
  if (!liveForm(fighter,pending.form)) return null;
  const changed=changeLead(fighter,pending.form,services);
  return {targetForm:pending.form,changed,reward:true};
}

function reduceWallDamage(fighter, round, type, amount, params) {
  const state=initialize(fighter);
  if ((!liveForm(fighter,'wall')&&state.allLead?.round!==round)||amount<=0||!GUARD_TYPES.includes(type))return amount;
  const primary=effectsActive(fighter,'wall',round);
  const remaining=Math.floor(amount*(1-(primary?params.leadReduction:params.reserveReduction)));
  if (type==='attack')state.wallDamage.push({reduced:amount-remaining,cap:primary?params.leadShieldCap:params.reserveShieldCap});
  else state.wallCover+=amount-remaining;
  return remaining;
}

function settleWallDamage(fighter, currentSourceShield) {
  const state=initialize(fighter);
  let growth=0;
  for(const {reduced,cap} of state.wallDamage)
    growth+=Math.min(reduced,Math.max(0,cap-currentSourceShield-growth));
  const cover=state.wallCover;
  state.wallDamage=[];
  state.wallCover=0;
  return {shield:growth,cover};
}

function ruinRecovery(fighter,round,type,settledDamage,ratio) {
  if (!effectsActive(fighter,'ruin',round)||!['fixed','percent'].includes(type))return 0;
  return Math.max(0,Math.floor(settledDamage*ratio));
}

function armWallEmergency(fighter,round,settings) {
  const state=initialize(fighter);
  const [threshold,thresholdBase]=settings.emergencyBelow;
  if(fighter.hp<=0||(state.emergencyUses??0)>=settings.emergencyBattleUses||
      !effectsActive(fighter,'wall',round)||fighter.hp*thresholdBase>=fighter.stats.maxHp*threshold)return 0;
  state.emergencyUses=(state.emergencyUses??0)+1;
  state.emergencyGuard={start:round+1,end:round+settings.emergencyGuardRounds};
  return Math.floor(fighter.stats.maxHp*settings.emergencyHeal[0]/settings.emergencyHeal[1]);
}

function wallEmergencyBlocks(fighter,round,type,allowedTypes) {
  const guard=initialize(fighter).emergencyGuard;
  return !!guard&&guard.start<=round&&round<=guard.end&&allowedTypes.includes(type);
}

function receiveDamage(f,round,type,amount) {
  if(!owns(f)||!GUARD_TYPES.includes(type)||amount<=0)return amount;
  const st=initialize(f);
  if(wallEmergencyBlocks(f,round,type,GUARD_TYPES))return 0;
  let reduced=amount;
  if(type==='attack'&&st.rampartReductionUntil>=round)reduced=Math.floor(reduced/2);
  if(type!=='attack'&&st.overdriveReductionUntil>=round)reduced=Math.floor(reduced/2);
  if(st.rampartInvalidGuard){st.rampartInvalidGuard=false;reduced=Math.floor(reduced/2);}
  return reduceWallDamage(f,round,type,reduced,WALL);
}

function immuneAttack(f,round,amount){
  if(!owns(f)||amount<=0)return false;
  const st=initialize(f);
  if(wallEmergencyBlocks(f,round,'attack',GUARD_TYPES))return true;
  if(!st.nextAttackImmune)return false;
  st.nextAttackImmune=false;
  return true;
}

function promote(c) {
  if(!owns(c.a))return false;
  const changed=promoteOnDeath(c.a,{round:c.round,shield:c.shieldValue(c.a)});
  if(changed){
    c.emit(c.name(c.a)+' SP 马尔修斯由'+LABELS[initialize(c.a).lead]+'形态接任。');
    if(c.t.hp>0){c.clearBoost(c.t);c.clear(c.t);c.ailment(c.t,'疲惫',c.a);}
  }
  return changed;
}

function chooseEntry(c,kind) {
  const f=c.a;
  if(!owns(f)||initialize(f).interruptRound!==c.round)return;
  delete initialize(f).interruptRound;
  const entry=selectEntry(f,kind,{round:c.round,shield:c.shieldValue(f)});
  if(entry.grantsMark)mark1(f);
  if(entry.changed)c.emit(c.name(f)+' SP 马尔修斯中切由'+LABELS[entry.form]+'形态接任。');
}

function enter(f,round,kind,shield,addShield) {
  if(!owns(f))return;
  const st=initialize(f);
  if(kind==='voluntary'||kind==='expelled'){
    addShield(f,200,'custom:20001:entry');
    st.interruptRound=round;
  }else if(kind==='knockout'&&liveForm(f,'wall')){
    changeLead(f,'wall',{round,shield});
  }
}

function roundEndMarks(f,foe,round){
  const inherited=f.soulState.spMarsInheritance;
  const mark=f.soulState.spMarsMark2;
  if(mark?.end>=round&&leading(foe,'swift',round))mark.end++;
  if(inherited?.layers>0&&--inherited.layers===0)delete f.soulState.spMarsInheritance;
}

function afterWeakness(c){
  if(!leading(c.a,'swift',c.round))return;
  if(c.canRemoveNegative(c.a))c.clearNegative(c.a);
  if(Object.values(c.a.stages).some(n=>n<0)&&c.t.hp>0){
    c.clear(c.t);
    c.spMarsTrueDrain(c.t.stats.maxHp/3,'极速无法解除弱化汲取');
  }
}

function selectedFifth(c,form){
  const {a,t,round:r}=c,st=initialize(a),same=main(a,form,r);
  if(!liveForm(a,form))return;
  if(reserveFifth(a,form,r))c.spMarsCost(a.stats.maxHp/4);
  if(a.hp<=0)return;
  st.fifthUsed={round:r,form};
  if(form==='wall'){
    if(c.shieldValue(a)<=200)c.addShield(a,300,'custom:20001:fifth');
    else st.shieldLockUntil=r;
    if(same)st.nextAttackImmune=true;
  }else if(form==='swift'){
    st.swiftDispel=true;
    if(same)mark2(t,r,true);
  }else{
    if(t.hp>0)c.hurt(t,c.panelStat(a,'spa')*.7,'毁灭异甲同心','fixed');
    st.pierceNext=true;
    if(same)st.doubleNext=true;
  }
}

function beginUse(c,form){
  const {a,t,round:r,m}=c,st=owns(a)?initialize(a):null;
  if(st){
    const swiftDispel=st.swiftDispel;
    st.current={round:r,forceHit:!!st.forceNextHit,pierce:!!st.pierceNext,double:!!st.doubleNext};
    if(m.wikiId===MOVES.intercept&&main(a,'swift',r)){
      if(st.allLead?.round===r&&!st.allLead.swiftUsed){
        st.current.interceptTrue=true;
        st.allLead.swiftUsed=true;
      }else if(st.firstSwiftUseAvailable&&st.allLead?.round!==r){
        st.current.interceptTrue=true;
        st.firstSwiftUseAvailable=false;
      }
    }
    st.forceNextHit=st.pierceNext=st.doubleNext=st.swiftDispel=false;
    if(swiftDispel&&t.hp>0){
      const boost=c.clearBoost(t),timed=c.clear(t);
      if(boost||timed)t.counts.nextSkillInvalid=(t.counts.nextSkillInvalid??0)+1;
    }
    if(m.wikiId===MOVES.fifth)selectedFifth(c,form??st.lead);
    if(spareActive(a,'swift',r)&&a.side===c.first)mark2(t,r,leading(a,'swift',r));
    if(spareActive(a,'ruin',r)&&m.kind==='status'&&t.hp>0){
      const n=leading(a,'ruin',r)?250:125;
      c.hurt(t,n*c.typeAffinity('机械',t.type),'毁灭机械属性伤害','attribute');
    }
  }
  if(a.side===c.first&&leading(a,'swift',r)&&t.hp>0){
    const loss=c.hurt(t,c.effective(a,'spe')/2,'极速先手固定伤害','fixed');
    if(loss>0)c.heal(a,loss,'极速先手回复');
    else if(st)mark1(a);
  }
  if(leading(a,'ruin',r)&&t.hp>0&&t.hp*4<t.stats.maxHp){
    a.soulState.spMarsExecutionFloor={round:r,hp:t.hp};
  }
}

function applyFifth(c,valid){
  const {a,t,round:r}=c,form=initialize(a).fifthUsed?.form;
  if(valid){
    const removed=c.clear(t);
    if(removed)c.ailment(t,'疲惫',a);
    c.stage(a,1);
    if(form!=='wall')c.timed(a,'reflect',5);
    c.timed(t,'技能禁疗',2,{},r+1);
  }
  if(form==='swift'&&t.effects['技能禁疗']?.end>=r)t.effects['技能禁疗'].end++;
  if(form==='ruin'&&t.hp>0)c.timed(t,'不能主动切换',2,{},r+1);
}

function applyIntercept(c,valid){
  const {a,t,round:r}=c,st=initialize(a);
  if(!valid){c.clearBoost(t);c.clear(t);return;}
  const levels=Object.entries(a.stages).filter(([,value])=>value<0);
  if(levels.length&&c.canRemoveNegative(a)){
    c.clearNegative(a);
    for(const [key,value] of levels)c.stage(a,-value,[key]);
    if(levels.some(([key])=>a.stages[key]>0))t.counts.nextSkillInvalid=(t.counts.nextSkillInvalid??0)+1;
  }
  if(c.clearBoost(t))st.extraLinger=1;
  const layers=mark2Layers(t,r);
  if((layers||Object.values(t.stages).some(value=>value<0))&&c.ailment(t,'疲惫',a,false,false,1+layers)){
    delete t.soulState.spMarsMark2;
    t.soulState.spMarsMark2Blocked=r+2;
  }
  if(t.hp<=0)return;
  const n=t.stats.maxHp/4*(a.hp*2<a.stats.maxHp?2:1);
  if(st.current?.round===r&&st.current.interceptTrue){
    c.spMarsTrueDrain(n,'掣电截击汲取','skill');
  }else c.drainPercent(n,'掣电截击吸取','skill');
}

function applyOverdrive(c){
  const {a,round:r}=c,st=initialize(a);
  st.overdrivePulseUntil=r+3;
  st.overdriveReductionUntil=r+1;
  c.timed(a,'priority',2,{amount:2},r+1);
  c.spMarsAttackBoost(main(a,'ruin',r)?1:.5);
  st.overdriveKoUntil=r+2;
}

function applyRampart(c,valid){
  const {a,t,round:r}=c,st=initialize(a);
  if(!valid){
    c.heal(a,a.stats.maxHp/2,'永固壁垒无效回复','skill');
    st.rampartInvalidGuard=true;
    return;
  }
  c.timed(a,'protect',3);
  st.rampartReductionUntil=r+1;
  st.rampartKoUntil=r+2;
  if(t.hp>0)c.drainFixed(350,'永固壁垒吸取','skill');
  c.addShield(a,300,'custom:20001:rampart');
  if(main(a,'wall',r))st.shieldFreezeUntil=r;
}

function afterUse(c){
  const {a,t,round:r,m}=c;
  if(!c.actualUsed||a.hp<=0)return;
  const valid=c.successful&&!c.hitEffectsDisabled;
  if(owns(a)){
    const st=initialize(a);
    if(m.wikiId===MOVES.fifth)applyFifth(c,valid);
    if(m.wikiId===MOVES.intercept)applyIntercept(c,valid);
    if(m.wikiId===MOVES.overdrive&&valid)applyOverdrive(c);
    if(m.wikiId===MOVES.rampart)applyRampart(c,valid);
    if(m.wikiId===MOVES.verdict&&valid){
      if(a.side===c.first)c.timed(t,'statusBlock',main(a,'swift',r)?2:1);
      else c.timed(a,'priority',1,{amount:2},r+1);
      st.verdictUses=(st.verdictUses??0)+1;
    }
  }
  if(leading(a,'wall',r))c.heal(a,c.shieldValue(a),'坚壁使用技能回复');
  if(leading(a,'ruin',r)){
    const dealt=c.actionAttackDamage;
    if(dealt<250)a.soulState.spMarsRuinBoost=true;
    else if(t.hp>0)t.counts.nextStatusInvalid=(t.counts.nextStatusInvalid??0)+1;
  }
}

function beforeDamage(c){
  const {a,round:r,m}=c,st=owns(a)?initialize(a):null;
  if(st&&spareActive(a,'ruin',r))c.modifier*=leading(a,'ruin',r)?1.5:1.25;
  if(st?.current?.round===r&&st.current.double)c.modifier*=2;
  if(a.soulState.spMarsRuinBoost){c.modifier*=2;delete a.soulState.spMarsRuinBoost;}
  if(st?.current?.round===r&&st.current.pierce)c.attackReductionIgnore=1;
  const floor=a.soulState.spMarsExecutionFloor;
  if(floor?.round===r)c.minimumDamage=Math.max(c.minimumDamage??0,floor.hp);
  if(st&&m.wikiId===MOVES.verdict){
    if(c.affinity>0&&c.affinity<1)c.affinity=1;
    c.power=Math.floor(c.power*(1+Math.min(1,((st.verdictUses??0)+1)/4)));
    if((st.verdictUses??0)>=3)c.ignoreDefenseBoost=true;
    if(main(a,'wall',r))c.minimumDamage=Math.max(c.minimumDamage??0,c.shieldValue(a));
    if(main(a,'ruin',r)){c.ignoreLimit=true;c.ignoreImmunity=true;}
  }
}

function roundStart(c) {
  const f=c.a,st=initialize(f);
  if(st.allLead?.round===c.round){
    const initialShield=c.shieldValue(f);
    st.allLead.bonus=Object.assign({},...FORMS.map(form=>shieldBonus(f.stats,form,initialShield,1)));
  }
  const settled=settleFifth(f,{round:c.round,shield:c.shieldValue(f)});
  if(settled?.reward){
    st.forceNextHit=true;
    if(c.t.hp>0)c.spMarsSwitchDrain(c.t.stats.maxHp/3);
  }
}

function endRound(c) {
  const f=c.a,st=initialize(f);
  if(f.hp<=0)return;
  const {shield,cover}=settleWallDamage(f,c.shieldSourceValue(f,SHIELD_SOURCE));
  if(shield>0)c.addShield(f,shield,SHIELD_SOURCE);
  if(cover>0)c.addBarrier(f,cover,SHIELD_SOURCE);
  const healing=armWallEmergency(f,c.round,WALL);
  if(healing>0)c.heal(f,healing,'坚壁濒死回复');
}

function teamLeave(c) {
  const st=initialize(c.a),resting=c.resting;
  st.bodies[st.lead]={hp:c.a.hp,pp:{...c.a.pp}};
  resting.soulState.spMars={lead:st.lead,bodies:structuredClone(st.bodies),emergencyUses:st.emergencyUses,
    activeBonus:{},linger:{},allLead:null,pending:null,wallDamage:[],wallCover:0,firstSwiftUseAvailable:false};
  if(st.mark1>0)c.queueEntry({custom:'sp-mars-mark1',form:st.lead,layers:st.mark1});
}

const rule={name:'SP马尔修斯',sourceHash:SPEC_HASH,partial:false,traits:{
  skillPriority:f=>spareActive(f,'swift',f.soulState.calculationRound)?1:0,
},abilities:{promote,chooseEntry},hooks:{
  beforeBattleStart(c){initialize(c.a);},
  roundStart,
  roundEnd:endRound,
  teamLeave,
  beforeDamage,
  combatEnd(c){
    const st=initialize(c.a);
    if(c.a.hp>0&&c.t.hp>0&&st.overdrivePulseUntil>=c.round)
      c.drainPercent(c.t.stats.maxHp/3,'熔核过载回合吸取','skill',c.a.hp*2<c.a.stats.maxHp?2:1);
  },
  opponentDefeated(c){
    const st=initialize(c.a);
    if(st.overdriveKoUntil>=c.round){delete st.overdriveKoUntil;st.allLead={round:c.round+1,bonus:{}};}
    if(st.rampartKoUntil>=c.round){
      delete st.rampartKoUntil;
      c.heal(c.a,c.a.stats.maxHp,'永固壁垒击败回复','skill');
      c.restorePP(c.a,Infinity,'skill');
    }
  },
}};

return {FORMS,SOUL_ID,SPEC_HASH,SOURCE_HASH,MOVES,FIFTH_KEY,LABELS,BASE,validSource,owns,legalForms,projectedBody,fifthForm,choiceKey,initialize,liveForm,effectsActive,shieldBonus,changeLead,
  promoteOnDeath,selectEntry,reserveFifth,settleFifth,reduceWallDamage,settleWallDamage,ruinRecovery,
  armWallEmergency,wallEmergencyBlocks,leading,spareActive,panelBonus,mark2Layers,mark2,receiveDamage,immuneAttack,enter,beginUse,afterUse,beforeDamage,roundEndMarks,afterWeakness,rule};
});
