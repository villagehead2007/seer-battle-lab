'use strict';
const E=require('../dist/engine.js'),s=require('../data/species/3291.json').snapshot;
const b=structuredClone(s);b.id=900329;b.souls=[];
for(const id of [25295,25294,30376,30380,30381]){
 const load=[30381,25295,25294,30376,30380];
 let x=E.createBattle({wikiSnapshots:[s,b],wikiLoadouts:[load,load],criticals:false,builds:[{overrides:{maxHp:9000,atk:100,def:500,spe:500}},{overrides:{maxHp:9000,atk:100,def:500,spe:100}}]});
 x.fighters[0].counts.rageDouble=1;x.fighters[1].effects['免弱']={start:1,end:4};
 const o=E.resolveTurn(x,['wiki:'+id,'potion:pp']);const a=o.fighters[0],t=o.fighters[1];console.log(JSON.stringify({id,pp:a.pp['wiki:'+id],stages:a.stages,effects:a.effects,counts:a.counts,fifthUses:a.fifthUses,targetHp:t.hp,targetEffects:t.effects,targetPP:t.pp}));
}
