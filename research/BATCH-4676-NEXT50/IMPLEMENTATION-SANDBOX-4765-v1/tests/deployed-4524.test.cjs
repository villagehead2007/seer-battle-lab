'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4524-battle.cjs');
const {E,make,turn,timer,key,source}=H,e=id=>H.pick(id)[0];
const red=(s,side=1)=>(s.damageEvents??[]).filter(x=>x.round===s.round-1&&x.type==='attack'&&x.sourceSide===side);
function ignoreMulti(s){H.op(s,31,[2,2],920040);const hits=s.moveDefinitions[key(920040)].operations;H.op(s,699,[],920040);s.moveDefinitions[key(920040)].operations.push(...hits);}

test('4524用户001：法天直接设满HP与PP、清异常，不触发回复拦截或魂蛊回复消费',()=>{
 const entry={moveId:source.moves.find(m=>m.kind==='status').id,index:-1};
 for(const mode of ['ban','half','prison','gu']){
  const s=make(entry,{soul:1738,hp:1000});s.fighters[0].ailments['混乱']=3;
  for(const id of s.fighters[0].moves)s.fighters[0].pp[id]=1;
  if(mode==='ban')timer(s,0,'回复效果削减',{fraction:1});if(mode==='half')timer(s,0,'回复效果削减',{fraction:.5});if(mode==='prison')timer(s,0,'四杀鬼囹');
  if(mode==='gu')s.fighters[0].soulState.soulGu=[{sourceSide:1,usedRound:0}];
  const o=turn(s);assert.equal(o.fighters[0].hp,9000);assert.deepEqual(o.fighters[0].ailments,{});assert.equal(o.fighters[0].soulState.wukongSaintSpent,true);
  for(const id of o.fighters[0].moves)assert.equal(o.fighters[0].pp[id],s.moveDefinitions[id].pp-(id===key(s.auditMoveId)?1:0));
  assert.equal(o.turns.at(-1).events.some(x=>x.type==='heal'),false);
  if(mode==='gu')assert.equal(o.fighters[0].soulState.soulGu[0].usedRound,0);
 }
});

test('4524用户002：1288被无视的两段攻击全部结算后才焚烬，一次消费且异常免疫不补试',()=>{
 for(const immune of [false,true]){
  let s=turn(make(e(1288)));ignoreMulti(s);if(immune)timer(s,1,'免异常');
  const b=structuredClone(s);b.fighters[0].counts.attackNullify=0;delete b.fighters[0].soulState.wukongNullify1288;b.fighters[0].soulState.attackNullifySources=[];
  const ref=turn(b,920031,920040),o=turn(s,920031,920040);
  assert.equal(red(o).length,2);assert.deepEqual(red(o).map(x=>x.settledDamage),red(ref).map(x=>x.settledDamage));
  assert.equal(o.fighters[0].hp,ref.fighters[0].hp);assert.equal(o.fighters[0].counts.attackNullify,0);assert.equal(!!o.fighters[1].ailments['焚烬'],!immune);
  assert.equal(o.immunityFailureEvents.length,1);assert.equal(o.immunityFailureEvents[0].phase,'afterAttack');
 }
});

test('4524用户002关联次数：1288同源刷新并移到最新，异源46保留，未命中不消费补偿',()=>{
 let s=turn(make(e(1288)));H.op(s,46,[1],920031);s=turn(s,920031);s=turn(s);
 assert.equal(s.fighters[0].counts.attackNullify,2);assert.equal(s.fighters[0].soulState.attackNullifySources.at(-1).kind,'1288');
 H.op(s,699,[],920040);s=turn(s,920032,920040);assert.equal(s.fighters[0].counts.attackNullify,1);assert.equal(s.fighters[0].soulState.wukongNullify1288,undefined);assert.ok(s.fighters[1].ailments['焚烬']);
 let q=turn(make(e(1288)));H.op(q,699,[],920040);q.moveDefinitions[key(920040)].alwaysHit=false;q.moveDefinitions[key(920040)].accuracy=0;
 q=turn(q,920031,920040);assert.equal(q.fighters[0].counts.attackNullify,1);assert.equal(q.fighters[1].ailments['焚烬'],undefined);
});

test('4524用户003：1846与1230不同数值先制各自保存、同时消费且加值共同影响行动顺序',()=>{
 let s=turn(make(e(1846),{hp:1000,aStats:{spe:1}}));H.op(s,1230,[1,1],920031);s=turn(s,920031);
 const sources=s.fighters[0].soulState.skillPrioritySources;assert.equal(sources.length,2);assert.deepEqual(sources.map(x=>[x.effectId,x.count,x.amount]),[[1846,1,2],[1230,1,1]]);
 s.moveDefinitions[key(920040)].priority=2;let o=turn(s,920032,920040);assert.equal(o.turns.at(-1).first,0);assert.equal(o.fighters[0].counts.nextSkillPriority,0);assert.deepEqual(o.fighters[0].soulState.skillPrioritySources,[]);
 o=turn(o,920032,920040);assert.equal(o.turns.at(-1).first,1);
});

test('4524全部17真实技能与原魂印1738：全部原效果执行、配招和真实PP消费',()=>{
 const other=require('../research/4509-reviewed-snapshot.json');assert.equal(source.moves.length,17);
 for(const m of source.moves){
  const ids=[m.id,...E.WIKI.defaultMoves(source)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);if(!ids.includes(36707))ids[ids.length-1]=36707;
  const s=E.createBattle({wikiSnapshots:[source,other],wikiLoadouts:[ids,E.WIKI.defaultMoves(other)],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});
  timer(s,0,'攻击必中');timer(s,0,'属性必中');const enemy=other.moves.find(x=>x.kind==='status'&&s.fighters[1].moves.includes(key(x.id)));assert.ok(enemy);
  const o=E.resolveTurn(s,[key(m.id),key(enemy.id)]);assert.equal(s.fighters[0].soulId,1738);assert.equal(o.fighters[0].soulState.skillUses[key(m.id)],1);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1);
 }
});
