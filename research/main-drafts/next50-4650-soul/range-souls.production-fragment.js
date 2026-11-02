
(()=>{
'use strict';
const frame1850=(f,r)=>f.soulState.stormRound1850?.round===r?f.soulState.stormRound1850:null;
registry[1850]={name:'风暴龙灵',sourceHash:'68420e15',traits:{
 attackReduction:f=>f.soulState.stormRound1850?.noEnemyBoost?.4:0,
 attackPriority:f=>f.soulState.stormPriority1850?.round===f.soulState.calculationRound?f.soulState.stormPriority1850.amount:0
},hooks:{
 roundStart(c){c.a.soulState.stormRound1850={round:c.round,low:c.a.hp<c.t.hp,noEnemyBoost:!Object.values(c.t.stages).some(x=>x>0)};},
 beforePriority1850(c){const e=frame1850(c.a,c.round);c.a.soulState.stormPriority1850={round:c.round,amount:0};if(!e||!['physical','special'].includes(c.m?.kind))return;const probability=e.low?1:.5,roll=c.random(),amount=roll<probability?1:0;c.a.soulState.stormPriority1850={round:c.round,amount,probability,roll};},
 beforeConsume1850(c){const e=frame1850(c.a,c.round);if(!e||c.m?.kind!=='status')return;const probability=e.low?1:.5,roll=c.random(),free=roll<probability;if(free)c.noPPConsumption=true;c.a.soulState.stormPP1850={round:c.round,move:c.m.id,probability,roll,free};},
 roundEnd(c){const e=frame1850(c.a,c.round);if(e?.noEnemyBoost&&c.a.hp>0)c.heal(c.a,(c.a.stats.maxHp-c.a.hp)*.4,'风暴龙灵已损体力回复');}
}};
})();
