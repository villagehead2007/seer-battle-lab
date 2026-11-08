'use strict';
// Counterfactual state tests keep real source moves, templates, ordered tuples
// and hashes. Only souls, loadout classification and sibling compiled operations
// are removed to isolate a clause. Formal loadout/version tests run separately.
const E=require('../../dist/engine.js');
const WAIT=990001,HIT=990002,SPECIAL=990003,BOOST=990004;
function make(moveId,{id=3311,index=null,hp=600,targetHp=9000,soul=false,enemySpeed=100,enemyAttack=160,enemyMove=null}={}){
 const source=require(`../../research/LIGHT-SP-2026-11-07/candidate-${id}.json`),a=structuredClone(source),b=structuredClone(source);a.souls=soul?a.souls:[];b.souls=[];for(const s of[a,b]){delete s.trainingCompatibility;delete s.skillVersions;for(const m of s.moves)m.fifth=false;}
 b.id=900800;b.name='单词条对照';
 const base=structuredClone(a.moves[0]),neutral=(n,kind,power)=>({...base,id:n,name:'对照'+n,kind,power,pp:99,priority:0,alwaysHit:true,accuracy:100,critical:'0/16',fifth:false,effectIds:[],effectInstances:[],description:''});
 const wait=neutral(WAIT,'status',0),hit=neutral(HIT,'physical',40),special=neutral(SPECIAL,'special',40),boost={...structuredClone(a.moves.find(m=>m.id===20307)),id:BOOST};
 a.moves.push(wait,hit,boost);b.moves=[wait,hit,special,enemyMove?structuredClone(a.moves.find(m=>m.id===enemyMove)):boost];
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[[moveId,WAIT,HIT,BOOST],b.moves.map(m=>m.id)],criticals:false,seed:'light-source-'+moveId,builds:[{overrides:{maxHp:900,atk:160,spa:160,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:enemyAttack,spa:160,def:300,spd:300,spe:enemySpeed}}]});s.fighters[0].hp=hp;s.fighters[1].hp=targetHp;
 if(index!==null)s.moveDefinitions['wiki:'+moveId].operations=s.moveDefinitions['wiki:'+moveId].operations.filter(op=>op.index===index);
 s.auditMoveId=moveId;return s;
}
const turn=(s,move=s.auditMoveId,enemy=WAIT)=>E.resolveTurn(s,['wiki:'+move,'wiki:'+enemy]);
const sum=(s,type,side=0)=>(s.damageEvents??[]).filter(e=>e.sourceSide===side&&e.type===type).reduce((n,e)=>n+e.settledDamage,0);
const timer=(s,side,key,extra={},end=9)=>{s.fighters[side].effects[key]={start:1,end,...extra};return s;};
module.exports={E,make,turn,sum,timer,WAIT,HIT,SPECIAL,BOOST};
