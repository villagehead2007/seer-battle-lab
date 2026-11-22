'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),L=require('../local-species.cjs'),P=require('../completion-policy.cjs'),{loadout}=require('./helpers/3001-native.cjs'),rows=require('../research/TEAM-STAGE-2/round111-conditional-native-input-20261113.json');
const leaves=rows.filter(r=>r.category==='leaf'),stats={maxHp:9000,atk:180,spa:360,def:9999,spd:9999,spe:1000};
function snapshot(row){const s=E.WIKI.versionSnapshots(L.species(row.id)).find(s=>P.digest(s)===row.snapshotDigest);assert.ok(s,row.key);return s;}
function make(row,o={}){
 const enemy=L.species(3102),s=E.createBattle({wikiSnapshots:[snapshot(row),enemy],wikiLoadouts:[row.moves,loadout(enemy,[10127])],builds:[{overrides:{...stats,spe:o.late?1:9999}},{overrides:{...stats,maxHp:9999,atk:180,spa:180,spe:o.late?9999:1}}],criticals:false,seed:o.seed??14}),a=s.fighters[0],t=s.fighters[1];a.hp=o.hp??1000;a.stages.acc=6;
 // Original 36404 has priority +3; equal legal initial priority leaves speed to decide the late boundary.
 if(o.late&&row.move===36404)t.effects.id984={start:1,end:1,amount:3};
 if(o.negative){a.stages.atk=-2;a.stages.def=-3;a.stages.spa=2;}
 if(o.cap){for(const k of ['atk','def','spa','spd','spe'])a.stages[k]=6;t.stages.def=-6;t.stages.acc=-6;}
 if(o.ailment)t.ailments.沉默=3;
 if(o.crit)a.counts.nextCrit=1;
 if(o.mode==='banBoost')a.effects.禁强化={start:1,end:1};
 if(o.mode==='weakImmune')t.effects.免弱={start:1,end:1};
 if(o.mode==='immune')t.effects.免异常={start:1,end:1};
 if(o.mode==='skillHealBan')a.effects.技能禁疗={start:1,end:1};
 if(o.mode==='halfHeal')a.effects.回复效果削减={start:1,end:1,fraction:.5};
 if(o.mode==='invalid')a.effects.skillBlock={start:1,end:1};
 if(o.mode==='control')a.ailments.疲惫=2;
 if(o.mode==='zero')a.pp['wiki:'+row.move]=0;
 return s;
}
function use(row,o={}){
 const before=make(row,o),key='wiki:'+row.move,fx=E.WIKI.effectsEngine,frames={};
 const compiled=before.moveDefinitions[key];assert.deepEqual(compiled.operations.map(x=>[Number(x.effectId),x.index,x.phase,x.sourceArgs]),row.operations);assert.equal(before.fighters[0].soulId,row.soul);
 if(o.mode==='zero'){const saved=structuredClone(before);assert.throws(()=>E.resolveTurn(before,[key,'wiki:10127']),/请选择|有 PP/);assert.deepEqual(before,saved);return{before,frames};}
 E.WIKI.effectsEngine={...fx,run(phase,ops,c){const own=c.a.side===0&&c.m.wikiId===row.move,prior=own?{hp:c.a.hp,modifier:c.modifier}:null,out=fx.run(phase,ops,c);if(own)frames[phase]={before:prior,a:structuredClone(c.a),t:structuredClone(c.t),crit:c.crit,modifier:c.modifier,first:c.first,round:c.round};return out;}};
 let after;try{after=E.resolveTurn(before,[o.mode==='potion'?'potion:pp':key,'wiki:10127']);}finally{E.WIKI.effectsEngine=fx;}
 return{before,after,frames};
}
function gates(row){for(const mode of ['invalid','control','potion','zero']){const x=use(row,{mode});assert.equal(x.frames.afterHit,undefined,row.key+':'+mode);assert.equal(x.frames.afterAttack,undefined,row.key+':'+mode);}}

test('三个完整来源父项六合法版本实际整招保原PP物特面板及全部多阶段指令，十组件已有合格状态证据逐key组合',()=>{
 for(const row of rows.filter(x=>x.category==='parent')){
  const s=snapshot(row),member=(snapshot,moves,overrides={})=>({snapshot,moves,build:{overrides:{...stats,...overrides}}}),foe=L.species(2989),g=T.create([[member(s,row.moves),member(L.species(3056),loadout(L.species(3056),[]))],[member(foe,loadout(foe,[])),member(L.species(3223),loadout(L.species(3223),[]))]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=5000;g.battle.fighters[0].stages.acc=6;
  const key='wiki:'+row.move,pp=g.battle.fighters[0].pp[key],original=E.SOULS,fx=E.WIKI.effectsEngine;let used,panel;
  E.SOULS={...original,run(event,c){if(event==='afterUse'&&c.a.side===0&&c.m.wikiId===row.move)used={pp:c.a.pp[key],soul:c.a.soulId,hash:c.a.soulHash,ops:c.m.operations.map(o=>[Number(o.effectId),o.index,o.phase,o.sourceArgs])};return original.run(event,c);}};
  E.WIKI.effectsEngine={...fx,run(phase,ops,c){const out=fx.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0&&c.m.wikiId===row.move)panel={atk:c.effective(c.a,'atk'),spa:c.effective(c.a,'spa')};return out;}};
  let out;try{out=T.turn(g,[key,'potion:pp']);}finally{E.SOULS=original;E.WIKI.effectsEngine=fx;}
  assert.ok(used,row.key);assert.equal(used.pp,pp-1);assert.equal(used.soul,row.soul);assert.equal(used.hash,s.souls.find(x=>x.id===row.soul).hash);assert.deepEqual(used.ops,row.operations);
  const red=(out.battle.damageEvents??[]).filter(e=>e.round===1&&e.sourceSide===0&&e.type==='attack'&&e.moveId===row.move);if(row.kind==='status')assert.equal(red.length,0);else{assert.ok(red.some(e=>e.hpLoss>0));assert.equal(red[0].attackValue,panel[row.kind==='physical'?'atk':'spa']);}
 }
 assert.equal(rows.filter(x=>x.category==='parent').length,6);
});

test('两条原3只清自身负等级保正强化，原43实际满体回复和技能禁疗减半封顶边界不受魂印回末掩盖',()=>{
 for(const row of leaves.filter(r=>r.effect===3)){const x=use(row,{negative:true}).frames.afterHit;assert.ok(x);assert.equal(x.a.stages.atk,0);assert.equal(x.a.stages.def,0);assert.equal(x.a.stages.spa,2);gates(row);}
 const row=leaves.find(r=>r.effect===43);for(const mode of ['normal','skillHealBan','halfHeal']){const frame=use(row,{mode}).frames.afterHit;assert.equal(frame.a.hp,mode==='skillHealBan'?1000:mode==='halfHeal'?5500:9000);}
 assert.equal(use(row,{hp:8999}).frames.afterHit.a.hp,9000);gates(row);
});

test('原5防御负二命中负一、原175有异常才特攻速度加一和原186仅后手攻击速度加一，免弱禁强封顶及未出门槛',()=>{
 for(const row of leaves.filter(r=>[5,175,186].includes(r.effect))){
  const x=use(row,{ailment:row.effect===175,late:row.effect===186}).frames.afterHit;assert.ok(x);
  if(row.effect===5){assert.equal(x.t.stages.def,-2);assert.equal(x.t.stages.acc,-1);const f=use(row,{mode:'weakImmune'}).frames.afterHit;assert.equal(f.t.stages.def,0);assert.equal(f.t.stages.acc,0);const cap=use(row,{cap:true}).frames.afterHit;assert.equal(cap.t.stages.def,-6);assert.equal(cap.t.stages.acc,-6);}
  else if(row.effect===175){assert.equal(x.a.stages.spa,1);assert.equal(x.a.stages.spe,1);const no=use(row).frames.afterHit;assert.equal(no.a.stages.spa,0);assert.equal(no.a.stages.spe,0);const ban=use(row,{ailment:true,mode:'banBoost'}).frames.afterHit;assert.equal(ban.a.stages.spa,0);assert.equal(ban.a.stages.spe,0);const cap=use(row,{ailment:true,cap:true}).frames.afterHit;assert.equal(cap.a.stages.spa,6);assert.equal(cap.a.stages.spe,6);}
  else {assert.equal(x.first,1);assert.equal(x.a.stages.atk,1);assert.equal(x.a.stages.spe,1);const first=use(row).frames.afterHit;assert.equal(first.first,0);assert.equal(first.a.stages.atk,0);assert.equal(first.a.stages.spe,0);const ban=use(row,{late:true,mode:'banBoost'}).frames.afterHit;assert.equal(ban.a.stages.atk,0);assert.equal(ban.a.stages.spe,0);}
  gates(row);
 }
});

test('原12烧伤十及五十原16睡眠三十原15害怕八十以自然种子实得成功失败，原两三回独立时长免异与未出招门槛',()=>{
 for(const row of leaves.filter(r=>[12,15,16].includes(r.effect))){const status=({12:'烧伤',15:'害怕',16:'睡眠'})[row.effect],seen=new Set();let successSeed;
  for(let seed=1;seed<=128&&seen.size<2;seed++){const x=use(row,{seed}).frames.afterHit;assert.ok(x);const end=x.t.ailments[status],yes=end>=1;seen.add(yes);if(yes){assert.ok([2,3].includes(end));successSeed=seed;}}
  assert.deepEqual([...seen].sort(),[false,true],row.key);assert.equal(use(row,{seed:successSeed,mode:'immune'}).frames.afterHit.t.ailments[status],undefined);gates(row);
 }
});

test('两条原986先手实际红伤倍率额外五成后手无增益，两条原496只在当击真实暴击回满且技能禁疗阻挡',()=>{
 for(const row of leaves.filter(r=>r.effect===986))for(const late of [false,true]){const x=use(row,{late}),f=x.frames.beforeDamage;assert.ok(f);assert.equal(f.first,late?1:0);assert.ok(Math.abs(f.modifier/f.before.modifier-(late?1:1.5))<1e-12);assert.ok(x.after.damageEvents.some(e=>e.sourceSide===0&&e.type==='attack'&&e.hpLoss>0));}
 for(const row of leaves.filter(r=>r.effect===496)){for(const crit of [false,true]){const f=use(row,{crit}).frames.afterAttack;assert.ok(f);assert.equal(f.crit,crit);assert.equal(f.a.hp,crit?9000:f.before.hp);}const ban=use(row,{crit:true,mode:'skillHealBan'}).frames.afterAttack;assert.equal(ban.crit,true);assert.equal(ban.a.hp,ban.before.hp);gates(row);}
 for(const row of leaves.filter(r=>r.effect===986))gates(row);
});
