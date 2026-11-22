'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3291-native.cjs');
const rage=s=>s.turns[0].events.some(e=>e.text.startsWith('A 方 星皇之怒判定')&&e.text.includes('：触发'));

test('3291原1094皇怒后续三分一百分比附伤按无强化条件执行，按用户确认无视原魂622百分比免疫',()=>{
 for(const mode of ['unboosted','protected-boost','native-percent-immune']){let s;
  for(let seed=1;seed<=16;seed++){const out=H.turn(H.make(30376,{seed,aStages:{acc:6},enemyId:mode==='native-percent-immune'?3291:2989,bStages:mode==='protected-boost'?{atk:2}:{},bEffects:mode==='protected-boost'?{protect:{start:1,end:1},强化保护:{start:1,end:1}}:{}}),30376);if(rage(out)){s=out;break;}}
  assert.ok(s);assert.equal(H.damage(s,'percent'),mode==='protected-boost'?0:3000,mode);
  if(mode==='protected-boost')assert.equal(s.fighters[1].stages.atk,2);
  if(mode==='native-percent-immune'){assert.equal(s.fighters[1].soulId,622);assert.equal(s.fighters[1].soulHash,'2f1e3f2');}
 }
});

test('3291原1098真实暴击且皇怒授予的攻击先制两次，状态技能保留，MISS及整招无效攻击消费，完整威力储备独立',()=>{
 let s;for(let seed=1;seed<=32;seed++){const out=H.turn(H.make(30381,{seed,criticals:true,extraMoves:[20530,10499]}),30381);if(out.fighters[0].counts.rageFull===2&&out.fighters[0].counts.attackPriority===2){s=out;break;}}
 assert.ok(s);assert.equal(s.fighters[0].fifthUses,1);
 s=H.turn(s,20530);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);assert.equal(s.fighters[0].counts.attackPriority,2);assert.equal(s.fighters[0].counts.rageFull,1);
 s.fighters[0].effects.攻击必失={start:3,end:3};s=H.turn(s,10499);assert.equal(H.damage(s,'attack'),0);assert.equal(s.fighters[0].soulState.resolvedPriority.value,2);assert.equal(s.fighters[0].counts.attackPriority,1);assert.equal(s.fighters[0].counts.rageFull,0);
 s.fighters[0].effects.skillBlock={start:4,end:4};s=H.turn(s,10499);assert.equal(s.fighters[0].soulState.resolvedPriority.value,2);assert.equal(s.fighters[0].counts.attackPriority,0);assert.equal(s.fighters[0].fifthUses,1);
});

test('3291原1097皇怒失明按用户确认无视次数免异且不消费，只有概率失败才封属',()=>{
 const seen=new Set();for(let seed=1;seed<=24;seed++){
  const s=H.turn(H.make(30380,{seed,bCounts:{immune:2}}),30380);if(!rage(s))continue;
  const blind=!!s.fighters[1].ailments.失明;seen.add(blind);assert.equal(!!s.fighters[1].effects.statusBlock,!blind);
  assert.equal(s.fighters[1].counts.immune,1,'本体疲惫正常消耗一次，皇怒不消费另一次');
 }assert.deepEqual(seen,new Set([true,false]));
});
