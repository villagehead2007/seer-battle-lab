(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./engine.js'),require('./battle-glossary.js'));
  else root.BattlePresentation=factory(root.BattleEngine,root.BattleGlossary);
})(globalThis,function(E,glossary){
  'use strict';
  const clean=text=>String(text??'').replace(/<[^>]*>/g,' ').replace(/\{([^}]+)\}/g,'$1');
  function soul(f,snapshot){
    const sourceHash=f.soulHash??E.SOULS.registry[f.soulId]?.sourceHash;
    const exact=snapshot?.souls?.find(s=>s.id===f.soulId&&s.hash===sourceHash)??glossary.nativeSouls?.find(s=>s.id===f.soulId&&s.hash===sourceHash);
    if(exact)return{id:exact.id,hash:exact.hash,name:E.SOULS.registry[exact.id]?.name??'魂印',text:clean(exact.description)};
    const native=E.SPECIES[f.species];
    return{id:f.soulId,hash:f.soulHash??'',name:E.SOULS.registry[f.soulId]?.name??native?.soul??'无',text:clean(native?.soulText??'无魂印效果')};
  }
  function equipment(f){
    const b=f.build,suit=E.GEAR.SUITS[b.suit]??E.GEAR.SUITS.none,r=b.resistance;
    const slots=r.slots?.length?r.slots.filter(s=>s.name).map(s=>s.name+' '+s.chance+'%'):[r.major&&r.major+' 55%',r.minor&&r.minor+' 18%'].filter(Boolean);
    return{characteristic:E.CHARACTERISTICS.label(b.characteristic),characteristicEffect:E.CHARACTERISTICS.describe(b.characteristic?.groupId??0,b.characteristic?.star??5),suit:suit.name,suitEffect:suit.statsText+'；'+suit.passive,resistance:'暴击伤害 '+r.critical+'% / 固定伤害 '+r.fixed+'% / 百分比伤害 '+r.percent+'%',ailments:slots.join(' / ')||'无异常抗性'};
  }
  function explain(item,f,battle,snapshots=[]){
    const label=typeof item==='string'?item:item.name,current=typeof item==='string'?item:item.name+' · '+item.value;
    const termName=label.split(' · ')[0];
    const terms=glossary.filter(t=>t.name===termName),owned=terms.filter(t=>t.petIds?.includes(Number(f?.number)));
    const chosen=owned.length?owned:terms.length===1?terms:[];
    const lines=chosen.map(t=>t.name+'：'+clean(t.description));
    if(!lines.length){
      const aliases={'极渊实际用招低体双吸':971,'湮灭实际用招低体吸取':1647,'极渊实际用招臣服吸取':1814,'极渊实际用招弱化封攻':2320};
      const own=snapshots.find(s=>Number(s.id)===Number(f?.number));
      if(own){const ids=Object.entries(aliases).filter(([key])=>f.effects?.[key]&&(termName===key||termName==={'极渊实际用招低体双吸':'用招时低体吸取','湮灭实际用招低体吸取':'用招时低体吸取','极渊实际用招臣服吸取':'用招时臣服吸取','极渊实际用招弱化封攻':'用招时弱化封攻'}[key])).map(([,id])=>id);
        for(const move of E.WIKI.selectableMoves(own))if(move.effectIds?.some(id=>ids.includes(id)))lines.push(move.name+'：'+clean(move.description));}

      const matches=snapshots.flatMap(s=>(s.moves??[]).filter(m=>(m.description??'').includes(label)).map(m=>m.name+'：'+clean(m.description)));
      lines.push(...[...new Set(matches)]);
    }
    return[current,...lines].join('\n\n');
  }
  function affinity(f,opponent,battle){return{from:f.type,to:opponent.type,multiplier:E.typeEffectiveness(f.type,opponent.type,battle.typeChart),note:'本系攻击的属性克制倍率；技能系别或专属效果可能另行修正，不含增伤、减伤。'};}
  function spMarsMove(snapshot,id,form){
    const spec=snapshot?.originalSpec;
    const key=Object.keys(E.SpMars.MOVES).find(key=>'wiki:'+E.SpMars.MOVES[key]===id);
    if(!key||!spec)return null;
    const m=spec.moves[key],p=spec.parameters,percent=n=>Number((n*100).toFixed(2))+'%',fraction=n=>n.join('/');
    const type=m.category==='status'?'属性技能':m.element+'特攻';
    const meta=`${type} · 威力 ${m.power} · PP ${m.pp} · ${m.alwaysHit?'必中':'按命中率判定'} · 基础先制 +${m.priority??0}`;
    const group=(label,lines)=>({label,lines});
    const {fifth:f,verdict:v,intercept:i,overdrive:o,rampart:r}=p;
    const skills={
      verdict:[
        '攻击相性为微弱时按普通相性结算。',
        '先出手时，本回合对手的属性技能无效。',
        `后出手时，下回合先制 +${v.latePriority}。`,
        `初始威力提升 ${percent(v.powerInitialBoost)}。每次使用且命中后，后续威力再提升 ${percent(v.powerBoostStep)}，累计最多 ${percent(v.powerBoostMax)}。达到上限后无视对手能力提升。`,
        '坚壁担任主位时，本招伤害不低于自身护盾值。',
        `极速担任主位时，先手封属额外延长 ${v.swiftBlockExtraRounds} 回合。`,
        '毁灭担任主位时，无视对手的伤害免疫和伤害限制。',
      ],
      intercept:[
        `自身处于能力下降状态时，额外先制 +${i.weakenedExtraPriority}。`,
        '反转自身能力下降。反转成功使对手下一次技能无效，反转失败则尝试解除自身能力下降。',
        `消除对手能力提升。消除成功时，自己下次切换主位后，原主位效果额外保留 ${i.oldLeadExtraRounds} 回合，此收益不可叠加。`,
        `对手处于能力下降状态或带有印记二时，使其疲惫 ${i.fatigueBaseRounds} 回合。疲惫生效后清除对手的印记二，${i.mark2BlockRounds} 回合内无法再附加。每清除一层，疲惫延长 ${i.fatigueExtraRoundsPerLayer} 回合。`,
        `吸取对手最大体力的 ${fraction(i.absorb)}。自身低于最大体力的 ${fraction(i.lowHpBelow)} 时效果变为 ${i.lowHpMultiplier} 倍。每次极速接任主位后首次使用本招改为汲取，以真实伤害结算。`,
        '技能无效时，仍消除对手能力提升和回合类效果。',
      ],
      overdrive:[
        `${o.pulseRounds} 回合内，每回合吸取对手最大体力的 ${fraction(o.pulseAbsorb)}。自身低于最大体力的 ${fraction(o.lowHpBelow)} 时，回复量变为 ${o.lowHpHealMultiplier} 倍。`,
        `${o.reductionRounds} 回合内，受到的固定伤害和百分比伤害减少 ${percent(o.reduction)}。`,
        `下 ${o.priorityRounds} 回合先制 +${o.priority}。`,
        `下一次攻击技能伤害提升 ${percent(o.nextAttackBoost)}，由毁灭担任主位时再提升 ${percent(o.ruinExtraAttackBoost)}。命中后消耗。`,
        `${o.koWindowRounds} 回合内下一次击败对手后，下回合同时激活三个形态的主位效果，持续 ${o.allLeadRounds} 回合，已阵亡的形态也会激活。数值加成按激活回合开始时的护盾计算。`,
      ],
      rampart:[
        `${r.protectRounds} 回合内，自身回合类效果无法被消除。`,
        `${r.reductionRounds} 回合内，受到的伤害减少 ${percent(r.reduction)}。`,
        `吸取对手 ${r.absorbHp} 点体力。`,
        `为自身附加 ${r.shield} 点护盾。坚壁担任主位时，${r.wallUnchangedRounds} 回合内护盾数值不改变。`,
        `${r.koWindowRounds} 回合内下一次击败对手后，恢复当前主位全部体力与 PP。`,
        `技能无效时，恢复自身最大体力的 ${fraction(r.invalidHeal)}，并使下次受到的伤害减少 ${percent(r.invalidNextReduction)}。`,
      ],
    };
    if(key!=='fifth')return{name:m.name,meta,groups:[group('技能效果',skills[key])]};
    const base=[
      `消除对手回合类效果，消除成功使对手疲惫 ${f.clearFatigueRounds??'2 或 3'} 回合。`,
      `自身全属性 +${f.allStages}。`,
      `${f.reflectRounds} 回合内免疫并反弹异常状态。选择坚壁时，本条不触发。`,
      `从下回合起，${f.skillHealBlockRounds} 回合内对手无法通过自身技能恢复体力。`,
    ];
    const switchRules=[
      '在坚壁、极速、毁灭中选择一个存活形态。选择当前主位时仍使用第五，并获得同主位收益。',
      `选择不同主位时，实际用招即承受当前主位最大体力的 ${fraction(f.switchTrueCost)} 的真实伤害，预约在下回合开始时换位。`,
      '自损造成当前主位阵亡时保留预约。预约执行时若所选形态已阵亡，取消预约。',
      `预约成功兑现时，吸取对手最大体力的 ${fraction(f.onSwitchAbsorb)}，下次技能必定命中并强制执行命中效果。所选形态若已提前自动接任，到预约回合仍发放奖励。`,
      '整招无效时仍执行上述魂印换位流程与所选分支的魂印词条。原第五的技能效果须正常生效才执行。',
    ];
    const branch={
      wall:[
        '选择坚壁时，原第五的免疫并反弹异常状态效果不触发。',
        `当前护盾不高于 ${f.wallShieldThreshold} 点时，附加 ${f.wallShieldGrant} 点护盾。`,
        `当前护盾高于 ${f.wallShieldThreshold} 点时，${f.wallNoLossRounds} 回合内护盾数值不减少。`,
        '用招时已由坚壁担任主位，则免疫下一次受到的攻击。',
      ],
      swift:[
        '下次使用技能时消除对手能力提升和回合类效果，任一项消除成功就使对手下次技能无效。',
        `将对手已有的技能禁疗延长 ${f.swiftHealBlockExtraRounds} 回合。场上没有技能禁疗时不新建。`,
        `用招时已由极速担任主位，则给对手附加 ${p.mark2.gain} 层印记二。`,
      ],
      ruin:[
        `附加自身特攻面板 ${percent(f.ruinFixedSpaRatio)} 的固定伤害。`,
        `从下回合起，${f.ruinSwitchLockRounds} 回合内对手无法主动切换精灵。`,
        '下一次使用技能时无视对手的伤害减少类效果。',
        `用招时已由毁灭担任主位，则下一次使用技能时伤害提高 ${percent(f.ruinSameDamageBoost)}。`,
      ],
    };
    const label=E.SpMars.LABELS[form];
    return {name:label?`${m.name} · ${label}`:m.name,meta,groups:label?
      [group('魂印 · '+label+'分支（整招无效时仍执行）',branch[form]),group('原第五 · 技能效果',base),group('魂印 · 换位规则',switchRules)]:
      [group('原第五 · 技能效果',base),group('魂印 · 选择形态与换位',switchRules)]};
  }

  let tip,anchor,closeTimer;
  function closeMoveDetails(){
    clearTimeout(closeTimer);
    anchor?.removeAttribute('aria-describedby');
    anchor=null;
    if(tip)tip.hidden=true;
  }

  function positionMoveDetails(){
    if(!anchor?.isConnected){closeMoveDetails();return;}
    const bounds=anchor.getBoundingClientRect(),margin=12,gap=5;
    tip.style.left=Math.max(margin,Math.min(bounds.left,window.innerWidth-tip.offsetWidth-margin))+'px';
    const above=bounds.top-margin-gap,below=window.innerHeight-bounds.bottom-margin-gap;
    const placeAbove=above>below;
    tip.style.maxHeight=Math.min(window.innerHeight-2*margin,Math.max(140,above,below))+'px';
    tip.style.top=Math.max(margin,Math.min(placeAbove?bounds.top-gap-tip.offsetHeight:bounds.bottom+gap,
      window.innerHeight-margin-tip.offsetHeight))+'px';
  }

  function openMoveDetails(target,details){
    clearTimeout(closeTimer);
    if(anchor===target)return;
    if(!tip){
      tip=document.createElement('div');
      tip.id='sp-mars-move-tooltip';
      tip.className='move-tooltip';
      tip.setAttribute('role','tooltip');
      tip.onpointerenter=()=>clearTimeout(closeTimer);
      tip.onpointerleave=event=>{if(!anchor?.contains(event.relatedTarget))closeMoveDetails();};
      document.body.append(tip);
      window.addEventListener('resize',()=>{if(anchor)positionMoveDetails();});
      window.addEventListener('scroll',event=>{if(anchor&&event.target!==tip)positionMoveDetails();},true);
      document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMoveDetails();});
    }
    anchor?.removeAttribute('aria-describedby');
    anchor=target;
    anchor.setAttribute('aria-describedby',tip.id);
    const append=(parent,tag,text)=>{const el=document.createElement(tag);el.textContent=text;parent.append(el);return el;};
    tip.replaceChildren();
    append(tip,'strong',details.name);
    append(tip,'p',details.meta).className='move-tooltip-meta';
    for(const group of details.groups){
      append(tip,'h4',group.label);
      const list=append(tip,'ul','');
      for(const line of group.lines)append(list,'li',line);
    }
    tip.hidden=false;
    tip.scrollTop=0;
    positionMoveDetails();
  }

  function bindSpMarsMoveDetails(container,snapshot){
    if(anchor&&!anchor.isConnected)closeMoveDetails();
    for(const target of container.querySelectorAll('[data-sp-mars-detail]')){
      const details=spMarsMove(snapshot,target.dataset.spMarsDetail,target.dataset.spMarsForm);
      if(!details)continue;
      const show=()=>openMoveDetails(target,details);
      const hide=event=>{
        if(anchor===target&&!tip?.contains(event.relatedTarget))closeTimer=setTimeout(closeMoveDetails,150);
      };
      target.addEventListener('pointerenter',show);
      target.addEventListener('pointerleave',hide);
      target.addEventListener('focus',show);
      target.addEventListener('blur',hide);
    }
  }

  return Object.freeze({soul,equipment,explain,affinity,spMarsMove,bindSpMarsMoveDetails});
});
