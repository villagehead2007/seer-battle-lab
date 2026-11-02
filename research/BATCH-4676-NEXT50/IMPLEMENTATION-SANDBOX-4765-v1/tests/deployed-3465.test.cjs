const {test}=require('node:test'),assert=require('node:assert/strict');
const store=require('../local-species.cjs'),E=require('../dist/engine.js');
const source=store.species(3465);

test('3465 圣瞳缪斯：魂印与全部技能可从本地开局结算',()=>{
  assert.deepEqual(store.issues(source),[]);
  assert.deepEqual(source.souls.map(x=>x.id),[778]);
  for(const move of source.moves){
    const selected=E.WIKI.defaultMoves(source);
    if(!selected.includes(move.id))selected[selected.findIndex(id=>!!source.moves.find(m=>m.id===id).fifth===!!move.fifth)]=move.id;
    const s=E.createBattle({wikiSnapshots:[source,source],wikiLoadouts:[selected,E.WIKI.defaultMoves(source)],criticals:false,builds:[{overrides:{maxHp:9999}},{overrides:{maxHp:9999}}]});
    const t=E.resolveTurn(s,['wiki:'+move.id,'potion:hp']);
    assert.equal(t.round,2,move.name);
    assert.ok(t.fighters.every(f=>f.hp>=0&&f.hp<=f.stats.maxHp),move.name);
  }
});

test('3465 命中睡眠目标时，即使攻击解除睡眠也会结算魂印追加',()=>{
  const battle=E.createBattle({wikiSnapshots:[source,source],criticals:false});
  battle.fighters[1].ailments['睡眠']=3;
  const move=E.WIKI.defaultMoves(source).find(id=>source.moves.find(m=>m.id===id).kind!=='status');
  const result=E.resolveTurn(battle,['wiki:'+move,'potion:hp']);
  assert.ok(result.turns[0].events.some(e=>e.text.includes('圣瞳缪斯睡眠追加')));
});
