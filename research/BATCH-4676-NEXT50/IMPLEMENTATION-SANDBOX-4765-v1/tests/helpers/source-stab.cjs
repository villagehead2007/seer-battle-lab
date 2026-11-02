'use strict';
const assert=require('node:assert/strict');
// Independent test oracle from cached Wiki 388558: a dual type owns both
// component single types as well as its exact combination. No engine calls.
module.exports=function sourceStab(move,own,chart){
 const attack=chart.aliases[move],fighter=chart.aliases[own];assert.ok(attack&&fighter,'Fixture must have source component mappings');
 return (attack.length===fighter.length&&attack.every(x=>fighter.includes(x)))||(attack.length===1&&fighter.includes(attack[0]))?1.5:1;
};
