const {test}=require('node:test'),assert=require('node:assert/strict');
const store=require('../local-species.cjs'),E=require('../dist/engine.js');

test('3430 星域之魂：魂印与全部技能可在本地开局结算',()=>{
  const source=store.species(3430);
  assert.deepEqual(store.issues(source),[]);
  for(const move of source.moves){
    const selected=E.WIKI.defaultMoves(source),sameSlot=id=>!!source.moves.find(m=>m.id===id).fifth===!!move.fifth;
    if(!selected.includes(move.id))selected[selected.findIndex(sameSlot)]=move.id;
    const s=E.createBattle({wikiSnapshots:[source,source],wikiLoadouts:[selected,E.WIKI.defaultMoves(source)],criticals:false,builds:[{overrides:{maxHp:9999}},{overrides:{maxHp:9999}}]});
    const t=E.resolveTurn(s,['wiki:'+move.id,'potion:hp']);
    assert.equal(t.round,2,move.name);
    assert.ok(t.fighters.every(f=>f.hp>=0&&f.hp<=f.stats.maxHp),move.name);
  }
});
