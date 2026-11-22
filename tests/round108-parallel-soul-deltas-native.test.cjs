'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),L=require('../local-species.cjs');
const pools=require('../dist/status-pools.js'),{loadout}=require('./helpers/3001-native.cjs');
function make(id,soul,moves=[],o={}){
 const versions=E.WIKI.versionSnapshots(L.species(id)),selected=versions.find(s=>s.selectedSoulId===soul)??versions.find(s=>s.selectedSoulId===undefined&&s.souls.some(x=>x.id===soul)),source=selected?{...selected,selectedSoulId:soul}:null,enemy=L.species(o.enemy??3102),stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000};assert.ok(source);
 const s=E.createBattle({wikiSnapshots:[source,enemy],wikiLoadouts:[loadout(source,moves),loadout(enemy,o.enemyMoves??[])],builds:[{overrides:{...stats,...o.aStats}},{overrides:{...stats,...o.bStats}}],seed:o.seed??14,criticals:false});
 assert.equal(s.fighters[0].soulId,soul);s.fighters[0].hp=o.hp??9000;s.fighters[1].hp=o.targetHp??9000;s.fighters[0].stages.acc=6;s.fighters[1].stages.acc=6;
 Object.assign(s.fighters[0].effects,structuredClone(o.aEffects??{}));Object.assign(s.fighters[1].effects,structuredClone(o.bEffects??{}));Object.assign(s.fighters[1].ailments,o.ailments??{});
 return s;
}
const turn=(s,a,b='potion:pp')=>E.resolveTurn(s,[typeof a==='number'?'wiki:'+a:a,b]);
const currentDamage=(s,side,type)=> (s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.sourceSide===side&&e.type===type);
function observe(run,watch){const original=E.SOULS;E.SOULS={...original,run(event,c){return watch(event,c,()=>original.run(event,c));}};try{return run();}finally{E.SOULS=original;}}
test('750原回初50概率接完整PVP池，真实只抽一种独立二三回合且免疫不补抽',()=>{
 const expected=pools.pool(undefined,{includeRestricted:true}).map(x=>x.name),durations=new Set(),seen=new Set();let successes=0,failures=0;
 for(let i=1;i<=48;i++){
  const seed=Math.imul(i,2654435761)>>>0,calls=[];
  const out=observe(()=>turn(make(3434,750,[],{seed,hp:500}),'potion:pp'),(event,c,next)=>{
   if(event==='roundStart'&&c.a.soulId===750){const original=c.randomFromSharedPool;c.randomFromSharedPool=(n,controlOnly,id)=>{calls.push({n,controlOnly,id});return original(n,controlOnly,id);};}return next();
  });
  const draws=(out.randomStatusEvents??[]).filter(x=>x.round===1&&x.sourceKey==='soul:750');
  if(out.fighters[0].soulState.odinFailedRound===1){failures++;assert.equal(draws.length,0);continue;}
  successes++;assert.equal(calls.length,1);assert.equal(calls[0].n,1);assert.equal(calls[0].controlOnly,false);assert.equal(draws.length,1);assert.ok([2,3].includes(draws[0].duration));durations.add(draws[0].duration);seen.add(draws[0].name);
  const immune=turn(make(3434,750,[],{seed,hp:500,bEffects:{免异常:{start:1,end:9}}}),'potion:pp'),blocked=(immune.randomStatusEvents??[]).filter(x=>x.round===1&&x.sourceKey==='soul:750');
  assert.equal(blocked.length,1);assert.deepEqual([blocked[0].name,blocked[0].duration],[draws[0].name,draws[0].duration]);assert.deepEqual(immune.fighters[1].ailments,{});
 }
 assert.ok(successes>0&&failures>0);assert.deepEqual([...durations].sort(),[2,3]);assert.ok([...seen].some(x=>!['烧伤','冻伤','中毒','麻痹','害怕','睡眠'].includes(x)));assert.ok(expected.includes('瘫痪')&&expected.includes('凝滞'));assert.ok(!expected.includes('山神守护'));
});
test('750概率成功但真实附加被免疫也补偿三分一回复与下一回合先制一，概率失败同样补偿',()=>{
 let found=false,failed=false;
 for(let i=1;i<=32&&(!found||!failed);i++){
  const seed=Math.imul(i,2654435761)>>>0,plain=turn(make(3434,750,[],{seed,hp:500}),'potion:pp');
  if(plain.fighters[0].soulState.odinFailedRound===1){assert.equal(plain.fighters[0].hp,3500);failed=true;continue;}
  let blocked=turn(make(3434,750,[22561],{seed,hp:500,bEffects:{免异常:{start:1,end:9}}}),'potion:pp');
  assert.deepEqual(blocked.fighters[1].ailments,{});assert.equal(blocked.fighters[0].hp,3500);assert.equal(blocked.fighters[0].soulState.odinPriorityRound,2);
  blocked=turn(blocked,22561);assert.equal(blocked.fighters[0].soulState.resolvedPriority.value,1);found=true;
 }assert.ok(found&&failed);
});
test('750原普通攻击命中零红仍按两种异常固定吸取300，免粉保留理论回复，MISS与无效不吸取',()=>{
 for(const mode of ['normal','zero','pink','miss','invalid','skillBan']){
  const aEffects={},bEffects={免异常:{start:1,end:9}};
  if(['zero','pink'].includes(mode))bEffects['攻击伤害免疫']={start:1,end:1};
  if(mode==='pink')bEffects['固定百分比免疫']={start:1,end:1};
  if(mode==='miss')aEffects['攻击必失']={start:1,end:1};
  if(mode==='invalid')aEffects.skillBlock={start:1,end:1};
  if(mode==='skillBan')aEffects['无法通过自身技能恢复体力']={start:1,end:1};
  let observed;
  const out=observe(()=>turn(make(3434,750,[14102],{hp:1000,aEffects,bEffects,ailments:{烧伤:3,中毒:3}}),14102),(event,c,next)=>{const match=event==='afterAttack'&&c.a.soulId===750,before=c.a.hp;const result=next();if(match)observed={before,after:c.a.hp,count:Object.values(c.t.ailments).filter(x=>x>=c.round).length};return result;});
  const active=!['miss','invalid'].includes(mode),hits=currentDamage(out,0,'fixed');assert.equal(hits.length,active&&mode!=='pink'?1:0,mode);
  if(active){assert.equal(observed.count,2);assert.equal(observed.after-observed.before,300);if(mode!=='pink'){assert.equal(hits[0].settledDamage,300);assert.equal(hits[0].hpLoss,300);}}
  if(mode==='pink')assert.equal(currentDamage(out,0,'attack')[0].hpLoss,0);
 }
});
test('778原睡眠目标零红命中仍附3000百分比，本次击醒仍附，免粉零损失而MISS无效及原无睡眠不附',()=>{
 for(const mode of ['normal','zero','pink','miss','invalid','awake']){
  const aEffects={},bEffects={};if(['zero','pink'].includes(mode))bEffects['攻击伤害免疫']={start:1,end:1};if(mode==='pink')bEffects['固定百分比免疫']={start:1,end:1};if(mode==='miss')aEffects['攻击必失']={start:1,end:1};if(mode==='invalid')aEffects.skillBlock={start:1,end:1};
  let asleepAtHit;
  const out=observe(()=>turn(make(3465,778,[10499],{aEffects,bEffects,ailments:mode==='awake'?{}:{睡眠:3}}),10499),(event,c,next)=>{if(event==='afterHit'&&c.a.soulId===778)asleepAtHit=c.t.ailments.睡眠>=c.round;return next();});
  const hits=currentDamage(out,0,'percent'),active=['normal','zero','pink'].includes(mode);assert.equal(hits.length,active&&mode!=='pink'?1:0,mode);
  if(active&&mode!=='pink'){assert.equal(hits[0].settledDamage,3000);assert.equal(hits[0].hpLoss,3000);}
  if(mode==='pink')assert.equal(out.fighters[1].hp,9000);
  if(mode==='normal')assert.equal(asleepAtHit,false);
 }
});
test('819与1685原攻击超300授下次技能先制二或三，真实药剂及睡眠未出保留，实际属性招使用后消费',()=>{
 for(const [soul,bonus] of [[819,2],[1685,3]])for(const controlled of [false,true]){
  let s=make(3506,soul,[12748,20267],{enemy:controlled?3205:3102,enemyMoves:controlled?[22053]:[10127],targetHp:8500,aStats:{atk:4000,spe:controlled?9999:1},bStats:{def:200,spe:controlled?1000:9999}});
  s=turn(s,12748,controlled?'wiki:22053':'potion:pp');assert.ok(currentDamage(s,0,'attack').some(x=>x.settledDamage>300));
  const key='wiki:20267',pp=s.fighters[0].pp[key];
  if(controlled){assert.ok(s.fighters[0].ailments.睡眠>=s.round);while(s.fighters[0].ailments.睡眠>=s.round){s=turn(s,20267);assert.equal(s.fighters[0].pp[key],pp);}}
  else s=turn(s,'potion:pp');
  s=turn(s,20267,controlled?'potion:pp':'wiki:10127');assert.equal(s.fighters[0].soulState.resolvedPriority.value,bonus,soul+' '+controlled);assert.equal(s.fighters[0].pp[key],pp-1);if(!controlled)assert.equal(s.turns.at(-1).first,0);
  s=turn(s,20267);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);assert.equal(s.fighters[0].pp[key],pp-2);
 }
});
test('822及1646魂吸取以战阶末实际HP重比，原回复从低跨高不吸、真实受击从高跨低才吸',()=>{
 for(const soul of [822,1646])for(const heal of [true,false]){
  const move=heal?21422:21119,enemyAction=heal?'potion:pp':'wiki:10018';let frame;
  const out=observe(()=>turn(make(3514,soul,[move],{enemy:2988,enemyMoves:[10018],hp:heal?1000:8000,targetHp:heal?5000:7000,aStats:{def:200,spe:1},bStats:{atk:9999,spe:9999}}),move,enemyAction),(event,c,next)=>{const match=event==='combatEnd'&&c.a.soulId===soul,before=match?{a:c.a.hp,t:c.t.hp}:null,result=next();if(match)frame={before,after:{a:c.a.hp,t:c.t.hp}};return result;});
  assert.ok(frame);const hits=currentDamage(out,0,'percent');
  if(heal){assert.equal(frame.before.a,9000);assert.equal(frame.before.t,5000);assert.equal(hits.length,0);assert.deepEqual({a:out.fighters[0].hp,t:out.fighters[1].hp},frame.before);}
  else {assert.ok(frame.before.a<frame.before.t);assert.equal(hits.length,1);assert.equal(hits[0].settledDamage,3000);assert.equal(out.fighters[1].hp,frame.before.t-3000);assert.equal(out.fighters[0].hp,Math.min(9000,frame.before.a+3000));}
 }
});
