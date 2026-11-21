'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const Team=require('../dist/team-engine.js');
const local=require('../local-species.cjs');

function member(id,move,stats={}) {
  const snapshot=local.species(id), moves=E.WIKI.defaultMoves(snapshot);
  if(move&&!moves.includes(move))moves[1]=move;
  return {snapshot,moves,build:{overrides:{maxHp:9000,spe:999,...stats}}};
}

test('六个真实技能按各自参数结算己方存活回复与阵亡固定伤害',()=>{
  const cases=[[3550,31581,100,100],[3705,36944,80,80],[4498,36558,100,100],
    [4600,37122,120,80],[4677,28836,100,100],[4895,29334,100,100]];
  for(const [species,move,heal,damage] of cases){
    for(const [fallen,blocked] of [[0,false],[1,false],[2,false],[1,true]]){
      const game=Team.create([[member(species,move),member(2988),member(3056)],
        [member(2988,20369,{spe:9000}),member(3056)]],
        [0,0],{seed:'count',criticals:false});
      const user=game.battle.fighters[0],skill='wiki:'+move;
      user.hp=5000;
      if(blocked)user.effects['无法通过自身技能恢复体力']={start:1,end:1};
      for(let index=1;index<=fallen;index++)game.slots[0][index].fighter.hp=0;
      // 3705 has a separate first-action recovery. Keep its team heal isolated.
      const after=Team.turn(game,[skill,species===3705?'wiki:20369':'potion:pp']).battle;
      if(species===3705)assert.equal(after.turns.at(-1).first,1,skill);
      assert.equal(after.fighters[0].hp,5000+(blocked?0:(3-fallen)*heal)+(species===3550?900:0),skill);
      assert.equal(after.fighters[0].pp[skill],user.pp[skill]-1,skill);
      const hits=(after.damageEvents??[]).slice(game.battle.damageEvents?.length??0).filter(e=>e.sourceSide===0&&e.targetSide===1);
      // The confirmed untyped output multiplier applies only to red damage.
      const expectedFixed=fallen*damage;
      assert.deepEqual(hits.filter(e=>e.type==='fixed').map(e=>[e.settledDamage,e.hpLoss]),
        fallen?[[expectedFixed,expectedFixed]]:[],skill);
      assert.equal(after.fighters[1].hp,game.battle.fighters[1].hp-hits.reduce((n,e)=>n+e.hpLoss,0),skill);
    }
  }
});

test('阵亡补位后统计新出场者与场下队友，中切再入场仍读取实际队伍',()=>{
  const game=Team.create([[member(2988,null,{maxHp:20,def:1,spe:1}),member(4677,28836),member(3056)],
    [member(2988,null,{atk:9999,spe:9999})]],[0,0],{seed:'count',criticals:false});
  const defeated=Team.turn(game,game.battle.fighters.map(f=>f.moves[0]));
  assert.deepEqual(defeated.pending,[0]);
  const entry=Team.replace(defeated,[1,null]);
  assert.equal(entry.slots[0][0].fighter.hp,0);
  const away=Team.turn(entry,[{switchTo:2},'potion:pp']);
  const back=Team.turn(away,[{switchTo:1},'potion:pp']);
  back.battle.fighters[0].hp=5000;
  const out=Team.turn(back,['wiki:28836','potion:pp']);
  assert.equal(out.battle.fighters[0].hp,5200);
  assert.equal(out.battle.fighters[1].hp,back.battle.fighters[1].hp-100);
  assert.deepEqual(out.active,[1,0]);
});

test('2247 五个实际技能仅在己方最后一只存活时获得先制；对手无视正先制时仍由速度排序',()=>{
  for(const [id,move] of [[4706,37647],[4706,37835],[4714,37745],[4895,29334],[4911,38418]]){
    const key='wiki:'+move;
    for(const last of [false,true]){
      const roster=spe=>[member(id,move,{spe,maxHp:9999}),member(2988)];
      let game=Team.create([roster(100),roster(900)],[0,0],{seed:'2247',criticals:false});
      if(last)game.slots[0][1].fighter.hp=0;
      if(id===4911){
        for(const fighter of game.battle.fighters)fighter.soulState.permanentAilments2497=['冰封'];
        game=Team.turn(game,[key,key]);
        for(const fighter of game.battle.fighters){
          assert.ok(fighter.soulState.actualMoveThisRound4658.move.duelFifth4911);
        }
      }
      if(id===4911 && last)assert.equal(Team.turn(game,[key,key]).battle.turns.at(-1).first,1);
      const result=Team.turn(game,[key,id===4911?'wiki:38419':key]).battle;
      for(const fighter of result.fighters.slice(0,1)){
        const actual=fighter.soulState.actualMoveThisRound4658;
        assert.equal(actual.round,game.battle.round,key);
        assert.equal(actual.move.id,key);
        assert.ok(actual.move.operations.some(op=>Number(op.effectId)===2247),key);
        assert.ok(!actual.move.duelFifth4911);
      }
      assert.equal(result.turns.at(-1).first,last?0:1,JSON.stringify({key,events:result.turns.at(-1).events.map(e=>e.text),bench:game.battle.teamBench[0][0].hp}));
    }
  }
});

test('双方场下阵亡数分别改变四个招式的攻击伤害与三个招式的固定伤害',()=>{
  for(const [id,move,percent,fixed] of [
    [3705,36944,20,0],[4482,36470,50,0],[4498,36558,30,0],
    [4499,36553,20,100],[4521,36690,0,100],[4895,29334,0,100]
  ]){
    const roster=lead=>[lead,member(3056),member(2987)];
    const game=Team.create([roster(member(id,move)),roster(member(2988))],[0,0],
      {seed:'fallen-reserves',criticals:false});
    function hits(own,opposing){
      const input=structuredClone(game);
      for(const [side,count] of [own,opposing].entries()){
        for(let slot=1;slot<=count;slot++)input.slots[side][slot].fighter.hp=0;
      }
      const result=Team.turn(input,['wiki:'+move,'potion:pp']).battle;
      assert.equal(result.fighters[0].pp['wiki:'+move],input.battle.fighters[0].pp['wiki:'+move]-1);
      return (result.damageEvents??[]).filter(e=>e.sourceSide===0&&e.targetSide===1);
    }
    const baseline=hits(0,0);
    const red=events=>events.find(e=>e.type==='attack')?.settledDamage;
    const fixedDamage=events=>events.filter(e=>e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0);
    if(percent){
      assert.ok(red(baseline)>0,JSON.stringify(baseline));
      for(const count of [1,2]){
        const actual=red(hits(count,0));
        assert.ok(Math.abs(actual-red(baseline)*(1+count*percent/100))<=2,move+' '+actual);
      }
    }
    if(fixed)for(const count of [0,1,2]){
      assert.equal(fixedDamage(hits(0,count))-fixedDamage(baseline),count*fixed,move);
    }
  }
});

test('存活队友增伤与双方存活差威力按当前阵容结算，零基础威力可提升',()=>{
  for(const [id,move] of [[4706,37835],[4716,37763],[4800,38103]]){
    function attack(own,opponent){
      const reserves=[3056,2987].map(id=>member(id));
      const game=Team.create([[member(id,move),...reserves.slice(0,own)],
        [member(2988),...reserves.slice(0,opponent)]],[0,0],{seed:'living-count',criticals:false});
      const after=Team.turn(game,['wiki:'+move,'potion:pp']).battle;
      const fighter=after.fighters[0];
      assert.equal(fighter.soulState.actualMoveThisRound4658.move.id,'wiki:'+move);
      const damage=(after.damageEvents??[]).filter(e=>e.sourceSide===0&&e.targetSide===1&&e.type==='attack')
        .reduce((sum,e)=>sum+e.settledDamage,0);
      const trace=after.turns.at(-1).events.find(e=>/^威力 \d+/.test(e.detail??''))?.detail;
      return {damage,power:trace?Number(/^威力 (\d+)/.exec(trace)[1]):0};
    }
    const base=attack(0,0);
    if(move===37835){
      assert.ok(base.damage>0);
      assert.ok(Math.abs(attack(1,0).damage-base.damage*1.5)<=2);
      assert.equal(attack(1,0).damage,attack(2,0).damage);
    }else{
      const one=attack(0,1),two=attack(0,2);
      // Full souls can change HP, mitigation and damage independently of skill power.
      // Check the power used by the actual damage calculation, plus real positive damage.
      const step=move===37763?100:65;
      assert.equal(attack(1,0).power,base.power);
      assert.equal(attack(1,1).power,base.power);
      assert.equal(base.power,move===37763?0:130);
      assert.equal(one.power,base.power+step);assert.equal(two.power,base.power+step*2);
      assert.ok(one.damage>0&&two.damage>0,JSON.stringify({move,base,one,two}));
    }
  }
});

test('四个2245实例按己方阵亡数授予各自盾罩，同源重授刷新且与异源并存',()=>{
  const shields=require('../dist/shield-rules.js');
  for(const [id,move,amount] of [[4706,37647,80],[4706,37835,100],[4797,29107,125],[4800,38103,65]]){
    for(const fallen of [0,1,2]){
      let game=Team.create([[member(id,move),member(3056),member(2987)],[member(2988)]],
        [0,0],{seed:'living-count',criticals:false});
      for(let i=1;i<=fallen;i++)game.slots[0][i].fighter.hp=0;
      const lead=game.battle.fighters[0];
      shields.refresh(lead,31,'prior');shields.refreshBarrier(lead,17,'prior');
      for(let round=1;round<=2;round++){
        game=Team.turn(game,['wiki:'+move,'potion:pp']);
        const fighter=game.battle.fighters[0];
        assert.equal(fighter.soulState.actualMoveThisRound4658.round,round);
        assert.equal(fighter.suitState.shield,31+fallen*amount,JSON.stringify(game.history.slice(-10)));
        assert.equal(fighter.suitState.barrier,17+fallen*amount,move);
        assert.equal(shields.sourceValue(fighter,'prior'),31);
        assert.equal(shields.barrierSourceValue(fighter,'prior'),17);
      }
    }
  }
});

test('4800 振武扶危未命中时不按阵亡成员授予盾罩',()=>{
  const game=Team.create([[member(4800,38103),member(3056),member(2987)],[member(2988)]],
    [0,0],{seed:require('../research/TEAM-STAGE-2/team-count-miss-seed-v1.json').seed,criticals:false});
  game.slots[0][1].fighter.hp=0;
  const after=Team.turn(game,['wiki:38103','potion:pp']);
  assert.ok(after.history.some(line=>line.includes('技能未命中')));
  assert.equal(after.battle.fighters[0].suitState.shield??0,0);
  assert.equal(after.battle.fighters[0].suitState.barrier??0,0);
});

test('阿尔斯兰两版魂印正常离场保留累积攻击增伤，场下暂停，重新出场继续直至上限',()=>{
  for(const [soul,hash,step] of [[558,'d120b40f',0.30],[566,'e78ded43',0.35]]){
    const lead=member(3223,10127);
    lead.snapshot={...lead.snapshot,selectedSoulId:soul};
    let game=Team.create([[lead,member(3056)],[member(2988)]],[0,0],{seed:'arslan',criticals:false});
    assert.equal(game.battle.fighters[0].soulHash,hash);
    const items=['potion:pp','potion:pp'];
    game=Team.turn(game,items);
    assert.equal(game.battle.fighters[0].soulState.arslanBonus,step);
    game=Team.turn(game,[{switchTo:1},items[1]]);
    game=Team.turn(game,items);
    assert.equal(game.slots[0][0].fighter.soulState.arslanBonus,step);
    assert.equal(game.battle.fighters[0].soulState.arslanBonus,undefined);
    game=Team.turn(game,[{switchTo:0},items[1]]);
    assert.equal(game.battle.fighters[0].soulState.arslanBonus,2*step);
    const control=structuredClone(game);
    control.battle.fighters[0].soulState.arslanBonus=0;
    function damage(input){
      const after=Team.turn(input,['wiki:10127',items[1]]);
      return after.battle.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).settledDamage;
    }
    const base=damage(control);
    assert.ok(base>0 && Math.abs(damage(game)-base*(1+2*step))<=2);
    for(let round=0;round<5;round++)game=Team.turn(game,items);
    assert.equal(game.battle.fighters[0].soulState.arslanBonus,step*5);
  }
});

test('乔两版登场按场下存活者增加攻击盾、按阵亡者提升实际伤害，六人阵容达到两个上限',()=>{
  for(const [id,hash] of [[398,'5edce8dd'],[399,'fbe05c02']]){
    const joe=member(3036,10004);
    joe.snapshot={...joe.snapshot,selectedSoulId:id};
    const team=[member(2988,null,{maxHp:1,def:1,spe:1}),joe,...[3056,2987,3223,3311].map(n=>member(n))];
    const enemy=member(2988,null,{atk:9999,spe:9999});
    function create(lead){return Team.create([team,[enemy]],[lead,0],{seed:'entry-count',criticals:false});}
    const fresh=create(1);
    assert.equal(fresh.battle.fighters[0].soulHash,hash);
    assert.equal(fresh.battle.fighters[0].soulState.attackShield,600);
    for(const extra of [0,4]){
      const before=create(0);
      for(let i=0;i<extra;i++)before.slots[0][2+i].fighter.hp=0;
      const ko=Team.turn(before,before.battle.fighters.map(f=>f.moves[0]));
      assert.deepEqual(ko.pending,[0]);
      const entry=Team.replace(ko,[1,null]),fighter=entry.battle.fighters[0];
      assert.equal(fighter.soulState.attackShield,500-extra*100);
      assert.equal(fighter.soulState.fallenOnEntry,1+extra);
      const control=structuredClone(entry);
      control.battle.fighters[0].soulState.fallenOnEntry=0;
      const damage=g=>Team.turn(g,['wiki:10004','potion:pp']).battle.damageEvents
        .find(e=>e.type==='attack'&&e.sourceSide===0).settledDamage;
      const base=damage(control);
      assert.ok(base>0&&Math.abs(damage(entry)-base*(1+(1+extra)/10))<=2);
    }
  }
});

test('3311 神途真实重生后双方都不能中切，死切合法，层数耗尽后恢复中切',()=>{
  function begin(timedDeath=false){
    const lead=member(3311);lead.moves=[38635,38633,29506,29507,38634];
    const game=Team.create([[lead,member(3056)],[member(2988,10018,{spe:9999}),member(2987)]],[0,0],{seed:'divine-training',criticals:false});
    assert.deepEqual(Team.candidates(game,0),[1]);game.battle.fighters[0].hp=1;
    if(timedDeath){game.battle.fighters[1].hp=2000;game.battle.fighters[1].ailments['烧伤']=2;}
    return Team.turn(game,['wiki:29507','wiki:10018']);
  }
  const state=begin();
  const reborn=state.battle.fighters[0];
  assert.equal(reborn.soulState.holyReborn,true);
  assert.equal(reborn.type,'神灵');
  for(const side of [0,1]){
    assert.deepEqual(Team.candidates(state,side),[]);
    assert.deepEqual(Team.candidates(state,side,true),[1]);
    const choices=['potion:pp','potion:pp'];choices[side]={switchTo:1};
    assert.throws(()=>Team.turn(state,choices),/不可换入/);
  }
  const dying=begin(true);
  let forced=Team.turn(dying,['potion:pp','potion:pp']);
  assert.deepEqual(forced.pending,[1]);
  assert.equal(forced.battle.fighters[0].type,'神灵');
  assert.deepEqual(Team.replace(forced,[null,1]).active,[0,1]);
  let normal=state;
  for(let layers=reborn.soulState.divineJourney.layers;layers>0;layers=Math.floor(layers/2)){
    normal=Team.turn(normal,['potion:pp','potion:pp']);
    assert.equal(normal.battle.fighters[0].soulState.divineJourney.layers,Math.floor(layers/2));
  }
  assert.equal(normal.battle.fighters[0].soulState.divineJourney.layers,0);
  assert.deepEqual(Team.turn(normal,[{switchTo:1},{switchTo:1}]).active,[1,1]);
});

test('2076 三个真实技能吸取未减少目标体力时治疗全部存活替补，溢出封顶且不复活阵亡者',()=>{
  for(const [id,move,heal] of [[4553,28436,200],[4676,28809,200],[4911,29370,170]]){
    for(const immune of [true,false]){
      let game=Team.create([[member(id,move),member(3056),member(3223),member(2987)],[member(2988),...(id===4911?[member(3056)]:[])]],
        [0,0],{seed:'bench-heal',criticals:false});
      const key='wiki:'+move;
      const bench=game.slots[0].slice(1).map(slot=>slot.fighter);
      bench[0].hp=4100;bench[1].hp=8990;bench[2].hp=0;
      const foe=game.battle.fighters[1];foe.hp=8000;
      if(immune)foe.effects['固定百分比免疫']={start:1,end:20};
      if(id===4911){const next=game.slots[1][1].fighter;next.hp=8000;if(immune)next.effects['固定百分比免疫']={start:1,end:20};}
      if(id===4911)game=Team.turn(game,[key,'potion:pp']);
      const priorHp=game.slots[0].slice(1).map(slot=>slot.fighter.hp);
      const after=Team.turn(game,[key,id===4911?{switchTo:1}:'potion:pp']);
      assert.equal(after.battle.fighters[0].soulState.actualMoveThisRound4658.move.id,key);
      assert.deepEqual(after.slots[0].slice(1).map(slot=>slot.fighter.hp),
        priorHp.map((hp,i)=>i===2?0:Math.min(9000,hp+(immune?heal:0))),move);
    }
  }
});

test('缥缈幽芙两版死亡时为所有存活替补逐槽回复1PP，当前配置上限与阵亡队友独立',()=>{
  for(const [soul,hash] of [[1315,'1af3ca71'],[1562,'fb665ec1']]){
    const lead=member(4069,null,{maxHp:1,spe:1,def:1});
    lead.snapshot={...lead.snapshot,selectedSoulId:soul};
    const game=Team.create([[lead,member(3223,10127),member(3311),member(3056)],
      [member(2988,null,{atk:9999,spe:9999})]],[0,0],{seed:'soul-pp',criticals:false});
    assert.equal(game.battle.fighters[0].soulHash,hash);
    game.slots[0][3].fighter.hp=0;
    const expected=game.slots[0].slice(1).map(({fighter},index)=>{
      const max={...fighter.pp};
      fighter.moves.forEach((key,i)=>{if(i%2===0)fighter.pp[key]=0;});
      return Object.fromEntries(fighter.moves.map(key=>[key,Math.min(max[key],fighter.pp[key]+(index===2?0:1))]));
    });
    const ko=Team.turn(game,game.battle.fighters.map(f=>f.moves[0]));
    assert.deepEqual(ko.pending,[0]);
    assert.deepEqual(ko.slots[0].slice(1).map(s=>s.fighter.pp),expected);
    assert.deepEqual(Team.replace(ko,[2,null]).battle.fighters[0].pp,expected[1]);
  }
});

test('幽冥之荷传给实际补位者，物品与属性行动不消耗，前一或两次攻击先制与增伤一同耗尽',()=>{
  for(const [soul,limit] of [[1315,1],[1562,2]]){
    const lead=member(4069,null,{maxHp:1,def:1,spe:1});
    lead.snapshot={...lead.snapshot,selectedSoulId:soul};
    const slow=member(2988,10018,{spe:100,def:300}),fast=member(2988,10018,{spe:900,def:300});
    for(const m of [slow,fast])m.moves=[10018,20001,10022,10054,m.snapshot.moves.find(skill=>skill.fifth).id];
    const game=Team.create([[lead,member(3056),slow],[fast]],[0,0],{seed:'lotus',criticals:false});
    const attack=game.battle.fighters[1].moves[0];
    const ko=Team.turn(game,[game.battle.fighters[0].moves[0],attack]);
    let state=Team.replace(ko,[2,null]);
    assert.equal(state.slots[0][1].fighter.soulState.netherLotusAttacks,undefined);
    state=Team.turn(state,['potion:pp','potion:pp']);
    const status=state.battle.fighters[0].moves.find(k=>state.battle.moveDefinitions[k].kind==='status');
    assert.ok(status);
    state=Team.turn(state,[status,'potion:pp']);
    assert.equal(state.battle.fighters[0].soulState.netherLotusAttacks,limit);
    for(let n=0;n<=limit;n++){
      const control=structuredClone(state);
      control.battle.fighters[0].soulState.netherLotusAttacks=0;
      // Hold order equal for the damage comparison so each side receives the same random roll.
      if(n<limit)control.battle.fighters[0].stats.spe=9999;
      const actions=[attack,attack],base=Team.turn(control,actions);
      state=Team.turn(state,actions);
      const thisAttack=g=>g.battle.damageEvents.find(e=>e.round===g.battle.round-1&&e.type==='attack'&&e.sourceSide===0).settledDamage;
      assert.equal(state.battle.turns.at(-1).first,n<limit?0:1);
      assert.ok(Math.abs(thisAttack(state)-thisAttack(base)*(n<limit?2:1))<=2);
      assert.equal(state.battle.fighters[0].soulState.netherLotusAttacks,Math.max(0,limit-n-1));
    }
  }
});

test('十三个真实单方与双方封换技能从下回合起封中切，按来源时长恢复且允许死切',()=>{
  const specs=[
    [3886,26781,2],[4329,35660,1],[4386,27996,2],[4541,36791,1],
    [4604,28604,2],[4662,37469,1],[4679,37521,1],[4823,38113,1],
    [4625,28666,1,true],[4661,28779,2,true],[4669,28802,1,true],
    [4785,29088,1,true],[4921,29390,2,true]
  ];
  for(const [id,move,turns,both] of specs){
    let game=Team.create([[member(id,move),member(3056)],[member(2988),member(3223)]],
      [0,0],{seed:'switch-lock',criticals:false});
    game=Team.turn(game,['wiki:'+move,'potion:pp']);
    for(let i=0;i<turns;i++){
      assert.deepEqual(Team.candidates(game,1),[],String(move));
      assert.deepEqual(Team.candidates(game,0),both?[]:[1],String(move));
      assert.deepEqual(Team.candidates(game,1,true),[1]);
      assert.throws(()=>Team.turn(game,['potion:pp',{switchTo:1}]),/不可换入/);
      game=Team.turn(game,['potion:pp','potion:pp']);
    }
    assert.deepEqual(Team.turn(game,[{switchTo:1},{switchTo:1}]).active,[1,1],String(move));
  }
});

test('三个2227实例仅在实际清除强化后对目标封换，空清除不封换',()=>{
  for(const [id,move,turns] of [[4685,37616,1],[4871,38271,2],[4872,38273,1]]){
    for(const boosted of [false,true]){
      let game=Team.create([[member(id,move),member(3056)],[member(2988),member(3223)]],
        [0,0],{seed:'switch-lock',criticals:false});
      if(boosted)game.battle.fighters[1].stages.atk=2;
      // Observe the real complete skill result before the separate next-round wind appointment.
      const skillResult=E.resolveTurn(game.battle,['wiki:'+move,'potion:pp']);
      const skillLock=skillResult.fighters[1].effects['不能主动切换'];
      assert.equal(!!skillLock?.noSwitch,boosted,String(move));
      if(boosted)assert.deepEqual([skillLock.start,skillLock.end],[2,1+turns],String(move));
      game=Team.turn(game,['wiki:'+move,'potion:pp']);
      assert.equal(game.battle.fighters[1].stages.atk,0);
      for(let i=0;i<turns;i++){
        assert.deepEqual(Team.candidates(game,1),boosted||id===4871?[]:[1],String(move));
        if(id===4871)assert.equal(game.slots[0][0].fighter.soulState.wind2058.switchLockEvents[0].sourceHash,'6f5c0ef1');
        // Actually leave so the high-HP soul does not schedule another independent ban every round.
        game=Team.turn(game,[id===4871&&i===0?{switchTo:1}:'potion:pp','potion:pp']);
      }
      assert.deepEqual(Team.turn(game,['potion:pp',{switchTo:1}]).active,[id===4871?1:0,1]);
    }
  }
});

test('解异、无法断回合、吸取零损失与整招无效各自按真实条件封换',()=>{
  const specs=[[3524,29142,2],[4345,27902,2],[3941,37241,1],[4942,38524,1],[4956,29485,1]];
  for(const [id,move,duration] of specs)for(const condition of [false,true]){
    let game=Team.create([[member(id,move),member(3056)],[member(2988),member(3223)]],
      [0,0],{seed:'switch-lock',criticals:false});
    const [lead,foe]=game.battle.fighters;
    if(id===3524&&condition)lead.ailments['中毒']=3;
    if(id===3941&&condition)foe.effects['固定百分比免疫']={start:1,end:2};
    if(id===4345){
      foe.effects['测试回合']={start:1,end:2};
      if(condition)foe.effects.protect={start:1,end:2};
    }
    if([4942,4956].includes(id)&&condition)lead.effects[id===4956?'statusBlock':'skillBlock']={start:1,end:1};
    game=Team.turn(game,['wiki:'+move,'potion:pp']);
    for(let i=0;i<duration;i++){
      assert.deepEqual(Team.candidates(game,1),condition?[]:[1],JSON.stringify({move,history:game.history.slice(-7)}));
      game=Team.turn(game,['potion:pp','potion:pp']);
    }
    assert.deepEqual(Team.candidates(game,1),[1],String(move));
  }
});

test('2351 未击败且全属性弱化实际未生效时封换，任一项成功不触发',()=>{
  for(const [id,move] of [[3586,38119],[4000,38423],[4903,38392]])for(const blocked of [false,true]){
    let game=Team.create([[member(id,move),member(3056)],[member(2988),member(3223)]],
      [0,0],{seed:'switch-lock',criticals:false});
    const foe=game.battle.fighters[1];
    for(const key of Object.keys(foe.stages))foe.stages[key]=-6;
    if(!blocked)foe.stages.def=0;
    game=Team.turn(game,['wiki:'+move,'potion:pp']);
    assert.ok(game.battle.fighters[1].hp>0);
    assert.equal(game.battle.fighters[1].stages.def,blocked?-6:-1,String(move));
    assert.deepEqual(Team.candidates(game,1),blocked?[]:[1],String(move));
    game=Team.turn(game,['potion:pp','potion:pp']);
    assert.deepEqual(Team.candidates(game,1),[1]);
  }
});

test('等量非零盾罩成功消除后实际封换，零盾罩及不等量不封换',()=>{
  const shields=require('../dist/shield-rules.js');
  for(const [id,move,turns] of [[4000,38420,2],[4940,29440,3]])for(const amount of [0,50,75]){
    let game=Team.create([[member(id,move),member(3056)],[member(2988),member(3223)]],
      [0,0],{seed:'equal-shields',criticals:false});
    game.battle.fighters[1].soulState.permanentAilments2497=['瘫痪'];
    if(amount){
      shields.refresh(game.battle.fighters[0],50,'prior');
      shields.refreshBarrier(game.battle.fighters[1],amount,'prior');
    }
    game=Team.turn(game,['wiki:'+move,'potion:pp']);
    for(let i=1;i<turns;i++){
      assert.deepEqual(Team.candidates(game,1),amount===50?[]:[1],String(move));
      game=Team.turn(game,['potion:pp','potion:pp']);
    }
    assert.deepEqual(Team.candidates(game,1),[1]);
  }
});

test('时空漩涡的束缚及封换各自生效，两回合后可中切',()=>{
  for(const immune of [false,true]){
    let game=Team.create([[member(4184,34895),member(3056)],[member(2988),member(3223)]],
      [0,0],{seed:'vortex',criticals:false});
    if(immune)game.battle.fighters[1].soulState.permanentAilments2497=['束缚'];
    game=Team.turn(game,['wiki:34895','potion:pp']);
    assert.equal(!!game.battle.fighters[1].ailments['束缚'],!immune);
    for(let i=0;i<2;i++){
      assert.deepEqual(Team.candidates(game,1),[]);
      game=Team.turn(game,['potion:pp','potion:pp']);
    }
    assert.deepEqual(Team.candidates(game,1),[1]);
  }
});

test('帝皇主副位交换后清强与初始主位解异分别封换，空清除不触发',()=>{
  for(const change of [false,true])for(const success of [false,true]){
    let game=Team.create([[member(4950,29467),member(3056)],[member(2988),member(3223)]],
      [0,0],{seed:'master-switch',criticals:false});
    if(success){
      if(change)game.battle.fighters[1].stages.atk=1;
      else game.battle.fighters[0].ailments['流血']=5;
    }
    if(change)game=Team.turn(game,['wiki:38568','potion:pp']);
    game=Team.turn(game,['wiki:29467','potion:pp']);
    for(let i=1;i<3;i++){
      assert.deepEqual(Team.candidates(game,1),success?[]:[1]);
      game=Team.turn(game,['potion:pp','potion:pp']);
    }
    assert.deepEqual(Team.candidates(game,1),[1]);
  }
});

test('蜃都集齐四种才封住对方换宠，少一种可以主动切换',()=>{
  for(const complete of [false,true]){
    let game=Team.create([[member(4923,29398),member(3056)],[member(2988),member(3223)]],
      [0,0],{seed:'four-cities',criticals:false});
    const cities=(complete?['序','源','逐','理']:['序','源','逐']).map(name=>({name}));
    Object.assign(game.battle.fighters[0].soulState.mirage2119,{cities,remaining:4-cities.length});
    game=Team.turn(game,['wiki:29398','potion:pp']);
    for(let i=1;i<4;i++){
      assert.deepEqual(Team.candidates(game,1),complete?[]:[1]);
      game=Team.turn(game,['potion:pp','potion:pp']);
    }
    assert.deepEqual(Team.candidates(game,1),[1]);
  }
});

test('原版辰星石在前两次出场授盾，觉醒版第三次仍授盾，圣地卡修斯每次重置当回合免异',()=>{
  const shields=require('../dist/shield-rules.js');
  for(const [id,soul,amount] of [[3983,1245,3000],[3983,2030,3000],[3568,870,4500]]){
    const lead=member(id);
    lead.snapshot={...lead.snapshot,selectedSoulId:soul};
    let game=Team.create([[lead,member(3056)],[member(2988)]],[0,0],{seed:'entry-shield',criticals:false});
    for(let entry=1;entry<=3;entry++){
      const fighter=game.battle.fighters[0],source=id===3983?'chen-entry':'魂印870入场';
      assert.equal(fighter.soulState.teamEntry.number,entry);
      assert.equal(shields.sourceValue(fighter,source),entry===3&&soul===1245?0:amount);
      if(soul===870){
        assert.equal(E.SOULS.trait(fighter,'ailmentImmune'),true);
        game=Team.turn(game,['potion:pp','potion:pp']);
        if(entry===1)game=Team.turn(game,['potion:pp','potion:pp']);
        assert.equal(E.SOULS.trait(game.battle.fighters[0],'ailmentImmune'),false);
      }
      if(entry<3){
        game=Team.turn(game,[{switchTo:1},'potion:pp']);
        game=Team.turn(game,[{switchTo:0},'potion:pp']);
      }
    }
  }
});

test('3289首次从场下登场使当回合攻击无效，再次登场封当前对手两回合属性技能',()=>{
  const foe=member(2988);
  foe.moves=[10018,20001,10022,10054,foe.snapshot.moves.find(m=>m.fifth).id];
  let game=Team.create([[member(3056),member(3289)],[foe]],[0,0],{seed:'second-entry',criticals:false});
  game=Team.turn(game,['potion:pp','potion:pp']);
  game=Team.turn(game,[{switchTo:1},'wiki:10018']);
  assert.equal(game.battle.fighters[0].hp,9000);
  assert.equal(game.battle.fighters[1].soulState.skillInvalidRound,2);
  game=Team.turn(game,[{switchTo:0},'potion:pp']);
  game=Team.turn(game,[{switchTo:1},'wiki:20001']);
  assert.equal(game.battle.fighters[1].stages.def,0);
  game=Team.turn(game,['potion:pp','wiki:20001']);
  assert.equal(game.battle.fighters[1].stages.def,0);
  game=Team.turn(game,['potion:pp','wiki:20001']);
  assert.equal(game.battle.fighters[1].stages.def,1);
});

test('3964初次与再次登场用招削减100及80上限，低体提升25%，被削减者离场返场重置上限',()=>{
  for(const low of [false,true]){
    const lead=member(3964,20044),sacrifice=member(2988,null,{maxHp:1,def:1});
    const attacker=member(2988,10018,{atk:9999});
    let game=Team.create([[lead,sacrifice],[attacker,member(3223)]],[0,0],{seed:'wild-entry',criticals:false});
    if(low)game.battle.fighters[0].hp=5000;
    const first=low?125:100,second=low?100:80;
    game=Team.turn(game,['wiki:20044','potion:pp']);
    assert.equal(game.battle.fighters[1].stats.maxHp,9000-first);
    game=Team.turn(game,[{switchTo:1},'wiki:10018']);
    assert.deepEqual(game.pending,[0]);
    game=Team.replace(game,[0,null]);
    game=Team.turn(game,['wiki:20044','potion:pp']);
    assert.equal(game.battle.fighters[1].stats.maxHp,9000-first-second);
    game=Team.turn(game,['potion:pp',{switchTo:1}]);
    game=Team.turn(game,['potion:pp',{switchTo:0}]);
    assert.equal(game.battle.fighters[1].stats.maxHp,9000);
    assert.ok(game.battle.fighters[1].hp<=game.battle.fighters[1].stats.maxHp);
  }
});

test('米斯蒂克前两次登场封属并施加350基础固伤，凡尔斯低体减伤照常，第三次两项均不触发',()=>{
  const foe=member(2988,20001);
  let game=Team.create([[member(3082),member(3056)],[foe]],[0,0],{seed:'entry-status',criticals:false});
  for(let entry=1;entry<=3;entry++){
    for(let round=0;round<3;round++){
      const choices=[entry>1&&round===0?{switchTo:0}:'potion:pp','wiki:20001'];
      const low=game.battle.fighters[1].hp<game.battle.fighters[0].hp;
      game=Team.turn(game,choices);
      const log=game.battle.turns.at(-1);
      const penalty=(game.battle.damageEvents??[]).filter(e=>e.round===log.round&&e.type==='fixed'&&e.targetSide===1);
      assert.deepEqual(penalty.map(e=>e.settledDamage),entry<=2&&round<2?[low?175:350]:[]);
      assert.equal(log.events.some(e=>e.text.includes('技能被封锁')),entry<=2&&round<2);
    }
    if(entry<3)game=Team.turn(game,[{switchTo:1},'potion:pp']);
  }
});

test('4950按是否首发选初始主位，真正再出战逐次降低先手增伤；主副交换不另计一次',()=>{
  for(const wasLead of [false,true]){
    const unit=member(4950,38567),foe=member(2988,20001,{spe:1});
    let game=Team.create([[unit,member(3056)],[foe]],[wasLead?0:1,0],{seed:'group-entry',criticals:false});
    if(!wasLead)game=Team.turn(game,[{switchTo:0},'potion:pp']);
    assert.equal(game.battle.fighters[0].soulState.group2149.master,wasLead?'yue':'yu');
    const firstRole=game.battle.fighters[0].soulState.group2149.master;
    game=Team.turn(game,['wiki:38568','potion:pp']);
    let newRole=game.battle.fighters[0].soulState.group2149.master;
    assert.notEqual(newRole,firstRole);
    if(wasLead){game=Team.turn(game,['wiki:38568','potion:pp']);newRole=game.battle.fighters[0].soulState.group2149.master;}
    for(let entry=1;entry<=6;entry++){
      const f=game.battle.fighters[0],group=f.soulState.group2149;
      assert.equal(group.entries,entry);
      assert.equal(group.master,newRole);
      const baseline=structuredClone(game);
      baseline.battle.fighters[0].soulState.group2149.entries=5;
      const damage=g=>{
        const result=Team.turn(g,['wiki:38567','wiki:20001']).battle;
        assert.equal(result.turns.at(-1).first,0);
        const hits=result.damageEvents.filter(e=>e.round===result.round-1&&e.sourceSide===0&&e.type==='attack');
        const total=hits.reduce((sum,e)=>sum+e.settledDamage,0);assert.ok(total,JSON.stringify(result.turns.at(-1).events));return total;
      };
      const minimum=damage(baseline),factor=1+Math.max(100,200-(entry-1)*25)/100;
      const actual=damage(game);assert.ok(minimum>0&&Math.abs(actual-minimum*factor/2)<=2,JSON.stringify({wasLead,entry,minimum,actual,factor}));
      if(entry<6){
        game=Team.turn(game,[{switchTo:1},'potion:pp']);
        game=Team.turn(game,[{switchTo:0},'potion:pp']);
      }
    }
  }
});

test('辰坤觉醒护盾仍在时实际重生，换下再登场保留六项消耗且不重新授予辰星石',()=>{
  const lead=member(3983);lead.snapshot={...lead.snapshot,selectedSoulId:2030};
  let game=Team.create([[lead,member(3056)],[member(3986,33888)]],[0,0],{seed:'chen-reborn',criticals:false});
  game.battle.fighters[0].hp=1;
  game=Team.turn(game,['potion:pp','wiki:33888']);
  const revived=game.battle.fighters[0];
  assert.equal(revived.soulState.chenReborn,true);
  const stats={...revived.stats};
  game=Team.turn(game,[{switchTo:1},'potion:pp']);
  game=Team.turn(game,[{switchTo:0},'potion:pp']);
  const back=game.battle.fighters[0];
  assert.deepEqual(back.stats,stats);
  assert.ok(back.soulState.chenReborn);
  assert.equal(require('../dist/shield-rules.js').sourceValue(back,'chen-entry'),0);
});

test('3568再次换入当回合实际挡住3576麻痹，下一回合同招实际施加成功',()=>{
  const foe=member(3576,20085);
  let game=Team.create([[member(3568),member(3056)],[foe]],[0,0],
    {seed:'cassis-entry-status',criticals:false});
  game=Team.turn(game,[{switchTo:1},'potion:pp']);
  game.battle.fighters[1].stages.acc=6;
  game=Team.turn(game,[{switchTo:0},'wiki:20085']);
  assert.equal(game.battle.fighters[0].soulState.teamEntry.number,2);
  assert.equal(game.battle.fighters[0].ailments['麻痹'],undefined);
  assert.equal(game.battle.fighters[1].soulState.actualMoveThisRound4658.move.id,'wiki:20085');
  game=Team.turn(game,['potion:pp','wiki:20085']);
  assert.ok(game.battle.fighters[0].ailments['麻痹']>=game.battle.round-1);
});

test('3586已击败目标时不转移弱化失败封换，4662封住中切的对手可真实阵亡补位',()=>{
  for(const [id,move] of [[3586,38119],[4662,37469]]){
    const game=Team.create([[member(id,move,{atk:id===3586?9999:200,spa:id===3586?9999:200,spe:9999})],
      [member(2988,null,{maxHp:id===3586?1:9000}),member(3223),member(3056)]],
      [0,0],{seed:'forced-through-switch-lock',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    let out=Team.turn(game,['wiki:'+move,'potion:pp']);
    if(id===4662){
      assert.deepEqual(Team.candidates(out,1),[]);
      out.battle.fighters[1].hp=1;
      const attack=out.battle.fighters[0].moves.find(k=>out.battle.moveDefinitions[k].power>0);
      out=Team.turn(out,[attack,'potion:pp']);
    }
    assert.deepEqual(out.pending,[1]);
    assert.deepEqual(Team.candidates(out,1,true),[1,2]);
    const next=Team.replace(out,[null,1]);
    assert.deepEqual(next.active,[0,1]);
    assert.deepEqual(Team.candidates(next,1),[2]);
  }
});

test('主动换下后按两招各自的来源分别授予接替者盾罩；未使用、受控未使用及死切不授予',()=>{
  const shield=require('../dist/shield-rules.js');
  for(const [id,move,amount] of [[4706,28881,240],[4800,38102,350]]){
    const raw=local.species(id).moves.find(m=>m.id===move),key='wiki:'+move;
    const source=effect=>[id,move,raw.revision,raw.effectIds.indexOf(effect)].join(':');
    for(const mode of ['switch','not-used','controlled','death']){
      const lead=member(id,move,{def:1}),foe=member(2988,10018,{atk:9999,spe:9999});
      let game=Team.create([[lead,member(3223),member(3056)],[foe,member(2987)]],
        [0,0],{seed:'switch-shield',criticals:false});
      const reserve=game.slots[0][1].fighter;
      shield.refresh(reserve,41,'other');shield.refreshBarrier(reserve,17,'other');
      if(mode==='controlled')game.battle.fighters[0].ailments['疲惫']=1;
      game=Team.turn(game,[mode==='not-used'?'potion:pp':key,'potion:pp']);
      assert.equal(shield.sourceValue(game.slots[0][1].fighter,source(1937)),0);
      if(mode==='death'){
        game=Team.turn(game,['potion:pp','wiki:10018']);
        assert.deepEqual(game.pending,[0]);
        game=Team.replace(game,[1,null]);
      }else{
        game=Team.turn(game,[{switchTo:1},{switchTo:1}]);
        assert.deepEqual(game.active,[1,1]);
      }
      const recipient=game.battle.fighters[0],expected=mode==='switch'?amount:0;
      assert.equal(shield.sourceValue(recipient,source(1937)),expected);
      assert.equal(shield.barrierSourceValue(recipient,source(1911)),expected);
      assert.equal(shield.sourceValue(recipient,'other'),41);
      assert.equal(shield.barrierSourceValue(recipient,'other'),17);
      assert.equal(shield.sourceValue(game.slots[0][2].fighter,source(1937)),0);
    }
  }
});

test('4247同招连续两次命中，主动换下时后继仅恢复一份200点体力',()=>{
  let game=Team.create([[member(4247,27655),member(3056)],[member(2988)]],[0,0],{seed:'refresh-1702',criticals:false});
  game.slots[0][1].fighter.hp=4000;
  for(let i=0;i<2;i++)game=Team.turn(game,['wiki:27655','potion:pp']);
  assert.equal(game.slots[0][1].fighter.hp,4000);
  game=Team.turn(game,[{switchTo:1},'potion:pp']);
  assert.equal(game.battle.fighters[0].hp,4200);
});

test('七个2105实例未击败在场对手才令首位阵亡替补消逝，保留其他替补及队列顺序',()=>{
  const cases=[[3516,38009],[4186,38147],[4642,37347],[4762,37913],
    [4875,38283],[4942,38524],[4995,38550]];
  const stateRules=require('../dist/status-rules.js');
  for(const [id,moveId] of cases){
    const versions=E.WIKI.versionSnapshots(local.species(id)).filter(v=>E.WIKI.availableMoves(v).some(m=>m.id===moveId));
    assert.ok(versions.length);
    for(const version of versions)for(const knockout of [false,true]){
      const move=version.moves.find(m=>m.id===moveId),moves=E.WIKI.defaultMoves(version);
      if(!moves.includes(moveId))moves[moves.findIndex(k=>!!version.moves.find(m=>m.id===k).fifth===!!move.fifth)]=moveId;
      const lead={snapshot:version,moves,build:{overrides:{maxHp:9000,atk:500,spa:500,spe:999}}};
      const foe=member(2988,null,{maxHp:knockout?1:9999,def:knockout?1:2000,spd:knockout?1:2000});
      const game=Team.create([[lead,member(3056)],[foe,member(3223),member(3056),member(2987),member(3311)]],
        [0,0],{seed:'first-vanished',criticals:false});
      const before=game.slots[1].map(slot=>slot.fighter);
      game.battle.fighters[0].stages.acc=6;
      before[1].hp=0;stateRules.vanish(game.battle,before[1],1);
      before[2].hp=0;before[3].hp=0;
      const out=Team.turn(game,['wiki:'+moveId,'potion:pp']);
      const fighters=out.slots[1].map(slot=>slot.fighter);
      assert.equal(fighters[0].hp===0,knockout,String(moveId));
      assert.equal(out.battle.vanishedCount,knockout?1:2,String(moveId));
      assert.equal(fighters[1].stats.maxHp,0);
      assert.equal(fighters[2].stats.maxHp,knockout?9000:0,String(moveId));
      assert.equal(fighters[3].stats.maxHp,9000);
      assert.ok(fighters[4].hp>0);
    }
  }
});

test('普通阵亡计数排除消逝者，已消逝的在场者死切后仍保持零体力上限',()=>{
  let game=Team.create([[member(4677,28836),member(2988),member(3223)],[member(2988)]],
    [0,0],{seed:'vanished-count',criticals:false});
  const rules=require('../dist/status-rules.js'),bench=game.slots[0][1].fighter;
  bench.hp=0;rules.vanish(game.battle,bench,1);
  game.slots[0][2].fighter.hp=0;
  game.battle.fighters[0].hp=4000;
  const out=Team.turn(game,['wiki:28836','potion:pp']);
  assert.equal(out.battle.fighters[0].hp,4100);
  assert.deepEqual(out.battle.damageEvents.filter(e=>e.type==='fixed'&&e.sourceSide===0).map(e=>e.settledDamage),[100]);

  game=Team.create([[member(4643,null,{maxHp:1,def:1}),member(3056),member(3223)],[member(2988,10018,{atk:9999,spa:9999,spe:9999})]],
    [0,0],{seed:'vanished-replacement',criticals:false});
  const attack='wiki:10018';
  const ko=Team.turn(game,['potion:pp',attack]);
  assert.deepEqual(ko.pending,[0]);
  assert.ok(ko.battle.fighters[0].soulState.vanished);
  const next=Team.replace(ko,[1,null]);
  assert.equal(next.slots[0][0].fighter.stats.maxHp,0);
  assert.ok(next.slots[0][0].fighter.soulState.vanished);
});

test('六个1955逐实例回复场下全体，部分损血、溢出、阵亡与换入后的HP均独立',()=>{
  for(const [id,move,amount] of [[4516,36662,100],[4600,37121,100],[4654,28754,300],
    [4713,37755,200],[4800,38087,650],[4853,29232,100]]){
    const roster=[member(id,move),member(3056),member(3223),member(2987)];
    let game=Team.create([roster,[member(2988),member(3056)]],[0,0],{seed:'bench-1955',criticals:false});
    const reserves=game.slots[0].slice(1).map(slot=>slot.fighter);
    reserves[0].hp=4000;reserves[1].hp=8999;reserves[2].hp=0;
    game=Team.turn(game,['wiki:'+move,'potion:pp']);
    assert.deepEqual(game.slots[0].slice(1).map(slot=>slot.fighter.hp),[4000+amount,9000,0],String(move));
    // 斯布林蒂主动下场时，三级链接会把刚验证过的场下 HP 同步为出场者当前 HP。
    const entryHp=id===4600?game.battle.fighters[0].hp:4000+amount;
    if(game.pending.includes(0))game=Team.replace(game,[1,game.pending.includes(1)?1:null]);
    else {
      if(game.pending.includes(1))game=Team.replace(game,[null,1]);
      game=Team.turn(game,[{switchTo:1},'potion:pp']);
    }
    assert.equal(game.battle.fighters[0].hp,entryHp,String(move));
  }
});

test('1307保留固定100与参数70两版，击败时跳过场下恢复',()=>{
  for(const [id,move,amount] of [[3311,38634,70],[3550,31582,100]]){
    for(const defeated of [false,true]){
      const lead=member(id,move,{atk:1500,spa:1500});
      if(id===3311)lead.moves=[38635,38633,29506,29507,38634];
      const target=member(2988,null,{maxHp:defeated?1:9999});
      const game=Team.create([[lead,member(3223)],[target,member(3056)]],[0,0],
        {seed:'bench-1307',criticals:false});
      game.slots[0][1].fighter.hp=4000;
      const out=Team.turn(game,['wiki:'+move,'potion:pp']);
      assert.equal(out.battle.fighters[1].hp===0,defeated);
      assert.equal(out.slots[0][1].fighter.hp,4000+(defeated?0:amount),String(move));
    }
  }
});

test('弗丽嘉两份50%存活贡献相加必定全属性+2',()=>{
  for (const seed of ['chance-A','chance-B','chance-C','chance-D']) {
    const game=Team.create([[member(4498,28289),member(3056)],[member(2988)]],[0,0],{seed,criticals:false});
    const result=Team.turn(game,['wiki:28289','potion:pp']);
    for(const key of ['atk','def','spa','spd','spe','acc'])assert.equal(result.battle.fighters[0].stages[key],2,key);
  }
});

test('4706非唯一存活时原属性第五按存活差形成特攻红伤，平员时不造成红伤',()=>{
  function hits(other,stats){
    const team=[member(4706,28886,stats),member(3056)],foes=[member(2988),member(3223),...other];
    const game=Team.create([team,foes],[0,0],{seed:'4706-special',criticals:false});
    assert.equal(game.battle.fighters[0].soulState.ophelia4706.soleActive,false);
    assert.ok(E.availableMoves(game.battle.fighters[0],game.battle.round).includes('wiki:28886'));
    const out=Team.turn(game,['wiki:28886','potion:pp']);
    return (out.battle.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0).map(e=>e.hpLoss);
  }
  assert.deepEqual(hits([],{atk:100,spa:300}),[]);
  const small=hits([member(3056)],{atk:100,spa:300});
  assert.ok(small[0]>0);
  assert.deepEqual(hits([member(3056)],{atk:800,spa:300}),small);
  assert.ok(hits([member(3056)],{atk:100,spa:600})[0]>small[0]);
});

test('重生之翼按魂印概率从两名阵亡队友中抽取一名，复活时逐槽回满PP和HP',()=>{
  for (const soul of [372,574]){
    const outcomes=new Set();
    for(let seed=0;seed<48;seed++){
      const wing=member(2987,undefined,{maxHp:1,def:1,spe:1});
      wing.snapshot.selectedSoulId=soul;
      const game=Team.create([[wing,member(3056),member(3223)],[member(2988,10018,{atk:9999,spe:9999})]],[0,0],{seed:'revive-'+seed,criticals:false});
      assert.equal(game.battle.fighters[0].soulId,soul);
      for(const slot of game.slots[0].slice(1)){
        slot.fighter.hp=0;
        for(const k of slot.fighter.moves)slot.fighter.pp[k]=0;
      }
      const out=Team.turn(game,['potion:pp','wiki:10018']);
      assert.equal(out.battle.fighters[0].hp,0);
      const revived=out.slots[0].slice(1).filter(slot=>slot.fighter.hp>0);
      assert.ok(revived.length<=1);
      outcomes.add(revived[0]?.fighter.number??0);
      if(revived.length){
        const f=revived[0].fighter;
        assert.equal(f.hp,f.stats.maxHp);
        const slot=out.slots[0].indexOf(revived[0]),entry=Team.replace(out,[slot,null]);
        for(const k of f.moves)assert.equal(f.pp[k],entry.battle.moveDefinitions[k].pp,k);
      }else assert.equal(soul,372);
      if(outcomes.size===(soul===372?3:2))break;
    }
    assert.equal(outcomes.size,soul===372?3:2);
  }
});

test('3001击败后继任者承受三分之一上限的百分比伤害，中切再登场不重复',()=>{
  const game=Team.create([[member(3001,15650,{atk:9999,spa:9999,spe:9999})],
    [member(2988,undefined,{maxHp:1,def:1}),member(3056),member(3223)]],[0,0],{seed:'entry-percent',criticals:false});
  let out=Team.turn(game,['wiki:15650','potion:pp']);
  assert.deepEqual(out.pending,[1]);
  out=Team.replace(out,[null,1]);assert.equal(out.battle.fighters[1].stats.maxHp,9000);
  assert.equal(out.battle.fighters[1].hp,6000);
  assert.ok(out.battle.damageEvents.some(e=>e.type==='percent'&&e.hpLoss===3000));
  out=Team.turn(out,['potion:pp',{switchTo:2}]);
  out=Team.turn(out,['potion:pp',{switchTo:1}]);
  assert.equal(out.battle.fighters[1].hp,6000);
});

test('五只精灵恢复的14组版本逐一合法配招和真实换入，波塞冬两魂印均能实用道具第五',()=>{
  for(const [id,count] of [[3407,2],[3425,4],[3482,2],[3506,4],[3529,2]]){
    const s=local.species(id),versions=E.WIKI.versionSnapshots(s);
    assert.deepEqual(E.WIKI.skillVersionIssues(s,true),[]);
    assert.equal(versions.length,count);
    for(const snapshot of versions){
      const group=snapshot.skillVersions.find(g=>g.id===snapshot.selectedSkillVersion);
      const moves=E.WIKI.defaultMoves(snapshot),fifth=E.WIKI.availableMoves(snapshot).filter(m=>m.fifth);
      assert.equal(fifth.length,1);assert.ok(moves.includes(fifth[0].id));
      const config={...member(id),snapshot,moves};
      let game=Team.create([[member(3056),config],[member(2988)]],[0,0],{seed:'version-entry',criticals:false});
      game=Team.turn(game,[{switchTo:1},'potion:pp']);
      const key='wiki:'+fifth[0].id,f=game.battle.fighters[0];assert.equal(f.soulId,group.soulId);
      assert.ok(f.moves.includes(key));
      if(id===3506 && fifth[0].id===37278){
        const out=Team.turn(game,[key,'potion:pp']);assert.equal(out.battle.fighters[0].pp[key],f.pp[key]-1);
      }
    }
    const broken=structuredClone(s);broken.skillVersions[0].moveIds=broken.skillVersions[0].moveIds.slice(1);
    assert.ok(E.WIKI.skillVersionIssues(broken,true).length>0);
  }
});

function memberWithMove(id,move,stats={},soulId=null){
  const snapshot=E.WIKI.versionSnapshots(local.species(id)).find(s=>(soulId==null||s.selectedSoulId===soulId)&&E.WIKI.availableMoves(s).some(m=>m.id===move));
  assert.ok(snapshot,'版本配招 '+id+'/'+move);
  const moves=E.WIKI.defaultMoves(snapshot);
  if(!moves.includes(move))moves[1]=move;
  return {snapshot,moves,build:{overrides:{maxHp:9000,spe:999,...stats}}};
}

test('23个击败吸取实例用各自真实第五和分母，在继任者登场时按上限吸取',()=>{
  const cases=[[3020,19220,3],[3102,19565,3],[3407,30955,3],[3482,31357,3],[3482,37466,3],
    [3506,36406,3],[3506,37278,3],[3529,37313,2],[3672,32335,3],[3672,37297,3],[3847,33208,3],
    [3883,33388,3],[3883,37336,3],[3945,33716,3],[3945,37335,3],[4113,34252,3],[4113,34527,3],
    [4186,34900,3],[4186,37295,2],[4327,35653,3],[4376,34252,3],[4394,35990,3],[4755,37899,3]];
  for(const [id,move,divisor] of cases){
    const game=Team.create([[memberWithMove(id,move,{atk:9999,spa:9999,spe:9999}),member(3223)],
      [member(2988,null,{maxHp:1,def:1,spd:1}),member(3056)]],[0,0],{seed:'840',criticals:false});
    game.battle.fighters[0].stages.acc=6;game.battle.fighters[0].hp=1;
    let out=Team.turn(game,['wiki:'+move,'potion:pp']);assert.deepEqual(out.pending,[1],String(move));
    out.battle.fighters[0].hp=1000;
    out=Team.replace(out,[null,1]);
    assert.ok(out.battle.damageEvents.some(e=>e.type==='percent'&&e.targetSide===1&&e.hpLoss===9000/divisor),JSON.stringify([move,out.history.slice(-12),out.battle.damageEvents.slice(-2)]));
    assert.equal(out.battle.fighters[0].hp,1000+9000/divisor,String(move));
  }
});

test('3022连续命中累计13%至52%封顶，继任者仅承受一次；3036仅击败时触发25%',()=>{
  for(const [id,move,count,knockout,percent] of [[3022,19230,1,false,13],[3022,19230,5,false,52],[3036,19295,1,true,25],[3036,19295,1,false,0]]){
    const game=Team.create([[memberWithMove(id,move)],[member(2988,null,{maxHp:knockout?1:9999,def:9999,spd:9999}),member(3056),member(3223)]],[0,0],{seed:'entry-percent-cap',criticals:false});
    let out=game;
    for(let n=0;n<count;n++){
      out.battle.fighters[0].stages.acc=6;out=Team.turn(out,['wiki:'+move,'potion:pp']);
    }
    if(knockout)out=Team.replace(out,[null,1]);else out=Team.turn(out,['potion:pp',{switchTo:1}]);
    assert.equal(out.battle.fighters[1].stats.maxHp,9000);
    assert.equal(out.battle.fighters[1].hp,9000*(100-percent)/100,String(move));
    out=Team.turn(out,['potion:pp',{switchTo:2}]);assert.equal(out.battle.fighters[1].hp,9000);
  }
});

test('18个67实例逐一验证击败后的分母和继任者当前HP，上限保留',()=>{
  const cases=[[3001,15650,3],[3001,19144,3],[3079,16105,4],[3141,17178,2],[3141,19724,2],[3190,15857,4],[3200,10778,3],[3205,17809,4],[3223,30073,2],[3227,30095,3],[3481,31351,2],[3529,31600,2],[3941,10778,3],[4327,30073,2],[4468,36389,3],[4716,37778,3],[4885,38316,3],[4888,38342,3]];
  for(const [id,move,divisor] of cases){
    const game=Team.create([[memberWithMove(id,move,{atk:9999,spa:9999,spe:9999}),member(3227===id?3056:3227)],
      [member(2988,null,{maxHp:1,def:1,spd:1}),member(3056)]],[0,0],{seed:'kill67',criticals:false});
    game.battle.fighters[0].stages.acc=6;game.slots[1][1].fighter.hp=8500;
    let out=Team.turn(game,['wiki:'+move,'potion:pp']);assert.deepEqual(out.pending,[1],String(move));
    out=Team.replace(out,[null,1]);
    assert.equal(out.battle.fighters[1].stats.maxHp,9000,String(move));
    assert.equal(out.battle.fighters[1].hp,8500-9000/divisor,String(move));
  }
});

test('九个主动离场回血实例各自连续命中只保留一份，恢复量逐招核对',()=>{
  for(const [id,move,n] of [[4247,27655,200],[4338,35714,200],[4445,36257,240],[4524,36703,300],[4599,28583,300],[4643,37352,300],[4658,28768,400],[4695,37677,300],[4840,38163,200]]){
    let game=Team.create([[memberWithMove(id,move),member(3056)],[member(2988),member(3223)]],[0,0],{seed:'heal1702',criticals:false});
    game.slots[0][1].fighter.hp=3500;
    for(let i=0;i<2;i++){
      game.battle.fighters[0].stages.acc=6;
      game=Team.turn(game,['wiki:'+move,'potion:pp']);
    }
    assert.equal(game.slots[0][1].fighter.hp,3500,String(move));
    const control=structuredClone(game);
    delete control.battle.fighters[0].soulState.onVoluntaryExit;
    const baseline=Team.turn(control,[{switchTo:1},'potion:pp']);
    game=Team.turn(game,[{switchTo:1},'potion:pp']);
    assert.equal(game.battle.fighters[0].hp-baseline.battle.fighters[0].hp,n,String(move));
    const events=game.battle.entryEvents.filter(e=>e.text.includes('主动切换后继回复'));
    assert.equal(events.length,1,String(move));
  }
});

test('六个1779按真实换人次数由当前在场队友吸取；次数耗尽后再次换人无吸取',()=>{
  for(const [id,move,uses] of [[3954,28341,1],[4030,29337,3],[4373,35892,1],[4524,36703,1],[4553,28436,1],[4599,28583,2]]){
    let game=Team.create([[memberWithMove(id,move),member(3056)],[member(2988),member(3223),member(3056)]],[0,0],{seed:'entry-drain-count',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    game=Team.turn(game,['wiki:'+move,'potion:pp']);
    game.slots[0][1].fighter.hp=1000;
    for(let n=0;n<=uses;n++){
      const target=n%2===0?1:2;
      game=Team.turn(game,[n===0?{switchTo:1}:'potion:pp',{switchTo:target}]);
      const entries=game.battle.entryEvents.map(e=>e.text).filter(t=>t.includes('继任者登场吸取'));
      assert.equal(entries.filter(t=>t.includes('损失 3000')).length,n<uses?1:0,String(move));
      if(n===0)assert.ok(entries.some(t=>t.includes('回复 3000')),String(move));
    }
  }
});

test('击败后的1128与1827由施放者持有，910按连续回合结束',()=>{
  for(const [id,move,effect] of [
    [3322,30515,1128],[3514,31519,1128],[3516,31529,1128],[3516,38010,1128],[3577,31847,1128],
    [3613,30515,1128],[3652,32233,1128],[4354,35793,1128],[4354,38348,1128],[4400,28030,1128],
    [4510,36611,1128],[4554,36857,1128],[4400,28031,1827],[4501,36289,1827],[4501,36566,1827],
    [4510,36612,1827],[4618,37203,1827],[4676,37511,1827],[3079,19481,910],[3150,19765,910],
    [3629,32138,910],[3665,32300,910],[3971,33835,910],[4004,33994,910],[4233,35146,910]
  ]){
    const reserve=member(3056,20117,{atk:500});
    const game=Team.create([[memberWithMove(id,move,{atk:9999,spa:9999,spe:9999}),member(3223)],
      [member(2988,null,{maxHp:1,def:1,spd:1}),reserve]],[0,0],{seed:'inherited-block',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    if(id===3971)game.battle.fighters[0].hp=1;
    let out=Team.turn(game,['wiki:'+move,'potion:pp']);assert.deepEqual(out.pending,[1],String(move));
    out=Team.replace(out,[null,1]);const f=out.battle.fighters[1];
    const attack=f.moves.find(k=>out.battle.moveDefinitions[k].power>0),status='wiki:20117';
    const key=effect===1128?attack:status,other=effect===1128?status:attack;
    if(effect!==910)out=Team.turn(out,['potion:pp',other]);
    const times=effect===910?2:1;
    for(let i=0;i<times;i++){
      const before=out.battle.fighters[1],pp=before.pp[key];
      out=Team.turn(out,['potion:pp',key]);
      assert.equal(out.battle.fighters[1].pp[key],pp-1,String(move));
      if(effect===1128)assert.ok(!(out.battle.damageEvents??[]).some(e=>e.round===out.battle.round-1&&e.sourceSide===1&&e.type==='attack'),JSON.stringify([move,out.history.slice(-12)]));
      else assert.equal(out.battle.fighters[1].stages.atk,before.stages.atk,JSON.stringify([id,move,out.history.slice(-12)]));
    }
    const before=out.battle.fighters[1].stages.atk;
    out=Team.turn(out,['potion:pp',key]);
    if(effect===1128)assert.ok(out.battle.damageEvents.some(e=>e.round===out.battle.round-1&&e.sourceSide===1&&e.type==='attack'));
    else assert.equal(out.battle.fighters[1].stages.atk,before+1);
  }
});

test('4069两版实际攻击击败后，继任者失神并随机清空两个不同PP槽，免异与PP保护独立',()=>{
  for(const soul of [1315,1562]){
    const pairs=new Set();
    for(const [seed,immune,protectedPP] of [[1,false,false],[2,false,false],[3,true,false],[4,false,true],[5,false,false]]){
      const lead=member(4069,10086,{atk:9999,spe:9999});lead.snapshot.selectedSoulId=soul;
      const game=Team.create([[lead],[member(2988,null,{maxHp:1,def:1}),member(3056)]],[0,0],{seed:'lotus-ko-'+seed,criticals:false});
      const reserve=game.slots[1][1].fighter;
      if(immune)reserve.counts.immune=1;
      if(protectedPP)reserve.effects['免疫PP削减']={start:2,end:3};
      let out=Team.turn(game,['wiki:10086','potion:pp']);assert.deepEqual(out.pending,[1]);
      out=Team.replace(out,[null,1]);const f=out.battle.fighters[1];
      assert.equal(!!f.ailments['失神'],!immune);
      const cleared=f.moves.filter(k=>f.pp[k]===0);assert.equal(cleared.length,protectedPP?0:2);
      if(!protectedPP)pairs.add(cleared.join('/'));
      for(const k of f.moves.filter(k=>!cleared.includes(k)))assert.equal(f.pp[k],reserve.pp[k]);
    }
    assert.ok(pairs.size>1);
  }
});

test('十个698按各招概率和状态施于真实继任者，免异时不附加',()=>{
  for(const [id,move,chance,status] of [[3205,17809,50,'睡眠'],[3631,32145,50,'瘫痪'],[3686,32406,100,'害怕'],
    [4184,34893,50,'瘫痪'],[4395,35994,100,'冰封'],[4467,36377,100,'束缚'],[4514,36652,100,'烧伤'],
    [4762,37914,100,'诅咒'],[4822,38111,100,'易燃'],[4894,38351,100,'害怕']]){
    const outcomes=new Set();
    for(let seed=0;seed<28;seed++){
      const immune=seed===0;
      const game=Team.create([[memberWithMove(id,move,{atk:9999,spa:9999,spe:9999})],
        [member(2988,null,{maxHp:1,def:1,spd:1}),member(3056)]],[0,0],{seed:'entry-698-'+seed,criticals:false});
      if(immune)game.slots[1][1].fighter.counts.immune=1;
      if(id===4762)game.battle.fighters[0].soulState.magicCurse1973=2;
      game.battle.fighters[0].stages.acc=6;
      let out=Team.turn(game,['wiki:'+move,'potion:pp']);assert.deepEqual(out.pending,[1],String(move));
      out=Team.replace(out,[null,1]);
      const applied=!!out.battle.fighters[1].ailments[status];
      if(immune)assert.equal(applied,false,String(move));else {outcomes.add(applied);if(chance===100)assert.ok(applied,String(move));}
      if(outcomes.size===(chance===100?1:2))break;
    }
    assert.equal(outcomes.size,chance===100?1:2,String(move));
  }
});

test('826击败后的下回合开始才从共享异常池抽取，先中切则实际换入者承接',()=>{
  for(const [id,move,count] of [[3056,19368,1],[3066,19416,1],[3578,31853,1],[4105,34484,1],[4387,35950,2],[4586,36999,2]]){
    const game=Team.create([[memberWithMove(id,move,{atk:9999,spa:9999,spe:9999})],
      [member(2988,null,{maxHp:1,def:1,spd:1}),member(3056),member(3223)]],[0,0],{seed:'team-826',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    let out=Team.turn(game,['wiki:'+move,'potion:pp']);assert.deepEqual(out.pending,[1],String(move));
    out=Team.replace(out,[null,1]);assert.equal((out.battle.randomStatusEvents??[]).filter(e=>e.effectId===826).length,0);
    out=Team.turn(out,['potion:pp',{switchTo:2}]);assert.equal(out.active[1],2);
    const events=out.battle.randomStatusEvents.filter(e=>e.effectId===826);
    assert.equal(events.length,count,String(move));
    assert.deepEqual(out.slots[1][1].fighter.ailments,{});
    assert.ok(events.every(e=>e.round===2));
    out=Team.turn(out,['potion:pp','potion:pp']);
    assert.equal(out.battle.randomStatusEvents.filter(e=>e.effectId===826).length,count);
  }
});

test('1090六个真实实例在下一回合封住继任者的攻击及命中附效，按各自期限解除',()=>{
  for(const [id,move,duration] of [[4246,35220,1],[4364,35846,1],[4364,37340,2],[4386,35945,2],[4535,36762,2],[4679,37522,1]]){
    const game=Team.create([[memberWithMove(id,move,{atk:9999,spa:9999,spe:9999}),member(3223)],
      [member(2988,null,{maxHp:1,def:1,spd:1}),member(3056)]],[0,0],{seed:'block1090',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    let out=Team.turn(game,['wiki:'+move,'potion:pp']);assert.deepEqual(out.pending,[1],String(move));
    out=Team.replace(out,[null,1]);const f=out.battle.fighters[1],attack=f.moves.find(k=>out.battle.moveDefinitions[k].power>0&&out.battle.moveDefinitions[k].alwaysHit);assert.ok(attack,'use original always-hit attack instead of mid-battle accuracy writes');
    for(let n=0;n<=duration;n++){
      out=Team.turn(out,[n===0?{switchTo:1}:'potion:pp',attack]);
      const events=out.battle.damageEvents.filter(e=>e.round===out.battle.round-1&&e.sourceSide===1);
      if(n<duration)assert.equal(events.length,0,String(move));else assert.ok(events.some(e=>e.type==='attack'&&e.hpLoss>0),String(move));
    }
  }
});

test('4714先阵亡再被574复活，补位后先制按本次存活名单重新计算',()=>{
  for(const hasTeammate of [false,true]){
    const lead=member(4714,37745,{spe:100,def:1}),wing=member(2987,null,{def:1,spe:100});
    wing.snapshot.selectedSoulId=574;
    const roster=[lead,wing];if(hasTeammate)roster.push(member(3056));
    const enemy=[member(2988,10018,{atk:9999,spe:9999}),member(4714,37745,{spe:900})];
    let game=Team.create([roster,enemy],[0,0],{seed:'revived-priority',criticals:false});
    game.battle.fighters[0].hp=1;
    game=Team.turn(game,['potion:pp','wiki:10018']);assert.deepEqual(game.pending,[0]);
    game=Team.replace(game,[1,null]);game.battle.fighters[0].hp=1;
    game=Team.turn(game,['potion:pp','wiki:10018']);assert.deepEqual(game.pending,[0]);
    assert.equal(game.slots[0][0].fighter.hp,9000);
    game=Team.replace(game,[0,null]);assert.equal(game.battle.fighters[0].soulState.teamEntry.number,2);
    game=Team.turn(game,['potion:pp',{switchTo:1}]);
    const out=Team.turn(game,['wiki:37745','wiki:37745']);
    assert.equal(out.battle.turns.at(-1).first,hasTeammate?1:0);
  }
});

test('十个强化实例按各自存活或阵亡方合计一次概率，零份、恰到阈值和封顶分别判定',()=>{
  const cases=[[4182,27490,1665,10],[4186,27497,1669,10],[4186,29188,1665,20],
    [4364,27950,1669,20],[4498,28289,1669,50],[4521,28351,2032,50],[4680,28815,1665,30],
    [4814,29144,1669,50],[4850,29222,2032,25],[13311,29503,1669,35]];
  for(const [id,move,effect,rate] of cases){
    const config=memberWithMove(id,move),m=config.snapshot.moves.find(v=>v.id===move);
    const op=E.WIKI.compile(m,config.snapshot).operations.find(v=>v.effectId===effect);
    assert.deepEqual(op.sourceArgs,[1,rate]);
    for(const count of effect===1669?[1,2,5]:[0,1,5]){
      const threshold=Math.min(1,count*rate/100);
      for(const value of [Math.max(0,threshold-.001),Math.min(.999,threshold)]){
        const a={hp:100},t={hp:100};let calls=0,stage;
        const own=[a],opposing=[t];
        for(let i=0;i<5;i++){
          own.push({hp:effect===1669?(i<count-1?100:0):effect===1665&&i<count?0:100});
          opposing.push({hp:effect===2032&&i<count?0:100});
        }
        E.WIKI.effectsEngine.registry[effect].execute({a,t,m,teamMode:true,teamMembers:f=>f===a?own:opposing,
          random(){calls++;return value;},stage(f,n){assert.equal(f,a);stage=n;}},op.sourceArgs);
        assert.equal(stage,threshold===1||value<threshold?2:1);
        assert.equal(calls,threshold>0&&threshold<1?1:0);
      }
    }
    const game=Team.create([[config,member(3056)],[member(id===4814?4677:2988),member(3223)]],[0,0],{seed:'actual-stage-count',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    const out=Team.turn(game,['wiki:'+move,'potion:pp']);
    const fighter=out.battle.fighters[0];
    assert.equal(fighter.soulState.actualMoveThisRound4658.move.id,'wiki:'+move);
    assert.ok(fighter.stages.def===1||fighter.stages.def===2,String(move));
    if(effect===1669&&rate===50)assert.equal(fighter.stages.def,2);
  }
});

test('重生之翼574六层击败后清空能量并对继任者下一回合先制+3，五层或普通版不获奖励',()=>{
  for(const [soul,energy,bonus] of [[574,6,3],[574,5,0],[372,5,0]]){
    const lead=member(2987,10004,{atk:800,spe:100});lead.snapshot.selectedSoulId=soul;
    let game=Team.create([[lead],[member(2988,null,{maxHp:1,def:1}),member(3056,20117,{spe:999})]],[0,0],{seed:'wing-ko',criticals:false});
    game.battle.fighters[0].soulState.energy=energy;
    game=Team.turn(game,['wiki:10004','potion:pp']);assert.deepEqual(game.pending,[1]);
    game=Team.replace(game,[null,1]);
    if(bonus)assert.equal(game.battle.fighters[0].soulState.energy,0);
    game=Team.turn(game,['wiki:10004','wiki:20117']);
    const log=game.battle.turns.at(-1).events.map(e=>e.text).join('\n');
    if(bonus){assert.equal(game.battle.turns.at(-1).first,0);assert.match(log,/先制 3 \/ 0/);}
    else assert.doesNotMatch(log,/先制 3 \/ 0/);
    game=Team.turn(game,['wiki:10004','wiki:20117']);
    assert.doesNotMatch(game.battle.turns.at(-1).events.map(e=>e.text).join('\n'),/先制 3 \/ 0/);
  }
});

test('五个1319在使用者真实阵亡时给继任者逐项强化，正常换下不授予',()=>{
  for(const [id,move,boosts] of [[4109,27304,[1,0,0,0,1,0]],[4347,27304,[1,0,0,0,1,0]],
    [4503,36577,[2,2,0,0,0,0]],[4632,37294,[2,0,2,0,2,0]],[4713,37690,[1,0,0,0,0,0]]]){
    let game=Team.create([[memberWithMove(id,move,{def:1}),member(3056)],[member(2988,10018,{atk:9999,spe:9999})]],[0,0],{seed:'1319',criticals:false});
    game=Team.turn(game,['wiki:'+move,'potion:pp']);
    const switched=Team.turn(game,[{switchTo:1},'potion:pp']);
    assert.deepEqual(Object.values(switched.battle.fighters[0].stages),[0,0,0,0,0,0],String(move));
    game=Team.turn(game,['potion:pp','wiki:10018']);
    if(id===4713){
      assert.deepEqual(game.pending,[]);assert.equal(game.battle.fighters[0].hp,9000);
      game=Team.turn(game,['potion:pp','wiki:10018']);
    }
    assert.deepEqual(game.pending,[0],String(move));
    game=Team.replace(game,[1,null]);
    assert.deepEqual(['atk','def','spa','spd','spe','acc'].map(k=>game.battle.fighters[0].stages[k]),boosts,String(move));
  }
});

test('八个2162在真实击败时消费已获得的异常效果；下一次击败不会再施加',()=>{
  for(const [id,move,attack,status] of [[3575,37298,10234,'诅咒'],[4649,37392,10086,'焚烬'],[4826,38125,38123,'流血'],
    [4830,38137,38123,'流血'],[4853,38173,38206,'焚烬'],[4865,38246,10361,'麻痹'],[4895,38355,38359,'麻痹'],[4930,29419,38483,'臣服']]){
    const lead=memberWithMove(id,move);if(!lead.moves.includes(attack))lead.moves[2]=attack;
    let game=Team.create([[lead],[member(2988,null,{def:9999,spd:9999}),member(3056),member(3223)]],[0,0],{seed:'armed-2162',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    game=Team.turn(game,['wiki:'+move,'potion:pp']);assert.deepEqual(game.pending,[],String(move));
    assert.equal(game.slots[1][1].fighter.ailments[status],undefined);
    for(let i=1;i<=2;i++){
      game.battle.fighters[1].hp=1;
      game=Team.turn(game,['wiki:'+attack,'potion:pp']);assert.deepEqual(game.pending,[1],String(move));
      game=Team.replace(game,[null,i]);
      assert.equal(!!game.battle.fighters[1].ailments[status],i===1,JSON.stringify([move,game.history.slice(-19),game.battle.fighters[1].ailments]));
    }
  }
});

test('五个2017与两个934从真实补位回合计算先制，物品不受影响，达到时限恢复',()=>{
  for(const [id,move,duration,priority] of [[3705,36944,1,0],[4521,36690,1,0],[4680,37525,1,0],
    [4762,37913,1,0],[4946,38538,1,0],[4421,36131,2,1],[4442,36251,2,1]]){
    let game=Team.create([[memberWithMove(id,move,{atk:9999,spa:9999,spe:900}),member(3056)],
      [member(2988,null,{maxHp:1,def:1,spd:1}),member(2987,19100,{spe:100,atk:50})]],[0,0],{seed:'entry-priority',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    game=Team.turn(game,['wiki:'+move,'potion:pp']);assert.deepEqual(game.pending,[1],String(move));
    game=Team.replace(game,[null,1]);
    for(let n=0;n<=duration;n++){
      game=Team.turn(game,['potion:pp','wiki:19100']);
      const round=game.battle.turns.at(-1);
      const order=round.events.find(e=>e.text.includes('先制 ')).text;
      assert.equal(round.first,1,String(move));
      assert.ok(order.includes('先制 -100 / '+(n<duration?priority:3)+'，'),JSON.stringify([move,order]));
    }
  }
});

test('八个883和第二个892实例按各自参数给真实下一只结算伤害，受击者上限一致',()=>{
  for(const [id,move,rate,kill] of [[3022,19230,13,false],[3524,31567,10,false],[3592,31928,10,false],
    [4186,34898,10,false],[4216,35055,10,false],[4288,35441,20,false],[4686,37622,15,false],
    [4712,37742,20,false],[4690,37650,25,true]]){
    const source=memberWithMove(id,move),foe=member(2988,null,{maxHp:kill?1:9999,def:9999,spd:9999});
    let game=Team.create([[source],[foe,member(3056)]],[0,0],{seed:'entry-fraction',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    game=Team.turn(game,['wiki:'+move,'potion:pp']);
    const grant=game.battle.teamEntryGrants[1].find(g=>g.effectId===(kill?892:883));
    assert.deepEqual([grant.numerator,grant.denominator],[rate,100],String(move));
    game=kill?Team.replace(game,[null,1]):Team.turn(game,['potion:pp',{switchTo:1}]);
    assert.equal(game.battle.fighters[1].stats.maxHp,9000,String(move));
    const damage=game.battle.damageEvents.filter(e=>e.type==='percent'&&e.sourceSide===0&&e.targetSide===1);
    assert.ok(damage.some(e=>e.hpLoss===90*rate*(id===4690?1.2:1)),JSON.stringify([move,game.history.slice(-12),damage]));
  }
});

test('九个满体吸取支援实例在吸取开始前检查HP，吸取后才回满不触发，阵亡替补不回复',()=>{
  const cases=[[4135,36521,100],[4347,27907,100],[4445,36262,120],[4685,28866,120],[4761,29056,100],
    [3550,25899,100],[4635,28708,100],[4706,28885,100],[4930,29420,100]];
  for(const [id,move,amount] of cases)for(const hp of [9000,8000]){
    const game=Team.create([[memberWithMove(id,move),member(3056),member(3223),member(2987)],
      [member(2988,null,{maxHp:9999}),member(3056)]],[0,0],{seed:'full-before-drain',criticals:false});
    game.battle.fighters[0].hp=hp;game.battle.fighters[0].stages.acc=6;
    if(id===4635){delete game.battle.fighters[0].ailments['流血'];delete game.battle.fighters[0].ailments['寄生'];}
    const bench=game.slots[0].slice(1).map(v=>v.fighter);bench[0].hp=4000;bench[1].hp=8990;bench[2].hp=0;
    const out=Team.turn(game,['wiki:'+move,'potion:pp']);
    assert.equal(out.battle.fighters[0].hp,9000,JSON.stringify([move,hp,out.history.slice(-18)]));
    assert.deepEqual(out.slots[0].slice(1).map(v=>v.fighter.hp),hp===9000?[4000+amount,9000,0]:[4000,8990,0],String(move));
  }
});

test('七个1510仅监听期限内主动切入，实际回合初从公共池抽取对应次数',()=>{
  for(const [id,move,turns,count] of [[4208,27549,4,2],[4305,27797,4,2],[4600,37123,2,2],
    [4635,28706,3,2],[4642,27109,2,1],[4915,29378,3,1],[4951,38571,3,2]]){
    let game=Team.create([[memberWithMove(id,move)],[member(2988),member(3056),member(3223)]],[0,0],{seed:'voluntary-1510',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    game=Team.turn(game,['wiki:'+move,'potion:pp']);
    const events=s=>(s.battle.randomStatusEvents??[]).filter(e=>e.effectId===1510);
    assert.equal(events(game).length,0,String(move));
    const first=Team.turn(game,['potion:pp',{switchTo:1}]);
    assert.equal(events(first).length,count,String(move));
    for(let i=1;i<turns;i++)game=Team.turn(game,['potion:pp','potion:pp']);
    game=Team.turn(game,['potion:pp',{switchTo:1}]);
    assert.equal(events(game).length,0,String(move));
  }
});

test('2040六个真实主动换入窗口分别施加对应异常，强制补位不触发',()=>{
  for(const [id,move,status] of [[4589,37039,'烧伤'],[4642,28718,'失神'],[4654,28752,'冻伤'],
    [4674,37540,'瘫痪'],[4750,29014,'中毒'],[4930,38485,'臣服']]){
    const lead=memberWithMove(id,move);
    let game=Team.create([[lead],[member(2988),member(3056),member(3223)]],[0,0],{seed:'voluntary-2040',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    game=Team.turn(game,['wiki:'+move,'potion:pp']);assert.deepEqual(game.pending,[],String(move));
    const out=Team.turn(game,['potion:pp',{switchTo:1}]);
    assert.ok(out.battle.fighters[1].ailments[status]>=2,String(move));
    const expired=structuredClone(game);expired.battle.fighters[1].hp=1;expired.battle.fighters[1].ailments['中毒']=expired.battle.round;
    const dead=Team.turn(expired,['potion:pp','potion:pp']);assert.deepEqual(dead.pending,[1],String(move));
    const replacement=Team.replace(dead,[null,1]);
    assert.equal(replacement.battle.fighters[1].ailments[status],undefined,String(move));
  }
});

test('四个1600在原目标真实进入异常后才监视主动切换，免疫原异常时不传播',()=>{
  for(const [id,move,status] of [[4373,35892,'中毒'],[4632,37292,'中毒'],[4644,37357,'麻痹'],[4745,37864,'流血']]){
    for(const immune of [false,true]){
      let game=Team.create([[memberWithMove(id,move)],[member(3056),member(3223)]],[0,0],{seed:'spread1600',criticals:false});
      if(immune)game.battle.fighters[1].counts.immune=1;
      game.battle.fighters[0].stages.acc=6;
      game=Team.turn(game,['wiki:'+move,'potion:pp']);
      assert.equal(!!game.battle.fighters[1].ailments[status],!immune,String(move));
      game=Team.turn(game,['potion:pp',{switchTo:1}]);
      assert.equal(!!game.battle.fighters[1].ailments[status],!immune,String(move));
    }
  }
});

test('五个1868对当回合实际换入者施加首选异常，首选未入身再尝试来源规定的补偿',()=>{
  for(const [id,move,first,second] of [[4068,37990,'冻伤','冰封'],[4604,37114,'凝滞','冻伤'],[4661,37459,'臣服','束缚'],
    [4747,37870,'疲惫','失明'],[4785,37985,'睡眠','疲惫']]){
    for(const immune of [false,true]){
      let verified=false;
      for(let seed=0;seed<16&&!verified;seed++){
        const game=Team.create([[memberWithMove(id,move)],[member(2988),member(3056)]],[0,0],{seed:'switch-1868-'+seed,criticals:false});
        game.battle.fighters[0].stages.acc=6;
        if(immune)game.slots[1][1].fighter.counts.immune=1;
        const out=Team.turn(game,['wiki:'+move,{switchTo:1}]),target=out.battle.fighters[1];
        const chosen=immune?second:first;
        if(!target.ailments[chosen]&&id===4747)continue;
        assert.ok(target.ailments[chosen]>=1,String(move));
        assert.equal(out.slots[1][0].fighter.ailments[chosen],undefined,String(move));
        verified=true;
      }
      assert.ok(verified,String(move));
    }
  }
});

test('647、877、909三种死亡魂印只为实际继任者授予各自盾罩或强化以及一次免异',()=>{
  const shield=require('../dist/shield-rules.js');
  for(const [id,soul] of [[3322,647],[3576,877],[3613,909]]){
    const lead=member(id,null,{maxHp:9000,def:1,spe:1});
    lead.snapshot=E.WIKI.versionSnapshots(lead.snapshot).find(s=>s.selectedSoulId===soul)??{...lead.snapshot,selectedSoulId:soul};
    lead.moves=E.WIKI.defaultMoves(lead.snapshot);
    let game=Team.create([[lead,member(3056),member(3223)],[member(2988,10018,{atk:9999,spe:9999}),member(3576,20085)]],[0,0],{seed:'inherit-guard',criticals:false});
    game.battle.fighters[0].hp=1;
    game.slots[1][1].fighter.stages.acc=6;
    const switched=Team.turn(game,[{switchTo:1},'potion:pp']);
    assert.equal(switched.battle.fighters[0].counts.immune??0,0);
    game=Team.turn(game,['potion:pp','wiki:10018']);assert.deepEqual(game.pending,[0],String(id));
    game=Team.replace(game,[1,null]);const f=game.battle.fighters[0],source='魂印'+soul+'后继';
    assert.equal(f.counts.immune,1);
    assert.equal(shield.sourceValue(f,source),soul===877?0:500);
    assert.equal(shield.barrierSourceValue(f,source),soul===909?500:0);
    assert.deepEqual(Object.values(f.stages),Array(6).fill(soul===877?1:0));
    assert.equal(game.slots[0][2].fighter.counts.immune??0,0);
    game=Team.turn(game,['potion:pp',{switchTo:1}]);
    game=Team.turn(game,['potion:pp','wiki:20085']);
    assert.equal(game.battle.fighters[0].ailments['麻痹'],undefined);
    assert.equal(game.battle.fighters[0].counts.immune,0);
    game=Team.turn(game,['potion:pp','wiki:20085']);
    assert.ok(game.battle.fighters[0].ailments['麻痹']>=game.battle.round-1);
  }
});

test('3592击败后在真实替补登场时吸取最大体力三分之一',()=>{
  const lead=member(3592,undefined,{atk:9999,spa:9999,spe:9999});
  let game=Team.create([[lead],[member(2988,null,{maxHp:1,def:1,spd:1}),member(3056)]],[0,0],{seed:'soul-drain',criticals:false});
  game.battle.fighters[0].hp=1000;
  const move=game.battle.fighters[0].moves.find(k=>game.battle.moveDefinitions[k].power>0);
  game=Team.turn(game,[move,'potion:pp']);assert.deepEqual(game.pending,[1]);
  game=Team.replace(game,[null,1]);
  assert.equal(game.battle.fighters[0].hp,4000);assert.equal(game.battle.fighters[1].hp,6000);
});

test('3033阵亡时从实际击败者吸取正等级给继任者，PP清零、消回合各自尊重保护',()=>{
  for(const protectedTarget of [false,true]){
    const game=Team.create([[member(3033,null,{def:1,spe:1}),member(3056)],
      [member(2988,10018,{atk:9999,spe:9999})]],[0,0],{seed:'393-inherit',criticals:false});
    game.battle.fighters[0].hp=1;
    const foe=game.battle.fighters[1];foe.stages.atk=2;foe.stages.spa=3;foe.stages.def=-1;
    foe.effects['对照回合效果']={start:1,end:4};
    if(protectedTarget){foe.effects['强化保护']={start:1,end:3};foe.effects['PP保护']={start:1,end:3};}
    let out=Team.turn(game,['potion:pp','wiki:10018']);assert.deepEqual(out.pending,[0]);
    const attacker=out.battle.fighters[1];
    assert.equal(attacker.stages.atk,protectedTarget?2:0);assert.equal(attacker.stages.spa,protectedTarget?3:0);
    assert.equal(attacker.stages.def,-1);assert.equal(attacker.effects['对照回合效果'],undefined);
    assert.equal(Object.values(attacker.pp).every(v=>v===0),!protectedTarget);
    out=Team.replace(out,[1,null]);const replacement=out.battle.fighters[0];
    assert.equal(replacement.stages.atk,protectedTarget?0:2);assert.equal(replacement.stages.spa,protectedTarget?0:3);
    assert.equal(replacement.stages.def,0);
  }
});

test('1916体力回归只限全场一次；真正阵亡后的接替者只在首回合免攻并反施瘫痪',()=>{
  let game=Team.create([[member(4713,null,{def:1,spe:1}),member(3056,null,{def:9999}),member(3223)],
    [member(2988,10018,{atk:9999,spe:9999})]],[0,0],{seed:'inherit-1916',criticals:false});
  game.battle.fighters[0].hp=1;
  game=Team.turn(game,['potion:pp','wiki:10018']);assert.deepEqual(game.pending,[]);
  assert.equal(game.battle.fighters[0].hp,9000);assert.equal(game.battle.fighters[0].soulState.rewindUsed1916,true);
  game=Team.turn(game,[{switchTo:1},'potion:pp']);
  assert.equal(game.battle.fighters[0].effects['魂印1916继任免攻'],undefined);
  game=Team.turn(game,[{switchTo:0},'potion:pp']);
  game=Team.turn(game,['potion:pp','wiki:10018']);assert.deepEqual(game.pending,[0]);
  game=Team.replace(game,[1,null]);const entered=game.battle.round;
  game=Team.turn(game,['potion:pp','wiki:10018']);
  assert.equal(game.battle.fighters[0].hp,9000);
  assert.ok(game.battle.fighters[1].ailments['瘫痪']>=entered);
  for(let waits=0;game.battle.fighters[1].ailments['瘫痪']>=game.battle.round;waits++){
    assert.ok(waits<4);
    game=Team.turn(game,['potion:pp','potion:pp']);
  }
  game=Team.turn(game,['potion:pp','wiki:10018']);
  assert.ok(game.battle.fighters[0].hp<9000);
});

test('821非首发首次登场有两个保命回合，真正阵亡后的继任者两回合减免攻击和固定伤害',()=>{
  let game=Team.create([[member(3056),member(3512,null,{def:300,spe:1}),member(3223)],
    [member(2988,10018,{atk:700,spe:9999}),member(4677,28836),member(3056)]],[0,0],{seed:'inherit821',criticals:false});
  game=Team.turn(game,['potion:pp','potion:pp']);game=Team.turn(game,['potion:pp','potion:pp']);
  game=Team.turn(game,[{switchTo:1},'potion:pp']);game.battle.fighters[0].hp=2;
  game=Team.turn(game,['potion:pp','wiki:10018']);
  assert.equal(game.battle.fighters[0].hp,1);assert.deepEqual(game.pending,[]);
  game=Team.turn(game,['potion:pp','wiki:10018']);assert.deepEqual(game.pending,[0]);
  game=Team.replace(game,[2,null]);const start=game.battle.round;
  const fixedWindow=Team.turn(game,['potion:pp',{switchTo:1}]);fixedWindow.slots[1][2].fighter.hp=0;
  const fixed=Team.turn(fixedWindow,['potion:pp','wiki:28836']);
  assert.ok(fixed.battle.damageEvents.some(e=>e.round===start+1&&e.type==='fixed'&&e.hpLoss===50));
  for(let n=0;n<3;n++){
    const base=structuredClone(game);delete base.battle.fighters[0].effects['魂印821后继减伤'];
    const baseline=Team.turn(base,['potion:pp','wiki:10018']);
    const out=Team.turn(game,['potion:pp','wiki:10018']);
    const amount=o=>o.battle.damageEvents.findLast(e=>e.round===start+n&&e.type==='attack').settledDamage;
    if(n<2)assert.ok(Math.abs(amount(out)*2-amount(baseline))<=2);
    else assert.equal(amount(out),amount(baseline));
    game=out;game.battle.fighters[0].hp=9000;
  }
});

test('519自身每次真实击败提高两点秒杀概率，最新统一规则主动离场清空次数',()=>{
  let game=Team.create([[member(3194,undefined,{atk:9999,spa:9999,spe:9999}),member(3056)],
    [member(2988,null,{maxHp:1,def:1,spd:1}),member(3223),member(3056)]],[0,0],{seed:'519',criticals:false});
  const attack=game.battle.fighters[0].moves.find(k=>game.battle.moveDefinitions[k].power>0);
  for(let i=1;i<=2;i++){
    game.battle.fighters[1].hp=1;game=Team.turn(game,[attack,'potion:pp']);assert.deepEqual(game.pending,[1]);
    assert.equal(game.battle.fighters[0].soulState.teamKills519,i);
    game=Team.replace(game,[null,i]);
  }
  const grown=game.battle.fighters[0];assert.equal(grown.soulState.teamKills519,2);
  for(const value of [.189,.19]){
    let hits=0;E.SOULS.registry[519].hooks.afterAttack({a:grown,t:{hp:100},random:()=>value,soulInstantKill4706(){hits++;}});
    assert.equal(hits,value<.19?1:0);
  }
  game=Team.turn(game,[{switchTo:1},'potion:pp']);game=Team.turn(game,[{switchTo:0},'potion:pp']);
  const holder=game.battle.fighters[0];assert.equal(holder.soulState.teamKills519??0,0);
  for(const value of [.149,.15]){let hits=0;E.SOULS.registry[519].hooks.afterAttack({a:holder,t:{hp:100},random:()=>value,soulInstantKill4706(){hits++;}});assert.equal(hits,value<.15?1:0);}
});

test('3425两版星界圣令分别携带或不携带，场下三加护独立用尽、登场恢复并在场获得先制',()=>{
  for(const soul of [740,1030])for(const equipped of [false,true]){
    const oscar=member(3425),version=E.WIKI.versionSnapshots(oscar.snapshot).find(v=>v.selectedSoulId===soul);
    oscar.snapshot=version;oscar.moves=E.WIKI.defaultMoves(version);
    const pool=E.WIKI.availableMoves(version);
    if(equipped&&!oscar.moves.includes(38525))oscar.moves[1]=38525;
    if(!equipped&&oscar.moves.includes(38525))oscar.moves[oscar.moves.indexOf(38525)]=pool.find(m=>!m.fifth&&!oscar.moves.includes(m.id)).id;
    let game=Team.create([[member(3056),oscar],[member(2988)]],[0,0],{seed:'blessings',criticals:false});
    const round=(status)=>{
      game.battle.fighters[0].ailments[status]=game.battle.round+3;
      game=Team.turn(game,['potion:pp','potion:pp']);
      return game.battle.fighters[0].ailments[status]!=null;
    };
    assert.equal(round('烧伤'),!equipped);
    if(!equipped)continue;
    assert.deepEqual(game.battle.teamOscarBlessings[0].spent,[true,false,false]);
    assert.equal(round('烧伤'),true);
    assert.equal(round('冻伤'),false);
    assert.deepEqual(game.battle.teamOscarBlessings[0].spent,[true,true,false]);
    game=Team.turn(game,[{switchTo:1},'potion:pp']);
    assert.deepEqual(game.battle.teamOscarBlessings[0].spent,[false,false,false]);
    assert.equal(round('冻伤'),false);
    assert.equal(game.battle.fighters[0].soulState.oscarPriority.amount,1);
    game=Team.turn(game,[{switchTo:0},'potion:pp']);
    assert.equal(round('烧伤'),false);
  }
});

test('奥斯卡阵亡时剩余三种加护可在场下各消耗一次，574复活仍不刷新直至实际重新登场',()=>{
  for(const soul of [740,1030]){
    const oscar=member(3425,null,{def:1,spe:1});
    oscar.snapshot=E.WIKI.versionSnapshots(oscar.snapshot).find(v=>v.selectedSoulId===soul);
    oscar.moves=E.WIKI.defaultMoves(oscar.snapshot);if(!oscar.moves.includes(38525))oscar.moves[1]=38525;
    const wing=member(2987,null,{def:1,spe:1});wing.snapshot.selectedSoulId=574;
    let game=Team.create([[oscar,member(3056),wing,member(3223)],[member(2988,10018,{atk:9999,spe:9999})]],[0,0],{seed:'dead-oscar',criticals:false});
    game.battle.fighters[0].hp=1;
    game=Team.turn(game,['potion:pp','wiki:10018']);assert.deepEqual(game.pending,[0]);
    game=Team.replace(game,[1,null]);
    const ailments=['烧伤','冻伤','混乱'];
    for(const k of ailments)game.battle.fighters[0].ailments[k]=game.battle.round+3;
    game=Team.turn(game,['potion:pp','potion:pp']);
    assert.equal(game.slots[0][0].fighter.hp,0);
    assert.deepEqual(game.battle.teamOscarBlessings[0].spent,[true,true,true]);
    for(const k of ailments)assert.equal(game.battle.fighters[0].ailments[k],undefined);
    game=Team.turn(game,[{switchTo:2},'potion:pp']);game.battle.fighters[0].hp=1;
    game=Team.turn(game,['potion:pp','wiki:10018']);
    assert.equal(game.slots[0][0].fighter.hp,9000);
    assert.deepEqual(game.battle.teamOscarBlessings[0].spent,[true,true,true]);
    game=Team.replace(game,[3,null]);
    game.battle.fighters[0].ailments['烧伤']=game.battle.round+3;
    game=Team.turn(game,['potion:pp','potion:pp']);
    assert.ok(game.battle.fighters[0].ailments['烧伤']>=game.battle.round-1);
    game=Team.turn(game,[{switchTo:0},'potion:pp']);
    assert.deepEqual(game.battle.teamOscarBlessings[0].spent,[false,false,false]);
    game=Team.turn(game,[{switchTo:1},'potion:pp']);
    game.battle.fighters[0].ailments['烧伤']=game.battle.round+3;
    game=Team.turn(game,['potion:pp','potion:pp']);
    assert.equal(game.battle.fighters[0].ailments['烧伤'],undefined);
    assert.deepEqual(game.battle.teamOscarBlessings[0].spent,[true,false,false]);
  }
});

test('1882四招在实际补位与中切时均由己方接替者获得对应异常和一次抵挡',()=>{
  for(const [id,move,status] of [[4633,28699,'寄生'],[4658,28768,'诅咒'],[4830,29181,'流血'],[4872,29269,'砥砺']]){
    for(const forced of [false,true]){
      const lead=memberWithMove(id,move,{def:1});
      let game=Team.create([[lead,member(3056,null,{def:9999}),member(3223)],[member(3223),member(2988,10018,{atk:9999,spe:9999})]],[0,0],{seed:'grant1882',criticals:false});
      game.battle.fighters[0].stages.acc=6;
      game.slots[1][1].fighter.stages.acc=6;
      game=Team.turn(game,['wiki:'+move,'potion:pp']);
      assert.equal(game.slots[0][1].fighter.ailments[status],undefined);
      game=Team.turn(game,['potion:pp',{switchTo:1}]);
      let priorOpponentAilment;
      if(forced){
        game=Team.turn(game,['potion:pp','wiki:10018']);assert.deepEqual(game.pending,[0],String(move));
        priorOpponentAilment=game.battle.fighters[1].ailments[status];
        if(id===4658){
          assert.equal(priorOpponentAilment,5);
          assert.ok(game.history.some(line=>line.includes('B 方 陷入诅咒')));
        }else assert.equal(priorOpponentAilment,undefined);
        game=Team.replace(game,[1,null]);
      }else game=Team.turn(game,[{switchTo:1},'potion:pp']);
      const recipient=game.battle.fighters[0];assert.ok(recipient.ailments[status],String(move));
      assert.equal(recipient.counts.attackNullify,1);assert.equal(game.battle.fighters[1].ailments[status],priorOpponentAilment);
      assert.equal(game.slots[0][2].fighter.ailments[status],undefined);
      if(priorOpponentAilment!==undefined){
        for(let waits=0;game.battle.fighters[1].ailments[status]>=game.battle.round;waits++){
          assert.ok(waits<4);
          game=Team.turn(game,['potion:pp','potion:pp']);
          assert.equal(game.battle.fighters[0].counts.attackNullify,1);
        }
      }
      for(let i=0;i<2;i++){
        game=Team.turn(game,['potion:pp','wiki:10018']);
        const hit=game.battle.damageEvents?.findLast(e=>e.round===game.battle.round-1&&e.type==='attack'&&e.sourceSide===1);
        if(i===0){assert.equal(hit?.hpLoss??0,0);assert.equal(game.battle.fighters[0].counts.attackNullify,0);}
        else assert.ok(hit?.hpLoss>0,String(move));
      }
    }
  }
});

test('2148三种共享免异常在实际换入时传递，队友消费后下一名不能再次使用',()=>{
  for(const [id,move] of [[4627,37251],[4711,28931],[4717,37750]]){
    let game=Team.create([[memberWithMove(id,move),member(3056),member(3223)],[member(2988),member(3576,20085)]],[0,0],{seed:'shared-2148',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    game.slots[1][1].fighter.stages.acc=6;
    game=Team.turn(game,['wiki:'+move,'potion:pp']);
    if(id===4717){assert.deepEqual(game.pending,[0]);game=Team.replace(game,[1,null]);game=Team.turn(game,['potion:pp',{switchTo:1}]);}
    else game=Team.turn(game,[{switchTo:1},{switchTo:1}]);
    assert.equal(game.battle.fighters[0].counts.immune,1,String(move));
    game=Team.turn(game,['potion:pp','wiki:20085']);
    assert.equal(game.battle.fighters[0].counts.immune,0);
    assert.equal(game.battle.fighters[0].ailments['麻痹'],undefined);
    game=Team.turn(game,[{switchTo:2},'wiki:20085']);
    assert.ok(game.battle.fighters[0].ailments['麻痹']>=game.battle.round-1);
  }
});

test('4800真实自损后己方仅共享3次免异，跨队友消费并返场不复制',()=>{
  let game=Team.create([[memberWithMove(4800,38087),member(3056),member(3223)],[member(3576,20085)]],[0,0],{seed:'each-2148',criticals:false});
  game.battle.fighters[0].stages.acc=6;
  game.battle.fighters[1].stages.acc=6;
  game=Team.turn(game,['wiki:38087','potion:pp']);
  assert.deepEqual(game.pending,[0]);game=Team.replace(game,[1,null]);
  assert.equal(game.battle.fighters[0].counts.immune,3);assert.equal(game.slots[0][2].fighter.counts.immune??0,0,'one side pool is not copied to each reserve');
  game=Team.turn(game,['potion:pp','wiki:20085']);assert.equal(game.battle.fighters[0].counts.immune,2);assert.equal(game.battle.fighters[0].ailments['麻痹'],undefined);
  game=Team.turn(game,[{switchTo:2},'potion:pp']);assert.equal(game.battle.fighters[0].counts.immune,2);
  game=Team.turn(game,[{switchTo:1},'potion:pp']);assert.equal(game.battle.fighters[0].counts.immune,2,'returning a previous recipient preserves the remaining pool');
  game=Team.turn(game,['potion:pp','wiki:20085']);assert.equal(game.battle.fighters[0].counts.immune,1);assert.equal(game.battle.fighters[0].ailments['麻痹'],undefined);
  game=Team.turn(game,[{switchTo:2},'wiki:20085']);assert.equal(game.battle.fighters[0].counts.immune,0);assert.equal(game.battle.fighters[0].ailments['麻痹'],undefined);
  game=Team.turn(game,[{switchTo:1},'wiki:20085']);assert.equal(game.battle.fighters[0].counts.immune??0,0);assert.ok(game.battle.fighters[0].ailments['麻痹']>=game.battle.round-1);
});

test('4002场下逐回合蓄力至九，六层登场免异、使用攻击扣层、阵亡清零',()=>{
  const elephant=member(4002,null,{def:1,spe:1}),foe=member(3576,20085,{atk:9999,spa:9999});
  let game=Team.create([[member(3056),elephant],[foe]],[0,0],{seed:'reserve-charge',criticals:false});
  game.battle.fighters[1].stages.acc=6;
  for(let r=1;r<=10;r++){
    game=Team.turn(game,['potion:pp','potion:pp']);
    assert.equal(game.slots[0][1].fighter.soulState.elephantCharge,Math.min(9,r));
  }
  game=Team.turn(game,[{switchTo:1},'wiki:20085']);
  assert.equal(game.battle.fighters[0].soulState.elephantCharge,9);
  assert.equal(game.battle.fighters[0].ailments['麻痹'],undefined);
  const attack=game.battle.fighters[0].moves.find(k=>game.battle.moveDefinitions[k].power>0);
  game=Team.turn(game,[attack,'potion:pp']);assert.equal(game.battle.fighters[0].soulState.elephantCharge,8);
  game=Team.turn(game,[{switchTo:0},'potion:pp']);assert.equal(game.slots[0][1].fighter.soulState.elephantCharge,9);
  game=Team.turn(game,[{switchTo:1},'potion:pp']);
  const lethal=game.battle.fighters[1].moves.find(k=>game.battle.moveDefinitions[k].power>0);
  game=Team.turn(game,['potion:pp',lethal]);assert.deepEqual(game.pending,[0]);
  game=Team.replace(game,[0,null]);assert.equal(game.slots[0][1].fighter.soulState.elephantCharge,0);
  game=Team.turn(game,['potion:pp','potion:pp']);assert.equal(game.slots[0][1].fighter.soulState.elephantCharge,0);
});

test('4037两魂印按最新统一规则换下重置先制与啸风概率，返场重新40概率与一层先制',()=>{
  for(const soul of [1292,1541]){
    const lead=member(4037);lead.snapshot.selectedSoulId=soul;
    let game=Team.create([[lead,member(3056)],[member(2988)]],[0,0],{seed:'reset-wind',criticals:false});
    game.battle.fighters[1].hp=5000;
    for(let i=0;i<3;i++)game=Team.turn(game,['potion:pp','potion:pp']);
    assert.equal(game.battle.fighters[0].soulState.skyWindPriority,3);
    game.battle.fighters[0].soulState.skyWindChance=80;
    game=Team.turn(game,[{switchTo:1},'potion:pp']);game=Team.turn(game,[{switchTo:0},'potion:pp']);
    assert.equal(game.battle.fighters[0].soulState.skyWindPriority,1);
    assert.equal(game.battle.fighters[0].soulState.skyWindChance,40);
  }
});

test('4004普通魂印首次登场的首攻无视免伤并麻痹，第二次登场首攻的同一效果按50%判定',()=>{
  const outcomes=new Set();
  for(let seed=0;seed<24&&outcomes.size<2;seed++){
    const lead=member(4004);lead.snapshot=E.WIKI.versionSnapshots(lead.snapshot).find(v=>v.selectedSoulId===1260);lead.moves=E.WIKI.defaultMoves(lead.snapshot);
    const plain=E.WIKI.availableMoves(lead.snapshot).find(m=>m.power>0&&!m.fifth&&m.effectInstances.length===0);assert.ok(plain);
    if(!lead.moves.includes(plain.id))lead.moves[1]=plain.id;
    let game=Team.create([[lead,member(3056)],[member(2988)]],[0,0],{seed:'re-entry-thunder-'+seed,criticals:false});
    const attack='wiki:'+plain.id;
    game.battle.fighters[0].stages.acc=6;
    game.battle.fighters[1].effects['攻击伤害免疫']={start:1,end:20};
    for(const n of [1,2]){
      game=Team.turn(game,[attack,'potion:pp']);
      const hit=(game.battle.damageEvents??[]).some(e=>e.round===game.battle.round-1&&e.sourceSide===0&&e.type==='attack'&&e.hpLoss>0);
      if(n===1)assert.ok(hit);else outcomes.add(hit);
      assert.equal(!!game.battle.fighters[1].ailments['麻痹'],hit);
      if(n===1){game=Team.turn(game,[{switchTo:1},'potion:pp']);game=Team.turn(game,[{switchTo:0},'potion:pp']);}
    }
  }
  assert.equal(outcomes.size,2);
});

test('3740觉醒永恒之水满八层后保留，敌方蚀砚之泪跟随实际目标，源阵亡时清掉场下标记',()=>{
  for(const stack of [7,8]){
    const lead=member(3740,null,{def:1,spe:1});lead.snapshot.selectedSoulId=1932;
    let game=Team.create([[lead,member(3056)],[member(3223),member(2988,10018,{atk:9999,spe:9999})]],[0,0],{seed:'water-tears',criticals:false});
    game.battle.fighters[0].soulState.eternalWater=stack;
    game.battle.fighters[1].soulState.inkTears=3;game.battle.fighters[1].soulState.inkTearsSource=0;
    game=Team.turn(game,[{switchTo:1},{switchTo:1}]);
    assert.equal(game.slots[1][0].fighter.soulState.inkTears,3);
    game=Team.turn(game,[{switchTo:0},'potion:pp']);
    assert.equal(game.battle.fighters[0].soulState.eternalWater??0,stack===8?8:0);
    game=Team.turn(game,['potion:pp',{switchTo:0}]);
    assert.equal(game.battle.fighters[1].soulState.inkTears,3);
    game=Team.turn(game,['potion:pp',{switchTo:1}]);
    game=Team.turn(game,['potion:pp','wiki:10018']);assert.deepEqual(game.pending,[0]);
    assert.equal(game.slots[1][0].fighter.soulState.inkTears,undefined);
  }
});

test('3763两版按在场以外的真实成员数增伤，五名对方替补阵亡使普通攻击未命中',()=>{
  for(const soul of [1043,1816]){
    const lead=memberWithMove(3763,14478,{},soul);
    const own=[lead,member(3056),member(3223)];
    const opp=[member(2988,10018),member(3056),member(3223),member(2987),member(3576),member(3033)];
    const orig=Team.create([own,opp],[0,0],{seed:'mountain-members',criticals:false});
    function damage(living){
      const g=structuredClone(orig);
      for(let i=1;i<=2;i++)if(i>living)g.slots[0][i].fighter.hp=0;
      g.battle.fighters[0].stages.acc=6;
      const out=Team.turn(g,['wiki:14478','potion:pp']);
      return out.battle.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).settledDamage;
    }
    assert.ok(Math.abs(damage(2)-1.4*damage(0))<=2);
    const g=structuredClone(orig);for(const slot of g.slots[1].slice(1))slot.fighter.hp=0;
    const out=Team.turn(g,['potion:pp','wiki:10018']);
    assert.ok(out.battle.turns.at(-1).events.some(e=>/未命中/.test(e.text)));
  }
});

test('3763普通版替补首登才有转化，再登场消失；觉醒首轮转化成败决定下次恩怜或300盾',()=>{
  for(const soul of [1043,1816])for(const converted of [false,true]){
    const lead=member(3763);lead.snapshot.selectedSoulId=soul;
    let game=Team.create([[member(3056),lead],[member(2988,10018,{atk:400})]],[0,0],{seed:'mountain-reentry',criticals:false});
    game.slots[0][1].fighter.hp=4500;
    game=Team.turn(game,['potion:pp','potion:pp']);game=Team.turn(game,['potion:pp','potion:pp']);
    game=Team.turn(game,[{switchTo:1},converted?'wiki:10018':'potion:pp']);
    if(converted)assert.ok(game.battle.fighters[0].hp>4500);
    game=Team.turn(game,[{switchTo:0},'potion:pp']);game=Team.turn(game,[{switchTo:1},'potion:pp']);
    const f=game.battle.fighters[0];
    if(soul===1043)assert.equal(f.effects['攻击转治疗'],undefined);
    else assert.equal(require('../dist/shield-rules.js').sourceValue(f,'山祇恩怜后继盾'),converted?0:300);
  }
});

test('3102伙伴魂印默认已激活，单精灵及无盖亚的编队均在原版基础上固定增加50攻击和体力',()=>{
  const snapshot=local.species(3102),original={...snapshot,selectedSoulId:449},p=E.WIKI.prepare([original,snapshot]);
  const base=E.calculateStats(p[0].species,{}).stats,enhanced=E.calculateStats(p[1].species,{}).stats;
  for(const k of Object.keys(base))assert.equal(enhanced[k]-base[k],['atk','maxHp'].includes(k)?50:0,k);
  for(const extra of [[],[member(3056)]]){
    const lead={snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{}};
    const game=Team.create([[lead,...extra],[member(2988)]],[0,0],{seed:'brothers',criticals:false});
    assert.equal(game.battle.fighters[0].soulId,456);
    assert.equal(game.battle.fighters[0].stats.atk,enhanced.atk);
    assert.equal(game.battle.fighters[0].hp,enhanced.maxHp);
    if(extra.length){
      const away=Team.turn(game,[{switchTo:1},'potion:pp']),back=Team.turn(away,[{switchTo:0},'potion:pp']);
      assert.equal(back.battle.fighters[0].stats.atk,enhanced.atk);assert.equal(back.battle.fighters[0].stats.maxHp,enhanced.maxHp);
    }
  }
  const manual=E.calculateStats(p[1].species,{overrides:{atk:600,maxHp:900}});assert.equal(manual.stats.atk,600);assert.equal(manual.stats.maxHp,900);
});

test('1825芯下场保留，两个芯祝福三回合；携带者剩两回合离场两回合，免异与临时上限同步到期',()=>{
  const jasmine=member(3613,null,{def:1,spe:1});jasmine.snapshot=E.WIKI.versionSnapshots(jasmine.snapshot).find(v=>v.selectedSoulId===1825);
  jasmine.moves=E.WIKI.defaultMoves(jasmine.snapshot);
  let game=Team.create([[jasmine,member(3056),member(3223)],[member(2988,10018,{atk:9999,spe:9999}),member(3576,20085)]],[0,0],{seed:'jasmine-clock-1',criticals:false});
  game.slots[1][1].fighter.stages.acc=6;game.battle.fighters[0].hp=3000;
  game=Team.turn(game,['potion:pp','potion:pp']);assert.equal(game.battle.fighters[0].soulState.jasmineCore,1);
  game=Team.turn(game,[{switchTo:1},'potion:pp']);assert.equal(game.slots[0][0].fighter.soulState.jasmineCore,1);
  game=Team.turn(game,[{switchTo:0},'potion:pp']);assert.equal(game.battle.fighters[0].soulState.jasmineCore,2);
  game=Team.turn(game,['potion:pp','wiki:10018']);assert.deepEqual(game.pending,[0],game.history.slice(-10).join(' / '));
  game=Team.replace(game,[1,null]);const f=game.battle.fighters[0],entered=game.battle.round;
  assert.equal(f.soulState.jasmineBlessing.end,entered+2);assert.equal(f.stats.maxHp,9500);assert.equal(f.hp,9500);
  const shield=require('../dist/shield-rules.js');assert.equal(shield.sourceValue(f,'芳馨之祝'),500);assert.equal(shield.barrierSourceValue(f,'芳馨之祝'),500);
  game=Team.turn(game,['potion:pp',{switchTo:1}]);
  assert.equal(f.soulState.jasmineBlessing.end-game.battle.round+1,2);
  const immune=Team.turn(game,['potion:pp','wiki:20085']);assert.equal(immune.battle.fighters[0].ailments['麻痹'],undefined);
  game=Team.turn(game,[{switchTo:2},'potion:pp']);assert.equal(game.slots[0][1].fighter.stats.maxHp,9500);
  game=Team.turn(game,['potion:pp','potion:pp']);
  assert.equal(game.slots[0][1].fighter.stats.maxHp,9000);assert.equal(game.slots[0][1].fighter.hp,9000);
  assert.equal(game.slots[0][1].fighter.soulState.jasmineBlessing,undefined);
  game=Team.turn(game,[{switchTo:1},'wiki:20085']);assert.ok(game.battle.fighters[0].ailments['麻痹']>=game.battle.round-1);
});

test('四个1654实例仅封住真实继任者首次用招的附效，药剂不消费，红伤和次招附效照常',()=>{
  for(const [id,move] of [[4169,34812],[4459,36338],[4643,37353],[4956,38596]]){
    const lead=memberWithMove(id,move,{atk:9999,spa:9999,spe:9999});
    let game=Team.create([[lead,member(3223)],[member(2988,null,{maxHp:1,def:1,spd:1}),member(3056)]],[0,0],{seed:'first-payload',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    game=Team.turn(game,['wiki:'+move,'potion:pp']);assert.deepEqual(game.pending,[1],String(move));
    game=Team.replace(game,[null,1]);
    game=Team.turn(game,[{switchTo:1},'potion:pp']);
    assert.equal(game.battle.fighters[1].counts.nextSkillPayloadInvalid1654,1,String(move));
    for(const first of [true,false]){
      game.battle.fighters[1].stages.acc=6;
      game=Team.turn(game,['potion:pp','wiki:19369']);
      const events=game.battle.damageEvents.filter(e=>e.round===game.battle.round-1&&e.sourceSide===1);
      assert.ok(events.some(e=>e.type==='attack'&&e.hpLoss>0),String(move));
      assert.equal(events.some(e=>e.type==='fixed'&&e.hpLoss>0),!first,String(move));
      assert.equal(game.battle.fighters[1].counts.nextSkillPayloadInvalid1654,0);
    }
  }
});

test('2481零组不吸取，两组按顺序附加束缚麻痹且只结算一次20%吸取',()=>{
  for(const groups of [0,1,2,3]){
    const lead=memberWithMove(3407,38409,{atk:9999,spe:9999});
    let game=Team.create([[lead],[member(2988,null,{def:1}),member(3056)]],[0,0],{seed:'marks-next-entry',criticals:false});
    const user=game.battle.fighters[0],target=game.battle.fighters[1];
    user.hp=target.hp=1000;user.soulState.nineScars=groups;user.soulState.hundredFires=groups;
    game=Team.turn(game,['wiki:38409','potion:pp']);assert.deepEqual(game.pending,[1]);
    game.battle.fighters[0].hp=1000;
    game=Team.replace(game,[null,1]);
    const receiver=game.battle.fighters[1],drains=(game.battle.damageEvents??[]).filter(e=>e.type==='percent'&&e.round===game.battle.round);
    assert.deepEqual(drains.map(e=>e.hpLoss),groups?[900*groups]:[]);
    assert.equal(game.battle.fighters[0].hp,1000+900*groups);
    for(const [i,k] of ['束缚','麻痹','焚烬'].entries())assert.equal(!!receiver.ailments[k],i<groups);
  }
});

test('3407离场仅保留成对层数，继任者按组数获得免疫及异常行为转换，期限后恢复普通判定',()=>{
  const rules=require('../dist/status-rules.js');
  for(const [nine,fire] of [[3,2],[3,0]]){
    const gla=memberWithMove(3407,38409),ally=member(3056);
    let game=Team.create([[gla,ally],[member(3576,20085)]],[0,0],{seed:'gla-inherit',criticals:false});
    const source=game.battle.fighters[0];source.soulState.nineScars=nine;source.soulState.hundredFires=fire;
    game.battle.fighters[1].stages.acc=6;
    game=Team.turn(game,[{switchTo:1},'wiki:20085']);
    const retained=game.slots[0][0].fighter.soulState,groups=Math.min(nine,fire);
    assert.equal(retained.nineScars??0,groups);assert.equal(retained.hundredFires??0,groups);
    assert.equal(!!game.battle.fighters[0].ailments['麻痹'],groups===0);
    if(!groups)continue;
    const [receiver,foe]=game.battle.fighters,r=game.battle.round;
    assert.equal(receiver.soulState.glaInheritedThrough,r);receiver.ailments['中毒']=r+3;foe.ailments['砥砺']=r+3;
    assert.equal(rules.behaviorActive(receiver,'中毒',r),false);assert.equal(rules.behaviorActive(receiver,'雷解',r),true);
    assert.equal(rules.behaviorActive(foe,'砥砺',r),false);assert.equal(rules.behaviorActive(foe,'烧伤',r),true);
    game=Team.turn(game,['wiki:19369','potion:pp']);
    assert.ok(game.battle.damageEvents.some(e=>e.round===r&&e.sourceSide===0&&e.type==='true'));
    assert.equal(game.battle.fighters[0].ailments['中毒'],undefined);assert.equal(game.battle.fighters[0].ailments['雷解'],r+3);
    assert.equal(game.battle.fighters[1].ailments['砥砺'],undefined);assert.equal(game.battle.fighters[1].ailments['烧伤'],r+3);
    game=Team.turn(game,['potion:pp','wiki:20085']);assert.ok(game.battle.fighters[0].ailments['麻痹']>=game.battle.round-1);
  }
});

test('四条历史已审额外目标保持单次命中当前对手，场下两名成员无附带损伤',()=>{
  for(const [id,move,originalTargets] of [[3670,12440,3],[3886,10948,2],[3983,11730,4],[4726,11371,3]]){
    const lead=memberWithMove(id,move,{spe:9999});
    const raw=lead.snapshot.moves.find(m=>m.id===move);assert.equal(raw.sourceTargetCount,originalTargets);
    const game=Team.create([[lead],[member(2988),member(3056),member(3223)]],[0,0],{seed:'source-targets',criticals:false});
    game.battle.fighters[0].stages.acc=6;
    const out=Team.turn(game,['wiki:'+move,'potion:pp']);
    assert.equal(out.battle.damageEvents.filter(e=>e.sourceSide===0&&e.targetSide===1&&e.type==='attack'&&e.moveId===move).length,1,String(move));
    for(const [idx,slot] of out.slots[1].entries())if(idx!==0){
      assert.equal(slot.fighter.hp,9000,String(move));assert.deepEqual(slot.fighter.pp,game.slots[1][idx].fighter.pp);
      assert.deepEqual(slot.fighter.ailments,{});
    }
  }
});

test('四个剩余原目标字段别名保持4或3原值，两魂及原版本均仅当前目标一次攻击与13870消强，场下HP与PP等级异常不变',()=>{
  const targets=[[3205,11531,4],[3205,13870,3],[3430,11531,4],[3529,11531,4]];
  for(const [id,move,count] of targets){
    const versions=E.WIKI.versionSnapshots(local.species(id)).filter(s=>E.WIKI.availableMoves(s).some(m=>m.id===move));
    assert.ok(versions.length);
    for(const snapshot of versions){
      const original=E.WIKI.availableMoves(snapshot).find(m=>m.id===move),compiled=E.WIKI.compile(original,snapshot);
      const raw=snapshot.moves.find(m=>m.id===move);
      assert.ok(raw.deferredEffects.some(x=>x.field==='atk_num'&&x.description.includes('atk_num='+count)));
      assert.deepEqual(compiled.ignoredSourceFeatures,[]);
      assert.equal(compiled.issue,'');
      const moves=E.WIKI.defaultMoves(snapshot);if(!moves.includes(move))moves[1]=move;
      assert.equal(E.WIKI.assess(snapshot,moves).supported,true);
      for(const mode of ['normal','invalid','control','zero']){
        const lead={snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:360,spe:9999}}};
        const game=Team.create([[lead],[member(2988,null,{def:9999,spd:9999}),member(3056),member(3223)]],[0,0],{seed:'four-target-aliases',criticals:false});
        const actor=game.battle.fighters[0],key='wiki:'+move;actor.stages.acc=6;
        game.battle.fighters[1].stages.atk=1;
        for(const slot of game.slots[1].slice(1))slot.fighter.stages.atk=1;
        if(mode==='invalid')actor.effects.skillBlock={start:1,end:1};
        if(mode==='control')actor.ailments.疲惫=2;
        if(mode==='zero')actor.pp[key]=0;
        const bench=game.slots[1].slice(1).map(({fighter:f})=>structuredClone({hp:f.hp,pp:f.pp,stages:f.stages,ailments:f.ailments})),pp=actor.pp[key];
        if(mode==='zero'){
          const before=structuredClone(game);assert.throws(()=>Team.turn(game,[key,'potion:pp']),/PP|请选择|可选/);assert.deepEqual(game,before);continue;
        }
        const out=Team.turn(game,[key,'potion:pp']),red=(out.battle.damageEvents??[]).filter(e=>e.round===1&&e.sourceSide===0&&e.type==='attack'&&e.moveId===move);
        assert.equal(red.length,mode==='normal'?1:0,id+'/'+move+'/'+mode);
        if(mode==='normal')assert.ok(red[0].hpLoss>0);
        assert.equal(out.battle.fighters[0].pp[key],pp-(mode==='control'?0:1));
        if(move===13870)assert.equal(out.battle.fighters[1].stages.atk,mode==='normal'?0:1);
        assert.deepEqual(out.slots[1].slice(1).map(({fighter:f})=>({hp:f.hp,pp:f.pp,stages:f.stages,ailments:f.ailments})),bench);
      }
    }
  }
});
