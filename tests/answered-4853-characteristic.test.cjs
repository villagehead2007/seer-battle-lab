'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4853/snapshot.json');
const H=require('./helpers/remaining-battle.cjs')(source),{E,make,turn,key}=H;
test('4853已答永沐与真实五星特性：亮寒月封8%为0仍曝且不附异常，扰流改100按最终概率不曝',()=>{
 const opponent=require('../local-species.cjs').species(3066),special=opponent.moves.find(m=>m.kind==='special'&&m.power>0).id,ids=[special,...opponent.moves.filter(m=>!m.fifth&&m.id!==special).slice(0,3).map(m=>m.id),opponent.moves.find(m=>m.fifth).id];
 for(const groupId of [24,45])for(const mode of ['bright','moon','turbulence']){const s=make({move:38213,index:-1,soul:true,enemySource:opponent,enemyLoadout:ids});assert.equal(s.fighters[0].soulId,2038);s.moveDefinitions[key(special)].operations=[];s.fighters[1].build.characteristic=E.CHARACTERISTICS.normalize({groupId,star:5});
 if(mode==='bright')s.fighters[1].soulState.bright2009=2;if(mode==='moon')E.CELESTIAL_RULES.add(s,'寒月',1,2,1);if(mode==='turbulence')s.fighters[1].soulState.compute1987={turbulenceRound:1};turn(s,38213,special);
 assert.equal(!!s.fighters[1].soulState.exposure4853,mode!=='turbulence',groupId+'/'+mode);assert.equal(!!s.fighters[0].ailments['烧伤'],mode==='turbulence',groupId+'/'+mode);
 }
});
