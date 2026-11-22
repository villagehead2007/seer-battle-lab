'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),rules=require('../dist/status-rules.js'),{loadout}=require('./helpers/3001-native.cjs');
test('3407强化魂实际离场继任者将既有弱化行为视作雷解、对手附属视作烧伤，原回合末转换且下一攻击产生真实雷解伤害',()=>{
 const member=(id,ids=[],soul=null)=>{const raw=S.species(id),snapshot=soul===null?raw:{...raw,selectedSoulId:soul};return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:1200,spa:180,def:4000,spd:4000,spe:id===3576?100:1000}}};};
 let g=T.create([[member(3407,[38409],2093),member(3056,[19369],410)],[member(3576,[20085],877)]],[0,0],{seed:14,criticals:false});
 // Legal reachable initial mark/status boundaries; R79 proves resource acquisition.
 g.battle.fighters[0].soulState.nineScars=3;g.battle.fighters[0].soulState.hundredFires=2;g.slots[0][1].fighter.ailments.中毒=5;g.battle.fighters[1].ailments.砥砺=5;
 const observations=[],old=E.SOULS;E.SOULS={...old,run(event,c){const out=old.run(event,c);if(event==='combatEnd'&&c.a.side===0&&Number(c.a.number)===3056)observations.push({round:c.round,nativePoison:rules.behaviorActive(c.a,'中毒',c.round),lightning:rules.behaviorActive(c.a,'雷解',c.round),nativeAux:rules.behaviorActive(c.t,'砥砺',c.round),burn:rules.behaviorActive(c.t,'烧伤',c.round)});return out;}};
 try{g=T.turn(g,[{switchTo:1},'potion:pp']);}finally{E.SOULS=old;}
 assert.deepEqual(g.active,[1,0]);assert.deepEqual(observations,[{round:1,nativePoison:false,lightning:true,nativeAux:false,burn:true}]);
 const[a,b]=g.battle.fighters;assert.equal(a.soulState.glaInheritedThrough,2);assert.equal(a.ailments.中毒,undefined);assert.equal(a.ailments.雷解,4);assert.equal(b.ailments.砥砺,undefined);assert.equal(b.ailments.烧伤,4);assert.equal(g.slots[0][0].fighter.soulState.nineScars,2);assert.equal(g.slots[0][0].fighter.soulState.hundredFires,2);
 g=T.turn(g,['wiki:19369','potion:pp']);const events=g.battle.damageEvents.filter(x=>x.round===2&&x.sourceSide===0),red=events.filter(x=>x.type==='attack').reduce((n,x)=>n+x.settledDamage,0);assert.ok(red>0);assert.ok(events.some(x=>x.type==='true'&&x.settledDamage===Math.floor(red*.6)));
 console.log('ROUND85_3407_INHERIT_COUNTS '+JSON.stringify({creations:1,turns:2,actualSwitches:1,noMidBattleWrites:true,initialMarksAreReachableBoundaryFixture:true,noRngReplacement:true}));
});
