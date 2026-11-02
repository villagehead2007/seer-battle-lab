'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/4511-battle.cjs'),shields=require('../dist/shield-rules.js'),merlin=require('../research/4509-reviewed-snapshot.json');
const {E,source,make,pick,turn,timer,key}=H;
const e=id=>pick(id)[0];
const damage=(s,type,side)=>s.damageEvents.filter(x=>x.round===s.round-1&&x.sourceSide===side&&x.type===type).reduce((n,x)=>n+x.settledDamage,0);
function entryCase(different){const old=E.SOULS;E.SOULS={...old,run(event,c){if(different&&event==='beforeBattleStart'&&c.a.side===0)c.t.stages.atk=2;old.run(event,c);}};try{return make({moveId:source.moves[0].id,index:-1},{soul:1725});}finally{E.SOULS=old;}}
function invalidCase(){const s=make(e(2006),{hit:false});s.moveDefinitions[key(s.auditMoveId)].accuracy=0;s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;return s;}
function immunity2008(o={}){const s=make(e(2008),o);s.fighters[0].stages.atk=2;H.op(s,33,[]);return turn(s,undefined,920042);}

test('4511用户确认首登窗口：登场时差异快照、敌攻击命中前复制，护罩读取敌用后实际正级且次回不再触发',()=>{
  const s=entryCase(true);assert.equal(s.fighters[0].soulState.nanEntryDifferent,true);
  H.op(s,4,[0,100,2],920040);
  let o=turn(s,920031,920040);
  assert.equal(o.fighters[0].stages.atk,3);
  assert.equal(o.fighters[1].stages.atk,5);
  assert.equal(o.fighters[0].suitState.barrier,600);
  assert.ok(o.fighters.every(f=>f.ailments['凝滞']));
  assert.ok(o.fighters[0].hp<9000);
  o=turn(o,920031,920040);
  assert.equal(o.fighters[0].stages.atk,3);
  assert.equal(o.fighters[1].stages.atk,6);
  assert.equal(o.fighters[0].suitState.barrier,600);
});
test('4511用户确认首登失败边界：登场相同后续变不同不触发，属性行动不复制不授罩',()=>{
  const s=entryCase(false);assert.equal(s.fighters[0].soulState.nanEntryDifferent,false);s.fighters[1].stages.atk=4;
  let o=turn(s,920031,920040);assert.equal(o.fighters[0].stages.atk,1);assert.equal(o.fighters[0].suitState.barrier,0);assert.equal(o.fighters[0].ailments['凝滞'],undefined);
  const q=entryCase(true);o=turn(q,920031,920041);assert.equal(o.fighters[0].stages.atk,1);assert.equal(o.fighters[0].suitState.barrier,0);
});
test('4511用户确认2010：只取对手完整60盾份数，实际倍率1加每档6，己方盾和非整档余数不参与',()=>{
  for(const n of [0,29,59,60,61,119,120]){
    const s=make(e(2010),{aStats:{atk:9999}});shields.add(s.fighters[0],600,'own');shields.add(s.fighters[1],n,'enemy');
    const o=turn(s),row=o.turns.at(-1).events.find(x=>x.kind==='damage'&&x.damage?.sourceSide===0),expectedMultiplier=1+Math.floor(n/60)*6;
    assert.equal(Number(row.detail.match(/增减伤 ([\d.]+)/)[1]),expectedMultiplier);
    const expectedSettled=Math.floor(169*1.5*expectedMultiplier*.89)-n;
    assert.equal(row.damage.settledDamage,expectedSettled);assert.equal(o.fighters[1].hp,9000-expectedSettled);
    assert.equal(o.fighters[0].suitState.shield,600);
  }
});
test('4511用户确认807：上一攻击回合完整多段红伤合计，排除附加固定且跨属性空档保留',()=>{
  const s=make(e(807)),reg=E.WIKI.effectsEngine.registry;
  const entries=[{id:31,args:[2,2],description:reg[31].template},{id:29,args:[400],description:reg[29].template}];
  const compiled=E.WIKI.effectsEngine.compileInstances(entries,entries.map(x=>({id:x.id,argsNum:reg[x.id].argsNum,template:reg[x.id].template})),{id:920040});assert.equal(compiled.issue,'');s.moveDefinitions[key(920040)].operations=compiled.operations;
  let o=turn(s,920031,920040);const red=damage(o,'attack',1);assert.ok(red>0);assert.equal(damage(o,'fixed',1),800);assert.equal(o.damageEvents.filter(x=>x.round===1&&x.sourceSide===1&&x.type==='attack').length,2);assert.equal(o.fighters[1].soulState.lastAttackUseRound,1);
  o=turn(o,920031,920041);assert.equal(o.fighters[1].soulState.lastAttackUseRound,1);
  const used=turn(o);assert.equal(damage(used,'fixed',0),red);assert.equal(9000-used.fighters[1].hp,red);
});
test('4511用户确认807零边界：最近攻击MISS或整次免疫后，不能继续引用更早正红伤',()=>{
  for(const mode of ['miss','immune']){
    let s=turn(make(e(807)),920031,920040);assert.ok(damage(s,'attack',1)>0);
    if(mode==='miss'){s.moveDefinitions[key(920040)].alwaysHit=false;s.moveDefinitions[key(920040)].accuracy=0;}else timer(s,0,'攻击伤害免疫');
    s=turn(s,920031,920040);assert.equal(s.fighters[1].soulState.lastAttackUseRound,2);assert.equal(damage(s,'attack',1),0);
    const o=turn(s);assert.equal(damage(o,'fixed',0),0);assert.equal(o.fighters[1].hp,9000);
  }
});
test('4511用户确认2007：理论300授盾不因免疫或剩余200HP截断，已有普通盾独立保留再授300，护罩可挡固伤',()=>{
  for(const mode of ['normal','immune','shield','barrier']){
    const s=make(e(2007),{hp:1000,targetHp:200});s.fighters[1].stages.atk=1;
    if(mode==='immune')timer(s,1,'固定百分比免疫');if(mode==='shield')shields.add(s.fighters[1],400);if(mode==='barrier')shields.addBarrier(s.fighters[1],400);
    const o=turn(s);
    assert.equal(o.fighters[1].hp,mode==='normal'||mode==='shield'?0:200);
    assert.equal(o.fighters[1].suitState.shield,mode==='shield'?700:300);
    assert.equal(o.fighters[0].hp,9000);
  }
});
test('4511用户确认免攻来源：重复46只刷新自身2次，保留2006，完整多段只消费最新2006一次',()=>{
  let s=invalidCase();H.op(s,46,[2],920032);s=turn(s,920032);s=turn(s,920032);assert.equal(s.fighters[0].counts.attackNullify,2);
  s=turn(s);assert.equal(s.fighters[0].counts.attackNullify,3);
  H.op(s,31,[3,3],920040);const o=turn(s,920031,920040);
  assert.equal(damage(o,'attack',1),0);assert.equal(o.fighters[0].counts.attackNullify,2);assert.equal(o.fighters[0].soulState.nanShuangInvalidNullify,0);assert.deepEqual(Object.values(o.fighters[1].stages),Array(6).fill(1));
  const next=turn(o,920031,920040);assert.equal(next.fighters[0].counts.attackNullify,1);assert.deepEqual(Object.values(next.fighters[1].stages),Array(6).fill(1));
});
test('4511用户确认2008同源覆盖：再次消强仅保留一次免异，消耗后再次触发重新获得一次',()=>{
  let s=immunity2008();assert.equal(s.fighters[0].counts.immune,1);s.fighters[0].stages.atk=2;s=turn(s,920031,920042);assert.equal(s.fighters[0].counts.immune,1);
  H.op(s,15,[100]);s=turn(s,920031,920042);assert.equal(s.fighters[0].counts.immune,0);assert.equal(s.fighters[0].ailments['害怕'],undefined);
  s.fighters[0].stages.atk=2;H.op(s,33,[]);s=turn(s,920031,920042);assert.equal(s.fighters[0].counts.immune,1);
});
test('4511用户确认免异次序：真实1687控制反弹先于2008次数，魂印常驻免控先于反弹且不扣次数',()=>{
  for(const intrinsic of [false,true]){
    const s=make(e(2008),intrinsic?{soul:1725}:{});s.fighters[0].stages.atk=2;H.op(s,33,[]);if(intrinsic)shields.add(s.fighters[1],300);
    let o=turn(s,undefined,920042);assert.equal(o.fighters[0].counts.immune,1);
    H.op(o,1687,[4],920032);H.op(o,15,[100]);o=turn(o,920032,920042);
    assert.equal(o.fighters[0].counts.immune,1);assert.equal(o.fighters[0].ailments['害怕'],undefined);assert.equal(!!o.fighters[1].ailments['害怕'],!intrinsic);
  }
});
test('4511公共抗性优先：已满足100%抗性接口前提时不反弹、不扣2008次数，真实建立抗性窗口',()=>{
  let s=immunity2008();H.op(s,1687,[4],920032);H.op(s,15,[100]);const old=E.GEAR;E.GEAR={...old,resistanceChance:(f,k)=>f.side===0?1:old.resistanceChance(f,k)};
  let o;try{o=turn(s,920032,920042);}finally{E.GEAR=old;}
  assert.equal(o.fighters[0].counts.immune,1);assert.equal(o.fighters[0].ailments['害怕'],undefined);assert.equal(o.fighters[1].ailments['害怕'],undefined);assert.ok(o.fighters[0].resistUntil>=2);
});
test('4511完整真实17技能与1725：合法配招、真实魂印、原效果全量执行并扣除各招PP',()=>{
  for(const move of source.moves){
    const ids=[move.id,...E.WIKI.defaultMoves(source)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);if(!ids.includes(36628))ids[ids.length-1]=36628;
    const s=E.createBattle({wikiSnapshots:[source,merlin],wikiLoadouts:[ids,[28313,10223,36605,28314,36610]],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});timer(s,0,'攻击必中');timer(s,0,'属性必中');assert.equal(s.fighters[0].soulId,1725);
    const o=E.resolveTurn(s,[key(move.id),key(28313)]);assert.equal(o.fighters[0].pp[key(move.id)],move.pp-1);assert.equal(o.fighters[0].soulState.skillUses[key(move.id)],1);
  }
});

test('4511免攻公共兼容：真实46、570及低体972异源保留，同源只刷新且最新972先消费',()=>{
  let s=make(e(46),{hp:1000});H.op(s,570,[2],920032);H.op(s,972,[1],920033);
  s=turn(s);assert.equal(s.fighters[0].counts.attackNullify,2);
  s=turn(s,920032);assert.equal(s.fighters[0].counts.attackNullify,4);
  s=turn(s,920032);assert.equal(s.fighters[0].counts.attackNullify,4);
  s=turn(s,920033);assert.equal(s.fighters[0].counts.attackNullify,5);
  s=turn(s,920033);assert.equal(s.fighters[0].counts.attackNullify,5);
  const o=turn(s,920031,920040);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[0].counts.attackNullify,4);
  assert.deepEqual(o.fighters[0].soulState.attackNullifySources.map(x=>[x.kind,x.count]),[['46',2],['570',2]]);
});

test('4511用户确认807完整结算边界：原本1HP保命实际损失0，仍读取该回合完整正红伤',()=>{
  const s=make(e(807),{hp:1});timer(s,0,'致命保留',{hp:1});
  const first=turn(s,920031,920040),incoming=first.damageEvents.find(x=>x.round===1&&x.sourceSide===1&&x.type==='attack');
  assert.ok(incoming.settledDamage>0);assert.equal(incoming.hpLoss,0);assert.equal(first.fighters[0].hp,1);
  const o=turn(first);assert.equal(damage(o,'fixed',0),incoming.settledDamage);assert.equal(o.fighters[1].hp,9000-incoming.settledDamage);
});
test('4511用户确认2008覆盖反制：真实能力覆盖接口将正级设零时授予一次免异并记录消失事件',()=>{
  let s=make(e(2008));s.fighters[0].stages.atk=2;s=turn(s);assert.equal(s.fighters[0].counts.immune??0,0);
  const old=E.SOULS;let done=false;E.SOULS={...old,run(event,c){old.run(event,c);if(!done&&event==='roundStart'&&c.a.side===0){done=true;c.rewriteStageValues(c.a,{atk:0},'copy');}}};
  let o;try{o=turn(s,920031);}finally{E.SOULS=old;}
  assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[0].counts.immune,1);assert.equal(o.fighters[0].soulState.boostRemovedRound,2);
  assert.deepEqual(o.stageRewriteEvents.at(-1).removedPositive,['atk']);
});
