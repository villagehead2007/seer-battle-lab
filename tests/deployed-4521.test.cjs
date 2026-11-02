'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4521-battle.cjs');
const {E,make,turn,timer,key,source}=H,e=id=>H.pick(id)[0];
const red=(s,side=0)=>(s.damageEvents??[]).filter(x=>x.type==='attack'&&x.sourceSide===side&&x.round===s.round-1);
function controlledRoll(work,react){const old=E.SOULS;E.SOULS={...old,run(event,c){if(c.a.soulId===1733)c.random=()=>.99;old.run(event,c);react?.(event,c);}};try{return work();}finally{E.SOULS=old;}}

test('4521用户001：1733冰封伤害前中断敌方首段，PP不消费且命中强化不执行',()=>{
 controlledRoll(()=>{const s=make(e(2033),{soul:1733});s.fighters[0].soulState.whirlpoolIceNextDouble=true;H.op(s,4,[0,100,1],920040);
  const o=turn(s,920031,920040);assert.ok(o.fighters[1].ailments['冰封']);assert.equal(red(o,1).length,0);
  assert.equal(o.fighters[1].pp[key(920040)],99);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[0].hp,9000);
  assert.equal(o.controlInterruptEvents.at(-1).refundedPP,1);assert.equal(o.fighters[0].soulState.whirlpoolIceNextDouble,false);
 });
});

test('4521用户001：1733害怕反弹中断自身攻击，PP倍耗全额退回且2033命中后清PP不执行',()=>{
 controlledRoll(()=>{const s=make(e(2033),{soul:1733});s.fighters[0].soulState.whirlpoolFearNextDouble=true;timer(s,1,'reflect');timer(s,0,'PP消耗倍增',{multiple:2});
  const before=s.fighters[0].pp[key(s.auditMoveId)],o=turn(s);assert.ok(o.fighters[0].ailments['害怕']);assert.equal(red(o).length,0);
  assert.equal(o.fighters[0].pp[key(s.auditMoveId)],before);assert.equal(o.fighters[1].pp[key(920040)],99);
  assert.equal(o.controlInterruptEvents.at(-1).refundedPP,2);
 });
});

test('4521最新补答C：首段真实受击后麻痹当前攻击者，本招余段继续且本次PP不退',()=>{
 let applied=false;
 controlledRoll(()=>{const s=make(e(2033),{soul:1733});H.op(s,31,[2,2],s.auditMoveId);const o=turn(s);
  assert.equal(applied,true);assert.ok(o.fighters[0].ailments['麻痹']);assert.equal(red(o).length,2);
  assert.ok(red(o).every(x=>x.settledDamage>0));assert.equal(o.fighters[0].pp[key(s.auditMoveId)],s.fighters[0].pp[key(s.auditMoveId)]-1);
  assert.equal(o.controlInterruptEvents,undefined);
 },(event,c)=>{if(!applied&&event==='receivedAttack'&&c.a.side===1&&c.dealt>0){applied=true;c.ailment(c.t,'麻痹',c.a);}});
});

test('4521用户003：双方MISS不消费概率翻倍，下次真正异常尝试以100%消费',()=>{
 controlledRoll(()=>{let s=make(e(2033),{soul:1733,hit:false});s.fighters[0].soulState.whirlpoolFearNextDouble=true;
  s.moveDefinitions[key(s.auditMoveId)].accuracy=0;s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s=turn(s);
  assert.equal(s.fighters[0].soulState.whirlpoolFearNextDouble,true);s.moveDefinitions[key(s.auditMoveId)].alwaysHit=true;s=turn(s);
  assert.equal(s.fighters[0].soulState.whirlpoolFearNextDouble,false);assert.ok(s.fighters[1].ailments['害怕']);
  let q=make(e(2033),{soul:1733});q.fighters[0].soulState.whirlpoolIceNextDouble=true;q.moveDefinitions[key(920040)].accuracy=0;q.moveDefinitions[key(920040)].alwaysHit=false;q=turn(q,920031,920040);
  assert.equal(q.fighters[0].soulState.whirlpoolIceNextDouble,true);q.moveDefinitions[key(920040)].alwaysHit=true;q=turn(q,920031,920040);
  assert.equal(q.fighters[0].soulState.whirlpoolIceNextDouble,false);assert.ok(q.fighters[1].ailments['冰封']);assert.equal(red(q,1).length,0);
 });
});

test('4521全部17真实技能与1733：合法配招、全部原效果执行及真实PP消费',()=>{
 const other=require('../research/4509-reviewed-snapshot.json');assert.equal(source.moves.length,17);
 for(const m of source.moves){
  const ids=[m.id,...E.WIKI.defaultMoves(source)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);if(!ids.includes(36690))ids[ids.length-1]=36690;
  const s=E.createBattle({wikiSnapshots:[source,other],wikiLoadouts:[ids,E.WIKI.defaultMoves(other)],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});
  timer(s,0,'攻击必中');timer(s,0,'属性必中');const enemy=other.moves.find(x=>x.kind==='status'&&s.fighters[1].moves.includes(key(x.id)));assert.ok(enemy);
  const o=E.resolveTurn(s,[key(m.id),key(enemy.id)]);assert.equal(s.fighters[0].soulId,1733);assert.equal(o.fighters[0].soulState.skillUses[key(m.id)],1);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1);
 }
});
