'use strict';const H=require('./remaining-4930.cjs');
// Isolate legal post-expiry mark states; real-entry coverage uses make({soul:true}). All current combat hooks remain live.
function partialMake(o={}){const old=H.E.SOULS;H.E.SOULS={...old,run(e,c){if(e==='battleStart'&&c.a.soulId===2125){old.registry[2125].abilities.initialize(c);return;}return old.run(e,c);}};try{return H.make({...o,soul:true});}finally{H.E.SOULS=old;}}
const mark=(s,side,name,end=5,start=1)=>((s.fighters[side].soulState.fiveMarks2125??={})[name]={start,end,sourceSoul:2125,sourceHash:'4c65a1e0'});
function observe(fn,run){const old=H.E.SOULS;H.E.SOULS={...old,run(e,c){old.run(e,c);fn(e,c);}};try{return run();}finally{H.E.SOULS=old;}}
module.exports={...H,partialMake,mark,observe};
