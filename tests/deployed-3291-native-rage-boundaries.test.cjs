'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3291-native.cjs');
const triggered=s=>s.turns[0].events.some(e=>e.text.includes('星皇之怒判定')&&e.text.includes('：触发'));
const rage=s=>s.turns[0].events.filter(e=>e.kind==='damage'&&e.text.includes('（星皇之怒）'));

test('3291原皇怒不响应非必中暴击无效，普通攻击仍遵守该防御；额外攻击保留原暴击倍率',()=>{
 let seen=0;
 for(let seed=1;seed<=12;seed++)for(const mode of ['rage','ordinary']){
  const s=H.turn(H.make(10499,{seed,criticals:true,aEffects:{必定暴击:{start:1,end:1},...(mode==='rage'?{skillBlock:{start:1,end:1}}:{})},bEffects:{非必中暴击无效:{start:1,end:1}}}),10499);
  if(mode==='rage'&&triggered(s)){seen++;assert.equal(rage(s).length,1,'皇怒不能被普通暴击无效响应');assert.ok(H.damage(s,'attack')>0);assert.match(rage(s)[0].detail,/暴击 2/);}
  if(mode==='ordinary')assert.equal(s.turns[0].events.filter(e=>e.kind==='damage'&&!e.text.includes('星皇之怒')).length,0);
 }
 assert.ok(seen>0);
});

test('3291原皇怒拥有原玄震命斩低三分一威力提升，严格边界与星赐动作后回复不改判定',()=>{
 let seen=0;
 for(let seed=1;seed<=8;seed++){
  const run=hp=>H.turn(H.make(30378,{seed,aHp:hp,aStats:{atk:1800},bStats:{def:400},aEffects:{skillBlock:{start:1,end:1}}}),30378),low=run(2999),edge=run(3000);
  assert.equal(triggered(low),triggered(edge));
  if(triggered(low)){seen++;assert.match(rage(low)[0].detail,/威力 195 ·/);assert.match(rage(edge)[0].detail,/威力 65 ·/);assert.ok(H.damage(low,'attack')>H.damage(edge,'attack')*2.7);}
  assert.equal(low.fighters[0].hp,4124);assert.equal(edge.fighters[0].hp,4125);
 }
 assert.ok(seen>0);
});

test('3291原皇怒击败原3311魂638阻止复活，普通红伤击败仍触发真实原版复活',()=>{
 let seen=0;
 for(let seed=1;seed<=8;seed++)for(const mode of ['rage','ordinary']){
  const s=H.turn(H.make(10499,{seed,enemyId:3311,bHp:1,aStages:{acc:6},aEffects:mode==='rage'?{skillBlock:{start:1,end:1}}:{}}),10499);
  assert.equal(s.fighters[1].soulId,638);assert.equal(s.fighters[1].soulHash,'53bf6afd');
  if(mode==='rage'&&triggered(s)){seen++;assert.equal(s.fighters[1].hp,0);assert.equal(s.fighters[1].soulState.holyReborn,undefined);assert.equal(s.fighters[1].soulState.deathResolved,true);}
  if(mode==='ordinary'){assert.equal(s.fighters[1].hp,9000);assert.equal(s.fighters[1].soulState.holyReborn,true);}
 }
 assert.ok(seen>0);
});
