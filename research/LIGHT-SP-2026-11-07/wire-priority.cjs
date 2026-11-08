'use strict';const fs=require('fs');const file='dist/souls.js';let t=fs.readFileSync(file,'utf8');
function replace(a,b){if(t.split(a).length!==2)throw Error('Match count '+a);t=t.replace(a,b);}
replace('const effectForcedFirst=[false,false],ignoreOpponentPositivePriority=[false,false],ignoreNegativeOwnPriority=[false,false];','const effectForcedFirst=[false,false],ignoreOpponentPriority=[false,false],ignoreOpponentPositivePriority=[false,false],ignoreNegativeOwnPriority=[false,false];');
replace('effectForcedFirst[i]=!!c.forceFirst;','effectForcedFirst[i]=!!c.forceFirst;ignoreOpponentPriority[i]=!!c.ignoreOpponentPriority;');
replace("fs.forEach((f,i)=>{if(ignoreOpponentPositivePriority[1-i]", "fs.forEach((f,i)=>{if(ignoreOpponentPriority[1-i]&&selectedBattleMove(i).kind!=='item')priorities[i]=0;if(ignoreOpponentPositivePriority[1-i]");
replace('let damageReductionIgnore=Math.max(effectContext.capIgnore2146??0,','let damageReductionIgnore=Math.max(effectContext.attackReductionIgnore??0,effectContext.capIgnore2146??0,');
replace('const fullReductionIgnore=(a.soulState.groupIgnoreThis2586', 'const fullReductionIgnore=(effectContext.attackReductionIgnore??0)>=1||(a.soulState.groupIgnoreThis2586');
fs.writeFileSync(file,t);console.log('generic priority and attack reduction integration written');
