(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BattleShieldRules=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
// Ordinary numeric shields retain the legacy aggregate and optionally track
// source layers. A later grant is consumed first; barriers remain separate.
function sync(f){
 const state=f.suitState, layers=state.shieldLayers;if(!layers)return;
 const total=layers.reduce((n,x)=>n+x.amount,0),delta=(state.shield??0)-total;
 if(delta>0)layers.push({source:null,amount:delta});
 if(delta<0){let left=-delta;for(let i=layers.length-1;i>=0&&left>0;i--){const n=Math.min(left,layers[i].amount);layers[i].amount-=n;left-=n;}}
 state.shieldLayers=layers.filter(x=>x.amount>0);
}
function add(f,amount,source=null){
 if(!Number.isInteger(amount)||amount<0)throw new RangeError('护盾值必须为非负整数');
 if(!f.suitState.shieldLayers)f.suitState.shieldLayers=f.suitState.shield>0?[{source:null,amount:f.suitState.shield}]:[];
 sync(f);if(amount>0)f.suitState.shieldLayers.push({source,amount});f.suitState.shield=(f.suitState.shield??0)+amount;return amount;
}
function refresh(f,amount,source){sync(f);const old=sourceValue(f,source);f.suitState.shield=(f.suitState.shield??0)-old;f.suitState.shieldLayers=(f.suitState.shieldLayers??[]).filter(x=>x.source!==source);return add(f,amount,source);}
function sourceValue(f,source){sync(f);return (f.suitState.shieldLayers??[]).filter(x=>x.source===source).reduce((n,x)=>n+x.amount,0);}
function absorb(f,amount){sync(f);const blocked=Math.min(Math.max(0,amount),f.suitState.shield??0);f.suitState.shield-=blocked;sync(f);return blocked;}
function consume(f){const amount=f.suitState.shield??0;f.suitState.shield=0;sync(f);return amount;}
// Barriers use a separate ledger. Existing aggregate-only barriers retain their
// numeric behavior; only source-aware grants create layers. Q100 establishes
// newest-first consumption for Moirai's barrier and coexisting barrier sources.
function barrierView(f){return {suitState:new Proxy(f.suitState,{get(s,k){return s[k==='shield'?'barrier':k==='shieldLayers'?'barrierLayers':k];},set(s,k,v){s[k==='shield'?'barrier':k==='shieldLayers'?'barrierLayers':k]=v;return true;}})};}
const refreshBarrier=(f,n,source)=>refresh(barrierView(f),n,source),addBarrier=(f,n,source)=>add(barrierView(f),n,source),absorbBarrier=(f,n)=>absorb(barrierView(f),n),consumeBarrier=f=>consume(barrierView(f)),barrierSourceValue=(f,source)=>sourceValue(barrierView(f),source),syncBarrier=f=>sync(barrierView(f));
return Object.freeze({add,refresh,absorb,consume,sourceValue,sync,refreshBarrier,addBarrier,absorbBarrier,consumeBarrier,barrierSourceValue,syncBarrier});
});
