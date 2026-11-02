'use strict';
// Passive classification query. No random draw, status application or registration.
const catalog=require('./status-database.cjs');
const required=['isAbnormal','isRestrictedClass','restrictsSwitching'];
function inspectNonRestricted(records=catalog.list()){
 const candidates=[],excluded=[],unresolved=[],seen=new Set();
 for(const row of records){
  if(!Number.isInteger(row.id)||row.id<0||seen.has(row.id))throw new TypeError('状态分类记录ID必须唯一且为非负整数');
  seen.add(row.id);const c=row.classification??{};
  for(const k of required)if(c[k]!==undefined&&c[k]!==null&&typeof c[k]!=='boolean')throw new TypeError('分类必须为boolean或null: '+k);
  const reasons=[];
  if(c.isAbnormal===false)reasons.push('not-abnormal');
  if(c.isRestrictedClass===true)reasons.push('restricted-class');
  if(c.restrictsSwitching===true)reasons.push('switching-restricted');
  if(reasons.length){excluded.push({id:row.id,name:row.name,reasons});continue;}
  const missing=required.filter(k=>c[k]===null||c[k]===undefined);
  if(missing.length){unresolved.push({id:row.id,name:row.name,missing});continue;}
  candidates.push({id:row.id,name:row.name});
 }
 for(const list of [candidates,excluded,unresolved])list.sort((a,b)=>a.id-b.id);
 const candidateIds=candidates.map(r=>r.id);
 return {status:unresolved.length?'needs-source':candidateIds.length?'classification-complete':'confirmed-empty',
  candidates,excluded,unresolved,candidateIds,
  // A partial confirmed subset must not silently replace the complete pool.
  poolIds:unresolved.length?null:candidateIds.slice(),runtimeConnected:false};
}
module.exports=Object.freeze({inspectNonRestricted});
