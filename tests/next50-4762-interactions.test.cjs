'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4762-battle.cjs'),{E,key,make,turn,timer,sum}=H;
function observed(s,fn,a=s.auditMoveId,b=20288){const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);fn(event,c);}};try{return turn(s,a,b);}finally{E.SOULS=old;}}
test('4762真实1973十层线性30%严格边界且普通定额盾上限免疫均有效，同次组件重复评估只抽一次不冒充多段',()=>{
 for(const mode of ['flat','shield','cap','immune','edge']){
  const s=make({soul:true,move:10001,index:-1});s.fighters[0].soulState.magicCurse1973=10;let rolls=0;
  if(mode==='flat')timer(s,1,'伤害定额减免',{amount:4500});
  if(mode==='shield')s.fighters[1].suitState.shield=20000;
  if(mode==='cap')timer(s,1,'伤害上限',{amount:200,attackOnly:true});
  if(mode==='immune')timer(s,1,'攻击伤害免疫');
  observed(s,(event,c)=>{if(event==='beforeDamage'&&c.a.side===0){c.random=()=>{rolls++;return mode==='edge'?.3:.299999;};E.SOULS.registry[1972].abilities.curseOutgoing(c);E.SOULS.registry[1972].abilities.curseOutgoing(c);}});
  assert.equal(rolls,1);
  if(mode==='flat'){assert.equal(sum(s),4500);assert.equal(s.fighters[1].hp,4500);}
  if(mode==='shield'){assert.equal(sum(s),0);assert.equal(s.fighters[1].hp,9000);assert.equal(s.fighters[1].suitState.shield,11000);}
  if(mode==='cap'){assert.equal(sum(s),200);assert.equal(s.fighters[1].hp,8800);}
  if(mode==='immune'){assert.equal(sum(s),0);assert.equal(s.fighters[1].hp,9000);}
  if(mode==='edge'){assert.ok(sum(s)>0&&sum(s)<9000);assert.equal(s.fighters[1].hp,9000-sum(s));}
 }
});
test('4762原生584授予三轮当前起算，第二第三轮真实攻击仍15%秒杀而第四轮到期；真实1973当前目标替换保证可连续观测',()=>{
 const m=H.source.moves.find(m=>m.id===29047),index=m.effectInstances.findIndex(x=>x.id===584),s=make({soul:true,move:m.id,index});
 turn(s);assert.equal(s.fighters[0].effects['攻击附加秒杀概率'].start,1);assert.equal(s.fighters[0].effects['攻击附加秒杀概率'].end,3);assert.equal(s.fighters[0].effects['攻击附加秒杀概率'].chance,15);
 // The helper has a verified1973 source profile for both fighters but disables the opposing soul.
 // Restore that actual selected soul, not a fabricated generic instant identity; reset HP is an explicit per-round fixture.
 s.fighters[1].soulId=1973;
 for(const r of [2,3,4]){
  s.fighters[1].hp=8000;s.rng=0;turn(s,10001,20288);
  assert.equal(s.fighters[1].soulState.magicCurse1973,r<=3?r-1:2);
  assert.equal((s.instantReplacement1973??[]).length,r<=3?r-1:2);
  assert.ok(s.fighters.every(f=>f.hp>0));
 }
 assert.equal(s.fighters[0].effects['攻击附加秒杀概率'],undefined);
});
test('4762完整29047的803按真实4752双鳍连打10802两段整次红伤合计限200而非各段200，不剥离任何实例',()=>{
 const a=structuredClone(H.source),rawB=require('../research/BATCH-4676-NEXT50/4752/snapshot.json'),b=structuredClone(rawB);a.selectedSoulId=1973;b.souls=[];
 const aIds=[29047,10001,20288,29048,37914],fifth=b.moves.find(m=>m.fifth).id,bIds=[10802,...b.moves.filter(m=>!m.fifth&&m.id!==10802).slice(0,3).map(m=>m.id),fifth];
 assert.equal(rawB.moves.find(m=>m.id===10802).hash,'54c21cf9');assert.deepEqual(rawB.moves.find(m=>m.id===10802).effectInstances.map(x=>[x.id,x.args]),[[31,[2,2]]]);
 for(const capped of [false,true]){
  const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500},s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[aIds,bIds],criticals:false,builds:[{overrides:stats},{overrides:{...stats,atk:9999,spe:100}}]});
  for(const [snap,ids]of [[a,aIds],[b,bIds]])for(const id of ids){const m=snap.moves.find(m=>m.id===id),compiled=E.WIKI.effectsEngine.compileInstances(m.effectInstances,snap.effects,m);assert.equal(compiled.issue,'');assert.deepEqual(s.moveDefinitions[key(id)].operations.map(o=>[o.effectId,o.index,o.phase,o.params]),compiled.operations.map(o=>[o.effectId,o.index,o.phase,o.params]));}
  s.fighters[1].counts.immune=1;if(!capped)timer(s,0,'技能命中效果失效');
  Object.assign(s,E.resolveTurn(s,[key(29047),key(10802)]));
  const events=(s.damageEvents??[]).filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0&&e.type==='attack');assert.equal(events.length,2);
  if(capped){assert.deepEqual(events.map(e=>e.settledDamage),[200,0]);assert.equal(s.fighters[0].hp,8800);assert.equal(s.fighters[0].effects['伤害上限'].wholeAttackRedCap,true);assert.equal(s.fighters[1].counts.immune,0);}
  else{assert.ok(events.every(e=>e.settledDamage>200));assert.equal(s.fighters[0].hp,9000-events.reduce((n,e)=>n+e.hpLoss,0));assert.equal(s.fighters[0].effects['伤害上限'],undefined);}
 }
});
