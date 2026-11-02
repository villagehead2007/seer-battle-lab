const fs=require('fs'),crypto=require('crypto'),p='research/parallel-drafts/4450/',s=fs.readFileSync('dist/souls.js','utf8'),ch=JSON.parse(fs.readFileSync(p+'changes.json'));
const start=s.indexOf("      else {E.SOULS.run('beforeSkillHit'"),end=s.indexOf('\n      if(actionPayloadAllowed&&curseThis',start),original=s.slice(start,end),body=original.slice('      else {'.length,-1);
if(!body.endsWith('}'))throw Error('body end');
// Extract the existing hit/compiled payload/afterAttack chain verbatim for shared component execution.
let helperBody=body.replace('actionLanded=landed;', 'actionLanded ||= landed;').replace('useAttackDamage=totalSettled;', 'useAttackDamage+=totalSettled;').replace('actionPayloadAllowed=skillPayloadAllowed;', 'actionPayloadAllowed ||= skillPayloadAllowed;');
const decl="      let useAttackDamage=0,actionLanded=false,actionPayloadAllowed=false;";
const helper=`${decl}
      // A replay is a component of this use: no PP, actionStart, skillUses, before/afterUse soul event or endAction entry.
      const executeHitComponent=(m,cachedCrit,forceCriticalHit,accuracyContext)=>{${helperBody}};
      reproduceSkillComponent=(parsed)=>{
        if(a.hp<=0||t.hp<=0)return;
        const m={...parsed,reproducedParsedAttack:parsed.kind!=='status'},savedSegments=a.soulState.attackSegmentsThisUse,savedSegment=a.soulState.currentAttackSegment;
        try{
          const blocked=on(a,'skillBlock')||on(a,m.kind==='status'?'statusBlock':'attackBlock')||(m.kind==='status'&&r<=(E.SOULS.trait(t,'entryStatusBlockRounds')??0));
          const accuracyContext={...skillContext(a,t,m),alwaysHit:false};E.WIKI.effectsEngine.run('beforeAccuracy',m.operations,accuracyContext);
          const alwaysHit=accuracyContext.alwaysHit||m.alwaysHit||on(a,'战之龙魂')||(m.kind==='status'?on(a,'属性必中'):on(a,'攻击必中')||E.SOULS.trait(a,'attackAlwaysHit')||m.kind==='special'&&E.SOULS.trait(a,'specialAlwaysHit'));
          const miss=!alwaysHit&&rng(s)*100>=Math.min(100,m.accuracy*E.multiplier(ignoresBoosts(a)?Math.min(0,actionStage(a,'acc')):actionStage(a,'acc')))*(E.SOULS.trait(t,'opponentAccuracyMultiplier')??1)*statusRules.accuracyMultiplier(a,m.kind,r);
          const forcedMiss=!alwaysHit&&(m.kind!=='status'&&(on(a,'攻击必失')||on(t,'攻击必失且命中封属'))||m.kind==='physical'&&on(t,'物理攻击闪避')||m.kind==='special'&&on(t,'特殊攻击闪避'));
          const dodge={...context(t,a,m),alwaysHit,blocked,blind:false,miss,forcedMiss,dodge:false};if(!blocked&&!miss&&!forcedMiss){if(m.kind!=='status')E.SOULS.run('beforeDodge',dodge);E.SOULS.run('beforeSkillDodge',dodge);}
          const chance=Math.max(m.kind!=='status'?(E.SOULS.trait(t,'dodgeChance')??0):0,E.SOULS.trait(t,'skillDodgeChance')??0),evaded=dodge.dodge||!alwaysHit&&chance>0&&rng(s)<chance;
          if(blocked||miss||forcedMiss||evaded){const c={...skillContext(a,t,m),first,invalidReason:{blocked,blind:false,miss,forcedMiss,evaded},heal:(f,n,l)=>heal(f,n,l,'skill')};if(!blocked)E.WIKI.effectsEngine.run('onMiss',m.operations,c);E.WIKI.effectsEngine.run('onInvalid',m.operations,c);return;}
          executeHitComponent(m,null,false,accuracyContext);
          if(!skillContext(a,t,m).hitEffectsDisabled&&a.hp>0)E.WIKI.effectsEngine.run('afterUse',m.operations,{...skillContext(a,t,m),heal:(f,n,l)=>heal(f,n,l,'skill'),first});
        }finally{if(savedSegments===undefined)delete a.soulState.attackSegmentsThisUse;else a.soulState.attackSegmentsThisUse=savedSegments;if(savedSegment===undefined)delete a.soulState.currentAttackSegment;else a.soulState.currentAttackSegment=savedSegment;}
      };`;
ch.push({file:'dist/souls.js',before:decl,after:helper});ch.push({file:'dist/souls.js',before:original,after:'      else executeHitComponent(m,cachedCrit,forceCriticalHit,accuracyContext);'});
ch.push({file:'dist/souls.js',before:'    function skillContext(a,t,m){const c=context',after:'    let reproduceSkillComponent=null;\n    function skillContext(a,t,m){const c=context'});
ch.push({file:'dist/souls.js',before:'return {...c,t:view,hitEffectsDisabled:',after:'return {...c,t:view,reproduceSkillComponent:parsed=>reproduceSkillComponent(parsed),hitEffectsDisabled:'});
ch.push({file:'dist/souls.js',before:"      if(crit&&on(a,'暴击攻击增伤'))",after:"      if(m.reproducedParsedAttack)modifier*=1.5;\n      if(crit&&on(a,'暴击攻击增伤'))"});
ch[1].after="add(1894,'beforeUse',c=>{const parsed=c.a.soulState.futureParsedMove,m=parsed?c.moveDefinition(parsed.id):null;if(!m||m.name===c.m.name){c.hurt(c.t,300,c.m.name+'未解析追加','true');c.heal(c.a,300,c.m.name+'理论等量回复','skill');return;}if(typeof c.reproduceSkillComponent!=='function')throw Error('1894缺少整招内部组件执行器');c.reproduceSkillComponent(m);});registry[1894]=Object.freeze({...registry[1894],hooks:{...registry[1894].hooks,beforeOrder(c){const p=c.a.soulState.futureParsedMove,m=p?c.moveDefinition(p.id):null;if(m&&m.name!==c.m.name)c.priority+=m.priority??0;}}});";
// Existing later wrapper multiplies only when 1894 is itself in copied operations; prevent accidental double multiplier.
const old="beforeDamage(c){if(c.m.reproducedParsedAttack)c.modifier*=1.5;}";
ch.push({file:'dist/range-effects.js',before:old,after:'beforeDamage(c){}'});
fs.writeFileSync(p+'changes.json',JSON.stringify(ch,null,2)+'\n');fs.writeFileSync(p+'component-extraction.original.txt',original);fs.writeFileSync(p+'component-extraction.after.txt',helper);
