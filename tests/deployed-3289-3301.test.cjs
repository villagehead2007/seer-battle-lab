const {test}=require('node:test'),assert=require('node:assert/strict');
const store=require('../local-species.cjs'),E=require('../dist/engine.js');

for(const id of [3289,3291,3301,3308,3311,3315,3318,3322,3328])test(`${id}：本地魂印及全部技能可开局结算`,()=>{
  const source=store.species(id);
  assert.deepEqual(store.issues(source),[]);
  assert.equal(source.source.storage,'local');
  for(const move of source.moves){
    const selected=E.WIKI.defaultMoves(source);
    if(!selected.includes(move.id))selected[selected.findIndex(x=>!source.moves.find(m=>m.id===x).fifth)]=move.id;
    const s=E.createBattle({wikiSnapshots:[source,source],wikiLoadouts:[selected,E.WIKI.defaultMoves(source)],criticals:false,builds:[{overrides:{maxHp:9999}},{overrides:{maxHp:9999}}]});
    const t=E.resolveTurn(s,['wiki:'+move.id,'potion:hp']);
    assert.equal(t.round,2,move.name);
    assert.ok(t.fighters.every(f=>f.hp>=0&&f.hp<=f.stats.maxHp),move.name);
  }
});

test('3318 朱雀首次被击败后浴火重生且获得两次攻击免疫',()=>{
  const phoenix=store.species(3318),opponent=store.species(3291);
  const s=E.createBattle({wikiSnapshots:[phoenix,opponent],criticals:false});
  s.fighters[0].hp=1;
  const attack=E.WIKI.defaultMoves(opponent).map(id=>opponent.moves.find(m=>m.id===id)).find(m=>m.kind!=='status');
  assert.ok(attack);
  const t=E.resolveTurn(s,['potion:pp','wiki:'+attack.id]);
  assert.equal(t.fighters[0].soulState.phoenixReborn,true);
  assert.ok(t.fighters[0].hp>0);
  assert.equal(t.fighters[0].counts.attackNullify,2);
});
