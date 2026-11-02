(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BattleTypeRules=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const RULE='bwiki-388521';
const valid=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=4;
// Manually translated from the cited Wiki module; remote Lua is never executed.
function combine(a,b){if(!valid(a)||!valid(b))return null;return a===2&&b===2?4:a===0||b===0?(a+b)/4:(a+b)/2;}
function calculate(db,attack,defense){
 if(db.rules?.combination?.id!==RULE)return null;
 const ids=new Set(db.types.map(t=>t.id));
 if(![attack,defense].every(parts=>Array.isArray(parts)&&parts.length>=1&&parts.length<=2&&new Set(parts).size===parts.length&&parts.every(id=>ids.has(id))))return null;
 const cell=(a,d)=>{const n=db.baseMatrix?.[a]?.[d];return valid(n)?n:null;};
 const column=d=>attack.length===1?cell(attack[0],d):combine(cell(attack[0],d),cell(attack[1],d));
 const a=column(defense[0]);if(defense.length===1)return a;
 const b=column(defense[1]);if(a===null||b===null)return null;
 return attack.length===1?combine(a,b):(a+b)/2;
}
function freeze(value){if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
function create(input){
 const db=freeze(JSON.parse(JSON.stringify(input)));
 const lookup=(list,key)=>list.find(t=>typeof key==='number'?(t.id??t.combinationId)===key:t.name===key||t.aliases?.includes(key))??null;
 const getType=key=>lookup(db.types,key),getCombination=key=>lookup(db.combinations,key);
 function findCombination(ids){if(!Array.isArray(ids)||ids.length<1||ids.length>2||new Set(ids).size!==ids.length)return null;return db.combinations.find(c=>c.types.length===ids.length&&c.types.every(id=>ids.includes(id)))??null;}
 function baseMultiplier(a,d){a=getType(a);d=getType(d);const n=a&&d?db.baseMatrix?.[a.id]?.[d.id]:null;return valid(n)?n:null;}
 function multiplier(a,d){a=getCombination(a);d=getCombination(d);if(!a||!d)return null;const n=db.matrix?.[a.combinationId]?.[d.combinationId];return valid(n)?n:null;}
 function components(name,chart){
  const known=getCombination(name);
  if(!chart){if(!known)throw new Error('属性库未覆盖：'+name);return known.types;}
  const parts=chart.aliases?.[name];if(!Array.isArray(parts)||parts.length<1||parts.length>2)throw new Error('属性表未覆盖：'+name);
  const ids=parts.map(p=>getType(p)?.id);if(ids.some(id=>id===undefined)||new Set(ids).size!==ids.length)throw new Error('属性成分无效：'+name);
  if(known&&(ids.length!==known.types.length||ids.some((id,i)=>id!==known.types[i])))throw new Error('属性映射冲突：'+name);
  return ids;
 }
 function assertChart(chart){
  if(!chart)return;
  if(typeof chart.revision==='string'&&chart.revision.startsWith('seerapi:')&&chart.revision!=='seerapi:'+db.version.elementTypeHash)throw new Error('属性库版本冲突：'+chart.revision);
  if(!chart.rows||!chart.aliases)throw new Error('属性数据不完整');
  for(const name of Object.keys(chart.aliases))components(name,chart);
  for(const [a,row]of Object.entries(chart.rows))for(const [d,n]of Object.entries(row)){
   const local=baseMultiplier(a,d);if(local===null||!valid(n))throw new Error('属性数据不完整：'+a+' / '+d);
   if(local!==n)throw new Error(`属性倍率来源冲突：${a} → ${d}，快照 ${n}，本地库 ${local}`);
  }
 }
 function effectiveness(a,d,chart=null){
  const ap=components(a,chart),dp=components(d,chart);
  if(chart){for(const x of ap)for(const y of dp){const an=getType(x).name,dn=getType(y).name,n=chart.rows?.[an]?.[dn];if(!valid(n))throw new Error('属性数据不完整');if(n!==baseMultiplier(x,y))throw new Error(`属性倍率来源冲突：${an} → ${dn}，快照 ${n}，本地库 ${baseMultiplier(x,y)}`);}}
  // Existing caller-supplied compositions may lack a published combination ID.
  // Calculate from catalog components without inventing or registering an ID.
  const ac=getCombination(a),dc=getCombination(d),n=ac&&dc?multiplier(a,d):calculate(db,ap,dp);
  if(n===null)throw new Error('属性倍率缺少依据：'+a+' / '+d);return n;
 }
 function stab(moveType,fighterType,chart=null){
  if(db.rules?.stab?.id!=='bwiki-388558-stab')throw new Error('本系加成规则缺少依据');
  const move=components(moveType,chart),own=components(fighterType,chart);
  const same=move.length===own.length&&move.every(id=>own.includes(id));
  return same||(move.length===1&&own.includes(move[0]))?db.rules.stab.multiplier:1;
 }
 function matchups(key,direction='outgoing'){
  if(!['outgoing','incoming'].includes(direction))throw new RangeError('Unknown matchup direction');
  if(!getCombination(key))return null;
  return db.combinations.map(c=>{const n=direction==='outgoing'?multiplier(key,c.combinationId):multiplier(c.combinationId,key);return {combinationId:c.combinationId,name:c.name,multiplier:n,relation:n===null?'unknown':n===0?'immune':n<1?'resisted':n>1?'super-effective':'neutral'};});
 }
 // Opt-in compatibility adapter only. Neither the engine nor pet snapshots are mutated.
 function toLegacyChart(){
  if(db.rules?.combination?.id!==RULE)throw new Error('Unconfirmed combination rule');
  const rows={},aliases={};for(const a of db.types){rows[a.name]={};for(const d of db.types){const n=baseMultiplier(a.id,d.id);if(n===null)throw new Error('Incomplete type matrix');rows[a.name][d.name]=n;}}
  for(const c of db.combinations){const parts=c.types.map(id=>getType(id)?.name);if(!parts.length||parts.some(x=>!x))throw new Error('Incomplete combination');for(const name of c.aliases??[c.name]){if(aliases[name]&&JSON.stringify(aliases[name])!==JSON.stringify(parts))throw new Error('Conflicting type alias');aliases[name]=parts.slice();}}
  for(const a of db.combinations)for(const d of db.combinations){const n=multiplier(a.combinationId,d.combinationId);if(n===null||n!==calculate(db,a.types,d.types))throw new Error('Incomplete or inconsistent combination matrix');}
  return {rows,aliases,revision:'seerapi:'+db.version.elementTypeHash,provider:'seerapi'};
 }
 return Object.freeze({data:db,getType,getCombination,findCombination,baseMultiplier,multiplier,matchups,toLegacyChart,assertChart,effectiveness,stab});
}
return Object.freeze({create,calculate,combine,RULE});
});
