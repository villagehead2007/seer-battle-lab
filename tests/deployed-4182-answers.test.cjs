'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),{make,pick,turn,timer,key,E}=require('./helpers/4182-battle.cjs');
const hit=s=>(s.damageEvents??[]).find(e=>e.type==='attack'&&e.sourceSide===0),crit=s=>hit(s)?.critical;
test('4182 441首次额外10逐次封顶50，仅该技能计数，无需连续，暴击真实伤害对照',()=>{
 let s=make(pick(441)[0],{criticals:true});for(let n=1;n<=7;n++){
  s.fighters[0].hp=s.fighters[1].hp=9000;s.fighters[0].pp[key(s.auditMoveId)]=99;const reference=structuredClone(s),move=reference.moveDefinitions[key(s.auditMoveId)];move.operations=[];move.criticalChance=1/16+Math.min(50,n*10)/100;
  for(let seed=0;seed<15;seed++){const a=structuredClone(s),b=structuredClone(reference);a.rng=b.rng=seed;assert.equal(hit(turn(a)).settledDamage,hit(turn(b)).settledDamage);}
  s=turn(s);assert.equal(s.fighters[0].soulState.moveCrit441[key(s.auditMoveId)],n);
  s=turn(s,920030);assert.equal(s.fighters[0].soulState.moveCrit441[key(s.auditMoveId)],n);
  s=turn(s,920031);assert.equal(s.fighters[0].soulState.moveCrit441[key(s.auditMoveId)],n);
 }
});
test('4182 441控制与MISS不成长，三枚命中效果失效不成长',()=>{
 let s=make(pick(441)[0]);s.fighters[0].ailments['疲惫']=2;assert.equal(turn(s).fighters[0].soulState.moveCrit441,undefined);
 s=make(pick(441)[0],{hit:false});s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;const o=turn(s);assert.equal(hit(o),undefined);assert.equal(o.fighters[0].soulState.moveCrit441,undefined);
 s=make(pick(441)[0]);s.fighters[0].soulState.fatalMarks={[key(s.auditMoveId)]:3};assert.equal(turn(s).fighters[0].soulState.moveCrit441,undefined);
});
test('4182魂印无异常快照失败忽防15至30立即改变当前物攻特攻含暴击伤害，次回合仅攻击先制1',()=>{
 const fractions=new Set();for(const kind of ['physical','special'])for(let seed=0;seed<70;seed++){
  const s=make({moveId:10004,index:null},{soul:1406,seed});s.moveDefinitions[key(s.auditMoveId)].kind=kind;timer(s,1,'免异常');if(seed%2)timer(s,0,'必定暴击');
  const o=turn(s),f=o.fighters[0].soulState.fallenDragonLastIgnore.fraction;fractions.add(f);assert.ok(f>=.15&&f<=.30);
  const b=structuredClone(s);b.fighters[0].soulId=0;b.rng=(b.rng+2*0x6D2B79F5)>>>0;const stat=kind==='special'?'spd':'def';b.fighters[1].stats[stat]=Math.floor(b.fighters[1].stats[stat]*(1-f));
  const expected=hit(turn(b)).settledDamage;assert.ok(Math.abs(hit(o).settledDamage-expected*1.25)<=2);assert.equal(o.fighters[0].soulState.fallenDragonPriorityRound,2);
 }assert.equal(fractions.size,16);
 for(const attack of [true,false]){const s=make({moveId:10004,index:null},{soul:1406,aStats:{spe:1},bStats:{spe:900}});timer(s,1,'免异常');let o=turn(s);o=turn(o,attack?920030:920031);const first=o.turns.at(-1).events.find(e=>e.kind==='move').text;assert.equal(first.startsWith('A 方'),attack);}
});
test('4182魂印成功害怕不补忽防先制，免疫进入补偿，回合初已有异常及MISS不触发',()=>{
 let success=false;for(let seed=0;seed<80&&!success;seed++){
  const s=make({moveId:10004,index:null},{soul:1406,seed}),o=turn(s);if(o.fighters[1].ailments['害怕']){success=true;assert.equal(o.fighters[0].soulState.fallenDragonLastIgnore,undefined);assert.equal(o.fighters[0].soulState.fallenDragonPriorityRound,undefined);}
 }assert.equal(success,true);
 for(const mode of ['ailment','miss']){const s=make({moveId:10004,index:null},{soul:1406,hit:false});if(mode==='ailment')s.fighters[1].ailments['失明']=3;else{s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;}const o=turn(s);assert.equal(o.fighters[0].soulState.fallenDragonLastIgnore,undefined);assert.equal(o.fighters[1].ailments['害怕'],undefined);}
});
