'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
const pp='potion:pp';
function make(seed=14,xuan=false){return T.create([[member(3788),member(3102)],[member(3102,[10127],{atk:9999}),member(3056),member(2988),...(xuan?[member(4995)]:[])]],[0,0],{seed,criticals:false});}

test('混元天尊首发真实随机驱逐只占行动，锁仅原目标且新目标不重绑，同种子可复现',()=>{
 const seen=new Set();let failed=0;
 for(let seed=1;seed<=32;seed++){
  const g=make(seed),again=make(seed),event=g.battle.teamDrivenEvents[0];assert.deepEqual(g.active,again.active);assert.equal(event.sourceSoul,1061);assert.equal(event.selection,'random');assert.deepEqual(event.eligible,[1,2]);
  if(event.triggered){assert.equal(g.battle.fighters[1].effects['天尊首发封换'],undefined);assert.equal(g.battle.teamDrivenAction1061[1].round,g.battle.round);seen.add(g.active[1]);assert.equal(event.target,g.active[1]);assert.equal(g.battle.teamDepartureEvents[0].selection,'random');assert.match(g.history.join('\n'),/被驱逐，随机换入/);}else{failed++;assert.equal(g.active[1],0);assert.ok(g.battle.fighters[1].effects['天尊首发封换']);}
  assert.deepEqual(T.candidates(g,1),[]);const out=T.turn(g,[pp,pp]);assert.ok(T.candidates(out,1).length>0);
 }
 assert.deepEqual([...seen].sort(),[1,2]);assert.ok(failed>0);
});

test('没有存活替补的混元天尊首发随机驱逐不触发，也不会虚构替补或额外出招',()=>{
 const g=T.create([[member(3788)],[member(3102)]],[0,0],{seed:14,criticals:false});const event=g.battle.teamDrivenEvents[0];assert.deepEqual(event.eligible,[]);assert.equal(event.triggered,false);assert.deepEqual(g.active,[0,0]);assert.equal(g.battle.teamDepartureEvents,undefined);
});

test('非首发天尊首次真实换入只召唤辛不触发首发驱逐，辛真实受损后下场返场不重新召唤或补满',()=>{
 let g=T.create([[member(3102),member(3788)],[member(3102,[10127],{atk:9999})]],[0,0],{seed:14,criticals:false});assert.equal(g.slots[0][1].fighter.soulState.xin,undefined);g=T.turn(g,[{switchTo:1},'wiki:10127']);assert.equal(g.battle.teamDrivenEvents,undefined);const hp=g.battle.fighters[0].soulState.xin.hp;assert.ok(hp>0&&hp<9000);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.slots[0][1].fighter.soulState.xin.hp,hp);g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.battle.fighters[0].soulState.xin.hp,hp);assert.equal(g.battle.teamDrivenEvents,undefined);
});

test('初始一体辛被真实叩击击倒，下一回合100%随机驱逐实际敌方，原辛库存保留且融合按统一规则下场清除',()=>{
 const targets=new Set();let checked=0;
 for(let seed=1;seed<=32;seed++){
  let g=make(seed);if(g.active[1]!==0)continue;g.battle.fighters[0].soulState.xin.hp=1;
  g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.battle.fighters[0].soulState.xin.hp,0);assert.equal(g.battle.fighters[0].soulState.xinFusion,true);const event=g.battle.teamDrivenEvents.at(-1);assert.equal(event.chance,1);assert.equal(event.reason,'辛死亡的下一回合');assert.equal(event.triggered,true);targets.add(g.active[1]);assert.equal(g.battle.teamDepartureEvents.at(-1).selection,'random');
  g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.xin.hp,0);assert.equal(g.battle.fighters[0].soulState.xinFusion,false);assert.equal(g.battle.fighters[0].build.resistance.fixed,0);assert.equal(g.battle.fighters[0].build.resistance.percent,0);assert.equal(g.battle.teamDrivenEvents.filter(e=>e.chance===1).length,1);checked++;
 }
 assert.ok(checked>0);assert.deepEqual([...targets].sort(),[1,2]);
});

test('同场天尊真实首发随机驱逐与活背包玄武指定视为驱逐各用独立目标方式，玄武不被随机接口代选',()=>{
 const randomTargets=new Set();
 for(let seed=1;seed<=24;seed++){
  let g=make(seed,true);const first=g.battle.teamDrivenEvents[0];if(first.triggered)randomTargets.add(first.target);assert.deepEqual(T.candidates(g,1),[]);g=T.turn(g,[pp,pp]);assert.ok(T.candidates(g,1).length>0);
  for(const target of T.candidates(g,1)){
   const result=T.turn(g,[pp,{switchTo:target}]);assert.equal(result.active[1],target);const event=result.battle.teamDepartureEvents.at(-1);assert.equal(event.selection,'chosen');assert.equal(event.kind,'expelled');assert.equal(event.to,target);assert.equal(result.battle.teamDrivenEvents.length,1);
  }
 }
 assert.ok(randomTargets.size>=2);
});

test('辛被真实攻击击败后可随机驱逐仍受2144封换的攻击者，只清离场者的封换', () => {
  const caster = member(4661, [28779, 37450], {atk: 7000, spa: 7000});
  const move = caster.snapshot.moves.find(entry => entry.id === 28779);
  assert.equal(move.effectInstances[0].id, 2144);
  assert.deepEqual(move.effectInstances[0].args, [2]);
  let battle = T.create([
    [caster, member(3056), member(3102)],
    [member(3788, [], {maxHp: 120}), member(2989)]
  ], [0, 0], {seed: 14, criticals: false});
  assert.deepEqual(battle.active, [0, 0]);
  assert.equal(battle.battle.teamDrivenEvents[0].triggered, false);

  battle = T.turn(battle, ['wiki:28779', pp]);
  const key = '不能主动切换';
  const restriction = {start: 2, end: 3, noSwitch: true};
  assert.deepEqual(battle.battle.fighters.map(fighter => fighter.effects[key]),
    [restriction, restriction]);
  assert.equal(battle.battle.fighters[1].soulState.xin.hp, 120);
  assert.throws(() => T.turn(battle, [{switchTo: 1}, pp]), /不可换入/);
  assert.throws(() => T.turn(battle, [pp, {switchTo: 1}]), /不可换入/);

  battle = T.turn(battle, ['wiki:37450', pp]);
  assert.equal(battle.battle.round, 3);
  assert.equal(battle.battle.fighters[1].soulState.xin.hp, 0);
  assert.ok(battle.battle.fighters[1].hp > 0);
  const event = battle.battle.teamDrivenEvents.at(-1);
  assert.equal(event.reason, '辛死亡的下一回合');
  assert.equal(event.triggered, true);
  assert.equal(event.selection, 'random');
  assert.deepEqual(event.eligible, [1, 2]);
  assert.deepEqual(battle.active, [event.target, 0]);
  assert.equal(battle.battle.teamDepartureEvents.at(-1).kind, 'expelled');
  assert.equal(battle.battle.teamDrivenAction1061[0].round, 3);
  assert.equal(battle.battle.fighters[0].effects[key], undefined);
  assert.deepEqual(battle.battle.fighters[1].effects[key], restriction);

  battle = T.turn(battle, [pp, pp]);
  assert.deepEqual(T.candidates(battle, 1), [1]);
  assert.ok(T.candidates(battle, 0).includes(0));
  battle = T.turn(battle, [{switchTo: 0}, {switchTo: 1}]);
  assert.deepEqual(battle.active, [0, 1]);
  assert.ok(battle.battle.fighters.every(fighter => fighter.effects[key] === undefined));
});
