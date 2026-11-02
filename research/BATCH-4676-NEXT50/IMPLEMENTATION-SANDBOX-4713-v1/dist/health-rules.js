(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BattleHealthRules=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
// User-confirmed 2026-10-15: nominal max-HP drain healing is independent of
// damage mitigation, immunity and the opponent's remaining HP. Keep the
// existing damage-then-heal event order; both values share the requested base.
function drainPercent(c,amount,damageSource,healSource=damageSource,healMultiplier=1){
 if(!Number.isFinite(amount)||amount<0||!Number.isFinite(healMultiplier)||healMultiplier<0)throw Error('无效比例吸取量');
 const dealt=c.hurt(c.t,amount,damageSource,'percent');
 c.heal(c.a,amount*healMultiplier,healSource);
 return dealt;
}
// Q-BATCH-004: fixed-quantity drain heals the requested amount, not HP loss.
function drainFixed(c,amount,damageSource,healSource=damageSource){
 if(!Number.isFinite(amount)||amount<0)throw Error('无效固定吸取量');
 const dealt=c.hurt(c.t,amount,damageSource,'fixed');c.heal(c.a,amount,healSource);return dealt;
}

const stateNames=Object.freeze(['回体Ⅰ','失体Ⅰ']);
function state(f,name,round){const e=f.soulState?.healthStates?.[name];return e&&e.start<=round&&e.end>=round?e:null;}
function grantState(f,name,duration,round,source){if(!stateNames.includes(name)||!Number.isInteger(duration)||duration<1||duration>99||!Number.isInteger(round)||round<1||!source?.revision)throw Error('体力标记名称/时限/来源无效');const old=state(f,name,round),e={name,start:old?.start??round,end:round+duration-1,source:old?.source??{...source},lastRefreshSource:{...source},clearOnExit:true};(f.soulState.healthStates??={})[name]=e;return {state:e,refreshed:!!old};}
function removeState(f,name){const old=f.soulState?.healthStates?.[name];if(old)delete f.soulState.healthStates[name];return old??null;}
function expireStates(f,round){const out=[];for(const name of stateNames){const e=f.soulState?.healthStates?.[name];if(e&&e.end<=round){out.push(e);removeState(f,name);}}return out;}
return Object.freeze({drainPercent,drainFixed,stateNames,state,grantState,removeState,expireStates});
});
