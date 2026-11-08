'use strict';
const fs=require('fs');
function change(file,from,to){let text=fs.readFileSync(file,'utf8');const parts=text.split(from);if(parts.length!==2)throw Error(`Expected one match in ${file}: ${from.slice(0,100)}`);fs.writeFileSync(file,parts.join(to));}
change('dist/souls.js',"ppRules.usable(f,id,freeDoorChoice4888(f,id)","ppRules.usable(f,id,E.WIKI.effectsEngine.registry[2610].ignoresPP(f)||freeDoorChoice4888(f,id)");
change('dist/souls.js',"op=>op.effectId===2210&&op.phase==='beforeSelect'","op=>op.phase==='beforeSelect'");
change('dist/souls.js',"const ppConsumptionPolicy={...skillContext(a,t,m),first,noPPConsumption:!!m.charm1999}","const ppConsumptionPolicy={...skillContext(a,t,m),first,noPPConsumption:!!m.charm1999||E.WIKI.effectsEngine.registry[2610].ignoresPP(a)}");
change('dist/souls.js',"function inflict(a,t,n,source,type='true',bypass=false,reflected=false,minimumHp=0,resolution=null){","function inflict(a,t,n,source,type='true',bypass=false,reflected=false,minimumHp=0,resolution=null){type=E.WIKI.effectsEngine.registry[2610].damageType(a,type);");
change('dist/souls.js',"E.SOULS.run('beforeHealthDamage',shared);if(resolution&&shared.immune===true)","E.WIKI.effectsEngine.registry[2610].lethal(shared);E.SOULS.run('beforeHealthDamage',shared);if(resolution&&shared.immune===true)");
change('dist/souls.js',"E.SOULS.run('beforeHealthDamage',shared);remaining=voidBlocked753", "E.WIKI.effectsEngine.registry[2610].lethal(shared);E.SOULS.run('beforeHealthDamage',shared);remaining=voidBlocked753");
change('dist/souls.js',"E.SOULS.run('roundStart',context(f,fs[1-f.side],selectedBattleMove(1-f.side)));", "E.WIKI.effectsEngine.registry[2610].roundStart(context(f,fs[1-f.side]));E.SOULS.run('roundStart',context(f,fs[1-f.side],selectedBattleMove(1-f.side)));");
change('dist/souls.js',"return {a,t,m,renadoRecovery2132", "return {a,t,m,divineReborn(){return E.WIKI.effectsEngine.registry[2610].reborn(context(a,t,m));},renadoRecovery2132");
change('dist/souls.js',"f.soulId=E.SPECIES[f.species].soulId??E.SOULS.id(f);", "f.soulId=E.SPECIES[f.species].soulId??E.SOULS.id(f);f.soulHash=s.wikiSnapshots?.[f.side]?.souls?.find(x=>x.id===f.soulId)?.hash;");
change('dist/souls.js',"const settledDamage=Math.max(0,remaining);E.WIKI.effectsEngine.registry[2383]", "const settledDamage=Math.max(0,remaining);if(settledDamage>0)t.lastIncomingSettledAttackDamage=settledDamage;E.WIKI.effectsEngine.registry[2383]");
change('dist/effect-registry.js',"if(op.phase!==phase)continue;if(['afterHit','afterAttack']", "if(op.phase!==phase)continue;if(op.sourceMove){const originalMove=context.m;context.m={...op.sourceMove,replayRootMoveId:originalMove.replayRootMoveId??originalMove.id};try{run(phase,[{...op,sourceMove:null}],context);}finally{context.m=originalMove;}continue;}if(['afterHit','afterAttack']");
change('dist/soul-registry.js',"return Object.freeze({registry:Object.freeze(registry),id,trait,run,copiedDamageImmune});", "function acceptsSource(soulId,hash){const rule=registry[soulId];return !!rule&&(rule.sourceHash===hash||rule.sourceHashes?.includes(hash)===true);}\nreturn Object.freeze({registry:Object.freeze(registry),id,trait,run,copiedDamageImmune,acceptsSource});");
change('dist/wiki-support.js',"E.SOULS.registry[selected.id].sourceHash===selected.hash", "E.SOULS.acceptsSource(selected.id,selected.hash)");
change('local-species.cjs',"E.SOULS.registry[soul.id]?.sourceHash!==soul.hash", "!E.SOULS.acceptsSource(soul.id,soul.hash)");
change('automation-validate.cjs',"rule.sourceHash !== soul.hash", "!E.SOULS.acceptsSource(soul.id,soul.hash)");
console.log('training integration hooks written');
