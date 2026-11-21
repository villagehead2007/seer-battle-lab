'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3291-native.cjs');
function cycleGrant(enemyId=2989,enemyMoves=[10086]){for(let seed=1;seed<=12;seed++){const s=H.turn(H.make(25295,{seed,extraMoves:[10499],enemyId,enemyMoves,aStats:{def:400},bStats:{atk:1800}}),25295);if(s.fighters[0].counts.halfDamage===2){assert.equal(s.fighters[0].effects.doubleDamage.start,2);assert.equal(s.fighters[0].effects.doubleDamage.end,3);return s;}}assert.fail('No actual cycle rage grant found');}

test('3291原1094实际成功消强授予的皇怒加20概率仅下两回合，本次50随后70/70再50',()=>{
 let s=H.turn(H.make(30376,{extraMoves:[10499],aStages:{acc:6},bStages:{atk:2},bEffects:{免弱:{start:1,end:4}}}),30376);
 assert.equal(s.fighters[1].stages.atk,0);assert.equal(s.fighters[0].effects.rageBonus.start,2);assert.equal(s.fighters[0].effects.rageBonus.end,3);
 assert.match(s.turns.at(-1).events.find(e=>e.text.includes('星皇之怒判定')).text,/判定 50%/);
 s.fighters[0].effects.skillBlock={start:2,end:4};
 for(const [round,percent]of [[2,70],[3,70],[4,50]]){s.fighters[1].hp=9000;s=H.turn(s,10499);const roll=s.turns.at(-1).events.filter(e=>e.text.includes('星皇之怒判定'));assert.equal(s.round,round+1);assert.equal(roll.length,1);assert.match(roll[0].text,new RegExp('判定 '+percent+'%'));}
});

test('3291原1095实际皇怒保护先手当前两回合、后手当前加下两回合，所有技能先制仅下两回合',()=>{
 for(const late of [false,true]){let s;
  for(let seed=1;seed<=12;seed++){const out=H.turn(H.make(25294,{seed,extraMoves:[20530],enemyMoves:[10086],aStats:{spe:late?1:9999}}),25294,10086);if(out.fighters[0].effects.protect){s=out;break;}}
  assert.ok(s);const f=s.fighters[0];assert.equal(f.effects.protect.start,1);assert.equal(f.effects.protect.end,late?3:2);assert.equal(f.effects.priority.start,2);assert.equal(f.effects.priority.end,3);
  for(let round=2;round<=4;round++){s=H.turn(s,20530,'potion:pp');assert.equal(s.fighters[0].soulState.resolvedPriority.value,round<=3?2:0,'late'+late+'/round'+round);}
 }
});

test('3291原1096实际两次受击减伤在免疫零红/限伤零红/MISS/无效/药剂均保留，不写虚假消费日志',()=>{
 for(const mode of ['immune','zero-cap','miss','invalid','item']){let s=cycleGrant();
  if(mode==='immune')s.fighters[0].effects.攻击伤害免疫={start:2,end:2};
  if(mode==='zero-cap')s.fighters[0].effects.伤害上限={start:2,end:2,amount:0};
  if(mode==='miss')s.fighters[1].effects.攻击必失={start:2,end:2};
  if(mode==='invalid')s.fighters[1].effects.skillBlock={start:2,end:2};
  s=H.turn(s,'potion:pp',mode==='item'?'potion:pp':10086);
  assert.equal(H.damage(s,'attack',1),0,mode);assert.equal(s.fighters[0].counts.halfDamage,2,mode);
  assert.equal(s.turns.at(-1).events.some(e=>e.text.includes('消耗一次受击减伤')),false,mode);
 }
});

test('3291原1096正结算红伤每次减半并消费一次，耗尽第三次红伤恢复且不重复消费',()=>{
 let s=cycleGrant(),first;
 for(let i=0;i<3;i++){s=H.turn(s,'potion:pp',10086);const red=H.damage(s,'attack',1);assert.ok(red>0);assert.equal(s.fighters[0].counts.halfDamage,Math.max(0,1-i));assert.equal(s.turns.at(-1).events.filter(e=>e.text.includes('消耗一次受击减伤')).length,Number(i<2));if(i===0)first=red;if(i===2)assert.ok(red>first*1.6,'第三次不再减半');}
});

test('3291原1096按正结算红伤消费，原仅1HP保命实际损血零仍消费且完整红伤不截断',()=>{
 let s=cycleGrant();s.fighters[0].hp=1;s.fighters[0].effects.致命保留={start:2,end:2,hp:1};s.fighters[0].effects.四杀鬼囹={start:2,end:2};
 s=H.turn(s,'potion:pp',10086);const hit=s.damageEvents.find(e=>e.round===2&&e.sourceSide===1&&e.type==='attack');
 assert.ok(hit.settledDamage>0);assert.equal(hit.hpLoss,0);assert.equal(s.fighters[0].hp,1);assert.equal(s.fighters[0].counts.halfDamage,1);
});

test('3291原1096受击减伤不削减或消费原3242真实反馈，技能回复与星赐仍独立',()=>{
 let s=cycleGrant(3242,[25183]);s=H.turn(s,'potion:pp',25183);assert.equal(s.fighters[0].counts.halfDamage,2);
 s=H.turn(s,10499);assert.ok(H.damage(s,'true',1)>0);assert.equal(s.fighters[0].counts.halfDamage,2);
});
