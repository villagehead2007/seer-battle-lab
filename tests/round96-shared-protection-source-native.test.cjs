'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),L=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
const rows=require('../research/TEAM-STAGE-2/round96-protection-native-input-20261113.json');
const cache=new Map(),counts={creations:0,turns:0,zeroPpRejections:0};
const effectName=id=>({191:'reflect',48:'免异常',47:'免弱'})[id];
function make(row,mode='normal',enemyId=2989,enemyMove=null){
  const source=L.species(row.id),enemy=L.species(enemyId),stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000};
  const s=E.createBattle({wikiSnapshots:[source,enemy],wikiLoadouts:[row.moves,loadout(enemy,enemyMove?[enemyMove]:[])],builds:[{overrides:stats},{overrides:{...stats,spe:100}}],seed:14,criticals:false});counts.creations++;
  const a=s.fighters[0];a.hp=5000;a.stages.acc=6;s.fighters[1].stages.acc=6;
  if(mode==='invalid')a.effects.skillBlock={start:1,end:1};
  if(mode==='control')a.ailments.疲惫=2;
  if(mode==='zero')a.pp['wiki:'+row.move]=0;
  assert.equal(a.soulId,row.soul);assert.deepEqual(a.moves,row.moves.map(id=>'wiki:'+id));
  return s;
}
function turn(s,row,mode='normal',enemyAction='potion:pp'){
  counts.turns++;
  return E.resolveTurn(s,[mode==='potion'?'potion:pp':'wiki:'+row.move,enemyAction]);
}
function actual(row){
  const key=row.id+':'+row.move;
  if(!cache.has(key)){
    const before=make(row),pp=before.fighters[0].pp['wiki:'+row.move];
    cache.set(key,{before,after:turn(before,row),pp});
  }
  return cache.get(key);
}
function checkSources(effect){
  for(const row of rows.filter(x=>x.effect===effect)){
    const {after,pp}=actual(row),f=after.fighters[0],grant=f.effects[effectName(effect)];
    assert.deepEqual([grant?.start,grant?.end],[1,row.duration],row.key);
    assert.equal(f.pp['wiki:'+row.move],pp-1,row.key);
    const op=after.moveDefinitions['wiki:'+row.move].operations.find(o=>Number(o.effectId)===effect&&o.index===row.index);
    assert.deepEqual(op.sourceArgs,[row.duration],row.key);
  }
}
function checkNoUse(row){
  for(const mode of ['invalid','control','potion','zero']){
    const before=make(row,mode),pp=before.fighters[0].pp['wiki:'+row.move];
    if(mode==='zero'){
      const original=structuredClone(before);
      assert.throws(()=>E.resolveTurn(before,['wiki:'+row.move,'potion:pp']),/请选择|有 PP/);
      assert.deepEqual(before,original);counts.zeroPpRejections++;continue;
    }
    const after=turn(before,row,mode);
    assert.equal(after.fighters[0].effects[effectName(row.effect)],undefined,mode+' '+row.key);
    assert.equal(after.fighters[0].pp['wiki:'+row.move],pp-(mode==='invalid'?1:0),mode+' '+row.key);
  }
}
test('十二个原191按各源4或5回合实际授反弹，原波塞冬完整用招反射真实雷祭，未实际用招不授',()=>{
  checkSources(191);
  const row=rows.find(x=>x.id===3506&&x.move===24636&&x.effect===191);
  let s=make(row,'normal',3079,20085);s=turn(s,row,'normal','wiki:20085');
  assert.equal(s.fighters[0].ailments.麻痹,undefined);
  assert.ok(s.fighters[1].ailments.麻痹>=1);
  assert.ok(!s.turns.at(-1).events.some(e=>e.text.includes('技能未命中')));
  assert.equal(s.fighters[1].pp['wiki:20085'],s.moveDefinitions['wiki:20085'].pp-1);
  checkNoUse(row);
});
test('九个原48按3至5回合实际授免异，原天剑真正挡雷祭且无反弹，未实际用招不授',()=>{
  checkSources(48);
  const row=rows.find(x=>x.id===3318&&x.move===23873&&x.effect===48);
  let s=make(row,'normal',3576,20085);s=turn(s,row,'normal','wiki:20085');
  assert.equal(s.fighters[0].ailments.麻痹,undefined);
  assert.equal(s.fighters[1].ailments.麻痹,undefined);
  assert.ok(!s.turns.at(-1).events.some(e=>e.text.includes('技能未命中')));
  assert.equal(s.fighters[1].pp['wiki:20085'],s.moveDefinitions['wiki:20085'].pp-1);
  checkNoUse(row);
});
test('八个原47按4或5回合实际授免弱，原格莱奥完整用招挡无力光线，未实际用招不授',()=>{
  checkSources(47);
  const row=rows.find(x=>x.id===3529&&x.move===25111&&x.effect===47);
  let s=make(row,'normal',2989,20241);s=turn(s,row,'normal','wiki:20241');
  assert.equal(s.fighters[0].stages.atk,0);
  assert.ok(!s.turns.at(-1).events.some(e=>e.text.includes('技能未命中')));
  assert.equal(s.fighters[1].pp['wiki:20241'],s.moveDefinitions['wiki:20241'].pp-1);
  checkNoUse(row);
});
test.after(()=>console.log('ROUND96_PROTECTION_COUNTS '+JSON.stringify({...counts,uniqueOriginalMoves:cache.size,sourceRows:rows.length,noMidBattleWrites:true,noRngReplacement:true,sharedMechanicsNotReauditedPerSource:true})));
