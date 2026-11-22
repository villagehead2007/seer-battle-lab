'use strict';
const E=require('../../dist/engine.js'),T=require('../../dist/team-engine.js'),store=require('../../local-species.cjs');
function member(id,soul,skill){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;const moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
function after(id,soul,seed){
 let g=T.create([[member(id,soul,id===4125?14102:null),member(2987)],[member(3056,null,10127),member(2988)]],[0,0],{seed,criticals:false});
 if(id===4125){g=T.turn(g,['wiki:14102','potion:pp']);g=T.turn(g,['wiki:14102','potion:pp']);}
 else g=T.turn(g,['potion:pp',id===4509?'wiki:10127':'potion:pp']);return g;
}
module.exports={after,E,T};
