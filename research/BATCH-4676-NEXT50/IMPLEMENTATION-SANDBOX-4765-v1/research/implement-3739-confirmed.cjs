const fs=require('fs');let p='dist/souls.js',s=fs.readFileSync(p,'utf8');s=s.replace("  E.STATUS_RULES=statusRules;",`  E.STATUS_RULES=statusRules;
  function temporaryHp(f,key,amount){f.soulState.temporaryHp??={};if(f.soulState.temporaryHp[key])return;const bonus=Math.floor(amount);f.soulState.temporaryHp[key]={bonus};f.stats.maxHp+=bonus;f.hp=Math.min(f.stats.maxHp,f.hp+bonus);}
  function removeTemporaryHp(f,key){const e=f.soulState.temporaryHp?.[key];if(!e)return;f.stats.maxHp-=e.bonus;f.hp=Math.min(f.hp,f.stats.maxHp);delete f.soulState.temporaryHp[key];}
  function temporaryHpRemaining(f,key){const e=f.soulState.temporaryHp?.[key];return e?Math.max(0,f.hp-(f.stats.maxHp-e.bonus)):0;}
`);
s=s.replace("{a,t:s.fighters[1-a.side],m,typeParts:type=>s.typeChart?.aliases[type]??[type]}","{a,t:s.fighters[1-a.side],m,temporaryHp,sourceSkill(id){const snapshot=s.wikiSnapshots[a.side],move=snapshot.moves.find(x=>x.id===id);if(!move)throw Error('代触发技能缺少真实来源 '+id);const compiled=E.WIKI.compile(move,snapshot);if(compiled.issue)throw Error(compiled.issue);return {...move,operations:compiled.operations};},typeParts:type=>s.typeChart?.aliases[type]??[type]}");
s=s.replace("    function finish(){const dead=",`    function resolveDeath(f){if(f.hp>0){delete f.soulState.deathResolved;return;}if(f.soulState.deathResolved)return;f.soulState.deathResolved=true;E.SOULS.run('death',context(f,fs[1-f.side]));if(f.hp>0)delete f.soulState.deathResolved;}
    function finish(){for(const f of fs)resolveDeath(f);const dead=`);
s=s.replace("f.roundDamageTaken+=dealt;emit", "f.roundDamageTaken+=dealt;resolveDeath(f);emit");
s=s.replace("f.hp-=v;f.roundDamageTaken", "f.hp-=v;resolveDeath(f);f.roundDamageTaken");
s=s.replace("t.hp-=dealt;if(dealt>","t.hp-=dealt;resolveDeath(t);if(dealt>");
s=s.replace("syncStages:()=>{syncStages();for(const f of fs)","syncStages:()=>{for(const f of fs)resolveDeath(f);syncStages();for(const f of fs)");
s=s.replace("if(type==='true')statusRules.trueDamageTaken(f,r,v,heal);", "if(type==='true'){statusRules.trueDamageTaken(f,r,v,heal);if(f.soulState.forest){clear(fs[1-f.side]);context(f,fs[1-f.side]).clearBoost(fs[1-f.side]);}}" );
// Passive field effects reuse compiled source operations without selection, PP, accuracy or use hooks.
s=s.replace("    function finish(){for",`    function triggerEffects(a,t,move){if(a.hp<=0)return;E.WIKI.effectsEngine.run('afterHit',move.operations,{...context(a,t,move),heal:(f,n,label)=>heal(f,n,label,'skill'),dealt:0,crit:false,first});}
    function finish(){for`);
s=s.replace("      if(t.hp>0&&a.hp>0)E.SOULS.run('opponentAfterUse'",`      if(t.hp>0&&a.hp>0&&t.soulState.forest){const field=t.soulState.forest;hurt(t,m.power,'苍茫树海','true',true,false,t);for(let i=0;i<Math.floor(field.life/210)&&t.hp>0&&a.hp>0;i++)triggerEffects(t,a,field.attackEffects);}
      if(t.hp>0&&a.hp>0)E.SOULS.run('opponentAfterUse'`);
s=s.replace("      E.SOULS.run('roundEnd',c);", "      E.SOULS.run('roundEnd',c);if(f.hp>0&&f.soulState.forest){const field=f.soulState.forest;c.restorePP(f,2);for(let i=0;i<Math.floor(field.life/210)&&f.hp>0&&fs[1-f.side].hp>0;i++)triggerEffects(f,fs[1-f.side],field.endEffects);}");
s=s.replace("    for(const f of fs){expireOtherCrit(f);", "    for(const f of fs)if(f.soulState.forest&&temporaryHpRemaining(f,'forest')===0){delete f.soulState.forest;removeTemporaryHp(f,'forest');}\n    for(const f of fs){expireOtherCrit(f);");
fs.writeFileSync(p,s);
p='dist/range-effects.js';s=fs.readFileSync(p,'utf8');const at=s.lastIndexOf('});');s=s.slice(0,at)+`\nmetadata[2190]={info:'{0}',args_num:1};
add(2190,'battleStart',(c,p)=>{if(c.a.soulState.forest)return;const life=Math.floor(c.a.stats.maxHp*.21);c.temporaryHp(c.a,'forest',life);c.a.soulState.forest={life,attackEffects:c.sourceSkill(22517),endEffects:c.sourceSkill(19461)};},[[11,11]]);
`+s.slice(at);fs.writeFileSync(p,s);
p='dist/range-souls.js';s=fs.readFileSync(p,'utf8');const a=s.lastIndexOf('});');s=s.slice(0,a)+`\nregistry[1017]={name:'玛洛迪斯',sourceHash:'c80900bd',traits:{},hooks:{
death(c){if(c.a.soulState.rebirthAttempted)return;c.a.soulState.rebirthAttempted=true;if(c.random()<.5){c.a.hp=c.a.stats.maxHp;c.restorePP(c.a,Infinity);c.clearBoost(c.t);c.clear(c.t);}else c.timed(c.t,'statusBlock',3,{});},
afterAttack(c){if(c.a.hp<=0)return;if(c.dealt>300&&c.t.hp>0){const n=c.hurt(c.t,300,'玛洛迪斯魂印吸取','fixed');c.heal(c.a,n,'玛洛迪斯魂印吸取');}else if(c.dealt<300)c.timed(c.a,'必定暴击',1,{},c.round+1);}
}};
`+s.slice(a);fs.writeFileSync(p,s);
