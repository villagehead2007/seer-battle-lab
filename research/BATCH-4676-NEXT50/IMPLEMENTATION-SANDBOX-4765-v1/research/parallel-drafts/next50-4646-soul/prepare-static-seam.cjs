'use strict';
// Prepares a source-limited candidate, never writes shared production or executes tests.
const fs=require('fs'),path=require('path');
const old="      if(statusRules.preventsDamage(a,t,'attack',r))remaining=(minimumSuppressed=true,0);";
const added="      if(typedBase===null&&a.soulId===1846&&E.SOULS.registry[1846]?.sourceHash==='ddacacad'&&(a.soulState.clockFloor1846??0)>0&&!effectContext.ignoreLimit&&!minimumSuppressed&&remaining>0){const cap=Math.min(on(t,'攻击伤害上限')?incomingRoundRedCap(t,t.effects['攻击伤害上限']):Infinity,on(t,'伤害上限')?incomingRoundRedCap(t,t.effects['伤害上限']):Infinity,E.SOULS.trait(t,'damageCap')??Infinity,E.SOULS.trait(t,'attackDamageCap')??Infinity,t.soulState.jasmineCap??Infinity,on(t,'机械领域')?t.stats.maxHp*t.effects['机械领域'].fraction:Infinity);remaining=E.SOULS.registry[1846].abilities.resolveFloorConflict({...context(a,t,m),amount:remaining,cap,ignoreLimit:!!effectContext.ignoreLimit});effectContext.clockFloorPriority1846=cap<(a.soulState.clockFloor1846??0)&&a.soulState.qualifiedFloorCap1846==='floor-priority';}\n";
const current=fs.readFileSync(path.resolve(__dirname,'../../../dist/souls.js'),'utf8');
const patches=[{label:'1846 exact source actual lower hard-cap conflict, after known immunity and before HP/shield',target:'dist/souls.js',old,replacement:old+'\n'+added}];
for(const name of['伤害上限','攻击伤害上限']){const needle="if(!rage&&!effectContext.ignoreLimit&&on(t,'"+name+"')&&t.effects['"+name+"'].cumulativeRoundRed)";patches.push({label:'1846 explicit floor-priority qualified final cumulative '+name,target:'dist/souls.js',old:needle,replacement:needle.replace('!effectContext.ignoreLimit','!effectContext.ignoreLimit&&!effectContext.clockFloorPriority1846')});}
const gate='let explicitImmunity=false;const immuneGate=';
patches.push({label:'1846 actual overlapping immunity source before reflection or count consumption',target:'dist/souls.js',old:gate,replacement:"if(!bypass&&t.soulId===1846&&E.SOULS.registry[1846]?.sourceHash==='ddacacad')E.SOULS.registry[1846].abilities.guardMixedImmunity({...context(t,source??fs[1-t.side]),status:k});"+gate});
for(const p of patches)if(current.split(p.old).length!==2)throw Error('1846 static anchor not unique: '+p.label);
fs.writeFileSync(path.join(__dirname,'souls.static-edits.json'),JSON.stringify(patches,null,2)+'\n');
