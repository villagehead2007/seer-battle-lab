'use strict';const fs=require('fs');
function change(file,a,b){let t=fs.readFileSync(file,'utf8');if(t.split(a).length!==2)throw Error(file+' match '+a);fs.writeFileSync(file,t.replace(a,b));}
change('dist/souls.js',"function freeDoorChoice4888(f,key){return ","function freeDoorChoice4888(f,key){return E.WIKI.effectsEngine.registry[2605].freeSelection(f,key)||(f.soulId===2162&&E.SOULS.registry[2162].abilities.freeChoice(f,key,f.soulState.availableRound??1))||");
change('dist/souls.js',"function damageImmune(f,type,ignoreGuard=false){", "function damageImmune(f,type,ignoreGuard=false){if(E.SOULS.trait(f,'immuneDamageTypes')?.includes(type))return true;");
change('dist/souls.js',"return {a,t,m,divineReborn()", "return {a,t,m,signalLethal(){const signal={...context(a,a,m),amount:0,lethal:true,type:'signal'};E.SOULS.run('lethalSignal',signal);},hasAilmentImmunity(f){return (f.counts.immune??0)>0||on(f,'免异常')||on(f,'reflect')||!!E.SOULS.trait(f,'ailmentImmune');},divineReborn()");
change('dist/souls.js',"||on(a,'战魂禁行动')||on(a,'清异常禁行动2587')", "||on(a,'无法行动')||on(a,'战魂禁行动')||on(a,'清异常禁行动2587')");
change('dist/wiki-support.js',"selected&&s.source?.provider==='seerapi'&&E.SOULS.registry[selected.id]?.sourceHash", "selected&&['seerapi','composite'].includes(s.source?.provider)&&E.SOULS.registry[selected.id]?.sourceHash");
console.log('SP source selection, generic immunity and lethal signal hooks written');
