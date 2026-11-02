'use strict';
const fs=require('fs'),path=require('path'),text=fs.readFileSync(path.resolve(__dirname,'../../../dist/souls.js'),'utf8'),patches=[];
const add=(label,old,replacement)=>{if(text.split(old).length!==2)throw Error('1848 anchor '+label);patches.push({label,target:'dist/souls.js',old,replacement});};
const scoped=(who,other,phase,loss)=>`if(${who}.soulId===1848&&E.SOULS.registry[1848]?.sourceHash==='206637ec')E.SOULS.registry[1848].abilities.finishFatal({...context(${who},${other},m),hpLoss:${loss},qualifiedZeroHeal1848(target1848,n){if(target1848!==${who})throw Error('1848 exact recovery target');return heal(target1848,n,'星海明确致死研究回复','soul',true);}},'${phase}');`;
for(const width of[6,10]){const start='\n'+' '.repeat(width)+'const blocked=';add('1848 actual status invalid live mark indentation'+width,start+'(m.kind',start+"(m.kind==='status'&&a.soulState.starSoak1848?.sourceHash==='206637ec'&&E.SOULS.registry[1848]?.sourceHash==='206637ec'&&E.SOULS.registry[1848].abilities.statusBlocked(context(a,t,m)))||(m.kind");}
const ev="E.SOULS.run('attackDamageTaken',{...context(t,a,m),defeatedByAttack,dealt,hpLoss:dealt,settledDamage,attackImmune:hitImmune,shieldDamage:(t.roundShieldDamage??0)-shieldAtAttackStart});";
add('1848 received complete positive red50percent plus independent conditional100true',ev,ev+"if(settledDamage>0&&t.soulState.starSoak1848?.sourceHash==='206637ec'&&E.SOULS.registry[1848]?.sourceHash==='206637ec')E.SOULS.registry[1848].abilities.receivedAttack({...context(a,t,m),settledDamage,hpLoss:dealt,isGrassType1848(f){const parts=s.typeChart.aliases?.[f.type];if(!Array.isArray(parts))throw Error('1848真实属性成分未覆盖');return parts.includes('草');}});");
add('1848 final nonred preHP lethal qualification',"if(f.soulId===1791){const fatal=","if([1791,1848].includes(f.soulId)){const fatal=");
add('1848 final red preHP lethal qualification',"if(t.soulId===1791){const fatal=","if([1791,1848].includes(t.soulId)){const fatal=");
const nonred="if(type==='fixed')f.roundFixedDamageTaken+=v;resolveDeath(f,origin);";
add('1848 actual nonred HP debit before versus after death research lifecycle',nonred,"if(type==='fixed')f.roundFixedDamageTaken+=v;"+scoped('f','origin??fs[1-f.side]','before-death','v').replaceAll(',m)',',null)')+"resolveDeath(f,origin);"+scoped('f','origin??fs[1-f.side]','after-death','v').replaceAll(',m)',',null)'));
const redBefore="t.hp-=dealt;settleLokiFalseArc(t,a,settledDamage);const defeatedByAttack=t.hp<=0;";
add('1848 actual red HP debit before death research lifecycle',redBefore,"t.hp-=dealt;settleLokiFalseArc(t,a,settledDamage);"+scoped('t','a','before-death','dealt')+"const defeatedByAttack=t.hp<=0;");
const redAfter="resolveDeath(t,a);if(settledDamage>0&&t.counts.nextDamageReturn";
add('1848 actual red post death research lifecycle',redAfter,"resolveDeath(t,a);"+scoped('t','a','after-death','dealt')+"if(settledDamage>0&&t.counts.nextDamageReturn");
add('1848 explicit before-death research payload defers stage-sync recursive death only during this token','function resolveDeath(f,defeater=null){',"function resolveDeath(f,defeater=null){if(f.soulId===1848&&E.SOULS.registry[1848]?.sourceHash==='206637ec'&&f.soulState.starRecoveringBeforeDeath1848?.round===r&&f.soulState.qualifiedStarLethalPhase1848==='before-death')return;");
fs.writeFileSync(path.join(__dirname,'souls.production-edits.json'),JSON.stringify(patches,null,2)+'\n');

