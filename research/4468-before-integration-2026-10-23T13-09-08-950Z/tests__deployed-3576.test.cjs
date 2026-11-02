const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const effects=require('../dist/effect-registry.js');

const source=require('../data/species/3576.json').snapshot;
const soul=E.SOULS.registry[877];
function fighter(hp=800,oppHp=800){return {hp,stats:{maxHp:1000},soulState:{},stages:{atk:0,def:0,spa:0,spd:0,spe:0,acc:0},ailments:{},effects:{},counts:{},side:0,moves:['a','b'],pp:{a:3,b:2}};}
function context(a,t,random=()=>0){const events=[];return {a,t,round:1,m:{kind:'status',name:'测试技能'},random,emit:x=>events.push(x),name:f=>f===a?'A':'B',heal:(f,n)=>{f.hp=Math.min(f.stats.maxHp,f.hp+Math.floor(n));},hurt:(f,n)=>{const v=Math.min(f.hp,Math.floor(n));f.hp-=v;return v;},stage:(f,n,keys)=>{for(const k of keys??Object.keys(f.stages))f.stages[k]+=n;},timed:(f,k,n,d,start=1)=>{f.effects[k]={start,end:start+n-1,...d};},clear:(f)=>{const had=Object.keys(f.effects).length>0;f.effects={};return had;},clearBoost:()=>false,randomAllPvpAilments:(n,id)=>E.STATUS_RULES.randomAilments({a,t,round:1,random,ailment:(f,k)=>{f.ailments[k]=2;return true;}},n,id,require('../dist/status-pools.js').pool(undefined,{includeRestricted:true}).map(x=>x.name)),ailment:(f,k)=>{f.ailments[k]=2;return true;},events};}

test('3576 快照保留魂印877、第五技能和电次元属性组合',()=>{
  assert.equal(source.souls[0].id,877);
  assert.equal(source.souls[0].hash,'7962bd41');
  assert.equal(source.moves.find(m=>m.id===31843).fifth,true);
  assert.deepEqual(source.typeChart.aliases['电次元'],['电','次元']);
  assert.equal(soul.sourceHash,source.souls[0].hash);
});

test('3576 效果1332清除回合效果后随机附加两种不同异常，清除失败不附加',()=>{
  const move=source.moves.find(m=>m.id===31838),rule=effects.compileInstances(move.effectInstances.filter(x=>x.id===1332),source.effects);
  assert.equal(rule.issue,'');
  const a=fighter(),t=fighter();a.side=0;t.side=1;t.effects.foo={start:1,end:2};
  const c=context(a,t,()=>0);effects.run('afterHit',rule.operations,c);
  assert.equal(t.effects.foo,undefined);assert.equal(Object.keys(t.ailments).length,2);
  const b=fighter(),u=fighter();b.side=0;u.side=1;const d=context(b,u,()=>0);effects.run('afterHit',rule.operations,d);
  assert.equal(Object.keys(u.ailments).length,0);
});

test('3576 效果1270按80%麻痹与未触发的下次技能无效分支执行',()=>{
  const move=source.moves.find(m=>m.id===26029),rule=effects.compileInstances(move.effectInstances.filter(x=>x.id===1270),source.effects);
  assert.equal(rule.issue,'');
  const a=fighter(),t=fighter();a.side=0;t.side=1;let c=context(a,t,()=>0);effects.run('afterHit',rule.operations,c);assert.equal(t.ailments['麻痹'],2);assert.equal(t.counts.nextSkillInvalid??0,0);
  const b=fighter(),u=fighter();b.side=0;u.side=1;c=context(b,u,()=>.99);effects.run('afterHit',rule.operations,c);assert.equal(u.ailments['麻痹'],undefined);assert.equal(u.counts.nextSkillInvalid,1);
});

test('3576 效果875消耗自身体力、清空对手PP并全属性下降',()=>{
  const move=source.moves.find(m=>m.id===31842),rule=effects.compileInstances(move.effectInstances.filter(x=>x.id===875),source.effects);
  assert.equal(rule.issue,'');
  const a=fighter(400),t=fighter();a.side=0;t.side=1;const c=context(a,t);c.m=move;effects.run('afterHit',rule.operations,c);
  assert.equal(a.hp,0);assert.deepEqual(t.pp,{a:0,b:0});assert.deepEqual(t.stages,{atk:-1,def:-1,spa:-1,spd:-1,spe:-1,acc:-1});
});

test('魂印877在对手攻击命中前全属性-1，并在阶段结束复制自身异常和弱化',()=>{
  const a=fighter(700),t=fighter();a.side=0;t.side=1;a.ailments['烧伤']=2;a.stages.atk=-2;a.effects.round={start:1,end:2};
  let c=context(a,t);c.m={kind:'physical',name:'攻击'};soul.hooks.beforeOpponentAttack(c);assert.deepEqual(t.stages,{atk:-1,def:-1,spa:-1,spd:-1,spe:-1,acc:-1});
  soul.hooks.roundEnd(c);assert.equal(t.effects.round,undefined);assert.equal(t.stages.atk,-3);assert.equal(t.ailments['烧伤'],2);
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3576 1065公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1065-atomic-heal.cjs')(3576);assert.equal(o.fighters[0].hp,8960);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3576 583真实实例PP保护及免疫PP削减公共修复状态验证',()=>{const o=require('./helpers/assert-583-pp-protection.cjs')(3576);assert.ok(o.fighters[1].moves.every(k=>o.fighters[1].pp[k]>0));});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3576 31843效果1061公共反转事件或PP保护真实回归',()=>{const o=require('./helpers/assert-1061-reversal-path.cjs')(3576,31843);assert.ok(o.fighters[0].hp>0);});}
