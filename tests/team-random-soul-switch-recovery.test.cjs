'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),D=require('../dist/battle-display.js');
const {after,E,T}=require('./helpers/team-random-soul.cjs'),cases=require('../research/TEAM-STAGE-2/random-soul-switch-seeds-v1.json').cases;
test("4125原魂印1356真实抽到瘫痪后禁换，来源下场不撤销，全部异常到期后可实际换入",()=>{const row=cases[0];let g=after(row.id,row.soul,row.seed);assert.equal(g.battle.fighters[0].soulId,row.soul);assert.equal(g.battle.fighters[0].soulHash,row.sourceHash);assert.ok(g.battle.fighters[1].ailments[row.status]>=g.battle.round);
 const end=g.battle.fighters[1].ailments[row.status],allEnd=Math.max(...Object.values(g.battle.fighters[1].ailments));assert.deepEqual(T.candidates(g,1),[]);
 const before=structuredClone(g);D.fighter(g.battle.fighters[1],g.battle.round);D.team(g,1);assert.ok(E.describeEffects(g.battle.fighters[1],g.battle.round).some(x=>x.includes(row.status)));assert.deepEqual(g,before);
 assert.throws(()=>T.turn(g,['potion:pp',{switchTo:1}]));assert.deepEqual(g,before);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.active[0],1);if(g.battle.round<=end)assert.equal(g.battle.fighters[1].ailments[row.status],end);
 while(g.battle.round<=allEnd)g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.phase,'action');assert.ok(T.candidates(g,1).includes(1));
 g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.active[1],1);

});
test("4125原魂印1356真实抽到凝滞后禁换，来源下场不撤销，全部异常到期后可实际换入",()=>{const row=cases[1];let g=after(row.id,row.soul,row.seed);assert.equal(g.battle.fighters[0].soulId,row.soul);assert.equal(g.battle.fighters[0].soulHash,row.sourceHash);assert.ok(g.battle.fighters[1].ailments[row.status]>=g.battle.round);
 const end=g.battle.fighters[1].ailments[row.status],allEnd=Math.max(...Object.values(g.battle.fighters[1].ailments));assert.deepEqual(T.candidates(g,1),[]);
 const before=structuredClone(g);D.fighter(g.battle.fighters[1],g.battle.round);D.team(g,1);assert.ok(E.describeEffects(g.battle.fighters[1],g.battle.round).some(x=>x.includes(row.status)));assert.deepEqual(g,before);
 assert.throws(()=>T.turn(g,['potion:pp',{switchTo:1}]));assert.deepEqual(g,before);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.active[0],1);if(g.battle.round<=end)assert.equal(g.battle.fighters[1].ailments[row.status],end);
 while(g.battle.round<=allEnd)g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.phase,'action');assert.ok(T.candidates(g,1).includes(1));
 g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.active[1],1);

});
test("4459原魂印1672真实抽到凝滞后禁换，来源下场不撤销，全部异常到期后可实际换入",()=>{const row=cases[2];let g=after(row.id,row.soul,row.seed);assert.equal(g.battle.fighters[0].soulId,row.soul);assert.equal(g.battle.fighters[0].soulHash,row.sourceHash);assert.ok(g.battle.fighters[1].ailments[row.status]>=g.battle.round);
 const end=g.battle.fighters[1].ailments[row.status],allEnd=Math.max(...Object.values(g.battle.fighters[1].ailments));assert.deepEqual(T.candidates(g,1),[]);
 const before=structuredClone(g);D.fighter(g.battle.fighters[1],g.battle.round);D.team(g,1);assert.ok(E.describeEffects(g.battle.fighters[1],g.battle.round).some(x=>x.includes(row.status)));assert.deepEqual(g,before);
 assert.throws(()=>T.turn(g,['potion:pp',{switchTo:1}]));assert.deepEqual(g,before);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.active[0],1);if(g.battle.round<=end)assert.equal(g.battle.fighters[1].ailments[row.status],end);
 while(g.battle.round<=allEnd)g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.phase,'action');assert.ok(T.candidates(g,1).includes(1));
 g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.active[1],1);

});
test("4509原魂印1722真实抽到瘫痪后禁换，来源下场不撤销，全部异常到期后可实际换入",()=>{const row=cases[3];let g=after(row.id,row.soul,row.seed);assert.equal(g.battle.fighters[0].soulId,row.soul);assert.equal(g.battle.fighters[0].soulHash,row.sourceHash);assert.ok(g.battle.fighters[1].ailments[row.status]>=g.battle.round);
 const end=g.battle.fighters[1].ailments[row.status],allEnd=Math.max(...Object.values(g.battle.fighters[1].ailments));assert.deepEqual(T.candidates(g,1),[]);
 const before=structuredClone(g);D.fighter(g.battle.fighters[1],g.battle.round);D.team(g,1);assert.ok(E.describeEffects(g.battle.fighters[1],g.battle.round).some(x=>x.includes(row.status)));assert.deepEqual(g,before);
 assert.throws(()=>T.turn(g,['potion:pp',{switchTo:1}]));assert.deepEqual(g,before);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.active[0],1);if(g.battle.round<=end)assert.equal(g.battle.fighters[1].ailments[row.status],end);
 while(g.battle.round<=allEnd)g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.phase,'action');assert.ok(T.candidates(g,1).includes(1));
 g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.active[1],1);

});
test("4509原魂印1722真实抽到凝滞后禁换，来源下场不撤销，全部异常到期后可实际换入",()=>{const row=cases[4];let g=after(row.id,row.soul,row.seed);assert.equal(g.battle.fighters[0].soulId,row.soul);assert.equal(g.battle.fighters[0].soulHash,row.sourceHash);assert.ok(g.battle.fighters[1].ailments[row.status]>=g.battle.round);
 const end=g.battle.fighters[1].ailments[row.status],allEnd=Math.max(...Object.values(g.battle.fighters[1].ailments));assert.deepEqual(T.candidates(g,1),[]);
 const before=structuredClone(g);D.fighter(g.battle.fighters[1],g.battle.round);D.team(g,1);assert.ok(E.describeEffects(g.battle.fighters[1],g.battle.round).some(x=>x.includes(row.status)));assert.deepEqual(g,before);
 assert.throws(()=>T.turn(g,['potion:pp',{switchTo:1}]));assert.deepEqual(g,before);
 g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.active[0],1);if(g.battle.round<=end)assert.equal(g.battle.fighters[1].ailments[row.status],end);
 while(g.battle.round<=allEnd)g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.phase,'action');assert.ok(T.candidates(g,1).includes(1));
 g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.active[1],1);

});
