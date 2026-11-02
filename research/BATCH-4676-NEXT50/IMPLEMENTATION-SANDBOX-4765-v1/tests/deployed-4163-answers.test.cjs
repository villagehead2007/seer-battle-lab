'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn,pick,timer,op,key,keys}=require('./helpers/4163-battle.cjs');
const current=(s,type)=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.targetSide===1&&e.type===type);
test('4163 1690盾值70%为百分比且理论回复，低HP过量与伤害免疫不降低回复基数',()=>{
 for(const targetHp of [200,9000])for(const immune of [false,true])for(const healBan of [false,true]){
  const s=make({moveId:10223,index:null},{soul:1690,omit:true,hp:1000,targetHp});s.fighters[0].suitState.shield=1000;if(immune)timer(s,1,'固定百分比免疫');if(healBan)timer(s,0,'回复效果削减',{fraction:1});
  const o=turn(s);assert.equal(o.fighters[0].hp,healBan?1000:1700);assert.equal(current(o,'percent').reduce((n,e)=>n+e.settledDamage,0),immune?0:700);assert.equal(o.fighters[0].soulState.petefieldShieldDrainPending,undefined);
  if(targetHp===200&&!immune){assert.equal(o.fighters[1].hp,0);assert.equal(current(o,'fixed').length,0);assert.equal(o.fighters[0].stages.atk,0);assert.ok(current(o,'percent')[0].hpLoss<200);}
 }
});
test('4163 1690吸取不消费自身盾，理论回复不被输出翻倍扩大且回复倍率独立',()=>{
 const s=make({moveId:10223,index:null},{soul:1690,omit:true,hp:1000});s.fighters[0].suitState.shield=1000;timer(s,0,'全伤害翻倍');timer(s,0,'回复效果削减',{fraction:.5});const o=turn(s);assert.equal(o.fighters[0].suitState.shield,1000);assert.equal(o.fighters[0].hp,1350);assert.equal(current(o,'percent')[0].settledDamage,1400);
});
test('4163 1690先吸取，再石化或失败全强，再按届时全部正强化段数附固定伤害',()=>{
 let yes=false,no=false;
 for(let seed=0;seed<35;seed++){
  const s=make({moveId:10223,index:null},{soul:1690,omit:true,hp:1000,seed});s.fighters[0].suitState.shield=400;
  const o=turn(s),attack=o.damageEvents.findIndex(e=>e.type==='attack'),drain=o.damageEvents.findIndex(e=>e.type==='percent'),fixed=o.damageEvents.findIndex(e=>e.type==='fixed');assert.ok(attack<drain&&drain<fixed);assert.equal(o.fighters[0].hp,1280);
  if(o.fighters[1].ailments['石化']){yes=true;assert.equal(current(o,'fixed')[0].settledDamage,60);assert.equal(o.fighters[0].stages.atk,0);}else{no=true;assert.equal(current(o,'fixed')[0].settledDamage,240);assert.equal(o.fighters[0].stages.atk,1);assert.equal(o.fighters[0].stages.def,2);}
 }
 assert.ok(yes&&no);
});
test('4163 1690石化免疫才失败全强，寒月不压70%概率，护罩及纯属性不吸取',()=>{
 for(const mode of ['immune','moon','barrier','status']){
  const s=make({moveId:10223,index:null},{soul:1690,omit:true,hp:1000});if(mode==='barrier')s.fighters[0].suitState.barrier=1000;else s.fighters[0].suitState.shield=1000;
  if(mode==='immune')timer(s,1,'免异常');if(mode==='moon')s.celestials=[{name:'寒月',side:0,start:1,end:99}];const o=turn(s,mode==='status'?930031:10223);
  if(mode==='immune'){assert.equal(o.fighters[1].ailments['石化'],undefined);assert.equal(o.fighters[0].stages.atk,1);assert.equal(o.fighters[0].hp,1700);assert.equal(current(o,'fixed')[0].settledDamage,240);}else if(mode==='moon'){assert.ok(o.fighters[1].ailments['石化']);assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[0].hp,1700);assert.equal(current(o,'fixed')[0].settledDamage,60);}else{assert.equal(o.fighters[0].hp,1000);assert.equal(current(o,'percent').length,0);}
 }
});
test('4163 Q038仅两魂印强化反转触发石化，失败清敌回合及盾，强化保护阻止反转则不触发',()=>{
 for(const soul of [1389,1690])for(const mode of ['apply','immune','protected']){
  const s=make({moveId:10223,index:null},{soul,omit:true});s.fighters[0].stages.atk=2;op(s,143,[]);timer(s,1,'测试回合');if(mode==='immune')timer(s,1,'免异常');if(mode==='protected')timer(s,0,'强化保护');
  const o=turn(s,undefined,930042);assert.equal(o.fighters[0].stages.atk,mode==='protected'?2:-2);assert.equal(!!o.fighters[1].ailments['石化'],mode==='apply');assert.equal(o.fighters[0].suitState.shield,mode==='immune'?3000:0);assert.equal(o.fighters[1].effects['测试回合']===undefined,mode==='immune');
 }
});
test('4163公共1617沿用正完整伤害每回合一次，四回合真实载体到期停止反制',()=>{
 let s=make(pick(1617)[0]);timer(s,1,'免异常');op(s,31,[2,2],930040);s=turn(s,undefined,930040);assert.equal(s.fighters[0].stages.atk,1);s=turn(s,930031,930040);assert.equal(s.fighters[0].stages.atk,2);s=turn(s,930031,930040);assert.equal(s.fighters[0].stages.atk,3);s=turn(s,930031,930040);assert.equal(s.fighters[0].stages.atk,4);s=turn(s,930031,930040);assert.equal(s.fighters[0].stages.atk,4);
});
test('4163全部17技能原生完整链及两个真实魂印版本配招加载和效果执行',()=>{
 for(const move of source.moves){const s=make({moveId:move.id,index:null},{hp:1000}),o=turn(s);assert.equal(o.fighters[0].pp[key(move.id)],move.pp-1);assert.ok(o.turns.at(-1).events.some(e=>e.kind==='move'&&e.text.includes(move.name)));if(move.kind!=='status')assert.ok(o.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0));}
 for(const soul of [1389,1690]){const a=structuredClone(source);a.selectedSoulId=soul;for(const m of a.moves)if(m.id===27437)m.limitations=[];const load=[10223,27436,27437,27438,34779],s=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[load,load],criticals:false});assert.equal(s.fighters[0].soulId,soul);const o=E.resolveTurn(s,[key(27436),key(10223)]);assert.equal(o.fighters[0].suitState.shield,200);assert.equal(o.fighters[0].stages.def,soul===1690?3:2);assert.equal(o.fighters[0].stages.spd,soul===1690?3:2);}
});

test('4163 1690理论回复反噬死亡后立即停止，不继续石化或固定附伤',()=>{
 const s=make({moveId:10223,index:null},{soul:1690,omit:true,hp:1});s.fighters[0].suitState.shield=10;s.fighters[0].soulState.soulGu=[{sourceSide:1,usedRound:0}];
 const o=turn(s);assert.equal(o.fighters[0].hp,0);assert.equal(o.fighters[1].ailments['石化'],undefined);assert.equal(current(o,'fixed').length,0);assert.equal(o.fighters[1].hp,9000);assert.equal(current(o,'percent')[0].settledDamage,7);const feedback=o.damageEvents.find(e=>e.targetSide===0&&e.type==='true');assert.equal(feedback.settledDamage,40);assert.equal(feedback.hpLoss,8);
});

test('4163 1389固定附伤被真实反弹致死后停止石化及失败全强',()=>{
 for(let seed=0;seed<12;seed++){
  const s=make({moveId:10223,index:null},{soul:1389,omit:true,hp:1,seed});s.fighters[0].suitState.shield=10;s.fighters[0].stages.atk=1;timer(s,1,'低伤免疫返还',{threshold:1000});const o=turn(s);
  assert.equal(o.fighters[0].hp,0);assert.equal(o.fighters[1].ailments['石化'],undefined);assert.equal(o.fighters[0].stages.atk,1);assert.ok(o.damageEvents.some(e=>e.type==='fixed'&&e.targetSide===0&&e.hpLoss===1));
 }
});
