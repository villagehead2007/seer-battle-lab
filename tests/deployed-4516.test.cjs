'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4516-battle.cjs');
const {E,make,turn,timer,key,source}=H,e=id=>H.pick(id)[0],shields=require('../dist/shield-rules.js');
const red=s=>(s.damageEvents??[]).filter(x=>x.round===s.round-1&&x.type==='attack'&&x.targetSide===0).reduce((n,x)=>n+x.settledDamage,0);

test('4516用户002：完整28337先消费1554免攻再消费1677零伤转换，禁疗不阻止消费',()=>{
 const s=make({moveId:28337,index:null},{hp:1000}),o=turn(s,undefined,920040);
 assert.equal(o.fighters[0].hp,500);assert.equal(o.fighters[0].counts.attackNullify,0);assert.equal(o.fighters[0].counts.nextAttackHealing,0);
 assert.equal(o.fighters[0].soulState.panNullify1554,undefined);assert.equal(o.fighters[0].soulState.panConversion1677,undefined);
 assert.equal(o.fighters[0].soulState.lastSettledAttackConversion.effectId,1677);assert.equal(o.fighters[0].soulState.lastSettledAttackConversion.amount,0);assert.equal(red(o),0);
 const next=turn(o,920031,920040);assert.ok(red(next)>0);
});

test('4516用户002：1677按防御减免免疫盾罩后完整红伤回复，过量不截HP且零伤禁疗均消费',()=>{
 for(const mode of ['plain','shield-part','shield-full','barrier-full','cap','zero','ban','overkill']){
  let s=turn(make(e(1677),{hp:1000}));
  if(mode==='shield-part')shields.add(s.fighters[0],1);
  if(mode==='shield-full')shields.add(s.fighters[0],1000);
  if(mode==='barrier-full')shields.addBarrier(s.fighters[0],1000);
  if(mode==='cap')timer(s,0,'攻击伤害上限',{amount:7});
  if(mode==='zero')timer(s,0,'当回合免伤');
  if(mode==='ban')timer(s,0,'技能禁疗');
  if(mode==='overkill')s.fighters[0].hp=1;
  const before=s.fighters[0].hp,b=structuredClone(s);b.fighters[0].counts.nextAttackHealing=0;
  const ref=turn(b,920031,920040),o=turn(s,920031,920040),amount=red(ref);
  assert.equal(o.fighters[0].counts.nextAttackHealing,0);assert.equal(o.fighters[0].soulState.lastSettledAttackConversion.amount,amount);
  assert.equal(o.fighters[0].hp,before+(mode==='ban'?0:amount));assert.equal(red(o),0);
  if(['shield-full','zero'].includes(mode))assert.equal(amount,0);
  if(mode==='cap')assert.ok(amount<=7);
  if(mode==='overkill'){assert.ok(amount>1);assert.equal(ref.fighters[0].hp,0);}
 }
});

test('4516用户确认次数：1554与46异源叠加且46先消费，同源1554刷新保留其他来源',()=>{
 let s=turn(make(e(1554),{hp:1000}));H.op(s,46,[1],920031);s=turn(s,920031);
 assert.equal(s.fighters[0].counts.attackNullify,2);assert.equal(s.fighters[0].soulState.panNullify1554,1);
 s=turn(s,920032,920040);assert.equal(s.fighters[0].counts.attackNullify,1);assert.equal(s.fighters[0].soulState.panNullify1554,1);assert.equal(red(s),0);
 s=turn(s,920032,920040);assert.equal(s.fighters[0].counts.attackNullify,0);assert.equal(s.fighters[0].soulState.panNullify1554,undefined);assert.equal(red(s),0);
 let q=turn(make(e(1554),{hp:1000}));q=turn(q);assert.equal(q.fighters[0].counts.attackNullify,1);
});

test('4516全部17真实技能与1728：合法配招与原参数执行，真实属性招连续系数与PP消费',()=>{
 const other=require('../research/4509-reviewed-snapshot.json');assert.equal(source.moves.length,17);
 for(const m of source.moves){
  const ids=[m.id,...E.WIKI.defaultMoves(source)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);if(!ids.includes(36662))ids[ids.length-1]=36662;
  const s=E.createBattle({wikiSnapshots:[source,other],wikiLoadouts:[ids,E.WIKI.defaultMoves(other)],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});
  timer(s,0,'攻击必中');timer(s,0,'属性必中');const enemy=other.moves.find(x=>x.kind==='status'&&s.fighters[1].moves.includes(key(x.id)));assert.ok(enemy);
  const o=E.resolveTurn(s,[key(m.id),key(enemy.id)]);assert.equal(s.fighters[0].soulId,1728);assert.equal(o.fighters[0].soulState.skillUses[key(m.id)],1);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1);
  if(m.kind==='status')assert.equal(o.fighters[0].soulState.panisStatusStreak,1);
 }
});
