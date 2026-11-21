'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),local=require('../local-species.cjs');
const {createRoom}=require('../lan-room.cjs');
function add(room,side,id,overrides={}){
  const member={id,moves:E.WIKI.defaultMoves(local.species(id)),build:{overrides}};
  room.mutate(side,{op:'add',edit:room.view(side).edit,member});
}
function ready(room){for(const side of [0,1])room.mutate(side,{op:'ready',edit:room.view(side).edit});}
function lock(room,side,key,target=null){
  room.mutate(side,{op:'lock',matchId:room.view(side).matchId,epoch:room.view(side).epoch,key,target});
}
for(const fallen of [0,1])test('私下锁定补位与行动，阵亡方 '+fallen,()=>{
  const room=createRoom(),other=1-fallen;
  add(room,fallen,2988,{maxHp:20,def:1,spe:1});add(room,fallen,3056);add(room,fallen,3291);
  add(room,other,2988,{atk:9999,spe:9999});ready(room);
  lock(room,fallen,'potion:pp');lock(room,other,'wiki:19123');
  const observed=structuredClone(room.view(other)),mine=room.view(fallen);
  assert.equal(mine.phase,'replace');assert.equal(mine.options.length,2);
  lock(room,fallen,'wiki:25295',2);
  assert.deepEqual(room.view(other),{...observed,locked:[fallen===0,fallen===1]});
  assert.throws(()=>lock(room,fallen,'wiki:24780',1));
  lock(room,other,'potion:hp');
  const result=room.view(other);assert.equal(result.epoch,2);
  assert.equal(result.fighters[fallen].name,mine.options[1].name);
  assert.deepEqual(result.history,room.view(fallen).history);
  assert.throws(()=>room.mutate(other,{op:'lock',epoch:1,key:'potion:hp',target:null}));
});
test('1v1 技能分支、药剂按服务端行动列表校验',()=>{
  const room=createRoom();add(room,0,20001);add(room,1,2988);ready(room);
  const actions=room.view(0).options[0].actions,forms=actions.filter(x=>x.key.startsWith('sp-mars-fifth:'));
  assert.ok(forms.length>=2);
  assert.throws(()=>lock(room,0,'sp-mars-fifth:invalid'));assert.throws(()=>lock(room,0,'switch/1'));
  lock(room,0,forms[0].key);lock(room,1,'potion:pp');assert.equal(room.view(0).epoch,1);
});
test('六只组队、首发、主动换宠及席位恢复',()=>{
  const room=createRoom(),session='a'.repeat(48);room.claim(room.invites[0],session);
  room.claim(room.invites[0],session);assert.equal(room.seat(session),0);
  assert.throws(()=>room.claim(room.invites[0],'b'.repeat(48)));
  assert.throws(()=>room.claim(room.invites[1],session));
  for(const id of [2988,3056,3291,3102,3311,3393])add(room,0,id);
  assert.throws(()=>add(room,0,2987));
  assert.throws(()=>room.mutate(0,{op:'ready',side:1,edit:6}));
  room.mutate(0,{op:'lead',edit:6,index:2});add(room,1,2988);ready(room);
  lock(room,0,'switch/0');lock(room,1,'potion:hp');
  assert.equal(room.view(1).fighters[0].name,local.species(2988).name);
});

function ticket(room){const {epoch,matchId}=room.view(0);return {epoch,matchId};}
for(const quitter of [0,1])test('第11回合投降、双提交隔离与重开配置 · '+'AB'[quitter],()=>{
  const room=createRoom(),act=(side,op,t=ticket(room))=>room.mutate(side,{...t,op});
  assert.throws(()=>act(quitter,'surrender'));
  add(room,0,3056);add(room,0,2988,{maxHp:9999,atk:9999,spe:9999});
  room.mutate(0,{op:'lead',edit:2,index:1});
  add(room,1,2988,{maxHp:9000});ready(room);
  const first=room.view(0),firstTicket=ticket(room);
  for(let round=1;round<=10;round++){
    assert.equal(room.view(0).round,round);
    assert.throws(()=>act(quitter,'surrender'));
    lock(room,0,'potion:hp');lock(room,1,'potion:pp');
  }
  assert.equal(room.view(0).round,11);
  lock(room,1-quitter,'potion:hp');
  const lastTicket=ticket(room);act(quitter,'surrender',lastTicket);
  const end=room.view(0);assert.equal(end.winner,1-quitter);assert.equal(end.phase,'finished');
  assert.equal(end.round,11);assert.deepEqual(end.locked,[false,false]);
  assert.equal(end.finishReason,'AB'[quitter]+' 方投降');assert.deepEqual(end.history,room.view(1).history);
  assert.throws(()=>act(1-quitter,'surrender',lastTicket));assert.throws(()=>act(quitter,'surrender'));
  for(const op of ['rematch','lobby'])assert.throws(()=>act(1,op));
  const endTicket=ticket(room);act(0,'rematch');
  const fresh=room.view(0);assert.equal(fresh.matchId,first.matchId+1);assert.equal(fresh.round,1);
  assert.deepEqual(fresh.fighters,first.fighters);assert.deepEqual(fresh.bench,first.bench);
  assert.deepEqual(fresh.panels[0].skills,first.panels[0].skills);
  assert.deepEqual(fresh.history,first.history);assert.equal(fresh.finishReason,null);
  assert.throws(()=>act(0,'lobby',endTicket));assert.throws(()=>act(0,'rematch',endTicket));
  assert.throws(()=>room.mutate(0,{...firstTicket,op:'lock',key:'potion:pp',target:null}));
  assert.deepEqual(room.view(0).locked,[false,false]);
});
test('自然终局：保留席位配置重开，再回组队解除准备',()=>{
  const room=createRoom();add(room,0,2988,{atk:9999,spe:9999});add(room,1,2988,{maxHp:10,def:1,spe:1});
  const original=room.view(1).team;ready(room);
  for(const op of ['rematch','lobby']){
    const before=room.view(0);assert.equal(before.round,1);
    lock(room,1,'potion:hp');lock(room,0,'wiki:19123');assert.equal(room.view(0).phase,'finished');
    assert.throws(()=>room.mutate(1,{...ticket(room),op}));
    room.mutate(0,{...ticket(room),op});
  }
  const lobby=room.view(1);assert.deepEqual(lobby.team,original);assert.deepEqual(lobby.ready,[false,false]);
  assert.deepEqual(lobby.locked,[false,false]);assert.throws(()=>room.mutate(1,{op:'ready',edit:1}));
  room.mutate(1,{op:'remove',edit:lobby.edit,index:0});add(room,1,3056);ready(room);
  assert.equal(room.view(1).fighters[1].name,local.species(3056).name);
});

test('第11回合私下锁定替补后投降，不触发补位，重开恢复原首发',()=>{
  const room=createRoom();
  add(room,0,2988,{atk:9999,spe:9999});add(room,1,2988,{maxHp:20,def:1,spe:1});add(room,1,3056);ready(room);
  const original=room.view(1);
  for(let n=1;n<=10;n++){lock(room,0,n===10?'wiki:19123':'potion:pp');lock(room,1,'potion:pp');}
  const pending=room.view(1);assert.equal(pending.round,11);assert.equal(pending.phase,'replace');
  lock(room,1,'potion:pp',1);
  room.mutate(1,{...ticket(room),op:'surrender'});
  const finished=room.view(0);assert.equal(finished.winner,0);
  assert.deepEqual(finished.history.slice(0,-1),pending.history);
  assert.deepEqual(finished.locked,[false,false]);assert.deepEqual(finished.previews,{});
  room.mutate(0,{...ticket(room),op:'rematch'});const fresh=room.view(1);
  assert.equal(fresh.phase,'action');assert.equal(fresh.round,1);assert.equal(fresh.ownTarget,null);
  assert.deepEqual(fresh.fighters,original.fighters);assert.deepEqual(fresh.history,original.history);
});
