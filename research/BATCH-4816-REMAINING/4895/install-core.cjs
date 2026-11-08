'use strict';const fs=require('fs'),assert=require('assert/strict');
let t=fs.readFileSync('dist/souls.js','utf8');function replace(a,b){assert.equal(t.split(a).length-1,1,a);t=t.replace(a,b);}
replace('function context(a,t,m=null,ailmentOrigin=\'soul\'){','function context(a,t,m=null,ailmentOrigin=\'soul\'){');
replace('return {a,t,m,changeFear4894(',"return {a,t,m,noteAbilities4895:E.SOULS.registry[2082].abilities,changeFear4894(");
replace('function runInstantKill1972(f,source,perform){if(f.hp<=0)return 0;',"function runInstantKill1972(f,source,perform){if(f.hp<=0)return 0;if(f.soulState.score4895?.executionImmunity?.length&&E.SOULS.registry[2082].abilities.preventInstant(f))return 0;");
t=t.replaceAll('if(statusRules.blocksAction(a,r,t)||',"if((t.soulState.score4895?.heaven>0&&E.SOULS.registry[2082].abilities.blocks(a,t,r))||statusRules.blocksAction(a,r,t)||");
replace("E.WIKI.effectsEngine.registry[1637].opponent4887({...skillContext(t,a,m),actualUsed:!!used[a.side]});","E.WIKI.effectsEngine.registry[1637].opponent4887({...skillContext(t,a,m),actualUsed:!!used[a.side]});E.WIKI.effectsEngine.registry[614].opponent4895({...skillContext(t,a,m),actualUsed:!!used[a.side]});");
// Apply the same verified personal Fate Protection glossary as the existing 1829 implementation.
t=t.replaceAll("f.soulId===1844?E.SOULS.registry[1844].abilities.resistanceChance", "f.soulState.score4895?.heaven===3?E.SOULS.registry[2082].abilities.resistance(f,k,E.GEAR.resistanceChance(f,k)):f.soulId===1844?E.SOULS.registry[1844].abilities.resistanceChance");
replace("ailment(t,e.ailment,f,false,false,null,{probabilityPercent:e.chance})))t.counts.nextStatusInvalid", "ailment(t,e.ailment,f,false,false,null,{probabilityPercent:e.chance,...(e.source4895?{origin:'skill'}:{})})))t.counts.nextStatusInvalid");
fs.writeFileSync('dist/souls.js',t);console.log('installed known 4895 note, deletion, consumption and current skills');
