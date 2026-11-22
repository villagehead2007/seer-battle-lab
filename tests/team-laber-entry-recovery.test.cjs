'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,soul,skill){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;const moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('两版哀拉伯克真实返场重建PP名单，药剂恢复不移除名单，第二回合封附效而第三回合恢复',()=>{
 for(const soul of [1559,1851]){
  let g=T.create([[member(2988),member(4333,soul)],[member(3056,null,20117)]],[0,0],{seed:13,criticals:false});
  g.battle.fighters[1].pp['wiki:20117']=soul===1559?0:1;
  for(let entry=0;entry<2;entry++){
   const round=g.battle.round;g=T.turn(g,[{switchTo:1},'potion:pp']);
   const state=g.battle.fighters[0].soulState.laberEntry;
   assert.equal(state.round,round);assert.equal(state.blocked.includes('wiki:20117'),entry===0);
   const displayed=D.fighter(g.battle.fighters[0],g.battle.round,g.battle.moveDefinitions).items.find(x=>x.name==='入场附效封锁');if(entry===0)assert.match(displayed.value,/余 1 回合/);else assert.equal(displayed,undefined);
   assert.equal(g.battle.fighters[1].pp['wiki:20117'],g.battle.moveDefinitions['wiki:20117'].pp);
   g=T.turn(g,['potion:pp','wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,entry===0?0:2);
   g=T.turn(g,['potion:pp','wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,entry===0?1:3);
   assert.equal(D.fighter(g.battle.fighters[0],g.battle.round).items.find(x=>x.name==='入场附效封锁'),undefined);
   g=T.turn(g,[{switchTo:0},'potion:pp']);
  }
 }
});
test('原拉伯克次元之镜实际抽中攻击只减该招红伤，抽中属性回复三分一且清槽授两次必暴',()=>{
 const outcomes=new Set();
 for(let seed=1;seed<=24&&outcomes.size<2;seed++){
  const target=member(3056,null,20117);if(!target.moves.includes(10127))target.moves[2]=10127;
  let g=T.create([[member(4333,1559)],[member(2988),target]],[0,0],{seed,criticals:false});g.battle.fighters[0].hp=3000;
  const round=g.battle.round;g=T.turn(g,['potion:pp',{switchTo:1}]);
  const f=g.battle.fighters[1],cleared=f.moves.filter(k=>f.pp[k]===0);assert.equal(cleared.length,1);assert.equal(g.battle.fighters[0].counts.nextCrit,2);
  const key=cleared[0],kind=g.battle.moveDefinitions[key].kind;outcomes.add(kind==='status'?'status':'attack');
  if(kind==='status'){assert.equal(g.battle.fighters[0].hp,6000);assert.equal(f.effects['次元之镜攻击减伤'],undefined);continue;}
  assert.equal(g.battle.fighters[0].hp,3000);assert.deepEqual(f.effects['次元之镜攻击减伤'],{start:round+1,end:round+2,move:key});
  g=T.turn(g,['potion:pp','potion:pp']);
  const control=structuredClone(g);delete control.battle.fighters[1].effects['次元之镜攻击减伤'];
  const red=state=>state.battle.damageEvents.filter(e=>e.round===g.battle.round&&e.sourceSide===1&&e.type==='attack').reduce((sum,e)=>sum+e.settledDamage,0);
  const reduced=T.turn(g,['potion:pp',key]),normal=T.turn(control,['potion:pp',key]);assert.ok(red(normal)>0);assert.ok(Math.abs(red(reduced)-red(normal)*.5)<=2);
  const other=g.battle.fighters[1].moves.find(k=>k!==key&&['physical','special'].includes(g.battle.moveDefinitions[k].kind));
  if(other)assert.equal(red(T.turn(g,['potion:pp',other])),red(T.turn(control,['potion:pp',other])));
  assert.match(D.fighter(g.battle.fighters[1],g.battle.round,g.battle.moveDefinitions).items.find(x=>x.name==='次元之镜 · 指定攻击减伤').value,/攻击伤害 -50%/);
 }
 assert.deepEqual([...outcomes].sort(),['attack','status']);
});
test('两版哀拉伯克入场时PP高于各自阈值不列名单，真实强化技能正常命中',()=>{
 for(const soul of [1559,1851]){
  let g=T.create([[member(2988),member(4333,soul)],[member(3056,null,20117)]],[0,0],{seed:13,criticals:false});
  const key='wiki:20117',max=g.battle.moveDefinitions[key].pp;
  g.battle.fighters[1].pp[key]=soul===1559?1:Math.ceil(max/3)+1;
  g=T.turn(g,[{switchTo:1},'potion:pp']);assert.ok(!g.battle.fighters[0].soulState.laberEntry.blocked.includes(key));
  g=T.turn(g,['potion:pp',key]);assert.equal(g.battle.fighters[1].stages.atk,1);
 }
});
test('两版哀拉伯克遇真实继任者PP保护不清槽不触镜分支，仍授两次必暴并由两次实际攻击消费',()=>{
 for(const soul of [1559,1851]){
  let g=T.create([[member(4333,soul)],[member(2988),member(3056,null,20117)]],[0,0],{seed:13,criticals:false});
  g.battle.fighters[0].counts.nextCrit=0;g.battle.fighters[0].hp=3000;
  g.slots[1][1].fighter.effects['PP保护']={start:1,end:10};
  g=T.turn(g,['potion:pp',{switchTo:1}]);const f=g.battle.fighters[1];
  assert.ok(f.moves.every(key=>f.pp[key]===g.battle.moveDefinitions[key].pp));
  assert.equal(f.effects['次元之镜攻击减伤'],undefined);assert.equal(g.battle.fighters[0].hp,3000);assert.equal(g.battle.fighters[0].counts.nextCrit,2);
  const hit=g.battle.fighters[0].moves.find(key=>g.battle.moveDefinitions[key].power>0);
  for(const remaining of [1,0]){
   const round=g.battle.round;g=T.turn(g,[hit,'potion:pp']);assert.equal(g.battle.fighters[0].counts.nextCrit,remaining);
   assert.match(g.battle.turns.at(-1).events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack')?.detail??'',/暴击 (?:1\.5|2)/);
   assert.ok(g.battle.damageEvents.some(e=>e.round===round&&e.sourceSide===0&&e.type==='attack'&&e.hpLoss>0));
  }
 }
});
