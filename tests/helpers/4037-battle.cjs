'use strict';
const E=require('../../dist/engine.js'),source=require('../../research/4037-reviewed-snapshot.json');
const key=id=>'wiki:'+id,keys=['atk','def','spa','spd','spe','acc'];
const entries=source.moves.flatMap(m=>m.effectInstances.map((x,index)=>({moveId:m.id,index,id:x.id,params:x.args})));
function make(entry={moveId:10074,index:null},options={}){
 const a=structuredClone(source),b=structuredClone(source);delete a.skillVersions;delete b.skillVersions;delete a.additionalFifths;delete b.additionalFifths;delete a.skillVersions;delete b.skillVersions;delete a.additionalFifths;delete b.additionalFifths;
 const move=structuredClone(a.moves.find(m=>m.id===entry.moveId));move.limitations=[];
 if(entry.index!==null){move.effectInstances=[move.effectInstances[entry.index]];move.effectIds=move.effectInstances.map(x=>x.id);}
 if(options.omit){move.effectInstances=[];move.effectIds=[];move.description='';}
 const neutral=(id,kind='status',power=0,fifth=false)=>({...structuredClone(move),id,name:'4037测试'+id,kind,power,priority:0,pp:99,accuracy:100,alwaysHit:true,fifth,effectIds:[],effectInstances:[],description:'',limitations:[],sourceFlags:{is_fifth:fifth,is_special:false,classification:'regular'}});
 a.souls=options.soul?a.souls.filter(x=>x.id===options.soul):[];a.selectedSoulId=options.soul;
 a.moves=[move,neutral(900030,'special',100,!move.fifth),neutral(900031),neutral(900032),neutral(900033)];b.id=900688;b.name='4037对照';b.souls=[];
 b.moves=[neutral(900040,options.bPhysical?'physical':'special',40,true),neutral(900041),neutral(900042),neutral(900043),neutral(900044)];
 if(options.opponentMove){const m=structuredClone(source.moves.find(m=>m.id===options.opponentMove));if(options.opponentEffectId){m.effectInstances=m.effectInstances.filter(x=>x.id===options.opponentEffectId);m.effectIds=m.effectInstances.map(x=>x.id);}m.id=900042;m.fifth=false;m.sourceFlags={...m.sourceFlags,is_fifth:false};b.moves[2]=m;}
 const loadout=a.moves.map(m=>m.id);
 const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500};
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout,b.moves.map(m=>m.id)],criticals:options.criticals??false,builds:[{overrides:{...stats,...options.aStats}},{overrides:{...stats,spe:100,...options.bStats}}]});s.rng=options.seed??0;s.auditMoveId=move.id;
 if(options.hit!==false)s.fighters[0].effects['攻击必中']={start:1,end:99};
 if(options.hp!==undefined)s.fighters[0].hp=options.hp;if(options.targetHp!==undefined)s.fighters[1].hp=options.targetHp;
 return s;
}
const turn=(s,m=s.auditMoveId,other=900041)=>E.resolveTurn(s,[key(m),key(other)]),pick=id=>entries.filter(e=>e.id===id),timer=(s,side,k,data={},start=s.round,end=99)=>{s.fighters[side].effects[k]={start,end,...data};return s;};
module.exports={E,source,key,keys,entries,make,turn,pick,timer};

