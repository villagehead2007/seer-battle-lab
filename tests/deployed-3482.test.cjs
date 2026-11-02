const {test}=require('node:test'),assert=require('node:assert/strict');
const store=require('../local-species.cjs'),E=require('../dist/engine.js');
const source=store.species(3482);

test('3482 圣战瑞尔斯：魂印与全部技能可从本地开局结算',()=>{
  assert.deepEqual(store.issues(source),[]);
  assert.deepEqual(source.souls.map(x=>x.id),[792]);
  for(const move of source.moves){
    const selected=E.WIKI.defaultMoves(source);
    if(!selected.includes(move.id))selected[selected.findIndex(id=>!!source.moves.find(m=>m.id===id).fifth===!!move.fifth)]=move.id;
    const s=E.createBattle({wikiSnapshots:[source,source],wikiLoadouts:[selected,E.WIKI.defaultMoves(source)],criticals:false,builds:[{overrides:{maxHp:9999}},{overrides:{maxHp:9999}}]});
    const t=E.resolveTurn(s,['wiki:'+move.id,'potion:hp']);
    assert.equal(t.round,2,move.name);
    assert.ok(t.fighters.every(f=>f.hp>=0&&f.hp<=f.stats.maxHp),move.name);
  }
});
