'use strict';const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),P=require('../completion-policy.cjs'),base=require('../local-species.cjs').species(4747),reviews=require('../SINGLE-STAGE-REVIEWS.json'),todo=require('../MULTI-PET-TODO.json'),root=path.resolve(__dirname,'..');
test('4747审核闸门只承认20420同ID同hash原4612六参确认，修改版本元数据参数或删除确认均拒绝',()=>{assert.deepEqual(P.validateCoverage(base,reviews,todo,root),[]);for(const change of[
 s=>{s.source.revision='changed';},
 s=>{s.moves.find(m=>m.id===20420).hash='changed';},
 s=>{delete s.moves.find(m=>m.id===20420).sourceParameterConfirmation;},
 s=>{s.moves.find(m=>m.id===20420).effectInstances[0].args[5]=2;},
 s=>{s.effects.find(e=>e.id===4).revision='seerapi:changed';},
 s=>{s.moves.find(m=>m.id===20420).sourceParameterConfirmation.answerOriginal='changed';}
 ]){const s=structuredClone(base);change(s);const errors=P.validateCoverage(s,reviews,todo,root);assert.ok(errors.some(e=>e.includes('20420:0')&&e.includes('instance parameters must match')),errors.join('\n'));}});
