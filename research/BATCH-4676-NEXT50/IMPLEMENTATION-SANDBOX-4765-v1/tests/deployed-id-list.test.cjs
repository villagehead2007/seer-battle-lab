const {test}=require('node:test'),assert=require('node:assert/strict');
const store=require('../local-species.cjs'),E=require('../dist/engine.js');
const source=store.species(3150);
test('3150 格劳瑞：全部技能与两版魂印可以本地开局并结算',()=>{
  assert.deepEqual(store.issues(source),[]);
  assert.equal(source.source.storage,'local');
  assert.deepEqual(source.souls.map(x=>x.id),[492,528]);
  for(const soul of source.souls){const s=E.createBattle({wikiSnapshots:[{...source,selectedSoulId:soul.id},source],criticals:false});assert.equal(s.fighters[0].soulId,soul.id);}
  for(const m of source.moves){
    const selected=E.WIKI.defaultMoves(source);
    if(!selected.includes(m.id))selected[selected.findIndex(id=>!source.moves.find(x=>x.id===id).fifth)]=m.id;
    const s=E.createBattle({wikiSnapshots:[source,source],wikiLoadouts:[selected,E.WIKI.defaultMoves(source)],criticals:false,builds:[{overrides:{maxHp:9999}},{overrides:{maxHp:9999}}]});
    const t=E.resolveTurn(s,['wiki:'+m.id,'potion:hp']);
    assert.equal(t.round,2,m.name);assert.ok(t.fighters.every(f=>f.hp>=0&&f.hp<=f.stats.maxHp));
  }
});
test('3150 格劳瑞：低血魂印麻痹两回合，高血魂印提供下回合增伤',()=>{
  let s=E.createBattle({wikiSnapshots:[{...source,selectedSoulId:492},source],criticals:false,builds:[{overrides:{maxHp:1000}},{overrides:{maxHp:1000}}]});
  s.fighters[0].hp=499;
  s=E.resolveTurn(s,['potion:pp','potion:pp']);
  assert.equal(s.fighters[1].ailments['麻痹'],2);
  s=E.createBattle({wikiSnapshots:[{...source,selectedSoulId:528},source],criticals:false,builds:[{overrides:{maxHp:1000}},{overrides:{maxHp:1000}}]});
  s=E.resolveTurn(s,['potion:pp','potion:pp']);
  assert.equal(s.fighters[0].effects.id913.bonus,.75);
  assert.equal(s.fighters[0].effects.id913.start,2);
});
