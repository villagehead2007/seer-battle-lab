'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const H=require('./helpers/4510-battle.cjs');
const shields=require('../dist/shield-rules.js');
const merlin=require('../research/4509-reviewed-snapshot.json');
const {E,source,key,make,turn,timer,pick}=H;
const SH='weiyue:1723:embrace',BA='weiyue:1723:insulate';
const rule=E.SOULS.registry[1723];

function mapped(o={}){
  const s=make({moveId:10223,index:-1},{soul:1723,aStats:{atk:180,spa:360,def:800,spd:900,...o.aStats},bStats:{atk:300,spa:300},...o});
  s.fighters[0].soulState.weiyueEntryRound=-1;
  return s;
}

function step(s,work){
  const old=E.SOULS;let done=false;
  E.SOULS={...old,run(event,c){old.run(event,c);if(!done&&event==='roundStart'&&c.a.side===0){done=true;work(c);}}};
  try{return turn(s,920031,920041);}finally{E.SOULS=old;}
}

test('4510用户确认双防：较低双攻面板乘各自防御等级，双攻等级不参与且真实物特伤害匹配',()=>{
  for(const level of [-2,0,2])for(const kind of ['physical','special']){
    const s=mapped(),a=s.fighters[0];
    Object.assign(a.stages,{atk:3,spa:-3,def:level,spd:-level});
    s.moveDefinitions[key(920040)].kind=kind;
    assert.equal(E.panelStat(a,'def'),180);
    assert.equal(E.panelStat(a,'spd'),180);
    assert.equal(E.effective(a,'def'),Math.floor(180*E.multiplier(level)));
    assert.equal(E.effective(a,'spd'),Math.floor(180*E.multiplier(-level)));
    const control=structuredClone(s);
    control.fighters[0].soulId=0;
    control.fighters[0].stats.def=180;control.fighters[0].stats.spd=180;
    const actual=turn(s,920031,920040),expected=turn(control,920031,920040);
    assert.equal(actual.fighters[0].hp,expected.fighters[0].hp);
    assert.ok(actual.fighters[0].hp<9000);
    assert.equal(actual.fighters[0].stats.def,800);
    assert.equal(actual.fighters[0].stats.spd,900);
  }
});

test('4510用户确认双防：双攻较低项交换和相等时持续更新，保留原始双防面板',()=>{
  const s=mapped();
  s.fighters[0].stats.atk=600;s.fighters[0].stats.spa=240;
  s.fighters[0].stages.atk=-6;s.fighters[0].stages.spa=6;
  assert.equal(E.panelStat(s.fighters[0],'def'),240);
  assert.equal(E.panelStat(s.fighters[0],'spd'),240);
  const out=turn(s,920031,920040);
  assert.ok(out.fighters[0].hp<9000);
  out.fighters[0].stats.atk=240;
  assert.equal(E.panelStat(out.fighters[0],'def'),240);
  assert.equal(out.fighters[0].stats.def,800);
});

test('4510用户确认印记：真实开盾后红伤耗尽护盾、固定伤害耗尽护罩，仍免疫指定异常且不能重开',()=>{
  let s=make(pick(1973)[0],{soul:1723,bStats:{atk:900}});
  s.fighters[0].soulState.weiyueEntryRound=-1;
  s=turn(s);
  assert.equal(shields.sourceValue(s.fighters[0],SH),300);
  assert.equal(shields.barrierSourceValue(s.fighters[0],BA),300);
  s.moveDefinitions[key(920040)].power=150;
  s=turn(s,920031,920040);
  assert.equal(shields.sourceValue(s.fighters[0],SH),0);
  assert.equal(s.fighters[0].soulState.weiyueShieldHeld,true);
  H.op(s,29,[400],920042);
  s=turn(s,920031,920042);
  assert.equal(shields.barrierSourceValue(s.fighters[0],BA),0);
  assert.equal(s.fighters[0].soulState.weiyueBarrierHeld,true);
  assert.ok(s.fighters[0].hp<9000);
  s=turn(s);
  assert.equal(shields.sourceValue(s.fighters[0],SH),0);
  assert.equal(shields.barrierSourceValue(s.fighters[0],BA),0);
  const o=step(s,c=>{
    assert.equal(rule.abilities.openShield(c),false);
    assert.equal(rule.abilities.openBarrier(c),false);
    assert.equal(c.ailment(c.a,'臣服',c.t,false,false,2),false);
    assert.equal(c.ailment(c.a,'麻痹',c.t,false,false,2),false);
    assert.equal(c.ailment(c.a,'烧伤',c.t,false,false,2),true);
  });
  assert.equal(o.fighters[0].ailments['臣服'],undefined);
  assert.equal(o.fighters[0].ailments['麻痹'],undefined);
  assert.ok(o.fighters[0].ailments['烧伤']);
});

test('4510用户确认印记：清除普通容量不解除两个印记，增伤保留且独立解放成功一次',()=>{
  const s=mapped();
  const o=step(s,c=>{
    rule.abilities.openShield(c);rule.abilities.openBarrier(c);
    c.consumeShields(c.a);shields.consumeBarrier(c.a);
    assert.equal(c.shieldSourceValue(c.a,SH),0);
    assert.equal(c.barrierSourceValue(c.a,BA),0);
    assert.equal(rule.abilities.hasShield(c.a),true);
    assert.equal(rule.abilities.hasBarrier(c.a),true);
    assert.equal(E.SOULS.trait(c.a,'attackMultiplier'),1.5);
    assert.equal(E.SOULS.trait(c.a,'pinkDamageMultiplier'),1.25);
    assert.deepEqual(rule.abilities.release(c),{shield:true,barrier:true});
    assert.deepEqual(rule.abilities.release(c),{shield:false,barrier:false});
  });
  assert.equal(o.fighters[0].soulState.weiyueShieldHeld,false);
  assert.equal(o.fighters[0].soulState.weiyueBarrierHeld,false);
});

test('4510用户确认第五顺序：无原回合效果时清除失败，之后双解放新禁疗保留',()=>{
  const s=make(pick(1979)[0],{soul:1723});
  s.fighters[0].soulState.weiyueEntryRound=-1;
  s.fighters[0].soulState.weiyueShieldHeld=true;
  s.fighters[0].soulState.weiyueBarrierHeld=true;
  s.fighters[1].stages.atk=2;
  const o=turn(s);
  assert.equal(o.fighters[0].hp,0);
  assert.deepEqual(o.fighters[0].soulState.weiyueSuccessorPreparation,{round:1,restoreHp:false,restorePP:true});
  assert.equal(o.fighters[1].stages.atk,0);
  assert.deepEqual(o.fighters[0].soulState.weiyueReleased,{round:1,shield:true,barrier:true});
  assert.equal(o.fighters[1].effects['回复效果削减'].fraction,1);
  assert.equal(o.fighters[1].effects['回复效果削减'].end,2);
});

test('4510用户确认第五顺序：消除受保护失败仍死亡双解放，保留1HP不阻止消耗',()=>{
  const s=make(pick(1979)[0],{soul:1723,hp:1});
  s.fighters[0].soulState.weiyueEntryRound=-1;
  s.fighters[0].soulState.weiyueShieldHeld=true;
  s.fighters[0].soulState.weiyueBarrierHeld=true;
  timer(s,0,'致命保留',{hp:1});
  timer(s,1,'protect');timer(s,1,'强化保护');
  s.fighters[1].stages.atk=2;
  const o=turn(s);
  assert.equal(o.fighters[0].hp,0);
  assert.deepEqual(o.fighters[0].soulState.weiyueSuccessorPreparation,{round:1,restoreHp:false,restorePP:false});
  assert.equal(o.fighters[1].stages.atk,2);
  assert.ok(o.fighters[1].effects.protect);
  assert.equal(o.fighters[1].effects['回复效果削减'].fraction,1);
});

test('4510双防公共面板与4509真实同步交互：梅林读取卫岳映射后的未计等级物防',()=>{
  const own=[28313,10223,36605,28314,36610],other=[20030,28316,36613,36614,28318];
  const s=E.createBattle({wikiSnapshots:[merlin,source],wikiLoadouts:[own,other],criticals:false,builds:[{overrides:{maxHp:9000,atk:500,spa:600,def:700,spd:800,spe:500}},{overrides:{maxHp:9000,atk:180,spa:360,def:800,spd:900,spe:100}}]});
  s.fighters[0].stages.def=2;
  const o=E.resolveTurn(s,[key(28313),key(20030)]);
  assert.equal(E.panelStat(o.fighters[1],'def'),180);
  assert.equal(E.panelStat(o.fighters[0],'def'),180);
  assert.equal(E.effective(o.fighters[0],'def'),Math.floor(180*E.multiplier(o.fighters[0].stages.def)));
  assert.equal(o.fighters[0].stats.def,700);
});

test('4510完整真实17技能及1723魂印：逐招配入初始化并实际执行，PP及死亡状态真实变化',()=>{
  for(const move of source.moves){
    const ids=[move.id,...E.WIKI.defaultMoves(source)].filter((id,i,list)=>list.indexOf(id)===i).slice(0,5);
    if(!ids.includes(28318))ids[ids.length-1]=28318;
    const s=E.createBattle({wikiSnapshots:[source,merlin],wikiLoadouts:[ids,[28313,10223,36605,28314,36610]],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:360,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});
    timer(s,0,'攻击必中');timer(s,0,'属性必中');
    assert.equal(s.fighters[0].soulId,1723);
    assert.equal(s.moveDefinitions[key(move.id)].name,move.name);
    const o=E.resolveTurn(s,[key(move.id),key(28313)]);
    assert.equal(o.fighters[0].pp[key(move.id)],move.pp-1);
    if(move.id===28318)assert.equal(o.fighters[0].hp,0);
  }
});
