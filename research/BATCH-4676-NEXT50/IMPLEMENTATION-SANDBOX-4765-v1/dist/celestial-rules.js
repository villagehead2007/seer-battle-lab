(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BattleCelestialRules=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const names=['寒月','血月','没夜之月'];
 const auxiliary=['狂暴','星赐','星哲','超频','砥砺','星赎','雷解','渐冻'];
 const restricted=['瘫痪','凝滞','魇昧'];
 function list(s){return s.celestials??=[];}
 function active(s,name,side,r){return list(s).find(x=>x.name===name&&x.side===side&&x.start<=r&&x.end>=r);}
 function transfer(s,from,to,r,clear=()=>{}){let n=0;for(const x of list(s))if(names.includes(x.name)&&x.side===from&&x.end>=r&&!x.transferLocked){if(x.name==='没夜之月')clear(from,'魇昧');x.side=to;n++;}return n;}
 function mirrors(f){return Math.min(4,Math.max(0,f.soulState.mirrors??0));}
 function gain(f,n){const value=(f.soulState.mirrorProgress??0)+Math.max(0,n);f.soulState.mirrors=Math.min(4,mirrors(f)+Math.floor(value/500));f.soulState.mirrorProgress=value%500;}
 function view(f,t){const out={...f.stages},n=mirrors(f);if(n>0)for(const k of Object.keys(out))if(out[k]<t.stages[k])out[k]=Math.max(n,t.stages[k]);return out;}
 function refreshViews(fs){for(const f of fs){if(f.soulId===2150)f.soulState.mirrorStageView=view(f,fs[1-f.side]);else delete f.soulState.mirrorStageView;}}
 function probability(s,f,n,r){const moon=active(s,'寒月',f.side,r);return n<=50&&moon&&!(moon.suspendedUntil>=r)?0:n;}
 function blocksStatus(s,source,target,name,r){return !!source&&String(target.number)==='3432'&&!restricted.includes(name)&&!!active(s,'没夜之月',source.side,r);}
 function remove(s,moon,clear){const at=list(s).indexOf(moon);if(at<0)return false;s.celestials.splice(at,1);if(moon.name==='没夜之月')clear(moon.side,'魇昧');return true;}
 function add(s,name,side,n,r){if(!names.includes(name)||!Number.isInteger(n)||n<1)throw Error('星体名称或回合数无效');const prior=active(s,name,side,r);if(prior){prior.end=Math.max(prior.end,r+n-1);return prior;}const moon={name,side,start:r,end:r+n-1};list(s).push(moon);return moon;}
 function collide(s,r){const cold=list(s).find(x=>x.name==='寒月'&&x.end>=r),blood=list(s).find(x=>x.name==='血月'&&x.end>=r);if(cold&&blood&&[0,1].includes(cold.side)&&cold.side===blood.side){cold.suspendedUntil=r+2;blood.suspendedUntil=r+2;}}
 function phase(s,fs,r,when,apply){const name=when==='start'?'寒月':'血月';for(const x of list(s))if(x.name===name&&x.start<=r&&x.end>=r&&!(x.suspendedUntil>=r)){if(!x.transferLocked&&fs[0].hp!==fs[1].hp)x.side=when==='start'?(fs[0].hp<fs[1].hp?0:1):(fs[0].hp>fs[1].hp?0:1);collide(s,r);}if(when==='start')for(const x of list(s))if(x.name==='没夜之月'&&x.start<=r&&x.end>=r)apply(x.side,'魇昧',x.end-r+1);}
 return Object.freeze({names,auxiliary,restricted,list,active,transfer,mirrors,gain,view,refreshViews,probability,blocksStatus,remove,add,phase});
});
