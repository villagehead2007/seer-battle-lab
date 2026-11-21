const {test}=require('node:test'),assert=require('node:assert/strict');
const store=require('../local-species.cjs'),E=require('../dist/engine.js');
const source=store.species(3506);

test('3506 惊涛海皇·波塞冬：双魂印与全部技能可从本地开局结算',()=>{
  assert.deepEqual(store.issues(source),[]);
  assert.deepEqual(source.souls.map(x=>x.id),[819,1685]);
  require('./helpers/exercise-version-moves.cjs')(source);
});
