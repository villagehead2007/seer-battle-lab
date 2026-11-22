'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),L=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
const rows=require('../research/TEAM-STAGE-2/round97-boost-native-input-20261113.json');
const keys=['atk','def','spa','spd','spe','acc'],cache=new Map(),observedStages=new WeakMap(),counts={creations:0,turns:0,zeroPpRejections:0};
function make(row,mode='normal',hp=5000){
  const source=L.species(row.id),enemy=L.species(2989),stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000};
  const s=E.createBattle({wikiSnapshots:[source,enemy],wikiLoadouts:[row.moves,loadout(enemy,[])],builds:[{overrides:stats},{overrides:{...stats,spe:100}}],seed:14,criticals:false});counts.creations++;
  const a=s.fighters[0];a.hp=hp;
  if(mode==='cap')for(const key of keys)a.stages[key]=6;
  if(mode==='ban')a.effects.禁强化={start:1,end:1};
  if(mode==='invalid')a.effects.skillBlock={start:1,end:1};
  if(mode==='control')a.ailments.疲惫=2;
  if(mode==='zero')a.pp['wiki:'+row.move]=0;
  assert.equal(a.soulId,row.soul);assert.deepEqual(a.moves,row.moves.map(id=>'wiki:'+id));
  return s;
}
function turn(s,row,mode='normal'){
  const original=E.SOULS;let observed;
  E.SOULS={...original,run(event,c){const out=original.run(event,c);if(event==='afterUse'&&c.a.side===0)observed=keys.map(key=>c.a.stages[key]);return out;}};
  let result;try{result=E.resolveTurn(s,[mode==='potion'?'potion:pp':'wiki:'+row.move,'potion:pp']);counts.turns++;}finally{E.SOULS=original;}
  observedStages.set(result,observed);return result;
}
function vector(s){return keys.map(key=>s.fighters[0].stages[key]);}
function actual(row){
  const key=row.id+':'+row.move;
  if(!cache.has(key)){const before=make(row);cache.set(key,{after:turn(before,row),pp:before.fighters[0].pp['wiki:'+row.move]});}
  return cache.get(key);
}
function checkSources(effect){
  for(const row of rows.filter(x=>x.effect===effect)){
    const {after,pp}=actual(row);
    assert.deepEqual(observedStages.get(after),row.expected,row.key+' actual afterUse before independent roundEnd grants');
    const finalExpected=({'3318:23874':[0,0,2,0,4,1],'3308:25333':[1,3,1,3,1,1],'3318:25356':[1,1,1,1,3,1]})[row.id+':'+row.move]??row.expected;
    assert.deepEqual(vector(after),finalExpected,row.key+' complete round including original433/645');
    assert.equal(after.fighters[0].pp['wiki:'+row.move],pp-1,row.key);
    const op=after.moveDefinitions['wiki:'+row.move].operations.find(o=>Number(o.effectId)===effect&&o.index===row.index);
    assert.deepEqual(op.sourceArgs,row.args,row.key);
  }
}
function checkSharedBoundaries(row){
  for(const mode of ['cap','ban','invalid','control','potion','zero']){
    const before=make(row,mode),pp=before.fighters[0].pp['wiki:'+row.move];
    if(mode==='zero'){
      const original=structuredClone(before);
      assert.throws(()=>E.resolveTurn(before,['wiki:'+row.move,'potion:pp']),/请选择|有 PP/);
      assert.deepEqual(before,original);counts.zeroPpRejections++;continue;
    }
    const after=turn(before,row,mode);
    assert.deepEqual(vector(after),Array(6).fill(mode==='cap'?6:0),mode+' '+row.key);
    assert.equal(after.fighters[0].pp['wiki:'+row.move],pp-(['control','potion'].includes(mode)?0:1),mode+' '+row.key);
  }
}
test('十二条原4以四个完整原招分别提高指定属性，非目标项保零，禁强封顶未出招门禁共享验证',()=>{
  checkSources(4);
  const row=rows.find(x=>x.effect===4);
  const {after}=actual(row);assert.deepEqual(observedStages.get(after),[0,0,2,0,1,1]);
  assert.deepEqual(vector(after),[0,0,2,0,4,1]);
  checkSharedBoundaries(rows.find(x=>x.id===3434&&x.move===22560));
});
test('七条原585实际分别授原差异向量或六项各一级，禁强封顶未出招门禁共享验证',()=>{
  checkSources(585);
  const row=rows.find(x=>x.effect===585);
  const {after}=actual(row);assert.deepEqual(vector(after),[1,2,0,2,0,1]);
  checkSharedBoundaries(row);
});
test('三个原516只在4499低于半血时六项加二，4500等于半血加一，完整回血护盾原魂保留',()=>{
  checkSources(516);
  for(const row of rows.filter(x=>x.effect===516))for(const hp of [4499,4500]){
    const after=turn(make(row,'normal',hp),row);
    assert.deepEqual(vector(after),Array(6).fill(hp===4499?2:1),row.key+' '+hp);
  }
  checkSharedBoundaries(rows.find(x=>x.effect===516));
});
test.after(()=>console.log('ROUND97_BOOST_COUNTS '+JSON.stringify({...counts,uniqueOriginalMoves:cache.size,sourceRows:rows.length,noMidBattleWrites:true,noRngReplacement:true,sharedMechanicsNotReauditedPerSource:true})));
