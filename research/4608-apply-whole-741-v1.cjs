'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),p='dist/souls.js';
fs.copyFileSync(p,'research/next50-answer-takeover-2026-10-26T17-09-55-144Z/4608-before/souls.js.before-whole741',fs.constants.COPYFILE_EXCL);
let s=fs.readFileSync(p,'utf8');
function replace(a,b){assert.equal(s.split(a).length,2,a.slice(0,90));s=s.replace(a,b);}
replace('    let skillPhase=false,currentActorSide=null,damageSourceOrigin=null,jiegeWindowSerial=0;',`    let skillPhase=false,currentActorSide=null,damageSourceOrigin=null,jiegeWindowSerial=0;
    let saffron741Probe=null,saffron741Decision=null;
    // A whole-use threshold needs the actual segment calculations before any
    // HP, shield, RNG or reaction changes commit. Preserve object identities:
    // contexts and panel bindings can retain references to nested state objects.
    function checkpoint741(roots){const saved=new Map();function visit(o){if(!o||typeof o!=='object'||saved.has(o)||Object.isFrozen(o))return;if(o instanceof Set){saved.set(o,{set:[...o]});return;}const entries=Object.entries(o);saved.set(o,{entries});for(const [,v]of entries)visit(v);}for(const root of roots)visit(root);return()=>{for(const [o,record]of saved){if(record.set){o.clear();for(const v of record.set)o.add(v);continue;}const keys=new Set(record.entries.map(([k])=>k));for(const k of Object.keys(o))if(!keys.has(k))delete o[k];for(const [k,v]of record.entries)o[k]=v;if(Array.isArray(o))o.length=record.entries.filter(([k])=>/^(0|[1-9]\\d*)$/.test(k)).length;}};}
`);
const old=s.split(/\r?\n/).find(x=>x.includes("if(!effectContext.ignoreImmunity&&!warImmunity&&on(t,'大额攻击免疫')&&t.effects['大额攻击免疫'].saffron741)"));assert.ok(old);
replace(old,`      if(!effectContext.ignoreImmunity&&!warImmunity&&on(t,'大额攻击免疫')&&t.effects['大额攻击免疫'].saffron741){const e=t.effects['大额攻击免疫'];if(e.qualifiedUnit4608||e.qualifiedShieldTiming4608){const memo=t.soulState.saffron741Round?.round===r?t.soulState.saffron741Round:{round:r,total:0},n=e.qualifiedShieldTiming4608==='after-shield'?Math.max(0,remaining-(!rage&&!effectContext.ignoreShield?shieldValue(t):0)):remaining;memo.total+=n;t.soulState.saffron741Round=memo;saffron741Immune=(e.qualifiedUnit4608==='round'?memo.total:n)>e.threshold;}else if(saffron741Probe?.a===a&&saffron741Probe.t===t&&saffron741Probe.m===m){saffron741Probe.total+=remaining;}else saffron741Immune=saffron741Decision?.a===a&&saffron741Decision.t===t&&saffron741Decision.m===m?saffron741Decision.immune:remaining>e.threshold;}`);
replace("if(!youmei1011Use?.selected&&!rage&&!effectContext.ignoreImmunity&&!warImmunity&&(t.counts.attackNullify>0||t.soulState.nullifyUse===reflectKey))", "if(!saffron741Immune&&!youmei1011Use?.selected&&!rage&&!effectContext.ignoreImmunity&&!warImmunity&&(t.counts.attackNullify>0||t.soulState.nullifyUse===reflectKey))");
const loopStart='        let total=0,totalSettled=0,crit=false,anyNonCritical=false,anyNonImmuneHit=false,landed=false;';
const loopEnd="        if(landed&&m.kind!=='status'&&t.soulState.oracleMarks1764";
const start=s.indexOf(loopStart),end=s.indexOf(loopEnd,start);assert.ok(start>0&&end>start);
const loop=s.slice(start,end);
const replacement=`        const executeSegments741=()=>{
${loop}
          return {total,totalSettled,crit,anyNonCritical,anyNonImmuneHit,landed};
        };
        const threshold741=on(t,'大额攻击免疫')?t.effects['大额攻击免疫']:null,previousDecision741=saffron741Decision;
        if(useContext.hits>1&&m.kind!=='status'&&m.kind!=='item'&&threshold741?.saffron741&&!threshold741.qualifiedUnit4608&&!threshold741.qualifiedShieldTiming4608&&!saffron741Probe){
          const savedLocals={stageSnapshot,syncingStages,skillPhase,currentActorSide,damageSourceOrigin,jiegeWindowSerial,ailmentSnapshot,first,reproduceSkillComponent,useAttackDamage,useAttackHpLoss,actionLanded,actionPayloadAllowed,replayedStatusComponent,nextAttackFixedApplied,nextAttackPercentApplied,criticalForceConsumedThisUse};
          const restore=checkpoint741([s,events,stageSnapshot,ailmentSnapshot,used,received,attackBonus,m]),probe={a,t,m,total:0};
          saffron741Probe=probe;
          try{executeSegments741();}finally{restore();({stageSnapshot,syncingStages,skillPhase,currentActorSide,damageSourceOrigin,jiegeWindowSerial,ailmentSnapshot,first,reproduceSkillComponent,useAttackDamage,useAttackHpLoss,actionLanded,actionPayloadAllowed,replayedStatusComponent,nextAttackFixedApplied,nextAttackPercentApplied,criticalForceConsumedThisUse}=savedLocals);saffron741Probe=null;}
          saffron741Decision={a,t,m,immune:probe.total>threshold741.threshold};
        }
        let segmentResult741;try{segmentResult741=executeSegments741();}finally{saffron741Decision=previousDecision741;}
        const {total,totalSettled,crit,anyNonCritical,anyNonImmuneHit,landed}=segmentResult741;
`;
s=s.slice(0,start)+replacement+s.slice(end);
fs.writeFileSync(p,s);console.log('Native whole-use 741 transaction installed; qualified historical research modes retained.');
