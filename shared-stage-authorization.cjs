'use strict';
const crypto=require('node:crypto');
const answer='允许共享一次新完整回归，校验冻结版本一致';
function allows(auth,id,complete,queue){
 return !complete&&[3311,13311].includes(id)&&auth?.verbatimAnswer===answer&&
  JSON.stringify(auth.targets)==='[3311,13311]'&&auth.temporaryImport===true&&
  auth.stage==='single'&&auth.advanceFormalQueue===false&&
  auth.mode==='shared-fresh-full-regression'&&
  auth.independentGates==='each-target-source-state-tests-and-real-http'&&
  auth.fullRegression==='one-new-npm-test-after-both-independent-gates-on-identical-frozen-inputs'&&
  auth.questionItemId==='["request_user_input_async","call_f427454698a84fc48d35aa90be489cbf",0]'&&
  auth.queueSha256===crypto.createHash('sha256').update(queue).digest('hex');
}
function acceptanceIssues(preflights,full,before,after,coverageErrors=[]){
 const errors=[...coverageErrors];
 if(JSON.stringify(preflights.map(x=>x.id))!=='[3311,13311]'||preflights.some(x=>x.exitCode!==0||!x.independentGatePassed))errors.push('both independent target gates required');
 if(full.command!=='npm test'||full.fresh!==true||full.exitCode!==0||full.signal||full.error)errors.push('one successful fresh full npm required');
 const c=full.counts;if(!c||!Number.isInteger(c.tests)||c.tests<=0||c.pass!==c.tests||['fail','skipped','cancelled','todo'].some(k=>c[k]!==0))errors.push('full regression summary must have all tests passed and no skipped/cancelled/todo');
 if(!/^[a-f0-9]{64}$/.test(before)||before!==after)errors.push('frozen inputs changed');
 return errors;
}
module.exports={allows,answer,acceptanceIssues};
