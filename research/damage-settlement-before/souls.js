(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.BattleSouls = factory;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (E) {
  'use strict';
  const statusRules=typeof module==='object'&&module.exports?require('./status-rules.js'):globalThis.BattleStatusRules;
  E.STATUS_RULES=statusRules;
  const celestialRules=typeof module==='object'&&module.exports?require('./celestial-rules.js'):globalThis.BattleCelestialRules;
  E.CELESTIAL_RULES=celestialRules;
  const effectiveStage=(f,k)=>{const raw=f.stages[k],n=f.soulState?.inverseMight??0;return n>0&&raw<0?Math.max(-raw,n):(f.soulState?.mirrorStageView?.[k]??raw);};const baseEffective=E.effective;E.effective=(f,k)=>{const n=effectiveStage(f,k);return n===f.stages[k]?baseEffective(f,k):Math.max(1,Math.floor(f.stats[k]*E.multiplier(n)));};
  const shieldRules=typeof module==='object'&&module.exports?require('./shield-rules.js'):globalThis.BattleShieldRules;
  const healthRules=typeof module==='object'&&module.exports?require('./health-rules.js'):globalThis.BattleHealthRules;
  function temporaryHp(f,key,amount){f.soulState.temporaryHp??={};if(f.soulState.temporaryHp[key])return;const bonus=Math.floor(amount);f.soulState.temporaryHp[key]={bonus};f.stats.maxHp+=bonus;f.hp=Math.min(f.stats.maxHp,f.hp+bonus);}
  function removeTemporaryHp(f,key){const e=f.soulState.temporaryHp?.[key];if(!e)return;f.stats.maxHp-=e.bonus;f.hp=Math.min(f.hp,f.stats.maxHp);delete f.soulState.temporaryHp[key];}
  function temporaryHpRemaining(f,key){const e=f.soulState.temporaryHp?.[key];return e?Math.max(0,f.hp-(f.stats.maxHp-e.bonus)):0;}

  const statusPools=typeof module==='object'&&module.exports?require('./status-pools.js'):globalThis.BattleStatusPools;
  const ppRules=typeof module==='object'&&module.exports?require('./pp-rules.js'):globalThis.BattlePPRules;
  E.PP_RULES=ppRules;
  E.availableMoves=function(f){const moves=f.moves.filter(id=>ppRules.usable(f,id,!!E.SOULS.trait(f,'ignorePP')));return [...(moves.length?moves:['struggle']),'potion:hp','potion:pp'];};
  E.SOULS=typeof module==='object'&&module.exports?require('./soul-registry.js'):globalThis.BattleSoulRegistry;
  // The independent simulator's timing contract is documented in RULES.md.
  const physical = (id, name, type, power, pp, description, extra = {}) => ({ id, name, type, power, pp, kind:'physical', category:'物理', accuracy:100, alwaysHit:true, description, ...extra });
  const status = (id, name, description) => ({ id, name, type:'属性', power:0, pp:5, kind:'status', category:'属性', accuracy:100, alwaysHit:true, description });
  const moves = {
    emperor5: physical('emperor5','万皇宗魄决','自然圣灵',160,5,'第五 · 暴击率逐次增加；暴击后下 2 次技能的皇怒不减威力。皇怒：下 2 次攻击先制 +2。',{slot:'第五技能'}),
    emperor150: physical('emperor150','亘古圣辰决','自然圣灵',150,5,'伤害不足 280 则疲惫；未击败则封锁对手下回合攻击。皇怒：50% 失明，否则封属 2 回合。',{slot:'150 大招'}),
    emperorQuick: physical('emperorQuick','圣世惩杀','自然圣灵',85,20,'消回合成功则随机清空 2 项 PP；消强成功提高皇怒概率。皇怒：对手无强化时追加 1/3 体力伤害。',{priority:3,accuracy:96,alwaysHit:false,slot:'先手技能'}),
    gate: status('gate','瀚空之门','3 回合干扰对手：属性招扣 PP，攻击招后扣 1/3 体力；免疫下 2 次异常。皇怒：免断回合、下 2 回合先制 +2。'),
    cycle: status('cycle','命宇轮回','全属性 +1，半血以下翻倍；4 回合用招吸血；下 2 次皇怒概率翻倍。皇怒：增伤 2 回合、下 2 次受击减伤。'),
    king5: physical('king5','王·万霆朝宗','电',160,5,'第五 · 无视微弱；消回合成功则下回合伤害翻倍；未击败则全属性 +1，下回合先制 +2。',{slot:'第五技能'}),
    king150: physical('king150','寰宇雷神断','电',150,5,'50% 麻痹；自身每一项能力强化再增加 8% 概率。',{slot:'150 大招'}),
    kingQuick: physical('kingQuick','雷裂残阳','电',85,20,'先出手封锁对手当回合属性招；有强化时伤害 +50%；回复实际攻击伤害。',{priority:3,accuracy:95,alwaysHit:false,slot:'先手技能'}),
    inherit: status('inherit','传承王意','全属性 +1，体力低于对手则翻倍；2 回合用招回满体力；5 回合免疫并反弹异常。'),
    stormKing: status('stormKing','霹雳风暴','全属性 +1；3 回合用招回复 1/3 体力；4 回合免疫反弹异常；2 回合免断，后手延长 1 回合。')
  };
  // Verified compound moves now reuse the same ID handlers as online generic skills.
  moves.king5.operations=[
    {effectId:760,index:0,phase:'beforeDamage',params:{}},
    {effectId:913,index:1,phase:'afterHit',params:{bonus:1}},
    {effectId:983,index:2,phase:'afterHit',params:{amount:1}},
    {effectId:984,index:3,phase:'afterHit',params:{amount:2}}
  ];
  moves.kingQuick.operations=[
    {effectId:842,index:1,phase:'beforeDamage',params:{bonus:.5}},
    {effectId:101,index:2,phase:'afterHit',params:{fraction:1}}
  ];
  E.MOVES = Object.freeze({ ...E.MOVES, ...moves });
  E.SPECIES.emperor = {name:'瀚宇星皇',number:'3291',type:'自然圣灵',base:{maxHp:170,atk:135,def:115,spa:70,spd:112,spe:128},moves:['emperor5','emperor150','emperorQuick','gate','cycle'],soul:'皇',soulText:'免固定、百分比伤害与弱化；五招用后 50% 判定皇怒，未命中或被封招也判定。星皇之赐：行动后回复 1/8 体力；首发星皇之佑：前 3 回合免异常。皇怒追加行动不扣 PP、不接受对手响应。'};
  E.SPECIES.king = {name:'王·雷伊',number:'3142',type:'电',base:{maxHp:151,atk:130,def:110,spa:70,spd:109,spe:130},moves:['king5','king150','kingQuick','inherit','stormKing'],soul:'雷 · 强化',soulText:'回合开始、结束吸取对手强化；开始时将对手回合效果缩为 1 回合。回合开始体力较高：回合末攻击 +2、速度和命中 +1；较低：本回合免断回合。'};
  const copy = x => JSON.parse(JSON.stringify(x));
  const classicCreate = E.createBattle, classicResolve = E.resolveTurn;
  const keys = Object.keys(E.STAGE_LABELS);
  const effectNames = {id57:'用招回复体力',id913:'下回合攻击增伤',id984:'下回合先制提升',回合末当前体力吸取:'持续吸取当前体力',gate:'瀚空之门',drain:'命宇吸血',reflect:'免疫反弹异常',protect:'免断回合',priority:'全技能先制 +2',doubleDamage:'攻击伤害 ×2',rageBonus:'皇怒概率 +20%',attackBlock:'攻击技能无效',statusBlock:'属性技能无效',fullHeal:'用招回满体力',thirdHeal:'用招回复 1/3'};
  const countNames = {nextDamageDouble:'下次受伤翻倍',attackReductionUses:'攻击减伤',attackNullify:'攻击免疫',nextDamageReturn:'受击返还比例',nextDamageReduction:'下次受伤减免点数',attackReflect:'攻击免疫返还',nextSkillInvalid:'下次技能无效',immune:'异常免疫',rageDouble:'皇怒概率翻倍',rageFull:'皇怒完整威力',attackPriority:'攻击先制 +2',nextAttackPriority:'攻击先制提升',nextAttackBoost:'攻击增伤',halfDamage:'受击减伤 50%'};
  const active = (f,k,r) => f.effects[k] && f.effects[k].start <= r && f.effects[k].end >= r;
  // Effect 642's action parameter is a reaction-strength enum.  These values
  // are fixed damage amounts in the source wording (1=轻微, 2=强力,
  // 3=超强, 4=绝对, 5=完美).  3575 uses action 2 (150 fixed damage).
  const reactionFixedDamage = Object.freeze({1:50,2:150,3:200,4:250,5:300});
  const boosted = f => keys.filter(k=>f.stages[k]>0);
  // Numeric shields share a category; barriers and dodge windows are distinct.
  const shieldValue=f=>(f.suitState?.shield??0)+(f.soulState?.attackShield??0)+(f.soulState?.marsShield??0);
  function rng(s) { s.rng=(s.rng+0x6D2B79F5)>>>0;let t=s.rng;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296; }
  E.createBattle = function (options = {}) {
    const savedMoves=E.MOVES,savedSpecies={...E.SPECIES};
    try {
    const online=options.wikiSnapshots?E.WIKI.prepare(options.wikiSnapshots,options.wikiLoadouts):null;
    if(online)for(const snapshot of options.wikiSnapshots)E.TYPES.assertChart(snapshot.typeChart);
    const s = classicCreate({...options,species:options.species ?? online?.map(x=>x.species) ?? ['emperor','king'],seed:options.seed ?? 'emperor-king-001'});
    if(online){s.typeChart=copy(online[0].typeChart??null);s.moveDefinitions=copy(E.MOVES);s.wikiSnapshots=copy(options.wikiSnapshots);s.initial.wikiSnapshots=copy(options.wikiSnapshots);s.initial.wikiLoadouts=copy(options.wikiLoadouts??options.wikiSnapshots.map(x=>E.WIKI.defaultMoves(x)));s.fighters.forEach((f,i)=>{if(f.species!==online[i].species)throw new Error('在线精灵与对局不匹配');f.moves=online[i].moves;f.pp=Object.fromEntries(f.moves.map(id=>[id,E.MOVES[id].pp]));});}
    s.version = E.VERSION;
    s.fighters.forEach(f=>{ f.soulId=E.SPECIES[f.species].soulId??E.SOULS.id(f); f.effects={}; f.counts={}; f.ailments={}; f.soulState={energy:0,previousRoundStages:{...f.stages}};if(f.soulId===708){f.soulState.marsForm='speed';f.soulState.marsShield=300;f.counts.immune=1;}if(f.moves.some(id=>s.moveDefinitions?.[id]?.operations?.some(op=>op.effectId===2395)))f.soulState.kubesaPartner=true;if(Number(f.number)===3425&&f.moves.includes('wiki:38525'))f.soulState.oscarBlessings=true;if(E.SOULS.trait(f,'entryAttackShield'))f.soulState.attackShield=E.SOULS.trait(f,'entryAttackShield'); f.fifthUses=0; f.resistUntil=0; f.suitState={stacks:0,royalBoost:false,royalFollowRound:0,shield:0,barrier:0,judgmentBonus:0,judgmentReduction:0}; });
    for(const f of s.fighters){const resistance=E.SOULS.trait(f,'entryDamageResistance')??0;if(resistance)for(const k of ['critical','fixed','percent'])f.build.resistance[k]=Math.min(100,f.build.resistance[k]+resistance);const gain=E.SOULS.trait(f,'entryMaxHp')??0;if(gain){f.stats.maxHp+=gain;f.hp+=gain;}}
    if(online)for(const f of s.fighters){const own=s.wikiSnapshots[f.side];f.gender=own.gender?.id;for(const snapshot of s.wikiSnapshots){const evidence=snapshot.targetGenderSources?.[own.id];if(f.gender===undefined&&evidence&&evidence.revision===own.source.revision)f.gender=evidence.genderId;}const parts=f.moves.flatMap(id=>s.typeChart?.aliases[s.moveDefinitions[id].type]??[]);f.soulState.butterflyMoveTypes={light:parts.filter(x=>x==='光').length,shadow:parts.filter(x=>x==='暗影').length};}
    for(const a of s.fighters)E.SOULS.run('battleStart',{a,t:s.fighters[1-a.side],addShield:shieldRules.add});
    for(const a of s.fighters)for(const id of a.moves){const m=(s.moveDefinitions??E.MOVES)[id];E.WIKI.effectsEngine.run('battleStart',m.operations,{a,t:s.fighters[1-a.side],m,temporaryHp,sourceSkill(id){const snapshot=s.wikiSnapshots[a.side],move=snapshot.moves.find(x=>x.id===id);if(!move)throw Error('代触发技能缺少真实来源 '+id);const compiled=E.WIKI.compile(move,snapshot);if(compiled.issue)throw Error(compiled.issue);return {...move,operations:compiled.operations};},typeParts:type=>s.typeChart?.aliases[type]??[type]});}
    return s;
    } catch(error){E.MOVES=savedMoves;for(const key of Object.keys(E.SPECIES))if(!Object.hasOwn(savedSpecies,key))delete E.SPECIES[key];Object.assign(E.SPECIES,savedSpecies);throw error;}
  };
  E.describeEffects = function (f,round) {
    const result=[];
    if(round<=(E.SOULS.trait(f,'entryAilmentRounds')??0)) result.push(`星皇之佑 · 余 ${4-round} 回合`);
    for(const [k,e] of Object.entries(f.effects ?? {})) if(e.end>=round) result.push(`${effectNames[k]??k} · ${e.start>round?'下回合起 · ':''}余 ${e.end-Math.max(round,e.start)+1} 回合`);
    for(const [k,n] of Object.entries(f.counts ?? {})){if(k==='nextAttackMissAilment'){result.push(`下次攻击未命中：${n}`);continue;}if(n<=0)continue;if(k==='nextDefenseIgnore')result.push(`下次攻击忽略双防 · ${Math.round(n*100)}%`);else if(k==='nextDamageReturn')result.push(`下次受击反馈 · ${Math.round(n*100)}%`);else if(k==='nextDamageReduction')result.push(`下次受伤减免 · ${n} 点`);else result.push(`${countNames[k]??k} · 余 ${n} 次`);}
    for(const [k,e] of Object.entries(f.ailments ?? {})) if(e>=round) result.push(`${k} · 余 ${e-round+1} 回合`);
    if(f.resistUntil>=round)result.push(`抗性免疫 · 余 ${f.resistUntil-round+1} 回合`);
    if(f.soulState?.attackShield)result.push(`魂印攻击护盾 · ${f.soulState.attackShield}`);
    if(f.soulState?.energy)result.push(`神耀能量 · ${f.soulState.energy} 层`);
    if(f.soulState?.oscarBlessings)result.push('熔／霜／灿之加护');
    if(f.soulState?.oscarPriority?.round===round)result.push(`加护先制 +${f.soulState.oscarPriority.amount}`);
    if(f.suitState?.stacks)result.push(`胜天之力 · ${f.suitState.stacks}/10 层`);
    if(f.suitState?.royalBoost)result.push('皇御 · 下次攻击 +40%');
    if(f.suitState?.royalFollowRound===round)result.push('皇御 · 本回合攻击附加百分比');
    if(f.suitState?.corrodeRound===round)result.push('腐蚀 · 回合开始判定');
    if(f.suitState?.shield)result.push(`裁决护盾 · ${f.suitState.shield}`);
    if(f.suitState?.barrier)result.push(`裁决护罩 · ${f.suitState.barrier}`);
    return result;
  };
  E.typeEffectiveness=(attackType,targetType,chart)=>E.TYPES.effectiveness(attackType,targetType,chart);
  E.sameTypeBonus=(moveType,fighterType,chart)=>E.TYPES.stab(moveType,fighterType,chart);
  E.resolveTurn = function (previous,choices) {
    E.checkTypeVersion(previous.typeLibraryVersion);
    if(!previous.wikiSnapshots&&!previous.fighters.some(f=>['emperor','king'].includes(f.species))) return classicResolve(previous,choices);
    if(previous.finished) throw new Error('本场对战已结束，请重新开局。');
    if(!Array.isArray(choices)||choices.length!==2||choices.some((id,i)=>!E.availableMoves(previous.fighters[i]).includes(id))) throw new Error('请为双方选择有 PP 的技能。');
    const s=copy(previous),r=s.round,events=[],fs=s.fighters;
    const battleMoves=s.moveDefinitions??E.MOVES;
    const name=f=>`${f.side===0?'A':'B'} 方`;
    const emit=(text,kind='status',detail='')=>events.push({text,kind,detail});
    const on=(f,k)=>active(f,k,r);
    const ignoresBoosts=f=>(on(fs[1-f.side],'无视对手强化')||fs[1-f.side].soulState.ignoreTargetBoostRound===r)&&battleMoves[choices[1-f.side]].kind!=='item';
    const effective=(f,k)=>ignoresBoosts(f)&&f.stages[k]>0?f.stats[k]:E.effective(f,k);
    const gear=E.GEAR,wears=(f,id)=>f.build.suit===id;
    let stageSnapshot=fs.map(f=>({...f.stages})),syncingStages=false;
    let skillPhase=false,currentActorSide=null;
    let ailmentSnapshot=fs.map(f=>new Set(Object.keys(f.ailments)));
    // 731 reserves its own quota without restricting generic nextCrit grants.
    function expireOtherCrit(f){const e=f.effects['其他攻击必暴'];if((!e||e.end<r)&&f.soulState.otherCritReserved){f.counts.nextCrit=Math.max(0,(f.counts.nextCrit??0)-f.soulState.otherCritReserved);f.soulState.otherCritReserved=0;}}
    for(const f of fs)expireOtherCrit(f);
    let first=null;const used=[false,false],received=[false,false],attackBonus=[1,1];for(const f of fs){f.roundAttackDamage=0;f.roundShieldDamage=0;f.previousFixedDamageTaken=f.roundFixedDamageTaken??0;f.roundFixedDamageTaken=0;f.roundSkillDamageTaken=0;f.roundDamageDealt=0;f.previousDamageTaken=f.roundDamageTaken??0;f.roundDamageTaken=0;}
    const set=(f,k,n,start=r)=>{ f.effects[k]={start,end:start+n-1};emit(`${name(f)} 获得${effectNames[k]??k}（${start>r?'下回合起，':''}${n} 回合）。`); };
    const count=(f,k,n)=>{f.counts[k]=n;emit(`${name(f)} 获得${countNames[k]}（${n} 次）。`);};
    function healingMultiplier(f){return statusRules.healingMultiplier(f,r)*(on(f,'回复效果削减')?1-f.effects['回复效果削减'].fraction:1);}
    function heal(f,n,source,origin='') {if(f.hp<=0)return;if(origin==='skill'&&on(f,'技能禁疗')){emit(`${name(f)} 技能禁疗阻止回复。`);return;}const v=Math.max(0,Math.min(f.stats.maxHp-f.hp,Math.floor(n*healingMultiplier(f))));if(origin==='skill'&&on(f,'技能回复转伤害')){const e=f.effects['技能回复转伤害'];if(v>0)inflict(fs[e.sourceSide],f,v*e.fraction,'技能回复转伤害','percent');return;}f.hp+=v;if(v>0&&f.soulId===652)f.soulState.sagrosHealRound=r+1;emit(`${name(f)} ${source}：回复 ${v} 点体力。`,'heal');if(v>0){const bugs=(f.soulState.soulGu??[]).filter(g=>g.usedRound!==r);for(const g of bugs)g.usedRound=r;for(const g of bugs){if(f.hp<=0)break;const owner=fs[g.sourceSide];inflict(owner,f,40,'留魂之蛊汲取','true');if(owner.hp>0)heal(owner,40,'留魂之蛊回复');}}}
    function deathRetaliate(f,opponent){if(f.hp>0||!on(f,'击败反击保留1')||opponent.hp<=0)return;const n=f.effects['击败反击保留1'].amount;opponent.hp=Math.max(1,opponent.hp-n);delete f.effects['击败反击保留1'];emit(`${name(f)} 击败反击：${name(opponent)} 损失体力，至少保留 1 点。`,'damage');}
    function corpseLethal(a,t,n){if(a&&a!==t&&a.hp>0&&t.hp>0&&n>=t.hp&&a.soulState.corpseCount>0&&a.soulState.corpseLethalRound!==r){a.soulState.corpseLethalRound=r;for(const k of ['maxHp','atk','def','spa','spd','spe'])a.stats[k]+=50;}}
    function preventLethal(f,n){if(f.soulId===821&&r<=2&&f.hp>0&&n>=f.hp){if(skillPhase)f.soulState.emperorDeathReflect=n;emit(name(f)+' 帝皇之御魂印前两回合保留 1 点体力。');return Math.max(0,f.hp-1);}if(f.soulId===846&&f.hp>0&&n>=f.hp&&!f.soulState.chaosDeathSaved){f.soulState.chaosDeathSaved=true;f.soulState.chaosDeathSaveRound=r;emit(name(f)+' 混沌布莱克魂印首次死亡保留 1 点体力。');return Math.max(0,f.hp-1);}if(f.soulId===881&&f.hp>0&&n>=f.hp&&(!f.soulState.lightBlessing||f.soulState.lightBlessingRound===r)){f.soulState.lightBlessing=true;f.soulState.lightBlessingRound=r;emit(name(f)+' 光之惩戒魂印首次致死伤害触发圣光祝福，保留 1 点体力。');return Math.max(0,f.hp-1);}if(r===1&&f.hp>0&&n>=f.hp&&E.SOULS.trait(f,'firstRoundSurvive')){f.soulState.hadesRewardRound=r+1;emit(name(f)+' 哈迪斯首回合保命，残留1点体力。');return Math.max(0,f.hp-1);}return n;}
    function absorbMarsShield(f,n){if((f.soulState.inkTears??0)>=3||f.soulId!==708||!f.soulState.marsShield||n<=0)return n;const blocked=Math.min(n,f.soulState.marsShield);f.soulState.marsShield-=blocked;if(f.soulState.marsShield===0)f.soulState.marsShieldRestoreRound=r+2;emit(`${name(f)} 马尔修斯坚壁护盾抵挡 ${blocked} 点伤害。`);return n-blocked;}
    function suitShieldBreak(f,opponent,broken=true){if(broken)E.SOULS.run('shieldBroken',context(f,opponent));const gone=f.soulState.shieldGoneDrain;if(gone){delete f.soulState.shieldGoneDrain;drainPercent(f,opponent,gone.amount,'护盾消失吸取');const pool=opponent.moves.filter(id=>opponent.pp[id]>0);for(let i=0;i<gone.count&&pool.length;i++)opponent.pp[pool.splice(Math.floor(rng(s)*pool.length),1)[0]]=0;}const war=f.soulState.warShieldBreak;if(war){delete f.soulState.warShieldBreak;if(opponent.hp>0){inflict(f,opponent,war.amount,'战狂护盾消失','fixed');if(opponent.hp>0&&rng(s)<war.chance/100)ailment(opponent,war.ailment,f);}}if(shieldValue(f)===0)E.SOULS.run('allShieldsGone',context(f,opponent));if(f.soulState.xShieldBlockCount){opponent.counts.nextAttackInvalid=(opponent.counts.nextAttackInvalid??0)+f.soulState.xShieldBlockCount;delete f.soulState.xShieldBlockCount;}const e=f.soulState.pandoraShieldBreak;if(!e)return;delete f.soulState.pandoraShieldBreak;f.counts.nextAttackBoost=(f.counts.nextAttackBoost??0)+e.attacks;f.soulState.nextAttackBoostFraction=1;if(opponent.hp>0)inflict(f,opponent,e.damage,'潘多拉护盾破裂','fixed');}
    function consumeShields(f,opponent,broken=false){const n=shieldValue(f),ordinary=f.suitState.shield??0;f.suitState.shield=0;shieldRules.sync(f);f.soulState.attackShield=0;if(f.soulState.marsShield>0){f.soulState.marsShield=0;f.soulState.marsShieldRestoreRound=r+2;}if(ordinary>0)suitShieldBreak(f,opponent,broken);else if(n>0)E.SOULS.run('allShieldsGone',context(f,opponent));return n;}
    function jasmineBarrierGone(f){if(f.suitState.barrier!==0)return;if(f.soulState.barrierGoneHeal){const amount=f.soulState.barrierGoneHeal;delete f.soulState.barrierGoneHeal;heal(f,amount,'护罩消失回复','skill');}if(f.soulState.jasmineBarrierPP){const n=f.soulState.jasmineBarrierPP;delete f.soulState.jasmineBarrierPP;for(const id of f.moves)f.pp[id]=Math.min(battleMoves[id].pp,f.pp[id]+n);}if(f.soulState.sarikaBarrierBlock){const t=fs[1-f.side];t.counts.nextAttackInvalid=(t.counts.nextAttackInvalid??0)+f.soulState.sarikaBarrierBlock;delete f.soulState.sarikaBarrierBlock;}}
    function damageImmune(f,type){if(['fixed','percent'].includes(type)&&f.soulState.bloodCarry&&(statusInvalidKinds(f,fs[1-f.side])>0||f.ailments['失神']>=r||fs[1-f.side].ailments['失神']>=r))return true;return on(f,'当回合免伤')||(['fixed','percent'].includes(type)&&(!!E.SOULS.trait(f,'pinkImmune')||f.soulId===622||(f.soulId==null&&f.species==='emperor')));}
    function hurt(f,n,source,type='true',bypass=false,reflected=false,origin=null) {
      if(type===true)type='percent';
      if(f.hp<=0)return 0;
      if(type==='direct'){const dealt=Math.min(f.hp,Math.max(0,Math.floor(n)));f.hp-=dealt;f.roundDamageTaken+=dealt;resolveDeath(f);emit(`${name(f)} ${source}：直接损失 ${dealt} 点体力。`,'damage');return dealt;}
      if(!bypass&&on(f,'当回合免伤'))return 0;
      if(!bypass&&type==='fixed'&&E.SOULS.trait(f,'fixedReflect')){emit(`${name(f)} 神耀能量免疫并反弹固定伤害。`);if(!reflected)inflict(f,fs[1-f.side],n,'神耀反弹','fixed',false,true);return 0;}
      const incoming={...context(f,origin??fs[1-f.side]),amount:n*(on(f,'所受伤害倍增')?f.effects['所受伤害倍增'].multiple:1),type};if(!bypass)E.SOULS.run('beforeIncomingDamage',incoming);
      let amount=gear.mitigate(f,incoming.amount,type,{bypass});if(!bypass)amount=Math.floor(amount*(1-(E.SOULS.trait(f,'allDamageReduction')??0)));if(!bypass&&on(f,'全伤害减半'))amount=Math.floor(amount*.5);if(!bypass&&(f.soulState.zeusFirst||f.soulState.lateReduction))amount=Math.floor(amount*.5);
      if(!bypass&&['fixed','percent'].includes(type)&&on(f,'御之龙魂'))amount=Math.floor(amount*.75);
      if(!bypass&&type==='fixed')amount=Math.floor(amount*(1-(E.SOULS.trait(f,'fixedReduction')??0)));
      if(!bypass&&type==='fixed'&&f.soulState?.lowHp)amount=Math.floor(amount*.5);
      if(!bypass&&['fixed','percent'].includes(type)&&f.soulState?.scarPinkReduction)amount=Math.floor(amount*2/3);
      if(!bypass&&['fixed','percent'].includes(type)&&amount>0&&f.counts.nextPinkReduction>0){amount=Math.floor(amount*(1-f.soulState.nextPinkReductionFraction));f.counts.nextPinkReduction--;}
      if(!bypass&&f.soulId===543&&f.hp<fs[1-f.side].hp)amount=Math.floor(amount*.51);
      if(['fixed','percent'].includes(type)){
        if(damageImmune(f,type)&&!bypass){emit(`${name(f)} 魂印「皇」免疫${source}的${type==='fixed'?'固定':'百分比'}伤害。`);return 0;}
        if(!bypass&&amount!==Math.floor(n))emit(`${name(f)} ${source}伤害减免：${Math.floor(n)} → ${amount}（抗性 ${f.build.resistance[type]}%${wears(f,'destiny')?`，胜天 ${f.suitState.stacks} 层`:''}）。`);
        if(!bypass&&f.suitState.barrier>0){const block=Math.min(amount,f.suitState.barrier);amount-=block;f.suitState.barrier-=block;jasmineBarrierGone(f);emit(`${name(f)} 护罩抵挡 ${block} 点伤害。`);}
        if(!bypass&&(f.soulState.inkTears??0)<3&&f.suitState.shield>0){const block=shieldRules.absorb(f,amount);amount-=block;f.roundShieldDamage+=block;emit(`${name(f)} 护盾抵挡 ${block} 点伤害。`);if(block&&f.suitState.shield===0)suitShieldBreak(f,origin??fs[1-f.side]);}
      }
      const doubledIncoming=!bypass&&amount>0&&f.counts.nextDamageDouble>0;if(doubledIncoming)amount*=2;
      if(!bypass&&on(f,'伤害定额减免'))amount=Math.max(0,amount-f.effects['伤害定额减免'].amount);
      if(!bypass&&on(f,'下回合伤害减免'))amount=Math.max(0,amount-f.effects['下回合伤害减免'].amount);
      if(!bypass&&on(f,'小额伤害免疫')&&amount<f.effects['小额伤害免疫'].threshold)amount=0;
      if(!bypass)amount=Math.min(amount,E.SOULS.trait(f,'damageCap')??Infinity);
      if(!bypass&&on(f,'伤害上限'))amount=Math.min(amount,f.effects['伤害上限'].amount);
      if(!bypass&&amount>0&&f.counts.nextDamageReduction!==undefined){amount=Math.max(0,amount-f.counts.nextDamageReduction);delete f.counts.nextDamageReduction;}
      if(!bypass&&amount>0&&f.soulState.nextDamageReductionFraction!==undefined){amount=Math.floor(amount*(1-f.soulState.nextDamageReductionFraction));delete f.soulState.nextDamageReductionFraction;}
      if(!bypass&&f.soulState.emperorConvertRound===r){heal(f,amount,'帝皇之御下回合受伤转回复');return 0;}
      if(!bypass&&amount>0&&on(f,'低伤免疫返还')&&amount<f.effects['低伤免疫返还'].threshold){if(!reflected&&origin&&origin!==f)inflict(f,origin,amount,'低伤免疫返还','fixed',false,true);return 0;}
      if(!bypass)amount=absorbMarsShield(f,amount);
      if(!bypass){const shared={...context(f,origin??fs[1-f.side]),amount,type};E.SOULS.run('beforeHealthDamage',shared);amount=shared.amount;}corpseLethal(origin,f,amount);if(!bypass)amount=preventLethal(f,amount);const v=Math.min(f.hp,amount);if(v>0&&doubledIncoming)f.counts.nextDamageDouble--;f.hp-=v;if(type==='fixed')f.roundFixedDamageTaken+=v;resolveDeath(f);f.roundDamageTaken+=v;if(skillPhase)f.roundSkillDamageTaken+=v;emit(`${name(f)} ${source}：损失 ${v} 点体力。`,'damage');if(v>0){if(type==='true'){statusRules.trueDamageTaken(f,r,v,heal);if(f.soulState.forest){clear(fs[1-f.side]);context(f,fs[1-f.side]).clearBoost(fs[1-f.side]);}}deathRetaliate(f,origin??fs[1-f.side]);E.SOULS.run('damageTaken',{...context(f,origin??fs[1-f.side]),dealt:v,type});if(f.hp>0&&on(f,'高伤回满反击')&&v>f.effects['高伤回满反击'].threshold){const before=f.hp;heal(f,f.stats.maxHp,'高伤回满反击','skill');if(!reflected&&f.hp>before&&origin?.hp>0)inflict(f,origin,f.hp-before,'高伤回满反击','fixed',false,true);}if(f.hp>0&&on(f,'大伤回满')&&v>f.effects['大伤回满'].threshold)heal(f,f.stats.maxHp,'大伤回满','skill');if(origin&&origin!==f)damageDealt(origin,f,v);}return v;
    }
    function drainPercent(a,t,n,label,origin='skill',multiplier=1){return healthRules.drainPercent({a,t,hurt:(f,amount,source,type)=>inflict(a,f,amount,source,type),heal:(f,amount,source)=>heal(f,amount,source,origin)},n,label,label,multiplier);}
    function damageDealt(a,t,dealt){if(dealt<=0)return;a.roundDamageDealt=(a.roundDamageDealt??0)+dealt;if(a.hp<=0)return;if(on(a,'全伤害吸血'))heal(a,dealt*a.effects['全伤害吸血'].fraction,'全伤害吸血','skill');if(a.side===first&&on(a,'托鲁克先手吸血'))heal(a,dealt*a.effects['托鲁克先手吸血'].fraction,'托鲁克先手吸血','skill');E.SOULS.run('damageDealt',{...context(a,t),dealt});}
    function inflict(a,t,n,source,type='true',bypass=false,reflected=false){if(a!==t&&a.soulState.sorrowCarry&&['fixed','percent'].includes(type)&&(statusInvalidKinds(a,t)>0||a.ailments['失神']>=r||t.ailments['失神']>=r))type='true';if(type==='direct')return hurt(t,n,source,type,true,false,t);if(statusRules.preventsDamage(a,t,type,r))return 0;return hurt(t,n*(a!==t&&['fixed','percent'].includes(type)&&on(a,'固定百分比减伤输出')?1-a.effects['固定百分比减伤输出'].fraction:1)*(a!==t&&['fixed','percent'].includes(type)&&on(a,'固定百分比增伤')?1+a.effects['固定百分比增伤'].fraction:1)*(a!==t&&a.soulId===1825&&['fixed','percent'].includes(type)?1+(a.soulState.jasmineCore??0)*.1:1)*(a!==t&&on(a,'全伤害翻倍')?2:1)*(a!==t?(E.SOULS.trait(a,'damageMultiplier')??1):1)*(a!==t&&['fixed','percent'].includes(type)&&a.ailments['星哲']>=r?1.3:1)*(a!==t&&!bypass&&on(a,'伤害输出降低')?1-a.effects['伤害输出降低'].fraction:1),source,type,bypass,reflected,a);}
    function boost(f,n,selected=keys){if(n>0&&on(f,'禁强化'))return;for(const k of selected)f.stages[k]=Math.min(6,f.stages[k]+n);emit(`${name(f)} ${selected.length===6?'全属性':selected.map(k=>E.STAGE_LABELS[k]).join('、')} +${n}（上限 +6）。`);}
    function boostRemoved(f,by,method='clear',removedCount=0){if(removedCount>0&&on(f,'消强按项反击')&&f.hp>0&&by.hp>0)inflict(f,by,removedCount*f.effects['消强按项反击'].amount,'消强按项反击','fixed');E.SOULS.run('boostRemoved',{...context(f,by),method});f.soulState.boostRemovedRound=r;if(on(f,'强化消失清回合'))clear(by);if(on(f,'强化消失封属'))timed(by,'statusBlock',Math.max(1,f.effects['强化消失封属'].end-r+1),{},r+1);if(on(f,'强化被清封属'))timed(by,'statusBlock',f.effects['强化被清封属'].duration,{},r+1);if(on(f,'强化被清弱化'))stage(by,-f.effects['强化被清弱化'].amount);if(on(f,'强化被清追加'))inflict(f,by,by.stats.maxHp*f.effects['强化被清追加'].fraction,'强化被清追加','percent');if(on(f,'强化被清吸取')&&by.hp>0){drainPercent(f,by,by.stats.maxHp*f.effects['强化被清吸取'].fraction,'强化被清吸取');}if(on(f,'强化被清惩罚')){const e=f.effects['强化被清惩罚'];if(rng(s)<e.chance/100)ailment(by,e.ailment,f,false,false,e.duration);}}
    function steal(f,t,phase){if(on(f,'禁强化')||on(t,'hypnosBoostProtect')||on(t,'幽蝶强化保护')||on(t,'强化保护'))return;const pos=boosted(t);if(!pos.length)return;for(const k of pos){f.stages[k]=Math.min(6,f.stages[k]+t.stages[k]);t.stages[k]=0;}boostRemoved(t,f,'steal',pos.length);const source=[484,527].includes(f.soulId)&&phase!=='技能'?'魂印「雷」'+phase:phase;emit(`${name(f)} ${source}吸取${name(t)}的${pos.map(k=>E.STAGE_LABELS[k]).join('、')}强化。`);}
    function restoreSwappedTypes(){for(const f of fs){const e=f.soulState.typeSwap;if(e&&!on(f,'交换属性')){for(const target of fs)if(target.soulState.typeSwap?.token===e.token){target.type=target.soulState.typeSwap.base;delete target.soulState.typeSwap;delete target.effects['交换属性'];}}}}
    function restoreCopiedType(f){if(f.soulState.copyTypeBase&&!on(f,'复制属性')){f.type=f.soulState.copyTypeBase;delete f.soulState.copyTypeBase;}}
    function clear(f,bypass=false){
      const eligible=Object.keys(f.effects).filter(k=>f.effects[k].end>=r);
      if(!eligible.length)return false;
      if(!bypass && (on(f,'protect')||f.soulProtect)){emit(`${name(f)} 的回合效果受到免断保护，消除失败。`);return false;}
      const removedReaction=on(f,'回合被清追加异常')?{...f.effects['回合被清追加异常']}:null;for(const k of eligible)delete f.effects[k];if(removedReaction&&fs[1-f.side].hp>0&&(removedReaction.chance>=100||rng(s)<removedReaction.chance/100))ailment(fs[1-f.side],removedReaction.ailment,f);restoreCopiedType(f);restoreSwappedTypes();emit(`${name(f)} 的回合效果已消除：${eligible.map(k=>effectNames[k]).join('、')}。`);const observer=fs[1-f.side];if(observer.hp>0&&on(observer,'对手回合被清追加异常')){const e=observer.effects['对手回合被清追加异常'];ailment(f,e.ailment,observer,false,false,e.duration);}return true;
    }
    function ailment(t,k,source,bypass=false,reflected=false,duration=null,statusPolicy=null){
      if(k==='害怕'&&t.soulState.sorrowCarry)k='失神';if(k==='诅咒'&&t.soulState.bloodCarry)k='致命诅咒';
      if(!reflected)statusRules.markExecution(source,r,[k]);
      const result=statusRules.attempt(t,k,r,{duration,bypass,merge:statusPolicy?.merge??'max-remaining',random:()=>rng(s),resistanceChance:gear.resistanceChance,
        // Default duration: user correction 2026-10-15; explicit source ranges remain separate.
        source,durationFallback:statusPolicy?.durationFallback??null,
        gate:()=>{
        if(celestialRules.blocksStatus(s,source,t,k,r))return false;
        const soulText=source?.soulId?s.wikiSnapshots?.[source.side]?.souls?.find(x=>x.id===source.soulId)?.description:null;const soulChance=soulText?E.WIKI.effectsEngine.statusDeclarations(soulText).find(x=>x.name===k)?.chance:undefined;
        if(statusPolicy?.probabilityPercent===undefined&&soulChance!==undefined&&celestialRules.probability(s,source,soulChance,r)===0)return false;
        if(statusPolicy?.probabilityPercent!==undefined&&celestialRules.probability(s,source,statusPolicy.probabilityPercent,r)===0)return false;
        if(t.soulState.hypnosReflect&&['睡眠','疲惫'].includes(k)){emit(`${name(t)} 零时诳语免疫${k}${source&&source!==t&&!reflected?'并反弹':''}。`);if(source&&source!==t&&!reflected){t.soulState.hypnosReflected=true;ailment(source,k,t,false,true,duration,statusPolicy);}return false;}
        if(on(t,'免异常反弹除星哲')&&k!=='星哲'){emit(`${name(t)} 免疫${k}${reflected?'':'并反弹'}。`);if(!reflected)ailment(source,k,t,false,true,duration,statusPolicy);return false;}
        if(source?.soulState?.statusNoAilmentThis){emit(`${name(source)} 的属性技能无法使对手进入异常。`);return false;}
        if(on(t,'免异常')||E.SOULS.trait(t,'ailmentImmune')||(E.SOULS.trait(t,'immuneAilments')??[]).includes(k)||t.soulState?.highHp){emit(`${name(t)} 魂印免疫${k}。`);return false;}
        const immunityChance=E.SOULS.trait(t,'ailmentImmunityChance')??0;if(immunityChance>0&&rng(s)<immunityChance)return false;
        if(on(t,'reflect')){emit(`${name(t)} 免疫${k}${reflected?'':'并反弹'}。`);if(!reflected)ailment(source,k,t,false,true,duration,statusPolicy);return false;}
        if(r<=(E.SOULS.trait(t,'entryAilmentRounds')??0)){emit(`${name(t)} 星皇之佑免疫${k}。`);return false;}
        const reaction={...context(t,source),status:k,reflected,blocked:false,reflect(){if(source&&source!==t&&!reflected)ailment(source,k,t,false,true,duration,statusPolicy);}};E.SOULS.run('beforeAilment',reaction);if(reaction.blocked)return false;
        return true;
      },notify:({reason,duration:n,appliedDuration,chance})=>{
        if(reason==='count-immunity')emit(`${name(t)} 消耗 1 次异常免疫，抵挡${k}。`);
        if(reason==='resistance-window')emit(`${name(t)} 抗性免疫状态抵挡${k}。`);
        if(reason==='resisted')emit(`${name(t)} ${k}抗性 ${Math.round(chance*100)}%：成功抵抗，获得 ${n} 回合异常免疫。`);
        if(reason==='resistance-failed')emit(`${name(t)} ${k}抗性 ${Math.round(chance*100)}%：未抵抗。`);
        if(reason==='applied')emit(`${name(t)} 陷入${k}（${appliedDuration??n} 回合，含当前回合）。`);
      }});
      if([2074,1348].includes(statusPolicy?.effectId)){
        s.randomStatusEvents??=[];s.randomStatusEvents.push({type:'application',effectId:statusPolicy.effectId,sourceType:statusPolicy.sourceType,round:r,targetSide:t.side,name:k,...result});
        if(result.applied&&statusRules.behaviorCoverage(k)==='not-implemented'){s.pendingStatusBehaviors??=[];s.pendingStatusBehaviors.push({effectId:statusPolicy.effectId,name:k,side:t.side,round:r,status:'not-implemented'});emit(`${name(t)} 的${k}已施加，其状态专属行为尚未实现，不能视为完整验证。`);}
      }
      if(result.applied&&statusRules.behaviorCoverage(k)!=='not-implemented'&&statusRules.behaviorGaps(k).length){s.pendingStatusBehaviors??=[];s.pendingStatusBehaviors.push({effectId:statusPolicy?.effectId??null,name:k,side:t.side,round:r,status:'partial',missing:statusRules.behaviorGaps(k)});emit(`${name(t)} 的${k}部分行为待核实，详见状态审核记录。`);}
      return result.applied;
    }
    const stage=(f,n,selected=keys)=>{if(f.hp<=0||n>0&&on(f,'禁强化'))return;if(n<0&&f.soulState.dragonScales?.blue&&!on(f,'免弱')&&!E.SOULS.trait(f,'weaknessImmune')){f.soulState.dragonScaleTriggered='blue';emit(`${name(f)} 蓝色龙鳞免疫能力下降。`);return;}if(n<0&&(on(f,'免弱')||E.SOULS.trait(f,'weaknessImmune'))){emit(`${name(f)} 魂印「皇」免疫能力弱化。`);return;}for(const k of selected){const before=f.stages[k];f.stages[k]=Math.max(-6,Math.min(6,before+n));emit(`${name(f)} ${E.STAGE_LABELS[k]}等级 ${before} → ${f.stages[k]}。`);}};
    function syncStages(){if(syncingStages)return;const deltas=fs.map((f,i)=>keys.map(k=>f.stages[k]-stageSnapshot[i][k]));stageSnapshot=fs.map(f=>({...f.stages}));syncingStages=true;try{for(let i=0;i<2;i++)if(on(fs[1-i],'同步能力变化'))deltas[i].forEach((n,j)=>{if(n)stage(fs[1-i],n,[keys[j]]);});}finally{stageSnapshot=fs.map(f=>({...f.stages}));syncingStages=false;celestialRules.refreshViews(fs);}}
    const timed=(f,k,n,data,start=r)=>{set(f,k,n,start);Object.assign(f.effects[k],data);};
    function unresolvedStatus(issue){s.pendingStatusTransitions??=[];s.pendingStatusTransitions.push(issue);emit(`${name(fs[issue.side])} ${issue.from}转化${issue.to}仍待核实：${issue.missing.join('、')}。`);}
    function statusRemoved(f,k){if(f.soulState.curseRemovalHeal===k){delete f.soulState.curseRemovalHeal;heal(f,f.stats.maxHp,'致命诅咒解除回复','skill');}ailmentSnapshot[f.side].delete(k);if(f.statusState?.sources)delete f.statusState.sources[k];statusRules.removed(f,k,r,{hurt:(target,n,source,type)=>hurt(target,n,source,type),unresolved:unresolvedStatus});}
    function statusInvalidKinds(a,t){let n=0;for(const f of [a,t]){const enemy=fs[1-f.side];for(const k of ['statusBlock','skillBlock'])if(on(f,k))n++;if(f.ailments['沉默']>=r)n++;if(f.counts.nextStatusInvalid>0)n++;if(f.counts.nextSkillInvalid>0)n++;if(f.soulState.skillInvalidRound===r)n++;if(on(enemy,'符文咒印'))n++;if(r<=(E.SOULS.trait(enemy,'entryStatusBlockRounds')??0))n++;if(on(enemy,'对手属性失效'))n++;}return n;}
    // Latest user rule (AGENTS 2026-10-19): unqualified random effects use all PVP states.
    function context(a,t,m=null){return {a,t,m,round:r,skillPhase,currentActorSide,priorityValue:()=>priorities[a.side],selectedMove:f=>battleMoves[choices[f.side]],gainInverse(f,n=1){f.soulState.inverseMight=Math.min(5,(f.soulState.inverseMight??0)+n);},addDread(f,n=1){f.soulState.ancientDread=Math.min(5,(f.soulState.ancientDread??0)+n);},typeParts:type=>s.typeChart?.aliases[type]??[type],swapTypes(a,t,n){const at=a.type,tt=t.type,token=r+':'+a.side;for(const f of [a,t]){f.soulState.typeSwap={token,base:f.soulState.typeSwap?.base??f.type};timed(f,'交换属性',n,{});}a.type=tt;t.type=at;},syncStages:()=>{for(const f of fs)resolveDeath(f);syncStages();for(const f of fs){for(const k of ailmentSnapshot[f.side])if(!Object.hasOwn(f.ailments,k))statusRemoved(f,k);ailmentSnapshot[f.side]=new Set(Object.keys(f.ailments));jasmineBarrierGone(f);}},consumeOrdinaryShield:shieldRules.consume,shieldConsumed:suitShieldBreak,shieldValue,consumeShields,addShield:shieldRules.add,refreshShield:shieldRules.refresh,addSeal(f,n=1){f.soulState.sealLayers=Math.min(4,(f.soulState.sealLayers??0)+n);},plantGu(f,n=1){const target=fs[f.side];target.soulState.soulGu??=[];for(let i=0;i<n&&target.soulState.soulGu.length<4;i++)target.soulState.soulGu.push({sourceSide:a.side,usedRound:0});},shieldSourceValue:shieldRules.sourceValue,damageImmune,sameType:(move,own)=>E.sameTypeBonus(move,own,s.typeChart)>1,convertAilment:(f,from,to)=>statusRules.convertExisting(f,from,to,r,{source:a}),typedAttack:(amount,type)=>damage(a,t,{...m,kind:m?.kind==='special'?'special':'physical',type,operations:[]},false,false,amount).dealt,affinity:(a,b)=>E.typeEffectiveness(a,b,s.typeChart),typeAffinity:(a,b)=>E.typeEffectiveness(a,b,s.typeChart),statusBlocked:f=>on(f,'statusBlock')||r<=(E.SOULS.trait(fs[1-f.side],'entryStatusBlockRounds')??0),heal,hurt:(f,n,source,type,bypass)=>inflict(a,f,n,source,type,bypass),stage,timed,clear,ailment,randomAilmentsFrom(count,names,effectId){return statusRules.randomAilments({a,t,round:r,random:()=>rng(s),ailment,record:event=>{s.randomStatusEvents??=[];s.randomStatusEvents.push(event);}},count,effectId,names);},randomFromSharedPool(count,controlOnly,effectId=null){return statusRules.randomAilments({a,t,round:r,random:()=>rng(s),ailment,record:event=>{s.randomStatusEvents??=[];s.randomStatusEvents.push({...event,sourceKey:effectId===null?'soul:'+a.soulId:'effect:'+effectId});}},count,effectId,statusPools.pool(undefined,{includeRestricted:true}).filter(x=>!controlOnly||statusRules.isControl(x.name)).map(x=>x.name));},randomNonRestrictedPvpAilments(count,effectId){return statusRules.randomAilments({a,t,round:r,random:()=>rng(s),ailment,record:event=>{s.randomStatusEvents??=[];s.randomStatusEvents.push({...event,sourceKey:'effect:'+effectId});}},count,effectId,statusPools.pool().map(x=>x.name));},randomAllPvpAilments(count,effectId){return statusRules.randomAilments({a,t,round:r,random:()=>rng(s),ailment,record:event=>{s.randomStatusEvents??=[];s.randomStatusEvents.push({...event,sourceKey:'effect:'+effectId});}},count,effectId,statusPools.pool(undefined,{includeRestricted:true}).map(x=>x.name));},isControlAilment:statusRules.isControl,randomAilments2074(count){return statusRules.effect2074({a,t,round:r,random:()=>rng(s),ailment,record:event=>{s.randomStatusEvents??=[];s.randomStatusEvents.push(event);}},count);},emit,name,steal,boost,on,used,selectedSkill:f=>battleMoves[choices[f.side]].kind!=='item',effective,random:()=>rng(s),restorePP(f,n){return ppRules.restore(f,battleMoves,n);},markStatusEffect(names=[]){statusRules.markExecution(a,r,names);},statusProbability(n){return celestialRules.probability(s,a,n,r);},celestials:s.celestials??(s.celestials=[]),addMoon(name,side,n){return celestialRules.add(s,name,side,n,r);},mirrorCount:celestialRules.mirrors,gainMirror:celestialRules.gain,auxiliaryAilments:celestialRules.auxiliary,setIceExpiry(n){s.iceExpiryUntil=Math.max(s.iceExpiryUntil??0,r+n-1);},transferMoons(from,to){return celestialRules.transfer(s,from.side,to.side,r,(side,k)=>statusRules.clear(fs[side],k,n=>statusRemoved(fs[side],n)));},shortenAilments(f,n){let changed=false;for(const k of Object.keys(f.ailments))if(f.ailments[k]>=r){f.ailments[k]-=n;changed=true;if(f.ailments[k]<r)statusRules.clear(f,k,x=>statusRemoved(f,x));}return changed;},absorbPP(receiver,donor,n){return ppRules.absorb(receiver,donor,n,battleMoves,{blocked:on(donor,'PP保护')||on(donor,'免疫PP削减')||!!E.SOULS.trait(donor,'ppReductionImmune')});},energy(n){const max=E.SOULS.trait(a,'energyMax');if(!max)return;a.soulState.energy=Math.max(0,Math.min(max,a.soulState.energy+n));emit(`${name(a)} 神耀能量：${a.soulState.energy}/${max} 层。`);},clearBoost(f){if(on(f,'幽蝶强化保护')||on(f,'强化保护'))return false;const list=boosted(f);for(const k of list)f.stages[k]=0;if(list.length)boostRemoved(f,fs[1-f.side],'clear',list.length);return list.length>0;},canRemoveNegative:f=>!on(f,'弱化不可解除反转'),clearNegative(f){if(on(f,'弱化不可解除反转'))return false;for(const k of keys)if(f.stages[k]<0)f.stages[k]=0;},clearAilment(f,k){return statusRules.clear(f,k,n=>statusRemoved(f,n));},clearAilments(f){return statusRules.clearAll(f,n=>statusRemoved(f,n));}};}
    function resolveDeath(f){if(f.hp>0){delete f.soulState.deathResolved;return;}if(f.soulState.deathResolved)return;f.soulState.deathResolved=true;E.SOULS.run('death',context(f,fs[1-f.side]));if(f.hp>0)delete f.soulState.deathResolved;}
    const stageViews=new WeakMap();const actualFighter=f=>stageViews.get(f)??f;
    function opponentView(a,t){if(!a.soulState.opponentBoostsAsWeakThis)return t;const stages=new Proxy(t.stages,{get(obj,k){const n=obj[k];return typeof n==='number'&&n>0?-n:n;},set(obj,k,v){obj[k]=v;return true;}});const view=new Proxy(t,{get(obj,k){return k==='stages'?stages:obj[k];}});stageViews.set(view,t);return view;}
    function skillContext(a,t,m){const c=context(a,t,m),view=opponentView(a,t);return {...c,t:view,stage:(f,...args)=>c.stage(f===view?t:f,...args),hurt:(f,...args)=>c.hurt(f===view?t:f,...args),heal:(f,...args)=>c.heal(f===view?t:f,...args),ailment:(f,k,source,...args)=>c.ailment(f===view?t:f,k,source===view?t:source,...args)};}
    function triggerEffects(a,t,move){if(a.hp<=0)return;E.WIKI.effectsEngine.run('afterHit',move.operations,{...context(a,t,move),heal:(f,n,label)=>heal(f,n,label,'skill'),dealt:0,crit:false,first});}
    function finish(){for(const f of fs)resolveDeath(f);const dead=fs.map(f=>f.hp<=0);if(!dead.some(Boolean))return false;if(fs.some(f=>f.hp<=0&&(f.soulState.reviveAfterEnemyUseRound===r&&!used[1-f.side]||f.soulState.titanRevivalPendingRound===r&&fs[1-f.side].soulState.actionEndedRound!==r)))return false;s.finished=true;s.winner=dead.every(Boolean)?'draw':dead[0]?1:0;emit(s.winner==='draw'?'双方倒下，本场平局。':`${name(fs[s.winner])} 获胜，对战结束。`,'result');return true;}
    for(const f of fs)if(wears(f,'judgment')){f.suitState.judgmentReduction=f.suitState.barrier>0?0:Math.min(.25,.05+.05*Math.floor((f.stats.maxHp-f.hp)/(f.stats.maxHp*.15)));emit(`${name(f)} 裁决：本回合固伤、百分比减伤 ${Math.round(f.suitState.judgmentReduction*100)}%。`);}
    // Delayed corrosion belongs to its surviving wearer, and checks immunity now.
    for(const f of fs)if(wears(f,'corrosion')&&f.suitState.corrodeRound===r&&f.hp>0){
      f.suitState.corrodeRound=0;const t=fs[1-f.side];emit(`${name(f)} 腐蚀套装：结算上回合受击效果。`);
      if(!ailment(t,'麻痹',f,false,false,1))inflict(f,t,t.stats.maxHp/6,'腐蚀未控补偿','percent');
    }
    if(fs.some(f=>f.hp<=0)){finish();s.turns.push({round:r,choices:[...choices],first:null,events,remainingHp:fs.map(f=>f.hp)});s.round++;return s;}
    for(const f of fs)if(on(f,'回合初能力变化'))f.effects['回合初能力变化'].stages.forEach((n,i)=>{if(n)stage(f,n,[keys[i]]);});
    // Start-of-round soulmarks precede speed/priority calculation.
    for(const f of fs){f.soulState.opponentBoostsAsWeakThis=battleMoves[choices[f.side]].kind!=='status'&&battleMoves[choices[f.side]].kind!=='item'&&f.counts.opponentBoostsAsWeak>0;if(f.soulState.opponentBoostsAsWeakThis)f.counts.opponentBoostsAsWeak--;}
    for(const f of fs)E.SOULS.run('choiceLocked',{...context(f,fs[1-f.side],battleMoves[choices[f.side]]),opponentMove:battleMoves[choices[1-f.side]]});
    celestialRules.phase(s,fs,r,'start',(side,k,n)=>ailment(fs[side],k,fs[side],false,false,n));
    for(const f of fs){f.soulProtect=false;f.soulHigh=false;E.SOULS.run('roundStart',context(f,fs[1-f.side],battleMoves[choices[1-f.side]]));}
    for(const a of fs)if(a.soulState.entryStatusBlockUnlessControlled&&!a.soulState.entryStatusBlockChecked){a.soulState.entryStatusBlockChecked=true;const t=fs[1-a.side];if(!Object.entries(t.ailments).some(([k,end])=>end>=r&&statusRules.isControl(k)))t.counts.nextStatusInvalid=(t.counts.nextStatusInvalid??0)+1;}
    for(const f of fs)if(on(f,'回合闪避失败减伤')){const e=f.effects['回合闪避失败减伤'];if(e.rolledRound!==r){e.rolledRound=r;e.dodge=rng(s)<e.chance/100;}}
    const effectForcedFirst=[false,false],ignoreOpponentPositivePriority=[false,false];
    const effectPriorities=fs.map((f,i)=>{const m=battleMoves[choices[i]],c={...skillContext(f,fs[1-i],m),priority:0};if(m.kind!=='item')E.WIKI.effectsEngine.run('beforeOrder',m.operations,c);effectForcedFirst[i]=!!c.forceFirst;ignoreOpponentPositivePriority[i]=!!c.ignoreOpponentPositivePriority;return c.priority;});
    const dragonEaterPriority=fs.map(f=>(f.soulState.dragonEaterStacks??0)>0?1:0);
    const priorities=fs.map((f,i)=>battleMoves[choices[i]].kind==='item'?100:(battleMoves[choices[i]].priority||0)+effectPriorities[i]+(E.SOULS.trait(f,'skillPriority')??0)+(on(f,'priority')?2:0)+(on(f,'战之龙魂')?3:0)-(on(f,'万龙臣服')?1:0)+(battleMoves[choices[i]].kind!=='status'&&on(f,'奇迹之力')?1:0)+(battleMoves[choices[i]].kind!=='status'&&on(f,'攻击先制')?f.effects['攻击先制'].amount:0)+(on(f,'id984')?f.effects.id984.amount:0)+(f.counts.nextSoulSkillBoost>0?3:0)+(battleMoves[choices[i]].kind!=='status'&&f.counts.attackPriority>0?2:0)+(battleMoves[choices[i]].kind!=='status'&&f.counts.nextAttackPriority>0?(f.soulState.nextAttackPriorityAmount??0):0)+(battleMoves[choices[i]].kind!=='status'?(E.SOULS.trait(f,'attackPriority')??0)+dragonEaterPriority[i]:0));
    fs.forEach((f,i)=>{const m=battleMoves[choices[i]],t=fs[1-i];if(m.kind==='status'&&f.soulState.nextStatusPriorityPenalty>0)priorities[i]-=2;if(m.kind!=='status'&&on(t,'对手低体无先制')&&f.hp<f.stats.maxHp*t.effects['对手低体无先制'].threshold)priorities[i]=Math.min(0,priorities[i]);});
    fs.forEach((f,i)=>{if(battleMoves[choices[i]].kind==='status'&&on(f,'属性技能先制'))priorities[i]+=f.effects['属性技能先制'].amount;if(f.soulState.oscarPriority?.round===r)priorities[i]+=f.soulState.oscarPriority.amount;});
    fs.forEach((f,i)=>{if(f.counts.nextSkillPriority>0)priorities[i]+=f.soulState.nextSkillPriorityAmount??0;});
    fs.forEach((f,i)=>{if(battleMoves[choices[i]].kind!=='item'&&on(f,'动态条件先制')){const e=f.effects['动态条件先制'];priorities[i]+=e.base;if(priorities[i]>e.threshold)priorities[i]+=e.enhanced-e.base;}});
    fs.forEach((f,i)=>{if(battleMoves[choices[i]].kind!=='item')priorities[i]=statusRules.priority(f,r,priorities[i]);});
    fs.forEach((f,i)=>{if(ignoreOpponentPositivePriority[1-i]&&battleMoves[choices[i]].kind!=='item')priorities[i]=Math.min(0,priorities[i]);});
    const dawnFast=fs.map(f=>wears(f,'dawn')&&!Object.values(f.ailments).some(end=>end>=r)&&f.resistUntil<r);
    const speeds=fs.map((f,i)=>Math.max(1,effective(f,'spe')-(dawnFast[1-i]?10:0)));
    fs.forEach((f,i)=>{if(dawnFast[i])emit(`${name(f)} 晨曦：本回合忽略对手 10 点速度。`);});
    const forcedFirst=fs.map((f,i)=>battleMoves[choices[i]].kind!=='item'&&(effectForcedFirst[i]||on(f,'所有技能必定先手')||battleMoves[choices[i]].kind!=='status'&&on(f,'攻击必定先手')));
    const itemChoices=choices.map(id=>battleMoves[id].kind==='item');
    first=itemChoices[0]!==itemChoices[1]?(itemChoices[0]?0:1):!!forcedFirst[0]!==!!forcedFirst[1]?(forcedFirst[0]?0:1):priorities[0]!==priorities[1]?(priorities[0]>priorities[1]?0:1):speeds[0]!==speeds[1]?(speeds[0]>speeds[1]?0:1):(rng(s)<.5?0:1);
    for(const f of fs)E.SOULS.run('orderResolved',{...context(f,fs[1-f.side]),first});
    emit(`${name(fs[first])} 先手：先制 ${priorities.join(' / ')}，速度 ${speeds.join(' / ')}。`,'info');
    function rollCritical(a,t,m){
      const chance=m.id==='emperor5'||(m.wikiId??m.id)===30381?Math.min(1,1/16+.2*a.fifthUses):(m.criticalChance??1/16);
      const critContext={...skillContext(a,t,m),chance:on(a,'冰之祝福')?a.effects['冰之祝福'].crit:chance};{E.SOULS.run('beforeCrit',critContext);E.WIKI.effectsEngine.run('beforeCrit',m.operations,critContext);}
      const crit=(!!critContext.forceCrit||(m.hiddenEffect?.id===1&&a.side===first)||(m.hiddenEffect?.id===3&&a.hp<a.stats.maxHp/2)||on(a,'必定暴击')||a.soulState.nextCritThis||(m.id===13547&&a.side!==first)||(a.soulId===645&&a.stages.spe>0)||(s.criticals && rng(s)<Math.min(1,critContext.chance+(on(a,'暴击概率增加')?a.effects['暴击概率增加'].chance:0)+(on(a,'要害概率增加')?a.effects['要害概率增加'].chance:0))));
      return crit;
    }

    function incomingTimedFactor(t,m,ignore,rage){let n=on(t,'战狂下回合减伤')?.5:1;if(on(t,'所受伤害倍增'))n*=t.effects['所受伤害倍增'].multiple;if(on(t,'其他技能易伤')&&t.effects['其他技能易伤'].except!==m.id)n*=2;if(on(t,'回合闪避失败减伤'))n*=1-t.effects['回合闪避失败减伤'].fraction;if(!rage){if(on(t,'全伤害减半'))n*=1-.5*(1-ignore);if(on(t,'火系攻击减半')&&m.type==='火')n*=1-.5*(1-ignore);if(on(t,'减伤高伤随机异常'))n*=1-t.effects['减伤高伤随机异常'].fraction*(1-ignore);if(on(t,'分类攻击减伤')){const e=t.effects['分类攻击减伤'];if(e.kind===2||(e.kind===0&&m.kind==='physical')||(e.kind===1&&m.kind==='special'))n*=1-e.fraction*(1-ignore);}}return n;}
    function wouldAttackImmune(a,t,m,crit,total,c){let amount=Math.max(total,a.soulState.invalidSkillMinimumThis??0,c.minimumDamage??0,E.SOULS.trait(a,'minimumAttackDamage')??0,on(a,'攻击最低伤害')?a.effects['攻击最低伤害'].amount:0);if(!c.ignoreLimit){if(on(t,'伤害定额减免'))amount=Math.max(0,amount-t.effects['伤害定额减免'].amount);amount=Math.max(0,amount-(E.SOULS.trait(t,'flatAttackReduction')??0));if(on(t,'未受攻定额吸取'))amount=Math.max(0,amount-t.effects['未受攻定额吸取'].amount);if(on(t,'攻击伤害上限'))amount=Math.min(amount,t.effects['攻击伤害上限'].amount);if(on(t,'下回合伤害减免'))amount=Math.max(0,amount-t.effects['下回合伤害减免'].amount);if(t.soulState.jasmineCap!=null)amount=Math.min(amount,t.soulState.jasmineCap);if(on(t,'伤害上限'))amount=Math.min(amount,t.effects['伤害上限'].amount);amount=Math.min(amount,E.SOULS.trait(t,'damageCap')??Infinity);}let probability=false;if(on(t,'概率攻击免疫')){const e=t.effects['概率攻击免疫'],key=e.perRound?String(r):r+':'+a.side+':'+m.id;if(t.soulState.immunityRollKey!==key){t.soulState.immunityRollKey=key;t.soulState.immunityRoll=rng(s)<e.chance/100;if(!t.soulState.immunityRoll&&e.failureStages)e.failureStages.forEach((n,i)=>{if(n)stage(a,n,[keys[i]]);});}probability=t.soulState.immunityRoll;}return probability||t.counts.attackNullify>0||t.counts.attackReflect>0||on(t,'攻击免疫反弹')||on(t,'鬼王攻击免疫')||on(t,'当回合免伤')||on(t,'攻击伤害免疫')||on(t,'大额攻击免疫')&&amount>t.effects['大额攻击免疫'].threshold||on(t,'小额攻击免疫')&&amount<t.effects['小额攻击免疫'].threshold||on(t,'小额伤害免疫')&&amount<t.effects['小额伤害免疫'].threshold||crit&&(!!E.SOULS.trait(t,'criticalReflectType')||on(t,'致命伤害反射'))||t.counts.nextAttackHealing>0||on(t,'攻击转治疗')||!!E.SOULS.trait(t,'attackDamageToHealing')||!!t.soulState.sorenImmuneAttack||t.soulId===789&&t.soulState.xConvertRound===r||t.soulState.emperorConvertRound===r||t.soulState.starImmuneRound===r&&t.soulState.starImmuneKind===m.kind||t.soulState.hypnosLowRound===r||t.soulState.dragonScales?.gold&&total>t.stats.maxHp||t.soulState.dragonScales?.black&&total>0&&total<t.stats.maxHp||on(t,'低伤免疫返还')&&amount>0&&amount<t.effects['低伤免疫返还'].threshold;}
    function endAction(a,t,m,successful=false){a.soulState.actionEndedRound=r;E.SOULS.run('opponentActionEnd',{...context(t,a,m),successful});}
    function damage(a,t,m,rage,full,typedBase=null,cachedCrit=null,forceHit=false){
      if(!rage&&m.kind!=='status')E.SOULS.run('beforeOpponentAttack',{...context(t,a,m),first});
      const shieldAtAttackStart=t.roundShieldDamage??0;const crit=typedBase===null&&(cachedCrit??rollCritical(a,t,m));
      if(crit&&!forceHit&&!m.alwaysHit&&on(t,'非必中暴击无效')){emit(`${name(t)} 天盔地甲：非必中致命一击无效。`,'miss');return {dealt:0,crit:false,invalid:true};}
      if(!rage&&typedBase===null){E.SOULS.run('beforeAttackDamage',{...context(a,t,m),first});E.WIKI.effectsEngine.run('beforeDamageSetup',m.operations,{...skillContext(a,t,m),first});if(a.hp<=0||t.hp<=0)return {dealt:0,crit:false,invalid:true};}
      const attackStat=m.kind==='special'?'spa':'atk',defenseStat=m.kind==='special'?'spd':'def';
      const viewedTarget=opponentView(a,t);let defense=crit&&viewedTarget.stages[defenseStat]>0?t.stats[defenseStat]:effective(viewedTarget,defenseStat);
      if(wears(a,'corrosion'))defense=Math.max(1,Math.floor(defense*.85));
      let power=m.power*(rage&&!full?.5:1)*(on(a,'鬼王威力翻倍')?2:1);
      if(a.soulState.netherPower?.round===r&&a.soulState.netherPower.move===m.id)power*=2;
      if(m.id===12089&&Object.values(t.ailments).some(end=>end>=r))power*=2;
      if(on(a,'灵神重生威力'))power*=2;
      if(on(a,'属性威力增强')&&a.effects['属性威力增强'].type===m.type)power*=a.effects['属性威力增强'].multiple;
      let affinity=E.typeEffectiveness(m.type,t.type,s.typeChart);
      let modifier=(on(a,'全伤害翻倍')?2:1)*(on(a,'doubleDamage')?2:1)*(on(a,'攻击伤害倍数')?a.effects['攻击伤害倍数'].multiple:1)*attackBonus[a.side]*(E.SOULS.trait(a,'damageMultiplier')??1)*(E.SOULS.trait(a,'attackMultiplier')??1);
      if(crit&&on(a,'暴击攻击增伤'))modifier*=1+a.effects['暴击攻击增伤'].fraction;
      if(a.ailments['虚弱诅咒']>=r)modifier*=.5;if(t.ailments['致命诅咒']>=r)modifier*=1.5;
      const effectContext={...skillContext(a,t,m),power,affinity,modifier:modifier*statusRules.attackMultiplier(a,r)*statusRules.incomingMultiplier(t,r),first,additiveAttackFraction:on(a,'战之龙魂')?(50+Math.floor(rng(s)*51))/100:0};if(typedBase===null){E.SOULS.run('beforeDamage',effectContext);E.WIKI.effectsEngine.run('beforeDamage',m.operations,effectContext);}effectContext.modifier*=1+(effectContext.additiveAttackFraction??0);({power,affinity,modifier}=effectContext);if(t.soulId===879)affinity=Math.min(2,affinity);if(on(a,'无视伤害限制'))effectContext.ignoreLimit=true;
      const tearsPierce=(t.soulState.inkTears??0)>=4;if(a.soulState.ignoreImmunityThis||tearsPierce)effectContext.ignoreImmunity=true;if((t.soulState.inkTears??0)>=3)effectContext.ignoreShield=true;
      if((effectContext.ignoreDefenseBoost||a.soulState.blakeBuffRound===r)&&!crit&&viewedTarget.stages[defenseStat]>0)defense=Math.max(1,defense/E.multiplier(viewedTarget.stages[defenseStat]));
      if(a.soulState.currentDefenseIgnore&&!crit){defense=Math.max(1,Math.floor(defense*(1-a.soulState.currentDefenseIgnore)));a.soulState.currentDefenseIgnore=0;}
      
      if(on(a,'咤克斯忽略双防'))defense=Math.max(1,Math.floor(defense*(1-a.effects['咤克斯忽略双防'].fraction)));
      const damageReductionIgnore=a.soulState.currentDamageReductionIgnore??0;
      
      
      
      if(m.type==='电'&&on(a,'电系伤害翻倍'))modifier*=2;
      if(on(a,'伤害输出降低'))modifier*=1-a.effects['伤害输出降低'].fraction;
      if(on(a,'当回合成长增伤'))modifier*=1+a.effects['当回合成长增伤'].bonus;
      if(on(a,'奇迹之力')&&rng(s)<.5)modifier*=2;
      if(a.soulState.nextSoulSkillBoostThis)modifier*=2;
      if(a.ailments['狂暴']>=r)modifier*=2;
      if(on(a,'id913'))modifier*=1+a.effects.id913.bonus;if(a.soulState.nextAttackBoostThis)modifier*=1+a.soulState.nextAttackBoostThis;
      if(a.soulState.kingGaiaDamageReductionRound===r)modifier*=1-a.soulState.kingGaiaDamageReduction;
      if(wears(a,'judgment'))modifier*=1.4+a.suitState.judgmentBonus;
      if(wears(a,'destiny'))modifier*=1+.04*a.suitState.stacks;
      if(a.soulId===543&&a.hp>t.hp)modifier*=1.49;if(a.soulState.arslanBonus)modifier*=1+a.soulState.arslanBonus;
      if(!rage&&t.soulId===543&&t.hp<a.hp)modifier*=.51;
      if(wears(a,'dawn'))modifier*=a.hp>a.stats.maxHp/2?1.2:1.1;
      // A typed flat attack replaces the offensive formula, then shares all incoming attack mitigation.
      if(typedBase!==null)modifier=statusRules.incomingMultiplier(t,r)*(!rage&&t.soulId===543&&t.hp<a.hp?.51:1);
      if(on(a,'封属种类增伤'))modifier*=1+statusInvalidKinds(a,t)*a.effects['封属种类增伤'].fraction;
      if(!rage){const incoming={...context(t,a,m),reduction:0};E.SOULS.run('beforeIncomingAttack',incoming);modifier*=1-incoming.reduction*(1-damageReductionIgnore);}
      if(!rage)modifier*=(1-(E.SOULS.trait(t,'allDamageReduction')??0)*(1-damageReductionIgnore))*(1-(E.SOULS.trait(t,'attackReduction')??0)*(1-damageReductionIgnore))*(t.soulState?.lowHp?.5:1);
      if(on(a,'soul369'))modifier*=2;if(!rage&&(t.soulState.zeusFirst||t.soulState.lateReduction))modifier*=1-.5*(1-damageReductionIgnore);
      
      if(!rage&&t.soulState.sorenReduceAttack)modifier*=1-.5*(1-damageReductionIgnore);
      if(!rage&&t.soulState.starReduction)modifier*=1-t.soulState.starReduction*(1-damageReductionIgnore);
      if(!rage&&t.counts.nextAttackReductionUses>0){modifier*=1-(t.soulState.nextAttackReductionFraction??0)*(1-damageReductionIgnore);t.counts.nextAttackReductionUses--;}
      
      
      
      if(!rage&&wears(t,'dawn'))modifier*=t.hp<t.stats.maxHp/2?.8:.9;
      if(!rage&&t.counts.halfDamage>0){modifier*=1-.5*(1-damageReductionIgnore);t.counts.halfDamage--;emit(`${name(t)} 消耗一次受击减伤。`);}
      let attack=E.SOULS.trait(a,'equalAttackStats')?Math.max(effective(a,'atk'),effective(a,'spa')):effective(a,attackStat);
      power*=statusRules.powerMultiplier(a,r);
      let base=typedBase??(Math.floor(Math.floor((2*a.level/5+2)*power*attack/defense)/50)+2);
      const roll=typedBase===null?85+Math.floor(rng(s)*16):100,stab=typedBase===null?(effectContext.stab??E.sameTypeBonus(m.type,a.type,s.typeChart)):1;
      let attackTimedFactor=incomingTimedFactor(t,m,damageReductionIgnore,rage);let raw=affinity===0||typedBase===null&&power===0?0:Math.max(1,Math.floor(base*stab*affinity*(crit?2:1)*modifier*attackTimedFactor*roll/100));
      if(!rage&&t.soulState.hypnosReductionRound===r&&!t.soulState.hypnosReflected&&raw>0&&raw*4<300&&a.hp>0)ailment(a,'睡眠',t);
      let total=crit?gear.mitigate(t,raw,'critical',{bypass:rage}):raw;if(effectContext.clearOnImmunityIgnore){const ignored=wouldAttackImmune(a,t,m,crit,total,effectContext);if(ignored)clear(t);attack=E.SOULS.trait(a,'equalAttackStats')?Math.max(effective(a,'atk'),effective(a,'spa')):effective(a,attackStat);base=typedBase??(Math.floor(Math.floor((2*a.level/5+2)*power*attack/defense)/50)+2);attackTimedFactor=incomingTimedFactor(t,m,damageReductionIgnore,rage);raw=affinity===0||typedBase===null&&power===0?0:Math.max(1,Math.floor(base*stab*affinity*(crit?2:1)*modifier*attackTimedFactor*roll/100));total=crit?gear.mitigate(t,raw,'critical',{bypass:rage}):raw;}
      if(!rage&&!tearsPierce&&!effectContext.ignoreImmunity&&t.soulState.dragonScales){if(t.soulState.dragonScales.gold&&total>t.stats.maxHp){t.soulState.dragonScaleTriggered='gold';emit(`${name(t)} 金色龙鳞免疫高于最大体力的攻击伤害。`);}else if(t.soulState.dragonScales.black&&total>0&&total<t.stats.maxHp){t.soulState.dragonScaleTriggered='black';emit(`${name(t)} 玄色龙鳞免疫低于最大体力的攻击伤害。`);}}
      const observedAttackImmune=effectContext.observeWeakAdditional&&!effectContext.ignoreImmunity?wouldAttackImmune(a,t,m,crit,total,effectContext):false;
      let remaining=Math.max(total,a.soulState.invalidSkillMinimumThis??0,effectContext.minimumDamage??0,E.SOULS.trait(a,'minimumAttackDamage')??0,on(a,'攻击最低伤害')?a.effects['攻击最低伤害'].amount:0);if(!tearsPierce&&t.soulState.dragonScaleTriggered)remaining=0;if(!rage&&on(t,'伤害定额减免')&&!effectContext.ignoreLimit)remaining=Math.max(0,remaining-t.effects['伤害定额减免'].amount);
      if(!rage&&!effectContext.ignoreLimit)remaining=Math.max(0,remaining-(E.SOULS.trait(t,'flatAttackReduction')??0));
      if(!rage&&on(t,'未受攻定额吸取'))remaining=Math.max(0,remaining-t.effects['未受攻定额吸取'].amount);
      if(!rage&&t.soulId===560&&t.soulState.mingReductionRound===r)remaining=Math.floor(remaining*.5);
      if(!rage&&!effectContext.ignoreImmunity&&on(t,'概率攻击免疫')){const key=t.effects['概率攻击免疫'].perRound?String(r):r+':'+a.side+':'+m.id;if(t.soulState.immunityRollKey!==key){t.soulState.immunityRollKey=key;t.soulState.immunityRoll=rng(s)<t.effects['概率攻击免疫'].chance/100;if(!t.soulState.immunityRoll&&t.effects['概率攻击免疫'].failureStages)t.effects['概率攻击免疫'].failureStages.forEach((n,i)=>{if(n)stage(a,n,[keys[i]]);});}if(t.soulState.immunityRoll)remaining=0;}
      if(!effectContext.ignoreImmunity&&on(t,'攻击免疫反弹')){inflict(t,a,remaining*t.effects['攻击免疫反弹'].fraction,'攻击免疫反弹','fixed');remaining=0;}
      if(!effectContext.ignoreImmunity&&crit&&E.SOULS.trait(t,'criticalReflectType')){E.SOULS.run('criticalIncoming',{...context(t,a,m),amount:remaining,first});remaining=0;}
      if(!effectContext.ignoreImmunity&&crit&&on(t,'致命伤害反射')){inflict(t,a,remaining,'致命伤害反射','true');remaining=0;}
      if(!effectContext.ignoreImmunity&&t.counts.nextAttackHealing>0){t.counts.nextAttackHealing--;t.soulState.nextAttackHealingConsumedRound=r;heal(t,remaining,'下次攻击转治疗');remaining=0;}
      if(!effectContext.ignoreImmunity&&(on(t,'攻击转治疗')||E.SOULS.trait(t,'attackDamageToHealing'))){heal(t,remaining,'攻击转治疗');remaining=0;}
      if(!rage&&!tearsPierce&&!effectContext.ignoreImmunity&&t.soulState.sorenImmuneAttack){remaining=0;t.soulState.sorenImmuneAttack=false;emit(`${name(t)} 索伦森魂印抵挡本次攻击。`);}
      if(!rage&&!tearsPierce&&t.soulId===789&&!effectContext.ignoreImmunity&&t.soulState.xConvertRound===r&&remaining>0){heal(t,remaining,'奥古斯特魂印攻击转回复');remaining=0;}
      if(!rage&&!tearsPierce&&!effectContext.ignoreImmunity&&t.soulState.emperorConvertRound===r&&remaining>0){heal(t,remaining,'帝皇之御下回合受伤转回复');remaining=0;}
      if(!rage&&!tearsPierce&&!effectContext.ignoreImmunity&&t.soulState.starImmuneRound===r&&t.soulState.starImmuneKind===m.kind){remaining=0;emit(`${name(t)} 星域魂印免疫本次${m.category}攻击。`);}
      if(!rage&&!tearsPierce&&!effectContext.ignoreImmunity&&t.soulState.hypnosLowRound===r){remaining=0;emit(`${name(t)} 修普诺斯魂印免疫本回合攻击。`);}
      if(!effectContext.ignoreLimit&&t.soulState.jasmineCap!==null&&t.soulState.jasmineCap!==undefined)remaining=Math.min(remaining,Math.floor(t.soulState.jasmineCap));
      if(!effectContext.ignoreLimit&&on(t,'攻击伤害上限'))remaining=Math.min(remaining,t.effects['攻击伤害上限'].amount);
      if(!effectContext.ignoreLimit&&on(t,'下回合伤害减免'))remaining=Math.max(0,remaining-t.effects['下回合伤害减免'].amount);
      if(!effectContext.ignoreLimit&&on(t,'致命保留')&&remaining>=t.hp)remaining=Math.max(0,t.hp-t.effects['致命保留'].hp);
      const doubledIncoming=!rage&&remaining>0&&t.counts.nextDamageDouble>0;if(doubledIncoming)remaining*=2;
      if(!rage&&!effectContext.ignoreLimit)remaining=Math.min(remaining,E.SOULS.trait(t,'damageCap')??Infinity);
      if(!effectContext.ignoreLimit&&on(t,'伤害上限'))remaining=Math.min(remaining,t.effects['伤害上限'].amount);
      if(!effectContext.ignoreImmunity&&on(t,'鬼王攻击免疫'))remaining=0;
      if(!effectContext.ignoreImmunity&&on(t,'大额攻击免疫')&&remaining>t.effects['大额攻击免疫'].threshold)remaining=0;
      if(!effectContext.ignoreImmunity&&on(t,'小额攻击免疫')&&remaining<t.effects['小额攻击免疫'].threshold)remaining=0;
      if(on(a,'无法造成攻击伤害'))remaining=0;
      if(!effectContext.ignoreImmunity&&(on(t,'当回合免伤')||on(t,'攻击伤害免疫')||on(t,'小额伤害免疫')&&remaining<t.effects['小额伤害免疫'].threshold))remaining=0;
      const reflectKey=r+':'+a.side+':'+m.id;
      if(!rage&&!effectContext.ignoreLimit&&(t.counts.attackReductionUses>0||t.soulState.reducedUse===reflectKey)){if(t.soulState.reducedUse!==reflectKey){t.counts.attackReductionUses--;t.soulState.reducedUse=reflectKey;}remaining=Math.floor(remaining*(1-t.soulState.attackReductionFraction));}
      if(!rage&&!effectContext.ignoreImmunity&&(t.counts.attackNullify>0||t.soulState.nullifyUse===reflectKey)){if(t.soulState.nullifyUse!==reflectKey){t.counts.attackNullify--;t.soulState.nullifyUse=reflectKey;if(t.soulState.hathawayNullifyBoost>0){t.soulState.hathawayNullifyBoost--;stage(t,t.soulState.hathawayNullifyStage??1);}}remaining=0;}
      if(!rage&&!effectContext.ignoreImmunity&&(t.counts.attackReflect>0||t.soulState.reflectUse===reflectKey)){if(t.soulState.reflectUse!==reflectKey){t.counts.attackReflect--;t.soulState.reflectUse=reflectKey;}hurt(a,remaining,'次数免疫返还','true',false,false,t);remaining=0;}
      if(remaining>0&&!effectContext.ignoreLimit&&t.soulState.nextAttackFlatReduction?.count>0){const e=t.soulState.nextAttackFlatReduction;remaining=Math.max(0,remaining-e.amount);if(--e.count<=0)delete t.soulState.nextAttackFlatReduction;}
      if(remaining>0&&!effectContext.ignoreLimit&&t.counts.nextDamageReduction!==undefined){remaining=Math.max(0,remaining-t.counts.nextDamageReduction);delete t.counts.nextDamageReduction;}
      if(remaining>0&&!effectContext.ignoreLimit&&t.soulState.nextDamageReductionFraction!==undefined){remaining=Math.floor(remaining*(1-t.soulState.nextDamageReductionFraction));delete t.soulState.nextDamageReductionFraction;}
      if(statusRules.preventsDamage(a,t,'attack',r))remaining=0;
      statusRules.fireHit(t,r,m.type,{random:()=>rng(s),stage,source:a});
      if(statusRules.attackHit(t,r)){emit(`${name(t)} 受到攻击，睡眠解除。`);}
      if(!rage&&!effectContext.ignoreImmunity&&remaining>0&&on(t,'低伤免疫返还')&&remaining<t.effects['低伤免疫返还'].threshold){inflict(t,a,remaining,'低伤免疫返还','fixed',false,true);remaining=0;}
      if(!rage&&!effectContext.ignoreShield&&t.soulState.attackShield>0){const block=Math.min(remaining,t.soulState.attackShield);remaining-=block;t.roundShieldDamage+=block;t.soulState.attackShield-=block;emit(`${name(t)} 魂印护盾抵挡 ${block} 点攻击伤害。`);if(block>0&&shieldValue(t)===0)E.SOULS.run('allShieldsGone',context(t,a,m));}
      if(!rage){received[t.side]=true;if(!effectContext.ignoreShield&&t.suitState.shield>0){const block=shieldRules.absorb(t,remaining);remaining-=block;t.roundShieldDamage+=block;emit(`${name(t)} 护盾抵挡 ${block} 点攻击伤害。`);if(t.suitState.shield===0&&block>0){if(E.SOULS.trait(t,'shieldBreakDamage'))inflict(t,a,E.SOULS.trait(t,'shieldBreakDamage'),'莱茵哈特护盾破裂','fixed');suitShieldBreak(t,a);}}}
      if(!rage&&!effectContext.ignoreLimit&&!effectContext.ignoreShield)remaining=absorbMarsShield(t,remaining);
      if(power>0)remaining=Math.max(remaining,statusRules.minimumAttackDamage(t,r,crit));
      {const shared={...context(t,a,m),amount:remaining,type:'attack'};E.SOULS.run('beforeHealthDamage',shared);remaining=shared.amount;}corpseLethal(a,t,remaining);if(!rage&&!effectContext.ignoreLimit)remaining=preventLethal(t,remaining);
      const dealt=Math.min(effectContext.leaveOne?Math.max(0,t.hp-1):t.hp,remaining);if(dealt>0&&doubledIncoming)t.counts.nextDamageDouble--;t.hp-=dealt;resolveDeath(t);if(dealt>0&&t.counts.nextDamageReturn!==undefined){t.soulState.pendingDamageReturn=dealt*t.counts.nextDamageReturn;delete t.counts.nextDamageReturn;}t.roundAttackDamage+=dealt;if(skillPhase)t.roundSkillDamageTaken+=dealt;t.roundDamageTaken+=dealt;a.lastAttackDamage=dealt;if(dealt>0){deathRetaliate(t,a);E.SOULS.run('damageTaken',{...context(t,a,m),dealt});damageDealt(a,t,dealt);if(!rage&&on(t,'概率攻击免疫')&&t.effects['概率攻击免疫'].reflect)t.soulState.orderReflect=(t.soulState.orderReflect??0)+dealt*t.effects['概率攻击免疫'].reflect;}if(!rage)E.SOULS.run('attackDamageTaken',{...context(t,a,m),dealt,shieldDamage:(t.roundShieldDamage??0)-shieldAtAttackStart});if(!rage&&t.hp>0&&on(t,'受击自然庇佑')&&rng(s)<t.effects['受击自然庇佑'].chance/100){const roll=rng(s);heal(t,roll<.5?200:roll<.8?300:400,'自然庇佑','skill');}statusRules.attackDealt(a,t,r,dealt,inflict);if(!rage&&effectContext.observeWeakAdditional)E.WIKI.effectsEngine.run('afterDamageResolved',m.operations,{...skillContext(a,t,m),affinity,dealt,shieldDamage:(t.roundShieldDamage??0)-shieldAtAttackStart,attackImmune:observedAttackImmune});
      if(!rage&&dealt>0&&t.hp>0&&a.hp>0&&on(t,'低伤定额反击')&&dealt<t.effects['低伤定额反击'].threshold)inflict(t,a,t.effects['低伤定额反击'].amount,'低伤定额反击','fixed');
      if(!rage&&t.hp>0&&a.hp>0&&on(t,'高伤回满反击')&&dealt>t.effects['高伤回满反击'].threshold){const before=t.hp;heal(t,t.stats.maxHp,'高伤回满反击','skill');if(t.hp>before)inflict(t,a,t.hp-before,'高伤回满反击','fixed');}
      if(!rage&&t.hp>0&&a.hp>0&&on(t,'光惩持续')){const e=t.effects['光惩持续'];if(!ailment(a,e.fatigue,t)){drainPercent(t,a,a.stats.maxHp/e.denominator,'光之惩戒受击吸取');}}
      if(!rage&&t.hp>0&&a.hp>0&&on(t,'受击疲惫或固伤')){const e=t.effects['受击疲惫或固伤'];if(!(rng(s)<e.chance/100&&ailment(a,'疲惫',t)))inflict(t,a,e.amount,'罗兰剑语未触发疲惫','fixed');}
      if(!rage&&t.hp>0&&a.hp>0&&on(t,'诅咒受击反应')){const e=t.effects['诅咒受击反应'];if(!(rng(s)<e.chance&&ailment(a,e.ailment,t,false,false,null,{probabilityPercent:e.chance??100})))stage(a,-e.drop);}
      // Effect 642 is single-target in this engine: the currently active
      // defender retaliates against the attacker.  In a team battle the
      // source wording can select another allied active pet; that branch is
      // kept in the deferred registry and is intentionally not selected here.
      if(!rage&&m.kind!=='status'&&t.hp>0&&a.hp>0&&active(t,'在场反击',r)){
        const reaction=t.effects['在场反击'];
        if(rng(s)<reaction.chance/100){
          const amount=reactionFixedDamage[reaction.action];
          if(amount===undefined)throw new Error(`效果642反击类型未实现：${reaction.action}`);
          inflict(t,a,amount,'在场反击','fixed');
        }
      }
      if(!rage&&t.hp>0&&on(t,'受击随机清PP')&&rng(s)<t.effects['受击随机清PP'].chance/100){const pool=a.moves.filter(id=>a.pp[id]>0);for(let i=0;i<t.effects['受击随机清PP'].count&&pool.length;i++)a.pp[pool.splice(Math.floor(rng(s)*pool.length),1)[0]]=0;emit(`${name(t)} 受击随机清空对手技能 PP。`);}
      if(!rage&&a.hp>0&&on(t,'受击低伤异常')&&dealt<t.effects['受击低伤异常'].threshold)ailment(a,t.effects['受击低伤异常'].ailment,t);
      if(!rage&&on(t,'受击定额反弹')&&a.hp>0)inflict(t,a,t.effects['受击定额反弹'].amount,'受击定额反弹','fixed');
      if(!rage&&on(t,'受击反弹')&&a.hp>0)inflict(t,a,dealt*t.effects['受击反弹'].fraction,'受击反弹','fixed');
      emit(`${name(t)} 损失 ${dealt} 点体力${crit?'，致命一击':''}${rage?'（星皇之怒）':''}。`,'damage',`威力 ${power} · ${m.kind==='special'?'特攻':'攻击'} ${effective(a,attackStat)} / 防御 ${defense} · 基础 ${base} × 本系 ${stab} × 属性 ${affinity} × 暴击 ${crit?2:1} × 增减伤 ${modifier*attackTimedFactor} × 浮动 ${roll}% = ${raw}；暴击伤害抗性 ${crit&&!rage?t.build.resistance.critical:0}% 后 ${total}；实际 ${dealt}`);
      if(!rage&&t.hp>0&&on(t,'受击比例回血')&&rng(s)<t.effects['受击比例回血'].chance/100)heal(t,t.stats.maxHp*t.effects['受击比例回血'].fraction,'受击比例回血','skill');
      if(!rage&&t.hp>0&&on(t,'受击回血')&&rng(s)<t.effects['受击回血'].chance/100)heal(t,t.effects['受击回血'].amount,'受击回血');
      if(!rage&&t.hp>0&&on(t,'大伤回满')&&dealt>t.effects['大伤回满'].threshold)heal(t,t.stats.maxHp,'大伤回满','skill');
      if(!rage&&t.hp>0&&on(t,'受击令对手易伤'))timed(a,'其他技能易伤',1,{except:null},r+1);
      if(!rage&&t.hp>0&&on(t,'受击削弱双攻'))stage(a,-1,['atk','spa']);
      if(!rage&&t.hp>0&&on(t,'受击双防强化'))stage(t,1,['def','spd']);
      if(!rage&&t.hp>0&&on(t,'受击异常')&&rng(s)<t.effects['受击异常'].chance/100)ailment(a,t.effects['受击异常'].ailment,t);
      if(!rage&&t.hp>0&&on(t,'受击弱化对手'))t.effects['受击弱化对手'].stages.forEach((n,i)=>{if(n)stage(a,n,[keys[i]]);});
      if(!rage&&t.hp>0&&a.hp>0&&on(t,'幽蝶命中异常')){const pool=t.effects['幽蝶命中异常'].ailments;ailment(a,pool[Math.floor(rng(s)*pool.length)],t);}
      if(!rage&&t.hp>0&&a.hp>0&&on(t,'受击反应')){const e=t.effects['受击反应'];if(!(rng(s)<e.chance&&ailment(a,e.ailment,t,false,false,null,{probabilityPercent:e.chance??100})))clear(a);}
      if(!rage&&t.hp>0&&on(t,'受击清强'))context(t,a,m).clearBoost(a);
      if(!rage&&t.hp>0)E.SOULS.run('receivedAttack',{...context(t,a,m),dealt});
      return {dealt,crit};
    }
    function suitAfterAttack(a,t,hit){
      // Attacker effects precede surviving defender reactions. Extra actions skip these hooks.
      if(a.hp>0&&t.hp>0){
        if(wears(a,'dawn'))inflict(a,t,a.hp>a.stats.maxHp/2?200:100,'晨曦追加','fixed');
        if(wears(a,'royal')&&a.suitState.royalFollowRound===r)inflict(a,t,a.stats.maxHp*.15,'皇御未受击奖励','percent');
        if(wears(a,'destiny')&&a.suitState.stacks>0){const stacks=a.suitState.stacks;
          if(hit.dealt<300){const v=inflict(a,t,t.stats.maxHp*.02*stacks,'胜天吸血','percent');heal(a,v,'胜天吸血');}
          else inflict(a,t,hit.dealt*.04*stacks,'胜天追加','percent');
        }
      }
      if(t.hp>0){
        if(wears(t,'royal')){if(hit.dealt<300&&a.hp>0)inflict(t,a,300,'皇御反击','fixed');else if(hit.dealt>=300){t.suitState.royalBoost=true;emit(`${name(t)} 皇御：下次攻击伤害 +40%。`);}}
        if(wears(t,'dawn'))heal(t,t.hp<t.stats.maxHp/2?200:100,'晨曦受击回复');
        if(wears(t,'corrosion')){t.suitState.corrodeRound=r+1;emit(`${name(t)} 腐蚀：登记下回合麻痹。`);}
      }
    }
    function normalEffect(a,t,m,dealt,crit){
      if(a.soulState.warConsumedDamage!==undefined){const n=a.soulState.warConsumedDamage;delete a.soulState.warConsumedDamage;if(t.hp>0&&n>0)inflict(a,t,n,m.name+'消耗追加','fixed');}
      E.WIKI.effectsEngine.run('afterHit',m.operations,{...skillContext(a,t,m),heal:(f,n,source)=>heal(f,n,source,'skill'),hurt:(f,n,source,type,bypass)=>inflict(a,actualFighter(f),n*(actualFighter(f)===t&&on(f,'其他技能易伤')&&f.effects['其他技能易伤'].except!==m.id?2:1),source,type,bypass),dealt,crit,first,opponentBoostedAtHit:Object.values(opponentView(a,t).stages).some(n=>n>0)});
      switch([30381,30380,30376,25294,25295].includes(m.wikiId)?m.wikiId:m.id){
        case 'emperor5':case 30381: if(crit)count(a,'rageFull',2);break;
        case 'emperor150':case 30380: if(t.hp>0){if(dealt<280)ailment(t,'疲惫',a);set(t,'attackBlock',1,r+1);}break;
        case 'emperorQuick':case 30376:
          if(t.hp<=0)break;
          if(clear(t)){const pool=t.moves.filter(id=>t.pp[id]>0);for(let n=0;n<2&&pool.length;n++){const id=pool.splice(Math.floor(rng(s)*pool.length),1)[0];t.pp[id]=0;emit(`${name(t)} ${battleMoves[id].name} PP 归零。`);}}
          if(boosted(t).length){for(const k of boosted(t))t.stages[k]=0;emit(`${name(t)} 能力提升被清除。`);set(a,'rageBonus',2,r+1);}break;
        case 'gate':case 25294:set(a,'gate',3+(a.side!==first?1:0));count(a,'immune',2);break;
        case 'cycle':case 25295:boost(a,a.hp<a.stats.maxHp/2?2:1);set(a,'drain',4);count(a,'rageDouble',2);break;
        case 'king150':if(t.hp>0&&rng(s)<.5+.08*boosted(a).length)ailment(t,'麻痹',a);break;
        case 'kingQuick':if(a.side===first&&t.hp>0)set(t,'statusBlock',1);break;
        case 'inherit':boost(a,a.hp<t.hp?2:1);set(a,'fullHeal',2);set(a,'reflect',5+(a.side!==first?1:0));break;
        case 'stormKing':boost(a,1);set(a,'thirdHeal',3);set(a,'reflect',4+(a.side!==first?1:0));set(a,'protect',2+(a.side!==first?1:0));break;
        case 'struggle':hurt(a,Math.max(1,a.stats.maxHp/4),'挣扎反伤');break;
      }
    }
    function rageEffect(a,t,m){
      switch([30381,30380,30376,25294,25295].includes(m.wikiId)?m.wikiId:m.id){
        case 'emperor5':case 30381:count(a,'attackPriority',2);break;
        case 'emperor150':case 30380:if(!(rng(s)<.5&&ailment(t,'失明',a,true)))set(t,'statusBlock',2+(a.side!==first?1:0));break;
        case 'emperorQuick':case 30376:if(!boosted(t).length)inflict(a,t,t.stats.maxHp/3,'皇怒附加伤害',true,true);break;
        case 'gate':case 25294:set(a,'protect',2+(a.side!==first?1:0));set(a,'priority',2,r+1);break;
        case 'cycle':case 25295:set(a,'doubleDamage',2,r+1);count(a,'halfDamage',2);break;
      }
    }
    for(const side of [first,1-first]){currentActorSide=side;
      if(s.finished)break;
      const a=fs[side],t=fs[1-side],m=battleMoves[choices[side]];
      if(m.kind==='item'){emit(`${name(a)} 使用了${m.name}。`,'move');if(m.id==='potion:hp')heal(a,250,'血药');else {let restored=0;for(const id of a.moves){const before=a.pp[id];a.pp[id]=battleMoves[id].pp;restored+=a.pp[id]-before;}emit(`${name(a)} PP 药：全部技能 PP 回满，共恢复 ${restored} 点。`,'heal');}endAction(a,t,m,true);finish();continue;}
      statusRules.actionStart(a,m,r,battleMoves);
      if(statusRules.blocksAction(a,r,t)||Object.entries(a.ailments).some(([k,end])=>['瘫痪','焚烬','神游','诅咒','感染'].includes(k)&&end>=r)){emit(`${name(a)} 受控制无法行动，未消耗 PP。`,'miss');E.SOULS.run('actionSkipped',{...context(a,t,m),reason:'control'});endAction(a,t,m,false);finish();continue;}
      if(m.id!=='struggle'&&!ppRules.usable(a,m.id,!!E.SOULS.trait(a,'ignorePP'))){emit(`${name(a)} ${m.name} 已无 PP，无法行动。`,'miss');E.SOULS.run('actionSkipped',{...context(a,t,m),reason:'noPP'});endAction(a,t,m,false);finish();continue;}
      a.soulState.ppBeforeUse={...a.pp};
      if(m.id!=='struggle')ppRules.consume(a,m.id,E.SOULS.trait(a,'noPPConsumption')?0:on(a,'PP消耗倍增')?a.effects['PP消耗倍增'].multiple:1,!!E.SOULS.trait(a,'ignorePP'));
      if(a.counts.nextSkillPriority>0)a.counts.nextSkillPriority--;
      if(m.kind==='status'&&a.soulState.nextStatusPriorityPenalty>0)a.soulState.nextStatusPriorityPenalty--;
      a.soulState.statusNoAilmentThis=m.kind==='status'&&a.soulState.nextStatusNoAilment>0;if(a.soulState.statusNoAilmentThis)a.soulState.nextStatusNoAilment--;
      a.soulState.nextSoulSkillBoostThis=a.counts.nextSoulSkillBoost>0;if(a.soulState.nextSoulSkillBoostThis)a.counts.nextSoulSkillBoost--;
      if(m.kind!=='status'){a.soulState.currentDefenseIgnore=a.counts.nextDefenseIgnore??0;delete a.counts.nextDefenseIgnore;a.soulState.currentDamageReductionIgnore=a.counts.nextDamageReductionIgnore??0;delete a.counts.nextDamageReductionIgnore;}
      used[side]=true;a.soulState.skillUses??={};a.soulState.skillUses[m.id]=(a.soulState.skillUses[m.id]??0)+1;a.consecutiveUses=a.previousMoveId===m.id?(a.consecutiveUses??0)+1:1;a.previousMoveId=m.id;
      attackBonus[side]=m.kind!=='status'&&a.suitState.royalBoost?1.4:1;a.soulState.nextAttackBoostThis=m.kind!=='status'&&a.counts.nextAttackBoost>0?(a.soulState.nextAttackBoostFraction??0):0;if(m.kind!=='status'&&a.counts.nextAttackBoost>0)a.counts.nextAttackBoost--;
      a.soulState.nextAttackFixedThis=m.kind!=='status'&&a.counts.nextAttackFixed>0?(a.soulState.nextAttackFixedAmount??0):0;
      if(a.soulState.nextAttackFixedThis)a.counts.nextAttackFixed--;
      if(m.kind!=='status'&&a.suitState.royalBoost){a.suitState.royalBoost=false;emit(`${name(a)} 消耗皇御下次攻击增伤。`);}
      emit(`${name(a)} 使用${m.name}。`,'move');
      skillPhase=true;E.SOULS.run('opponentBeforeUse',{...context(t,a,m),first});if(a.hp<=0||t.hp<=0){skillPhase=false;endAction(a,t,m,false);if(finish())break;continue;}E.SOULS.run('beforeUse',{...context(a,t,m),first});
      if(a.hp<=0||t.hp<=0){skillPhase=false;endAction(a,t,m,false);if(finish())break;continue;}
      if(m.kind!=='status'&&on(t,'poseidonAttackDrain')){drainPercent(t,a,a.stats.maxHp/t.effects.poseidonAttackDrain.denominator,'波塞冬命中前吸取','');if(a.hp<=0||t.hp<=0){skillPhase=false;endAction(a,t,m,false);if(finish())break;continue;}}
      if(on(a,'用招前随机吸强')){const pool=[...keys];for(let i=0;i<a.effects['用招前随机吸强'].count&&pool.length;i++){const k=pool.splice(Math.floor(rng(s)*pool.length),1)[0];stage(t,-1,[k]);stage(a,1,[k]);}a.soulState.randomStealRound=r;}
      if(a.side===first&&on(a,'先手附加异常'))ailment(t,a.effects['先手附加异常'].ailment,a);
      // Snapshot use-count buffs before granting new ones: "next" excludes this use.
      const curseThis=a.counts.nextSkillCurse>0?a.soulState.nextSkillCurse:null;if(curseThis)a.counts.nextSkillCurse--;
      const invalidResponseThis=a.counts.invalidSkillResponse>0?a.soulState.invalidSkillResponse:null;if(invalidResponseThis)a.counts.invalidSkillResponse--;
      const doubled=a.counts.rageDouble>0,full=a.counts.rageFull>0;
      if(doubled)a.counts.rageDouble--;if(full)a.counts.rageFull--;
      expireOtherCrit(a);
      const reservedCrit=Math.min(a.counts.nextCrit??0,a.soulState.otherCritReserved??0);
      const genericCrit=(a.counts.nextCrit??0)-reservedCrit;
      a.soulState.nextCritThis=m.kind!=='status'&&(genericCrit>0||(reservedCrit>0&&on(a,'其他攻击必暴')&&a.effects['其他攻击必暴'].except!==m.id));
      if(a.soulState.nextCritThis&&genericCrit===0)a.soulState.otherCritReserved--;
      // Only layers held before this use attach; newly granted layers are for later attacks.
      const dragonEaterThis=m.kind!=='status'&&(a.soulState.dragonEaterStacks??0)>0;
      if(dragonEaterThis)a.soulState.dragonEaterStacks--;
      a.soulState.ignoreImmunityThis=m.kind!=='status'&&a.counts.nextAttackIgnoreImmunity>0;if(a.soulState.ignoreImmunityThis)a.counts.nextAttackIgnoreImmunity--;
      if(a.soulState.nextCritThis)a.counts.nextCrit--;
      if(m.kind!=='status'&&a.counts.attackPriority>0)a.counts.attackPriority--;if(m.kind!=='status'&&a.counts.nextAttackPriority>0)a.counts.nextAttackPriority--;
      if(m.id==='emperor5'||(m.wikiId??m.id)===30381)a.fifthUses++;
      if(m.kind==='status'&&on(t,'属性招扣PP'))for(const id of a.moves)a.pp[id]=Math.max(0,a.pp[id]-t.effects['属性招扣PP'].pp);
      if(m.kind==='status'&&on(t,'gate')){for(const id of a.moves)a.pp[id]=Math.max(0,a.pp[id]-1-Math.floor(rng(s)*3));emit(`${name(t)} 瀚空之门：对手各技能 PP 随机减少 1–3。`);}
      if(m.kind!=='status'&&on(a,'攻击随机异常')&&rng(s)<a.effects['攻击随机异常'].chance/100)ailment(t,['麻痹','害怕','睡眠','烧伤','冻伤','中毒'][Math.floor(rng(s)*6)],a);
      const nextSkillInvalid=!!a.counts.nextSkillInvalid;delete a.counts.nextSkillInvalid;
      const nextStatusInvalid=m.kind==='status'&&a.counts.nextStatusInvalid>0;if(nextStatusInvalid)a.counts.nextStatusInvalid--;
      const nextHighPowerInvalid=m.kind!=='status'&&m.power>a.soulState.invalidPowerThreshold&&a.counts.nextHighPowerInvalid>0;
      if(nextHighPowerInvalid)a.counts.nextHighPowerInvalid--;
      const nextAttackInvalid=m.kind!=='status'&&a.counts.nextAttackInvalid>0;
      if(nextAttackInvalid)a.counts.nextAttackInvalid--;
      const runeBlocked=m.kind==='status'&&on(t,'符文咒印');
      const blocked=runeBlocked||statusRules.skillInvalid(a,m,r,()=>rng(s))||a.soulState.skillInvalidRound===r||nextSkillInvalid||nextStatusInvalid||nextAttackInvalid||nextHighPowerInvalid||on(a,'skillBlock')||(m.kind==='status'&&r<=(E.SOULS.trait(t,'entryStatusBlockRounds')??0))||(m.kind!=='status'&&a.side===first&&on(t,'对手先手攻击无效'))||on(a,m.kind==='status'?'statusBlock':'attackBlock')||(m.kind==='status'&&on(t,'对手属性失效')&&rng(s)<t.effects['对手属性失效'].chance/100);
      const cachedCrit=m.kind!=='status'&&a.counts.criticalForceHit>0?rollCritical(a,t,m):null;
      const forceCriticalHit=cachedCrit===true;if(forceCriticalHit)a.counts.criticalForceHit--;
      const blind=m.kind!=='status'&&a.ailments['失明']>=r&&rng(s)<.5;
      const accuracyContext={...skillContext(a,t,m),alwaysHit:false};E.WIKI.effectsEngine.run('beforeAccuracy',m.operations,accuracyContext);
      const alwaysHit=accuracyContext.alwaysHit||on(a,'战之龙魂')||m.alwaysHit||(m.kind!=='status'&&on(a,'攻击必中'))||(m.kind==='special'&&E.SOULS.trait(a,'specialAlwaysHit'));
      const miss=!alwaysHit&&rng(s)*100>=Math.min(100,m.accuracy*E.multiplier(ignoresBoosts(a)?Math.min(0,effectiveStage(a,'acc')):(effectiveStage(a,'acc')))*(E.SOULS.trait(t,'opponentAccuracyMultiplier')??1)*statusRules.accuracyMultiplier(a,m.kind,r));
      const forcedMiss=!alwaysHit&&(m.kind!=='status'&&(on(a,'攻击必失')||on(t,'攻击必失且命中封属'))||m.kind==='physical'&&on(t,'物理攻击闪避')||m.kind==='special'&&on(t,'特殊攻击闪避'));
      const chaosDodge=m.kind!=='status'&&!alwaysHit&&t.soulId===846&&rng(s)<.7;
      if(m.kind!=='status'&&t.soulId===846){if(chaosDodge)t.soulState.chaosDodgeBuffRound=r+1;else t.soulState.chaosDodgeFailedRound=r;}
      const soulDodge=chaosDodge||m.kind!=='status'&&!alwaysHit&&(E.SOULS.trait(t,'dodgeChance')??0)>0&&rng(s)<E.SOULS.trait(t,'dodgeChance');
      if(soulDodge){if(chaosDodge)emit(`${name(t)} 混沌布莱克魂印闪避，下回合攻击伤害提升 50%。`);else if([516,531].includes(t.soulId)){t.soulState.blakeBuffRound=r+1;emit(`${name(t)} 王·布莱克魂印闪避，下一回合攻击无视双防强化。`);}}
      let ppDodge=false;
      if(m.kind!=='status'&&!blocked&&on(t,'概率闪避失败清PP')){const e=t.effects['概率闪避失败清PP'];ppDodge=!alwaysHit&&rng(s)<e.chance/100;if(!ppDodge){const pool=a.moves.slice();for(let i=0;i<e.count&&pool.length;i++)a.pp[pool.splice(Math.floor(rng(s)*pool.length),1)[0]]=0;}}
      const evaded=m.kind!=='status'&&!alwaysHit&&on(t,'回合闪避失败减伤')&&t.effects['回合闪避失败减伤'].dodge||ppDodge||soulDodge||m.kind!=='status'&&!alwaysHit&&on(t,'概率闪避')&&rng(s)<t.effects['概率闪避'].chance/100;
      let useAttackDamage=0,actionLanded=false;
      const invalid=!forceCriticalHit&&(blocked||blind||miss||forcedMiss||evaded);
      if(invalid&&!blocked)E.WIKI.effectsEngine.run('onMiss',m.operations,{...skillContext(a,t,m),heal:(f,n,source)=>heal(f,n,source,'skill'),first});
      if(invalid&&!blocked&&m.kind!=='status'&&on(t,'概率闪避')&&t.effects['概率闪避'].healFraction)heal(t,t.stats.maxHp*t.effects['概率闪避'].healFraction,'闪避回复','skill');
      if(invalid&&!blocked&&on(t,'对手未命中回复'))heal(t,t.stats.maxHp*t.effects['对手未命中回复'].fraction,'对手未命中回复','skill');
      if(invalid&&!blocked&&on(t,'对手未命中下回合必暴'))timed(t,'必定暴击',1,{},r+1);
      if(m.kind!=='status'&&a.counts.nextAttackMissAilment){const k=a.counts.nextAttackMissAilment;delete a.counts.nextAttackMissAilment;if(invalid&&!blocked)ailment(a,k,t);}
      if(invalid){
        if(runeBlocked)delete t.effects['符文咒印'];
        emit(`${name(a)} 技能${blocked?'被封锁':blind?'因失明失效':'未命中'}。`,'miss');E.WIKI.effectsEngine.run('onInvalid',m.operations,{...skillContext(a,t,m),first});
        if(invalidResponseThis&&a.hp>0&&t.hp>0){
          ailment(t,invalidResponseThis.ailment,a);
          if(m.kind!=='status'){a.soulState.invalidSkillMinimumThis=invalidResponseThis.minimum;damage(a,t,{...m,operations:[]},false,false);delete a.soulState.invalidSkillMinimumThis;}
        }
      }
      else {const useContext={...skillContext(a,t,m),first,hits:1};E.WIKI.effectsEngine.run('beforeUse',m.operations,useContext);
        if(a.hp>0&&t.hp>0&&on(a,'用招伤害前降防速')){const e=a.effects['用招伤害前降防速'],before={def:t.stages.def,spe:t.stages.spe};stage(t,-e.def,['def']);stage(t,-e.spe,['spe']);if(t.stages.def===before.def&&t.stages.spe===before.spe)inflict(a,t,t.stats.maxHp/e.denominator,'用招降防速未触发','percent');}
        let total=0,crit=false,landed=false;
        for(let hitIndex=0;hitIndex<useContext.hits&&a.hp>0&&t.hp>0;hitIndex++){const hit=m.kind==='status'?{dealt:0,crit:false}:damage(a,t,m,false,false,null,hitIndex===0?cachedCrit:null,forceCriticalHit||accuracyContext.alwaysHit);if(hit.invalid)continue;landed=true;total+=hit.dealt;crit ||=hit.crit;normalEffect(a,t,m,hit.dealt,hit.crit);if(m.id===30502&&t.hp>0&&rng(s)<(a.soulState.phoenixHitChance??0)/100)ailment(t,'焚烬',a);if(hitIndex===0)E.SOULS.run('afterHit',{...context(a,t,m),...hit,first});}
        if(m.kind!=='status'&&crit&&on(a,'暴击后异常免疫次数'))a.counts.immune=(a.counts.immune??0)+a.effects['暴击后异常免疫次数'].count;
        if(landed&&m.kind!=='status'&&a.hp>0&&t.hp>0&&on(a,'直接攻击降双防')){const e=a.effects['直接攻击降双防'];stage(t,e.amount,['def','spd']);}
        if(landed&&a.hp>0&&t.hp>0&&on(a,'命中技能附加固伤'))inflict(a,t,a.effects['命中技能附加固伤'].amount,'命中技能附加固伤','fixed');actionLanded=landed;a.lastAttackDamage=m.kind==='status'?(a.lastAttackDamage??0):total;useAttackDamage=total;
        if(m.kind!=='status'&&landed){const hit={dealt:total,crit};if(on(a,'御之龙魂')&&t.hp>0){const pool=t.moves.filter(id=>t.pp[id]>0);if(pool.length)t.pp[pool[Math.floor(rng(s)*pool.length)]]=0;}if(a.hp>0&&t.hp>0&&on(a,'攻击削减当前体力'))inflict(a,t,t.hp*a.effects['攻击削减当前体力'].fraction,'攻击削减当前体力','percent');if(a.hp>0&&t.hp>0&&on(a,'攻击双防粉伤'))inflict(a,t,(E.effective(a,'def')+E.effective(a,'spd'))*a.effects['攻击双防粉伤'].fraction,'攻击双防粉伤','percent');if(a.hp>0&&t.hp>0&&on(a,'其他攻击附加固伤')&&m.id!==a.effects['其他攻击附加固伤'].except)inflict(a,t,a.effects['其他攻击附加固伤'].amount,'其他攻击附加固伤','fixed');if(on(a,'攻击吸血'))heal(a,total*a.effects['攻击吸血'].fraction,'攻击吸血','skill');if(a.hp>0&&t.hp>0&&on(a,'攻击附加固伤'))inflict(a,t,a.effects['攻击附加固伤'].amount,'攻击附加固伤','fixed');
          if(a.hp>0&&t.hp>0&&on(a,'高伤概率异常')){const e=a.effects['高伤概率异常'];if(total>e.threshold&&rng(s)<e.chance/100)ailment(t,e.ailment,a,false,false,null,{probabilityPercent:e.chance??100});}
          if(on(a,'攻击附加异常')){const e=a.effects['攻击附加异常'];statusRules.markExecution(a,r,[e.ailment]);if(rng(s)<e.chance/100)ailment(t,e.ailment,a,false,false,null,{probabilityPercent:e.chance??100});}
          if(a.hp>0&&t.hp>0&&on(a,'冰之祝福')){const e=a.effects['冰之祝福'];inflict(a,t,e.fixedMin+Math.floor(rng(s)*(e.fixedMax-e.fixedMin+1)),'冰之祝福','fixed');}
          if(a.hp>0&&t.hp>0&&on(a,'奇迹之力'))inflict(a,t,a.stats.maxHp/3,'奇迹之力追加','fixed');
          if(a.hp>0&&t.hp>0&&on(a,'攻击附加较高攻击粉伤'))inflict(a,t,Math.max(effective(a,'atk'),effective(a,'spa'))*a.effects['攻击附加较高攻击粉伤'].fraction,'较高攻击追加','percent');
          if(a.hp>0&&t.hp>0&&on(a,'攻击附加当前体力粉伤'))inflict(a,t,a.hp*a.effects['攻击附加当前体力粉伤'].fraction,'当前体力追加','percent');
          if(a.hp>0&&t.hp>0&&E.SOULS.trait(a,'attackFixedFraction'))inflict(a,t,effective(a,'atk')*E.SOULS.trait(a,'attackFixedFraction'),'王夜魂印追加','fixed');
          if(a.soulState.blakeBuffRound===r&&t.hp>0&&rng(s)<(E.SOULS.trait(a,'dodgeFearChance')??0)/100)ailment(t,'害怕',a);
          if(a.soulState.nextAttackFixedThis&&t.hp>0)inflict(a,t,a.soulState.nextAttackFixedThis,'下次攻击追加','fixed');
          if(on(a,'攻击概率异常')&&t.hp>0&&rng(s)<a.effects['攻击概率异常'].chance/100)ailment(t,a.effects['攻击概率异常'].ailment,a);
          const butterflyDrain=m.operations?.find(op=>op.effectId===2202);if(butterflyDrain&&a.hp>0&&t.hp>0&&a.soulState.butterflyMoveTypes.shadow>=a.soulState.butterflyMoveTypes.light)drainPercent(a,t,t.stats.maxHp/butterflyDrain.params[0],m.name);
          E.WIKI.effectsEngine.run('afterAttack',m.operations,{...skillContext(a,t,m),heal:(f,n,source)=>heal(f,n,source,'skill'),hurt:(f,n,source,type,bypass)=>inflict(a,actualFighter(f),n*(actualFighter(f)===t&&on(f,'其他技能易伤')&&f.effects['其他技能易伤'].except!==m.id?2:1),source,type,bypass),...hit,first});
          if(a.soulState.effect1176Pending?.round===r&&a.soulState.effect1176Pending.move===m.id){const pending=a.soulState.effect1176Pending;delete a.soulState.effect1176Pending;if(t.hp>0)inflict(a,t,pending.amount,m.name+'未触发追加','fixed');}
          if(a.soulState.warAttackHeal){delete a.soulState.warAttackHeal;heal(a,total,m.name+'攻击回复','skill');}E.SOULS.run('afterAttack',{...context(a,t,m),...hit,first});
          if(crit&&a.hp>0&&on(a,'暴击回满体力'))heal(a,a.stats.maxHp,'暴击回满体力','skill');
          if(dragonEaterThis&&a.hp>0&&t.hp>0){const n=inflict(a,t,150+Math.floor(rng(s)*151),'邪龙之噬','fixed');heal(a,n,'邪龙之噬','skill');}
          if(t.hp>0&&m.kind!=='status'&&on(t,'攻击后效果')){const e=t.effects['攻击后效果'];if(rng(s)<.5)ailment(a,e.ailment==='9'?'石化':e.ailment,t);else timed(a,'statusBlock',e.statusBlock,{},r+1);}
          suitAfterAttack(a,t,hit);}}
      if(curseThis&&a.hp>0&&t.hp>0&&rng(s)<curseThis.chance)ailment(t,curseThis.ailment,a);
      if(a.hp>0&&t.hp>0&&m.kind!=='status'&&on(t,'茉蕊攻击后感染')&&!ailment(a,'感染',t))timed(a,'statusBlock',t.effects['茉蕊攻击后感染'].statusBlock,{},r+1);
      if(a.hp>0&&t.hp>0&&m.kind!=='status'&&on(t,'兰斯攻击后瘫痪')&&!ailment(a,'瘫痪',t))timed(a,'statusBlock',t.effects['兰斯攻击后瘫痪'].statusBlock,{},r+1);
      if(a.hp>0&&t.hp>0&&m.kind!=='status'&&(on(t,'3580攻击后异常')||on(t,'攻击后必异常'))){const e=t.effects['3580攻击后异常']??t.effects['攻击后必异常'];if(!ailment(a,e.ailment,t,false,false,null,{probabilityPercent:e.chance??100}))timed(a,'statusBlock',e.statusBlock,{},r+1);}
      // 持续用攻分支：复用公共异常判定、实际吸取与技能回复，未行动在此阶段之前退出。
      if(a.hp>0&&t.hp>0&&m.kind!=='status'&&on(a,'自身用攻异常或吸取')){const e=a.effects['自身用攻异常或吸取'];statusRules.markExecution(a,r,[e.ailment]);if(!((e.chance>=100||e.chance>0&&rng(s)<e.chance/100)&&ailment(t,e.ailment,a,false,false,null,{probabilityPercent:e.chance??100}))){drainPercent(a,t,t.stats.maxHp/e.denominator,'用攻异常未触发吸取');}}
      if(a.hp>0&&t.hp>0&&m.kind!=='status'&&on(t,'对手用攻异常或清回合')){const e=t.effects['对手用攻异常或清回合'];if(!((e.chance>=100||e.chance>0&&rng(s)<e.chance/100)&&ailment(a,e.ailment,t,false,false,null,{probabilityPercent:e.chance??100})))clear(a);}
      // 1329 observes a use even on a miss. Control preventing the use exits earlier.
      if(t.hp>0&&m.kind!=='status'&&on(t,'邪龙之噬观察')){
        t.soulState.dragonEaterStacks=(t.soulState.dragonEaterStacks??0)+t.effects['邪龙之噬观察'].stacks;
        emit(name(t)+' 获得 '+t.effects['邪龙之噬观察'].stacks+' 道邪龙之噬。');
      }
      // Once-per-use effects also run on an invalid skill, but never for extra actions.
      if(a.hp>0&&t.hp>0&&a.side===first&&on(a,'托鲁克先手害怕')&&rng(s)<a.effects['托鲁克先手害怕'].chance/100)ailment(t,'害怕',a,false,false,null,{durationFallback:{origin:'source-effect-117-explicit-1-3',resolve:random=>1+Math.floor(random()*3)}});
      if(a.hp>0&&t.hp>0&&on(a,'托鲁克先手控制清回合')&&a.side===first){const e=a.effects['托鲁克先手控制清回合'];if(!(rng(s)<e.chance/100&&ailment(t,e.ailment,a,false,false,null,{probabilityPercent:e.chance??100})))clear(t);}
      if(a.hp>0&&t.hp>0&&on(a,'技能回复量追加')){const e=a.effects['技能回复量追加'];if(inflict(a,t,e.amount,'技能回复量追加','percent')===0)context(a,t,m).randomNonRestrictedPvpAilments(e.count,2312);}
      if(a.hp>0&&t.hp>0&&on(a,'用招异常失败吸取')){const e=a.effects['用招异常失败吸取'];statusRules.markExecution(a,r,[e.ailment]);if(!((e.chance>=100||e.chance>0&&rng(s)<e.chance/100)&&ailment(t,e.ailment,a,false,false,null,{probabilityPercent:e.chance??100})))drainPercent(a,t,t.stats.maxHp/e.denominator,'用招异常失败吸取');}
      if(a.hp>0&&t.hp>0&&on(a,'用招消盾真伤')){const n=consumeShields(t,a);if(n>0)inflict(a,t,n*a.effects['用招消盾真伤'].fraction,'用招消盾真伤','true');}
      if(a.hp>0&&t.hp>0&&on(a,'用招失明或粉伤')){const e=a.effects['用招失明或粉伤'];if(!(rng(s)<e.chance/100&&ailment(t,e.ailment,a,false,false,null,{probabilityPercent:e.chance??100})))inflict(a,t,t.stats.maxHp/e.denominator,'光之惩戒未触发','percent');}
      if(a.hp>0&&on(a,'用招回血满体改粉伤')){const e=a.effects['用招回血满体改粉伤'];if(a.hp===a.stats.maxHp){if(t.hp>0)inflict(a,t,a.stats.maxHp*e.fullFraction,'满体改百分比','percent');}else{const before=a.hp;heal(a,a.stats.maxHp*e.fraction,'用招回血粉伤','skill');if(t.hp>0&&a.hp>before)inflict(a,t,a.hp-before,'用招回血粉伤','percent');}}
      if(a.hp>0&&on(a,'用招回血粉伤')){const before=a.hp;heal(a,a.stats.maxHp*a.effects['用招回血粉伤'].fraction,'用招回血粉伤','skill');const n=a.hp-before;if(t.hp>0&&n>0)inflict(a,t,n,'用招回血粉伤','percent');}
      if(a.hp>0&&t.hp>0&&on(a,'用招异常失败弱化')){const e=a.effects['用招异常失败弱化'];statusRules.markExecution(a,r,[e.ailment]);if(!(rng(s)<e.chance/100&&ailment(t,e.ailment,a,false,false,null,{probabilityPercent:e.chance??100})))stage(t,-e.amount);}
      if(a.hp>0&&t.hp>0&&on(a,'用招低体双吸')){const e=a.effects['用招低体双吸'],multiple=a.hp<a.stats.maxHp*e.threshold?2:1;const immune=damageImmune(t,'percent');drainPercent(a,t,t.stats.maxHp*e.fraction*multiple,'用招低体双吸');if(immune&&e.immuneTrueDamage&&t.hp>0)inflict(a,t,e.immuneTrueDamage,'吸取免疫追加','true');}
      if(a.hp>0&&t.hp>0&&on(a,'用招低体吸取禁疗')){const e=a.effects['用招低体吸取禁疗'],n=drainPercent(a,t,t.stats.maxHp*e.fraction*(a.hp<a.stats.maxHp*e.threshold?2:1),'用招低体吸取禁疗');if(n===0)timed(t,'技能禁疗',e.duration,{},r+1);}
      if(a.hp>0&&t.hp>0&&on(a,'用招低体吸取')){const e=a.effects['用招低体吸取'],multiple=a.hp<a.stats.maxHp*e.threshold?2:1;drainPercent(a,t,t.stats.maxHp*e.fraction,'用招低体吸取','skill',multiple);}
      if(a.hp>0&&t.hp>0&&on(a,'用招吸取体力'))drainPercent(a,t,t.stats.maxHp*a.effects['用招吸取体力'].fraction,'用招吸取体力');
      if(a.hp>0&&on(a,'drain')&&t.hp>0){const requested=Math.floor(t.stats.maxHp/3)*(a.hp<a.stats.maxHp/2?2:1);drainPercent(a,t,requested,'命宇轮回吸血');}
      if(a.hp>0&&on(a,'比较体力回血'))heal(a,a.stats.maxHp*a.effects['比较体力回血'].fraction*(a.hp<t.hp?2:1),'比较体力回血','skill');
      if(!invalid&&t.hp>0&&m.kind==='status'&&on(t,'对手属性成功固伤'))inflict(t,a,t.effects['对手属性成功固伤'].amount,'对手属性成功固伤','fixed');
      if(t.hp>0&&m.kind==='status'&&on(t,'对手属性后限伤'))timed(t,'伤害上限',t.effects['对手属性后限伤'].duration,{amount:t.effects['对手属性后限伤'].amount},r+1);
      if(t.hp>0&&m.kind==='status'&&on(t,'对手属性触发封攻'))timed(a,'attackBlock',t.effects['对手属性触发封攻'].duration,{},r+1);
      if(t.hp>0&&m.kind==='status'&&on(t,'对手属性后回复'))heal(t,t.stats.maxHp*t.effects['对手属性后回复'].fraction,'对手属性技能触发回复','skill');
      if(t.hp>0&&a.hp>0&&m.kind!=='status'&&on(t,'对手攻击后最大体力削血'))inflict(t,a,a.stats.maxHp*t.effects['对手攻击后最大体力削血'].fraction,'对手攻击触发削血','percent');
      if(t.hp>0&&a.hp>0&&m.kind==='status'&&on(t,'对手属性后睡眠或削血')&&!ailment(a,'睡眠',t))inflict(t,a,a.stats.maxHp*t.effects['对手属性后睡眠或削血'].fraction,'对手属性技能未触发睡眠','percent');
      if(t.hp>0&&m.kind==='status'&&on(t,'对手属性后封攻'))a.counts.nextAttackInvalid=(a.counts.nextAttackInvalid??0)+t.effects['对手属性后封攻'].count;
      if(t.hp>0&&m.kind==='status'&&on(t,'对手属性后指定异常')&&rng(s)<t.effects['对手属性后指定异常'].chance/100)ailment(a,t.effects['对手属性后指定异常'].ailment,t);
      if(t.hp>0&&a.hp>0&&m.kind==='status'&&on(t,'对手属性随机异常'))statusRules.randomAilments({a:t,t:a,round:r,random:()=>rng(s),ailment,record:event=>{s.randomStatusEvents??=[];s.randomStatusEvents.push(event);}},t.effects['对手属性随机异常'].count,1394);
      if(t.hp>0&&a.hp>0&&m.kind==='status'&&on(t,'对手属性后随机异常清回合')){const results=statusRules.randomAilments({a:t,t:a,round:r,random:()=>rng(s),ailment,record:event=>{s.randomStatusEvents??=[];s.randomStatusEvents.push(event);}},t.effects['对手属性后随机异常清回合'].count,1348);if(!results.some(x=>x.applied))clear(a);}
      if(t.hp>0&&m.kind==='status'&&on(t,'对手属性后异常'))ailment(a,['烧伤','冻伤','中毒','麻痹','害怕','睡眠'][Math.floor(rng(s)*6)],t);
      if(t.hp>0&&m.kind==='status'&&on(t,'对手属性后必暴'))timed(t,'必定暴击',t.effects['对手属性后必暴'].duration,{},r+1);
      if(t.hp>0&&m.kind!=='status'&&on(t,'对手攻击后必暴'))timed(t,'必定暴击',t.effects['对手攻击后必暴'].duration,{},r+1);
      if(t.hp>0&&a.hp>0&&m.kind!=='status'&&on(t,'对手用攻后能力变化'))t.effects['对手用攻后能力变化'].stages.forEach((n,i)=>{if(n)stage(a,n,[keys[i]]);});
      if(t.hp>0&&m.kind!=='status'&&on(t,'对手攻击后清PP')){const pool=a.moves.slice();for(let i=0;i<t.effects['对手攻击后清PP'].count&&pool.length;i++)a.pp[pool.splice(Math.floor(rng(s)*pool.length),1)[0]]=0;emit(`${name(t)} 对手攻击后随机清空PP。`);}
      if(t.hp>0&&m.kind!=='status'&&on(t,'对手攻击后强化'))stage(t,t.effects['对手攻击后强化'].amount);
      if(t.hp>0&&m.kind!=='status'&&on(t,'受攻封属性命中')&&!invalid&&a.lastAttackDamage>0)timed(a,'statusBlock',t.effects['受攻封属性命中'].duration,{},r+1);
      if(t.hp>0&&m.kind!=='status'&&on(t,'对手攻击后随机异常')){const pool=['麻痹','烧伤','害怕','疲惫','睡眠','冰封'];let success=false;for(let i=0;i<t.effects['对手攻击后随机异常'].count&&pool.length;i++)success=ailment(a,pool.splice(Math.floor(rng(s)*pool.length),1)[0],t)||success;if(!success)clear(a);}
      if(t.hp>0&&m.kind==='physical'&&on(t,'受物攻概率烧伤')&&rng(s)<t.effects['受物攻概率烧伤'].chance/100)ailment(a,'烧伤',t);
      if(t.hp>0&&m.kind!=='status'&&on(t,'对手攻击后焚烬'))ailment(a,'焚烬',t);
      if(t.hp>0&&m.kind!=='status'&&on(t,'赛伯攻击后瘫痪'))ailment(a,'瘫痪',t);
      if(t.hp>0&&m.kind!=='status'&&on(t,'茉蕊用攻感染')&&rng(s)<t.effects['茉蕊用攻感染'].chance/100)ailment(a,'感染',t);
      if(t.hp>0&&m.kind!=='status'&&on(t,'对手攻击概率疲惫')&&rng(s)<t.effects['对手攻击概率疲惫'].chance/100)ailment(a,'疲惫',t);
      if(t.hp>0&&m.kind!=='status'&&on(t,'攻击必失且命中封属')&&!invalid&&a.lastAttackDamage>0)timed(a,'statusBlock',t.effects['攻击必失且命中封属'].duration,{},r+1);
      if(a.hp>0&&t.hp>0&&on(a,'用招体攻粉伤'))inflict(a,t,(a.stats.maxHp+effective(a,'atk'))*a.effects['用招体攻粉伤'].fraction,'用招体攻粉伤','percent');
      if(a.hp>0&&on(a,'用招条件回血')){const e=a.effects['用招条件回血'];heal(a,a.stats.maxHp*e.fraction*(a.hp<a.stats.maxHp*e.threshold?2:1),'用招条件回血','skill');}
      if(a.hp>0&&on(a,'用招低体回满')){const e=a.effects['用招低体回满'];heal(a,a.hp<a.stats.maxHp*e.threshold?a.stats.maxHp:e.amount,'用招低体回满','skill');}
      if(a.hp>0&&on(a,'用招低体比例回满')){const e=a.effects['用招低体比例回满'];heal(a,a.hp<a.stats.maxHp*e.threshold?a.stats.maxHp:a.stats.maxHp*e.fraction,'用招低体比例回满','skill');}
      if(a.hp>0&&on(a,'用招低体回血粉伤')){const e=a.effects['用招低体回血粉伤'],low=a.hp<a.stats.maxHp*e.threshold,before=a.hp;heal(a,a.stats.maxHp*e.fraction,'用招低体回血粉伤','skill');if(low&&t.hp>0)inflict(a,t,a.hp-before,'用招低体回血粉伤','percent');}
      if(a.hp>0&&on(a,'用招低体改吸取')){const e=a.effects['用招低体改吸取'];if(a.hp<a.stats.maxHp*e.threshold&&t.hp>0)drainPercent(a,t,t.stats.maxHp*e.drainFraction,'低体改吸取');else heal(a,a.stats.maxHp*e.healFraction,'用招回复','skill');}
      if(a.hp>0&&on(a,'用招低体双倍回血粉伤')){const e=a.effects['用招低体双倍回血粉伤'],before=a.hp,n=a.stats.maxHp*e.fraction*(a.hp<a.stats.maxHp*e.threshold?2:1);heal(a,n,'用招低体双倍回血粉伤','skill');if(t.hp>0)inflict(a,t,a.hp-before,'用招低体双倍回血粉伤','percent');}
      if(a.hp>0&&t.hp>0&&on(a,'用招天敌固伤'))inflict(a,t,a.effects['用招天敌固伤'].amount*(E.typeEffectiveness(t.type,a.type,s.typeChart)>1?2:1),'用招天敌固伤','fixed');
      if(a.hp>0&&t.hp>0&&on(a,'用招高体固伤'))inflict(a,t,a.effects['用招高体固伤'].amount*(a.hp>t.hp?2:1),'用招高体固伤','fixed');
      if(a.hp>0&&t.hp>0&&on(a,'用招消强')){const removed=boosted(t),had=removed.length>0;if(had){for(const k of removed)t.stages[k]=0;boostRemoved(t,a,'clear',removed.length);emit(`${name(a)} 持续效果消除${name(t)}的能力提升。`);}}
      if(a.hp>0&&t.hp>0&&on(a,'用招吸强'))steal(a,t,'持续技能');
      if(a.hp>0&&on(a,'用招定额回血'))heal(a,a.effects['用招定额回血'].amount,'用招定额回血','skill');
      if(a.hp>0&&on(a,'用招按能力种类回复'))heal(a,keys.filter(k=>a.stages[k]!==0).length*a.effects['用招按能力种类回复'].amount,'用招按能力种类回复','skill');
      if(a.hp>0&&on(a,'hypnosGrowth'))a.effects.hypnosGrowth.stages.forEach((n,i)=>{if(n)stage(a,n,[keys[i]]);});
      if(a.hp>0&&t.hp>0&&on(a,'hypnosDrain')){const e=a.effects.hypnosDrain,n=drainPercent(a,t,t.stats.maxHp/e.denominator*(boosted(a).length?1:2),'零时诳语持续吸取');}
      if(actionLanded&&a.hp>0&&t.hp>0&&on(a,'用招异常失败攻击减免')){const e=a.effects['用招异常失败攻击减免'];if(!(rng(s)<e.chance/100&&ailment(t,e.ailment,a,false,false,null,{probabilityPercent:e.chance})))a.soulState.nextAttackFlatReduction={count:e.count,amount:e.amount};}
      if(a.hp>0&&t.hp>0&&on(a,'用招附加固定'))inflict(a,t,a.effects['用招附加固定'].amount*(a.hp<t.hp?2:1),'用招附加固定','fixed');
      if(a.hp>0&&t.hp>0&&on(a,'用招附加最大体力粉伤'))inflict(a,t,t.stats.maxHp*a.effects['用招附加最大体力粉伤'].fraction,'用招附加最大体力粉伤','percent');
      if(a.hp>0&&t.hp>0&&on(a,'用招弱化失败封攻')){const e=a.effects['用招弱化失败封攻'];let changed=false;e.stages.forEach((n,i)=>{if(n){const before=t.stages[keys[i]];stage(t,n,[keys[i]]);changed ||=t.stages[keys[i]]!==before;}});if(!changed){const prior=t.effects.attackBlock;timed(t,'attackBlock',e.duration,{},r+1);if(prior?.end>=r)t.effects.attackBlock.start=Math.min(prior.start,r+1);}}
      if(a.hp>0&&t.hp>0&&on(a,'用招弱化失败增伤')){const e=a.effects['用招弱化失败增伤'];let changed=false;e.stages.forEach((n,i)=>{if(n){const before=t.stages[keys[i]];stage(t,n,[keys[i]]);changed ||=t.stages[keys[i]]!==before;}});if(!changed){a.counts.nextAttackBoost=Math.max(a.counts.nextAttackBoost??0,e.count);a.soulState.nextAttackBoostFraction=e.fraction;}}
      if(a.hp>0&&on(a,'fullHeal'))heal(a,a.stats.maxHp,'传承王意','skill');
      if(a.hp>0&&on(a,'用招回复溢出盾')){const before=a.hp,amount=on(a,'技能禁疗')?0:Math.floor(a.stats.maxHp*a.effects['用招回复溢出盾'].fraction*healingMultiplier(a)),overflow=Math.max(0,amount-(a.stats.maxHp-before));heal(a,a.stats.maxHp*a.effects['用招回复溢出盾'].fraction,'用招回复溢出盾','skill');if(overflow>0)shieldRules.add(a,overflow);if(t.hp>0)inflict(a,t,a.hp-before,'用招回复等量追加','percent');}
      if(a.hp>0&&on(a,'id57'))heal(a,a.stats.maxHp*a.effects.id57.fraction,'持续用招回复','skill');
      if(a.hp>0&&on(a,'thirdHeal'))heal(a,a.stats.maxHp/3,'霹雳风暴','skill');
      if(a.hp>0&&on(a,'2230持续')){const e=a.effects['2230持续'],before=a.hp;heal(a,a.stats.maxHp/e.denominator,'2230持续回复','skill');if(a.hp===before&&t.hp>0&&rng(s)<e.chance/100)ailment(t,'疲惫',a);}
      if(t.hp>0&&a.hp>0&&m.kind==='status'&&on(t,'属性招扣血'))inflict(t,a,a.stats.maxHp*t.effects['属性招扣血'].fraction,'属性招扣血','percent');
      if(t.hp>0&&a.hp>0&&m.kind!=='status'&&on(t,'gate'))inflict(t,a,a.stats.maxHp/3,'瀚空之门反制',true);
      E.SOULS.run('afterUse',{...context(a,t,m),first,successful:!invalid&&actionLanded,rage:()=>{
        const probability=Math.min(1,(.5+(on(a,'rageBonus')?.2:0))*(doubled?2:1));
        const triggered=rng(s)<probability;
        emit(`${name(a)} 星皇之怒判定 ${Math.round(probability*100)}%：${triggered?'触发追加行动':'未触发'}。`);
        if(triggered){if(m.kind!=='status')damage(a,t,m,true,full);if(t.hp>0)rageEffect(a,t,m);}
      }});
      if(t.hp>0&&a.hp>0&&m.kind!=='status'&&on(t,'对手攻击后双防追加'))inflict(t,a,(t.stats.def+t.stats.spd)*t.effects['对手攻击后双防追加'].fraction,'攻击后双防追加','percent');
      if(t.hp>0&&a.hp>0&&t.soulState.forest){const field=t.soulState.forest;hurt(t,m.power,'苍茫树海','true',true,false,t);for(let i=0;i<Math.floor(field.life/210)&&t.hp>0&&a.hp>0;i++)triggerEffects(t,a,field.attackEffects);}
      if(t.hp>0&&a.hp>0&&m.kind!=='status'&&on(t,'符文咒印')){delete t.effects['符文咒印'];inflict(t,a,useAttackDamage,'符文咒印反击','true');}
      if(t.hp>0&&a.hp>0)E.SOULS.run('opponentAfterUse',{...context(t,a,m),first,attackDamage:useAttackDamage,successful:!invalid&&actionLanded});
      if(t.hp>0&&a.hp>0&&m.kind!=='status'&&on(t,'减伤高伤随机异常')&&useAttackDamage>t.effects['减伤高伤随机异常'].threshold){const c=context(t,a,m),result=c.randomFromSharedPool(t.effects['减伤高伤随机异常'].count,false,1300);if(result.some(x=>!x.applied))c.clear(a);}
      if(t.hp>0&&a.hp>0&&on(t,'hathawayReaction')){const e=t.effects.hathawayReaction;if(m.kind==='status')stage(a,-e.drop);else if(rng(s)<e.chance/100)ailment(a,e.ailment,t,false,false,null,{probabilityPercent:e.chance??100});}
      if(t.hp>0&&a.hp>0&&m.kind==='status'&&on(t,'chaosStatusDrop'))stage(a,-t.effects.chaosStatusDrop.amount);
      if(t.hp<=0&&t.soulState.reviveAfterEnemyUseRound===r&&t.side===first){t.hp=t.stats.maxHp;delete t.soulState.reviveAfterEnemyUseRound;emit(`${name(t)} 堕世：对手出招后体力回满。`,'heal');}
      if(t.soulState.pendingDamageReturn!==undefined){const n=t.soulState.pendingDamageReturn;delete t.soulState.pendingDamageReturn;if(t.hp>0&&a.hp>0)inflict(t,a,n,'出手结束反馈','percent');}
      if(a.hp>0&&t.hp>0&&a.soulState.typedContracts){for(const entry of a.soulState.typedContracts){if(entry.remaining>0&&t.hp>0){entry.remaining--;context(a,t,m).typedAttack(entry.base+(a.soulState.contractDamageBonus??0),entry.type);}}a.soulState.typedContracts=a.soulState.typedContracts.filter(x=>x.remaining>0);}
      if(a.hp>0&&t.hp>0&&a.soulState.corpseCount>0&&Object.values(t.ailments).filter(end=>end>=r).length>=6){a.soulState.corpseCount--;inflict(a,t,t.hp,'咽咎尸骸六异常秒杀','true',true);}
      if(a.hp>0&&t.hp<=0&&a.counts.defeatFullRestore>0){a.counts.defeatFullRestore--;heal(a,a.stats.maxHp,'击败回满','skill');ppRules.restore(a,battleMoves,999);}
      endAction(a,t,m,!invalid&&actionLanded);a.soulState.nextAttackBoostThis=0;a.soulState.nextAttackFixedThis=0;a.soulState.nextCritThis=false;a.soulState.currentDamageReductionIgnore=0;skillPhase=false;finish();
    }
    for(const f of fs)if(f.hp>0&&fs[1-f.side].hp>0&&f.soulState.titanEndDrainRound===r)drainPercent(f,fs[1-f.side],fs[1-f.side].stats.maxHp/3,'神殇回合末吸取');
    for(const f of fs)if(f.hp>0)E.SOULS.run('combatEnd',{...context(f,fs[1-f.side]),first});
    for(const f of fs)if(f.hp>0&&wears(f,'destiny')&&s.finished&&fs[1-f.side].hp<=0){f.suitState.stacks=Math.min(10,f.suitState.stacks+(used[f.side]?(used[1-f.side]?1:2):0)+1);emit(`${name(f)} 胜天之力：回合结算与击败奖励，现 ${f.suitState.stacks}/10 层。`);}
    if(!s.finished){for(const f of fs){
      if(wears(f,'judgment')&&r===1){const gain=Math.min(300,50*Math.floor((f.stats.maxHp-f.hp)/(f.stats.maxHp*.1)));f.suitState.barrier+=gain;f.suitState.judgmentBonus=Math.min(.4,.1*Math.floor(f.suitState.barrier/50));emit(`${name(f)} 裁决：获得 ${gain} 护罩，在场额外增伤 ${Math.round(f.suitState.judgmentBonus*100)}%。`);}
      if(wears(f,'royal')){if(r===1&&received[f.side])heal(f,f.stats.maxHp/4,'皇御首回合受击');if(!received[f.side]){f.suitState.royalFollowRound=r+1;emit(`${name(f)} 皇御：下回合攻击附加百分比伤害。`);}}
      if(wears(f,'destiny')&&used[f.side]){const n=used[1-f.side]?1:2;f.suitState.stacks=Math.min(10,f.suitState.stacks+n);emit(`${name(f)} 胜天之力 +${n} 层，现 ${f.suitState.stacks}/10 层。`);}
    }}
    if(!s.finished)for(const f of fs)if(on(f,'每回合弱化对手'))f.effects['每回合弱化对手'].stages.forEach((n,i)=>{if(n)stage(fs[1-f.side],n,[keys[i]]);});
    if(!s.finished)for(const f of fs)if(f.hp>0&&fs[1-f.side].hp>0&&on(f,'回合末最大体力吸取')){const target=fs[1-f.side],n=drainPercent(f,target,target.stats.maxHp*f.effects['回合末最大体力吸取'].fraction,'回合末最大体力吸取');}
    if(!s.finished)for(const f of fs)if(f.hp>0&&fs[1-f.side].hp>0&&on(f,'回合末当前体力吸取')){const n=inflict(f,fs[1-f.side],fs[1-f.side].hp*f.effects['回合末当前体力吸取'].fraction,'当前体力吸取','percent');heal(f,n,'当前体力吸取','skill');}
    if(!s.finished)for(const f of fs)if(f.hp>0&&fs[1-f.side].hp>0&&on(f,'未受攻定额吸取')&&f.roundAttackDamage===0){const n=inflict(f,fs[1-f.side],f.effects['未受攻定额吸取'].drain,'未受攻定额吸取','fixed');heal(f,n,'未受攻定额吸取');}
    if(!s.finished)for(const f of fs)if(f.hp>0&&fs[1-f.side].hp>0&&on(f,'先手固定吸取')&&f.side===first){const n=inflict(f,fs[1-f.side],f.effects['先手固定吸取'].amount,'先手固定吸取','fixed');heal(f,n,'先手固定吸取');}
    if(!s.finished)for(const f of fs)if(f.hp>0&&fs[1-f.side].hp>0&&on(f,'每回合附加固伤'))inflict(f,fs[1-f.side],f.effects['每回合附加固伤'].amount,'每回合附加固伤','fixed');
    if(!s.finished)for(const f of fs)for(const [k,e]of Object.entries(f.effects))if(e.stackedPercent&&on(f,k)&&f.hp>0)inflict(fs[e.sourceSide],f,e.amount,'叠加延迟粉伤','percent');
    if(!s.finished)for(const f of fs)if(f.hp>0&&on(f,'延迟单次固伤')){const e=f.effects['延迟单次固伤'];delete f.effects['延迟单次固伤'];inflict(fs[e.sourceSide],f,e.amount,'延迟单次固伤','fixed');}
    if(!s.finished)for(const f of fs)if(on(f,'持续固定伤害'))inflict(fs[1-f.side],f,f.effects['持续固定伤害'].amount,'持续固定伤害','fixed');
    if(!s.finished)for(const f of fs)if(f.hp>0&&fs[1-f.side].hp>0&&f.soulState.orderReflect>0){inflict(f,fs[1-f.side],f.soulState.orderReflect,'秩序守恒反击','percent');f.soulState.orderReflect=0;}
    if(!s.finished)for(const f of fs)if(f.hp>0&&fs[1-f.side].hp>0&&on(f,'花开茶靡延迟')){const e=f.effects['花开茶靡延迟'],lost=Math.max(0,f.hp-e.remainingHp);f.hp-=lost;if(lost>0)inflict(f,fs[1-f.side],lost*e.fraction,'花开茶靡','percent');}
    if(!s.finished)for(const f of fs)if(f.hp>0&&fs[1-f.side].hp>0&&on(f,'异常弱化回合固伤')&&(Object.values(f.stages).some(n=>n<0)||Object.values(f.ailments).some(end=>end>=r)))inflict(f,fs[1-f.side],f.effects['异常弱化回合固伤'].amount,'异常弱化回合固伤','fixed');
    if(!s.finished)for(const f of fs)if(on(f,'持续攻击值粉伤')&&fs[1-f.side].hp>0)inflict(f,fs[1-f.side],E.effective(f,'atk')*f.effects['持续攻击值粉伤'].fraction,'持续攻击值粉伤','percent');
    if(!s.finished)for(const f of fs)if(on(f,'用招追加异常')&&fs[1-f.side].hp>0&&rng(s)<f.effects['用招追加异常'].chance/100)ailment(fs[1-f.side],f.effects['用招追加异常'].ailment,f);
    if(!s.finished)for(const f of fs)if(f.hp>0&&f.ailments['寄生']>=r){const other=fs[1-f.side],n=inflict(other,f,f.stats.maxHp/8,'寄生','percent');heal(other,n,'寄生','skill');}
    if(!s.finished)for(const f of fs)if(on(f,'寄生种子')&&f.hp>0){drainPercent(fs[f.effects['寄生种子'].source],f,f.stats.maxHp/8,'寄生种子');}
    if(!s.finished)for(const f of fs)statusRules.damageOverTime(f,r,(target,n,k,type)=>inflict(fs[f.statusState?.sources?.[k]??f.side],target,n,k,type));
    if(!s.finished)for(const f of fs)if(f.hp>0&&on(f,'回合末反馈弱化')){const t=fs[1-f.side];for(const k of keys)if(f.stages[k]<0){stage(t,f.stages[k],[k]);if(!on(f,'弱化不可解除反转'))f.stages[k]=0;}}
    if(!s.finished)for(const f of fs)if(on(f,'每回合强化'))f.effects['每回合强化'].stages.forEach((n,i)=>{if(n)stage(f,n,[keys[i]]);});
    if(!s.finished)for(const f of fs)if(on(f,'逐回合能力变化'))f.effects['逐回合能力变化'].stages.forEach((n,i)=>{if(n)stage(f,n,[keys[i]]);});
    if(!s.finished)for(const f of fs)if(f.hp>0&&on(f,'回合末已损回复'))heal(f,(f.stats.maxHp-f.hp)*f.effects['回合末已损回复'].fraction,'回合末已损回复','skill');
    if(!s.finished)for(const f of fs)if(f.hp>0&&fs[1-f.side].hp>0&&on(f,'无强化回合固伤')&&!Object.values(f.stages).some(n=>n>0))inflict(f,fs[1-f.side],f.effects['无强化回合固伤'].amount,'无强化回合固伤','fixed');
    if(!s.finished)for(const f of fs)if(f.hp>0&&on(f,'回合末削血'))inflict(f,fs[1-f.side],fs[1-f.side].stats.maxHp*f.effects['回合末削血'].fraction,'回合末削血','percent');
    if(!s.finished)for(const f of fs)if(f.hp>0&&on(f,'延迟决胜')){hurt(fs[1-f.side],fs[1-f.side].hp,'延迟决胜','true',true,false,f);finish();if(s.finished)break;}
    if(!s.finished)for(const f of fs){
      const c={...context(f,fs[1-f.side]),first};
      const reflect=f.effects['能力下降反馈'];
      if(reflect&&reflect.start<=r&&reflect.end>=r){const before={...f.stages};for(const k of Object.keys(f.stages))if(f.stages[k]<0){if(!on(f,'弱化不可解除反转'))f.stages[k]=0;if(fs[1-f.side].hp>0)stage(fs[1-f.side],before[k],[k]);}}
      const drain=f.effects['能力下降持续'];
      if(drain&&drain.start<=r&&drain.end>=r){const target=fs[1-f.side],values=drain.stages??[0,-1,0,0,-1,0],failed=[];values.forEach((n,i)=>{if(!n)return;const k=keys[i],before=target.stages[k];stage(target,n,[k]);failed.push(n<0?target.stages[k]>=before:target.stages[k]<=before);});if(target.hp>0&&(drain.anyFailure?failed.some(Boolean):failed.length&&failed.every(Boolean)))inflict(f,target,target.stats.maxHp*drain.fraction,'持续效果未触发','percent');}
      if(on(f,'茉蕊回合末PP'))c.restorePP(f,f.effects['茉蕊回合末PP'].amount);
      if(f.hp>0&&on(f,'回合末设定体力'))f.hp=Math.min(f.stats.maxHp,Math.floor(f.stats.maxHp*f.effects['回合末设定体力'].fraction));
      E.SOULS.run('roundEnd',c);if(f.hp>0&&f.soulState.forest){const field=f.soulState.forest;c.restorePP(f,2);for(let i=0;i<Math.floor(field.life/210)&&f.hp>0&&fs[1-f.side].hp>0;i++)triggerEffects(f,fs[1-f.side],field.endEffects);}
    }
    if(!s.finished)for(const f of fs)if(f.hp>0&&f.ailments['星哲']>=r)heal(f,f.stats.maxHp/4,'星哲回合回复');
    if(!s.finished)for(const f of fs)statusRules.confusionDamage(f,r,()=>rng(s),(target,n,k,type)=>inflict(fs[1-f.side],target,n,k,type));
    if(!s.finished)for(const f of fs)if(f.hp>0&&f.soulState.oscarBlessings){let removed=0;for(const group of [['烧伤','焚烬'],['冻伤','冰封'],['混乱','麻痹']]){let hit=false;for(const k of group)if(f.ailments[k]>=r){delete f.ailments[k];hit=true;emit(`${name(f)} ${k}受到奥斯卡加护解除。`);}if(hit)removed++;}if(removed){f.soulState.oscarPriority={round:r+1,amount:removed};emit(`${name(f)} 奥斯卡加护：下回合先制 +${removed}。`);}}
    if(s.finished)for(const f of fs)if([672,877].includes(f.soulId))E.SOULS.run('roundEnd',{...context(f,fs[1-f.side]),first});
    for(const f of fs)if(f.soulState.natureBlessingEndLoss){f.soulState.natureBlessings=Math.max(0,(f.soulState.natureBlessings??0)-f.soulState.natureBlessingEndLoss);delete f.soulState.natureBlessingEndLoss;}
    for(const f of fs){const e=f.soulState.hunterDelayed;if(e?.round===r){delete f.soulState.hunterDelayed;const t=fs[1-f.side];if(t.hp>0){inflict(f,t,t.stats.maxHp/e.denominator,'未击败战后追加','percent');finish();}}}
    celestialRules.phase(s,fs,r,'end',()=>{});
    for(const f of fs)E.SOULS.run('battlePhaseEnd',{...context(f,fs[1-f.side]),first});
    if(!s.finished)finish();
    for(const f of fs){if(f.hp>0&&statusRules.active(f,'星赐',r))ppRules.restore(f,battleMoves,2);statusRules.roundEnd(f,r);}
    for(const f of fs){const reward=f.soulState.roundAttackPriorityReward;if(reward?.round===r){delete f.soulState.roundAttackPriorityReward;if(f.hp>0&&fs[1-f.side].hp<=0)timed(f,'攻击先制',1,{amount:reward.amount},r+1);}}
    for(const f of fs){const reward=f.soulState.roundDefeatReward;if(reward?.round===r){delete f.soulState.roundDefeatReward;if(f.hp>0&&fs[1-f.side].hp<=0){if(rng(s)<reward.chance/100)heal(f,f.stats.maxHp,'当回合击败回复','skill');else stage(f,reward.amount);}}}
    if(!s.finished)for(const f of fs)if(f.hp>0&&on(f,'回合结束后消回合'))clear(f);
    for(const f of fs){if(f.hp>0&&f.soulState.dragonScaleTriggered&&f.soulState.dragonScales){const k=f.soulState.dragonScaleTriggered;delete f.soulState.dragonScaleTriggered;if(f.soulState.dragonScales[k]){delete f.soulState.dragonScales[k];if(k==='blue'){clear(fs[1-f.side]);shieldRules.consume(fs[1-f.side]);fs[1-f.side].suitState.barrier=0;jasmineBarrierGone(fs[1-f.side]);emit(`${name(f)} 蓝色龙鳞消失，清除对手护盾与护罩。`);}else if(k==='gold')heal(f,f.stats.maxHp*.2,'金色龙鳞回复');else if(k==='black'){const gain=Math.floor(f.stats.maxHp*.2);f.stats.maxHp+=gain;emit(`${name(f)} 玄色龙鳞消失，获得 ${gain} 点临时体力上限。`);}}}for(const [k,e]of Object.entries(f.effects))if(e.end<=r){if(f.hp>0&&e.expireFullHeal){ppRules.restore(f,battleMoves,e.expireRestorePP);heal(f,f.stats.maxHp,'闪避到期回复','skill');}delete f.effects[k];emit(`${name(f)} ${effectNames[k]??k}到期。`);}statusRules.expire(f,r,(k,sourceSide)=>{statusRemoved(f,k);emit(`${name(f)} ${k}解除。`);if(k==='冰封'&&s.iceExpiryUntil>=r){f.hp=0;resolveDeath(f);}statusRules.convert(f,k,r,{random:()=>rng(s),stage,source:fs[sourceSide??f.side]});if(k==='烧伤'&&f.soulState.phoenixBurnHeal){delete f.soulState.phoenixBurnHeal;heal(f,f.stats.maxHp,'永生之池烧伤解除');}});E.SOULS.run('roundCompleted',context(f,fs[1-f.side]));f.soulState.noAilmentLastEnd=!Object.values(f.ailments).some(end=>end>r);delete f.soulProtect;delete f.soulHigh;}
    for(const f of fs)if(f.soulState.forest&&temporaryHpRemaining(f,'forest')===0){delete f.soulState.forest;removeTemporaryHp(f,'forest');}
    for(const moon of [...celestialRules.list(s)])if(moon.end<=r)celestialRules.remove(s,moon,(side,k)=>statusRules.clear(fs[side],k,n=>statusRemoved(fs[side],n)));
    for(const f of fs){expireOtherCrit(f);restoreCopiedType(f);restoreSwappedTypes();}
    for(const f of fs)f.soulState.previousRoundStages={...f.stages};
    s.turns.push({round:r,choices:[...choices],first,events,remainingHp:fs.map(f=>f.hp)});s.round++;return s;
  };
  return E;
});




