'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4535-battle.cjs'),shields=require('../dist/shield-rules.js');
const {E,make,turn,timer,key,source}=H,e=id=>H.pick(id)[0];

test('4535精简第6题：其他防御减伤和护盾后200被1011免疫，整招直接扣200且盾实际消耗',()=>{
 const s=make(H.pick(1011)[1],{soul:1747,bStats:{atk:9999}});timer(s,0,'攻击伤害上限',{amount:220});shields.add(s.fighters[0],20,'4535-final-test');
 const o=turn(s,undefined,920040);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[0].suitState.shield,0);
 assert.equal(o.fighters[1].hp,8800);assert.equal(o.youmei1011Events[0].amount,200);assert.equal(o.healthLossEvents.filter(x=>x.type==='direct').length,1);
});

test('4535精简第6题：1011和真实46免攻后获得优先，较早次数免攻保留，较晚次数消费后恢复1011',()=>{
 for(const later of ['1011','46']){
  let s=make(H.pick(1011)[1]);H.op(s,46,[1],920031);
  if(later==='1011'){s=turn(s,920031);s=turn(s);}else{s=turn(s);s=turn(s,920031);}
  const before=s.fighters[1].hp,o=turn(s,920032,920040);
  assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[0].counts.attackNullify,later==='1011'?1:0);
  assert.equal(o.youmei1011Events.at(-1).amount>0,later==='1011');assert.equal(o.fighters[1].hp<before,later==='1011');
  if(later==='46'){const next=turn(o,920032,920040);assert.ok(next.youmei1011Events.at(-1).amount>0);}
 }
});

test('4535用户001整招概率：50%两段要么全部免疫要么都不免，返扣只结算一次',()=>{
 const found=new Set;
 for(let i=0;i<30;i++){
  const s=make(e(1011),{seed:Math.imul(i+1,2654435761)>>>0});H.op(s,31,[2,2],920040);const o=turn(s,undefined,920040),memo=o.youmei1011Events[0];found.add(memo.selected);
  const red=o.damageEvents.filter(x=>x.type==='attack'&&x.sourceSide===1);assert.equal(red.length,2);
  assert.ok(red.every(x=>memo.selected?x.settledDamage===0:x.settledDamage>0));assert.equal(o.healthLossEvents?.filter(x=>x.type==='direct').length??0,memo.selected?1:0);
 }
 assert.deepEqual([...found].sort(),[false,true]);
});

test('4535用户002：当前复活对手不受下一只1090封锁，攻击红伤及附效照常',()=>{
 const revival=require('../research/3739-reviewed-snapshot.json').souls.find(x=>x.id===1017);let found;
 for(let i=0;i<30&&!found;i++){
  const s=make(e(1090),{targetHp:1,enemySoul:revival,seed:Math.imul(i+1,2654435761)>>>0}),o=turn(s);if(o.fighters[1].hp>0)found=o;
 }
 assert.ok(found);assert.equal(found.fighters[0].soulState.youmei1090NextOpponent,undefined);assert.equal(found.fighters[1].effects['攻击技能命中效果失效'],undefined);
 H.op(found,5,[0,100,-1],920040);const o=turn(found,920031,920040);assert.ok(o.fighters[0].hp<found.fighters[0].hp);assert.equal(o.fighters[0].stages.atk,-1);
});

test('4535最新封锁确认：技能固有先制和技能词条全封，独立1747战阶魂印回复保留',()=>{
 const s=make(e(2043),{soul:1747,hp:1000,aStats:{spe:1}});s.fighters[0].stages.atk=1;s.fighters[1].soulState.guiFu1747=2;timer(s,0,'技能命中效果失效');
 const o=turn(s);assert.equal(o.fighters[0].soulState.resolvedPriority.value,0);assert.equal(o.turns.at(-1).first,1);assert.equal(o.fighters[0].hp,4000);
});

test('4535全部22真实技能与原魂印1747：完整原效果、合法第五、真实使用和PP消费',()=>{
 const other=require('../research/4509-reviewed-snapshot.json');assert.equal(source.moves.length,22);
 for(const m of source.moves){
  const ids=[m.id,...E.WIKI.defaultMoves(source)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);if(!ids.includes(36762))ids[ids.length-1]=36762;
  const s=E.createBattle({wikiSnapshots:[source,other],wikiLoadouts:[ids,E.WIKI.defaultMoves(other)],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});
  timer(s,0,'攻击必中');timer(s,0,'属性必中');const enemy=other.moves.find(x=>x.kind==='status'&&s.fighters[1].moves.includes(key(x.id)));assert.ok(enemy);
  const o=E.resolveTurn(s,[key(m.id),key(enemy.id)]);assert.equal(s.fighters[0].soulId,1747);assert.equal(o.fighters[0].soulState.skillUses[key(m.id)],1);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1);
 }
});
