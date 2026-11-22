'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),L=require('../local-species.cjs');
const {loadout}=require('./helpers/3001-native.cjs'),rows=require('../research/TEAM-STAGE-2/round105-common-native-input-20261113.json');
function make(row,{mode='normal',clear=false,protect=false,boost=false,extra=[],seed=14,enemyId=row.enemy,enemyMove}={}){
 const source=E.WIKI.versionSnapshots(L.species(row.id)).find(s=>s.selectedSoulId===row.soul&&E.WIKI.availableMoves(s).some(m=>m.id===row.move)),enemy=L.species(enemyId),stats={maxHp:9000,atk:180,spa:180,def:9999,spd:9999,spe:9999};assert.ok(source);
 const s=E.createBattle({wikiSnapshots:[source,enemy],wikiLoadouts:[extra.length?loadout(source,[row.move,...extra]):row.moves,loadout(enemy,enemyMove?[enemyMove]:[])],builds:[{overrides:stats},{overrides:{...stats,spe:1}}],seed,criticals:false}),a=s.fighters[0],t=s.fighters[1];a.stages.acc=6;
 if(clear)t.effects['要害概率增加']={start:1,end:9,chance:1/16};
 if(protect)t.effects[boost?'强化保护':'protect']={start:1,end:9};
 if(boost)Object.assign(t.stages,{atk:2,def:-1,spd:1});
 if(mode==='banBoost')a.effects.禁强化={start:1,end:1};
 if(mode==='invalid')a.effects.skillBlock={start:1,end:1};
 if(mode==='control')a.ailments.疲惫=2;
 if(mode==='zero')a.pp['wiki:'+row.move]=0;
 return s;
}
const turn=(s,move,enemy='potion:pp')=>E.resolveTurn(s,[typeof move==='number'?'wiki:'+move:move,enemy]);
function execute(row,options={}){
 const before=make(row,options),key='wiki:'+row.move,original=E.SOULS;let atUse;
 E.SOULS={...original,run(event,c){if(event==='afterUse'&&c.a.side===0)atUse={a:structuredClone(c.a),t:structuredClone(c.t)};return original.run(event,c);}};
 let after;try{after=turn(before,options.mode==='potion'?'potion:pp':row.move,options.enemyAction);}finally{E.SOULS=original;}
 assert.equal(after.fighters[0].pp[key],before.fighters[0].pp[key]-(['control','potion'].includes(options.mode)?0:1),row.key);
 const op=after.moveDefinitions[key].operations.find(o=>Number(o.effectId)===row.effect&&o.index===row.index);assert.deepEqual(op.sourceArgs,row.args,row.key);
 return {before,after,atUse};
}
function gates(row,grant,options={}){for(const mode of ['invalid','control','potion','zero']){
 if(mode==='zero'){const s=make(row,{...options,mode}),saved=structuredClone(s);assert.throws(()=>turn(s,row.move),/请选择|有 PP/);assert.deepEqual(s,saved);continue;}
 assert.equal(grant(execute(row,{...options,mode}).after),false,row.key+' '+mode);
}}
test('四条原760完整招对真实微弱目标实际按普通克制结算，原0点75取一且无效控制药剂零PP不出红伤',()=>{
 for(const row of rows.filter(r=>r.effect===760)){
  const {before,after}=execute(row),move=after.moveDefinitions['wiki:'+row.move];assert.equal(E.typeEffectiveness(move.type,before.fighters[1].type,before.typeChart),row.weakness);assert.ok(row.weakness>0&&row.weakness<1);
  const event=after.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0);assert.ok(event);assert.ok(event.detail.includes('× 属性 1 ×'),event.detail);assert.ok(event.damage.hpLoss>0);
 }
 gates(rows.find(r=>r.effect===760),s=>(s.damageEvents??[]).some(e=>e.sourceSide===0&&e.type==='attack'));
});
test('四条原928清真实计时效果成功才授一次免异，空目标和保护不授，原相邻粉伤与吸取保持',()=>{
 for(const row of rows.filter(r=>r.effect===928))for(const mode of ['clear','empty','protect']){
  const {atUse}=execute(row,{clear:mode!=='empty',protect:mode==='protect'});assert.ok(atUse);
  assert.equal(!!atUse.t.effects['要害概率增加'],mode==='protect',row.key+' '+mode);
  assert.equal(atUse.a.counts.immune??0,mode==='clear'?1:0,row.key+' '+mode);
 }
 gates(rows.find(r=>r.effect===928),s=>(s.fighters[0].counts.immune??0)>0,{clear:true});
});
test('三条原1179清回合成功才记录一次百分之百下攻增伤，保护与空场不授，真实药剂保留及下次攻击消费',()=>{
 for(const row of rows.filter(r=>r.effect===1179))for(const mode of ['clear','empty','protect']){
  const {atUse}=execute(row,{clear:mode!=='empty',protect:mode==='protect'});assert.equal(!!atUse.t.effects['要害概率增加'],mode==='protect');
  assert.equal(atUse.a.counts.nextAttackBoost??0,mode==='clear'?1:0,row.key+' '+mode);
  if(mode==='clear')assert.equal(atUse.a.soulState.nextAttackBoostFraction,1);
 }
 const row=rows.find(r=>r.id===3481&&r.effect===1179);gates(row,s=>(s.fighters[0].counts.nextAttackBoost??0)>0,{clear:true});
 const plain=E.WIKI.availableMoves(L.species(row.id)).find(m=>m.power>0&&!m.fifth&&!m.effectInstances.length);assert.ok(plain);
 let s=execute(row,{clear:true,extra:[plain.id]}).after;s=turn(s,'potion:pp');assert.equal(s.fighters[0].counts.nextAttackBoost,1);
 s=turn(s,plain.id);assert.equal(s.fighters[0].counts.nextAttackBoost,0);assert.ok(s.damageEvents.some(e=>e.round===3&&e.sourceSide===0&&e.type==='attack'&&e.hpLoss>0));
});
test('原33两源只清正级且保留负级，原85两源实际转移正级，自禁强时只清目标不授自身',()=>{
 for(const row of rows.filter(r=>[33,85].includes(r.effect)))for(const mode of ['normal','protect','banBoost']){
  if(row.effect===85&&mode==='protect')continue;
  const {atUse}=execute(row,{boost:true,protect:mode==='protect',mode});
  assert.equal(atUse.t.stages.atk,mode==='protect'?2:0,row.key);assert.equal(atUse.t.stages.spd,mode==='protect'?1:0);assert.equal(atUse.t.stages.def,-1);
  assert.equal(atUse.a.stages.atk,row.effect===85&&mode!=='banBoost'?2:0);assert.equal(atUse.a.stages.spd,row.effect===85&&mode!=='banBoost'?1:0);
 }
 for(const effect of [33,85])gates(rows.find(r=>r.effect===effect),s=>s.fighters[1].stages.atk!==2,{boost:true});
});
test('两条原32实际授要害率增加十六分一和原三或五回合，真实药剂等待到期，未用不授',()=>{
 for(const row of rows.filter(r=>r.effect===32)){
  let s=execute(row).after;assert.deepEqual(s.fighters[0].effects['要害概率增加'],{start:1,end:row.args[0],chance:1/16},row.key);
  while(s.round<=row.args[0])s=turn(s,'potion:pp');assert.equal(s.fighters[0].effects['要害概率增加'],undefined);
 }
 gates(rows.find(r=>r.effect===32),s=>!!s.fighters[0].effects['要害概率增加']);
});
test('三条原695授原二三回合及50或70概率，真实属性招自然成功和无效均有，第四轮到期实际加速',()=>{
 for(const row of rows.filter(r=>r.effect===695)){
  const {after}=execute(row);assert.deepEqual(after.fighters[0].effects['对手属性失效'],{start:1,end:row.args[0],chance:row.args[1]},row.key);
 }
 const row=rows.find(r=>r.move===19098),seen=new Set();
 for(let seed=1;seed<=32&&seen.size<2;seed++){
  const {after}=execute(row,{seed,enemyId:2989,enemyMove:20889,enemyAction:'wiki:20889'}),n=after.fighters[1].stages.spe;assert.ok([0,1].includes(n));seen.add(n);
 }assert.equal(seen.size,2);
 let s=execute(row,{enemyId:2989,enemyMove:20889}).after;while(s.round<=3)s=turn(s,'potion:pp');const n=s.fighters[1].stages.spe;s=turn(s,'potion:pp','wiki:20889');assert.equal(s.fighters[1].stages.spe,n+1);
 gates(row,s=>!!s.fighters[0].effects['对手属性失效']);
});
