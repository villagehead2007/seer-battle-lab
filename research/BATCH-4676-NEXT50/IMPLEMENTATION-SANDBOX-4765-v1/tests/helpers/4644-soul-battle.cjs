'use strict';
// Isolated real-native skill bases only; all skill effects removed in battle clones, original source retained separately.
const E=require('../../dist/engine.js'),source=require('../../research/4644-reviewed-snapshot.json');
if(E.SOULS.registry[1845]?.sourceHash!=='c687be18')throw Error('1845 private preload/current production exact soul required');
const attack=source.moves.find(m=>m.kind==='physical'&&m.priority===0),status=source.moves.find(m=>m.kind==='status'&&m.priority===0),fifth=source.moves.find(m=>m.fifth),key=id=>'wiki:'+id;
const nativeIds=[attack.id,status.id,...source.moves.filter(m=>m.id!==attack.id&&m.id!==status.id&&!m.fifth).slice(0,2).map(m=>m.id),fifth.id];
function make(options={}){const own=structuredClone(source),enemy=structuredClone(source);for(const s of [own,enemy])for(const m of s.moves){m.effectIds=[];m.effectInstances=[];m.description='';m.deferredEffects=[];m.limitations=[];}own.souls=options.soul===false?[]:own.souls;enemy.souls=[];enemy.id=926444;enemy.name='1845隔离对照';if(options.bType)enemy.type=options.bType;const stats={maxHp:9000,atk:300,spa:300,def:300,spd:300,spe:500};const s=E.createBattle({wikiSnapshots:[own,enemy],wikiLoadouts:[nativeIds,nativeIds],criticals:false,builds:[{overrides:{...stats,...options.aStats}},{overrides:{...stats,spe:100,...options.bStats}}]});for(const id of options.constructions??[])E.SOULS.registry[1845].abilities.grantConstruction({a:s.fighters[0]},id);Object.assign(s.fighters[0].soulState,options.policies??{});return s;}
const turn=(s,a=attack.id,b=status.id)=>Object.assign(s,E.resolveTurn(s,[key(a),key(b)])),timer=(s,side,name,data={},start=s.round,end=99)=>(s.fighters[side].effects[name]={start,end,...data},s);
module.exports={E,source,attack,status,fifth,key,nativeIds,make,turn,timer};
