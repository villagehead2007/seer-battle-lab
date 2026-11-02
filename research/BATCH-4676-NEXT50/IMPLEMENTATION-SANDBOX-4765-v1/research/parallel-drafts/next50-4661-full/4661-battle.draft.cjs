'use strict';
// Research battle helper. Initial soul isolation uses a restored E.SOULS dispatch facade; registered source/registry is unchanged.
const E=require('../../../dist/engine.js'),assert=require('node:assert/strict'),source=require('../../../research/4661-reviewed-snapshot.json'),key=id=>'wiki:'+id,keys=['atk','def','spa','spd','spe','acc'];
const entries=source.moves.flatMap(m=>m.effectInstances.map((x,index)=>({moveId:m.id,index,id:x.id,params:x.args})));
function ops(m,index=null){const all=E.WIKI.effectsEngine.compileInstances(m.effectInstances,source.effects,m);assert.equal(all.issue,'');return all.operations.filter(op=>index===null||op.index===index);}
function make(entry={moveId:37450,index:null},o={}){
 const a=structuredClone(o.ownSnapshot??source),b=structuredClone(o.enemySnapshot??source),m=source.moves.find(m=>m.id===entry.moveId),full=o.full===true;
 if(!full)for(const x of[a,b])for(const n of x.moves){n.effectInstances=[];n.effectIds=[];n.description='';n.deferredEffects=[];n.limitations=[];}
 const own=o.loadout??(m.fifth?[37450,28776,37451,28777,37460]:[m.id,...[37450,28776,37451,28777,37452].filter(id=>id!==m.id).slice(0,3),37460]),enemy=o.enemyLoadout??[37450,28776,37451,28777,37460];
 const originalSouls=E.SOULS,active=[!!o.soul,!!o.enemySoul];E.SOULS={...originalSouls,trait(f,k){if(f.soulId===1862&&!active[f.side])return undefined;return originalSouls.trait(f,k);},run(event,c){if(c.a.soulId===1862&&!active[c.a.side])return;return originalSouls.run(event,c);}};let s;try{s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[own,enemy],criticals:o.criticals??false,builds:o.realGrowth?[{research1862:{sumHalf:o.policies?.qualifiedSumHalf1862}},{}]:[{research1862:{sumHalf:o.policies?.qualifiedSumHalf1862},overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500,...o.aStats}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100,...o.bStats}}]});}finally{E.SOULS=originalSouls;}
 if(!o.soul)s.fighters[0].soulId=null;if(!o.enemySoul)s.fighters[1].soulId=null;
 if(!full&&!o.omit)s.moveDefinitions[key(m.id)].operations=ops(m,entry.index);
 s.rng=o.seed??0;s.auditMoveId=m.id;if(o.hit!==false){s.fighters[0].effects['攻击必中']={start:1,end:99};s.fighters[0].effects['属性必中']={start:1,end:99};}if(o.hp!==undefined)s.fighters[0].hp=o.hp;if(o.targetHp!==undefined)s.fighters[1].hp=o.targetHp;Object.assign(s.fighters[0].soulState,o.policies??{});return s;
}
function turn(s,m=s.auditMoveId,b=28776){return Object.assign(s,E.resolveTurn(s,[key(m),key(b)]));}
const timer=(s,side,k,data={},start=s.round,end=99)=>(s.fighters[side].effects[k]={start,end,...data},s);
module.exports={E,source,key,keys,entries,make,turn,timer,ops};
