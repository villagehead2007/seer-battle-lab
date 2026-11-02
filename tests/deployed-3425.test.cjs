const {test}=require('node:test'),assert=require('node:assert/strict');
const store=require('../local-species.cjs'),E=require('../dist/engine.js');
const source=store.species(3425);

test('3425 圣灵守护奥斯卡：两版魂印与全部技能可在本地开局结算',()=>{
  assert.deepEqual(store.issues(source),[]);
  assert.deepEqual(source.souls.map(x=>x.id).sort((a,b)=>a-b),[740,1030]);
  for(const soulId of [740,1030])for(const move of source.moves){
    const selected=E.WIKI.defaultMoves(source),sameSlot=id=>!!source.moves.find(m=>m.id===id).fifth===!!move.fifth;
    if(!selected.includes(move.id))selected[selected.findIndex(sameSlot)]=move.id;
    const a={...source,selectedSoulId:soulId};
    const s=E.createBattle({wikiSnapshots:[a,source],wikiLoadouts:[selected,E.WIKI.defaultMoves(source)],criticals:false,builds:[{overrides:{maxHp:9999}},{overrides:{maxHp:9999}}]});
    const t=E.resolveTurn(s,['wiki:'+move.id,'potion:hp']);
    assert.equal(t.round,2,move.name);
    assert.ok(t.fighters.every(f=>f.hp>=0&&f.hp<=f.stats.maxHp),move.name);
  }
});

test('3425 携带星界圣令时加护从开局生效，回合末解异常并给予下回合先制',()=>{
  const selected=E.WIKI.defaultMoves(source);selected[selected.findIndex(id=>!source.moves.find(m=>m.id===id).fifth)]=38525;
  let s=E.createBattle({wikiSnapshots:[source,source],wikiLoadouts:[selected,E.WIKI.defaultMoves(source)],criticals:false});
  assert.equal(s.fighters[0].soulState.oscarBlessings,true);
  s.fighters[0].ailments['烧伤']=3;
  s=E.resolveTurn(s,['potion:hp','potion:hp']);
  assert.equal(s.fighters[0].ailments['烧伤'],undefined);
  assert.deepEqual(s.fighters[0].soulState.oscarPriority,{round:2,amount:1});
});
