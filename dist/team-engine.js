(function(root, factory){
  if(typeof module==='object' && module.exports) module.exports=factory(require('./engine.js'));
  else root.TeamBattle=factory(root.BattleEngine);
})(globalThis,function(E){
  'use strict';
  const copy=structuredClone;
  const sides=[0,1];
  function prepare(pair,options){
    return E.createBattle({
      seed:options.seed, criticals:options.criticals, challengedSide:options.challengedSide, prepareTeamMembers:true,
      wikiSnapshots:pair.map(m=>m.snapshot), wikiLoadouts:pair.map(m=>m.moves),
      builds:pair.map(m=>m.build)
    });
  }
  function create(teams,leads=[0,0],options={}){
    if(!Array.isArray(teams)||teams.length!==2)throw Error('请配置双方队伍');
    teams=copy(teams);
    for(const side of sides){
      const members=teams[side];
      if(!Array.isArray(members)||members.length<1||members.length>6)throw Error('每方需要 1～6 只精灵');
      for(const member of members){
        if(!Array.isArray(member.moves))throw Error('队员缺少配招，请选择当前版本的技能');
        if(member.build)member.build=E.GEAR.restoreBuild(member.build);
        member.moves=E.WIKI.restoreLoadout(member.snapshot,member.moves);
      }
      if(new Set(members.map(m=>Number(m.snapshot.id))).size!==members.length)throw Error('同一方不能重复精灵编号');
      if(!Number.isInteger(leads[side])||!members[leads[side]])throw Error('请选择有效首发');
    }
    const pair=sides.map(i=>teams[i][leads[i]]);
    const battle=prepare(pair,options);
    battle.teamMode=true;
    battle.teamBuwu2147=[{points:0},{points:0}];
    const slots=teams.map((members,side)=>members.map((member,index)=>{
      const testPair=pair.slice();testPair[side]=member;
      const base=index===leads[side]?battle.fighters[side]:prepare(testPair,options).fighters[side];
      if(member.build){
        member.build.eyeId=base.build.eyeId;
        member.build.inscriptionPresetIds=base.build.inscriptionPresetIds.slice();
      }
      base.teamPosition=index;
      base.teamInstantSoulIds=member.snapshot.souls.filter(soul=>soul.description?.includes('秒杀')).map(soul=>soul.id);
      if(member.moves.includes(38455)&&member.snapshot.moves.some(m=>m.id===38455&&m.effectIds.includes(2526)))base.soulState.corpseCount=1;
      base.teamPPDefinitions=Object.fromEntries(base.moves.map(key=>{
        const selection=member.moves.find(id=>'wiki:'+id===key);const move=E.WIKI.selectedMove(member.snapshot,selection);
        if(!move)throw Error('队员配招缺少来源 PP 上限');
        return [key,{pp:move.pp,name:move.selectionName??move.name}];
      }));
      return {config:member,wasLead:index===leads[side],base:copy(base),fighter:copy(base)};
    }));
    const game={slots,active:leads.slice(),battle,phase:'action',pending:[],history:[]};
    const dragons=slots.map(roster=>roster.some(slot=>slot.fighter.soulId===2028)?{gold:true,dark:true}:null);
    if(dragons.some(Boolean))battle.teamDragons2028=dragons;
    const plot=slots.map(roster=>{const owner=roster.find(slot=>slot.fighter.soulId===2153);return owner?E.SOULS.registry[2153].abilities.state(owner.fighter):null;});
    if(plot.some(Boolean))battle.teamPlot2153=plot;
    E.initializeTeamResources(slots,battle);
    const blessings=slots.map(roster=>roster.some(slot=>slot.config.snapshot.id===3425 &&
      slot.config.moves.includes(38525) && slot.config.snapshot.moves.some(m=>m.id===38525&&m.hash==='a14337fd'&&m.effectIds.includes(2556)))
      ? {spent:[false,false,false]} : null);
    if(blessings.some(Boolean))battle.teamOscarBlessings=blessings;
    connect(game);
    enter(game,sides);
    adjudicate(game);
    return game;
  }
  function connect(game){
    const pair=sides.map(i=>game.slots[i][game.active[i]]);
    const s=game.battle;
    E.WIKI.prepare(pair.map(m=>m.config.snapshot),pair.map(m=>m.config.moves));
    s.teamBench=game.slots.map((slots,side)=>slots.filter((_,index)=>index!==game.active[side]).map(slot=>slot.fighter));
    s.fighters=pair.map(m=>m.fighter);
    if(!s.narakuRosterInitialized){
      for(const row of game.slots)for(const slot of row)E.grantNaraku(s,slot.fighter);
      s.narakuRosterInitialized=true;
    }
    E.refreshKnightStates4911(s);E.bindVesselTeam2162(s);E.bindMirageTeam2119(s);
    for(const side of sides)if(s.teamLaw2146?.[side])E.SOULS.registry[2146].abilities.bindTeamLaw(s.fighters[side],s.teamLaw2146[side]);
    for(const side of sides)if(s.teamBuwu2147?.[side])s.fighters[side].soulState.buwu2147=s.teamBuwu2147[side].points;
    for(const side of sides)if(s.teamDream1972?.[side])for(const f of [s.fighters[side],...s.teamBench[side]])f.soulState.dream1972=s.teamDream1972[side];
    for(const side of sides)if(s.teamPlot2153?.[side])s.fighters[side].soulState.plot2153=s.teamPlot2153[side];
    for(const side of sides)if(s.teamStar1844?.[side])for(const f of [s.fighters[side],...s.teamBench[side]])f.soulState.teamStar1844=s.teamStar1844[side];
    for(const side of sides)if(s.teamGates2075?.[side])for(const f of [s.fighters[side],...s.teamBench[side]])E.SOULS.registry[2075].abilities.bind(f,s.teamGates2075[side]);
    for(const side of sides)if(s.teamMoth2099?.[side])for(const f of [s.fighters[side],...s.teamBench[side]])if(f.soulId===2099&&f.teamPosition===s.teamMoth2099[side].sourcePosition)f.soulState.moth2099=s.teamMoth2099[side].state;
    s.wikiSnapshots=pair.map(m=>m.config.snapshot);
    s.typeChart=game.teamTypeChart??=E.WIKI.mergeCharts(game.slots.flat().map(slot=>slot.config.snapshot));
    const charms={};
    for(const f of s.fighters)for(const slot of f.soulState.charm1999?.slots??[])if(s.moveDefinitions[slot.alias])charms[slot.alias]=s.moveDefinitions[slot.alias];
    s.moveDefinitions={...E.MOVES,...charms,'team:switch':{id:'team:switch',name:'中切',kind:'item',priority:0,power:0,operations:[]}};
  }
  function appendHistory(game,round,events,isTurn=false){
    const details=game.historyDetails??={};
    for(const [index,event] of events.entries()){
      details[game.history.length]={...event,turnEventIndex:isTurn?index:null};
      game.history.push('第 '+round+' 回合 · '+event.text);
    }
  }
  function enter(game,changed){
    const s=game.battle;
    s.entryEvents=[];
    for(const side of changed){
      const slot=game.slots[side][game.active[side]];
      slot.entries=(slot.entries??0)+1;
      if(slot.entries===1){
        const owner=game.slots[side].find(ally=>ally!==slot&&ally.fighter.hp>0&&[1588,2080].includes(ally.fighter.soulId));
        if(owner){const st=owner.fighter.soulState;st.yuliFangLayers=(st.yuliFangLayers??0)+1;}
      }
      if(slot.config.snapshot.id===3425&&s.teamOscarBlessings?.[side])s.teamOscarBlessings[side].spent.fill(false);
      if(slot.fighter.soulId===1258){
        slot.fighter.soulState.elephantEntered=true;
        if(slot.fighter.soulState.elephantCharge>=6)slot.fighter.effects['免异常']={start:s.round,end:s.round,sourceSoulId:1258};
      }
      if(slot.fighter.soulId===821){slot.firstEntryRound??=s.round;slot.fighter.soulState.firstEntryRound821=slot.firstEntryRound;}
      slot.fighter.soulState.teamEntry={number:slot.entries,round:s.round,wasLead:slot.wasLead};
    }

    for(const side of sides){
      const f=s.fighters[side];
      if(!s.extraStar2584?.[side]&&!game.slots[side].some(m=>m.fighter.soulId===622&&m.fighter.soulHash==='2f1e3f2'))continue;
      f.soulState.teamStar622={lead:game.slots[side][game.active[side]].wasLead};
    }
    E.enterTeamMembers(s,changed);
    for(const side of changed){
      const slot=game.slots[side][game.active[side]],f=slot.fighter;
      if(f.soulId!==2149||!f.soulState.group2149)continue;
      const emperor=game.slots[side].find(m=>m.fighter.soulId===622&&m.fighter.soulHash==='2f1e3f2');
      if(!emperor&&!s.extraStar2584?.[side])continue;
      const source={id:622,hash:'2f1e3f2'};
      const ability=E.SOULS.registry[2149].abilities;
      ability.grantStar({a:f},f,'gift',source);
      if(slot.wasLead&&slot.entries===1)ability.grantStar({a:f},f,'blessing',source);
    }
    appendHistory(game,s.round,s.entryEvents);
  }
  function switchMode(game,side){return E.teamSwitchReplacement(game.battle)?'expelled':'voluntary';}
  function candidates(game,side,forced=false){
    if(!forced&&E.teamVoluntarySwitchBlocked(game.battle,side))return [];
    return game.slots[side].flatMap((slot,i)=>i!==game.active[side]&&slot.fighter.hp>0&&!slot.fighter.soulState.vanished&&(forced||!game.battle.teamExile1246?.[side]?.positions.includes(i))?[i]:[]);
  }
  function swap(game,targets,forced,kinds=null,selections=null){
    const departures=kinds??sides.map(()=>forced?'knockout':'voluntary'),targetSelection=selections??sides.map(()=>'chosen');
    const changed=sides.filter(i=>targets[i]!=null);
    for(const side of changed)if(!candidates(game,side,departures[side]==='knockout'||targetSelection[side]==='random').includes(targets[side]))throw Error('不可换入该成员');
    // Release marks before either side copies its outgoing fighter.
    for(const side of changed){
      const member=game.battle.fighters[side];
      const forced=departures[side]==='knockout',voluntary=departures[side]==='voluntary';
      if(member.soulState.heroOathOnExit)E.resolveHeroExit(game.battle,member,game.slots[side]);
      if(member.soulState.charm1999)E.restoreCharmOnExit(game.battle,member);
      if(!forced&&member.soulState.doctorReviveRequest2546)E.resolveDoctorExit(game.battle,member);
      const tokens=new Set(Object.values(member.effects).map(effect=>effect.delayedExecutionToken).filter(Boolean));
      if(tokens.size)for(const fighter of game.battle.fighters)for(const [key,effect] of Object.entries(fighter.effects))if(tokens.has(effect.delayedExecutionToken))delete fighter.effects[key];
      if(member.soulId===1547){
        const foe=game.battle.fighters[1-side];
        foe.soulState.executionMarks=Math.min(2,(foe.soulState.executionMarks??0)+1);
        for(const ally of game.battle.teamBench[1-side])delete ally.soulState.execution1547;
      }
      if(member.soulId===1664)E.releaseParsedOnTeamExit(game.battle,member,forced);
    }
    for(const side of changed){
      const outgoing=game.slots[side][game.active[side]],f=game.battle.fighters[side];
      const forced=departures[side]==='knockout',voluntary=departures[side]==='voluntary';
      if(game.battle.teamBuwu2147?.[side])game.battle.teamBuwu2147[side].points=f.soulState.buwu2147??0;
      if(voluntary){
        (game.battle.priorSwitchRound??=[null,null])[side]=game.battle.teamSwitchRound?.[side]??null;
        (game.battle.teamSwitchRound??=[null,null])[side]=game.battle.round;
        for(const [key,effect] of Object.entries(game.battle.teamSwitchWindows?.[side]??{})){
          if(effect.through<game.battle.round)delete game.battle.teamSwitchWindows[side][key];
          else if(effect.effectId===2040)(game.battle.teamEntryGrants??=[[],[]])[side].push(effect);
        }
      }
      if(forced&&f.soulState.onDefeatTransfer1805){
        (game.battle.teamEntryGrants??=[[],[]])[side].push({soulId:1805,hash:E.SOULS.registry[1805].sourceHash,...f.soulState.onDefeatTransfer1805});
      }
      if(forced&&f.soulId===2140&&f.soulState.guardianInheritance2140?.sourceHash==='356c53e0'){
        (game.battle.teamEntryGrants??=[[],[]])[side].push({soulId:2140,hash:'356c53e0'});
      }
      if(forced&&f.soulId===2141&&f.soulState.iceInheritance2141?.eligible&&f.soulState.iceInheritance2141.reason==='actual-death'){
        (game.battle.teamEntryGrants??=[[],[]])[side].push({soulId:2141,hash:f.soulHash,turns:3});
      }
      if(!forced&&Number(f.number)===4861&&game.battle.voidColors2392)game.battle.voidColors2392[side]=0;
      if(voluntary&&f.soulId===1806){
        const next=game.slots[side][targets[side]].fighter,level=next.soulState.futureLink??0;
        if(level>=3){next.soulState.syncMaxHp1806=f.stats.maxHp;next.stats.maxHp=f.stats.maxHp;next.hp=Math.min(next.hp,next.stats.maxHp);}
        if(level>=2)next.hp=Math.min(f.hp,next.stats.maxHp);
        if(level>=1)next.moves.forEach((key,i)=>{next.pp[key]=Math.min(next.teamPPDefinitions[key].pp,f.pp[f.moves[i]]);});
      }
      const arriving=game.slots[side][targets[side]].fighter;
      const warmSnow=f.soulState.warmSnow1859;
      if(warmSnow?.sourceHash==='2255679f'){
        arriving.soulState.warmSnow1859={...warmSnow};
        delete f.soulState.warmSnow1859;
      }
      const fireWard=f.effects['火系攻击减半'];
      if(fireWard?.end>=game.battle.round){
        arriving.effects['火系攻击减半']={...fireWard};
        delete f.effects['火系攻击减半'];
      }
      for(const key of ['己方属性无效2433','己方攻击无效2434','己方免异常2435','帝皇印记固粉免疫']){
        const effect=f.effects[key];
        if(effect?.end>=game.battle.round&&effect.ownerSide===side){
          arriving.effects[key]={...effect};
          delete f.effects[key];
        }
      }
      const retaliation=f.effects['在场反击'];
      if(retaliation?.end>=game.battle.round){
        arriving.effects['在场反击']={...retaliation};
        delete f.effects['在场反击'];
      }
      const statusResponse=f.effects['对手属性后封攻'];
      if(statusResponse?.end>=game.battle.round){
        arriving.effects['对手属性后封攻']={...statusResponse};
        delete f.effects['对手属性后封攻'];
      }
      if(f.counts.nextAttackDodge>0){
        arriving.counts.nextAttackDodge=f.counts.nextAttackDodge;
        arriving.soulState.nextAttackDodgeChance=f.soulState.nextAttackDodgeChance;
        delete f.counts.nextAttackDodge;
        delete f.soulState.nextAttackDodgeChance;
      }
      if(f.soulState.guardedFlame1833>0)arriving.soulState.guardedFlame1833=f.soulState.guardedFlame1833;
      if(f.soulId===1833){
        const foe=game.battle.fighters[1-side];
        for(const other of [foe,...game.battle.teamBench[1-side]])if(other.soulState.specialStates?.['炙光火种']?.sourceSide===side)delete other.soulState.specialStates['炙光火种'];
      }
      if(arriving.soulId===1805){
        const names=Object.keys(f.ailments).filter(k=>f.ailments[k]>=game.battle.round);
        if(names.length)arriving.soulState.prevImmunity1805={statuses:names,all:names.length>=4,start:game.battle.round,end:game.battle.round+1,from:f.name};
      }
      const candleContinuation=f.soulState.candle2121Continue;
      if(candleContinuation?.from>=game.battle.round){
        arriving.soulState.candle2121Continue={...candleContinuation};
        delete f.soulState.candle2121Continue;
      }
      const continuing=(f.soulState.continuations2121_4753??[]).filter(e=>e.from>=game.battle.round);
      if(continuing.length){
        const heir=game.slots[side][targets[side]].fighter;
        (heir.soulState.continuations2121_4753??=[]).push(...copy(continuing));
      }
      if(f.soulState.fiveMarks2125){
        const next=game.slots[side][targets[side]].fighter;
        for(const [kind,mark] of Object.entries(f.soulState.fiveMarks2125))if(mark.end>=game.battle.round)(next.soulState.fiveMarks2125??={})[kind]={...mark};
      }
      const repeat=f.soulState.repeatOnExit2403;
      if(repeat&&game.battle.round<=repeat.through)(game.battle.teamEntryGrants??=[[],[]])[side].push({...repeat,sourcePosition:f.teamPosition});
      if(f.soulId===1735){
        const effects=game.battle.fighters[1-side].effects;
        if(effects['攻击先制效果失效']?.nyxOwner===side)delete effects['攻击先制效果失效'];
      }
      if(f.soulId===2085){
        const foe=game.battle.fighters[1-side];
        for(const other of [foe,...game.battle.teamBench[1-side]]){
          const suppression=other.soulState.defeatEffectsSuppressed;
          if(suppression?.sourceSoul===2085&&suppression.sourceSide===side)delete other.soulState.defeatEffectsSuppressed;
        }
      }
      if(f.soulId===1509&&f.soulState.dragonTotem?.active){
        const field=(game.battle.teamTotems??=[null,null]);
        field[side]={totem:copy(f.soulState.dragonTotem),end:game.battle.round+1};
      }
      if(f.soulState.coldBan>0){
        const opponent=game.battle.fighters[1-side];
        const remaining=forced?0:voluntary?Math.max(0,f.soulState.coldBan-(200-50*(opponent.soulState.coldEssence??0))):f.soulState.coldBan;
        game.slots[side][targets[side]].fighter.soulState.coldBan=remaining;
      }
      if(f.soulState.ancientDread>0){
        const pending=game.battle.teamDreadOnEntry??=[0,0];
        pending[side]=f.soulState.ancientDread;
      }
      const due=f.soulState.teamDefeatAilments?.filter(e=>e.round>=game.battle.round);
      if(due?.length)(game.battle.teamRoundAilments??=[[],[]])[side].push(...due);
      if(voluntary&&f.soulState.onVoluntaryExit){
        const queue=(game.battle.teamEntryGrants??=[[],[]])[side];
        queue.push(...Object.values(f.soulState.onVoluntaryExit));
      }
      if(voluntary&&f.soulId===1920)E.healElderOnExit(game.battle,f);
      if(voluntary&&f.soulState.guiFu1747>0)E.applyGuiFuOnExit(game.battle,f);
      if(f.soulState.royalGuards?.white)E.removeRoyalWhiteOnExit(game.battle,f);
      E.knightDeparture4911(game.battle,f,game.battle.fighters[1-side],voluntary);
      outgoing.fighter={...copy(outgoing.base),hp:f.hp,pp:copy(f.pp)};
      for(const key of ['chiyu1982','crisisGained1982','ming1982','wind2058','ophelia4706','feathers1930','lostFeathers1930','featherEvents1930','featherTransfers1930','xin','xinFusion','lyrics4853','knightDuel4911'])if(f.soulState[key]!=null)outgoing.fighter.soulState[key]=copy(f.soulState[key]);
      if(outgoing.fighter.soulState.ophelia4706){outgoing.fighter.soulState.ophelia4706.doubleCharges=0;outgoing.fighter.soulState.ophelia4706.soleActive=false;}
      if(outgoing.fighter.soulState.lyrics4853)outgoing.fighter.soulState.lyrics4853.list=[];
      if(outgoing.fighter.soulState.ming1982){outgoing.fighter.soulState.ming1982.drainPercent=1;outgoing.fighter.soulState.ming1982.power=0;}
      if(outgoing.fighter.soulState.wind2058){const st=outgoing.fighter.soulState.wind2058;st.count=0;st.converted=false;delete st.reverseDue;delete st.reductionRound;}
      if(outgoing.fighter.soulState.xinFusion)outgoing.fighter.soulState.xinFusion=false;
      if(f.soulId===2097&&f.soulState.lastSurvival4911){outgoing.fighter.soulState.lastSurvival4911=copy(f.soulState.lastSurvival4911);outgoing.fighter.stats.spe=Math.max(0,outgoing.fighter.stats.spe-f.soulState.lastSurvival4911.lost);}
      if(f.soulId===2144&&f.soulState.xuan2144?.prepared){
        const resting=outgoing.fighter;resting.soulState.xuan2144=copy(f.soulState.xuan2144);
        const amount=f.soulState.xuan2144.entryPanel.amount;
        for(const k of ['maxHp','atk','def','spa','spd'])resting.stats[k]+=amount;
        resting.hp=Math.min(resting.hp,resting.stats.maxHp);
        if(f.soulState.emperor2144?.permanent)resting.soulState.emperor2144=copy(f.soulState.emperor2144);
      }
      if(voluntary&&f.soulId===1920){
        const empty=f.moves.filter(key=>f.pp[key]===0).length;
        if(empty)outgoing.fighter.soulState.elderBenchPpEnd=game.battle.round+empty-1;
      }
      if(f.soulState.opheliaFifth4706){const old=f.soulState.opheliaFifth4706;outgoing.fighter.pp[old.originalKey]=f.pp[old.key];delete outgoing.fighter.pp[old.key];}
      if(f.soulId===2162&&game.battle.teamVessel2162?.[side]){const state=game.battle.teamVessel2162[side].state;for(const key of ['free','currentFree','guardUse','attackGuard'])delete state[key];outgoing.fighter.soulState.divineVessel=state;}
      if(f.soulId===2119&&game.battle.teamMirage2119?.[side]){const state=game.battle.teamMirage2119[side].state;for(const key of ['round','enemyKind','defenseUntil'])delete state[key];outgoing.fighter.soulState.mirage2119=state;}
      if(f.soulId===2146&&f.soulState.thunder2146?.rescueUsed)outgoing.fighter.soulState.thunder2146={sourceHash:'aab36e4c',rescueUsed:true};
      if(outgoing.fighter.soulState.xinFusion){outgoing.fighter.build.resistance.fixed=100;outgoing.fighter.build.resistance.percent=100;}
      const critRule=E.WIKI.effectsEngine.registry[933];
      const remainder574=E.WIKI.effectsEngine.registry[574].captureTeamRemainder(f);
      if(remainder574)(game.battle.teamEntryGrants??=[[],[]])[side].push(remainder574);
      for(const record of f.soulState.nextCritSources4599?critRule.syncCounter4599(f,'nextCrit'):[]){
        if(critRule.teamSharedKey(record.key))(game.battle.teamEntryGrants??=[[],[]])[side].push({effectId:933,...record});
      }
      for(const record of f.soulState.ailmentImmuneSources??[]){
        const sharedEffect=record.ownership?.effectId??928;
        if(record.count>0&&record.ownership?.scope==='ally-side'&&record.ownership.side===side&&[928,951,1095,2048,2087].includes(sharedEffect)&&record.key?.startsWith(sharedEffect+':')){
          (game.battle.teamEntryGrants??=[[],[]])[side].push({...record,effectId:sharedEffect});
          continue;
        }
        if((record.kind==='team904'||record.kind==='plot2153'||record.kind==='1805')&&record.count>0){
          (game.battle.teamEntryGrants??=[[],[]])[side].push({effectId:904,...record});
          continue;
        }
        if(record.count<=0||!record.key?.startsWith('2148:'))continue;
        if(['hestia-2148','solver2148','void2148','神觉2148','wusheng2148'].includes(record.kind)){
          (game.battle.teamEntryGrants??=[[],[]])[side].push({effectId:2148,...record});
        }
      }
      if(f.soulState.jasmineBlessing && f.soulState.temporaryHp?.['芳馨之祝']){
        const bonus=f.soulState.temporaryHp['芳馨之祝'].bonus;
        outgoing.fighter.stats.maxHp+=bonus;
        (outgoing.fighter.soulState.temporaryHp??={})['芳馨之祝']={bonus};
        outgoing.fighter.soulState.jasmineBlessing={...f.soulState.jasmineBlessing};
      }
      if(f.statusState?.faithSourceSide!=null){
        outgoing.fighter.statusState??={};
        for(const key of ['faithSourceSide','faithSourceNumber','faithSourceName'])outgoing.fighter.statusState[key]=f.statusState[key];
      }
      // Earned all-faith immunity has no leave-retention clause; faith identity itself is unchanged.
      if(f.soulState.abolishedMoves1973)outgoing.fighter.soulState.abolishedMoves1973={...f.soulState.abolishedMoves1973};
      if(f.soulId===1987)outgoing.fighter.hp=Math.min(outgoing.fighter.hp,outgoing.fighter.stats.maxHp);
      if(f.soulId===2008)outgoing.fighter.soulState.cyber2008={configured:true,open:false};
      if(f.soulId===1919&&f.soulState.void1919){outgoing.fighter.soulState.void1919=copy(f.soulState.void1919);outgoing.fighter.hp=Math.min(outgoing.fighter.hp,outgoing.fighter.stats.maxHp);}
      if(f.soulState.tideFocus1856)outgoing.fighter.soulState.tideFocus1856=copy(f.soulState.tideFocus1856);
      if(f.soulState.chiyong1878?.layers>0)outgoing.fighter.soulState.chiyong1878=copy(f.soulState.chiyong1878);
      if(f.soulId===2117&&f.soulState.dragon2117){
        const st=f.soulState.dragon2117;
        outgoing.fighter.soulState.dragon2117={...copy(st),triggerCount:0,temporaryGain:0,bestRound:0,recoveries:[]};
        outgoing.fighter.stats.maxHp-=st.initialConsumed;
        for(const key of ['atk','def','spa','spd','spe'])outgoing.fighter.stats[key]+=st.initialConsumed;
      }
      // Unannotated foreign panel changes reset with the resting base.
      if(f.soulId===2117||f.soulState.dragonPanel2117)outgoing.fighter.hp=Math.min(outgoing.fighter.hp,outgoing.fighter.stats.maxHp);
      if(f.soulId===2120&&f.soulState.doctor2120){const d=f.soulState.doctor2120;outgoing.fighter.soulState.doctor2120={sleepDuration:3,sourceHash:d.sourceHash,...(d.revivalEvents?{revivalEvents:copy(d.revivalEvents)}:{})};}
      if(f.soulId===1967&&f.soulState.wudao1967)outgoing.fighter.soulState.wudaoFieldRounds1967=f.soulState.wudao1967.fieldRounds;
      if(f.soulState.coldEssence>0)outgoing.fighter.soulState.coldEssence=f.soulState.coldEssence;
      if(f.soulState.lokiFalseArc>0)outgoing.fighter.soulState.lokiFalseArc=f.soulState.lokiFalseArc;
      for(const key of ['heroGlory2009','magicCurse1973','shivaDefeats','miracleAttacks','miracleStatuses','holyThunder','holyThunderSpentSerial','holyThunderGainBonus','holyVerdict','yuliFangLayers','holyMarks','executionMarks','yongchang','thunderStarling','darkDragonHatred','fallenDragonResentment','arslanGrowth','dragonGall','futureSingularity'])if(f.soulState[key]>0)outgoing.fighter.soulState[key]=f.soulState[key];
      if(f.soulState.yongchang!=null)outgoing.fighter.soulState.yongchang=0;
      if(f.soulState.yuliFangLayers!=null)outgoing.fighter.soulState.yuliFangLayers=0;
      if(f.soulId===2121){
        outgoing.fighter.soulState.holyThunder=0;
        outgoing.fighter.soulState.holyThunderGainBonus=0;
        // User correction: clearing positive thunder on exit is a reduction for 2551.
        outgoing.fighter.soulState.holyThunderSpentSerial=(f.soulState.holyThunderSpentSerial??0)+((f.soulState.holyThunder??0)>0?1:0);
      }
      if(f.soulState.thunderSeal2551)outgoing.fighter.soulState.thunderSeal2551={...f.soulState.thunderSeal2551};
      if(f.soulId===1791){
        if(f.soulState.emptyVerses1791!=null)outgoing.fighter.soulState.emptyVerses1791=f.soulState.emptyVerses1791;
        if(f.soulState.emptyProfaneUsed1791||f.soulState.emptyProfane1791)outgoing.fighter.soulState.emptyProfaneUsed1791=true;
      }
      if(f.soulState.moth2071){
        const state=f.soulState.moth2071;
        outgoing.fighter.soulState.moth2071={...copy(state),firstAttackHere:false};
        delete outgoing.fighter.soulState.moth2071.floorRound;
        outgoing.fighter.stats.maxHp=Math.max(1,outgoing.fighter.stats.maxHp-state.lostMaxHp);
        outgoing.fighter.hp=Math.min(outgoing.fighter.hp,outgoing.fighter.stats.maxHp);
      }
      if(f.soulState.observation4915){
        const {active}=f.soulState.observation4915;
        outgoing.fighter.soulState.observation4915={active,status:null,kind:null,entryRound:0,recordRound:0,events:[]};
      }
      if(f.soulState.wind2151){
        const {sourceHash}=f.soulState.wind2151;
        outgoing.fighter.soulState.wind2151={capacityRate:60,damageRate:60,fullRate:60,sourceHash,events:[]};
        outgoing.fighter.hp=Math.min(outgoing.fighter.hp,outgoing.fighter.stats.maxHp);
      }
      if(f.soulState.heroOath2009)E.grantHeroOath(outgoing.fighter);
      // Ningjie has no leave-retention clause; a new entry grants its original four layers.
      if(f.soulState.townDarkSpent)outgoing.fighter.soulState.townDarkSpent=true;
      if(f.soulState.townGoldSpent)outgoing.fighter.soulState.townGoldSpent=true;
      // Dragon deaths remain spent; their unannotated current benefits reset.
      if(f.soulState.cleriaRebirthAttempted)outgoing.fighter.soulState.cleriaRebirthAttempted=true;
      // Fatal marks have no explicit leave-retention clause; the resting base clears them.
      if(f.soulState.fatalCracks)outgoing.fighter.soulState.fatalCracks=f.soulState.fatalCracks;
      for(const key of ['darkCause','darkRoots'])if(f.soulState[key])outgoing.fighter.soulState[key]=copy(f.soulState[key]);
      for(const key of ['oracleMarks1764','oracleMarkSerial1764','intent1829','fateProtection1829'])if(f.soulState[key]!=null)outgoing.fighter.soulState[key]=copy(f.soulState[key]);
      if(f.soulState.heavenWard4895)outgoing.fighter.soulState.heavenWard4895=true;
      if(f.soulState.score4895?.heavenGains){
        const state=outgoing.fighter.soulState.score4895??={notes:[],serial:0,events:[],weakDrains:[],ppRestoredTotal:0};
        state.heavenGains=f.soulState.score4895.heavenGains;state.heaven=0;
      }
      // 2379 grants no leave-retention clause; the resting base restores original resistances.
      // 1806 grants have no explicit leave retention: links and synced max HP reset to the resting base.
      if(f.soulState.corpseCount!==undefined)outgoing.fighter.soulState.corpseCount=f.soulState.corpseCount;
      if(f.soulState.contractDamageBonus)outgoing.fighter.soulState.contractDamageBonus=f.soulState.contractDamageBonus;
      if(f.soulState.corpsePanelGain){
        outgoing.fighter.soulState.corpsePanelGain=f.soulState.corpsePanelGain;
        for(const key of ['maxHp','atk','def','spa','spd','spe'])outgoing.fighter.stats[key]+=f.soulState.corpsePanelGain;
      }
      if(f.soulState.forest&&f.soulState.temporaryHp?.forest){
        outgoing.fighter.soulState.forest=copy(f.soulState.forest);
        (outgoing.fighter.soulState.temporaryHp??={}).forest={...f.soulState.temporaryHp.forest};
        outgoing.fighter.stats.maxHp+=f.soulState.temporaryHp.forest.bonus;
      }
      if(f.soulState.verse2098){
        outgoing.fighter.soulState.verse2098=copy(f.soulState.verse2098);
        outgoing.fighter.soulState.verse2098.permanentAilments=[];
        for(const key of ['weaknessImmune','ailmentImmune','fixedImmune','percentImmune'])delete outgoing.fighter.soulState.verse2098[key];
      }
      // Personal counts reset on departure; verified side-owned remaining records were queued above.
      if(f.soulState.parsedSkills)outgoing.fighter.soulState.parsedSkills=copy(f.soulState.parsedSkills);
      if(f.soulState.prophecies?.triumph)outgoing.fighter.soulState.prophecies={triumph:copy(f.soulState.prophecies.triumph)};
      if(f.soulId===1805)for(const key of ['ming1805','fall1805'])outgoing.fighter.soulState[key]=2;
      if(f.soulId===1809){
        if(f.soulState.collapsedSkills1809!==undefined)outgoing.fighter.soulState.collapsedSkills1809=copy(f.soulState.collapsedSkills1809);
        outgoing.fighter.soulState.futureInstructions1809=3;
        outgoing.fighter.soulState.collapsedCount1809=0;
      }
      if(f.soulState.guiFu1747>0)outgoing.fighter.soulState.guiFu1747=f.soulState.guiFu1747;
      if([1733,1948].includes(f.soulId)&&f.soulState.whirlpoolPriority>0)outgoing.fighter.soulState.whirlpoolPriority=f.soulState.whirlpoolPriority;
      if(f.soulState.hunt1948){
        const state=outgoing.fighter.soulState.hunt1948=copy(f.soulState.hunt1948);
        state.souls=0;
        delete state.inheritedZakKills;
        delete state.inheritedZakKills519;
        outgoing.fighter.hp=Math.min(outgoing.fighter.hp,outgoing.fighter.stats.maxHp);
      }
      // Tao and Lianzhu have no leave-retention clause; the resting base clears them.
      if(f.soulState.soulGu?.length)outgoing.fighter.soulState.soulGu=copy(f.soulState.soulGu);
      if(f.hp>0&&f.soulState.sealLayers>0)outgoing.fighter.soulState.sealLayers=f.soulState.sealLayers;
      if(f.soulState.emperorFullEntry849)outgoing.fighter.soulState.emperorFullEntry849=true;
      if(f.soulState.emperorFifthUsed){
        outgoing.fighter.soulState.emperorFifthUsed=true;
        // Only the once-per-battle spent flag survives; temporary freeze/cost resets.

      }
      if(f.soulState.inverseMight>0)outgoing.fighter.soulState.inverseMight=f.soulState.inverseMight;
      if(f.soulState.shura2128){
        const {form,initialized,thought,sourceHash}=f.soulState.shura2128;
        outgoing.fighter.soulState.shura2128={form,initialized,thought,sourceHash};
      }
      if(f.soulState.inkTears>0){
        outgoing.fighter.soulState.inkTears=f.soulState.inkTears;
        outgoing.fighter.soulState.inkTearsSource=f.soulState.inkTearsSource;
      }
      if(f.soulId===753&&f.soulState.pony753?.reincarnationUsed)outgoing.fighter.soulState.pony753={sourceHash:'2b305c24',reincarnationUsed:true};
      // 879 is explicitly once per battle: leaving cannot renew the spent blessing.
      if(f.soulId===879&&f.soulState.warBlessed){outgoing.fighter.soulState.warBlessed=true;outgoing.fighter.soulState.warBlessingRound=f.soulState.warBlessingRound;}
      if(f.soulState.rewindUsed1916)outgoing.fighter.soulState.rewindUsed1916=true;
      if(f.soulState.starLethalUsed1848)outgoing.fighter.soulState.starLethalUsed1848=true;
      // User global leave rule:519 has no explicit retention clause; its KO growth resets with the resting base.
      if(f.soulState.kingPrayerUsed)outgoing.fighter.soulState.kingPrayerUsed=true;
      if(f.soulState.kingDeathAttempted)outgoing.fighter.soulState.kingDeathAttempted=true;
      // 1229 target max-HP reductions have no leave-retention clause.
      E.leaveTeamMember(f,outgoing.fighter,grant=>(game.battle.teamEntryGrants??=[[],[]])[side].push(grant),voluntary,departures[side],game.battle.fighters[1-side]);
      E.leaveNarakuTarget(game.battle,f);
      if(departures[side]==='voluntary'&&f.soulId===2168&&E.SOULS.acceptsSource(2168,f.soulHash)){
        const hats=game.battle.teamMilinnaHats??=[0,0];
        hats[side]=Math.min(4,hats[side]+2);
      }
      if(f.soulState.syncMaxHp1806||f.soulState.belialMaxHP1886||f.soulState.teamPanel2296||f.soulState.poemCapacity1791||f.soulState.townDarkBonus||f.soulState.magicCurse1973)outgoing.fighter.hp=Math.min(outgoing.fighter.hp,outgoing.fighter.stats.maxHp);
      if(f.soulState.vanished){
        outgoing.fighter.stats.maxHp=0;outgoing.fighter.hp=0;
        outgoing.fighter.soulState.vanished=true;outgoing.fighter.soulState.deathResolved=true;
      }
      (game.battle.lastActivePosition??=[null,null])[side]=game.active[side];
      (game.battle.teamDepartureEvents??=[]).push({round:game.battle.round,side,from:game.active[side],to:targets[side],kind:departures[side],selection:targetSelection[side]});
      if(departures[side]==='expelled')game.history.push('第 '+game.battle.round+' 回合 · '+(side===0?'A':'B')+(targetSelection[side]==='random'?' 方被驱逐，随机换入 ':' 方主动更换视为驱逐，指定换入 ')+game.slots[side][targets[side]].fighter.name+'。');
      game.active[side]=targets[side];
    }
    if(changed.length){game.battle.teamDeathOrder=[];connect(game);enter(game,changed);}
  }
  function resolveDrivenRequests(game){
    const s=game.battle;
    while(s.teamDrivenSwitchRequests?.length){
      const request=s.teamDrivenSwitchRequests.shift(),side=request.side,pool=s.fighters[side].hp>0?candidates(game,side,true):[];
      const event={...request,round:s.round,eligible:pool.slice(),selection:'random',triggered:false};
      (s.teamDrivenEvents??=[]).push(event);
      if(!pool.length||!E.rollDrivenTeamChance(s,request.chance))continue;
      const target=E.drawDrivenTeamTarget(s,pool);event.triggered=true;event.target=target;
      if(request.sourceSoul===1061&&request.sourceHash==='e7c06bfc'){
        (s.teamDrivenAction1061??=[null,null])[side]={round:s.round,sourceSide:request.sourceSide,sourcePosition:request.sourcePosition,reason:request.reason};
        event.actionConsumedRound=s.round;
      }
      const targets=[null,null],kinds=['voluntary','voluntary'],selection=['chosen','chosen'];targets[side]=target;kinds[side]='expelled';selection[side]='random';
      swap(game,targets,false,kinds,selection);
    }
  }
  function adjudicate(game){
    const s=game.battle;
    const completed=s.turns.at(-1)?.round??0,atLimit=completed>=50;
    E.refreshKnightStates4911(s);E.bindXinTeam1061(s);if(!atLimit)E.prepareXinDue1061(s);resolveDrivenRequests(game);
    game.pending=sides.filter(i=>s.fighters[i].hp<=0&&s.fighters[i].soulState.kingRevivalRound!==s.round);
    for(const side of game.pending)if(s.fighters[side].soulState.heroOathOnExit)E.resolveHeroExit(s,s.fighters[side],game.slots[side]);
    for(const side of game.pending)if(s.fighters[side].soulState.doctorReviveRequest2546)E.resolveDoctorExit(s,s.fighters[side]);
    E.collectFallenVerses(s);
    const lost=sides.filter(i=>{
      if(s.teamPlot2153?.[1-i]?.phase===4&&!game.slots[i].some(slot=>slot.fighter.hp>0&&!slot.fighter.soulState.murder2153?.length))return true;
      return game.pending.includes(i)&&!candidates(game,i,true).length;
    });
    if(lost.length){
      const first=lost.length===1?lost[0]:s.teamDeathOrder?.find(i=>lost.includes(i));
      if(first==null)throw Error('双亡缺少倒下顺序');
      s.finished=true;s.winner=1-first;game.phase='finished';
      game.history.push((s.winner?'B':'A')+' 方获胜');
    }else if(atLimit){
      const counts=sides.map(side=>E.victoryPopulation50(s,side));
      s.teamRoundLimit={limit:50,completed,counts};
      s.finished=true;s.winner=counts[0].total===counts[1].total?'draw':Number(counts[1].total>counts[0].total);
      game.phase='finished';game.pending=[];
      const text='50回合结算：A 方 '+counts[0].total+' 只，B 方 '+counts[1].total+' 只，'+(s.winner==='draw'?'平局':(s.winner?'B':'A')+' 方获胜');
      s.turns.at(-1).events.push({text});game.history.push('第 '+completed+' 回合 · '+text);
    }else {game.phase=game.pending.length?'replace':'action';if(game.phase==='action'){E.prepareTeamExile(s);E.prepareWindDue2058(s);}}
  }
  const unavailableAction='team:unavailable-action';
  function copySavedGame(previous){
    const game=copy(previous);
    if(game.battle.initial?.resistanceRevision==null){
      E.GEAR.restoreBattleBuilds(game.battle);
      for(const slot of game.slots.flat())for(const member of [slot.config,slot.base,slot.fighter]){
        if(member.build)member.build=E.GEAR.restoreBuild(member.build);
      }
    }
    return game;
  }
  function turn(previous,choices,afterReplacement=false){
    if(previous.phase!=='action'||!Array.isArray(choices)||choices.length!==2)throw Error('当前不能提交回合');
    const game=copySavedGame(previous),s=game.battle;
    const drivenAction=sides.map(side=>s.teamDrivenAction1061?.[side]?.round===s.round);
    const requested=choices.map((choice,side)=>!drivenAction[side]&&typeof choice==='object'&&choice!==null?choice.switchTo:null),departures=sides.map(side=>switchMode(game,side));
    for(const side of sides)if(requested[side]!=null&&!candidates(game,side).includes(requested[side]))throw Error('不可换入该成员');
    // User 2026-11-10: 2144 changes departure semantics, never the chosen target.
    const targets=requested;
    if(!afterReplacement)for(const side of sides){
      if(!drivenAction[side]&&targets[side]==null&&!E.validBattleChoice(s.fighters[side],choices[side],s.round))throw Error('请选择合法行动');
    }
    swap(game,targets,false,departures);
    for(const side of sides)if(targets[side]!=null){
      const incoming=s.fighters[side];
      if(incoming.soulId===2038&&incoming.soulHash==='5382550b')
        incoming.soulState.mehSwitchIn2038={round:s.round,move:incoming.moves[0],lyricGranted:false};
    }
    for(const side of sides){
      const carried=s.teamRoundAilments?.[side];
      if(carried?.length)(s.fighters[side].soulState.teamDefeatAilments??=[]).push(...carried.splice(0));
    }
    for(const side of sides){
      const source=game.slots[side].find(slot=>slot.fighter.soulId===1605);
      if(!source)continue;
      const opponents=game.slots[1-side];
      if(s.round>1&&(s.round-1)%10===0){
        for(const slot of opponents){
          const marks=slot.fighter.soulState.tieMarksBySource??={};
          delete marks[side];
          if(source.fighter.hp>0&&slot.dishengFieldTurns>0&&E.tryBenchTarget(s,source.fighter,slot.fighter))
            marks[side]={count:slot.dishengFieldTurns,expiresRound:s.round+9,sourceSide:side};
          slot.dishengFieldTurns=0;
        }
      }
      const present=opponents[game.active[1-side]];
      present.dishengFieldTurns=(present.dishengFieldTurns??0)+1;
    }
    const actions=choices.map((choice,side)=>{
      if(drivenAction[side]||targets[side]!=null)return 'team:switch';
      if(!afterReplacement)return choice;
      // Entry effects can alter the chosen skill before it starts.
      const fighter=s.fighters[side];
      const key=fighter.soulState.charm1999?.slots.find(slot=>slot.id===choice)?.alias??choice;
      return E.validBattleChoice(fighter,key,s.round)?key:unavailableAction;
    });
    if(afterReplacement&&actions.includes(unavailableAction))s.moveDefinitions[unavailableAction]={id:unavailableAction,name:'所选行动无法执行',kind:'item',priority:-100,power:0,operations:[]};
    delete s.teamKnockout;
    game.battle=E.resolveTurn(s,actions);
    E.captureTeamLaw2146(game.battle);
    for(const side of sides)if(game.battle.teamBuwu2147?.[side])game.battle.teamBuwu2147[side].points=game.battle.fighters[side].soulState.buwu2147??0;
    E.expireTeamBlessings(game.battle);
    for(const side of sides){
      const field=game.battle.teamStar1844?.[side];if(!(field?.bearer?.energy>0))continue;
      for(const f of [game.battle.fighters[side],...game.battle.teamBench[side]])if(f.teamPosition!==field.sourcePosition&&f.hp<=0&&f.soulState.lastDefeatRound===s.round){
        const seen=field.deathRounds??={};if(seen[f.teamPosition]===s.round)continue;seen[f.teamPosition]=s.round;field.bearer.energy+=300;field.events.push({round:s.round,kind:'ally-defeated',position:f.teamPosition,added:300,energy:field.bearer.energy});
      }
    }
    for(const roster of game.battle.teamBench)for(const member of roster){
      if(member.soulId===1638&&member.hp>0&&member.soulState.dragonGall>0)member.soulState.dragonGall--;
      if(member.hp<=0||member.soulId!==1920||!(member.soulState.elderBenchPpEnd>=s.round))continue;
      for(const key of member.moves)member.pp[key]=Math.min(member.teamPPDefinitions[key].pp,member.pp[key]+1);
    }
    for(const side of sides){
      const battle=game.battle,opponent=battle.fighters[1-side],actor=battle.fighters[side],allowKO=E.knightAllowsKO4911(actor);
      if(allowKO&&(actor.soulId===1113||actor.soulId===1948&&E.SOULS.registry[1948].abilities.hasSource({teamMode:true,a:actor,teamReserves:i=>battle.teamBench[i]},1113))&&actor.hp>0&&opponent.hp<=0&&opponent.soulState.lastDefeatRound===s.round)
        (battle.teamEntryGrants??=[[],[]])[1-side].push({soulId:1113,hash:'c85f7577'});
      if(opponent.hp<=0 && opponent.soulState.teamDefeater===side && opponent.soulState.lastDefeatRound===s.round){
        if(battle.swordReforge?.[side]){
          const fallen=battle.teamBench[side].find(f=>f.soulId===1547&&f.hp<=0&&!f.soulState.vanished);
          if(fallen){fallen.hp=fallen.stats.maxHp;for(const k of fallen.moves)fallen.pp[k]=fallen.teamPPDefinitions[k].pp;delete fallen.soulState.deathResolved;}
          for(const inherited of [battle.fighters[side],...battle.teamBench[side]]){
            if(inherited.soulId!==1948||inherited.soulHash!=='69377815'||inherited.hp>0||inherited.soulState.vanished||!E.knightAllowsKO4911(inherited))continue;
            if(!E.SOULS.registry[1948].abilities.hasSource({teamMode:true,a:inherited,teamReserves:i=>battle.teamBench[i]},1547))continue;
            inherited.hp=inherited.stats.maxHp;
            for(const k of inherited.moves)inherited.pp[k]=inherited.teamPPDefinitions[k].pp;
            delete inherited.soulState.deathResolved;
            const st=inherited.soulState.hunt1948??={souls:0};
            (st.inheritedAllyRevivalHistory??=[]).push({round:s.round,sourceSoul:1547,sourceHash:'2a1c0673',killerPosition:actor.teamPosition,hp:inherited.hp});
            battle.turns.at(-1).events.push({kind:'heal',text:(side?'B':'A')+' 方阿尔忒弥斯继承圣华：己方击败触发圣剑重铸，恢复全部体力与PP。'});
          }
        }
        if(allowKO&&actor.soulState.triumphRestorationRound===s.round){
          const reserves=battle.teamBench[side].filter(f=>f.hp>0&&!f.soulState.vanished).sort((a,b)=>a.hp-b.hp||a.teamPosition-b.teamPosition);
          if(actor.soulState.triumphRestorationPayloadRound===s.round&&reserves.length)E.restoreTriumphReserve(battle,actor,reserves[0].teamPosition);
          delete actor.soulState.triumphRestorationRound;
          delete actor.soulState.triumphRestorationPayloadRound;
        }
        if(allowKO&&actor.soulId===1617&&!(opponent.soulState.executionMarksOnDefeat?.round===s.round&&opponent.soulState.executionMarksOnDefeat.count>0))
          (battle.teamEntryGrants??=[[],[]])[1-side].push({soulId:1617,hash:actor.soulHash});
        if(allowKO&&((actor.soulId===1204&&opponent.soulState.darkSeed)||(actor.soulId===1834&&actor.soulState.darkRoots>0))){
          const count=actor.soulId===1204?2:actor.soulState.darkRoots;
          (battle.teamEntryGrants??=[[],[]])[1-side].push({soulId:actor.soulId,hash:actor.soulHash,count});
        }
        if(allowKO&&actor.soulId===519)actor.soulState.teamKills519=(actor.soulState.teamKills519??0)+1;
        for(const [owner,field] of [[actor,'onTeamKnockout'],[opponent,'onTeamDefeat']]){
          if(field==='onTeamKnockout'&&!allowKO||field==='onTeamDefeat'&&owner.soulState.defeatEffectsSuppressed)continue;
          const grants=owner.soulState[field];
          if(grants){
            const queue=(battle.teamEntryGrants??=[[],[]])[1-side];
            for(const grant of Object.values(grants)){
              if(grant.effectId===757&&grant.round!==s.round)continue;
              const rule=E.WIKI.effectsEngine.registry[grant.effectId];
              queue.push(rule?.captureTeamKnockout?rule.captureTeamKnockout(owner,grant):grant);
            }
            delete owner.soulState[field];
          }
        }
      }
      const move=actor.soulState.actualMoveThisRound4658;
      const prophecy=actor.soulState.prophecyTransfer1912;
      if(allowKO&&prophecy?.sourceHash==='dff9a46'&&prophecy.round===s.round&&opponent.hp<=0&&opponent.soulState.teamDefeater===side){
        (battle.teamEntryGrants??=[[],[]])[1-side].push({soulId:1912,hash:'dff9a46',sourceSide:side,ailments:copy(prophecy.ailments)});
        delete actor.soulState.prophecyTransfer1912;
      }
      if(allowKO&&actor.soulState.belialNextCurse1886?.sourceHash==='741b1239'&&opponent.hp<=0&&opponent.soulState.teamDefeater===side){
        (battle.teamEntryGrants??=[[],[]])[1-side].push({soulId:1886,hash:'741b1239',sourceSide:side});
        delete actor.soulState.belialNextCurse1886;
      }
      if(opponent.hp<=0 && opponent.soulState.teamDefeater===side && opponent.soulState.lastDefeatRound===s.round &&
         allowKO && move?.round===s.round && move.move.id===actions[side]){
        if(actor.soulId===574 && actor.soulState.divineWingDefeatRound===s.round){
          actor.soulState.energy=0;
          actor.soulState.divineWingPriorityRound=s.round+1;
        }
        for(const op of move.move.operations??[]){
          if(op.effectId===2584&&actor.soulState.extraStarEmperor2584?.round===s.round&&
             !game.slots[side].some(slot=>Number(slot.fighter.number)===3291)&&!battle.extraStar2584?.[side]){
            (battle.extraStar2584??=[null,null])[side]={number:3291,alive:true};
            const lead=game.slots[side][game.active[side]].wasLead;
            actor.soulState.teamStar622={lead};
            const ability=E.SOULS.registry[2149].abilities,source={id:622,hash:'2f1e3f2'};
            ability.grantStar({a:actor},actor,'gift',source);
            if(lead&&s.round<=3)ability.grantStar({a:actor},actor,'blessing',source);
          }
          if(op.effectId===1308&&actor.soulId===849)actor.soulState.emperorFullEntry849=true;
          if(op.effectId===826){
            if(opponent.soulState.teamDefeatAilments?.some(e=>e.effectId===826&&e.round===s.round+1&&e.sourceSide===side))continue;
            const due=(battle.teamRoundAilments??=[[],[]])[1-side];
            due.push({round:s.round+1,effectId:826,count:op.sourceArgs[0],sourceSide:side});
            continue;
          }
          if([185,1830,2551,2194,2159,2326,2426,1663,2027,2017,1654,1090].includes(op.effectId)&&(actor.soulState.teamLandedPayload?.round!==s.round||actor.soulState.teamLandedPayload.move!==move.move.id))continue;
          if(op.effectId===698&&(actor.soulState.teamPayload698?.round!==s.round||actor.soulState.teamPayload698.move!==move.move.id||actor.soulState.teamPayload698.disabled))continue;
          const grant=E.WIKI.effectsEngine.registry[op.effectId]?.onTeamKnockout?.(op.sourceArgs,move.move,s.round,actor,opponent,battle);
          if(grant?.effectId===910){
            actor.effects.heldStatusBlock={start:s.round+1,end:s.round+grant.amount};
            continue;
          }
          if(grant){
            const queue=(battle.teamEntryGrants??=[[],[]])[1-side];
            queue.push(grant);
          }
        }
        const soul=E.SOULS.registry[actor.soulId];
        if(soul?.abilities?.onTeamAttackKnockout && ['special','physical'].includes(move.move.kind)){
          const grant=soul.abilities.onTeamAttackKnockout(actor,battle);if(grant)(battle.teamEntryGrants??=[[],[]])[1-side].push(grant);
        }
      }
      const bench=game.battle.teamBench[side];
      for(const f of bench)if(f.soulId===1258 && f.hp>0)
        f.soulState.elephantCharge=Math.min(9,(f.soulState.elephantCharge??0)+1);
      let index=0;
      for(const [slotIndex,slot] of game.slots[side].entries()){
        slot.fighter=slotIndex===game.active[side]?game.battle.fighters[side]:bench[index++];
      }
    }
    const last=game.battle.turns.at(-1);
    appendHistory(game,last.round,last.events,true);
    adjudicate(game);
    return game;
  }
  function replace(previous,targets){
    if(previous.phase!=='replace'||!Array.isArray(targets)||targets.length!==2||sides.some(i=>previous.pending.includes(i)!==(targets[i]!=null)))throw Error('请选择阵亡方的替补');
    const game=copySavedGame(previous);
    delete game.battle.teamKnockout;
    swap(game,targets,true);adjudicate(game);
    return game;
  }

  function projectReplacement(game,targets){
    const active=game.active.map((position,side)=>targets[side]??position);
    const fighters=active.map((position,side)=>targets[side]==null?game.battle.fighters[side]:game.slots[side][position].fighter);
    return {...game,active,battle:{...game.battle,fighters}};
  }

  function turnWithReplacement(previous,targets,choices,{blind=false}={}){
    if(previous.phase!=='replace'||!Array.isArray(targets)||targets.length!==2||!Array.isArray(choices)||choices.length!==2)throw Error('请选择补位及本回合行动');
    for(const side of sides){
      const target=targets[side];
      if(previous.pending.includes(side)?!candidates(previous,side,true).includes(target):target!=null)
        throw Error('请选择合法补位成员');
    }
    const projected=projectReplacement(previous,targets);
    const round=previous.battle.round;
    for(const side of sides){
      const choice=choices[side];
      if(previous.battle.teamDrivenAction1061?.[side]?.round===round)continue;
      const selectionView=blind?projectReplacement(previous,targets.map((target,i)=>i===side?target:null)):projected;
      const legal=choice&&typeof choice==='object'?candidates(selectionView,side).includes(choice.switchTo):
        E.validBattleChoice(projected.battle.fighters[side],choice,round);
      if(!legal)throw Error('请为双方选择可执行的行动');
    }
    const game=replace(previous,targets);
    if(game.phase!=='action')return game;
    const actions=choices.map((choice,side)=>{
      if(game.active[side]!==projected.active[side])return unavailableAction;
      if(choice&&typeof choice==='object'&&!candidates(game,side).includes(choice.switchTo))return unavailableAction;
      return choice;
    });
    return turn(game,actions,true);
  }
  function choicesFor(game,side,target){
    const targets=[null,null];targets[side]=target;
    const view=projectReplacement(game,targets),f=view.battle.fighters[side];
    if(game.battle.teamDrivenAction1061?.[side]?.round===game.battle.round)return [{key:'pass',name:'本回合已被驱逐，无需出招'}];
    const options=[];
    for(const key of E.availableMoves(f,view.battle.round)){
      if(key==='team:switch')continue;
      const slot=view.slots[side][view.active[side]];
      const raw=key.startsWith('wiki:')?E.WIKI.selectedMove(slot.config.snapshot,slot.config.moves.find(id=>'wiki:'+id===key)):null;
      const move=raw??view.battle.moveDefinitions[key];
      const name=move?.selectionName??move?.name??key;
      const pp=(E.SpMars.projectedBody(f,view.battle.round)?.pp??f.pp)[key];
      const label=pp==null?name:name+' · PP '+pp;
      if(E.SpMars.owns(f)&&key===E.SpMars.FIFTH_KEY){
        for(const form of E.SpMars.legalForms(f))options.push({key:E.SpMars.choiceKey(form),name:label+' · '+E.SpMars.LABELS[form]});
      }else options.push({key,name:label});
    }
    for(const index of candidates(view,side))options.push({key:'switch/'+index,name:'换入 '+view.slots[side][index].fighter.name});
    return options;
  }
  return {create,choicesFor,turn:(game,choices)=>turn(game,choices),replace,candidates,switchMode,projectReplacement,turnWithReplacement};
});
