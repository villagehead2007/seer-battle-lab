'use strict';
require('./light-legacy-state.test.cjs');
require('./light-sp-core.test.cjs');
require('./light-sp-skills.test.cjs');
require('./light-training-effects.test.cjs');
require('./light-additional-clauses.test.cjs');
require('./light-soul-interactions.test.cjs');
require('./light-source-policy.test.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict'),store=require('../local-species.cjs');
test('正式13311保留API404与获授权Wiki身份修订，全部实际技能魂印来自API',()=>{
 const s=store.species(13311);assert.equal(s.source.provider,'composite');assert.equal(s.source.revision,'390296');assert.match(s.source.apiPetFailure.error,/404/);assert.equal(s.souls[0].hash,'3838a9fb');assert.equal(s.moves.length,23);assert.ok(s.moves.every(m=>m.provider==='seerapi'));assert.equal(store.issues(s).length,0);assert.equal(require('../source-policy.cjs').compositeIssues(s).length,0);
});
