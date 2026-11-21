'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const T=require('../dist/team-engine.js');
const {createRoom}=require('../lan-room.cjs');
const local=require('../local-species.cjs');

const fifth='wiki:31847',attack='wiki:19369',status='wiki:24780',pp='potion:pp';
const entry=/光之惩戒·英卡洛斯 · 光·断罪裁决：击杀盔 \+1 次/;
const consumed=/光之惩戒·英卡洛斯 持有的击杀盔消耗 1 次.*圣甲·盖亚 的破釜沉舟战.*本次攻击技能无效/;
function member(id,overrides={}){
  const snapshot=local.species(id);
  return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:2000,atk:300,def:400,spe:100,...overrides}}};
}
function duel(atk=2000,seed=14){
  const game=T.create([[member(3577,{atk,spe:999}),member(3017)],[member(2988),member(3056),member(2987)]],[0,0],{seed,criticals:false});
  game.battle.fighters[1].hp=900;
  return game;
}
const held=game=>game.battle.fighters[0].counts.opponentAttackInvalid1128??0;
const hits=(game,side)=>(game.battle.damageEvents??[]).filter(e=>e.sourceSide===side&&e.round===game.battle.round-1);

test('红伤击杀由施放者持有，同回合补位的属性招不消费',()=>{
  const game=T.turn(duel(),[fifth,pp]);
  assert.deepEqual(game.pending,[1]);
  assert.deepEqual(hits(game,0).map(e=>[e.type,e.hpLoss]),[['attack',900]]);
  assert.equal(held(game),1);
  assert.ok(E.describeEffects(game.battle.fighters[0],game.battle.round).some(line=>line.includes('自身持有：令当前对手下次攻击技能无效')));
  let out=T.turnWithReplacement(game,[null,1],[pp,status]);
  assert.equal(out.battle.fighters[1].counts.nextAttackInvalid1128,undefined);
  assert.equal(held(out),1);
  assert.ok(out.history.some(line=>entry.test(line)));
  assert.ok(!out.history.some(line=>consumed.test(line)));
  const before=out.battle.fighters[1].pp[attack];
  out=T.turn(out,[pp,attack]);
  assert.equal(held(out),0);
  assert.equal(out.battle.fighters[1].pp[attack],before-1);
  assert.equal(hits(out,1).length,0);
  assert.equal(out.history.filter(line=>consumed.test(line)).length,1);
  out=T.turn(out,[pp,attack]);
  assert.ok(hits(out,1).some(e=>e.type==='attack'&&e.hpLoss>0));
  assert.equal(out.history.filter(line=>consumed.test(line)).length,1);
});

test('同一招后的魂印吸取与百分比追加补刀都只授予一次',()=>{
  for(const [atk,red,label] of [[537,270,'魂印光之惩戒吸取'],[600,301,'魂印光之惩戒追加']]){
    const game=T.turn(duel(atk),[fifth,pp]);
    assert.deepEqual(game.pending,[1]);
    assert.deepEqual(hits(game,0).map(e=>[e.type,e.settledDamage,e.hpLoss]),
      [['attack',red,red],['percent',666,900-red]]);
    assert.ok(game.history.some(line=>line.includes(label)));
    assert.equal(held(game),1);
    const next=T.replace(game,[null,1]);
    assert.equal(next.battle.fighters[1].counts.nextAttackInvalid1128,undefined);
    assert.equal(next.history.filter(line=>entry.test(line)).length,1);
  }
});

test('其他技能击倒不授予，第五命中后当回合异常击倒授予',()=>{
  let game=duel();
  game.battle.fighters[1].hp=10;
  game.battle.fighters[0].stages.acc=6;
  game=T.turn(game,['wiki:31845',pp]);
  assert.deepEqual(game.pending,[1]);
  assert.equal(held(game),0);
  game=duel(400);
  game.battle.fighters[1].ailments['烧伤']=2;
  game=T.turn(game,[fifth,pp]);
  assert.deepEqual(game.pending,[1]);
  assert.ok(game.history.some(line=>line.includes('烧伤')&&line.includes('损失')));
  assert.equal(held(game),1);
});

test('只记录命中的这一回合，未命中、未死亡及随后一回合的阵亡均不授予',()=>{
  let game=T.turn(duel(400),[fifth,pp]);
  assert.equal(game.phase,'action');
  assert.ok(hits(game,0).some(e=>e.type==='attack'));
  assert.equal(held(game),0);
  game.battle.fighters[1].ailments['烧伤']=3;
  game=T.turn(game,[pp,pp]);
  assert.deepEqual(game.pending,[1]);
  assert.equal(held(game),0);
  game=duel();
  game.battle.fighters[0].effects.skillBlock={start:1,end:1};
  game.battle.fighters[1].hp=20;
  game.battle.fighters[1].ailments['烧伤']=2;
  game=T.turn(game,[fifth,pp]);
  assert.deepEqual(game.pending,[1]);
  assert.ok(game.history.some(line=>line.includes('技能被封锁')));
  assert.equal(hits(game,0).length,0);
  assert.equal(held(game),0);
  game=duel(2000,0);
  game.battle.fighters[0].ailments['失明']=2;
  game.battle.fighters[1].hp=20;
  game.battle.fighters[1].ailments['烧伤']=2;
  game=T.turn(game,[fifth,pp]);
  assert.deepEqual(game.pending,[1]);
  assert.ok(game.history.some(line=>line.includes('因失明失效')));
  assert.equal(held(game),0);
});

test('对手再换人依旧受击杀盔约束，施放者换下即清除',()=>{
  const won=T.turn(duel(),[fifth,pp]);
  let moved=T.turnWithReplacement(won,[null,1],[pp,pp]);
  moved=T.turn(moved,[pp,{switchTo:2}]);
  assert.equal(held(moved),1);
  const key=moved.battle.fighters[1].moves.find(k=>moved.battle.moveDefinitions[k].kind==='physical');
  moved=T.turn(moved,[pp,key]);
  assert.equal(held(moved),0);
  assert.equal(hits(moved,1).length,0);
  let off=T.turnWithReplacement(won,[null,1],[{switchTo:1},attack]);
  assert.ok(hits(off,1).some(e=>e.type==='attack'));
  off=T.turn(off,[{switchTo:0},pp]);
  assert.equal(held(off),0);
});

test('独立联机房间从补位提交第五，替补登场即消耗仍保留两条日志',()=>{
  const room=createRoom();
  function add(side,id,overrides={}){
    room.mutate(side,{op:'add',edit:room.view(side).edit,member:{id,moves:E.WIKI.defaultMoves(local.species(id)),build:{overrides}}});
  }
  function lock(side,key,target=null){
    const {matchId,epoch}=room.view(side);
    room.mutate(side,{op:'lock',matchId,epoch,key,target});
  }
  add(0,2988,{maxHp:1200,atk:9999,spe:100});add(0,3056,{maxHp:9000,atk:500});
  add(1,3017,{maxHp:20,def:1,spe:1});add(1,3577,{maxHp:9000,atk:9999,spe:9999});
  for(const side of [0,1])room.mutate(side,{op:'ready',edit:room.view(side).edit});
  lock(1,pp);lock(0,'wiki:19123');
  assert.equal(room.view(1).phase,'replace');
  lock(1,fifth,1);lock(0,pp);
  assert.equal(room.view(0).phase,'replace');
  assert.ok(room.view(0).fighters[1].effects.some(line=>line.includes('自身持有：令当前对手下次攻击技能无效')));
  lock(0,attack,1);lock(1,pp);
  const history=room.view(0).history;
  const grantAt=history.findIndex(line=>entry.test(line)),consumeAt=history.findIndex(line=>consumed.test(line));
  assert.ok(grantAt>=0&&consumeAt>grantAt);
  assert.deepEqual(room.view(1).history,history);
});
