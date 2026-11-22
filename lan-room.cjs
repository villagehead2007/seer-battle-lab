'use strict';
const {randomBytes}=require('node:crypto');
const E=require('./dist/engine.js');
const T=require('./dist/team-engine.js');
const P=require('./dist/battle-presentation.js');
const D=require('./dist/battle-display.js');
const local=require('./local-species.cjs');
const token=()=>randomBytes(24).toString('hex');
function requireThat(ok,message){if(!ok)throw Error(message);}
function member(input){
  let snapshot=local.species(input.id);
  if(input.soul!=null){
    requireThat(snapshot.souls.some(s=>s.id===input.soul),'魂印版本无效');
    snapshot.selectedSoulId=input.soul;
  }
  if(input.version!=null){
    requireThat(snapshot.skillVersions?.some(v=>v.id===input.version && (v.soulId==null||v.soulId===(snapshot.selectedSoulId??snapshot.souls.at(-1)?.id))),'技能版本无效');
    if(snapshot.trainingCompatibility)snapshot=E.WIKI.versionSnapshots(snapshot).find(v=>v.selectedSkillVersion===input.version);
    snapshot.selectedSkillVersion=input.version;
  }
  const moves=input.moves;
  requireThat(Array.isArray(moves)&&moves.length<=5&&new Set(moves).size===moves.length,'配招无效');
  const check=E.WIKI.assess(snapshot,moves);
  requireThat(check.supported,check.issues.join('；'));
  E.WIKI.prepare([snapshot,snapshot],[moves,moves]);
  const {build}=E.calculateStats(E.WIKI.profileFor(snapshot).key,input.build??{});
  return {snapshot,moves,build};
}
function panelFor(game,side,target=null){
  const targets=[null,null];targets[side]=target;
  const view=T.projectReplacement(game,targets),f=view.battle.fighters[side];
  const slot=view.slots[side][view.active[side]],config=slot.config;
  const visibleSnapshots=view.active.map((index,i)=>view.slots[i][index].config.snapshot);
  const display=D.fighter(f,game.battle.round,game.battle.moveDefinitions,game.battle);
  const head=P.teamHead(game,view,side,target!==null,display,D.team(game,side),visibleSnapshots);
  const pp=E.SpMars.projectedBody(f,game.battle.round)?.pp??f.pp;
  const legal=E.availableMoves(f,game.battle.round);
  const skills=[...new Set([...f.moves,...legal.filter(k=>!k.startsWith('potion:')&&k!=='team:switch')])].flatMap(key=>{
    const selection=config.moves.find(id=>'wiki:'+id===key);
    const raw=selection!=null?E.WIKI.selectedMove(config.snapshot,selection):null;
    const move=raw??view.battle.moveDefinitions[key];if(!move)return [];
    const forms=E.SpMars.owns(f)&&key===E.SpMars.FIFTH_KEY?E.SpMars.legalForms(f).map(form=>({
      key:E.SpMars.choiceKey(form),form,label:E.SpMars.LABELS[form],detail:P.moveDetails(config.snapshot,key,move,form)})):[];
    return [{key,name:move.selectionName??move.name,kind:move.kind,pp:move.pp,current:pp[key],forms,
      detail:P.moveDetails(config.snapshot,key,move),reason:legal.includes(key)?'':pp[key]===0?'PP 已耗尽':'当前不可用'}];
  });
  return {head,skills};
}
function createRoom(){
  const invites=[token(),token()],sessions=[null,null],teams=[[],[]],leads=[0,0],ready=[false,false];
  let game=null,matchId=0,epoch=0,locks=[null,null];
  const edits=[0,0];
  const presentations=new WeakMap();
  function options(side){
    const targets=game.pending.includes(side)?T.candidates(game,side,true):[null];
    return targets.map(target=>({target,name:target==null?'':game.slots[side][target].fighter.name,actions:T.choicesFor(game,side,target)}));
  }
  function presentation(side){
    if(!presentations.has(game))presentations.set(game,{panels:[0,1].map(i=>panelFor(game,i)),previews:[{},{}]});
    const data=presentations.get(game),previews=data.previews[side];
    if(game.pending.includes(side))for(const index of T.candidates(game,side,true)){
      previews[index]??=panelFor(game,side,index);
    }
    return {panels:data.panels.map((p,i)=>i===side?p:{head:p.head}),previews,historyDetails:game.historyDetails};
  }
  function stamp(side){return [side,epoch,edits[side],...ready,...sessions.map(Boolean),...locks.map(Boolean)].join('-');}
  function view(side){
    const base={side,matchId,epoch,edit:edits[side],ready,joined:sessions.map(Boolean),locked:locks.map(Boolean)};
    if(!game)return {...base,team:teams[side].map(m=>({id:m.snapshot.id,name:m.snapshot.name,moves:m.moves.map(id=>{const move=E.WIKI.selectedMove(m.snapshot,id);return move.selectionName??move.name;})})),lead:leads[side]};
    const battle=game.battle;
    return {...base,...presentation(side),ownTarget:locks[side]?.target??null,phase:game.phase,round:battle.round,challengedSide:battle.challengedSide,winner:battle.winner,finishReason:game.finishReason??null,history:game.history,
      ownLock:locks[side]?.label??null,
      bench:game.slots[side].flatMap(({fighter:f},index)=>index===game.active[side]?[]:[{index,name:f.name,hp:f.hp,maxHp:f.stats.maxHp,affinity:P.affinity(f,battle.fighters[1-side],battle)}]),
      fighters:battle.fighters.map((f,i)=>{
        const display=D.fighter(f,battle.round,battle.moveDefinitions,battle);
        return {name:f.name,hp:f.hp,maxHp:f.stats.maxHp,stages:f.stages,effects:E.describeEffects(f,battle.round),
          bodies:[...(display.group?.members??[]),...display.companions],
          resources:[...display.items,...D.team(game,i)].map(x=>x.name+' · '+x.value)};
      }),
      options:game.phase==='finished'||locks[side]?[]:options(side)};
  }
  // The lobby owns the opening configurations. TeamBattle.create copies them before play.
  function startMatch(){
    game=T.create(teams,leads,{seed:token(),criticals:true});
    matchId++;
    locks=[null,null];
  }
  function mutate(side,data){
    requireThat(!Object.hasOwn(data,'side'),'席位由会话确定');
    if(data.matchId!==undefined)requireThat(data.matchId===matchId,'对局已更新');
    if(['surrender','rematch','lobby'].includes(data.op)){
      requireThat(game&&data.matchId===matchId&&data.epoch===epoch,'对局已更新');
      if(data.op==='surrender'){
        requireThat(game.phase!=='finished'&&game.battle.round>=11,'第 11 回合起可在对战中投降');
        const winner=1-side,reason='AB'[side]+' 方投降';
        game={...game,phase:'finished',pending:[],finishReason:reason,
          battle:{...game.battle,finished:true,winner},
          history:[...game.history,'第 '+game.battle.round+' 回合 · '+reason+'，'+'AB'[winner]+' 方获胜。']};
      }else{
        requireThat(side===0&&game.phase==='finished','仅房主可在终局后选择');
        if(data.op==='rematch')startMatch();
        else{
          game=null;ready.fill(false);
          for(const i of [0,1])edits[i]++;
        }
      }
      // Never reuse a turn ticket, including across replacement windows and matches.
      locks=[null,null];epoch++;
      return;
    }
    if(data.op==='lock'){
      requireThat(game&&game.phase!=='finished'&&data.matchId===matchId&&data.epoch===epoch&&!locks[side],'行动已锁定或回合已更新');
      const group=options(side).find(row=>row.target===data.target);
      const selected=group?.actions.find(action=>action.key===data.key);
      requireThat(selected,'当前不能执行该行动');
      const choice=data.key.startsWith('switch/')?{switchTo:Number(data.key.slice(7))}:data.key==='pass'?null:data.key;
      const next=locks.slice();next[side]={target:data.target,choice,label:[group.name,selected.name].filter(Boolean).join(' · ')};
      if(next.every(Boolean)){
        const actions=next.map(row=>row.choice);
        game=game.phase==='replace'?T.turnWithReplacement(game,next.map(row=>row.target),actions,{blind:true}):T.turn(game,actions);
        locks=[null,null];epoch++;
      }else locks=next;
      return;
    }
    requireThat(!game&&!ready[side]&&edits[side]===data.edit,'队伍已锁定或已更新');
    const team=teams[side];
    if(data.op==='add'){
      requireThat(Number.isSafeInteger(data.member?.id),'精灵编号无效');
      requireThat(team.length<6&&!team.some(m=>m.snapshot.id===data.member.id),'队伍已满或编号重复');
      team.push(member(data.member));
    }else if(data.op==='lead'||data.op==='remove'){
      requireThat(Number.isInteger(data.index)&&!!team[data.index],'成员无效');
      if(data.op==='lead')leads[side]=data.index;
      else{team.splice(data.index,1);if(leads[side]===data.index)leads[side]=0;else if(leads[side]>data.index)leads[side]--;}
    }else if(data.op==='ready'){
      requireThat(team.length,'请先添加队员');
      if(ready[1-side])startMatch();
      ready[side]=true;
    }else throw Error('未知操作');
    edits[side]++;
  }
  return {invites,claim(invite,session){
    const side=invites.indexOf(invite);
    requireThat(side>=0&&typeof session==='string'&&/^[a-f0-9]{48}$/.test(session)&&(!sessions[side]||sessions[side]===session)&&sessions[1-side]!==session,'邀请已使用或无效');
    sessions[side]=session;
  },seat(session){return session?sessions.indexOf(session):-1;},stamp,view,mutate};
}
module.exports={createRoom};
