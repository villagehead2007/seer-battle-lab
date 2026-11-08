const {test}=require('node:test');
const assert=require('node:assert/strict');
const store=require('../local-species.cjs');
const E=require('../dist/engine.js');
const effects=require('../dist/effect-registry.js');

const soul=E.SOULS.registry[875];
function fighter(hp,oppHp){return {hp,stats:{maxHp:1000},soulState:{},stages:{atk:0,def:0,spa:0,spd:0,spe:0,acc:0},ailments:{},effects:{},counts:{},side:0};}
function context(a,t,random){const events=[];return {a,t,round:1,random,emit:x=>events.push(x),name:f=>f===a?'A':'B',heal:(f,n)=>{f.hp=Math.min(f.stats.maxHp,f.hp+Math.floor(n));},hurt:(f,n)=>{const v=Math.min(f.hp,Math.floor(n));f.hp-=v;return v;},events};}

test('3575 快照保留真实魂印资料并核对来源版本',()=>{
  const source=require('../data/species/3575.json').snapshot;
  assert.equal(source.souls[0].id,875);
  assert.equal(source.souls[0].hash,'ea9790b0');
  assert.equal(soul.sourceHash,source.souls[0].hash);
});

test('3575 保留两个来源 is_fifth 标记，并将带激活道具的特殊技能归入激活技能槽',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const fifth=source.moves.find(m=>m.id===31835);
  const activation=source.moves.find(m=>m.id===37298);
  assert.equal(fifth.fifth,true);
  assert.deepEqual(fifth.sourceFlags,{is_fifth:true,is_special:false,skill_activation_item:null,classification:'fifth'});
  assert.equal(activation.fifth,false);
  assert.deepEqual(activation.sourceFlags,{is_fifth:true,is_special:true,skill_activation_item:{id:1725961,url:'https://api.seerapi.com/v1/skill_activation_item/1725961'},classification:'activation-skill'});
});

test('魂印875高体分支提供攻击先制和50%增伤，低体分支不提供',()=>{
  const high=fighter(700,600),target=fighter(600,700);high.side=0;target.side=1;
  soul.hooks.roundStart(context(high,target,()=>.99));
  assert.equal(soul.traits.attackPriority(high),1);
  assert.equal(soul.traits.damageMultiplier(high),1.5);
  const low=fighter(600,700);low.side=0;soul.hooks.roundStart(context(low,target,()=>.99));
  assert.equal(soul.traits.attackPriority(low),0);
  assert.equal(soul.traits.damageMultiplier(low),1);
});

test('魂印875 40%受击转化分支将攻击伤害恢复，未触发分支在回合末等量固定反击',()=>{
  const converted=fighter(500,600),target=fighter(700,700);converted.side=0;target.side=1;
  const c=context(converted,target,()=>.1);soul.hooks.roundStart(c);
  soul.hooks.attackDamageTaken({...c,dealt:120});
  assert.equal(converted.hp,620);
  assert.equal(converted.soulState.endDragonAttackTaken,120);
  const failed=fighter(500,600),victim=fighter(700,700);failed.side=0;victim.side=1;
  const fctx=context(failed,victim,()=>.9);soul.hooks.roundStart(fctx);
  soul.hooks.attackDamageTaken({...fctx,dealt:120});
  assert.equal(failed.hp,500);
  soul.hooks.roundEnd(fctx);
  assert.equal(victim.hp,580);
});

test('魂印875受击转化边界：致死攻击也恢复至至少本次伤害对应体力，零伤害不触发反击',()=>{
  const a=fighter(0,600),t=fighter(700,700);a.side=0;t.side=1;
  const c=context(a,t,()=>.1);soul.hooks.roundStart(c);soul.hooks.attackDamageTaken({...c,dealt:200});
  assert.equal(a.hp,200);
  const b=fighter(500,600),u=fighter(700,700);b.side=0;u.side=1;const d=context(b,u,()=>.9);soul.hooks.roundStart(d);soul.hooks.attackDamageTaken({...d,dealt:0});soul.hooks.roundEnd(d);assert.equal(u.hp,700);
});

test('3575 的真实诅咒参数 23 可编译并在 968/1030 中改变状态',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const curse=source.moves.find(m=>m.name==='逆鳞之咒');
  const feedback=source.moves.find(m=>m.name==='难·乾坤同罹');
  const curseRule=effects.compileInstances(curse.effectInstances.filter(x=>x.id===968),source.effects);
  const feedbackRule=effects.compileInstances(feedback.effectInstances.filter(x=>x.id===1030),source.effects);
  assert.equal(curseRule.issue,'');
  assert.equal(feedbackRule.issue,'');
  const a=fighter(800,600),t=fighter(600,800); a.side=0;t.side=1;
  const events=[]; const c={a,t,first:0,round:1,random:()=>0,stage:(f,n,keys)=>keys.forEach(k=>f.stages[k]+=n),ailment:(f,n)=>{f.ailments[n]=2;return true;},name:()=>'',emit:x=>events.push(x)};
  const op=curseRule.operations[0];
  effects.run('afterHit',[op],c);
  assert.equal(t.ailments['诅咒'],2);
  for(const k of Object.keys(a.stages))a.stages[k]=-1;
  const op2=feedbackRule.operations[0];
  effects.run('afterHit',[op2],c);
  assert.equal(t.ailments['诅咒'],2);
  assert.ok(Object.values(a.stages).every(x=>x===0));
});

test('3575 效果 702 暴击回满体力，非暴击与死亡目标不触发',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const move=source.moves.find(m=>m.name==='毁灭迸发');
  const rule=effects.compileInstances(move.effectInstances.filter(x=>x.id===702),source.effects);
  assert.equal(rule.issue,'');
  // 702 is attached to a status move: it installs a future window, not a
  // fictional critical hit on the casting status move.
  const H=require('./helpers/3575-battle.cjs'),entry=H.pick(702)[0];
  const installed=H.turn(H.make(entry,{hp:200,aStats:{maxHp:1000}}));
  assert.equal(installed.fighters[0].hp,200);
  assert.deepEqual(installed.fighters[0].effects['暴击回满体力'],{start:2,end:3});
  H.timer(installed,0,'必定暴击',{},2);
  assert.equal(H.turn(installed,10234).fighters[0].hp,1000);
  const noCrit=H.turn(H.make(entry,{hp:200,aStats:{maxHp:1000}}));
  assert.equal(H.turn(noCrit,10234).fighters[0].hp,200);
  const dead=H.make(entry,{hp:1,aStats:{maxHp:1000}});H.timer(dead,1,'priority');
  const ended=H.turn(dead,entry.moveId,H.HIT);assert.equal(ended.fighters[0].hp,0);assert.equal(ended.finished,true);
});

test('3575 效果 918 低伤害登记两次增伤并按引擎计数消费，边界不登记',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const move=source.moves.find(m=>m.name==='暗黑灭世断');
  const rule=effects.compileInstances(move.effectInstances.filter(x=>x.id===918),source.effects);
  assert.equal(rule.issue,'');
  const a=fighter(800,600),t=fighter(600,800);a.side=0;t.side=1;
  const c={a,t,m:move,dealt:299,round:1};effects.run('afterHit',rule.operations,c);
  assert.equal(a.counts.nextAttackBoost,1);assert.equal(a.soulState.nextAttackBoostFraction,1);
  a.counts.nextAttackBoost=0;a.soulState.nextAttackBoostFraction=0;c.dealt=300;effects.run('afterHit',rule.operations,c);
  assert.equal(a.counts.nextAttackBoost??0,0);
});

test('3575 效果 731 仅在本回合暴击后登记下回合其他攻击必暴，非暴击不登记',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const move=source.moves.find(m=>m.name==='荒芜狱渊裂');
  const rule=effects.compileInstances(move.effectInstances.filter(x=>x.id===731),source.effects);
  assert.equal(rule.issue,'');
  const a=fighter(800,600),t=fighter(600,800);a.side=0;t.side=1;
  const c={a,t,m:move,crit:true,round:1};effects.run('afterHit',rule.operations,c);assert.equal(a.counts.nextCrit,1);
  a.counts.nextCrit=0;c.crit=false;effects.run('afterHit',rule.operations,c);assert.equal(a.counts.nextCrit??0,0);
});

test('3575 效果 1006 仅在伤害超过阈值时登记下一回合异常免疫',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const move=source.moves.find(m=>m.name==='暗黑灭世断');
  const rule=effects.compileInstances(move.effectInstances.filter(x=>x.id===1006),source.effects);
  assert.equal(rule.issue,'');
  const a=fighter(800,600),t=fighter(600,800);a.side=0;t.side=1;const effectsState={};
  const c={a,t,m:move,dealt:301,round:1,timed:(f,k,n,d)=>{effectsState[k]={n,d};},emit:()=>{}};
  effects.run('afterHit',rule.operations,c);assert.equal(effectsState['免异常'].n,1);
  delete effectsState['免异常'];c.dealt=300;effects.run('afterHit',rule.operations,c);assert.equal(effectsState['免异常'],undefined);
});

test('3575 效果 1355 暴击登记一次异常免疫，非暴击与死亡攻击者不登记',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const move=source.moves.find(m=>m.name==='难·乾坤同罹');
  const rule=effects.compileInstances(move.effectInstances.filter(x=>x.id===1355),source.effects);
  assert.equal(rule.issue,'');
  const a=fighter(800,600),t=fighter(600,800);a.side=0;t.side=1;const c={a,t,m:move,crit:true,round:1};
  effects.run('afterHit',rule.operations,c);assert.equal(a.counts.immune,1);
  a.counts.immune=0;c.crit=false;effects.run('afterHit',rule.operations,c);assert.equal(a.counts.immune??0,0);
  a.hp=0;c.crit=true;effects.run('afterHit',rule.operations,c);assert.equal(a.counts.immune??0,0);
});

test('3575 效果 642 按真实参数登记 3 回合、50% 和强力反击类型',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const move=source.moves.find(m=>m.id===23797);
  const rule=effects.compileInstances(move.effectInstances.filter(x=>x.id===642),source.effects);
  assert.equal(rule.issue,'');
  const a=fighter(900,600),t=fighter(900,800);a.side=0;t.side=1;
  let saved;
  effects.run('afterHit',rule.operations,{a,t,m:move,round:1,timed:(f,k,n,d,start)=>{saved={f,k,n,d,start};}});
  assert.equal(saved.k,'在场反击');
  assert.equal(saved.n,3);
  assert.deepEqual(saved.d,{chance:50,action:2});
  assert.equal(saved.start,undefined);
});

test('3575 效果 642 的单精灵分支在攻击命中后造成 150 点固定反击，失败和到期不触发',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const opponent={...source,souls:[]};
  const make=(seed)=>{
    const s=E.createBattle({wikiSnapshots:[source,opponent],wikiLoadouts:[[23797,20496,10234,10611,31835],[10234,20496,10611,10615,31835]],criticals:false,seed,builds:[{overrides:{maxHp:1000,spe:900}},{overrides:{maxHp:1000,spe:1}}]});
    s.rng=0;
    return s;
  };
  let s=make('3575-642-success');
  s=E.resolveTurn(s,['wiki:23797','wiki:10234']);
  assert.equal(s.fighters[0].effects['在场反击'].end,3);
  assert.ok(s.fighters[1].hp<=850,'50%成功时应受到150点固定反击');
  assert.ok(s.turns[0].events.some(e=>e.text.includes('在场反击')));
  s=make('3575-642-failure');
  s.rng=1;
  s=E.resolveTurn(s,['wiki:23797','wiki:10234']);
  assert.ok(s.fighters[1].hp>850,'50%失败时不应受到反击');
  s=make('3575-642-expiry');
  s=E.resolveTurn(s,['wiki:23797','wiki:20496']);
  assert.ok(!s.turns[0].events.some(e=>e.text.includes('在场反击：')),'属性技能命中不应触发反击');
  s=E.resolveTurn(s,['wiki:20496','wiki:10234']);
  s=E.resolveTurn(s,['wiki:20496','wiki:10234']);
  s=E.resolveTurn(s,['wiki:20496','wiki:10234']);
  assert.ok(!s.turns.at(-1).events.some(e=>e.text.includes('在场反击：')),'第4回合不应触发已到期的反击');
});

test('3575 剩余单挑效果：732、923、1864 产生真实状态变化',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const get=(name,id)=>effects.compileInstances(source.moves.find(m=>m.name===name).effectInstances.filter(x=>x.id===id),source.effects);
  const a=fighter(500,600),t=fighter(700,800);a.side=0;t.side=1;
  const c={a,t,m:{name:'x'},crit:false,round:1,stage:(f,n,keys)=>keys.forEach(k=>f.stages[k]+=n),timed:(f,k,n,d)=>{f.effects[k]={start:1,end:n,...d};},clearBoost:f=>{const had=Object.values(f.stages).some(x=>x>0);for(const k of Object.keys(f.stages))if(f.stages[k]>0)f.stages[k]=0;return had;},ailment:(f,k)=>{f.ailments[k]=2;return true;},random:()=>0};
  effects.run('afterHit',get('荒芜狱渊裂',732).operations,c); assert.equal(a.stages.atk,2);
  effects.run('afterHit',get('逆鳞之咒',923).operations,c); assert.equal(a.effects['先手固定吸取'].amount,150); assert.equal(a.effects['先手固定吸取'].end,2);
  t.stages.atk=2; effects.run('afterHit',get('祸龑煌啼',1864).operations,c);
  assert.equal(t.stages.atk,0); assert.equal(t.ailments['虚弱诅咒'],2);
});

test('3575 效果 1329 受击攻击后累积邪龙之噬，1331/2162 保留换宠异常状态',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const get=(name,id)=>effects.compileInstances(source.moves.find(m=>m.name===name).effectInstances.filter(x=>x.id===id),source.effects).operations;
  const a=fighter(500,600),t=fighter(700,800);a.side=0;t.side=1;
  const c={a,t,m:{name:'x'},round:1,timed:(f,k,n,d)=>{f.effects[k]={start:1,end:n,...d};},emit:()=>{}};
  effects.run('afterHit',get('在劫难逃',1329),c); assert.equal(a.effects['邪龙之噬观察'].stacks,2);
  t.hp=0; effects.run('afterHit',get('难·苍生尽灭',1331),c); assert.equal(a.soulState.dragonEaterStacks,2); assert.equal(a.soulState.nextEntryAilment,6);
  effects.run('afterHit',get('难·乾坤同罹',2162),c); assert.equal(a.soulState.nextEntryAilment,23);
});

test('3575 效果 1330 获得邪龙之噬，2462 按顺序消耗并登记下一次攻击减免穿透',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const get=(name,id)=>effects.compileInstances(source.moves.find(m=>m.name===name).effectInstances.filter(x=>x.id===id),source.effects);
  const a=fighter(700,600),t=fighter(600,700);a.side=0;t.side=1;
  const events=[];const c={a,t,m:{name:'x'},round:1,emit:x=>events.push(x),name:f=>f===a?'A':'B'};
  effects.run('afterHit',get('荒芜狱渊裂',1330).operations,c);
  assert.equal(a.soulState.dragonEaterStacks,2);
  effects.run('afterHit',get('祸龑煌啼',2462).operations,c);
  assert.equal(a.soulState.dragonEaterStacks,0);
  assert.deepEqual(a.soulState.dragonScales,{blue:true,gold:true,black:false});
  assert.equal(a.counts.nextDamageReductionIgnore,.5);
  effects.run('afterHit',get('祸龑煌啼',2462).operations,c);
  assert.equal(a.counts.nextDamageReductionIgnore,.5);
});

test('3575 效果 2230 登记四回合用招回复与未回复疲惫参数',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const move=source.moves.find(m=>m.name==='祸龑煌啼');
  const rule=effects.compileInstances(move.effectInstances.filter(x=>x.id===2230),source.effects);
  assert.equal(rule.issue,'');
  const a=fighter(500,600),t=fighter(600,700);a.side=0;t.side=1;let saved;
  effects.run('afterHit',rule.operations,{a,t,m:move,round:1,timed:(f,k,n,d)=>{saved={f,k,n,d};}});
  assert.equal(saved.k,'2230持续');assert.equal(saved.n,4);assert.deepEqual(saved.d,{denominator:2,chance:100,ailment:7});
});

test('3575 效果 2230 在真实回合中按实际回复量判定疲惫',()=>{
  const source=require('../data/species/3575.json').snapshot;
  const opponent={...source,souls:[]};
  let s=E.createBattle({wikiSnapshots:[source,opponent],wikiLoadouts:[[29338,20496,10234,10611,31835],[10234,20496,10611,10615,31835]],criticals:false,builds:[{overrides:{maxHp:1000,spe:900}},{overrides:{maxHp:9999,spe:1}}]});
  s.fighters[0].hp=500;
  s=E.resolveTurn(s,['wiki:29338','potion:hp']);
  assert.equal(s.fighters[0].hp,1000);
  s=E.resolveTurn(s,['wiki:20496','potion:hp']);
  assert.ok(s.turns.at(-1).events.some(e=>e.text.includes('陷入疲惫')));
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3575 927原子实际回复与技能禁疗公共修复',()=>{const o=require('./helpers/assert-4200-public-heal.cjs')(3575,927);assert.ok(o.fighters[0].hp>1000);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3575 923原子实际回复与技能禁疗公共修复',()=>{const o=require('./helpers/assert-4200-public-heal.cjs')(3575,923);assert.equal(o.fighters[0].hp,1000);});}
