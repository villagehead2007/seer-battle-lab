'use strict';
// One-time, bounded common-interface migration; never edits a species handler.
const fs=require('node:fs'),assert=require('node:assert/strict');
let text=fs.readFileSync('dist/souls.js','utf8');
function change(a,b){assert.equal(text.split(a).length,2,'unique anchor: '+a);text=text.replace(a,b);}
change('Math.floor(n)));f.hp+=v;', 'Math.floor(n*statusRules.healingMultiplier(f,r))));f.hp+=v;');
change("function inflict(a,t,n,source,type='true',bypass=false,reflected=false){return hurt", "function inflict(a,t,n,source,type='true',bypass=false,reflected=false){if(statusRules.preventsDamage(a,t,type,r))return 0;return hurt");
change('durationFallback:{origin:', 'source,durationFallback:{origin:');
change('clearAilment(f,k){return statusRules.clear(f,k);},clearAilments(f){return statusRules.clearAll(f);}', 'clearAilment(f,k){return statusRules.clear(f,k,n=>statusRemoved(f,n));},clearAilments(f){return statusRules.clearAll(f,n=>statusRemoved(f,n));}');
change('    function context(a,t,m=null)', "    function unresolvedStatus(issue){s.pendingStatusTransitions??=[];s.pendingStatusTransitions.push(issue);emit(`${name(fs[issue.side])} ${issue.from}转化${issue.to}仍待核实：${issue.missing.join('、')}。`);}\n    function statusRemoved(f,k){statusRules.removed(f,k,r,{hurt:(target,n,source,type)=>hurt(target,n,source,type),unresolved:unresolvedStatus});}\n    function context(a,t,m=null)");
change('    const dawnFast=fs.map', "    fs.forEach((f,i)=>{if(battleMoves[choices[i]].kind!=='item')priorities[i]=statusRules.priority(f,r,priorities[i]);});\n    const dawnFast=fs.map");
change('modifier,first};E.SOULS.run', 'modifier:modifier*statusRules.attackMultiplier(a,r),first};E.SOULS.run');
change("E.SOULS.trait(a,'minimumAttackDamage')??0,on(a,'攻击最低伤害')", "E.SOULS.trait(a,'minimumAttackDamage')??0,statusRules.minimumAttackDamage(t,r,crit),on(a,'攻击最低伤害')");
change('      if(statusRules.attackHit(t,r))', "      if(statusRules.preventsDamage(a,t,'attack',r))remaining=0;\n      statusRules.fireHit(t,r,m.type,unresolvedStatus);\n      if(statusRules.attackHit(t,r))");
change("if(!rage)E.SOULS.run('attackDamageTaken',{...context(t,a,m),dealt});", "if(!rage)E.SOULS.run('attackDamageTaken',{...context(t,a,m),dealt});statusRules.attackDealt(a,t,r,dealt,inflict);");
change('      if(statusRules.blocksAction(a,r)', '      statusRules.actionStart(a,m,r,battleMoves);\n      if(statusRules.blocksAction(a,r,t)');
change('const blocked=a.soulState.skillInvalidRound===r', 'const blocked=statusRules.skillInvalid(a,m,r,()=>rng(s))||a.soulState.skillInvalidRound===r');
change('    for(const f of fs){if(f.hp>0&&f.soulState.dragonScaleTriggered', '    for(const f of fs)statusRules.roundEnd(f,r);\n    for(const f of fs){if(f.hp>0&&f.soulState.dragonScaleTriggered');
change('statusRules.expire(f,r,k=>{emit(', 'statusRules.expire(f,r,k=>{statusRemoved(f,k);emit(');
fs.writeFileSync('dist/souls.js',text);
let wiki=fs.readFileSync('dist/wiki-support.js','utf8');const anchor='wikiId:m.id,...(m.hiddenEffect';assert.equal(wiki.split(anchor).length,2);wiki=wiki.replace(anchor,'wikiId:m.id,fifth:m.fifth===true,...(m.hiddenEffect');fs.writeFileSync('dist/wiki-support.js',wiki);
