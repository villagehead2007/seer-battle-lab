'use strict';
// Runs in its own engine realm. The only input is the public position at turn start.
function actions(game, side, seededRoot=false) {
  const targets = game.pending.includes(side) ? TeamBattle.candidates(game,side,true) : [null];
  return targets.flatMap(target => {
    const options=TeamBattle.choicesFor(game,side,target).map(({key}) => ({target,key}));
    if(!seededRoot)return options;
    // Restore the historical fifth-first search order, including when a default
    // skill is equipped in a different slot. PP and effects still use real slots.
    const slot=game.slots[side][target??game.active[side]];
    const defaults=BattleEngine.WIKI.defaultMoves(slot.config.snapshot).map(id=>'wiki:'+id);
    const rank=option=>{
      if(moveFor(game,side,option)?.fifth)return -1;
      const index=defaults.indexOf(option.key);
      return index<0?defaults.length:index;
    };
    return options.map(option=>({option,rank:rank(option)}))
      .sort((a,b)=>a.rank-b.rank).map(entry=>entry.option);
  });
}
function engineChoice(key) {
  return key.startsWith('switch/') ? {switchTo:Number(key.slice(7))} : key;
}
function simulate(game,a,b,rng) {
  const sample = {...game,battle:{...game.battle,rng,seed:String(rng)}};
  const pair = [engineChoice(a.key),engineChoice(b.key)];
  return game.phase === 'replace'
    ? TeamBattle.turnWithReplacement(sample,[a.target,b.target],pair,{blind:true})
    : TeamBattle.turn(sample,pair);
}
function value(game) {
  if(game.phase==='finished')return game.battle.winner==='draw'?0:game.battle.winner===1?10000:-10000;
  function team(side) {
    let sum=0;
    for(const [i,slot] of game.slots[side].entries()){
      const f=slot.fighter;
      if(f.hp<=0||f.soulState.vanished)continue;
      const hp=Math.min(1,f.hp/f.stats.maxHp);
      const pp=f.moves.reduce((v,key)=>v+Math.min(1,(f.pp[key]||0)/(f.teamPPDefinitions[key]?.pp||1)),0);
      sum+=100+44*hp+pp*1.5;
      sum+=16*Math.min(1,((f.suitState?.shield||0)+(f.suitState?.barrier||0))/f.stats.maxHp);
      const mars=f.soulState.spMars;
      if(mars)for(const [form,body] of Object.entries(mars.bodies)){
        if(form!==mars.lead)sum+=25*Math.min(1,body.hp/f.stats.maxHp);
      }
      if(i===game.active[side]){
        sum+=12*hp+2*Object.values(f.stages).reduce((x,y)=>x+y,0);
        if(BattleStatusRules.blocksAction(f,game.battle.round,game.battle.fighters[1-side]))sum-=26;
        if(mars?.firstSwiftUseAvailable)sum+=4;
        if(mars)sum+=Math.min(8,Object.values(mars.activeBonus).reduce((a,b)=>a+b,0)/50);
      }
    }
    return sum;
  }
  return team(1)-team(0);
}
// Only nominate resources actually produced by a legal root simulation.
// Timers, holder changes, PP locks and consumption are resolved by TeamBattle.
function moveFor(game,side,option) {
  const slot=game.slots[side][option.target??game.active[side]];
  const key=BattleEngine.SpMars.fifthForm(slot.fighter,option.key)?BattleEngine.SpMars.FIFTH_KEY:option.key;
  if(option.target!=null){
    const id=slot.config.moves.find(id=>'wiki:'+id===key);
    if(id!=null)return BattleEngine.WIKI.selectedMove(slot.config.snapshot,id);
  }
  return game.battle.moveDefinitions[key];
}
function hasAction(options,action) {
  return options.some(o=>o.target===action.target&&o.key===action.key);
}
function representativeReplies(game,legal) {
  const options=legal.map(action=>({action,move:moveFor(game,0,action)}));
  const attacks=options.filter(o=>['physical','special'].includes(o.move?.kind));
  const strongest=attacks.sort((x,y)=>y.move.power-x.move.power)[0];
  const fast=attacks.slice().sort((x,y)=>y.move.priority-x.move.priority)[0];
  const reserve=options.find(o=>o.action.key.startsWith('switch/')||o.action.target!==strongest?.action.target&&o.action.target!=null);
  const support=options.find(o=>o.move?.kind==='status');
  const potion=options.find(o=>o.action.key==='potion:hp');
  return [...new Set([strongest,reserve,support,potion,fast].filter(Boolean))].map(o=>o.action);
}
const defensiveUses=['opponentAttackInvalid1128','opponentStatusInvalid1827','nextAttackReductionUses'];
function protection(f,round) {
  const armor=f.effects['低威力攻击无效'];
  return defensiveUses.reduce((n,k)=>n+(f.counts[k]??0),0)+Number(!!armor&&armor.start<=round&&armor.end>=round);
}
function spentDefense(before,after){
  return defensiveUses.find(key=>before.counts[key]===1&&!(after.counts[key]>0));
}
function opportunity(game,row,next,beforeKeys,guarded,controlWindow) {
  if(next.phase==='finished'||next.active[1]!==game.active[1]||next.pending.includes(1))return null;
  const holder=next.battle.fighters[1];
  // The holder can still use the restored move against an incoming reserve.
  if(row.action.key==='potion:pp'){
    const keys=BattleEngine.availableMoves(holder,next.battle.round).filter(k=>
      !beforeKeys.has(k)&&holder.pp[k]>0&&(game.battle.fighters[1].pp[k]??1)===0);
    if(keys.length)return {kind:'pp',keys};
  }
  if(guarded&&next.phase==='action'&&game.active[0]===next.active[0]){
    const spent=spentDefense(game.battle.fighters[0],next.battle.fighters[0]);
    if(spent)return {kind:'break',spent};
  }
  if(controlWindow&&next.phase==='action'&&next.active[0]===game.active[0]){
    const round=next.battle.round,aura=holder.effects['攻击附加异常'];
    if(aura&&BattleStatusRules.isControl(aura.ailment)&&aura.start<=round&&aura.end>=round&&
       !BattleStatusRules.blocksAction(next.battle.fighters[0],round,holder))return {kind:'control',ailment:aura.ailment};
  }
  if(next.pending.includes(0)&&protection(holder,next.battle.round)>protection(game.battle.fighters[1],game.battle.round))
    return {kind:'guard'};
  return null;
}
// Compare paired continuations with the same reply and random sample. Limit the
// marginal bonus so an uncertain follow-up cannot outweigh a present win/loss.
function continuationGain(branch,control,plan,alternative,rng,remaining,count,focus=false,ailment=null) {
  if(!remaining())return null;
  const own=actions(branch,1),otherOwn=branch===control?own:actions(control,1);
  if(!hasAction(own,plan)||!hasAction(otherOwn,alternative))return null;
  // A random revival can change both the replacement target and what that
  // entrant can select. Sample representatives only from the common menu.
  const legal=actions(branch,0),otherReplies=branch===control?legal:actions(control,0);
  const common=branch===control?legal:legal.filter(o=>hasAction(otherReplies,o));
  let replies=representativeReplies(branch,common);
  if(focus&&replies.length>2){
    const escape=replies.find(o=>o.key.startsWith('switch/')||o.target!==replies[0].target);
    const heal=replies.find(o=>o.key==='potion:hp');
    replies=escape?[escape,replies[0]]:[...new Set([replies[0],heal??replies[1]])];
  }
  if(!replies.length)return null;
  const deltas=[];
  let observed=false;
  for(const reply of replies){
    if(!remaining()){
      if(!focus||!deltas.length)return null;
      break;
    }
    const seed=rng();
    const a=simulate(branch,reply,plan,seed),b=simulate(control,reply,alternative,seed);
    count(2);
    if(ailment&&BattleStatusRules.active(a.battle.fighters[0],ailment,a.battle.round)&&
       !BattleStatusRules.active(b.battle.fighters[0],ailment,b.battle.round))observed=true;
    const change=(value(a)-value(branch))-(value(b)-value(control));
    deltas.push(Math.max(-75,Math.min(75,change)));
  }
  if(ailment&&(!observed||deltas.length<replies.length))return null;
  const gain=.55*Math.min(...deltas)+.45*deltas.reduce((a,b)=>a+b,0)/deltas.length;
  return deltas.length===replies.length?gain:gain*deltas.length/replies.length;
}
function decide(game,seed,difficulty,emit,audit) {
  const start=performance.now(),practice=difficulty==='practice',hard=difficulty==='hard';
  const deadline=start+(practice?350:hard?2400:1100);
  const rootDeadline=hard&&game.battle.round<50?start+1100:deadline;
  let cursor=seed>>>0;
  function random(){cursor=(Math.imul(cursor,1664525)+1013904223)>>>0;return cursor;}
  function shuffle(items){
    for(let i=items.length-1;i>0;i--){const j=random()%(i+1);[items[i],items[j]]=[items[j],items[i]];}
    return items;
  }
  const ours=shuffle(actions(game,1,true)),opponents=shuffle(actions(game,0,true));
  const enemy=game.battle.fighters[0];
  const holder=game.battle.fighters[1];
  const publicPP=BattleEngine.SpMars.projectedBody(holder,game.battle.round)?.pp??holder.pp;
  const ppFor=o=>publicPP[BattleEngine.SpMars.fifthForm(holder,o.key)?BattleEngine.SpMars.FIFTH_KEY:o.key]??Infinity;
  const attacks=!practice&&!game.pending.includes(1)&&Object.values(publicPP).includes(1)?
    ours.filter(o=>['physical','special'].includes(moveFor(game,1,o)?.kind)):[];
  const lastUse=attacks.some(o=>ppFor(o)===1);
  const guarded=lastUse&&defensiveUses.some(key=>enemy.counts[key]===1);
  if(guarded){
    const attack=attacks.slice().sort((a,b)=>ppFor(b)-ppFor(a))[0];
    const preserve=ours.find(o=>o.key==='potion:hp');
    ours.splice(0,ours.length,...new Set([attack,preserve,...ours].filter(Boolean)));
  }else if(lastUse&&game.battle.round===50){
    // PP has no future opportunity cost at adjudication. Try a scarce attack
    // and a powerful attack before spending a short budget on duplicate items.
    const scarce=attacks.find(o=>ppFor(o)===1);
    const strong=attacks.sort((a,b)=>moveFor(game,1,b).power-moveFor(game,1,a).power)[0];
    ours.splice(0,ours.length,...new Set([scarce,strong,...ours]));
  }
  // Reserve an early sample for a possible finisher only while the root
  // has found no winning move against the current reply.
  let finisher=null;
  if(hard&&!lastUse&&game.phase==='action'&&enemy.hp<=enemy.stats.maxHp/2&&
     game.slots[0].filter(s=>s.fighter.hp>0&&!s.fighter.soulState.vanished).length===1){
    const attacks=ours.filter(o=>['physical','special'].includes(moveFor(game,1,o)?.kind));
    finisher=attacks.sort((a,b)=>moveFor(game,1,b).power-moveFor(game,1,a).power)[0];
  }
  if(hard&&!lastUse&&game.phase==='action'&&holder.hp<=holder.stats.maxHp/2&&
     enemy.lastAttackDamage>=holder.hp/3&&ours.some(o=>o.key.startsWith('switch/'))){
    const repeat=opponents.find(o=>o.key===enemy.previousMoveId&&
      ['physical','special'].includes(moveFor(game,0,o)?.kind));
    if(repeat){
      opponents.splice(opponents.indexOf(repeat),1);
      opponents.unshift(repeat);
      if(audit)audit.repeatedThreat=repeat.key;
    }
  }
  const round=game.battle.round;
  const expiringControl=hard&&!lastUse&&game.phase==='action'&&round<49&&
    !(holder.effects['攻击附加异常']?.end>=round+1)&&
    BattleStatusRules.blocksAction(enemy,round,holder)&&!BattleStatusRules.blocksAction(enemy,round+1,holder);
  const controlSetup=expiringControl&&ours.find(action=>moveFor(game,1,action)?.operations?.some(op=>
    op.effectId===470&&op.statusDeclarations?.some(status=>BattleStatusRules.isControl(status.name))));
  const controlWindow=Boolean(controlSetup);
  if(controlWindow){
    const attacks=ours.filter(action=>['physical','special'].includes(moveFor(game,1,action)?.kind));
    const strongest=attacks.sort((a,b)=>moveFor(game,1,b).power-moveFor(game,1,a).power)[0];
    ours.splice(0,ours.length,...new Set([strongest,controlSetup,...ours].filter(Boolean)));
  }
  if(hard&&!guarded&&game.phase==='action'&&game.battle.round<50&&enemy.hp>enemy.stats.maxHp/2&&
     !BattleStatusRules.blocksAction(enemy,game.battle.round,holder)){
    const disruption=opponents.find(option=>{
      const move=moveFor(game,0,option);
      if(!move||!enemy.soulState.skillUses?.[move.id])return false;
      const amount=move.operations?.find(op=>op.effectId===700)?.params[0];
      return amount>0&&ours.some(action=>{
        if(ppFor(action)>amount)return false;
        const skill=moveFor(game,1,action);
        return skill&&(move.priority>skill.priority||move.priority===skill.priority&&
          BattleEngine.effective(enemy,'spe')>=BattleEngine.effective(holder,'spe'));
      });
    });
    if(disruption){
      const amount=moveFor(game,0,disruption).operations.find(op=>op.effectId===700).params[0];
      const durable=ours.filter(option=>ppFor(option)>amount&&['physical','special'].includes(moveFor(game,1,option)?.kind))
        .sort((a,b)=>moveFor(game,1,b).power-moveFor(game,1,a).power)[0];
      opponents.splice(opponents.indexOf(disruption),1);
      opponents.unshift(disruption);
      if(durable)ours.splice(0,ours.length,...new Set([durable,...ours]));
      if(audit)audit.ppThreat=disruption.key;
    }
  }
  if(difficulty==='standard'&&!lastUse&&!game.pending.includes(0)&&
     (!game.pending.includes(1)||TeamBattle.candidates(game,1,true).length===1)&&
     Object.values(enemy.stages).filter(n=>n>0).length>=2){
    const steals=ours.filter(a=>{
      const move=moveFor(game,1,a);
      return move?.priority>0&&(move.effectIds?.includes(978)||move.operations?.some(op=>op.effectId===978));
    });
    if(steals.length){
      const attack=o=>['physical','special'].includes(moveFor(game,0,o)?.kind);
      // In a final one-on-one, support can decide the entire game. Keep that
      // original reply in the comparison while making the reversal available.
      const finalDuel=game.slots.every(t=>t.filter(z=>z.fighter.hp>0&&!z.fighter.soulState.vanished).length===1);
      const threat=finalDuel||attack(opponents[0])?opponents[0]:
        opponents.find(o=>o.key===enemy.previousMoveId&&attack(o))??representativeReplies(game,opponents.filter(attack))[0];
      if(threat){
        opponents.splice(opponents.indexOf(threat),1);
        opponents.unshift(threat);
        ours.splice(0,ours.length,...new Set([...steals,...ours]));
        if(audit)audit.stageSteal=steals.map(o=>o.key);
      }
    }
  }
  // Before an unusually long first simulation, test a cheaper legal action
  // against the same reply so the host can still use a completed result.
  let fallbackPair=null;
  if(difficulty==='standard'){
    const longMove=(side,o)=>{
      const move=moveFor(game,side,o);
      return move?.effectInstances?.some(e=>e.id===2268&&e.args?.[0]>=90)||
        move?.operations?.some(e=>e.effectId===2268&&e.params?.[0]>=90);
    };
    const cheapAction=(side,options,first)=>{
      const same=options.filter(o=>o.target===first.target&&!longMove(side,o));
      return same.find(o=>['physical','special','status'].includes(moveFor(game,side,o)?.kind))??
        same.find(o=>o.key==='potion:hp')??same[0];
    };
    const first=ours[0],reply=opponents[0];
    const slowOwn=longMove(1,first),slowFoe=longMove(0,reply);
    if(slowOwn||slowFoe){
      const entrant=game.slots[1][first.target??game.active[1]].fighter;
      const heal=slowOwn&&entrant.hp<entrant.stats.maxHp/2?
        ours.find(o=>o.target===first.target&&o.key==='potion:hp'):null;
      const own=slowOwn?(heal??cheapAction(1,ours,first)):first;
      const other=slowFoe?cheapAction(0,opponents,reply):reply;
      if(own&&other){
        fallbackPair=[other,own];
        if(audit)audit.fallbackPair=fallbackPair.map(o=>({key:o.key,target:o.target}));
      }
    }
  }
  const beforeKeys=new Set(BattleEngine.availableMoves(game.battle.fighters[1],game.battle.round));
  const tactical=!practice;
  let hasOpportunity=false,followSamples=0;
  const rows=ours.map(action=>({action,total:0,worst:Infinity,n:0,branch:null,hits:0,bonus:0,healthMargin:0}));
  let samples=0,deepSamples=0,allTerminalDefeats=true;
  function score(row){return practice?row.total/row.n:.68*row.total/row.n+.32*row.worst;}
  const limitTurn=hard&&game.battle.round===50;
  const countMargin=limitTurn?BattleEngine.victoryPopulation50(game.battle,1).total-
    BattleEngine.victoryPopulation50(game.battle,0).total:0;
  const protectingLead=limitTurn&&countMargin>0,tiedLimit=limitTurn&&countMargin===0;
  const health=slots=>slots.reduce((sum,{fighter})=>{
    return fighter.soulState.vanished?sum:sum+Math.max(0,fighter.hp)/fighter.stats.maxHp;
  },0);
  // The referee decides the outcome. Health only distinguishes actions
  // that have won every sampled reply while protecting a counted lead.
  const ranked=()=>rows.filter(r=>r.n).sort((x,y)=>score(y)-score(x)||
    (protectingLead&&x.branch?.battle.winner===1&&y.branch?.battle.winner===1?y.healthMargin/y.n-x.healthMargin/x.n:0));
  function report(action){emit(action,samples,deepSamples);return action;}
  let exposedReserve=null,activeAttack=null;
  if(tiedLimit&&game.phase==='action'){
    const fraction=option=>{
      const f=game.slots[0][Number(option.key.slice(7))].fighter;
      return f.hp/f.stats.maxHp;
    };
    exposedReserve=opponents.filter(o=>o.key.startsWith('switch/')&&
      fraction(o)<=.5&&fraction(o)<enemy.hp/enemy.stats.maxHp).sort((a,b)=>fraction(a)-fraction(b))[0];
    if(exposedReserve){
      const attacks=opponents.filter(o=>['physical','special'].includes(moveFor(game,0,o)?.kind));
      activeAttack=representativeReplies(game,attacks)[0];
      if(activeAttack){
        opponents.splice(opponents.indexOf(activeAttack),1);
        opponents.unshift(activeAttack);
      }
    }
  }
  let provisionalScore=-Infinity;
  rootSearch: for(let pass=0;pass<Math.min(practice?2:8,opponents.length*2);pass++){
    let attackingCheck=null,order=rows;
    if(pass===1&&activeAttack&&rows.every(row=>row.n&&row.worst<=0)&&rows.some(row=>row.worst===0)){
      opponents.splice(opponents.indexOf(exposedReserve),1);
      opponents.splice(1,0,exposedReserve);
      attackingCheck=activeAttack;
      // Check moves that actually preserved the draw against the active attacker.
      // A direct hit on the active foe can also threaten its injured reserve.
      const damage=row=>enemy.hp-row.branch.slots[0][game.active[0]].fighter.hp;
      order=rows.slice().sort((a,b)=>b.worst-a.worst||damage(b)-damage(a));
    }
    const reply=opponents[pass%opponents.length],sampleSeed=random();
    let fallbackState=null;
    if(pass===0&&fallbackPair){
      // Keep this first completed action available to the host. The root
      // still evaluates its original opposing attack with the same draw.
      fallbackState=simulate(game,fallbackPair[0],fallbackPair[1],sampleSeed);
      samples++;report(fallbackPair[1]);
      if(performance.now()>=rootDeadline)return fallbackPair[1];
    }
    const frame={reply,states:new Map()};
    for(let index=0;index<rows.length;index++){
      if(finisher&&pass===0&&index===2&&!rows.slice(0,index).some(r=>
        r.branch?.phase==='finished'&&r.branch.battle.winner===1)){
        const at=rows.findIndex(r=>r.action===finisher);
        if(at>index){
          const [candidate]=rows.splice(at,1);
          rows.splice(index,0,candidate);
        }
      }
      const row=order[index];
      const reuse=fallbackState&&reply===fallbackPair[0]&&row.action===fallbackPair[1];
      const next=reuse?fallbackState:simulate(game,reply,row.action,sampleSeed),result=value(next);
      if(next.phase!=='finished'||next.battle.winner!==0)allTerminalDefeats=false;
      if(result<row.worst){row.worst=result;if(hard)row.branch=next;}
      if(protectingLead)row.healthMargin+=health(next.slots[1])-health(next.slots[0]);
      row.total+=result;row.n++;if(!reuse)samples++;
      if(attackingCheck&&next.phase==='finished'&&next.battle.winner===1){
        if(performance.now()>=rootDeadline){
          // A win against a voluntary switch still needs its second active-attack draw.
          row.total-=result;row.n--;
          break rootSearch;
        }
        const counter=simulate(game,attackingCheck,row.action,(sampleSeed^0x8a921797)>>>0);
        const counterScore=value(counter);
        row.total+=counterScore;row.n++;samples++;
        if(counterScore<row.worst){row.worst=counterScore;row.branch=counter;}
      }

      if(tactical){
        if(row.action.key==='potion:pp'&&(next.pending.includes(1)||next.active[1]!==game.active[1]||
          next.phase==='finished'&&next.battle.winner===0))row.unsafeRestore=true;
        const hint=opportunity(game,row,next,beforeKeys,guarded,controlWindow);
        if(hint){
          hasOpportunity=true;row.hits++;
          if(!row.hint||reply.key.startsWith('switch/')&&!row.frame.reply.key.startsWith('switch/')){
            row.hint=hint;row.frame=frame;
          }
        }
        if(hint||(guarded||controlWindow)&&next.phase==='action'||next.phase==='replace'&&next.pending.includes(0))frame.states.set(row,next);
      }
      // A single multihit turn can outlast the host's deadline. Publish the
      // best completed comparison before starting another synchronous turn.
      const improved=difficulty==='standard'&&pass===0&&!row.unsafeRestore&&result>provisionalScore;
      if(improved)provisionalScore=result;
      if(samples===1||improved)report(row.action);
      const limit=hasOpportunity?rootDeadline-(guarded?560:320):rootDeadline;
      if(performance.now()>=limit){
        // A still-legal untested action may escape the very reply that
        // defeats every sampled action. Finish that comparison first.
        if(hard&&!hasOpportunity&&pass===0&&allTerminalDefeats&&index+1<rows.length&&performance.now()<deadline-12)continue;
        break rootSearch;
      }
    }
    report(ranked()[0].action);
  }
  const finalists=ranked(),best=finalists[0];
  if(practice){
    const close=finalists.filter(row=>score(row)>=score(best)-5);
    return report(close[random()%close.length].action);
  }
  // A terminal loss has no next ply. Use the unused hard budget to find
  // a different legal reply under which at least one choice can survive.
  if(hard&&!hasOpportunity&&allTerminalDefeats&&finalists.length===rows.length){
    const probe=rows.find(r=>r.action.key==='potion:hp')??best;
    const kind=o=>moveFor(game,0,o)?.kind;
    const damage=o=>['physical','special'].includes(kind(o));
    const tested=Math.max(...rows.map(r=>r.n));
    const rest=opponents.slice(tested);
    const attacking=rest.find(damage),status=rest.find(o=>kind(o)==='status');
    const replies=[...new Set([damage(opponents[0])?status:attacking,damage(opponents[0])?attacking:status,...rest].filter(Boolean))];
    const options=rows.filter(r=>r!==probe);
    const support=options.find(r=>moveFor(game,1,r.action)?.kind==='status');
    const attack=options.find(r=>['physical','special'].includes(moveFor(game,1,r.action)?.kind));
    const plans=[...new Set([support,attack,...options].filter(Boolean))];
    if(audit)audit.lossReview={reply:opponents[0].key,tried:0};
    for(const reply of replies){
      if(performance.now()>=deadline-12)break;
      const draw=random(),first=simulate(game,reply,probe.action,draw);
      samples++;
      if(audit)audit.lossReview.tried++;
      if(first.phase==='finished'&&first.battle.winner===0)continue;
      if(performance.now()>=deadline-12)break;
      const incumbent=probe===best?first:simulate(game,reply,best.action,draw);
      if(probe!==best)samples++;
      const terminalRank=state=>state.phase!=='finished'||state.battle.winner==='draw'?1:state.battle.winner===1?2:0;
      const standing=terminalRank(incumbent);
      let choice=best,highest=value(incumbent);
      function consider(row,state){
        const rank=terminalRank(state),result=value(state);
        if(rank>standing&&result>highest){choice=row;highest=result;report(row.action);}
      }
      consider(probe,first);
      for(const row of plans){
        if(performance.now()>=deadline-12)break;
        if(row===best)continue;
        const state=simulate(game,reply,row.action,draw);
        samples++;
        consider(row,state);
      }
      return report(choice.action);
    }
    return report(best.action);
  }
  if(tactical&&hasOpportunity){
    // Paired probes have their own stream. A zero-gain probe must not change
    // the replies or rolls used to compare the original shortlist.
    let probeCursor=(seed^0x9e3779b9)>>>0;
    const probeRandom=()=>probeCursor=(Math.imul(probeCursor,1664525)+1013904223)>>>0;
    const remaining=()=>performance.now()<deadline-12&&followSamples<40;
    const count=n=>{samples+=n;followSamples+=n;};
    for(const row of finalists.filter(r=>r.hint&&!r.unsafeRestore)){
      const frame=row.frame,next=frame.states.get(row);
      let gain=0;
      if(row.hint.kind==='pp'){
        const options=actions(next,1);
        const restored=options.filter(o=>row.hint.keys.includes(BattleEngine.SpMars.fifthForm(next.battle.fighters[1],o.key)?BattleEngine.SpMars.FIFTH_KEY:o.key));
        const existing=options.filter(o=>beforeKeys.has(o.key));
        const alternative=existing.find(o=>o.key===best.action.key&&moveFor(next,1,o)?.power>0)
          ??existing.sort((a,b)=>(moveFor(next,1,b)?.power??0)-(moveFor(next,1,a)?.power??0))[0];
        if(alternative)for(const plan of restored){
          const delta=continuationGain(next,next,plan,alternative,probeRandom,remaining,count);
          if(delta==null)break;
          if(delta>gain){gain=delta;row.follow=plan;}
        }
      }else if(row.hint.kind==='control'){
        const control=finalists.map(r=>frame.states.get(r)).find(state=>state?.phase==='action'&&
          state.active.every((v,i)=>v===next.active[i])&&
          !(state.battle.fighters[1].effects['攻击附加异常']?.end>=state.battle.round));
        if(control){
          const mutual=actions(control,1);
          const attacks=actions(next,1).filter(o=>hasAction(mutual,o)&&
            ['physical','special'].includes(moveFor(next,1,o)?.kind));
          const strong=attacks.sort((a,b)=>moveFor(next,1,b).power-moveFor(next,1,a).power)[0];
          if(strong){
            gain=continuationGain(next,control,strong,strong,probeRandom,remaining,count,true,row.hint.ailment)??0;
            if(gain>0)row.follow=strong;
          }
        }
      }else if(row.hint.kind==='break'){
        const control=finalists.map(r=>frame.states.get(r)).find(other=>other?.phase==='action'&&
          other.active.every((v,i)=>v===next.active[i])&&other.battle.fighters[0].counts[row.hint.spent]>0);
        if(control){
          const shared=actions(control,1);
          const attacks=actions(next,1).filter(o=>hasAction(shared,o)&&
            ['physical','special'].includes(moveFor(next,1,o)?.kind));
          // Give scarce usable attacks the first paired sample. Rarity only
          // orders the trials; the engine outcome determines their merit.
          const f=next.battle.fighters[1];
          attacks.sort((a,b)=>(f.pp[a.key]??Infinity)-(f.pp[b.key]??Infinity));
          for(const plan of attacks.slice(0,3)){
            const delta=continuationGain(next,control,plan,plan,probeRandom,remaining,count,true);
            if(delta==null)break;
            if(delta>gain){gain=delta;row.follow=plan;}
          }
        }
      }else{
        const control=finalists.map(r=>frame.states.get(r)).find(other=>other?.phase==='replace'&&
          other.pending.includes(0)&&!other.pending.includes(1)&&other.active.every((v,i)=>v===next.active[i])&&
          protection(other.battle.fighters[1],other.battle.round)<protection(next.battle.fighters[1],next.battle.round));
        if(control){
          const plan=actions(next,1).find(o=>o.key==='potion:pp');
          if(plan){
            gain=continuationGain(next,control,plan,plan,probeRandom,remaining,count)??0;
            const own=actions(next,1),saved=actions(control,1).find(o=>o.key===row.action.key);
            if(saved&&!own.some(o=>o.key===saved.key)){
              const alternative=own.sort((x,y)=>(moveFor(next,1,y)?.power??0)-(moveFor(next,1,x)?.power??0))[0];
              const spend=continuationGain(next,control,alternative,saved,probeRandom,remaining,count);
              gain=Math.min(gain,spend??0);
            }
          }
        }
      }
      row.bonus=Math.max(0,gain)*row.hits/row.n;
    }
    if(!hard)return report(finalists.reduce((x,y)=>score(x)+x.bonus>=score(y)+y.bonus?x:y).action);
  }
  if(!hard)return report(best.action);
  // Reconsider the leading choices after the strongest sampled reply to each.
  // Keep a move and a switch (or distinct reserve) available at the next ply.
  function continuations(state,side){
    const options=shuffle(actions(state,side));
    const skillPower=o=>{
      const f=state.slots[side][o.target??state.active[side]].fighter;
      const key=BattleEngine.SpMars.fifthForm(f,o.key)?BattleEngine.SpMars.FIFTH_KEY:o.key;
      return state.battle.moveDefinitions[key]?.power??0;
    };
    const skills=options.filter(o=>!o.key.startsWith('switch/')&&!o.key.startsWith('potion:'));
    const first=skills.sort((a,b)=>skillPower(b)-skillPower(a))[0]??options[0];
    const reserve=options.find(o=>o.target!==first.target||o.key.startsWith('switch/')&&o!==first);
    return [...new Set([first,reserve,options.find(o=>o!==first&&o!==reserve)].filter(Boolean))];
  }
  // Two root leaders always survive. Reserve at most one additional seat per
  // demonstrated mechanism and keep the ordinary third seat when there is room.
  const adjusted=row=>score(row)+row.bonus;
  const byGain=finalists.filter(r=>r.bonus>0).sort((x,y)=>adjusted(y)-adjusted(x));
  const leaders=new Set(finalists.slice(0,2));
  for(const kind of ['pp','guard','break','control']){
    if(leaders.size>=4)break;
    const candidate=byGain.find(r=>r.hint.kind===kind);
    if(candidate)leaders.add(candidate);
  }
  for(const row of finalists){if(leaders.size>=3)break;leaders.add(row);}
  const shortlist=[...leaders].sort((x,y)=>adjusted(y)-adjusted(x));
  let selected=shortlist[0],highest=-Infinity;
  if(audit)audit.root=finalists.map((r,i)=>({key:r.action.key,target:r.action.target,rank:i+1,score:score(r),gain:r.bonus}));
  // When a resource route challenges the leaders, compare equivalent action
  // lists with common draws; independent replies per row can hide a small guard.
  const comparisonSeed=cursor;
  for(const row of shortlist){
    if(byGain.length)cursor=comparisonSeed;
    const next=row.branch;
    let future=value(next);
    const detail=audit&&{action:row.action,rank:finalists.indexOf(row)+1,deep:0,complete:false};
    if(detail)audit.reviewed.push(detail);
    if(next.phase!=='finished'){
      future=-Infinity;
      const replies=continuations(next,0),plans=continuations(next,1);
      const unlocked=row.follow&&actions(next,1).find(o=>o.key===row.follow.key&&o.target===row.follow.target);
      if(unlocked&&!plans.some(p=>p.key===unlocked.key&&p.target===unlocked.target))plans.splice(0,1,unlocked);
      for(const plan of plans){
        let worst=Infinity;
        for(const reply of replies){
          if(performance.now()>=deadline)return report(selected.action);
          worst=Math.min(worst,value(simulate(next,reply,plan,random())));
          samples++;deepSamples++;if(detail)detail.deep++;
        }
        future=Math.max(future,worst);
      }
    }
    const combined=.55*adjusted(row)+.45*future;
    if(detail){detail.complete=true;detail.combined=combined;}
    if(combined>highest){highest=combined;selected=row;}
    report(selected.action);
  }
  return report(selected.action);
}
self.onmessage=({data})=>{
  try{
    if(data.scripts){importScripts(...data.scripts);return;}
    const start=performance.now();
    let count=0,depthCount=0;
    const audit=data.audit?{reviewed:[]}:null;
    const action=decide(data.game,data.seed,data.difficulty,(action,samples,deepSamples)=>{
      count=samples;depthCount=deepSamples;postMessage({action,samples,elapsed:performance.now()-start});
    },audit);
    postMessage({...(audit?{audit}:{}),done:true,action,samples:count,deepSamples:depthCount,elapsed:performance.now()-start});
  }catch(error){postMessage({error:error.message});}
};
