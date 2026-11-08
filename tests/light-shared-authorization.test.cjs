'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),A=require('../shared-stage-authorization.cjs');
test('两临时目标共享新完整回归只接受真实授权、原队列与单精灵范围，不能授权其他ID或完全完成',()=>{
 const auth=require('../research/LIGHT-SP-2026-11-07/SHARED-REGRESSION-AUTHORIZATION.json'),queue=fs.readFileSync(require('node:path').join(__dirname,'../seer_id.txt'));
 for(const id of[3311,13311])assert.equal(A.allows(auth,id,false,queue),true);
 for(const id of[1,3312,13312,4816])assert.equal(A.allows(auth,id,false,queue),false);
 assert.equal(A.allows(auth,13311,true,queue),false);assert.equal(A.allows(auth,13311,false,Buffer.concat([queue,Buffer.from('\n')])),false);
 for(const mutate of[a=>a.verbatimAnswer='未授权',a=>a.targets=[3311,13311,13312],a=>a.advanceFormalQueue=true,a=>a.stage='complete',a=>a.mode='reuse-old-regression',a=>a.questionItemId='other',a=>a.independentGates='skip-http',a=>a.fullRegression='historical',a=>a.queueSha256='changed']){const a=structuredClone(auth);mutate(a);assert.equal(A.allows(a,13311,false,queue),false);}
});
test('共享验收必须两项独立门通过、新完整npm全部通过且冻结一致，失败跳过旧结果或漂移不能完成',()=>{
 // These are predicate inputs only; no regression execution or certificate is fabricated.
 const gates=[{id:3311,exitCode:0,independentGatePassed:true},{id:13311,exitCode:0,independentGatePassed:true}],full={command:'npm test',fresh:true,exitCode:0,signal:null,error:null,counts:{tests:2,pass:2,fail:0,skipped:0,cancelled:0,todo:0}},hash='a'.repeat(64);
 assert.deepEqual(A.acceptanceIssues(gates,full,hash,hash),[]);
 for(const mutate of[f=>f.fresh=false,f=>f.command='selective tests',f=>f.exitCode=1,f=>f.signal='SIGTERM',f=>f.error='timeout',f=>f.counts.pass=1,f=>f.counts.fail=1,f=>f.counts.skipped=1,f=>f.counts.cancelled=1,f=>f.counts.todo=1]){const f=structuredClone(full);mutate(f);assert.ok(A.acceptanceIssues(gates,f,hash,hash).length>0);}
 assert.ok(A.acceptanceIssues(gates.slice(0,1),full,hash,hash).length>0);const failed=structuredClone(gates);failed[1].independentGatePassed=false;assert.ok(A.acceptanceIssues(failed,full,hash,hash).length>0);assert.ok(A.acceptanceIssues(gates,full,hash,'b'.repeat(64)).length>0);assert.ok(A.acceptanceIssues(gates,full,hash,hash,['source coverage missing']).length>0);
});
