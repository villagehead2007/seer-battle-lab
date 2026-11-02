'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const H=require('./helpers/4509-battle.cjs');
const {E,source,key,make,turn,timer,pick}=H;
const red=(s,side,round=s.round-1)=>(s.damageEvents??[]).filter(e=>e.round===round&&e.sourceSide===side&&e.type==='attack');
const total=events=>events.reduce((n,e)=>n+e.settledDamage,0);

function synchronized(stages=0){
  const s=make({moveId:28313,index:null},{aStats:{atk:90,def:130,spa:170,spd:190},bStats:{atk:310,def:470,spa:610,spd:730}});
  s.fighters[0].stages.atk=stages;
  s.fighters[0].stages.def=stages;
  s.fighters[1].stages.atk=-stages;
  s.fighters[1].stages.def=-stages;
  return turn(s);
}

function materializedPanelControl(s){
  const control=structuredClone(s);
  for(const stat of ['atk','def']){
    control.fighters[0].stats[stat]=E.panelStat(s.fighters[0],stat);
    delete control.fighters[0].effects['面板同步:'+stat];
  }
  return control;
}

test('4509用户确认51和45：物攻物防持续同步面板，使用自身正零负等级并改变真实双方红伤',()=>{
  for(const stage of [-2,0,2]){
    const s=synchronized(stage),a=s.fighters[0];
    assert.equal(a.stats.atk,90);
    assert.equal(a.stats.def,130);
    assert.equal(E.panelStat(a,'atk'),310);
    assert.equal(E.panelStat(a,'def'),470);
    assert.equal(E.effective(a,'atk'),Math.floor(310*E.multiplier(stage)));
    assert.equal(E.effective(a,'def'),Math.floor(470*E.multiplier(stage)));
    assert.equal(E.panelStat(a,'spa'),170);
    assert.equal(E.panelStat(a,'spd'),190);
    const control=materializedPanelControl(s);
    const actual=turn(s,920030,920040),expected=turn(control,920030,920040);
    assert.deepEqual(actual.fighters.map(f=>f.hp),expected.fighters.map(f=>f.hp));
    assert.ok(total(red(actual,0))>0);
    assert.ok(total(red(actual,1))>0);
  }
});

test('4509用户确认51和45：对手后续面板变化实时读取，后续等级变化不进入同步基数',()=>{
  const s=synchronized(0);
  s.fighters[1].stats.atk=510;
  s.fighters[1].stats.def=690;
  s.fighters[1].stages.atk=3;
  s.fighters[1].stages.def=-3;
  assert.equal(E.panelStat(s.fighters[0],'atk'),510);
  assert.equal(E.panelStat(s.fighters[0],'def'),690);
  const expected=turn(materializedPanelControl(s),920030,920040);
  const actual=turn(s,920030,920040);
  assert.deepEqual(actual.fighters.map(f=>f.hp),expected.fighters.map(f=>f.hp));
  assert.equal(E.panelStat(actual.fighters[0],'atk'),510);
});

test('4509用户确认51和45：重复施放刷新五回合，到期恢复原面板及实际攻击伤害',()=>{
  let s=synchronized(0);
  assert.equal(s.fighters[0].effects['面板同步:atk'].end,5);
  s=turn(s);
  assert.equal(s.fighters[0].effects['面板同步:atk'].end,6);
  assert.equal(s.fighters[0].effects['面板同步:def'].end,6);
  s.round=7;
  for(const f of s.fighters)f.soulState.calculationRound=7;
  assert.equal(E.panelStat(s.fighters[0],'atk'),90);
  assert.equal(E.panelStat(s.fighters[0],'def'),130);
  const control=structuredClone(s);
  delete control.fighters[0].effects['面板同步:atk'];
  delete control.fighters[0].effects['面板同步:def'];
  assert.deepEqual(turn(s,920030,920040).fighters.map(f=>f.hp),turn(control,920030,920040).fighters.map(f=>f.hp));
});

test('4509用户确认51和45：属性封锁不授予同步，真实消回合清除两项同步',()=>{
  const blocked=make({moveId:28313,index:null});
  blocked.fighters[0].counts.nextStatusInvalid=1;
  const failure=turn(blocked);
  assert.equal(failure.fighters[0].effects['面板同步:atk'],undefined);
  assert.equal(failure.fighters[0].effects['面板同步:def'],undefined);
  const s=synchronized(0),clear=source.moves.find(m=>m.id===36610);
  const effect=clear.effectInstances[0];
  H.op(s,effect.id,effect.args);
  const cleared=turn(s,920031,920042);
  assert.equal(cleared.fighters[0].effects['面板同步:atk'],undefined);
  assert.equal(cleared.fighters[0].effects['面板同步:def'],undefined);
  assert.equal(E.panelStat(cleared.fighters[0],'atk'),90);
  assert.equal(E.panelStat(cleared.fighters[0],'def'),130);
});

function capped(){
  const s=make(pick(1897)[0],{bStats:{atk:9999}});
  s.fighters[1].stages.atk=2;
  H.op(s,31,[2,2],920040);
  return s;
}

test('4509用户确认1897：真实清强后多段共享整回合300完整红伤预算，每回合重新计算并到期',()=>{
  let s=capped();
  for(let round=1;round<=3;round++){
    s=turn(s,round===1?s.auditMoveId:920031,920040);
    const events=red(s,1);
    assert.equal(events.length,2);
    assert.equal(total(events),300);
    assert.equal(events[1].settledDamage,0);
    assert.equal(s.fighters[1].stages.atk,0);
    if(round<3)assert.equal(s.fighters[1].effects['攻击输出上限'].end,3);
    else assert.equal(s.fighters[1].effects['攻击输出上限'],undefined);
  }
  s=turn(s,920031,920040);
  assert.ok(total(red(s,1))>300);
});

test('4509用户确认1897：保1时按完整结算伤害扣预算，附加固定伤害不占红伤预算',()=>{
  const s=capped();
  s.fighters[0].hp=200;
  timer(s,0,'致命保留',{hp:1});
  const multi=s.moveDefinitions[key(920040)].operations;
  H.op(s,29,[100],920040);
  s.moveDefinitions[key(920040)].operations=[...multi,...s.moveDefinitions[key(920040)].operations];
  const o=turn(s,undefined,920040),events=red(o,1);
  assert.equal(total(events),300);
  assert.equal(events[0].hpLoss,199);
  assert.equal(events[1].settledDamage,0);
  assert.equal(o.fighters[0].hp,1);
  const fixed=o.damageEvents.filter(e=>e.sourceSide===1&&e.type==='fixed');
  assert.ok(fixed.length>0);
  assert.ok(fixed.every(e=>e.settledDamage===100));
});

test('4509用户确认1897：强化保护失败不授上限，无强化执行原禁疗分支',()=>{
  const s=capped();
  timer(s,1,'强化保护');
  const o=turn(s,undefined,920040);
  assert.equal(o.fighters[1].effects['攻击输出上限'],undefined);
  assert.equal(o.fighters[1].stages.atk,2);
  assert.ok(total(red(o,1))>300);
  const empty=make(pick(1897)[0]);
  H.op(empty,43,[2]);
  empty.fighters[1].hp=1000;
  const denied=turn(empty,undefined,920042);
  assert.equal(denied.fighters[1].hp,1000-total(red(denied,0)));
  assert.equal(denied.fighters[1].effects['攻击输出上限'],undefined);
});

test('4509完整真实技能与魂印：17招均可配入、初始化并实际使用且按真实PP扣除',()=>{
  for(const move of source.moves){
    const ids=[move.id,...E.WIKI.defaultMoves(source)].filter((id,i,list)=>list.indexOf(id)===i).slice(0,5);
    if(!ids.includes(36610))ids[ids.length-1]=36610;
    const enemy=[28313,10223,36605,28314,36610];
    const s=E.createBattle({wikiSnapshots:[source,source],wikiLoadouts:[ids,enemy],criticals:false,builds:[{overrides:{maxHp:9000,atk:200,def:300,spa:200,spd:300,spe:500}},{overrides:{maxHp:9000,atk:200,def:300,spa:200,spd:300,spe:100}}]});
    timer(s,0,'攻击必中');timer(s,0,'属性必中');
    assert.equal(s.fighters[0].soulId,1722);
    assert.equal(s.moveDefinitions[key(move.id)].name,move.name);
    assert.equal(s.fighters[0].pp[key(move.id)],move.pp);
    const o=E.resolveTurn(s,[key(move.id),key(28313)]);
    assert.equal(o.fighters[0].pp[key(move.id)],move.pp-1);
  }
});
