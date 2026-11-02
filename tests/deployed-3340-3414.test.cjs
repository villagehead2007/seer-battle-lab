const {test}=require('node:test'),assert=require('node:assert/strict');
const store=require('../local-species.cjs'),E=require('../dist/engine.js');

for(const id of [3340,3355,3372,3383,3388,3393,3396,3406,3407,3414])test(`${id}：本地魂印及全部技能可开局结算`,()=>{
  const source=store.species(id);
  assert.deepEqual(store.issues(source),[]);
  assert.equal(source.source.storage,'local');
  for(const move of source.moves){
    const selected=E.WIKI.defaultMoves(source);
    if(!selected.includes(move.id))selected[selected.findIndex(x=>!!source.moves.find(m=>m.id===x).fifth===!!move.fifth)]=move.id;
    const s=E.createBattle({wikiSnapshots:[source,source],wikiLoadouts:[selected,E.WIKI.defaultMoves(source)],criticals:false,builds:[{overrides:{maxHp:9999}},{overrides:{maxHp:9999}}]});
    const t=E.resolveTurn(s,['wiki:'+move.id,'potion:hp']);
    assert.equal(t.round,2,move.name);
    assert.ok(t.fighters.every(f=>f.hp>=0&&f.hp<=f.stats.maxHp),move.name);
  }
});

test('3393 马尔修斯出场为极速，终极技能成功后于下回合切换形态',()=>{
  const mars=store.species(3393);
  let s=E.createBattle({wikiSnapshots:[mars,mars],criticals:false});
  assert.equal(s.fighters[0].soulState.marsForm,'speed');
  assert.equal(s.fighters[0].soulState.marsShield,300);
  s=E.resolveTurn(s,['wiki:25555','potion:hp']);
  assert.equal(s.fighters[0].soulState.marsForm,'speed');
  assert.equal(s.fighters[0].soulState.marsNextForm,'destruction');
  s=E.resolveTurn(s,['potion:hp','potion:hp']);
  assert.equal(s.fighters[0].soulState.marsForm,'destruction');
  assert.equal(s.fighters[0].soulState.marsNextForm,undefined);
  assert.ok(s.turns[1].events.some(e=>e.text.includes('切换为毁灭形态')));
  s=E.resolveTurn(s,['wiki:25555','potion:hp']);
  assert.equal(s.fighters[0].soulState.marsNextForm,'speed');
  s=E.resolveTurn(s,['potion:hp','potion:hp']);
  assert.equal(s.fighters[0].soulState.marsForm,'speed');
});

test('3393 马尔修斯技能吸强日志不误称魂印「雷」',()=>{
  const mars=store.species(3393),moves=E.WIKI.defaultMoves(mars);
  moves[moves.findIndex(id=>!mars.moves.find(m=>m.id===id).fifth)]=30874;
  let s=E.createBattle({wikiSnapshots:[mars,mars],wikiLoadouts:[moves,E.WIKI.defaultMoves(mars)],criticals:false});
  s.fighters[1].stages.atk=2;
  s=E.resolveTurn(s,['wiki:30874','potion:hp']);
  const log=s.turns[0].events.map(e=>e.text).join('\n');
  assert.match(log,/技能吸取/);
  assert.doesNotMatch(log,/魂印「雷」/);
});
