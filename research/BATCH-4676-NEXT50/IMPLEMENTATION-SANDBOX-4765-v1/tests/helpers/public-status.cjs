'use strict';
const E=require('../../dist/engine.js'),S=E.STATUS_RULES;
const key=(side,slot)=>'wiki:'+((901800+side)*10+slot);
function snapshot(side,ops=[]){const id=901800+side,R=E.WIKI.effectsEngine;return {id,name:'公共状态行为夹具',type:'普通',base:{maxHp:100,atk:100,def:100,spa:100,spd:100,spe:100},souls:[],source:{provider:'seerapi'},typeChart:{revision:'public-status-test',aliases:{普通:['普通']},rows:{普通:{普通:1}}},effects:ops.map(([id])=>({id,argsNum:R.registry[id].argsNum,template:R.registry[id].template})),missingEffects:[],moves:Array.from({length:5},(_,i)=>({id:id*10+i,name:'公共状态招'+i,provider:'seerapi',kind:i===0?'physical':i>=3?'special':'status',type:'普通',power:i===0||i>=3?120:0,pp:30,priority:0,accuracy:100,alwaysHit:true,critical:'1/16',level:i,fifth:i===4,effectIds:i===1?ops.map(x=>x[0]):[],effectInstances:i===1?ops.map(([id,args])=>({id,args})):[],description:''}))};}
function game(a=[],b=[]){const s=E.createBattle({wikiSnapshots:[snapshot(0,a),snapshot(1,b)],criticals:false,seed:'public-status',builds:[{overrides:{maxHp:1600,atk:200,spa:200,def:200,spd:200,spe:500}},{overrides:{maxHp:1600,atk:200,spa:200,def:200,spd:200,spe:100}}]});s.rng=0;return s;}
const turn=(s,a=2,b=2)=>E.resolveTurn(s,[key(0,a),key(1,b)]);
const apply=(s,side,name,duration=3,source=1-side)=>S.attempt(s.fighters[side],name,s.round,{duration,source:s.fighters[source]});
const timer=(s,side,name,data={})=>s.fighters[side].effects[name]={start:s.round,end:99,...data};
module.exports={E,S,key,game,turn,apply,timer};
