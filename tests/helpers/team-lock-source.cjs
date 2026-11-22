'use strict';
const E=require('../../dist/engine.js'),T=require('../../dist/team-engine.js'),store=require('../../local-species.cjs');
const members=new Map();
function config(id){if(!members.has(id)){const snapshot=store.species(id);members.set(id,{snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000}}});}return structuredClone(members.get(id));}
const cases=[[3383,25516],[3407,25584],[3430,25649],[3524,31569],[3550,25898],[3576,31838],[4125,27345],[4169,27453],[4264,27696],[4270,35352],[4305,27797]];
function battle(id,skill,seed){
 const own=config(id),foe=config(3056);if(!own.moves.includes(skill))own.moves[1]=skill;
 foe.moves[1]=10127;own.build.overrides.spe=1200;own.build.overrides.atk=900;foe.build.overrides.spe=200;
 if(id===3550)foe.build.overrides.atk=9000;
 if(id===4264)foe.moves[2]=20117;
 const g=T.create([[own],[foe,config(2988)]],[0,0],{seed,criticals:false});
 g.battle.fighters[0].effects['攻击必中']={start:1,end:2};
 if([3576,4270].includes(id))g.battle.fighters[1].effects['攻击必中']={start:1,end:2};
 const enemy=[3383,3407,3430,3550,4125,4169].includes(id)?'wiki:10127':id===4264?'wiki:20117':'potion:pp';
 return T.turn(g,['wiki:'+skill,enemy]);
}
module.exports={battle,cases};
