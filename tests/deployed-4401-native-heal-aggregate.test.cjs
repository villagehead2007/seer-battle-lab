'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4401-native.cjs');
test('4401两真实互斥版本原11904与15247首击4499等半4500及4501快照不随实际反弹跨线重取，整招红聚合仅一次粉伤回血',()=>{
 for(const source of H.versions)for(const move of[11904,15247])for(const hp of[4499,4500,4501]){
  const{state,raw}=H.make(source,move,{hp,bEffects:{受击反弹:{start:1,end:1,fraction:1,type:'percent'}}}),s=H.turn(state,move),red=H.sum(s,'attack'),low=hp<4500,reflection=H.events(s,'percent',1,0).reduce((n,e)=>n+e.hpLoss,0);
  assert.equal(s.fighters[0].pp['wiki:'+move],raw.pp-1);assert.ok(H.events(s,'attack').length>=4);assert.ok(red>1);assert.equal(s.fighters[0].soulState.telosFirstHitHp,hp);assert.equal(s.fighters[0].soulState.telosLowHit,low);
  assert.equal(H.sum(s,'percent'),low?red:0);assert.equal(H.events(s,'percent').length,low?1:0);assert.equal(s.fighters[0].hp,hp-reflection+(low?red:0));
  if(hp>=4500){assert.ok(s.fighters[0].hp<4500,'真实反弹已经跨半体，但不能重新判低体');assert.equal(s.fighters[0].soulState.telosLowHit,false);}
 }
});
test('4401两真实版本原多段免红不回血、提前击败只聚合已结算红、1HP保命每段实损零仍按完整红回血',()=>{
 for(const source of H.versions)for(const move of[11904,15247])for(const mode of['immune','overkill','one']){
  const bEffects=mode==='immune'?{攻击伤害免疫:{start:1,end:1}}:mode==='one'?{致命保留:{start:1,end:1,hp:1}}:{}, {state,raw}=H.make(source,move,{hp:1000,enemyHp:mode==='immune'?9000:1,bEffects}),s=H.turn(state,move),red=H.sum(s,'attack'),hits=H.events(s,'attack');
  assert.equal(s.fighters[0].pp['wiki:'+move],raw.pp-1);assert.equal(s.fighters[0].hp,Math.min(s.fighters[0].stats.maxHp,1000+red));
  if(mode==='immune'){assert.equal(red,0);assert.equal(H.sum(s,'percent'),0);assert.equal(s.fighters[0].hp,1000);}
  if(mode==='overkill'){assert.equal(hits.length,1);assert.equal(hits[0].hpLoss,1);assert.ok(red>1);assert.equal(s.fighters[1].hp,0);}
  if(mode==='one'){assert.ok(hits.length>=4);assert.ok(hits.every(x=>x.hpLoss===0&&x.settledDamage>0));assert.equal(H.sum(s,'percent'),red);assert.equal(H.events(s,'percent').length,1);assert.equal(s.fighters[1].hp,1);}
 }
});
test('4401真实两版本原多段粉免不减完整红回血、全禁疗只阻回复而技能禁疗不阻魂印，原魂其余条款不剥离',()=>{
 for(const source of H.versions)for(const move of[11904,15247])for(const mode of['pink','all-heal-ban','skill-heal-ban']){
  const options={hp:1000,aEffects:mode==='all-heal-ban'?{四杀鬼囹:{start:1,end:1}}:mode==='skill-heal-ban'?{无法通过自身技能恢复体力:{start:1,end:1}}:{},bEffects:mode==='pink'?{固定百分比免疫:{start:1,end:1}}:{}}, {state,raw}=H.make(source,move,options),s=H.turn(state,move),red=H.sum(s,'attack');
  assert.ok(red>0);assert.equal(s.fighters[0].pp['wiki:'+move],raw.pp-1);assert.equal(s.fighters[0].hp,mode==='all-heal-ban'?1000:Math.min(s.fighters[0].stats.maxHp,1000+red));assert.equal(H.sum(s,'percent'),mode==='pink'?0:red);assert.equal(s.fighters[0].soulState.telosFirstHitHp,1000);
 }
});
