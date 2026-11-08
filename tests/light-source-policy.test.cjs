'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),P=require('../source-policy.cjs'),s=require('../research/LIGHT-SP-2026-11-07/candidate-13311.json');
test('SP获授权复合来源逐字段验证真实Wiki修订与API技能魂印，拒绝改ID、版本和参数',()=>{
 assert.deepEqual(P.compositeIssues(s),[]);
 for(const mutate of [x=>x.id=13312,x=>x.source.revision='0',x=>x.source.rawWikiPage.revisions[0].revid=0,x=>x.moves[0].power++,x=>x.moves[1].effectInstances[0].args[0]++,x=>x.souls[0].hash='false',x=>x.moves.pop()]){const bad=structuredClone(s);mutate(bad);assert.ok(P.compositeIssues(bad).length>0);}
});
