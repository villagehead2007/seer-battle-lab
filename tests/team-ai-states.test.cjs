'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js');
const local=require('../local-species.cjs');
function member(id){
  const snapshot=local.species(id);
  return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:1900}}};
}
const program=fs.readFileSync(require.resolve('../dist/team-ai-worker.js'),'utf8');
function run(game,difficulty,clock=performance,{seed=1729,team=T}={}){
  const messages=[];
  const realm=vm.createContext({self:{},TeamBattle:team,BattleEngine:E,BattleStatusRules:require('../dist/status-rules.js'),
    postMessage:message=>messages.push(message),performance:clock});
  vm.runInContext(program,realm);
  const snapshot=structuredClone(game);
  realm.self.onmessage({data:{game:snapshot,seed,difficulty,audit:true}});
  const result=messages.at(-1);
  assert.ok(result.done,result.error);assert.ok(result.samples>0);
  assert.deepEqual(snapshot,game);
  return result;
}
const keyToChoice=key=>key.startsWith('switch/')?{switchTo:Number(key.slice(7))}:key;
test('受控、耗尽PP、第五形态、换宠限制和强制空过都经同一引擎完成',()=>{
  for(const mode of ['PP','control','fifth','forced']){
    const game=T.create([[member(2988),member(3010)],[member(mode==='fifth'?20001:3056),member(2987)]],[0,0],{seed:mode});
    const f=game.battle.fighters[1];
    if(mode==='PP'){for(const key of f.moves)f.pp[key]=0;game.battle.teamExile1246=[null,{positions:[1]}];}
    if(mode==='control')f.ailments['麻痹']=3;
    if(mode==='forced')game.battle.teamDrivenAction1061=[null,{round:1}];
    const keys=T.choicesFor(game,1,null).map(o=>o.key);
    if(mode==='PP')assert.deepEqual(keys,['struggle','potion:hp','potion:pp']);
    if(mode==='fifth'){
      for(const form of E.SpMars.legalForms(f)){
        const key=E.SpMars.choiceKey(form);assert.ok(keys.includes(key));
        assert.equal(T.turn(game,['potion:pp',key]).battle.turns.length,1);
      }
    }
    const {action}=run(game,'standard');
    assert.ok(keys.includes(action.key));assert.equal(T.turn(game,['potion:pp',keyToChoice(action.key)]).battle.turns.length,1);
  }
});
test('双方阵亡时分别盲选补位和动作，可结算任一方的不同选择',()=>{
  const team=[2988,3056,3010].map(member);
  const game=T.create([team,team],[0,0],{seed:'blind'});
  game.phase='replace';game.pending=[0,1];game.battle.fighters.forEach(f=>f.hp=0);
  const result=run(game,'hard'),b=result.action;
  assert.ok([1,2].includes(b.target));assert.ok(T.choicesFor(game,1,b.target).some(o=>o.key===b.key));
  for(const target of [1,2]){
    const selected=T.choicesFor(game,0,target)[0].key;
    const after=T.turnWithReplacement(game,[target,b.target],[keyToChoice(selected),keyToChoice(b.key)],{blind:true});
    assert.equal(after.battle.turns.length,1);
  }
  assert.ok(result.deepSamples>0);
});

test('预算在第一个样本后用完时返回已推演的合法行动',()=>{
  const team=[2988,3010].map(member);
  const game=T.create([team,team],[0,0],{seed:'deadline'});
  let time=0;
  for(const difficulty of ['practice','standard','hard']){
    const result=run(game,difficulty,{now:()=>time+=3000});
    assert.equal(result.samples,1);
    assert.ok(T.choicesFor(game,1,null).some(o=>o.key===result.action.key));
    assert.equal(T.turn(game,['potion:pp',keyToChoice(result.action.key)]).battle.turns.length,1);
  }
});

test('补回的斩杀与等价击杀后的持盔收益进入有界续算',()=>{
  const make=(id,overrides,moves)=>({...member(id),build:{overrides},moves});
  const bird=(overrides)=>make(2988,overrides,[19123,10018,20001,10022,20154]);
  const options={seed:'qa-22',criticals:false};
  const pp=T.create([[bird({maxHp:265,def:900,spd:900,atk:80,spa:80,spe:180})],
    [make(3056,{maxHp:1500,atk:65,spe:800},[19369,19368,10127,20117,20307])]], [0,0],options);
  pp.battle.fighters[1].pp['wiki:19368']=0;
  pp.battle.fighters[1].stages.acc=6;
  const reserve=member(3010);
  reserve.build.overrides={maxHp:1700,spe:650,spa:800};
  const guard=T.create([[bird({maxHp:420,def:150,spe:150}),reserve],
    [make(3577,{maxHp:1600,atk:800,spe:600},[31847,10361,10363,10362,10364])]], [0,0],options);
  guard.battle.teamExile1246=[{positions:[1]},null];
  guard.battle.fighters[0].hp=40;
  // A fixed clock removes machine-load variability from policy assertions.
  for(const [g,key] of [[pp,'potion:pp'],[guard,'wiki:31847']]){
    for(const difficulty of ['standard','hard']){
      const result=run(g,difficulty,{now:()=>0});
      assert.equal(result.action.key,key);
      if(difficulty==='hard')assert.ok(result.audit.reviewed.some(r=>r.action.key===key&&r.complete&&r.deep>0));
    }
  }
});

test('配对试算按补位者、技能与换入目标同时校验两条实际分支',()=>{
  const team=[2988,20001,3010,3056].map(member);
  const g=T.create([team,team],[0,0],{seed:'branch-legality'});
  g.phase='replace';g.pending=[0,1];g.battle.fighters.forEach(f=>f.hp=0);
  const other=structuredClone(g);
  g.slots[0][2].fighter.hp=0;other.slots[0][3].fighter.hp=0;
  const entrant=other.slots[0][1].fighter;
  for(const k of entrant.moves)entrant.pp[k]=0;
  const guard=vm.createContext({self:{},TeamBattle:T,BattleEngine:E,
    BattleStatusRules:require('../dist/status-rules.js'),performance});
  vm.runInContext(program,guard);
  const potion={target:1,key:'potion:pp'};
  let samples=0;
  const gain=(plan,alternative)=>guard.continuationGain(g,other,plan,alternative,()=>17,()=>true,n=>samples+=n);
  assert.ok(Number.isFinite(gain(potion,potion)));
  assert.ok(samples>0);
  other.slots[1][3].fighter.hp=0;
  samples=0;
  assert.equal(gain(potion,{target:1,key:'switch/3'}),null);
  assert.equal(samples,0);
  for(const index of [1,3])other.slots[0][index].fighter.hp=0;
  assert.equal(gain(potion,potion),null);
  assert.equal(samples,0);
});
test('补药者存活、对手中毒退场时按下一回合合法补位考虑已解锁技能',()=>{
  const a=member(2988),reserve=member(3010),b=member(3056);
  a.moves=[19123,10018,20001,10022,20154];a.build.overrides={maxHp:5000,atk:80,def:240,spd:240,spe:180};
  reserve.build.overrides={maxHp:265,def:900,spd:900,spa:60,spe:180};
  b.moves=[19369,19368,10127,20117,20307];b.build.overrides={maxHp:1500,atk:65,spe:800};
  const g=T.create([[a,reserve],[b]],[0,0],{seed:'qa-22',criticals:false});
  g.battle.round=49;g.battle.fighters[0].hp=1;g.battle.fighters[0].ailments['中毒']=51;
  g.battle.teamExile1246=[{positions:[1]},null];
  g.battle.fighters[1].stages.acc=6;g.battle.fighters[1].pp['wiki:19368']=0;
  for(const difficulty of ['standard','hard']){
    const plan=run(g,difficulty,{now:()=>0}).action;
    assert.equal(plan.key,'potion:pp');
    const n=T.turn(g,['potion:hp',plan.key]);
    assert.deepEqual(n.pending,[0]);
    const follow=run(n,difficulty,{now:()=>0}).action;
    assert.equal(follow.key,'wiki:19368');
    assert.equal(T.turnWithReplacement(n,[1,null],['potion:hp',follow.key],{blind:true}).battle.winner,1);
  }
});

test('限回合时先消耗对手最后一次攻击无效，再用仅余一次的斩杀技',()=>{
  const a=member(2988),b=member(3056);
  a.moves=[19123,10018,20001,10022,20154];
  a.build.overrides={maxHp:265,atk:80,spa:80,def:900,spd:900,spe:180};
  b.moves=[19369,19368,10127,20117,20307];b.build.overrides={maxHp:1500,atk:65,spe:800};
  const g=T.create([[a],[b]],[0,0],{seed:'qa-22',criticals:false});
  g.battle.round=49;g.battle.fighters[0].counts.opponentAttackInvalid1128=1;
  g.battle.fighters[1].stages.acc=6;g.battle.fighters[1].pp['wiki:19368']=1;
  for(const difficulty of ['standard','hard']){
    const first=run(g,difficulty,{now:()=>0}).action;
    const n=T.turn(g,['potion:hp',first.key]);
    assert.equal(n.battle.fighters[0].counts.opponentAttackInvalid1128,0);
    assert.equal(n.battle.fighters[1].pp['wiki:19368'],1);
    const second=run(n,difficulty,{now:()=>0}).action;
    for(const {key} of T.choicesFor(n,0,null))assert.equal(T.turn(n,[key,second.key]).battle.winner,1);
  }
});

test('困难档在五次根试算内找到制胜一击，限回合时覆盖全部动作',()=>{
  const teams=[[3010],[2988]].map(ids=>ids.map(id=>{
    const m=member(id);
    m.build.overrides.maxHp=850;
    return m;
  }));
  let g=T.create(teams,[0,0],{seed:'duel-7103',challengedSide:0,criticals:true});
  for(const pair of [['wiki:24191','wiki:19123'],['wiki:17625','wiki:19122'],['potion:hp','wiki:19123']]){
    g=T.turn(g,pair);
  }
  for(const round of [4,50]){
    const board=structuredClone(g);
    board.battle.round=round;
    let elapsed=0;
    const team={...T,turn(...args){elapsed+=245;return T.turn(...args);}};
    const decision=run(board,'hard',{now:()=>elapsed},{seed:2953707687,team});
    assert.equal(decision.audit.root.length,round===4?5:7);
    const replies=T.choicesFor(board,0,null);
    assert.equal(replies.length,7);
    for(const reply of replies){
      const settled=T.turn(board,[reply.key,decision.action.key]);
      assert.equal(settled.battle.winner,1);
    }
  }
});

test('低血量面对上次实际用过的重击时能保住队员，对方 PP 耗尽后排除该应对',()=>{
  const teams=[[3541,3586],[2987,3056]].map(ids=>ids.map(id=>{
    const m=member(id);
    m.build.overrides.maxHp=850;
    return m;
  }));
  let board=T.create(teams,[0,0],{seed:'duel-9103',challengedSide:0,criticals:true});
  const repeated='wiki:31663';
  for(const key of ['wiki:25939',repeated,'wiki:25939',repeated,repeated,repeated]){
    board=T.turn(board,[key,'potion:hp']);
  }
  for(const spent of [false,true]){
    const g=structuredClone(board);
    if(spent)g.battle.fighters[0].pp[repeated]=0;
    let elapsed=0;
    const team={...T,turn(...args){elapsed+=125;return T.turn(...args);}};
    const decision=run(g,'hard',{now:()=>elapsed},{seed:31,team});
    assert.equal(decision.audit.repeatedThreat,spent?undefined:repeated);
    if(!spent){
      for(const rng of [7,31,1729]){
        const p={...g,battle:{...g.battle,rng,seed:String(rng)}};
        const next=T.turn(p,[repeated,keyToChoice(decision.action.key)]);
        assert.ok(next.slots[1].every(s=>s.fighter.hp>0));
      }
    }
  }
});

test('同一补救动作在另一种合法应对下能胜，首轮试算全负时继续比较',()=>{
  const teams=[[3414],[3586]].map(ids=>ids.map(id=>{
    const m=member(id);
    m.build.overrides.maxHp=850;
    return m;
  }));
  let g=T.create(teams,[0,0],{seed:'duel-6101',challengedSide:0,criticals:true});
  for(const pair of [
    ['wiki:30995','wiki:26057'],['wiki:30994','wiki:26056'],['wiki:25605','wiki:26057'],
    ['potion:hp','wiki:31897'],['wiki:25605','wiki:26056']
  ])g=T.turn(g,pair);
  let elapsed=0;
  const team={...T,turn(...args){elapsed+=160;return T.turn(...args);}};
  const decision=run(g,'hard',{now:()=>elapsed},{seed:1992509131,team});
  assert.ok(decision.audit.lossReview.tried>0);
  const outcomes=T.choicesFor(g,0,null).map(reply=>T.turn(g,[reply.key,keyToChoice(decision.action.key)]).battle.winner);
  assert.equal(outcomes.filter(w=>w===1).length,2);
  assert.equal(outcomes.filter(w=>w===0).length,1);
});


test('困难档第 50 回合用剩余预算排除会被反击致死的表面平局',()=>{
  const teams=[[3586],[3414]].map(ids=>ids.map(id=>{
    const m=member(id);
    // The opening drains a slot's PP. Keep 30994 available for round three.
    if(id===3414)m.moves=[25604,25605,30993,30994,30995];
    m.build.overrides.maxHp=850;
    return m;
  }));
  let g=T.create(teams,[0,0],{seed:'duel-7101',challengedSide:0,criticals:true});
  for(const pair of [
    ['wiki:31896','wiki:30995'],['wiki:26057','wiki:25605'],
    ['wiki:26056','wiki:30994'],['wiki:31897','potion:hp']
  ])g=T.turn(g,pair);
  g.battle.round=50;
  let elapsed=0;
  const team={...T,turn(...args){elapsed+=160;return T.turn(...args);}};
  const choice=run(g,'hard',{now:()=>elapsed},{seed:1803366634,team}).action;
  for(const rng of [7,31,1729]){
    const state={...g,battle:{...g.battle,rng,seed:String(rng)}};
    assert.equal(T.turn(state,['wiki:26057','wiki:25604']).battle.winner,0);
    for(const reply of T.choicesFor(state,0,null)){
      const outcome=T.turn(state,[reply.key,keyToChoice(choice.key)]);
      assert.equal(outcome.battle.winner,'draw');
    }
  }
});


test('对手的控制即将结束时，困难档用同一攻击验证续控收益',()=>{
  const teams=[[3414],[2988]].map(ids=>ids.map(id=>{
    const m=member(id);
    m.build.overrides.maxHp=850;
    return m;
  }));
  for(const mode of ['expires','continues','reflects']){
    const game=T.create(teams,[0,0],{seed:'control-negative',challengedSide:0,criticals:true});
    const enemy=game.battle.fighters[0],round=game.battle.round;
    enemy.ailments['害怕']=mode==='continues'?round+1:round;
    if(mode==='reflects')enemy.effects.reflect={start:round,end:round+4};
    let elapsed=0;
    const team={...T,turn(...args){elapsed+=160;return T.turn(...args);}};
    const result=run(game,'hard',{now:()=>elapsed},{seed:7,team});
    const setup=result.audit.root.find(row=>row.key==='wiki:24650');
    if(mode==='expires'){
      assert.equal(result.action.key,'wiki:24650');
      assert.ok(setup.gain>0);
      const after=T.turn(game,['potion:pp',result.action.key]);
      assert.equal(after.battle.fighters[1].effects['攻击附加异常'].ailment,'麻痹');
    }else{
      assert.equal(setup?.gain??0,0);
      assert.notEqual(result.action.key,'wiki:24650');
    }
  }
});

test('先手扣光 PP 前保留能实际出手的反击，较慢或未使用过的招式不优先抽样',()=>{
  for(const mode of ['used','slower','unseen','finish']){
    const foe=member(2997),own=member(3010);
    foe.build.overrides={maxHp:850,spe:mode==='slower'?165:800};
    own.build.overrides={maxHp:850,spe:mode==='slower'?850:200};
    let game=T.create([[foe],[own]],[0,0],{seed:'drain-transfer-2997',challengedSide:0,criticals:true});
    const drain='wiki:19119',counter='wiki:17623';
    if(mode!=='unseen')game=T.turn(game,[drain,'potion:pp']);
    const [enemy,holder]=game.battle.fighters;
    Object.assign(enemy.stages,{atk:6,spe:6,acc:6});
    Object.assign(holder.stages,{atk:6,def:6,spd:6,acc:6});
    enemy.hp=mode==='finish'?42:553;holder.hp=850;
    Object.assign(holder.pp,{'wiki:17625':2,'wiki:17624':2,'wiki:24191':2,[counter]:7,'wiki:24190':3});
    let elapsed=0;
    const team={...T,turn(...args){elapsed+=160;return T.turn(...args);}};
    const decision=run(game,'hard',{now:()=>elapsed},{seed:7,team});
    assert.equal(decision.audit.ppThreat,mode==='used'?drain:undefined);
    if(mode==='used'){
      assert.equal(decision.action.key,counter);
      for(const rng of [0x2101dc7a,0x8ddd421f,0xb2373810]){
        const board={...game,battle:{...game.battle,rng,seed:String(rng)}};
        const denied=T.turn(board,[drain,'wiki:17625']);
        const reply=T.turn(board,[drain,counter]);
        assert.equal(denied.battle.fighters[1].pp['wiki:17625'],0);
        assert.ok(reply.battle.fighters[0].hp<denied.battle.fighters[0].hp);
        assert.equal(reply.battle.fighters[1].hp,denied.battle.fighters[1].hp);
      }
    }
  }
});

test('困难档末回合在留场反击下比较击倒残血替补的选择',()=>{
  const roster=()=>[4554,4215].map(id=>{
    const entry=member(id);
    entry.build.overrides={maxHp:850};
    return entry;
  });
  let game=T.create([roster(),roster()],[0,0],{seed:'duel-15503',challengedSide:1,criticals:true});
  for(let i=0;i<2;i++)game=T.turn(game,['wiki:36857','wiki:36857']);
  game=T.turn(game,[{switchTo:1},'wiki:28442']);
  while(game.battle.round<50)game=T.turn(game,['potion:pp','potion:pp']);
  assert.deepEqual(game.slots.map(row=>row.map(s=>s.fighter.hp)),[[74,590],[632,850]]);
  const seed=(31^Math.imul(2,0x9e3779b9))>>>0;
  let elapsed=0;
  const team={...T,turn(...args){elapsed+=160;return T.turn(...args);}};
  const result=run(game,'hard',{now:()=>elapsed},{seed,team});
  assert.equal(result.action.key,'wiki:28442');
  const rng=636320971;
  const board={...game,battle:{...game.battle,rng,seed:String(rng)}};
  assert.equal(T.turn(board,[{switchTo:0},result.action.key]).battle.winner,1);
  assert.equal(T.turn(board,['wiki:35050',result.action.key]).battle.winner,'draw');
  assert.equal(T.turn(board,['wiki:35050','wiki:36856']).battle.winner,0);
});


function naturalRoster(ids){
  return ids.map(id=>{
    const entry=member(id);
    entry.build.overrides={};
    return entry;
  });
}
function standardReplacement(game,seed){
  let elapsed=0;
  const team={...T,turnWithReplacement(...args){elapsed+=160;return T.turnWithReplacement(...args);}};
  return run(game,'standard',{now:()=>elapsed},{seed,team});
}

test('标准档最后一只雷伊补位时用先制反转挡住已强化的攻击',()=>{
  const defenders=naturalRoster([4755,4765,3141]);
  // Keep the lead's 29038 out of the slot depleted by the opening strike.
  defenders[0].moves=[29038,37898,29037,37897,37899];
  let game=T.create([naturalRoster([4275,4216,4822]),defenders],[0,0],
    {seed:'duel-17003',challengedSide:0,criticals:true});
  const strike='wiki:35378';
  game=T.turn(game,[strike,'wiki:29038']);
  assert.deepEqual(T.candidates(game,1,true),[1,2]);
  assert.equal(standardReplacement(game,7).audit.stageSteal,undefined);
  game=T.turnWithReplacement(game,[null,2],[strike,'wiki:24966'],{blind:true});
  game=T.turn(game,[strike,'wiki:19724']);
  assert.deepEqual(T.candidates(game,1,true),[1]);
  assert.ok(Object.values(game.battle.fighters[0].stages).filter(n=>n>0).length>=2);
  const choice=standardReplacement(game,7).action;
  assert.equal(choice.target,1);
  assert.equal(choice.key,'wiki:37906');
  for(const rng of [game.battle.rng,0x7bb13ab9,0xc64e3f8d]){
    const board={...game,battle:{...game.battle,rng,seed:String(rng)}};
    const before=T.turnWithReplacement(board,[null,1],[strike,'wiki:29043'],{blind:true});
    const counter=T.turnWithReplacement(board,[null,1],[strike,choice.key],{blind:true});
    assert.equal(before.battle.winner,0);
    assert.equal(counter.slots[0][0].fighter.hp,0);
    assert.equal(counter.slots[1][1].fighter.hp,475);
  }
});

test('标准档最后一对一补位保留原有属性招或药剂回应',()=>{
  const team=()=>naturalRoster([4706,4275,4725]);
  let game=T.create([team(),team()],[0,0],{seed:'duel-16402',challengedSide:0,criticals:true});
  game=T.turn(game,['wiki:37647','wiki:37647']);
  game=T.turnWithReplacement(game,[1,null],['wiki:27724','wiki:37647'],{blind:true});
  game=T.turn(game,['wiki:35377','wiki:37647']);
  game=T.turnWithReplacement(game,[null,1],['wiki:35378','wiki:27724'],{blind:true});
  game=T.turn(game,['wiki:35377','wiki:35377']);
  game=T.turnWithReplacement(game,[2,null],['wiki:37788','wiki:35376'],{blind:true});
  game=T.turn(game,['wiki:37790','wiki:35378']);
  assert.deepEqual(game.slots.map(t=>t.filter(z=>z.fighter.hp>0).length),[1,1]);
  const reckless=T.turnWithReplacement(game,[null,2],['wiki:37789','wiki:37789'],{blind:true});
  assert.equal(reckless.battle.winner,0);
  for(const seed of [1529703215,1821333058]){
    const counter=standardReplacement(game,seed).action;
    assert.equal(counter.key,'wiki:37788');
    const next=T.turnWithReplacement(game,[null,counter.target],['wiki:37789',counter.key],{blind:true});
    assert.ok(next.slots[1][counter.target].fighter.hp>0);
  }
});


test('标准档在九十段攻击被宿主中断前只交付实际完成推演的合法动作',()=>{
  const opening=[
    ['wiki:37809','wiki:24965'],['potion:hp','wiki:24966'],
    ['potion:hp','wiki:19723'],['wiki:28973','wiki:24965']
  ];
  function replay(mirror){
    const ids=[[3886,3075],[3141,4725]];
    if(mirror)ids.reverse();
    let game=T.create(ids.map(naturalRoster),[0,0],{seed:'duel-17504',challengedSide:mirror?1:0,criticals:true});
    for(const pair of opening)game=T.turn(game,mirror?pair.slice().reverse():pair);
    return game;
  }
  function beforeTimeout(game,seed){
    const results=[],completedActions=[];let elapsed=0,interrupted=false;
    const team={...T,turn(position,choices){
      if(choices.includes('wiki:37809')){
        interrupted=true;elapsed+=4200;throw Error('test host cutoff');
      }
      const next=T.turn(position,choices);elapsed+=160;
      completedActions.push(choices[1]);return next;
    }};
    const realm=vm.createContext({self:{},TeamBattle:team,BattleEngine:E,BattleStatusRules:require('../dist/status-rules.js'),
      postMessage:m=>{if(elapsed<4000&&m.action)results.push(m);},performance:{now:()=>elapsed}});
    vm.runInContext(program,realm);
    realm.self.onmessage({data:{game:structuredClone(game),difficulty:'standard',seed}});
    assert.ok(interrupted);
    assert.ok(results.length);
    for(const m of results){
      assert.ok(m.samples>0);
      assert.ok(completedActions.includes(m.action.key));
      assert.ok(T.choicesFor(game,1,m.action.target).some(a=>a.key===m.action.key));
    }
    return results.map(m=>m.action.key);
  }
  const ownIce=replay(true);
  assert.deepEqual(beforeTimeout(ownIce,1642134383),['wiki:37810','potion:hp']);
  assert.ok(beforeTimeout(ownIce,39).length);
  assert.deepEqual(beforeTimeout(replay(false),26),['wiki:19724']);
});
