'use strict';
require('./light-legacy-state.test.cjs');
require('./light-training-core.test.cjs');
require('./light-training-effects.test.cjs');
require('./light-versions.test.cjs');
require('./light-additional-clauses.test.cjs');
require('./light-soul-interactions.test.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict'),store=require('../local-species.cjs'),E=require('../dist/engine.js');
test('正式3311最新API源、原版与特训种族技能及魂印双历史来源验证',()=>{
 const s=store.species(3311);assert.equal(s.source.revision,'36eec0');assert.equal(s.source.storage,'local');assert.equal(s.souls[0].hash,'53bf6afd');assert.equal(E.SOULS.acceptsSource(638,'1abcf460'),true);assert.equal(E.SOULS.acceptsSource(638,'53bf6afd'),true);assert.deepEqual(s.skillVersions.map(x=>Object.values(x.base).reduce((a,b)=>a+b,0)),[726,800]);assert.ok(s.moves.some(m=>m.id===38635));assert.equal(store.issues(s).length,0);
});
