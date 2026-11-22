'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:2000,spd:2000}}};}
test('嬴政旧玺真实下场清零，返场仅按上回合敌主动换宠授四或二方',()=>{
 for(const prior of [false,true]){
  let g=T.create([[member(4468),member(2987)],[member(3056),member(2988)]],[0,0],{seed:14,criticals:false});assert.equal(g.battle.fighters[0].soulState.yongchang,2);
  g=T.turn(g,[{switchTo:1},prior?{switchTo:1}:'potion:pp']);assert.equal(g.slots[0][0].fighter.soulState.yongchang??0,0,'old unannotated seals reset');g=T.turn(g,[{switchTo:0},prior?'potion:pp':{switchTo:1}]);
  assert.equal(g.battle.fighters[0].soulState.emperorRoundSeals,prior?4:2);assert.ok(!g.battle.fighters[1].ailments['臣服']);assert.deepEqual(T.candidates(g,1),[0]);
 }
 let g=T.create([[member(2987),member(4468)],[member(3056)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['potion:pp','potion:pp']);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.emperorRoundSeals,2);assert.ok(g.battle.fighters[1].ailments['臣服']>=g.battle.round-1);
});
test('嬴政第五已用资格按每场一次保留，未注明保留的冻结与延迟代价随真实下场清除',()=>{
 let g=T.create([[member(4468),member(2987)],[member(3056)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:36392','potion:pp']);assert.equal(g.battle.fighters[0].soulState.emperorFifthUsed,true);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.soulState.emperorFreezeRemaining,undefined,'unannotated temporary freeze not retained');for(let i=0;i<3;i++)g=T.turn(g,['potion:pp','potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);
 assert.ok(!E.availableMoves(g.battle.fighters[0],g.battle.round).includes('wiki:36392'));assert.equal(g.battle.fighters[0].soulState.emperorFreezeEnd,undefined);
 const before=structuredClone(g),items=D.fighter(g.battle.fighters[0],g.battle.round).items;assert.match(items.find(x=>x.name==='八方无人来朝资格').value,/本场已成功使用/);assert.equal(items.find(x=>x.name==='永昌玺消耗冻结'),undefined);assert.deepEqual(g,before);
 for(let i=0;i<5;i++)g=T.turn(g,['potion:pp','potion:pp']);assert.ok(g.battle.fighters[0].hp>1,'cleared old delayed cost does not fire');assert.ok(Object.values(g.battle.fighters[0].pp).some(n=>n>0));assert.deepEqual(T.candidates(g,0),[1]);
 g=T.turn(g,['potion:hp','potion:pp']);assert.deepEqual(T.candidates(g,0),[1]);
});
test('嬴政第五冻结期间真实击败立即清玺清PP降一体，继任者强制入场后下回合实际禁换一次',()=>{
 const source=member(4468,36383);source.build.overrides.atk=9999;let g=T.create([[source,member(2987)],[member(3056),member(2988)]],[0,0],{seed:14,criticals:false});g.battle.fighters[1].hp=1000;g=T.turn(g,['wiki:36392','potion:pp']);assert.equal(g.phase,'action');assert.ok(g.battle.fighters[1].hp>0&&g.battle.fighters[1].hp<1000);g=T.turn(g,['wiki:36383','potion:pp']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].soulState.yongchang,0);assert.equal(g.battle.fighters[0].hp,1);assert.ok(Object.values(g.battle.fighters[0].pp).every(n=>n===0));g=T.replace(g,[null,1]);assert.deepEqual(T.candidates(g,0),[]);
 const before=structuredClone(g);assert.throws(()=>T.turn(g,[{switchTo:1},'potion:pp']),/不可换入/);assert.deepEqual(g,before);g=T.turn(g,['potion:hp','potion:pp']);assert.deepEqual(T.candidates(g,0),[1]);
});

test('嬴政完整原第五未下场时七回合自然到期仍清PP降一体，仅下一回合禁主动换人',()=>{
 let g=T.create([[member(4468),member(2987)],[member(3056)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:36392','potion:pp']);assert.equal(g.battle.fighters[0].soulState.emperorFreezeEnd,7);for(let i=0;i<5;i++)g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.round,7);assert.ok(g.battle.fighters[0].hp>1);g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[0].hp,1);assert.ok(Object.values(g.battle.fighters[0].pp).every(n=>n===0));assert.deepEqual(T.candidates(g,0),[]);g=T.turn(g,['potion:hp','potion:pp']);assert.deepEqual(T.candidates(g,0),[1]);
});

test('嬴政1678真实积累六方时只封原对手一回合，自己离场后对手可于到期换入', () => {
  const source = member(4468);
  assert.equal(source.snapshot.souls.find(soul => soul.id === 1678).hash, '7b65acca');
  const pp = 'potion:pp';
  const lock = '不能主动切换';
  let battle = T.create([
    [source, member(3102)],
    [member(2989), member(3056)]
  ], [0, 0], {seed: 14, criticals: false});

  for (let seals = 2; seals < 6; seals++) {
    assert.equal(battle.battle.fighters[0].soulState.yongchang, seals);
    assert.deepEqual(T.candidates(battle, 1), [1]);
    battle = T.turn(battle, [pp, pp]);
  }
  assert.equal(battle.battle.round, 5);
  assert.equal(battle.battle.fighters[0].soulState.emperorRoundSeals, 5);
  assert.deepEqual(T.candidates(battle, 1), [1]);

  battle = T.turn(battle, [pp, pp]);
  assert.equal(battle.battle.fighters[0].soulState.emperorRoundSeals, 6);
  assert.equal(battle.battle.fighters[0].effects[lock], undefined);
  assert.deepEqual(battle.battle.fighters[1].effects[lock], {start: 6, end: 6});
  assert.deepEqual(T.candidates(battle, 0), [1]);
  assert.throws(() => T.turn(battle, [pp, {switchTo: 1}]), /不可换入/);

  battle = T.turn(battle, [{switchTo: 1}, pp]);
  assert.deepEqual(battle.active, [1, 0]);
  battle = T.turn(battle, [pp, {switchTo: 1}]);
  assert.deepEqual(battle.active, [1, 1]);
  assert.equal(battle.battle.fighters[1].effects[lock], undefined);
});
