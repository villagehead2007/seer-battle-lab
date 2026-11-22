'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),L=require('../local-species.cjs'),P=require('../completion-policy.cjs'),{loadout}=require('./helpers/3001-native.cjs');
const allRows=require('../research/TEAM-STAGE-2/round106-composite-native-input-20261113.json'),rows=allRows.filter(x=>x.category==='parent'),counts={creations:0,turns:0};
function member(snapshot,moves=[],overrides={}){return{snapshot,moves:moves.length?moves:loadout(snapshot,[]),build:{overrides:{maxHp:9000,atk:180,spa:360,def:4000,spd:4000,spe:1000,...overrides}}};}
function actual(row){
  const snapshot=E.WIKI.versionSnapshots(L.species(row.id)).find(s=>P.digest(s)===row.snapshotDigest);assert.ok(snapshot,row.key);
  const raw=E.WIKI.availableMoves(snapshot).find(m=>m.id===row.move);
  assert.deepEqual([raw.kind,raw.power,raw.pp,raw.alwaysHit],[row.kind,row.power,row.pp,row.alwaysHit]);
  const before=T.create([[member(snapshot,row.moves),member(L.species(3056))],[member(L.species(2989),[],{maxHp:9999,def:9999,spd:9999,spe:100}),member(L.species(3223))]],[0,0],{seed:14,criticals:false});counts.creations++;
  before.battle.fighters[0].hp=5000;before.battle.fighters[0].stages.acc=6;before.slots[0][1].fighter.hp=4000;
  const key='wiki:'+row.move,pp=before.battle.fighters[0].pp[key],original=E.SOULS,fx=E.WIKI.effectsEngine;
  let used,attackStats;
  E.SOULS={...original,run(event,c){if(event==='afterUse'&&c.a.side===0&&c.m.wikiId===row.move)used={pp:c.a.pp[key],soul:c.a.soulId,hash:c.a.soulHash,move:c.m.wikiId,operations:c.m.operations.map(o=>[Number(o.effectId),o.index,o.phase,o.sourceArgs])};return original.run(event,c);}};
  E.WIKI.effectsEngine={...fx,run(phase,ops,c){const out=fx.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0&&c.m.wikiId===row.move)attackStats={atk:c.effective(c.a,'atk'),spa:c.effective(c.a,'spa')};return out;}};
  let after;try{after=T.turn(before,[key,'potion:pp']);counts.turns++;}finally{E.SOULS=original;E.WIKI.effectsEngine=fx;}
  return{before,after,used,attackStats,pp,snapshot};
}
test('十五完整来源父项22合法版本实际整招，原PP物特独立面板与全有序指令保留，35个原效果的合格状态证据逐key组合',()=>{
  const parents=new Set();
  for(const row of rows){
    const x=actual(row);parents.add(row.key);assert.ok(x.used,row.key+' actually used full original');
    assert.equal(x.used.move,row.move);assert.equal(x.used.soul,row.soul);
    assert.equal(x.used.hash,x.snapshot.souls.find(s=>s.id===row.soul).hash);
    assert.equal(x.used.pp,x.pp-1,row.key+' before independent passive PP recovery');
    assert.deepEqual(x.used.operations,row.operations,row.key+' complete ordered multi-phase original operations');
    const red=(x.after.battle.damageEvents??[]).filter(e=>e.round===1&&e.sourceSide===0&&e.type==='attack'&&e.moveId===row.move);
    if(row.kind==='status')assert.equal(red.length,0,row.key);
    else{
      assert.ok(red.length>0,row.key+' actual original red damage');assert.ok(red.some(e=>e.hpLoss>0));
      assert.ok(x.attackStats,row.key+' original beforeDamage frame');
      assert.equal(red[0].attackValue,x.attackStats[row.kind==='physical'?'atk':'spa'],row.key+' correct original physical/special panel');
    }
    assert.equal(x.before.battle.round,1);assert.equal(x.before.slots[0][1].fighter.hp,4000);
  }
  assert.equal(parents.size,15);assert.equal(rows.length,22);
});
test.after(()=>console.log('ROUND106_PARENT_COUNTS '+JSON.stringify({...counts,parents:15,originalProfiles:rows.length,noMidBattleWrites:true,noRngReplacement:true,existingPerEffectEvidenceReused:true,not840OnlyCertification:true})));

const leaves=allRows.filter(x=>x.category==='leaf');
function leafMake(row,{mode='normal',ailment=false,cap=false}={}){
 const snapshot=E.WIKI.versionSnapshots(L.species(row.id)).find(s=>P.digest(s)===row.snapshotDigest),enemy=L.species(2988),stats={maxHp:9000,atk:180,spa:360,def:1000,spd:1000,spe:9999};assert.ok(snapshot);
 const s=E.createBattle({wikiSnapshots:[snapshot,enemy],wikiLoadouts:[row.moves,loadout(enemy,[])],builds:[{overrides:stats},{overrides:{...stats,spe:1}}],seed:14,criticals:false}),a=s.fighters[0],t=s.fighters[1];a.stages.acc=6;
 if(row.effect===433&&row.id===3318)a.stages.spe=-6;
 if(ailment)t.ailments.烧伤=3;
 if(cap)for(const k of ['atk','def','spa','spd','spe','acc'])t.stages[k]=-6;
 if(mode==='banBoost')a.effects.禁强化={start:1,end:1};
 if(mode==='weakImmune')t.effects.免弱={start:1,end:1};
 if(mode==='invalid')a.effects.skillBlock={start:1,end:1};
 if(mode==='control')a.ailments.疲惫=2;
 if(mode==='zero')a.pp['wiki:'+row.move]=0;
 return s;
}
function leafTurn(s,move){return E.resolveTurn(s,[typeof move==='number'?'wiki:'+move:move,'potion:pp']);}
function leafUse(row,options={}){
 const before=leafMake(row,options),original=E.SOULS;let atUse;
 E.SOULS={...original,run(event,c){if(event==='afterUse'&&c.a.side===0)atUse={a:structuredClone(c.a),t:structuredClone(c.t)};return original.run(event,c);}};
 let after;try{after=leafTurn(before,options.mode==='potion'?'potion:pp':row.move);}finally{E.SOULS=original;}
 const key='wiki:'+row.move;assert.equal(after.fighters[0].pp[key],before.fighters[0].pp[key]-(['control','potion'].includes(options.mode)?0:1));
 const op=after.moveDefinitions[key].operations.find(o=>Number(o.effectId)===row.effect&&o.index===row.index);assert.deepEqual(op.sourceArgs,row.args);
 return{after,atUse};
}
function leafGates(row,witness,options={}){for(const mode of ['invalid','control','potion','zero']){
 if(mode==='zero'){const s=leafMake(row,{...options,mode}),saved=structuredClone(s);assert.throws(()=>leafTurn(s,row.move),/请选择|有 PP/);assert.deepEqual(s,saved);continue;}
 assert.equal(witness(leafUse(row,{...options,mode}).after),false);
}}
test('两条原433当前双防每轮加二或速度加一，原645每轮速度加二另保留，原持续到期后停止指定增益',()=>{
 for(const row of leaves.filter(x=>x.effect===433)){
  let s=leafUse(row).after;assert.deepEqual(s.fighters[0].effects['每回合强化'],{start:1,end:row.args[0],stages:row.args.slice(1)});
  if(row.id===3308){assert.equal(s.fighters[0].stages.def,3);assert.equal(s.fighters[0].stages.spd,3);s=leafTurn(s,'potion:pp');assert.equal(s.fighters[0].stages.def,5);assert.equal(s.fighters[0].stages.spd,5);s=leafTurn(s,'potion:pp');assert.equal(s.fighters[0].stages.def,5);assert.equal(s.fighters[0].stages.spd,5);}
  else {assert.equal(s.fighters[0].soulId,645);assert.equal(s.fighters[0].stages.spe,-2);for(const n of [1,4,6]){s=leafTurn(s,'potion:pp');assert.equal(s.fighters[0].stages.spe,n);}}
 }
 leafGates(leaves.find(x=>x.id===3308&&x.effect===433),s=>!!s.fighters[0].effects['每回合强化']);
});
test('两条原1001目标有异常才六项翻倍且禁强阻授，一条原749六项各减一及免弱负六封底共享验证',()=>{
 const axes=['atk','def','spa','spd','spe','acc'];
 for(const row of leaves.filter(x=>x.effect===1001))for(const ailment of [false,true]){
  const {atUse}=leafUse(row,{ailment});assert.deepEqual(axes.map(k=>atUse.a.stages[k]),[1,1,1,1,1,6].map((n,i)=>i===5?6:n*(ailment?2:1)),row.key);
 }
 const row=leaves.find(x=>x.id===3443&&x.effect===1001),ban=leafUse(row,{ailment:true,mode:'banBoost'}).atUse;assert.deepEqual(axes.map(k=>ban.a.stages[k]),[0,0,0,0,0,6]);leafGates(row,s=>s.fighters[0].stages.atk>0,{ailment:true});
 const weak=leaves.find(x=>x.effect===749);
 for(const mode of ['normal','weakImmune'])assert.deepEqual(axes.map(k=>leafUse(weak,{mode}).atUse.t.stages[k]),Array(6).fill(mode==='normal'?-1:0));
 const cap=leafUse(weak,{cap:true}).atUse;assert.deepEqual(axes.map(k=>cap.t.stages[k]),Array(6).fill(-6));leafGates(weak,s=>s.fighters[1].stages.atk<0);
});
