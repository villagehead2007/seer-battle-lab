'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn,pick,timer,op,key}=require('./helpers/4135-battle.cjs');
test('4135两魂印跨半血按回复前判断，恰半血不授予下一回合减伤',()=>{
 for(const soul of [1362,1787]){
  const s=make({moveId:10499,index:null},{omit:true,soul,hp:4550});s.fighters[1].stats.atk=1000;const o=turn(s,10499,910040);assert.ok(o.fighters[0].hp>4500);assert.equal(o.fighters[0].effects['克丽娅次回合减攻伤'].start,2);
  const exact=turn(make({moveId:10499,index:null},{omit:true,soul,hp:4500}));assert.equal(exact.fighters[0].effects['克丽娅次回合减攻伤'],undefined);
 }
});
test('4135两魂印攻击、异常、反弹、自损死亡均立即判定，成功满HP/PP且保留原状态',()=>{
 for(const soul of [1362,1787])for(const cause of ['attack','dot','reflect','self']){
  let success=false,fail=false;
  for(let seed=0;seed<40&&!(success&&fail);seed++){
   const s=make({moveId:10499,index:null},{omit:true,soul,hp:1,seed});for(const k of s.fighters[0].moves)s.fighters[0].pp[k]=2;s.fighters[0].stages.def=2;timer(s,0,'保留的回合状态');
   let other=910041,move=10499;
   if(cause==='attack')other=910040;
   if(cause==='dot'){s.fighters[0].ailments['中毒']=3;move=910031;}
   if(cause==='reflect')timer(s,1,'受击定额反弹',{amount:100});
   if(cause==='self')op(s,753,[3],10499);
   const o=turn(s,move,other),f=o.fighters[0];assert.equal(f.soulState.cleriaRebirthAttempted,true);assert.equal(f.stages.def,2);assert.ok(f.effects['保留的回合状态']);
   if(f.hp>0){success=true;assert.equal(f.hp,9000);for(const k of f.moves)assert.equal(f.pp[k],o.moveDefinitions[k].pp);assert.equal(f.effects['克丽娅重生减攻伤'].end,3);if(cause==='dot')assert.equal(f.ailments['中毒'],3);}
   else {fail=true;assert.equal(o.finished,true);}
  }
  assert.ok(success&&fail,soul+':'+cause);
 }
});
test('4135重生成功后再遭致死只死不重抽，三回合减伤从当前回合生效',()=>{
 let witnessed=false;
 for(let seed=0;seed<40&&!witnessed;seed++){
  const s=make({moveId:10499,index:null},{omit:true,soul:1362,hp:1,seed});op(s,31,[3,3],910040);s.moveDefinitions[key(910040)].power=9999;s.fighters[1].stats.atk=9999;
  const o=turn(s,910031,910040),f=o.fighters[0],events=o.damageEvents.filter(e=>e.targetSide===0&&e.type==='attack');
  if(events.length>1){witnessed=true;assert.equal(f.hp,0);assert.equal(f.soulState.cleriaRebirthAttempted,true);assert.equal(events.length,2);assert.ok(events[1].settledDamage<events[0].settledDamage);}
 }
 assert.equal(witnessed,true);
});
test('4135 634攻击前严格高于才按实际攻击HP损失回复，攻击后跨越不触发',()=>{
 for(const higher of [false,true]){
  const s=make(pick(634)[0],{hp:1000,targetHp:higher?999:1010,aStats:{spa:1000}}),o=turn(s),loss=o.damageEvents.find(e=>e.type==='attack').hpLoss;
  assert.ok(o.fighters[1].hp<1000);assert.equal(o.fighters[0].hp,1000+(higher?loss:0));
 }
});
test('4135 1235每回合只抽一次，多段只补偿一次且必中视为失败，三旧实例共享规则',()=>{
 for(const [chance,count]of [[80,1],[70,1],[80,2]])for(const always of [false,true]){
  let dodge=false,failed=false;
  for(let seed=0;seed<45;seed++){
   const s=make(pick(1235)[0],{seed});s.moveDefinitions[key(s.auditMoveId)].operations[0].params=[3,chance,count];op(s,31,[3,3],910040);s.moveDefinitions[key(910040)].alwaysHit=always;
   const o=turn(s,undefined,910040),effect=o.fighters[0].effects['概率闪避失败清PP'],n=Object.values(o.fighters[1].pp).filter(v=>v===0).length;
   assert.equal(effect.rollRound,1);if(effect.failureRound===1){failed=true;assert.equal(n,count);assert.equal(o.damageEvents.filter(e=>e.type==='attack').length,3);}else{dodge=true;assert.equal(n,0);assert.equal(o.damageEvents?.filter(e=>e.type==='attack').length??0,0);}
   if(always)assert.equal(effect.failureRound,1);
  }
  assert.equal(failed,true);if(!always)assert.equal(dodge,true);
 }
});
test('4135伙伴920仅次回合攻击增伤，固定/百分比及1785理论回复保持原基数',()=>{
 let s=turn(make(pick(920)[0]));const normal=structuredClone(s);delete normal.fighters[0].effects.id913;
 const boosted=turn(s,910030),plain=turn(normal,910030);assert.ok(boosted.damageEvents.at(-1).settledDamage>plain.damageEvents.at(-1).settledDamage);
 s=turn(make(pick(920)[0],{hp:1000}));op(s,29,[300],910030);const o=turn(s,910030);assert.equal(o.damageEvents.filter(e=>e.round===2&&e.type==='fixed')[0].settledDamage,300);
 s=turn(make(pick(1785)[0],{hp:1000}));timer(s,0,'id913',{bonus:1});const drain=turn(s,910031);assert.equal(drain.damageEvents.filter(e=>e.round===2&&e.type==='percent')[0].settledDamage,3000);assert.equal(drain.fighters[0].hp,7000);
});
test('4135原版/强化各配普通与伙伴第五四组合真实加载、配招和完整效果执行',()=>{
 const answered=structuredClone(source);for(const m of answered.moves)if([34630,27363,36521].includes(m.id))m.limitations=[];
 const versions=E.WIKI.versionSnapshots(answered);assert.equal(versions.length,4);
 for(const v of versions){const fifth=E.WIKI.availableMoves(v).find(m=>m.fifth),load=[10499,34630,27363,27364,fifth.id];const s=E.createBattle({wikiSnapshots:[v,v],wikiLoadouts:[load,load],criticals:false});assert.equal(s.fighters[0].soulId,v.selectedSoulId);const o=E.resolveTurn(s,[key(fifth.id),key(10499)]);assert.equal(o.fighters[0].pp[key(fifth.id)],fifth.id===34633?fifth.pp:fifth.pp-1);assert.ok(o.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0));}
});

test('4135 1235失败清PP尊重PP保护，免疫不重复补偿',()=>{const s=make(pick(1235)[0]);timer(s,1,'PP保护');s.moveDefinitions[key(910040)].alwaysHit=true;const o=turn(s,undefined,910040);assert.equal(o.fighters[0].effects['概率闪避失败清PP'].failureRound,1);assert.equal(Object.values(o.fighters[1].pp).filter(v=>v===0).length,0);assert.equal(o.fighters[1].pp[key(910040)],98);});

test('4135真实18技能保留全部原生效果顺序执行，PP恢复条款与基础扣除同时生效',()=>{
 for(const move of source.moves){const s=make({moveId:move.id,index:null},{hp:1000}),o=turn(s);assert.equal(o.fighters[0].pp[key(move.id)],[34630,34633].includes(move.id)?move.pp:move.pp-1);assert.ok(o.turns.at(-1).events.some(e=>e.kind==='move'&&e.text.includes(move.name)));assert.ok(o.fighters[0].hp>=1000);if(move.kind!=='status')assert.ok(o.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0));}
});
