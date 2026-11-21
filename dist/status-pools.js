(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('../data/statuses/statuses.json').records,require('../data/statuses/project-rules.json').effect2074,require('../data/random-pools/effects.json').effects);
  else root.BattleStatusPools=factory(root.BattleStatusCatalog.records,root.BattleStatusCatalog.rules.effect2074,root.BattleStatusCatalog.effectPoolPolicies);
})(typeof globalThis!=='undefined'?globalThis:this,function(records,rule,policies){
  'use strict';
  function pool(input=records,{includeRestricted=false}={}){
    const seen=new Set(),names=new Set();
    return input.map(row=>{
      if(!Number.isInteger(row.id)||row.id<0||seen.has(row.id)||!row.name||names.has(row.name))throw new TypeError('异常状态目录必须有唯一ID及名称');
      seen.add(row.id);names.add(row.name);return {id:row.id,name:row.name};
    }).filter(row=>(includeRestricted||!rule.excludedNames.includes(row.name))&&!(rule.pvpExcludedNames??[]).includes(row.name)).sort((a,b)=>a.id-b.id);
  }
  function integer(random,n){const u=random();if(!Number.isFinite(u)||u<0||u>=1)throw new RangeError('随机数必须在[0,1)');return Math.floor(u*n);}
  function defaultDuration(random){return rule.duration.min+integer(random,rule.duration.max-rule.duration.min+1);}
  function draw(count,random,input=records){
    return drawFromCandidates(count,random,pool(input));
  }
  function drawFromCandidates(count,random,candidates){
    candidates=[...candidates];
    if(!Number.isInteger(count)||count<1||count>candidates.length)throw new RangeError('2074异常种数必须为正整数且不能超过候选池');
    const result=[];
    for(let i=0;i<count;i++){
      const candidate=candidates.splice(integer(random,candidates.length),1)[0];
      const duration=defaultDuration(random);
      result.push({...candidate,duration});
    }
    return result;
  }
  function drawFromNames(count,random,names){
    if(new Set(names).size!==names.length)throw new Error('异常候选名称重复');
    const selected=names.map(name=>{const row=records.find(r=>r.name===name);if(!row)throw new Error('未知异常 '+name);return {id:row.id,name};});
    return drawFromCandidates(count,random,selected);
  }
  function configuration(effectId){if(effectId===2074||[1348,1394].includes(effectId)&&policies?.[effectId]?.status==='confirmed-project-rule')return {status:'confirmed-project-rule',sourceType:rule.sourceType,candidates:pool(),distribution:rule.distribution,duration:{...rule.duration}};const p=policies?.[effectId];return p?{status:p.status,candidates:p.candidatePool,distribution:p.distribution,duration:p.duration}:null;}
  function drawForEffect(effectId,count,random){const p=configuration(effectId);if(p?.status!=='confirmed-project-rule')throw new Error(`效果${effectId}随机异常池待核实（needs-source）`);return draw(count,random);}
  return Object.freeze({pool,defaultDuration,draw,drawFromNames,configuration,drawForEffect,sourceType:rule.sourceType,ruleId:rule.ruleId});
});
