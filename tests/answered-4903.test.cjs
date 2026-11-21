'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/remaining-4903.cjs'),{E,source,key,make,turn,timer,sum}=H;
function observe(fn,run,before=false){const old=E.SOULS;E.SOULS={...old,run(e,c){if(before)fn(e,c);old.run(e,c);if(!before)fn(e,c);}};try{return run();}finally{E.SOULS=old;}}
test('4903已答表内项数：首次出战高体弱化失败九次重授第一项不因重触第六次停止，真实回血维持高体并清异常，表内六项不授',()=>{
 const s=make({move:24170,soul:true,aStats:{def:1,spd:1},bStats:{atk:9999}});timer(s,1,'免弱');for(let r=1;r<=8;r++){s.fighters[0].ailments['中毒']=s.round+1;if(r===5)Object.assign(s,E.resolveTurn(s,['potion:pp',key(20117)]));else turn(s,24170,10127);const st=s.fighters[0].soulState.emperor4903;assert.equal(st.entries,1);assert.equal(st.entryTriggers,r+1);assert.equal(st.capUntil,r+1);assert.equal(s.fighters[0].ailments['中毒'],undefined);assert.equal(sum(s,'attack',1),r===5?0:2250);assert.ok(s.fighters[0].hp>4500);}let checked=false;observe((e,c)=>{if(e==='beforeUse'&&c.a.side===0){const st=c.a.soulState.emperor4903,until=st.capUntil;st.entries=6;assert.equal(E.SOULS.registry[2090].abilities.entry(c),false);assert.equal(st.capUntil,until);st.entries=1;checked=true;}},()=>turn(s,24170,20117));assert.equal(checked,true);
});
test('4903已答25%整次技能：多段共2250、皇怒无视2090，非红不计额度，属性技能红同次共额，魂印红不误限',()=>{
 const multi=make({move:20155,index:-1,soul:true,aStats:{def:1},bStats:{atk:9999},enemyLoadout:[10713,20117,10127,20309,37911]});turn(multi,20155,10713);assert.equal(sum(multi,'attack',1),2250);assert.ok(multi.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===1).length>=2);
 const emperor=require('../local-species.cjs').species(3291),seen=new Set();
 for(let seed=1;seed<=16;seed++){
  const s=make({move:20155,index:-1,soul:true,aStats:{def:1,spd:1},enemySource:emperor,enemyLoadout:[30376,25294,25295,30380,30381],enemySoul:true,bStats:{atk:9999},seed:Math.imul(seed,0x9e3779b1)>>>0});
  turn(s,20155,30380);
  const hits=s.damageEvents.filter(event=>event.type==='attack'&&event.sourceSide===1);
  const normal=hits.filter(event=>!event.starRage622),rage=hits.filter(event=>event.starRage622);
  assert.deepEqual(normal.map(event=>[event.settledDamage,event.hpLoss]),[[2250,2250]]);
  seen.add(rage.length);
  if(rage.length){
   assert.ok(rage[0].settledDamage>2250);
   assert.equal(rage[0].hpLoss,6750);
   assert.equal(s.fighters[0].hp,0);
  }
  assert.equal(sum(s,'attack',1),2250+(rage[0]?.settledDamage??0));
 }
 assert.deepEqual([...seen].sort(),[0,1]);
 const s=make({move:20155,index:-1,soul:true});observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1){assert.equal(c.hurt(c.t,3000,'独立魂印红','attack'),3000);for(const type of['fixed','percent','true'])assert.equal(c.hurt(c.t,100,'非红不计',type),100);}},()=>turn(s,20155,20117));assert.equal(sum(s,'attack',1),3000);
});
test('4903已答153：两回合战阶按完整红伤一半技能回复，附加固粉真不计，过量不截回复基数，技能禁疗与自然到期真实生效',()=>{
 const ids=[24168,14102,20155,20082,38393];for(const ban of[false,true]){const s=make({move:24168,index:1,loadout:ids,hp:1000});turn(s,24168,20117);assert.equal(s.fighters[0].hp,1000);if(ban)timer(s,0,'技能禁疗');observe((e,c)=>{if(e==='beforeUse'&&c.a.side===0)for(const type of['fixed','percent','true'])c.hurt(c.t,100,'不计入153的非红',type);},()=>turn(s,14102,20117));const red=sum(s);assert.equal(s.fighters[0].hp,1000+(ban?0:Math.floor(red/2)));const event=s.fighters[0].soulState.reply153Events.at(-1);assert.equal(event.red,red);assert.equal(event.restored,ban?0:Math.floor(red/2));s.fighters[0].hp=1000;turn(s,14102,20117);assert.equal(s.fighters[0].hp,1000);}
 const low=make({move:24168,index:1,loadout:ids,hp:1000,aStats:{atk:9999}});turn(low,24168,20117);low.fighters[1].hp=200;turn(low,14102,20117);const hit=low.damageEvents.find(e=>e.round===2&&e.type==='attack'&&e.sourceSide===0);assert.ok(hit.settledDamage>hit.hpLoss);assert.equal(low.fighters[0].hp,1000+Math.floor(hit.settledDamage/2));
});
test('4903已答低体零红：实际MISS/失明/整招无效及命中零红均按敌最大体力理论吸取，未用攻排除，正红不冒触零红',()=>{
 for(const mode of['miss','blind','invalid','immune','immune-percent','control','positive']){const s=make({move:14102,index:-1,soul:true,hp:1000,targetHp:3000,hit:!['miss','blind'].includes(mode),aStats:{atk:1}});if(mode==='miss')timer(s,0,'攻击必失');if(mode==='blind')s.fighters[0].ailments['失明']=2;if(mode==='invalid')timer(s,0,'skillBlock');if(['immune','immune-percent'].includes(mode))timer(s,1,'攻击伤害免疫');if(mode==='immune-percent')timer(s,1,'固定百分比免疫');if(mode==='control')s.fighters[0].ailments['害怕']=2;turn(s,14102,20117);const events=s.fighters[0].soulState.emperor4903.events.filter(e=>e.event==='low-zero-drain');if(['control','positive'].includes(mode)){assert.equal(events.length,0);assert.equal(s.fighters[0].hp,1000);}else{assert.equal(events.length,1);assert.equal(events[0].requested,9000);assert.equal(s.fighters[0].hp,9000);assert.equal(sum(s,'percent'),mode==='immune-percent'?0:9000);}}
});
test('4903已答2476：命中重算第五PP差、合并无放回限定六池且1回合，免疫不补抽，任一失败即时清回合不反算先制',()=>{
 const pool=['烧伤','冻伤','中毒','麻痹','害怕','睡眠'];for(const mode of['normal','count-immune','timed-immune','protected','changed']){const s=make({move:29351,index:1});s.fighters[0].pp[key(38393)]=6;s.fighters[1].pp[key(37911)]=3;if(mode==='count-immune')s.fighters[1].counts.immune=1;if(['timed-immune','protected'].includes(mode))timer(s,1,'免异常');if(mode==='protected')timer(s,1,'protect');let actual;observe((e,c)=>{if(e==='beforeUse'&&c.a.side===0&&mode==='changed')c.t.pp[key(37911)]=5;if(e==='afterHit'&&c.a.side===0){actual=c.a.soulState.draws2476.at(-1);for(const draw of actual.draws)if(draw.applied)assert.equal(c.t.ailments[draw.name],c.round);}},()=>turn(s,29351,20117));assert.equal(s.fighters[0].soulState.resolvedPriority.value,3);assert.equal(actual.count,mode==='changed'?1:3);assert.equal(new Set(actual.draws.map(e=>e.name)).size,actual.count);assert.ok(actual.draws.every(e=>pool.includes(e.name)&&e.duration===1));if(mode==='count-immune')assert.equal(actual.draws.filter(e=>!e.applied).length,1);if(mode==='timed-immune'){assert.equal(actual.draws[0].applied,false);assert.equal(actual.draws[0].cleared,true);assert.ok(actual.draws.slice(1).every(e=>e.applied));}if(mode==='protected')assert.ok(actual.draws.every(e=>!e.applied&&!e.cleared));}
});
test('4903已答2477：所有实际异常剩余回合求和，每回合60固定理论吸取，实际先制严格高于3才翻倍，免伤不取消理论回复',()=>{
 for(const priority of[3,4])for(const immune of[false,true]){const s=make({move:29351,index:2,hp:1000});s.moveDefinitions[key(29351)].priority=priority;s.fighters[1].ailments['中毒']=2;s.fighters[1].ailments['烧伤']=3;if(immune)timer(s,1,'固定百分比免疫');turn(s,29351,20117);const n=5*60*(priority>3?2:1);assert.equal(s.fighters[0].hp,1000+n);assert.equal(sum(s,'fixed'),immune?0:n);}
});
test('4903已答1767：2171和1061均读取投影负等级不再双吸或反转，真实对手正等级保留，速度也按投影负级参与顺序',()=>{
 const s=make({move:38393,hp:1000,aStats:{spa:10}});s.fighters[0].stages.atk=-2;s.fighters[1].stages.def=3;s.fighters[1].stages.spd=3;turn(s,38393,20117);assert.equal(sum(s,'fixed'),120);assert.equal(s.fighters[0].hp,1120);assert.equal(s.fighters[0].stages.atk,0);assert.equal(s.fighters[0].stages.def,0);assert.equal(s.fighters[1].stages.def,3);assert.equal(s.fighters[1].stages.spd,3);
 const speed=make({move:38393,aStats:{spe:300,spa:10},bStats:{spe:200}});speed.fighters[1].stages.spe=3;turn(speed,38393,20117);assert.equal(speed.turns[0].first,0);assert.equal(speed.fighters[1].stages.spe,3);assert.ok(speed.turns[0].events.some(e=>e.text.includes('速度 300 / 80')));
});
test('4903已答属性红公共通道：同一次属性技能结算的两个红伤输入共用2250额度，完整伤害与实际HP减少分别记录',()=>{
 const s=make({move:20155,index:-1,soul:true}),engine=E.WIKI.effectsEngine;let fired=false;E.WIKI.effectsEngine={...engine,run(phase,ops,c){const out=engine.run(phase,ops,c);if(phase==='afterHit'&&c.a.side===1){c.hurt(c.t,1500,'技能上下文属性红第一段','attack');c.hurt(c.t,1500,'技能上下文属性红第二段','attack');fired=true;}return out;}};try{turn(s,20155,20117);}finally{E.WIKI.effectsEngine=engine;}assert.equal(fired,true);const hits=s.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===1);assert.deepEqual(hits.map(e=>e.settledDamage),[1500,750]);assert.equal(s.fighters[0].hp,6750);
});
