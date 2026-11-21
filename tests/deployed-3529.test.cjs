const {test}=require('node:test'),assert=require('node:assert/strict');
const store=require('../local-species.cjs'),E=require('../dist/engine.js');
const source=store.species(3529);

test('3529 幻世·海瑟薇：魂印与全部技能可从本地开局结算',()=>{
  assert.deepEqual(store.issues(source),[]);
  assert.deepEqual(source.souls.map(x=>x.id),[836]);
  require('./helpers/exercise-version-moves.cjs')(source);
});
