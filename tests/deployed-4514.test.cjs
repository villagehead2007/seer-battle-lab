'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/4514-battle.cjs'),{E,make,turn,timer,key,source}=H,e=id=>H.pick(id)[0];
const sum=(s,type='attack',side=0)=>(s.damageEvents??[]).filter(x=>x.type===type&&x.sourceSide===side).reduce((n,x)=>n+x.settledDamage,0);

test('4514用户001：失明与整招封锁只尝试一次烧伤，免疫消费不重试，命中效果失效不补偿',()=>{
 for(const mode of ['blind','blocked','immune-blind','immune-blocked','hit-disabled']){
  const s=make(e(2018));if(mode.includes('blind'))s.fighters[0].ailments['失明']=3;
  if(mode.includes('blocked'))timer(s,0,'skillBlock');
  if(mode.startsWith('immune'))s.fighters[1].counts.immune=1;
  if(mode==='hit-disabled')timer(s,0,'攻击技能命中效果失效');
  const o=turn(s);assert.equal(!!o.fighters[1].ailments['烧伤'],['blind','blocked'].includes(mode));
  if(mode.startsWith('immune'))assert.equal(o.fighters[1].counts.immune,0);
  assert.equal(o.fighters[0].pp[key(s.auditMoveId)],s.fighters[0].pp[key(s.auditMoveId)]-1);
 }
});

test('4514用户002：1040先手后对手仍实际行动，睡眠在战阶末生效且下一回合阻止行动',()=>{
 const s=make(e(1040));H.op(s,4,[0,100,1],920041);
 const o=turn(s);assert.equal(o.fighters[1].stages.atk,1);assert.ok(o.fighters[1].ailments['睡眠']);
 assert.equal(o.fighters[1].pp[key(920041)],98);
 const next=turn(o,920031);assert.equal(next.fighters[1].pp[key(920041)],98);assert.equal(next.fighters[1].stages.atk,1);
});

test('4514用户002：1040免疫失败才全强，命中失效和MISS不登记，双方死亡均不结算睡眠',()=>{
 for(const mode of ['immune','miss','disabled','target-dead','self-dead']){
  const s=make(e(1040),{targetHp:mode==='target-dead'?1:9000,hp:mode==='self-dead'?1:9000,hit:mode!=='miss'});
  if(mode==='immune')timer(s,1,'免异常');
  if(mode==='miss'){s.moveDefinitions[key(s.auditMoveId)].accuracy=0;s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;}
  if(mode==='disabled')timer(s,0,'攻击技能命中效果失效');
  const o=turn(s,undefined,mode==='self-dead'?920040:920041);
  assert.equal(o.fighters[1].ailments['睡眠'],undefined);
  assert.equal(o.fighters[0].stages.atk,mode==='immune'?1:0);
  if(mode==='target-dead')assert.equal(o.fighters[1].hp,0);
  if(mode==='self-dead')assert.equal(o.fighters[0].hp,0);
 }
});

test('4514用户004：火焰战衣对物理MISS不施异常也不消费免异次数，真实命中仍覆盖概率两态',()=>{
 for(let seed=0;seed<8;seed++){
  let s=make(e(108),{seed});s=turn(s);s.fighters[1].counts.immune=1;
  s.moveDefinitions[key(920040)].accuracy=0;s.moveDefinitions[key(920040)].alwaysHit=false;
  const o=turn(s,920031,920040);assert.equal(o.fighters[1].ailments['烧伤'],undefined);assert.equal(o.fighters[1].counts.immune,1);
 }
});

test('4514关联807：敌方整次多段红伤合计，属性间隔保留，新攻击MISS覆盖为零',()=>{
 let s=make(e(807));H.op(s,31,[2,2],920040);s=turn(s,920031,920040);const red=sum(s,'attack',1);assert.ok(red>0);
 s=turn(s,920031);let o=turn(s);assert.equal(sum(o,'fixed'),red);
 o.moveDefinitions[key(920040)].accuracy=0;o.moveDefinitions[key(920040)].alwaysHit=false;delete o.fighters[1].effects['攻击必中'];
 o=turn(o,920031,920040);assert.equal(sum(o,'attack',1)-sum(s,'attack',1),0);
 const before=sum(o,'fixed');o=turn(o);assert.equal(sum(o,'fixed')-before,0);
});

test('4514全部18真实技能含追加37024：合法配招、原魂印1726及真实用招PP状态',()=>{
 const opponent=require('../research/4509-reviewed-snapshot.json');assert.equal(source.moves.length,18);
 for(const m of source.moves){
  const ids=[m.id,...E.WIKI.defaultMoves(source)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);if(!ids.includes(36652))ids[ids.length-1]=36652;
  const s=E.createBattle({wikiSnapshots:[source,opponent],wikiLoadouts:[ids,E.WIKI.defaultMoves(opponent)],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});
  const enemy=opponent.moves.find(x=>x.kind==='status'&&s.fighters[1].moves.includes(key(x.id)));assert.ok(enemy);
  timer(s,0,'攻击必中');timer(s,0,'属性必中');const o=E.resolveTurn(s,[key(m.id),key(enemy.id)]);
  assert.equal(s.fighters[0].soulId,1726);assert.equal(o.fighters[0].soulState.skillUses[key(m.id)],1);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1);
 }
});
