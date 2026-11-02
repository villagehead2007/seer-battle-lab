(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BattlePPRules=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const consuming=new WeakSet();
  // A reduction floor applies to effect writes, never normal use consumption.
  // Accessors clone/serialize as ordinary values; no Proxy enters battle state.
  function protectReduction(f,floor){if(!(floor>0))return;for(const id of f.moves){let value=f.pp[id];Object.defineProperty(f.pp,id,{enumerable:true,configurable:true,get(){return value;},set(next){value=!consuming.has(f)&&next<value?Math.max(Math.min(value,floor),next):next;}});}}
  // Q038–Q043, project_rule/user_confirmed. Slots are current loadout order.
  function restore(f,definitions,amount){
    const results=[];for(const id of f.moves){const before=f.pp[id],max=definitions[id]?.pp;if(!Number.isFinite(max))throw new Error('缺少技能PP上限');const restored=Math.max(0,Math.min(max-before,amount));f.pp[id]=before+restored;results.push({id,restored});}return results;
  }
  function absorb(receiver,donor,amount,definitions,{blocked=false,restoreBlocked=false}={}){
    if(!Number.isInteger(amount)||amount<0)throw new RangeError('吸取PP必须为非负整数');
    const result={requestedPerSlot:amount,blocked:!!blocked,slots:[],deducted:0,restored:0};
    if(blocked||receiver.hp<=0||donor.hp<=0)return result;
    // Validate all maxima before making any changes.
    for(const id of receiver.moves)if(!Number.isFinite(definitions[id]?.pp))throw new Error('缺少技能PP上限');
    donor.moves.forEach((id,index)=>{const receiverId=receiver.moves[index]??null,old=donor.pp[id];donor.pp[id]=old-Math.min(Math.max(0,old),amount);const deducted=old-donor.pp[id];
      const restored=receiverId===null||restoreBlocked?0:Math.max(0,Math.min(deducted,definitions[receiverId].pp-receiver.pp[receiverId]));if(receiverId!==null)receiver.pp[receiverId]+=restored;
      result.slots.push({index,donorId:id,receiverId,deducted,restored,discarded:deducted-restored});result.deducted+=deducted;result.restored+=restored;
    });return result;
  }
  function usable(f,id,ignorePP=false){return f.moves.includes(id)&&(ignorePP||f.pp[id]>0);}
  function absorbSelected(receiver,donor,donorKey,amount,definitions,options={}){
    const index=donor.moves.indexOf(donorKey);if(index<0)throw new Error('所选吸取技能不属于对手当前携带槽位');
    const receiverKey=receiver.moves[index];
    const result=absorb({...receiver,moves:receiverKey?[receiverKey]:[]},{...donor,moves:[donorKey]},amount,definitions,options);
    result.selectedSlotIndex=index;for(const slot of result.slots)slot.index=index;return result;
  }
  function consume(f,id,amount,ignorePP=false){if(!Number.isInteger(amount)||amount<0)throw new RangeError('PP消耗必须为非负整数');if(!usable(f,id,ignorePP))return false;consuming.add(f);try{f.pp[id]=Math.max(0,f.pp[id]-amount);}finally{consuming.delete(f);}return true;}

  // Sourced PP marks are distinct from PVP ailments. The original acquisition
  // source survives a refresh; the refresh source is recorded separately.
  const stateNames=Object.freeze(['回能Ⅰ','失能Ⅰ']);
  function state(f,name,round){const e=f.soulState?.ppStates?.[name];return e&&e.start<=round&&e.end>=round?e:null;}
  function grantState(f,name,duration,round,source){if(!stateNames.includes(name)||!Number.isInteger(duration)||duration<1||duration>99||!Number.isInteger(round)||round<1||!source?.revision)throw Error('PP标记名称/时限/来源无效');const old=state(f,name,round),e={name,family:name==='回能Ⅰ'?'recover':'weaken',amount:1,start:old?.start??round,end:round+duration-1,source:old?.source??{...source},lastRefreshSource:{...source},clearOnExit:true};(f.soulState.ppStates??={})[name]=e;return {state:e,refreshed:!!old};}
  function removeState(f,name){const old=f.soulState?.ppStates?.[name];if(old)delete f.soulState.ppStates[name];return old??null;}
  function expireStates(f,round){const removed=[];for(const name of stateNames){const e=f.soulState?.ppStates?.[name];if(e&&e.end<=round){removed.push(e);removeState(f,name);}}return removed;}
  function applyStates(f,definitions,round,{restoreState,reductionBlocked=false}={}){const events=[];for(const name of stateNames){const e=state(f,name,round);if(!e)continue;const before={...f.pp};let blocked=false;if(e.family==='recover'){if(typeof restoreState!=='function')throw Error('PP回复标记缺少来源恢复接口');restoreState(f,e.amount,e.source);}else{blocked=!!reductionBlocked;if(!blocked)for(const k of f.moves)f.pp[k]=Math.max(0,f.pp[k]-e.amount);}events.push({name,source:e.source,blocked,slots:f.moves.map(id=>({id,before:before[id],after:f.pp[id],change:f.pp[id]-before[id]}))});}return events;}
  return Object.freeze({restore,absorb,absorbSelected,usable,consume,protectReduction,stateNames,state,grantState,removeState,expireStates,applyStates,stateSourceType:'seerapi',sourceType:'user_confirmed'});
});
