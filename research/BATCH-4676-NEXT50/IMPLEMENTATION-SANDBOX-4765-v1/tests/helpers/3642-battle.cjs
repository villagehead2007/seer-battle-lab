'use strict';
const assert=require('node:assert/strict'),E=require('../../dist/engine.js');
const source=require('../../data/species/3642.json').snapshot;
const keys=['atk','def','spa','spd','spe','acc'],IDLE=900010,WAIT=900020,HIT=900021,FEAR=900022;
const key=id=>'wiki:'+id;
const entries=source.moves.flatMap(m=>m.effectInstances.map((x,index)=>({key:`3642:skill:${m.id}:${index}`,moveId:m.id,index,id:x.id,params:x.args})));
function neutral(id,kind='status',power=0){return {...structuredClone(source.moves[0]),id,name:'3642测试夹具'+id,kind,power,pp:99,priority:0,accuracy:100,alwaysHit:kind==='status',fifth:false,effectIds:[],effectInstances:[],description:''};}
function make(entry={moveId:10018,index:null},options={}){
 const a=structuredClone(source),b=structuredClone(source);a.selectedSoulId=options.soul??931;
 a.moves=E.WIKI.availableMoves(a);delete a.skillVersions;delete b.skillVersions;
 a.souls=options.soul?a.souls:[];
 for(const m of a.moves){if(m.id!==entry.moveId||entry.index!==null){m.effectInstances=m.id===entry.moveId?[m.effectInstances[entry.index]]:[];m.effectIds=m.effectInstances.map(x=>x.id);if(!m.effectIds.length)m.description='';}}
 if(options.omit){const m=a.moves.find(m=>m.id===entry.moveId);m.effectInstances=[];m.effectIds=[];m.description='';}
 a.moves.push(neutral(IDLE));b.id=900623;b.name='3642对照夹具';b.souls=[];b.gender={id:options.gender??2};
 const other=require('../../data/species/3576.json').snapshot;b.effects.push(other.effects.find(e=>e.id===10));const fear=structuredClone(other.moves.find(m=>m.id===20085));fear.id=FEAR;fear.fifth=false;fear.effectInstances=[fear.effectInstances[0]];fear.effectIds=[10];
 b.moves=[neutral(WAIT),neutral(HIT,'physical',40),fear,neutral(900023,'special',40)];
 if(options.opponentEffect){const x=options.opponentEffect,src=x.source??source,m=structuredClone(src.moves.find(m=>m.id===x.moveId));m.id=900023;m.fifth=false;m.effectInstances=[m.effectInstances[x.index]];m.effectIds=m.effectInstances.map(x=>x.id);b.moves[3]=m;b.effects.push(...src.effects.filter(e=>m.effectIds.includes(e.id)));Object.assign(b.typeChart.aliases,src.typeChart.aliases);}
 const loadout=options.loadout??[...new Set([entry.moveId,IDLE,...(source.moves.find(m=>m.id===entry.moveId).fifth?[]:[a.moves.find(m=>m.fifth).id]),10018,20992,10060,10055])].slice(0,5);
 const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500};
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout,b.moves.map(m=>m.id)],criticals:options.criticals??false,seed:'3642-state',builds:[{resistance:options.aResistance,overrides:{...stats,...options.aStats}},{overrides:{...stats,spe:100,...options.bStats}}]});
 s.rng=options.seed??0;s.auditMoveId=entry.moveId;
 if(options.hp!==undefined)s.fighters[0].hp=options.hp;if(options.targetHp!==undefined)s.fighters[1].hp=options.targetHp;
 if(options.hit!==false)s.fighters[0].effects['攻击必中']={start:1,end:99};
 return s;
}
function turn(s,move=s.auditMoveId,opponent=WAIT){return E.resolveTurn(s,[key(move),key(opponent)]);}
const wait=s=>turn(s,IDLE);
function timer(s,side,name,data={},end=99,start=s.round){s.fighters[side].effects[name]={start,end,...data};return s;}
function allStages(s,side,n){for(const k of keys)s.fighters[side].stages[k]=n;return s;}
const pick=id=>entries.filter(e=>e.id===id);
function seedCase(entry,check,options={}){for(let seed=0;seed<128;seed++){const s=make(entry,{...options,seed}),out=turn(s);if(check(out,s))return {s,out,seed};}assert.fail('找不到真实随机分支 '+entry.key);}
module.exports={E,source,keys,key,IDLE,WAIT,HIT,FEAR,entries,make,turn,wait,timer,allStages,pick,seedCase};
