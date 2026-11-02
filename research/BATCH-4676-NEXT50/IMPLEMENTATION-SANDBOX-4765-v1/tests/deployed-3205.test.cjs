const {test}=require('node:test'),assert=require('node:assert/strict');
const store=require('../local-species.cjs'),E=require('../dist/engine.js');
const source=store.species(3205);

test('3205 王·缪斯：技能与两版魂印可本地开局并结算',()=>{
  assert.deepEqual(store.issues(source),[]);
  assert.equal(source.source.storage,'local');
  assert.deepEqual(source.souls.map(x=>x.id),[535,548]);
  for(const soul of source.souls){
    const s=E.createBattle({wikiSnapshots:[{...source,selectedSoulId:soul.id},source],criticals:false});
    assert.equal(s.fighters[0].soulId,soul.id);
  }
  for(const move of source.moves){
    const selected=E.WIKI.defaultMoves(source);
    if(!selected.includes(move.id))selected[selected.findIndex(id=>!source.moves.find(x=>x.id===id).fifth)]=move.id;
    const s=E.createBattle({wikiSnapshots:[source,source],wikiLoadouts:[selected,E.WIKI.defaultMoves(source)],criticals:false,builds:[{overrides:{maxHp:9999}},{overrides:{maxHp:9999}}]});
    const t=E.resolveTurn(s,['wiki:'+move.id,'potion:hp']);
    assert.equal(t.round,2,move.name);
    assert.ok(t.fighters.every(f=>f.hp>=0&&f.hp<=f.stats.maxHp));
  }
});

