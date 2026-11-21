'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const T=require('../dist/team-engine.js');
const D=require('../dist/battle-display.js');
const local=require('../local-species.cjs');
const shields=require('../dist/shield-rules.js');
const mars=E.SpMars;
const source=local.species(20001);
const target=local.species(4765),reserve=local.species(2987);
const key=id=>'wiki:'+id;
const move=name=>key(mars.MOVES[name]);
const pp='potion:pp';
const opt={seed:4,criticals:false};
function member(snapshot,patch={}){
  const moves=snapshot.id===4765?[10171,20006,20085,10006,37908]:E.WIKI.defaultMoves(snapshot);
  const stats={maxHp:snapshot.id===20001?1200:9000,atk:150,spa:200,def:400,spd:400,spe:snapshot.id===20001?500:100,...patch};
  return {snapshot,moves,build:{overrides:stats}};
}
function duel(a=member(source),b=member(target)){
  return E.createBattle({...opt,wikiSnapshots:[a.snapshot,b.snapshot],wikiLoadouts:[a.moves,b.moves],builds:[a.build,b.build]});
}
const state=s=>s.fighters[0].soulState.spMars;
const events=s=>s.turns.at(-1).events.map(event=>event.text);
const fifth=form=>mars.choiceKey(form);

test('20001 毁灭第五预约吸取在单双模式先结算圣谱轮回再排序，次数耗尽与未致死各自独立',()=>{
  for(const team of [true,false])for(const mode of ['available','spent','nonlethal']){
    const a=member(source,{maxHp:504,spa:336}),b=member(local.species(5000),{
      maxHp:mode==='nonlethal'?900:501,spe:450});
    let current=team?T.create([[a],[b]],[0,0],opt):duel(a,b);
    const battle=()=>team?current.battle:current;
    const turn=actions=>{current=(team?T.turn:E.resolveTurn)(current,actions);};
    turn([fifth('ruin'),pp]);
    const pony=battle().fighters[1],before=pony.hp;
    assert.equal(pony.soulState.pony753.reincarnationUsed,false);
    assert.deepEqual(state(battle()).pending,{form:'ruin',round:2});
    if(mode==='spent')pony.soulState.pony753.reincarnationUsed=true;
    if(mode!=='nonlethal')assert.equal(before,141);
    turn([mode==='nonlethal'?pp:move('overdrive'),pp]);
    const out=battle(),after=out.fighters[1],wheel=after.soulState.pony753;
    const switched=out.damageEvents.find(d=>d.round===2&&d.type==='percent'&&d.targetSide===1);
    assert.equal(switched.sourceSide,0);
    assert.equal(switched.settledDamage,Math.floor(pony.stats.maxHp/3));
    const log=events(out);
    if(mode==='available'){
      assert.equal(switched.hpLoss,140);
      assert.equal(wheel.reincarnationUsed,true);
      assert.equal(wheel.restoredRound,2);
      assert.equal(after.hp,before);
      assert.deepEqual(after.pp,pony.pp);
      assert.deepEqual(after.stages,pony.stages);
      assert.ok(log.findIndex(line=>line.includes('轮回抵御'))<log.findIndex(line=>line.includes('先手：')));
      assert.equal(log.filter(line=>line.includes('轮回抵御')).length,1);
      assert.ok(log.some(line=>line.includes('使用毁灭·熔核过载')));
      assert.ok(log.some(line=>line.includes('B 方 使用了PP 药')));
      assert.equal(team?current.phase:'action','action');
    }else if(mode==='spent'){
      assert.equal(switched.hpLoss,141);
      assert.equal(after.hp,0);
      assert.equal(out.turns.at(-1).first,null);
      assert.equal(out.fighters[0].pp[move('overdrive')],5);
      assert.ok(!log.some(line=>/轮回抵御|先手：|使用毁灭·熔核过载/.test(line)));
      assert.equal(team?current.phase:'finished','finished');
      assert.equal(out.finished,true);
    }else{
      assert.equal(switched.hpLoss,300);
      assert.ok(after.hp>0);
      assert.equal(wheel.reincarnationUsed,false);
      assert.ok(!log.some(line=>line.includes('轮回抵御')));
    }
  }
});

test('20001 原创来源全技能编译，坚壁首发，三身体 HP 和 PP 各自独立',()=>{
  const s=duel();
  assert.equal(s.fighters[0].soulId,20001);
  assert.equal(state(s).lead,'wall');
  assert.deepEqual(s.fighters[0].moves,Object.values(mars.MOVES).map(id=>'wiki:'+id));
  const initial=E.resolveTurn(s,[fifth('swift'),pp]);
  assert.equal(initial.fighters[0].hp,900);
  assert.equal(initial.fighters[0].pp[move('fifth')],4);
  assert.deepEqual(state(initial).pending,{form:'swift',round:2});
  initial.fighters[0].pp[move('intercept')]=0;
  assert.ok(E.availableMoves(initial.fighters[0],2).includes(move('intercept')));
  const shifted=E.resolveTurn(initial,[move('intercept'),pp]);
  assert.equal(state(shifted).lead,'swift');
  assert.equal(state(shifted).bodies.wall.hp,900);
  assert.equal(state(shifted).bodies.wall.pp[move('fifth')],4);
  assert.equal(shifted.fighters[0].pp[move('fifth')],5);
  assert.equal(shifted.fighters[0].pp[move('intercept')],19);
  assert.ok(events(shifted).some(event=>event.includes('切位吸取')));
  assert.ok(events(shifted).some(event=>event.includes('掣电截击汲取')));
});

test('20001 第五整招无效仍触发所选魂印；毁灭固伤、封换与极速无禁疗不新建',()=>{
  for(const form of ['swift','ruin']){
    const initial=duel();initial.fighters[0].counts.nextStatusInvalid=1;
    const s=E.resolveTurn(initial,[fifth(form),pp]);
    assert.equal(s.fighters[0].hp,900);
    assert.ok(Object.values(s.fighters[0].stages).every(value=>value===0));
    assert.equal(s.fighters[1].effects['技能禁疗'],undefined);
    assert.deepEqual(state(s).pending,{form,round:2});
    if(form==='ruin'){
      assert.equal(s.damageEvents.find(event=>event.type==='fixed'&&event.targetSide===1).settledDamage,Math.floor(initial.fighters[0].stats.spa*.7));
      assert.ok(s.fighters[1].effects['不能主动切换']);
      assert.equal(state(s).pierceNext,true);
    }else assert.equal(state(s).swiftDispel,true);
  }
});

test('20001 第五自损致死按顺序接任，预约仍在；预约结算吸取且强制执行封招下的命中',()=>{
  const start=duel();start.fighters[0].hp=100;
  const pending=E.resolveTurn(start,[fifth('swift'),pp]);
  assert.equal(state(pending).lead,'swift');
  assert.equal(state(pending).bodies.wall.hp,0);
  assert.deepEqual(state(pending).pending,{form:'swift',round:2});
  assert.deepEqual(mars.legalForms(pending.fighters[0]),['swift','ruin']);
  assert.throws(()=>E.resolveTurn(pending,[fifth('wall'),pp]),/选择有 PP/);
  pending.fighters[0].counts.nextAttackInvalid=1;
  const s=E.resolveTurn(pending,[move('verdict'),pp]);
  assert.equal(state(s).pending,null);
  assert.equal(state(s).verdictUses,1);
  assert.ok(s.damageEvents.some(event=>event.round===2&&event.moveId===mars.MOVES.verdict&&event.settledDamage>0));
  assert.equal(events(s).filter(event=>event.includes('异甲同心切位吸取')&&event.includes('损失')).length,1);
});

test('20001 中切按对手实际行动判断形态，实战先换再受击，未用招印记一随下场传递',()=>{
  const a=member(source),b=member(target),other=member(reserve);
  for(const [command,lead] of [['wiki:10171','wall'],['wiki:20006','swift'],[pp,'ruin']]){
    const start=T.create([[other,a],[b]],[0,0],opt);
    const g=T.turn(start,[{switchTo:1},command]);
    assert.equal(state(g.battle).lead,lead);
    const fighter=g.battle.fighters[0],statuses=D.spMarsStatuses(fighter,g.battle.round);
    assert.match(statuses[0].value,new RegExp(mars.LABELS[lead]+'（主位）'));
    if(lead==='wall'){
      const shield=events(g.battle).find(event=>event.includes('护盾抵挡'));
      assert.ok(shield);
    }else assert.equal(fighter.suitState.shield,200);
    if(lead==='ruin'){
      assert.equal(state(g.battle).mark1,1);
      g.battle.fighters[1].effects['用招附加固定']={start:g.battle.round,end:g.battle.round,amount:300};
      const out=T.turn(g,[{switchTo:0},key(20006)]);
      assert.equal(out.battle.fighters[0].hp,8997);
      assert.ok(events(out.battle).some(line=>line.includes('毁灭固粉伤回补')&&line.includes('297')));
      assert.equal(out.battle.fighters[0].soulState.spMarsInheritance,undefined);
      assert.equal(out.slots[0][1].fighter.soulState.spMars.lead,'ruin');
    }
  }
});

test('20001 印记二使用实际有效等级，不写入面板能力等级；极速主位叠层并暂停计时',()=>{
  let s=E.resolveTurn(duel(),[fifth('swift'),pp]);
  const initial=s.fighters[1];
  assert.equal(initial.stages.def,0);
  assert.equal(E.effective(initial,'def'),Math.floor(initial.stats.def*2/3));
  s=E.resolveTurn(s,[move('verdict'),pp]);
  const target=s.fighters[1],mark=target.soulState.spMarsMark2;
  assert.equal(state(s).lead,'swift');
  assert.equal(target.stages.def,0);
  assert.equal(mark.layers,2);
  assert.equal(mark.end,s.round+1);
  assert.equal(E.effective(target,'def'),Math.floor(target.stats.def/2));
  const out=E.resolveTurn(s,[pp,pp]);
  assert.equal(out.fighters[1].soulState.spMarsMark2.end,mark.end+1);
});

test('20001 三相裁决命中成长；永固壁垒实装吸取、护盾、保护与无效补偿；熔核过载周期',()=>{
  let s=duel(member(source,{atk:50,spa:50}),member(target,{def:9000,spd:9000}));
  shields.add(s.fighters[0],300,'test');
  for(const power of [187,225,262,300]){
    s=E.resolveTurn(s,[move('verdict'),pp]);
    assert.ok(s.turns.at(-1).events.some(event=>event.detail.includes('威力 '+power+' ·')));
    assert.ok(s.damageEvents.filter(e=>e.round===s.round-1&&e.moveId===mars.MOVES.verdict).every(e=>e.settledDamage>=300));
  }
  const wall=E.resolveTurn(duel(),[move('rampart'),pp]);
  assert.equal(wall.fighters[0].suitState.shield,300);
  assert.ok(wall.fighters[0].effects.protect);
  assert.ok(wall.damageEvents.some(e=>e.type==='fixed'&&e.settledDamage===350));
  const blocked=duel();blocked.fighters[0].hp=500;blocked.fighters[0].counts.nextStatusInvalid=1;
  const invalid=E.resolveTurn(blocked,[move('rampart'),pp]);
  assert.equal(invalid.fighters[0].hp,1100);
  assert.equal(state(invalid).rampartInvalidGuard,true);
  const drive=E.resolveTurn(duel(),[move('overdrive'),pp]);
  assert.equal(state(drive).overdrivePulseUntil,4);
  assert.ok(events(drive).some(event=>event.includes('熔核过载回合吸取')));
});

test('20001 毁灭致死固定伤害按完整结算回补，优先于身体阵亡和换位',()=>{
  let s=duel();
  s.fighters[0].hp=100;
  s=E.resolveTurn(s,[fifth('ruin'),pp]);
  assert.equal(state(s).bodies.wall.hp,0);
  assert.equal(state(s).lead,'swift');
  s=E.resolveTurn(s,[pp,pp]);
  assert.equal(state(s).lead,'ruin');
  s.fighters[0].hp=100;
  s.fighters[1].effects['用招附加固定']={start:s.round,end:s.round,amount:300};
  const out=E.resolveTurn(s,[pp,key(20006)]);
  assert.equal(state(out).lead,'ruin');
  assert.ok(out.damageEvents.some(e=>e.type==='fixed'&&e.settledDamage===300&&e.hpLoss===100));
  assert.equal(out.fighters[0].hp,297);
  assert.ok(events(out).some(line=>line.includes('毁灭固粉伤回补')&&line.includes('297')));
});

test('20001 坚壁濒死按严格三分之一触发一次，下一回合固定伤害被挡，随后过期',()=>{
  let s=duel();
  s.fighters[0].hp=399;
  s=E.resolveTurn(s,[pp,pp]);
  assert.equal(s.fighters[0].hp,799);
  assert.deepEqual(state(s).emergencyGuard,{start:2,end:2});
  s.fighters[1].effects['用招附加固定']={start:2,end:3,amount:300};
  s=E.resolveTurn(s,[pp,key(20006)]);
  assert.equal(s.fighters[0].hp,799);
  assert.equal(s.damageEvents.filter(e=>e.round===2&&e.type==='fixed').reduce((n,e)=>n+e.hpLoss,0),0);
  s=E.resolveTurn(s,[pp,key(20006)]);
  assert.equal(s.fighters[0].hp,619);
  assert.equal(state(s).emergencyUses,1);
  assert.equal(s.fighters[0].suitState.barrier,120);
});

test('20001 熔核过载击败授予下一回合三主位，阵亡形态仍临时激活并按盾快照加面板',()=>{
  const a=member(source),b=member(target),other=member(reserve);
  let g=T.create([[a],[b,other]],[0,0],opt);
  const f=g.battle.fighters[0];
  state(g.battle).bodies.ruin.hp=0;
  shields.add(f,300,'test');
  g.battle.fighters[1].hp=1;
  g=T.turn(g,[move('overdrive'),pp]);
  assert.equal(g.phase,'replace');
  assert.equal(state(g.battle).allLead.round,2);
  g=T.replace(g,[null,1]);
  g=T.turn(g,[pp,pp]);
  assert.deepEqual(state(g.battle).allLead.bonus,{def:300,spd:300,spe:300,spa:200});
  assert.equal(mars.spareActive(g.battle.fighters[0],'ruin',2),true);
  assert.equal(mars.spareActive(g.battle.fighters[0],'ruin',3),false);
});
