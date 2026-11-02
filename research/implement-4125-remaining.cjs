'use strict';
const fs=require('fs'),assert=require('node:assert/strict');
let souls=fs.readFileSync('dist/range-souls.js','utf8');
const start=souls.indexOf("for(const [id,hash]of [[1356,'481aa018']"),end=souls.indexOf("for(const [id,hash,denominator]of [[1362,",start);assert.ok(start>0&&end>start);
souls=souls.slice(0,start)+`// Q022-024 and Q093 are user confirmations; retained API hashes are unchanged.
for(const [id,hash]of [[1356,'481aa018'],[2051,'bc438361']])registry[id]={
 name:id===1356?'洪荒·列奥尼达':'洪荒·列奥尼达·觉醒',sourceHash:hash,
 traits:{skillPriority:f=>f.soulState.leonSame?1:0},hooks:{
 roundStart(c){const st=c.a.soulState;
  st.leonRoundAbnormal=conditionStatusRules.conditionPresent(c.a,c.round)||conditionStatusRules.conditionPresent(c.t,c.round);
  st.leonShieldHeal=!st.leonRoundAbnormal;st.leonOriginalRandomDue=0;st.leonFailedRandom=0;
  if(st.leonRoundAbnormal){c.addShield(c.a,c.a.stats.maxHp/3,'leon:'+id+':'+c.round);
   if(id===1356){st.leonOriginalRandomDue++;if(!c.ppReductionBlocked(c.t)){const pool=c.t.moves.filter(k=>c.t.pp[k]>0);if(pool.length)c.t.pp[pool[Math.floor(c.random()*pool.length)]]=0;}}
   else c.addCosmic(c.t,1);
  }
  if(id===2051){st.leonOldDialUses??=st.leonOldDialLayers??0;
   if((st.leonOldDialLayers??0)>0&&c.missingPP(c.a)>=12-(st.leonOldDialThresholdReduction??0)){
    c.heal(c.a,c.a.stats.maxHp,'旧日之晷回满体力');c.restorePP(c.a,Infinity);st.leonOldDialUses++;
   }
  }
 },
 choiceLocked(c){const st=c.a.soulState;st.leonSame=c.m.kind!=='item'&&!!st.leonLastKind&&st.leonLastKind===c.m.kind;
  st.leonDifferent=c.m.kind!=='item'&&!!st.leonLastKind&&st.leonLastKind!==c.m.kind;st.leonAttackBonus=0;
 },
 opponentBeforeUse(c){if(id!==2051||c.m.kind==='item'||c.a.hp<=0)return;const st=c.a.soulState;if(!(st.leonOldDialUses>0))return;
  const before=c.t.soulState.ppBeforeUse??c.t.pp;
  if(c.t.moves.some(key=>before[key]===1&&c.moveKind(key)===c.m.kind)){st.leonOldDialUses--;c.t.soulState.skillInvalidRound=c.round;c.emit('旧日之晷按扣除前PP判定，消耗1次无效机会。');}
 },
 beforeUse(c){if(c.a.soulState.leonSame)c.a.soulState.leonAttackBonus=id===2051?.5:(50+Math.floor(c.random()*51))/100;},
 beforeDamage(c){c.modifier*=1+(c.a.soulState.leonAttackBonus??0);},
 afterUse(c){if(c.m.kind==='item'||c.a.hp<=0)return;const st=c.a.soulState,had=!!st.leonLastKind,different=had&&st.leonLastKind!==c.m.kind;
  st.leonLastKind=c.m.kind;
  if(id===1356){if(had)st.leonOriginalRandomDue++;if(different)st.leonOriginalHealAfterAction=c.round;return;}
  if(!had){const old=st.leonOldDialLayers??0;st.leonOldDialLayers=Math.min(5,old+1);st.leonOldDialUses=(st.leonOldDialUses??0)+st.leonOldDialLayers-old;st.leonOldDialObtained=true;return;}
  if(different){const healed=c.heal(c.a,c.a.stats.maxHp/3,'觉醒不同类回复')??0;if(c.t.hp>0)c.hurt(c.t,healed,'觉醒不同类恢复量附伤','percent');}
  if(c.t.hp>0&&!c.randomNonRestrictedPvpAilments(1,2470).some(x=>x.applied))healthRules.drainPercent(c,c.t.stats.maxHp/3,'觉醒随机异常未触发吸取');
 },
 actionEnd(c){if(id!==1356||c.m.kind==='item'||!c.usedSkillThisRound(c.a)||c.a.hp<=0)return;const st=c.a.soulState;
  if(st.leonOriginalHealAfterAction===c.round){delete st.leonOriginalHealAfterAction;const healed=c.heal(c.a,c.a.stats.maxHp/3,'原版不同类流程末回复')??0;if(c.t.hp>0)c.hurt(c.t,healed,'原版不同类恢复量附伤','percent');}
  const count=st.leonOriginalRandomDue??0;st.leonOriginalRandomDue=0;
  for(let i=0;i<count&&c.t.hp>0;i++)if(!c.randomAllPvpAilments(1,1715).some(x=>x.applied))st.leonFailedRandom++;
 },
 combatEnd(c){const st=c.a.soulState;if(c.a.hp<=0)return;
  if(id===1356){for(let i=0;i<(st.leonFailedRandom??0)&&c.t.hp>0;i++)healthRules.drainPercent(c,c.t.stats.maxHp/3,'原版随机异常未触发战阶吸取');return;}
  if(st.leonShieldHeal)c.heal(c.a,c.shieldValue(c.a)+c.shieldValue(c.t),'觉醒无异常双方护盾回复');
  if(!st.leonOldDialObtained&&c.t.hp>0&&!c.ailment(c.t,'衰弱',c.a,false,false,1))c.addCosmic(c.t,3);
 }
}};

`+souls.slice(end);fs.writeFileSync('dist/range-souls.js',souls);
let effects=fs.readFileSync('dist/range-effects.js','utf8');
const from=effects.indexOf("add(2398,'afterHit'"),to=effects.indexOf('\nmetadata[2145]',from);assert.ok(from>0&&to>from);
effects=effects.slice(0,from)+`add(2398,'afterHit',(c,p)=>{c.stage(c.a,p[0]);if(!conditionStatusRules.conditionPresent(c.a,c.round))c.addCosmic(c.t,1);},[[1,6],[1,9999]],'自身有异常时回复己方上只在场精灵；仅该上只精灵回复分支等待真实队伍/换宠');
add(2399,'afterHit',c=>{if(!c.anyStatusInvalid())return;
 if(c.t.ailments['衰弱']>=c.round)c.t.ailments['衰弱']=c.round+(c.a.soulState.leonOldDialLayers??0);
 if(!conditionStatusRules.conditionPresent(c.t,c.round))c.addCosmic(c.t,1);
});
metadata[2397]={info:'击败对手时，将对手的宙变之殢转移给自身并转化为等量的星附属异常状态',args_num:0};
add(2397,'afterHit',c=>{if(c.t.hp>0||c.a.hp<=0)return;const n=c.t.soulState.leonCosmicLayers??0;if(!n)return;c.t.soulState.leonCosmicLayers=0;for(const name of ['星赐','星哲','星赎'])c.ailment(c.a,name,c.a,false,false,n);});
metadata[2400]={info:'未击败对手时，消除自身当回合所使用技能的记录',args_num:0};
add(2400,'afterHit',c=>{if(c.t.hp>0)c.a.soulState.clearSkillRecordsAfterUse=c.round;});
metadata[2401]={info:'本场战斗双方每使1只精灵消逝，自身的旧日之晷触发阈值-1且此技能造成的攻击伤害提升30%、吸取对手最大体力的10%',args_num:0};
add(2401,'beforeDamage',c=>{const n=c.vanishCount();c.a.soulState.leonOldDialThresholdReduction=n;c.modifier*=1+.3*n;},[],undefined,undefined,{afterHit(c){const n=c.vanishCount();c.a.soulState.leonOldDialThresholdReduction=n;if(n>0&&c.t.hp>0)healthRules.drainPercent(c,c.t.stats.maxHp*n/10,c.m.name+'消逝累计吸取');}});
`+effects.slice(to);fs.writeFileSync('dist/range-effects.js',effects);
let engine=fs.readFileSync('dist/souls.js','utf8');
const anchor='moveKind:key=>battleMoves[key]?.kind,';assert.ok(engine.includes(anchor));
engine=engine.replace(anchor,anchor+"addCosmic(f,n){f.soulState.leonCosmicLayers=Math.min(5,(f.soulState.leonCosmicLayers??0)+n);},vanishCount:()=>s.vanishedCount??0,");
const phase="E.SOULS.run('actionEnd',{...context(a,t,m),successful});}";assert.ok(engine.includes(phase));
engine=engine.replace(phase,"E.SOULS.run('actionEnd',{...context(a,t,m),successful});if(a.soulState.clearSkillRecordsAfterUse===r){delete a.soulState.clearSkillRecordsAfterUse;if(t.hp>0){delete a.previousMoveId;a.consecutiveUses=0;for(const key of ['leonLastKind','skillUses','damageGrowth','hitGrowth','attackBonus2396'])delete a.soulState[key];}}}");
const nonTrue="if(type==='direct')return hurt(t,n,source,type,true,false,t);";assert.ok(engine.includes(nonTrue));
engine=engine.replace(nonTrue,nonTrue+"if(type!=='true'&&(a.soulState.leonCosmicLayers??0)>r-(a.soulState.enteredRound??1))n*=.5;");
const attack='effectContext.modifier*=1+(effectContext.additiveAttackFraction??0);';assert.ok(engine.includes(attack));
engine=engine.replace(attack,attack+"if((a.soulState.leonCosmicLayers??0)>r-(a.soulState.enteredRound??1))effectContext.modifier*=.5;");
const endRound='statusRules.roundEnd(f,r);';assert.ok(engine.includes(endRound));
engine=engine.replace(endRound,"const before={...f.ailments};statusRules.roundEnd(f,r);if(f.hp>0&&(f.soulState.leonCosmicLayers??0)>0)for(const [k,end]of Object.entries(before))if(end>=r)f.ailments[k]=Math.max(f.ailments[k]??0,end+1);");
fs.writeFileSync('dist/souls.js',engine);
console.log('4125两版魂印、宙变当前在场行为、2397/2398/2399/2400/2401已接入，仍需状态专项及完整验收。');
