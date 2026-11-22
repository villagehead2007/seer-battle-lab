'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
const order=[29395,29396,29397,38460,29398],pp='potion:pp',hp='potion:hp';
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats}}};}
function moti(layout=order,stats={}){const m=member(4923,[],stats);m.moves=layout.slice();m.build.resistance={slots:[{name:'睡眠',chance:0},{name:'',chance:0},{name:'',chance:0}]};return m;}
function state(g,side=0){return g.battle.teamMirage2119[side].state;}
function make(layout=order){return T.create([[moti(layout),member(3102)],[member(4925,[20296])]],[0,0],{seed:14,criticals:false});}
function sleepTurn(g,a=pp){return T.turn(g,[a,E.availableMoves(g.battle.fighters[1],g.battle.round).includes('wiki:20296')?'wiki:20296':pp]);}
function cities(g,count){for(let tries=0;state(g).cities.length<count&&tries<40;tries++)g=sleepTurn(g);assert.equal(state(g).cities.length,count);return g;}

test('莫缇初始在场下也只授己方四楼，其他队友真实睡眠不消耗，本人实装四招才按实际槽序逐次转都',()=>{
 let g=T.create([[member(3102),moti()],[member(4925,[20296])]],[0,0],{seed:14,criticals:false});assert.equal(state(g).remaining,4);assert.equal(g.battle.fighters[0].soulState.mirage2119,undefined);for(let tries=0;!g.battle.fighters[0].ailments['睡眠']&&tries<16;tries++)g=sleepTurn(g);assert.ok(g.battle.fighters[0].ailments['睡眠']);assert.equal(state(g).remaining,4);g=sleepTurn(g,{switchTo:1});g=cities(g,1);assert.equal(state(g).remaining,3);assert.deepEqual(state(g).cities.map(e=>e.name),['序']);assert.equal(g.battle.fighters[0].ailments['睡眠'],undefined);assert.ok(g.battle.fighters[0].ailments['超频']);
 for(const [layout,expected]of [[order,['序','源','逐','理']],[[38460,29397,29395,29396,29398],['理','逐','序','源']]]){
  let h=make(layout);for(let i=1;i<=4;i++){h=cities(h,i);assert.equal(state(h).remaining,4-i);assert.deepEqual(state(h).cities.map(e=>e.name),expected.slice(0,i));}
  h=T.turn(h,[{switchTo:1},pp]);assert.equal(state(h).remaining,0);assert.deepEqual(state(h).cities.map(e=>e.name),expected);h=T.turn(h,[{switchTo:0},pp]);assert.equal(state(h).remaining,0);assert.deepEqual(state(h).cities.map(e=>e.name),expected);
 }
 let missing=make([38464,29396,29397,38460,29398]);for(let tries=0;!missing.battle.fighters[0].ailments['睡眠']&&tries<16;tries++)missing=sleepTurn(missing);assert.equal(state(missing).remaining,4);assert.deepEqual(state(missing).cities,[]);assert.ok(missing.battle.fighters[0].ailments['睡眠']);
});

test('真实生成蜃都之源后双方仍指定替补而按驱逐结算，莫缇下场保城且队友诡符不按主动扣血',()=>{
 let g=make();g.slots[0][1].fighter.soulState.guiFu1747=2;g=cities(g,2);assert.equal(T.switchMode(g,0),'expelled');assert.equal(T.switchMode(g,1),'expelled');g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.active[0],1);assert.equal(state(g).remaining,2);assert.equal(state(g).defenseUntil,undefined);assert.equal(state(g).enemyKind,undefined);assert.equal(g.battle.teamDepartureEvents.at(-1).selection,'chosen');g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.slots[0][1].fighter.hp,9000);assert.deepEqual(state(g).cities.map(e=>e.name),['序','源']);
 const before=structuredClone(g);assert.match(D.team(g,0).find(e=>e.name==='己方蜃楼').value,/2 \/ 4/);assert.match(D.team(g,1).find(e=>e.name==='双方蜃都').value,/主动更换视为驱逐，仍指定替补/);assert.deepEqual(g,before);
});

test('蜃都之逐来自真实场下共享场地，使双方普通队友原生低频共振的睡眠时长各加一，不转化普通队友',()=>{
 for(const actor of [0,1]){
  const makeBoundary=city=>{const g=T.create([[member(4925,[20296]),moti()],[member(4925,[20296])]],[0,0],{seed:14,criticals:false});if(city){state(g).cities=[{name:'逐',round:0,sequence:1}];state(g).remaining=3;}return g;};
  const actions=actor===0?['wiki:20296',hp]:[hp,'wiki:20296'],target=1-actor;let base=makeBoundary(false),city=makeBoundary(true);for(let tries=0;!base.battle.fighters[target].ailments['睡眠']&&tries<16;tries++){base=T.turn(base,actions);city=T.turn(city,actions);}assert.ok(base.battle.fighters[target].ailments['睡眠']);
  assert.equal(city.battle.fighters[target].ailments['睡眠'],base.battle.fighters[target].ailments['睡眠']+1);assert.equal(city.battle.fighters[target].ailments['超频'],undefined);assert.equal(state(city).remaining,3);
 }
});

test('蜃都之理场下源对双方当前无法选择的零PP槽回末回一，普通可选亏PP槽不回，恢复可选后不再补',()=>{
 let g=T.create([[member(3102),moti()],[member(3056)]],[0,0],{seed:14,criticals:false});state(g).cities=[{name:'理',round:0,sequence:1}];state(g).remaining=3;
 const records=g.battle.fighters.map(f=>{f.pp[f.moves[0]]=0;f.pp[f.moves[1]]--;return{zero:f.moves[0],available:f.moves[1],old:f.pp[f.moves[1]]};});g=T.turn(g,[hp,hp]);for(const side of [0,1]){assert.equal(g.battle.fighters[side].pp[records[side].zero],1);assert.equal(g.battle.fighters[side].pp[records[side].available],records[side].old);}g=T.turn(g,[hp,hp]);for(const side of [0,1])assert.equal(g.battle.fighters[side].pp[records[side].zero],1);
});

test('蜃都之序让首末顺序条件失效：首末真阵亡但中间存活时薇尔诗仍按己方失血增红并对手真实用招后回PP',()=>{
 const out=[];
 for(const free of [false,true]){
  let g=T.create([[member(3102),member(4000,[10047],{atk:1000}),moti(),member(3056)],[member(3056,[20117],{spe:1})]],[1,0],{seed:14,criticals:false});g.slots[0][0].fighter.hp=0;g.slots[0][3].fighter.hp=0;if(free){state(g).cities=[{name:'序',round:0,sequence:1}];state(g).remaining=3;}
  const before=g.battle.fighters[0].pp['wiki:10047'];g=T.turn(g,['wiki:10047','wiki:20117']);const red=g.battle.damageEvents.filter(e=>e.sourceSide===0&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);assert.ok(red>0);out.push(red);assert.equal(g.battle.fighters[0].pp['wiki:10047'],free?before:before-1);
 }
 assert.ok(Math.abs(out[1]-out[0]*1.5)<=2);
});

test('蜃都之序下中间阵亡也满足首末死亡条件，真实百分比伤害被免；无序且实际首末存活时不凭中间阵亡免粉',()=>{
 for(const free of [false,true]){
  let g=T.create([[member(3102),member(3056),member(4000),member(2988),moti()],[member(4665,[37483])]],[2,0],{seed:14,criticals:false});g.slots[0][1].fighter.hp=0;if(free){state(g).cities=[{name:'序',round:0,sequence:1}];state(g).remaining=3;}
  g=T.turn(g,[pp,'wiki:37483']);const verse=g.battle.fighters[0].soulState.verse2098;assert.equal(!!verse.percentImmune,free);assert.equal(!!verse.fixedImmune,free);const pink=(g.battle.damageEvents??[]).filter(e=>e.type==='percent'&&e.sourceSide===1).reduce((n,e)=>n+e.settledDamage,0);if(free)assert.equal(pink,0);else assert.ok(pink>0);
 }
});

test('双方持有的蜃都共享生效但不合并为己方四城，原生第五不能用对方两城凑出自己的四城封换',()=>{
 let g=T.create([[moti()],[moti()]],[0,0],{seed:14,criticals:false});state(g,0).cities=[{name:'序'},{name:'源'}];state(g,0).remaining=2;state(g,1).cities=[{name:'逐'},{name:'理'}];state(g,1).remaining=2;g=T.turn(g,['wiki:29398',pp]);assert.equal(g.battle.fighters[1].effects['不能主动切换'],undefined);assert.equal(state(g,0).cities.length,2);assert.equal(state(g,1).cities.length,2);assert.equal(E.cityActive2119(g.battle,'逐'),true);assert.equal(E.cityActive2119(g.battle,'理'),true);
});

test('真实已生成蜃都不因莫缇本人阵亡重置，所选继任承接城市场地，双方更换仍按源视为驱逐',()=>{
 let g=T.create([[moti(order,{maxHp:10,def:1}),member(3102)],[member(4925,[20296]),member(3102,[10127],{atk:9999})]],[0,0],{seed:14,criticals:false});g=cities(g,2);g=T.turn(g,[pp,{switchTo:1}]);g=T.turn(g,[pp,'wiki:10127']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);g=T.replace(g,[1,null]);assert.deepEqual(state(g).cities.map(e=>e.name),['序','源']);assert.equal(state(g).remaining,2);assert.equal(T.switchMode(g,1),'expelled');g=T.turn(g,[pp,{switchTo:0}]);assert.equal(g.active[1],0);assert.equal(g.battle.teamDepartureEvents.at(-1).kind,'expelled');assert.equal(g.battle.teamDepartureEvents.at(-1).selection,'chosen');
});

test('莫缇2538用原技能集齐四城才封原对手，离场不撤销已有封换', () => {
  const caster = moti();
  assert.equal(caster.snapshot.moves.find(move => move.id === 29398).effectInstances[0].id, 2538);
  const initial = T.create([
    [caster, member(3102)],
    [member(4925, [20296]), member(3056)]
  ], [0, 0], {seed: 14, criticals: false});
  const key = '不能主动切换';
  const three = cities(initial, 3);
  const insufficient = T.turn(three, ['wiki:29398', pp]);
  assert.equal(insufficient.battle.fighters[1].effects[key], undefined);
  assert.deepEqual(T.candidates(insufficient, 1), [1]);

  let battle = cities(three, 4);
  assert.deepEqual(state(battle).cities.map(city => city.name), ['序', '源', '逐', '理']);
  const {round} = battle.battle;
  battle = T.turn(battle, ['wiki:29398', pp]);
  const restriction = {start: round, end: round + 3, noSwitch: true};
  assert.deepEqual(battle.battle.fighters[1].effects[key], restriction);
  assert.equal(battle.battle.fighters[0].effects[key], undefined);
  assert.equal(T.switchMode(battle, 1), 'expelled');
  for (let elapsed = 1; elapsed <= 3; elapsed++) {
    assert.deepEqual(battle.battle.fighters[1].effects[key], restriction);
    assert.deepEqual(T.candidates(battle, 1), []);
    assert.throws(() => T.turn(battle, [pp, {switchTo: 1}]), /不可换入/);
    battle = T.turn(battle, [elapsed === 1 ? {switchTo: 1} : pp, pp]);
    assert.deepEqual(battle.active, [1, 0]);
  }
  battle = T.turn(battle, [pp, {switchTo: 1}]);
  assert.deepEqual(battle.active, [1, 1]);
  assert.equal(battle.battle.fighters[1].effects[key], undefined);
  assert.equal(battle.battle.teamDepartureEvents.at(-1).selection, 'chosen');
});
