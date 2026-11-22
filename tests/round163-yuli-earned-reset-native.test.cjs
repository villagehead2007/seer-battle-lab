'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function snapshot(id,soul){const raw=S.species(id),s=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)s.selectedSoulId=soul;return s;}
function member(id,soul,ids=[],stats={}){const s=snapshot(id,soul);return{snapshot:s,moves:loadout(s,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
test('1588完整原魂本体离场清旧群芳，仅板凳新队员首次登场赚层且重上不重授',()=>{
 let g=T.create([[member(4364,1588),member(3056),member(2988)],[member(2989)]],[0,0],{seed:14,criticals:false});const layers=()=>g.slots[0][0].fighter.soulState.yuliFangLayers??0;assert.equal(layers(),0);g=T.turn(g,[{switchTo:1},pp]);assert.equal(layers(),1);g=T.turn(g,[{switchTo:2},pp]);assert.equal(layers(),2);g=T.turn(g,[{switchTo:0},pp]);assert.equal(layers(),2);g=T.turn(g,[{switchTo:1},pp]);assert.equal(layers(),0);g=T.turn(g,[{switchTo:0},pp]);assert.equal(layers(),0);g=T.turn(g,[{switchTo:2},pp]);assert.equal(layers(),0);g=T.turn(g,[{switchTo:0},pp]);assert.equal(layers(),0);
});

test('2080完整原魂本体离场清旧群芳，仅板凳新队员首次登场赚层且重上不重授',()=>{
 let g=T.create([[member(4364,2080),member(3056),member(2988)],[member(2989)]],[0,0],{seed:14,criticals:false});const layers=()=>g.slots[0][0].fighter.soulState.yuliFangLayers??0;assert.equal(layers(),0);g=T.turn(g,[{switchTo:1},pp]);assert.equal(layers(),1);g=T.turn(g,[{switchTo:2},pp]);assert.equal(layers(),2);g=T.turn(g,[{switchTo:0},pp]);assert.equal(layers(),2);g=T.turn(g,[{switchTo:1},pp]);assert.equal(layers(),0);g=T.turn(g,[{switchTo:0},pp]);assert.equal(layers(),0);g=T.turn(g,[{switchTo:2},pp]);assert.equal(layers(),0);g=T.turn(g,[{switchTo:0},pp]);assert.equal(layers(),0);
});

for (const [soulId, hash] of [[1588, 'd3a9f290'], [2080, 'fa61a6cf']]) {
  test('尤莉米特魂印 ' + soulId + ' 的群辉加护被真实攻击消耗后只封原攻击者', () => {
    const lock = '不能主动切换';
    const caster = member(4364, soulId);
    assert.equal(caster.snapshot.souls.find(soul => soul.id === soulId).hash, hash);
    const initial = T.create([
      [caster, member(3008)],
      [member(3056, undefined, [10127], {atk: 1800}), member(3002)]
    ], [0, 0], {seed: 14, criticals: false});
    assert.equal(initial.battle.fighters[0].soulId, soulId);
    const noAttack = T.turn(initial, [pp, pp]);
    assert.deepEqual(T.candidates(noAttack, 1), [1]);

    let battle = T.turn(initial, [pp, 'wiki:10127']);
    const [owner, attacker] = battle.battle.fighters;
    assert.equal(owner.soulState.yuliGuardConsumedRound, 1);
    assert.equal(owner.soulState.yuliActiveKnown, false);
    assert.equal(owner.effects[lock], undefined);
    assert.deepEqual(attacker.effects[lock], {start: 2, end: 2});
    assert.throws(() => T.turn(battle, [pp, {switchTo: 1}]), /换入|切换/);

    battle = T.turn(battle, [{switchTo: 1}, pp]);
    assert.deepEqual(battle.active, [1, 0]);
    battle = T.turn(battle, [pp, {switchTo: 1}]);
    assert.deepEqual(battle.active, [1, 1]);
    assert.ok(battle.battle.fighters.every(fighter => fighter.effects[lock] === undefined));
  });
}
