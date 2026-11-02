'use strict';
// Static helper draft. No test has run. Real native base fields; skill payloads are deliberately isolated.
const E=require('../../../dist/engine.js'),source=require('../../../research/4646-reviewed-snapshot.json');
if(E.SOULS.registry[1846]?.sourceHash!=='ddacacad')throw Error('1846 private exact-source registration required');
const attack=source.moves.find(m=>m.kind==='physical'&&m.priority===0),status=source.moves.find(m=>m.kind==='status'&&m.priority===0),fifth=source.moves.find(m=>m.fifth),key=id=>'wiki:'+id;
const nativeIds=[attack.id,status.id,...source.moves.filter(m=>m.id!==attack.id&&m.id!==status.id&&!m.fifth).slice(0,2).map(m=>m.id),fifth.id];
function make(o={}){const own=structuredClone(source),enemy=structuredClone(source);for(const p of[own,enemy])for(const m of p.moves){const keep=m.id===fifth.id&&o.keepFifth697;m.effectIds=keep?[697]:[];m.effectInstances=keep?[m.effectInstances[0]]:[];m.description=keep?m.effectInstances[0].description:'';m.deferredEffects=[];m.limitations=[];}own.souls=o.soul===false?[]:own.souls;enemy.souls=[];enemy.id=926446;enemy.name='1846原生基础隔离对照';const stats={maxHp:9000,atk:300,spa:300,def:300,spd:300,spe:500};const s=E.createBattle({wikiSnapshots:[own,enemy],wikiLoadouts:[nativeIds,nativeIds],criticals:false,builds:[{overrides:{...stats,...o.aStats}},{overrides:{...stats,spe:100,...o.bStats}}]});Object.assign(s.fighters[0].soulState,o.state??{});return s;}
const turn=(s,a=attack.id,b=status.id)=>Object.assign(s,E.resolveTurn(s,[key(a),key(b)]));
const timer=(s,side,name,data={},start=s.round,end=99)=>(s.fighters[side].effects[name]={start,end,...data},s);
module.exports={E,source,attack,status,fifth,key,nativeIds,make,turn,timer};

