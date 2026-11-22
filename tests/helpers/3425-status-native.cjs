'use strict';
const assert=require('node:assert/strict'),H=require('./3425-native.cjs'),T=require('../../dist/team-engine.js'),store=require('../../local-species.cjs'),{loadout}=require('./3001-native.cjs'),{E,versions}=H,pp='potion:pp',status='wiki:20889';
function member(snapshot,moves=[],stats={}){const selected=loadout(snapshot,moves);assert.equal(E.WIKI.assess(snapshot,selected).supported,true);return{snapshot,moves:selected,build:{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:1000,...stats}}};}
function make(source,seed='3425-native-status'){const g=T.create([[member(source,[10047]),member(store.species(3056))],[member(store.species(2989),[20889],{spe:100})]],[0,0],{seed,criticals:false});assert.equal(Number(g.battle.fighters[0].number),3425);assert.ok([740,1030].includes(g.battle.fighters[0].soulId));g.battle.fighters[0].hp=1000;return g;}
const turn=(g,a=pp,b=pp)=>T.turn(g,[a,b]);
const equipped=g=>g.battle.fighters[0].moves.includes('wiki:37198');
function firstFailure(source,prefix='3425-first-fail'){for(let i=0;i<32;i++){const seed=prefix+'-'+i,g=turn(make(source,seed),pp,status);if(g.battle.fighters[1].stages.spe===1){assert.equal(g.battle.fighters[0].soulState.oscarGuaranteed,true);return{g,seed,attempts:i+1};}}throw Error('32 legal deterministic seeds did not exercise50% failure');}
module.exports={E,T,versions,pp,status,make,turn,equipped,firstFailure};
