'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const store=require('../local-species.cjs'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js');
function member(id,stats={}){
  const snapshot=store.species(id);
  return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:4000,...stats}}};
}
const potion='potion:pp';
test('队伍人数与编号边界；双方可用同种、各自配招和指定首发',()=>{
  const six=[2987,2988,3056,3311,3291,3575].map(id=>member(id));
  const game=T.create([six,[member(3311)]],[3,0]);
  assert.deepEqual(game.battle.fighters.map(f=>Number(f.number)),[3311,3311]);
  assert.deepEqual(T.candidates(game,0),[0,1,2,4,5]);
  assert.deepEqual(T.candidates(game,1),[]);
  for(const invalid of [[],[...six,member(4509)],[six[0],six[0]]])assert.throws(()=>T.create([invalid,[six[0]]]));
});
test('中切先于攻击；退场清能力异常和技能效果；HP及PP随成员保存',()=>{
  const g=T.create([[member(2988),member(3056)],[member(2988)]]);
  const old=g.battle.fighters[0];old.hp-=200;old.pp[old.moves[0]]--;old.stages.atk=2;
  old.ailments['烧伤']=3;old.effects.测试免异={start:1,end:2};
  const foe=g.battle.fighters[1],attack=foe.moves[0];
  const switched=T.turn(g,[{switchTo:1},attack]),bench=switched.slots[0][0].fighter;
  assert.equal(bench.hp,old.hp);assert.deepEqual(bench.pp,old.pp);assert.equal(bench.stages.atk,0);
  assert.deepEqual(bench.effects,{});assert.deepEqual(bench.ailments,{});
  assert.ok(switched.battle.fighters[0].hp<4000);
  assert.equal(switched.battle.fighters[1].pp[attack],foe.pp[attack]-1);
  assert.equal(switched.battle.round,2);
  const back=T.turn(switched,[{switchTo:0},potion]);assert.equal(back.battle.fighters[0].hp,old.hp);
  assert.equal(back.battle.fighters[0].pp[old.moves[0]],old.pp[old.moves[0]]);
  old.ailments['凝滞']=2;assert.deepEqual(T.candidates(g,0),[]);
  assert.throws(()=>T.turn(g,[{switchTo:1},attack]));assert.equal(g.battle.round,1);
});
test('双方中切新成员参加回合开始，按新速度登场，同速由种子复现',()=>{
  function run(seed,speed){
    const g=T.create([[member(3056),member(3291,{spe:speed})],[member(2988),member(2987,{spe:400})]],[0,0],{seed});
    const h=T.turn(g,[{switchTo:1},{switchTo:1}]);
    assert.deepEqual(h.active,[1,1]);assert.equal(h.battle.round,2);
    assert.ok(h.battle.fighters.every(f=>f.soulState.roundStartSoulResolved===1));
    assert.ok(h.battle.fighters.every(f=>f.moves.every(m=>f.pp[m]===h.battle.moveDefinitions[m].pp)));
    return h.history.filter(line=>line.endsWith(' 登场。')).slice(-2);
  }
  assert.match(run('快慢',800)[0],/瀚宇星皇/);assert.match(run('快慢',200)[0],/重生之翼/);
  assert.deepEqual(run('同速',400),run('同速',400));
});
test('先手击败取消原行动、跳过回合末；死切不推进；后手击败照常回合末',()=>{
  for(const late of [false,true]){
    const target=member(2988,{maxHp:20,def:1,spe:late?9999:1});
    if(late&&!target.moves.includes(20369))target.moves[1]=20369;
    const g=T.create([[member(2988,{atk:9999,spe:late?1:9999})],[target,member(3056)]]);
    const [a,b]=g.battle.fighters;a.hp=1000;
    a.effects['每回合强化']={start:1,end:2,stages:[1,0,0,0,0,0]};
    const attack='wiki:19123',reply=late?'wiki:20369':'wiki:19123';
    const out=T.turn(g,[attack,reply]);
    assert.equal(out.phase,'replace');assert.equal(out.battle.fighters[1].hp,0);
    assert.equal(out.battle.turns[0].first,late?1:0);
    assert.equal(out.history.some(line=>line.includes('跳过本回合结束阶段')),!late);
    assert.equal(out.battle.fighters[0].stages.atk,late?1:0);
    if(!late)assert.equal(out.battle.fighters[1].pp[reply],b.pp[reply]);
    assert.throws(()=>T.turn(out,[potion,potion]));
    const next=T.replace(out,[null,1]);assert.equal(next.battle.round,2);assert.equal(next.phase,'action');
    assert.equal(T.turn(next,[potion,potion]).battle.round,3);
  }
});
test('最后成员阵亡结束对战，无法再次提交或补位',()=>{
  const g=T.create([[member(2988,{atk:9999,spe:9999})],[member(2988,{maxHp:20,def:1,spe:1})]]);
  const h=T.turn(g,g.battle.fighters.map(f=>f.moves[0]));
  assert.equal(h.phase,'finished');assert.equal(h.battle.winner,0);
  assert.throws(()=>T.replace(h,[null,0]));assert.throws(()=>T.turn(h,[potion,potion]));
});

test('同一回合末双方被烧伤击倒，第一只倒下者负；双方有替补时共同补位',()=>{
  for(const benches of [false,true]){
    const roster=()=>benches?[member(2988),member(3056)]:[member(2988)];
    const g=T.create([roster(),roster()]);
    for(const f of g.battle.fighters){f.hp=1;f.ailments['烧伤']=2;}
    const h=T.turn(g,[potion,potion]);
    assert.deepEqual(h.battle.fighters.map(f=>f.hp),[0,0]);
    assert.deepEqual(h.battle.teamDeathOrder,[0,1]);
    if(!benches){assert.equal(h.phase,'finished');assert.equal(h.battle.winner,1);continue;}
    assert.deepEqual(h.pending,[0,1]);
    assert.throws(()=>T.replace(h,[1,null]));
    const next=T.replace(h,[1,1]);assert.equal(next.battle.round,2);
    assert.deepEqual(next.battle.fighters.map(f=>f.name),['圣甲·盖亚','圣甲·盖亚']);
  }
});
test('临终反击按魂印保1，交换攻守时胜者也随之改变',()=>{
  for(const attacker of [0,1]){
    const pair=[member(2988,{maxHp:50,atk:9999,spe:9999}),member(3056,{maxHp:60,def:1,spe:1})];
    if(attacker===1)pair.reverse();
    const g=T.create(pair.map(m=>[m]));
    const h=T.turn(g,g.battle.fighters.map(f=>f.moves[0]));
    assert.equal(h.battle.fighters[attacker].hp,0);assert.equal(h.battle.fighters[1-attacker].hp,1);
    assert.equal(h.battle.winner,1-attacker);
  }
});
test('已有次回合复活先于替补判定，原成员复活后正常行动',()=>{
  const g=T.create([[member(2988,{atk:9999,spe:9999})],[member(4384,{maxHp:20,def:1,spe:1}),member(3056)]]);
  const h=T.turn(g,g.battle.fighters.map(f=>f.moves[0]));
  assert.equal(h.battle.fighters[1].hp,0);assert.equal(h.phase,'action');
  assert.equal(h.battle.fighters[1].soulState.kingRevivalRound,2);
  assert.deepEqual(T.candidates(h,1),[]);
  const next=T.turn(h,[potion,potion]);
  assert.equal(next.active[1],0);assert.ok(next.battle.fighters[1].hp>0);
});

test('先手终末之光只有自爆方阵亡，对方不出招不扣PP，跳过回合末再补位',()=>{
  const bomber=member(3383,{spe:9999}),id=30819;
  if(!bomber.moves.includes(id))bomber.moves[bomber.moves.length-1]=id;
  const game=T.create([[bomber,member(3056)],[member(2988,{spe:1})]]);
  const enemy=game.battle.fighters[1],reply='wiki:19123';
  enemy.effects['每回合强化']={start:1,end:2,stages:[1,0,0,0,0,0]};
  const h=T.turn(game,['wiki:'+id,reply]);
  assert.deepEqual(h.pending,[0]);assert.deepEqual(h.battle.fighters.map(f=>f.hp),[0,1]);
  assert.equal(h.battle.fighters[1].pp[reply],enemy.pp[reply]);
  assert.equal(h.battle.fighters[1].stages.atk,0);
  assert.ok(h.history.some(text=>text.includes('跳过本回合结束阶段')));
  const next=T.replace(h,[1,null]);assert.equal(next.battle.round,2);assert.equal(next.phase,'action');
});
