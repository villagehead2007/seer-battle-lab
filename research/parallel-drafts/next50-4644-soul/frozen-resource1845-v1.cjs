'use strict';
// Resource-only frozen draft. Not tested; contains no natural damage, PP restoration or extra-action hooks.
const ids1845=c=>{const ids=c.a.soulState.constructions1845??[];if(!Array.isArray(ids)||ids.some(x=>!Number.isInteger(x)||x<1||x>4)||new Set(ids).size!==ids.length)throw Error('1845 malformed sourced construction set');return ids;};
const mode1845=c=>ids1845(c).length>=2?'active':'guard';
module.exports={name:'克雷弗德·德莱赫默资源接口（隔离草稿）',sourceHash:'c687be18',traits:{},abilities:{
  constructionIds(c){return ids1845(c).slice();},
  constructionCount(c){return ids1845(c).length;},
  mode(c){return mode1845(c);},
  grantConstruction(c,id){
    if(!Number.isInteger(id)||id<1||id>4)throw Error('1845 construction id must be sourced I–IV');
    const current=ids1845(c),before=current.length,added=!current.includes(id);
    if(added)c.a.soulState.constructions1845=[...current,id].sort((a,b)=>a-b);
    return{before,after:ids1845(c).length,added,mode:mode1845(c)};
  }
},hooks:{battleStart(c){c.a.soulState.constructions1845=[];}}};
