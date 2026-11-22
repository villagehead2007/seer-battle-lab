'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),D=require('../dist/battle-display.js');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:1000,spa:1000,def:1000,spd:1000,spe:1000,...stats}}};}
const pp='potion:pp';
function make(enemyStats={},whisperHp=null,enemyHp=null,whisperStats={}){const g=T.create([[member(2988),member(4287,[11923],whisperStats),member(3102),member(4647),member(4648),member(4649)],[member(3056,[10127,20117],enemyStats),member(3102),member(2988),member(4647),member(4648),member(4649)]],[0,0],{seed:14,criticals:false});if(whisperHp!==null)g.slots[0][1].fighter.hp=whisperHp;if(enemyHp!==null)g.battle.fighters[1].hp=enemyHp;return g;}
test('混灵莱茵哈特实际晚登场按双方零至九阵亡取层封顶六，原幽冥息逐层增威且六层额外先制',()=>{
 let baseline;for(let n=0;n<=9;n++){let g=make();const corpses=[...g.slots[0].slice(2),...g.slots[1].slice(1)];for(let i=0;i<n;i++)corpses[i].fighter.hp=0;g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.battle.fighters[0].soulState.lastWhisperLayers,Math.min(6,n));const original=structuredClone(g);assert.equal(D.fighter(g.battle.fighters[0],g.battle.round,g.battle.moveDefinitions).items.find(x=>x.name==='逝者亡语').value,Math.min(6,n)+' / 6 层');assert.deepEqual(g,original);g=T.turn(g,['wiki:11923',pp]);assert.equal(g.battle.fighters[0].soulState.resolvedPriority.value,n>=6?1:0);const red=g.battle.damageEvents.filter(e=>e.round===2&&e.sourceSide===0&&e.type==='attack').reduce((v,e)=>v+e.settledDamage,0);if(!n)baseline=red;else assert.ok(Math.abs(red-baseline*(1+.1*Math.min(6,n)))<=2);}
});
test('混灵莱茵哈特真实带三层死亡清气力施石化，所选继任后敌下一回禁换一次，到期可换；两层不禁',()=>{
 for(const n of [2,3]){let g=make({atk:9999},1);g.slots[0][3].fighter.hp=0;g.slots[1][2].fighter.hp=0;if(n===3)g.slots[1][3].fighter.hp=0;g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[pp,'wiki:20117']);g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[1].stages.atk,0);assert.ok(g.battle.fighters[1].ailments['石化']);g=T.replace(g,[2,null]);if(n===3){const original=structuredClone(g);assert.throws(()=>T.turn(g,[pp,{switchTo:1}]),/切换|换宠|换入/);assert.deepEqual(g,original);g=T.turn(g,[pp,pp]);}g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.active[1],1);}
});
test('混灵莱茵哈特队友真KO后补位得一层，敌真KO后返场重读双方当前阵亡数为二层',()=>{
 let g=make({},null,1);g.battle.fighters[1].effects['回复效果削减']={start:1,end:3,fraction:1};g.battle.fighters[0].hp=1;g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].soulState.lastWhisperLayers,1);assert.equal(g.battle.fighters[1].hp,1);g=T.turn(g,['wiki:11923',pp]);assert.equal(g.phase,'replace');assert.ok(g.battle.fighters[0].hp>0);assert.deepEqual(g.pending,[1]);g=T.replace(g,[null,1]);g=T.turn(g,[{switchTo:2},pp]);g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.battle.fighters[0].soulState.lastWhisperLayers,2);
});

test('莱茵哈特1508由真实阵亡累计到三层才在自身阵亡后封原击败者', () => {
  const fragile = {maxHp: 1, def: 1, spd: 1};
  const caster = member(4287, [], fragile);
  assert.equal(caster.snapshot.souls.find(soul => soul.id === 1508).hash, 'a7ad3e9d');
  const key = '不能主动切换';

  for (const count of [2, 3]) {
    const leads = [2989, 2988, 3102].slice(0, count).map(id => member(id, [], fragile));
    let battle = T.create([
      [...leads, caster, member(4647)],
      [member(3056, [10127, 20117], {atk: 9999}), member(4649)]
    ], [0, 0], {seed: 14, criticals: false});
    for (let index = 0; index < count; index++) {
      battle = T.turn(battle, [pp, 'wiki:10127']);
      assert.equal(battle.phase, 'replace');
      assert.deepEqual(battle.pending, [0]);
      assert.equal(battle.battle.fighters[0].hp, 0);
      battle = T.replace(battle, [index + 1, null]);
    }
    assert.equal(battle.battle.fighters[0].soulState.lastWhisperLayers, count);
    battle = T.turn(battle, [pp, 'wiki:20117']);
    assert.equal(battle.battle.fighters[1].stages.atk, 1);
    battle = T.turn(battle, [pp, 'wiki:10127']);
    assert.equal(battle.phase, 'replace');
    assert.equal(battle.battle.fighters[1].stages.atk, 0);
    assert.ok(battle.battle.fighters[1].ailments['石化']);
    battle = T.replace(battle, [count + 1, null]);
    assert.equal(battle.battle.fighters[0].effects[key], undefined);
    if (count === 3) {
      const {round} = battle.battle;
      assert.deepEqual(battle.battle.fighters[1].effects[key], {start: round, end: round});
      assert.throws(() => T.turn(battle, [pp, {switchTo: 1}]), /不可换入/);
      battle = T.turn(battle, [pp, pp]);
    }
    assert.deepEqual(T.candidates(battle, 1), [1]);
    battle = T.turn(battle, [pp, {switchTo: 1}]);
    assert.equal(battle.battle.fighters[1].effects[key], undefined);
  }
});
