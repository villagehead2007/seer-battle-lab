'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const {validateCoverage}=require('../completion-policy.cjs');
const original=require('../data/species/4695.json').snapshot;
const reviews=require('../SINGLE-STAGE-REVIEWS.json'),todo=require('../MULTI-PET-TODO.json');
const errors=s=>validateCoverage(s,reviews,todo,path.resolve(__dirname,'..')).filter(x=>x.includes('soul instance parameters'));
test('4695 explicit upstream null soul args preserves exact source only; missing or changed sources reject',()=>{
 assert.equal(original.souls[0].args,null);assert.deepEqual(errors(original),[]);
 for(const mutate of [s=>delete s.souls[0].args,s=>s.souls[0].args='null',s=>s.souls[0].hash='changed',s=>s.souls[0].description+='changed',s=>s.souls[0].eid++,s=>s.source.revision='changed',s=>s.id=4696]){
  const s=structuredClone(original);mutate(s);assert.equal(errors(s).length,1);
 }
});
