'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/remaining-4946.cjs'),{E,make,turn,timer,key,sum}=H,store=require('../local-species.cjs');
function battle(pet,soul,extra={}){const source=store.species(pet),enemy=E.WIKI.versionSnapshots(source).find(x=>x.selectedSoulId===soul)??source,moves=E.WIKI.availableMoves(enemy),ids=moves.filter(m=>!m.fifth).slice(0,4).map(m=>m.id),s=make({move:38536,index:-1,soul:true,loadout:[10006,38536,29455,29456,38538],enemySource:enemy,enemySoul:true,enemyLoadout:[...ids,moves.find(m=>m.fifth).id],aStats:{atk:3961},bStats:{maxHp:1000,def:300},seed:Math.imul(19,0x9e3779b1)>>>0,...extra});s.fighters[0].type=s.fighters[1].type='普通';assert.equal(s.fighters[1].soulId,soul);return {s,action:ids.find(id=>moves.find(m=>m.id===id).kind==='status')};}
test('4946已答后续生命结算层比例同受总30%上限，实际旧新柯尔霍德与旧新柯尔德保留魂印版本且只消费一次PP',()=>{for(const [pet,soul]of [[3432,748],[3432,2150],[3886,1155],[3886,1971]]){const {s,action}=battle(pet,soul),pp=s.fighters[0].pp[key(38536)];turn(s,38536,action);assert.equal(sum(s),700,soul);assert.equal(s.fighters[0].pp[key(38536)],pp-1);assert.equal(s.damageEvents.filter(e=>e.sourceSide===0&&e.type==='attack').length,1);assert.equal(s.reductionPlans2146.length,1);assert.ok(s.reductionPlans2146[0].iterations>=2&&s.reductionPlans2146[0].iterations<=64);if(soul===2150){assert.equal(s.fighters[1].soulState.mirrorProgress,300);assert.equal(s.fighters[1].soulState.mirrors??0,0);}}});
test('4946后续比例保留阈值成败与原定额200上限，已免伤归零不授镜，前盾后减伤次序不移动',()=>{for(const mode of ['below','threshold','shield','cap200','immune']){const soul=mode==='cap200'?1155:mode==='immune'?2150:748,{s,action}=battle(soul===1155?3886:3432,soul,{bStats:{maxHp:2000,def:300},targetHp:mode==='below'?2000:mode==='threshold'?2000:1000});if(mode==='shield')s.fighters[1].suitState.shield=200;if(mode==='cap200')s.fighters[1].soulState.coldNextCap=true;if(mode==='immune')timer(s,1,'攻击伤害免疫');turn(s,38536,action);if(mode==='below'||mode==='threshold')assert.equal(sum(s),1000);if(mode==='shield')assert.equal(sum(s),560);if(mode==='cap200'){assert.equal(sum(s),200);assert.equal(s.fighters[1].soulState.coldNextCap,undefined);}if(mode==='immune'){assert.equal(sum(s),0);assert.equal(s.fighters[1].soulState.mirrorProgress??0,0);}}});
test('4946后续比例与前序50%合计限30%，镜子按实际减少量累计且试算不重复授予，真实穿减仍在总上限之后',()=>{for(const pierce of [false,true]){const {s,action}=battle(3432,2150);timer(s,1,'额外攻击减伤',{fraction:.5});if(pierce)timer(s,0,'冰呪');turn(s,38536,action);assert.ok(Math.abs(sum(s)-(pierce?1520:700))<=1);assert.ok(s.fighters[1].soulState.mirrorProgress>0&&s.fighters[1].soulState.mirrorProgress<500);assert.equal(s.fighters[1].soulState.mirrors??0,0);assert.equal(s.damageEvents.filter(e=>e.sourceSide===0&&e.type==='attack').length,1);}});
test('4946非红伤害只计明确适用的减伤，1971无标注60%仅减红伤',()=>{
 for(const mode of ['plain','combined','outside-skill']){
  const {s,action}=battle(3886,1971,{move:29455,index:-1,bStats:{maxHp:9000,def:300}});
  if(mode==='combined')timer(s,1,'全伤害减半');
  let saved;
  const wiki=E.WIKI,engine=wiki.effectsEngine,oldSouls=E.SOULS;
  if(mode==='outside-skill'){
   E.SOULS={...oldSouls,run(event,context){
    oldSouls.run(event,context);
    if(event==='roundStart'&&context.a.side===0){
     context.hurt(context.t,1000,'非技能时点魂印伤害接口','percent');
     saved=context.t.soulState.coldSaved??0;
    }
   }};
  }else{
   E.WIKI={...wiki,effectsEngine:{...engine,run(phase,operations,context){
    const result=engine.run(phase,operations,context);
    if(phase==='afterHit'&&context.a.side===0){
     context.hurt(context.t,1000,'真实技能非红结算接口','percent');
     saved=context.t.soulState.coldSaved;
    }
    return result;
   }}};
  }
  try{turn(s,29455,action);}finally{E.WIKI=wiki;E.SOULS=oldSouls;}
  const expectedDamage=mode==='combined'?700:1000;
  assert.equal(sum(s,'percent'),expectedDamage,mode);
  assert.equal(saved,0,mode);
  const events=s.damageEvents.filter(event=>event.sourceSide===0&&event.type==='percent');
  assert.deepEqual(events.map(event=>event.hpLoss),[expectedDamage],mode);
  const plans=s.reductionPlans2146.filter(entry=>entry.kind==='other');
  assert.equal(plans.length,1,mode);
  assert.deepEqual(plans[0].fractions,mode==='combined'?[.5]:[],mode);
  assert.equal(plans[0].lateFraction,0,mode);
 }
});
module.exports={battle};
test('4946镜子动态百分比跨档需多轮计算时，最终只记一次真实减伤与授镜，PP、随机和伤害事件不重复',()=>{const {s,action}=battle(3432,2150,{aStats:{atk:4072},bStats:{maxHp:9000,def:300}});s.fighters[1].soulState.mirrorProgress=490;timer(s,1,'额外攻击减伤',{fraction:.5});const pp=s.fighters[0].pp[key(38536)];turn(s,38536,action);assert.equal(sum(s),720);assert.equal(s.reductionPlans2146.length,1);assert.equal(s.reductionPlans2146[0].iterations,3);assert.equal(s.fighters[1].soulState.mirrors,1);assert.equal(s.fighters[1].soulState.mirrorProgress,12);assert.equal(s.fighters[0].pp[key(38536)],pp-1);assert.equal(s.damageEvents.filter(e=>e.sourceSide===0&&e.type==='attack').length,1);});
