const {test}=require('node:test'),assert=require('node:assert/strict');
const store=require('../local-species.cjs'),E=require('../dist/engine.js');
const source=store.species(3170);
test('3170 王·卡修斯：全部技能与两版魂印可以本地开局并结算',()=>{
  assert.deepEqual(store.issues(source),[]);assert.equal(source.source.storage,'local');assert.deepEqual(source.souls.map(x=>x.id),[501,529]);
  for(const soul of source.souls){const s=E.createBattle({wikiSnapshots:[{...source,selectedSoulId:soul.id},source],criticals:false});assert.equal(s.fighters[0].soulId,soul.id);}
  for(const m of source.moves){const selected=E.WIKI.defaultMoves(source);if(!selected.includes(m.id))selected[selected.findIndex(id=>!source.moves.find(x=>x.id===id).fifth)]=m.id;const s=E.createBattle({wikiSnapshots:[source,source],wikiLoadouts:[selected,E.WIKI.defaultMoves(source)],criticals:false,builds:[{overrides:{maxHp:9999}},{overrides:{maxHp:9999}}]});const t=E.resolveTurn(s,['wiki:'+m.id,'potion:hp']);assert.equal(t.round,2,m.name);assert.ok(t.fighters.every(f=>f.hp>=0&&f.hp<=f.stats.maxHp));}
});
test('3170 王·卡修斯：先手令对手技能失效，后手获得护盾和下回合先制',()=>{
  const b={...source,selectedSoulId:529};
  let s=E.createBattle({wikiSnapshots:[b,b],criticals:false,builds:[{overrides:{spe:900,maxHp:9999}},{overrides:{spe:1,maxHp:9999}}]});
  s=E.resolveTurn(s,[s.fighters[0].moves[0],s.fighters[1].moves[0]]);
  assert.ok(s.turns[0].events.some(e=>e.text.includes('技能被封锁')));
  assert.equal(s.fighters[1].suitState.shield,250);
  assert.equal(s.fighters[1].effects.id984.amount,2);
});
