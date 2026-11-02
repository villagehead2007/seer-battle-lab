(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BattleStatusRules=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const pools=typeof module==='object'&&module.exports?require('./status-pools.js'):globalThis.BattleStatusPools;
  const catalog=typeof module==='object'&&module.exports?require('./status-catalog.js'):globalThis.BattleStatusCatalog;
  // Evidence: BWIKI 对战机制 revision 388558; SeerAPI status enum hash 27df2271.
  // State clauses retain Wiki evidence. 2074 separately uses an explicit project rule.
  const ids=Object.freeze({麻痹:0,中毒:1,烧伤:2,冻伤:5,害怕:6,疲惫:7,睡眠:8,石化:9,混乱:10,冰封:15});
  // Weakening taxonomy: data/statuses/statuses.json, Wiki mechanics rev388558; not ability-level weakening.
  const auxiliary=Object.freeze(["狂暴","星赐","星哲","超频","砥砺","星赎","雷解","渐冻"]);
  const weakening=Object.freeze(["中毒","烧伤","寄生","冻伤","混乱","衰弱","易燃","流血","失明","烈焰诅咒","致命诅咒","虚弱诅咒","束缚","失神","沉默","臣服","凝滞","沸涌","魇昧"]);
  const controls=Object.freeze(['麻痹','害怕','疲惫','睡眠','石化','冰封','空定','瘫痪','焚烬','诅咒','感染','神游']);
  const active=(f,k,r)=>Number.isFinite(f.ailments?.[k])&&f.ailments[k]>=r;
  // Q-A60-4004-007: only aggregate abnormal-condition checks are masked.
  // Attachment, action blocking, damage, timers, removal and conversion use real ailments.
  function conditionPresent(f,r){return !(f.soulState?.holyVerdict>0)&&Object.values(f.ailments??{}).some(end=>end>=r);}
  // Q-A60-4125-022: disappearance removes the entire HP maximum. Ordinary death is distinct.
  function vanish(state,f,round){
    f.soulState??={};if(f.soulState.vanished)return false;
    f.stats.maxHp=0;f.hp=0;f.soulState.vanished=true;f.soulState.deathResolved=true;
    state.vanishedCount=(state.vanishedCount??0)+1;state.vanishEvents??=[];
    state.vanishEvents.push({round,side:f.side,species:f.number});return true;
  }
  function validateDuration(n){if(!Number.isInteger(n)||n<1)throw new RangeError('异常持续回合必须为正整数');}
  function apply(f,k,r,n){validateDuration(n);if(f.hp<=0)return false;f.ailments[k]=r+n-1;return true;}
  // Shared admission pipeline. Soul/skill-specific gates remain caller policies.
  // Q001/Q002 user-confirmed defaults are separate from retained Wiki unknowns.
  function attempt(f,k,r,{duration=null,bypass=false,gate=()=>true,resistanceChance=()=>0,random,
    durationFallback=null,randomSelection=false,merge='max-remaining',source=null,notify=()=>{},admissionTransform=null}={}){
    const result=(reason,extra={})=>({applied:reason==='applied',reason,duration:null,durationOrigin:null,...extra});
    if(duration!==null)validateDuration(duration);
    if(!['replace','max-remaining'].includes(merge))throw new RangeError('未知异常持续时间合并规则');
    if(f.hp<=0)return result('defeated');
    if(k==='山神守护')return result('pve-only');
    if(active(f,'凝滞',r)&&(controls.includes(k)||k==='狂信')&&!bypass)return result('blocked-by-policy');
    if(duration===null&&!durationFallback)durationFallback={origin:'user-confirmed-default-2-3',resolve:pools.defaultDuration};
    if(!bypass&&!gate())return result('blocked-by-policy');
    if(!bypass&&f.counts?.immune>0){f.counts.immune--;const out=result('count-immunity');notify(out);return out;}
    if(!bypass&&f.resistUntil>=r){const out=result('resistance-window');notify(out);return out;}
    const chance=resistanceChance(f,k),resisted=!bypass&&chance>0&&random()<chance;
    const n=k==='衰弱'&&!randomSelection?3:(duration??durationFallback.resolve(random));validateDuration(n);
    const details={duration:n,durationOrigin:duration===null?durationFallback.origin:'explicit',chance};
    if(resisted){f.resistUntil=Math.max(f.resistUntil??0,r+n-1);const out=result('resisted',details);notify(out);return out;}
    if(!bypass&&chance>0)notify(result('resistance-failed',details));
    const conversion=typeof admissionTransform==='function'?admissionTransform(f,k,n,r):null;
    if(conversion&&(!conversion.kind||!Number.isInteger(conversion.duration)||conversion.duration<1))throw Error('异常准入后转换载荷无效');
    const appliedKind=conversion?.kind??k,requested=conversion?.duration??n;
    const remaining=active(f,appliedKind,r)?f.ailments[appliedKind]-r+1:0;
    const appliedDuration=appliedKind==='衰弱'&&!randomSelection?3:merge==='max-remaining'?Math.max(remaining,requested):requested;
    if(conversion&&k!==appliedKind)clear(f,k);
    apply(f,appliedKind,r,appliedDuration);
    f.statusState??={};f.statusState.sources??={};if(Number.isInteger(source?.side))f.statusState.sources[appliedKind]=source.side;
    if(appliedKind==='狂信'&&f.statusState?.faithSourceSide===undefined&&Number.isInteger(source?.side))f.statusState.faithSourceSide=source.side;
    const out=result('applied',{...details,appliedDuration,endRound:f.ailments[appliedKind],merge,...(conversion?{convertedTo:appliedKind,convertedDuration:conversion.duration,originalStatus:k}:{} )});notify(out);if(f.soulId===1844&&f.soulState?.starActive1844&&f.soulState.starRecord1844===k&&k!=='星赐'){const converted=convertExisting(f,k,'星赐',r,{source,durationOverride:3});if(converted){out.convertedTo='星赐';out.convertedDuration=3;(f.soulState.starConversions1844??=[]).push({round:r,from:k,to:'星赐',duration:3,originalAppliedDuration:appliedDuration});}}return out;
  }
  function randomAilments(c,count,effectId=2074,names=null){
    if(c.t.hp<=0)return [];
    markExecution(c.a,c.round);
    const originalNames=names??pools.configuration(effectId)?.candidates?.map(x=>x.name);
    const oracle=c.a.soulState?.fallenOracle&&originalNames?.includes('诅咒');
    if(oracle){names=['诅咒','烈焰诅咒','致命诅咒','虚弱诅咒'];count+=1;}
    const selections=names?pools.drawFromNames(count,c.random,names):pools.drawForEffect(effectId,count,c.random);
    const sourceType=oracle?'user-confirmed-fallen-oracle/shared-duration':names?'source-defined-pool/shared-duration':pools.sourceType;
    return selections.map(selected=>{
      c.record?.({type:'draw',effectId,ruleId:names?null:pools.ruleId,sourceType,round:c.round,targetSide:c.t.side,...selected});
      const applied=c.ailment(c.t,selected.name,c.a,false,false,selected.duration,{effectId,merge:'max-remaining',sourceType,randomSelection:true});
      return {...selected,applied};
    });
  }
  const effect2074=(c,count)=>randomAilments(c,count,2074);
  function behaviorCoverage(name){return catalog.coverage.find(row=>row.name===name)?.status??'not-implemented';}
  function behaviorGaps(name){return [...(catalog.behaviorGaps?.[name]??[])];}
  function durationPolicy(name){const row=catalog.durationPolicies?.[name];return row?JSON.parse(JSON.stringify(row)):null;}
  function clear(f,k,onClear=()=>{}){if(!Object.hasOwn(f.ailments,k))return false;delete f.ailments[k];if(f.statusState?.sources)delete f.statusState.sources[k];onClear(k);return true;}
  function clearAll(f,onClear=()=>{}){const removed=Object.keys(f.ailments);for(const k of removed)clear(f,k,onClear);return removed;}
  // Snapshot iteration preserves the existing end-of-round contract: conversions
  // created by an expiry callback are not ticked again during this same pass.
  function expire(f,r,onExpire=()=>{}){const removed=[];for(const [k,end]of Object.entries(f.ailments))if(end<=r&&f.ailments[k]<=r){const sourceSide=f.statusState?.sources?.[k];clear(f,k);removed.push(k);onExpire(k,sourceSide);}return removed;}
  function blocksAction(f,r,opponent=null){return controls.some(k=>active(f,k,r))||active(f,'狂信',r)&&Number.isInteger(opponent?.side)&&f.statusState?.faithSourceSide===opponent.side;}
  function powerMultiplier(f,r){return active(f,'烧伤',r)?.5:1;}
  function accuracyMultiplier(f,kind,r){return kind==='status'?1:(active(f,'混乱',r)?.2:1)*(active(f,'易燃',r)?.7:1);}
  function attackHit(t,r){return active(t,'睡眠',r)&&clear(t,'睡眠');}
  function damageOverTime(f,r,hurt){for(const k of ['中毒','烧伤','冻伤','沉默','烈焰诅咒','流血'])if(f.hp>0&&active(f,k,r))hurt(f,k==='流血'?80:f.stats.maxHp/8,k,k==='流血'?'fixed':'percent');}
  function confusionDamage(f,r,random,hurt){if(f.hp>0&&active(f,'混乱',r)&&random()<.05)hurt(f,50,'混乱','direct');}
  function iceExpired(f,r,stage,applyStatus){if(f.hp<=0)return;stage(f,-1,['spe']);applyStatus(f,'冻伤',r+1,2);}
  function priority(f,r,value){return active(f,'束缚',r)?0:value+(active(f,'超频',r)?1:0);}
  function skillInvalid(f,m,r,random){return active(f,'沉默',r)&&m.fifth===true||m.kind==='status'&&active(f,'失神',r)&&random()<.5;}
  function actionStart(f,m,r,moves){if(active(f,'超频',r)&&Object.hasOwn(f.pp,m.id)&&moves[m.id])f.pp[m.id]=moves[m.id].pp;}
  function preventsDamage(a,t,type,r){return a!==t&&active(a,'臣服',r)&&['attack','fixed','percent'].includes(type===true?'percent':type);}
  function attackMultiplier(f,r){return active(f,'星赐',r)?1.3:1;}
  function incomingMultiplier(f,r){return active(f,'衰弱',r)?2:1;}
  function healingMultiplier(f,r){return active(f,'星赎',r)?1.3:1;}
  function minimumAttackDamage(f,r,critical){return active(f,'沸涌',r)?Math.floor(f.stats.maxHp*(critical?.5:.3)):0;}
  function attackDealt(a,t,r,dealt,hurt){if(a.hp>0&&t.hp>0&&dealt>0&&active(a,'雷解',r))hurt(a,t,dealt*.6,'雷解','true');}
  function markExecution(f,r,names=[]){if(f){f.statusState??={};f.statusState.ailmentEffectRound=r;const prior=f.statusState.executedAilments;if(!prior||prior.round!==r)f.statusState.executedAilments={round:r,names:[]};for(const name of names)if(!f.statusState.executedAilments.names.includes(name))f.statusState.executedAilments.names.push(name);}}
  function trueDamageTaken(f,r,dealt,heal){if(f.hp>0&&dealt>0&&active(f,'砥砺',r)&&f.statusState?.ailmentEffectRound!==r)heal(f,dealt*.8,'砥砺');}
  function removed(f,k,r,{hurt}){
    if(f.hp<=0)return;
    if(k==='束缚')hurt(f,f.stats.maxHp/8,'束缚解除','percent');
  }
  function convert(f,from,r,{random,stage,source=null,startRound=r+1}){
    if(f.hp<=0||from==='易燃'&&startRound!==r)return null;
    const targets={冰封:['冻伤',2],焚烬:['烧伤',2],感染:['中毒',2],神游:['失神',2],渐冻:['冰封',3],空定:['沉默',2],易燃:['烧伤',2]};
    let target=targets[from];if(from==='超频')target=['瘫痪',1+Math.floor(random()*2)];if(from==='诅咒')target=[['烈焰诅咒','致命诅咒','虚弱诅咒'][Math.floor(random()*3)],2];if(!target)return null;
    if(from==='冰封')stage(f,-1,['spe']);if(from==='焚烬')stage(f,-1,['acc']);if(from==='感染')stage(f,-1,['atk','spa']);
    return {from,to:target[0],...attempt(f,target[0],startRound,{duration:target[1],bypass:true,source,random})};
  }
  function fireHit(f,r,moveType,context){if(moveType==='火'&&active(f,'易燃',r)){clear(f,'易燃');return convert(f,'易燃',r,{...context,startRound:r});}return null;}
  // Source-defined conversion inherits the remaining duration; it does not
  // re-enter the caller's attachment/received-ailment response hooks.
  function convertExisting(f,from,to,r,{source=null,durationOverride=null}={}){
    if(f.hp<=0||!active(f,from,r))return false;
    const duration=durationOverride??(f.ailments[from]-r+1);validateDuration(duration);
    clear(f,from);
    return attempt(f,to,r,{duration,bypass:true,source}).applied;
  }
  function view(fighters,observerSide,r){
    if(!Number.isInteger(observerSide)||!fighters[observerSide])throw new Error('需要明确观察方');
    // User-confirmed project override: 魇昧 is a visible, behaviorless ailment.
    const masked=false;
    return fighters.map(f=>({masked,stages:masked?null:{...f.stages},ailments:Object.entries(f.ailments).filter(([,end])=>end>=r).map(([name,end])=>masked?{name:'魇昧',remaining:null}:{name,remaining:end-r+1})}));
  }
  function roundEnd(f,r){
    if(f.hp<=0||!active(f,'星赎',r))return;
    // The restriction names are a user-confirmed project rule. They are not
    // inferred from the incomplete Wiki classification, nor from effect 1348.
    const names=new Set(pools.pool().map(x=>x.name));
    for(const k of Object.keys(f.ailments))if(active(f,k,r)&&names.has(k))f.ailments[k]++;
  }
  const timedPresent=(e,r)=>!!e&&(e.untilSwitch===true||e.end>=r);
  const timedActive=(e,r)=>!!e&&e.start<=r&&timedPresent(e,r);
  const timedExpired=(e,r)=>!!e&&e.untilSwitch!==true&&e.end<=r;
  return Object.freeze({isAuxiliary:name=>auxiliary.includes(name),isWeakening:name=>weakening.includes(name),timedPresent,timedActive,timedExpired,isControl:name=>controls.includes(name),ids,sourceRevision:388558,conditionPresent,vanish,active,apply,attempt,effect2074,randomAilments,behaviorCoverage,behaviorGaps,durationPolicy,clear,clearAll,expire,blocksAction,powerMultiplier,accuracyMultiplier,attackHit,damageOverTime,confusionDamage,iceExpired,priority,skillInvalid,actionStart,preventsDamage,attackMultiplier,incomingMultiplier,healingMultiplier,minimumAttackDamage,attackDealt,removed,convert,convertExisting,fireHit,roundEnd,markExecution,trueDamageTaken,view});
});
