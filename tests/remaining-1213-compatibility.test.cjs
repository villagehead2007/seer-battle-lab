'use strict';const test=require('node:test'),assert=require('node:assert/strict'),path=require('path'),root=process.cwd(),H=require(path.join(root,'tests/helpers/remaining-4940.cjs')),{E,source,make,turn,timer,key,sum}=H;const raw=source.moves.find(m=>m.id===37732),slot=raw.effectInstances.findIndex(e=>e.id===1213),effectKey='用招附加最大体力粉伤';
function grant(){const s=make({move:37732,index:slot,hp:1000,aStats:{maxHp:6000}});turn(s,37732,20309);assert.equal(s.fighters[0].stats.maxHp,6000);assert.equal(sum(s,'percent'),2250);assert.deepEqual(s.fighters[0].effects[effectKey].actualUseSource1213,{effectId:1213,moveId:37732,hash:'df2bd956',index:1,args:[2,4]});s.moveDefinitions[key(38516)].operations=[];s.fighters[1].hp=9000;return s;}
test('1213正式兼容：4940真实来源保留正常、免攻零伤、封命中、MISS及整招无效的实际用招，控制药剂不触发且到期',()=>{for(const mode of ['normal','immune','hit-block','miss','invalid','control','potion']){const s=grant(),m=s.moveDefinitions[key(38516)],pp=s.fighters[0].pp[key(38516)];if(mode==='immune')s.fighters[1].counts.attackNullify=1;if(mode==='hit-block')timer(s,0,'技能命中效果失效');if(mode==='miss'){delete s.fighters[0].effects['攻击必中'];m.alwaysHit=false;m.accuracy=0;}if(mode==='invalid')timer(s,0,'skillBlock');if(mode==='control')s.fighters[0].ailments['疲惫']=3;if(mode==='potion')turn(s,null,20309);else turn(s,38516,20309);assert.equal(sum(s,'percent'),['control','potion'].includes(mode)?0:2250,mode);assert.equal(s.fighters[0].pp[key(38516)],pp-(['control','potion'].includes(mode)?0:1),mode);delete s.fighters[0].ailments['疲惫'];delete s.fighters[0].effects.skillBlock;delete s.fighters[0].effects['技能命中效果失效'];m.alwaysHit=true;m.accuracy=100;s.fighters[1].hp=9000;turn(s,38516,20309);assert.equal(sum(s,'percent'),0,mode+' expires');}});
test('1213同源重授刷新两回合，3667重授更新来源和四回合系数，持续附伤按实际用招',()=>{
 const s=grant();
 turn(s,37732,20309);
 assert.equal(sum(s,'percent'),2250);
 assert.equal(s.fighters[0].effects[effectKey].end,3);
 s.fighters[1].hp=9000;
 turn(s,38516,20309);
 assert.equal(sum(s,'percent'),2250);
 s.fighters[1].hp=9000;
 turn(s,38516,20309);
 assert.equal(sum(s,'percent'),0);
 const q=grant(),legacy=require(path.join(root,'data/species/3667.json')).snapshot;
 const move=legacy.moves.find(candidate=>candidate.id===26259);
 const compiled=E.WIKI.effectsEngine.compileInstances(move.effectInstances,legacy.effects,move);
 assert.equal(move.hash,'76c14d50');
 assert.equal(compiled.issue,'');
 const operation=compiled.operations.find(candidate=>candidate.effectId===1213);
 assert.deepEqual(operation.sourceArgs,[4,3]);
 E.WIKI.effectsEngine.run('afterHit',[operation],{
  a:q.fighters[0],t:q.fighters[1],m:move,round:q.round,
  timed(fighter,effect,turns,data,start=q.round){fighter.effects[effect]={start,end:start+turns-1,...data};}
 });
 const effect=q.fighters[0].effects[effectKey];
 assert.equal(effect.actualUseSource1213,undefined);
 assert.equal(effect.fraction,1/3);
 assert.equal(effect.end,q.round+3);
 for(const mode of ['hit-block','miss','invalid','normal']){
  q.fighters[1].hp=9000;
  const attacker=q.fighters[0],attack=q.moveDefinitions[key(38516)];
  delete attacker.effects['技能命中效果失效'];
  delete attacker.effects.skillBlock;
  delete attacker.effects['攻击必中'];
  attack.alwaysHit=mode!=='miss';
  attack.accuracy=mode==='miss'?0:100;
  if(mode==='hit-block')timer(q,0,'技能命中效果失效');
  if(mode==='invalid')timer(q,0,'skillBlock');
  const pp=attacker.pp[key(38516)];
  turn(q,38516,20309);
  assert.equal(q.fighters[0].pp[key(38516)],pp-1,mode);
  assert.equal(sum(q,'percent'),3000,mode);
 }
 q.fighters[1].hp=9000;
 turn(q,38516,20309);
 assert.equal(sum(q,'percent'),0);
});
test('1213正式兼容：4940真实ID版本索引参数严格校验，已答来源允许存储且错误仍拒绝，只读验证不改本地快照',()=>{const compile=m=>E.WIKI.effectsEngine.compileInstances(m.effectInstances,source.effects,m);assert.equal(compile(raw).issue,'');for(const mutate of [m=>m.hash='00000000',m=>m.revision='seerapi:00000000',m=>m.effectInstances[slot].args=[3,4],m=>m.effectInstances[slot].args=[2,3],m=>m.effectInstances.unshift(m.effectInstances.splice(slot,1)[0])]){const m=structuredClone(raw);mutate(m);assert.notEqual(compile(m).issue,'');}assert.deepEqual(raw.effectInstances[slot].args,[2,4]);const store=require(path.join(root,'local-species.cjs'));assert.deepEqual(store.issues(source),[]);const bad=structuredClone(source);bad.moves.find(m=>m.id===37732).effectInstances[slot].args=[3,4];assert.ok(store.issues(bad).length>0);});
