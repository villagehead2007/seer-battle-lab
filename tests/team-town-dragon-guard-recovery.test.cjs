'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,soul,skill){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;const moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000}}};}
test('金祖之龍在场下乔特鲁德所在队伍初始实际受到臣服时，当回合后续疲惫被免疫',()=>{
 for(const lead of [0,1]){
 let g=T.create([[{...member(3056,null,23287),build:{overrides:{maxHp:9000,spe:9999}}},{...member(4186,2028,24739),build:{overrides:{maxHp:9000,spe:9999}}}],[member(4468,null,36386)]],[lead,0],{seed:13,criticals:false});
 assert.equal(g.battle.fighters[0].ailments['臣服'],3);assert.equal(g.battle.teamDragons2028[0].gold,true);
 const before=structuredClone(g);assert.equal(D.team(g,0).find(x=>x.name==='额外龙守护').value,'己方当回合免疫异常');assert.deepEqual(g,before);
 g.battle.fighters[1].effects['PP保护']={start:1,end:3};
 g.battle.fighters[0].effects['攻击必中']={start:1,end:3};
 g=T.turn(g,['potion:pp','wiki:36386']);
 assert.equal(g.battle.fighters[0].effects['攻击必中'],undefined);
 assert.equal(g.battle.fighters[0].ailments['疲惫'],undefined);
 assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('额外龙守护免疫疲惫')));
 assert.ok(!D.team(g,0).some(x=>x.name==='额外龙守护'));
 // A real original status move supplies the next clearable effect; no second timed effect is injected.
 g=T.turn(g,[lead===0?'wiki:23287':'wiki:24739','potion:pp']);g=T.turn(g,['potion:pp','wiki:36386']);assert.equal(g.battle.fighters[0].ailments['疲惫'],4,JSON.stringify({lead,turn:g.battle.turns.at(-1)}));
 }
});
test('玄源之㡣由真实25678疲惫触发本回合守护，下一回合敌实际登场臣服仍正常施加',()=>{
 let g=T.create([[member(3056),member(4186,2028)],[member(5000,null,25678),member(4468)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['potion:pp','wiki:25678']);assert.ok(g.battle.fighters[0].ailments['疲惫']>=1);assert.equal(g.battle.teamDragons2028[0].guardRound,1);
 g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(g.battle.fighters[0].ailments['臣服'],4);
});
test('觉醒乔特鲁德存活或带龙与阵亡或带龙分别去重计数，真实返场护盾与攻击增伤显示一致',()=>{
 const damage=[];
 for(const [deadDragon,deadOther,shield,eligible] of [[false,false,600,4],[true,false,600,4],[false,true,500,5],[true,true,500,5]]){
  const owner=member(4186,2028,10004);owner.build.overrides.atk=500;
  let g=T.create([[member(3056),owner,member(3809),member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
  if(deadDragon)g.slots[0][2].fighter.hp=0;if(deadOther)g.slots[0][3].fighter.hp=0;
  g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].suitState.shield,shield);
  assert.equal(E.dragonEligible2028(g.battle,0,false),eligible);
  const before=structuredClone(g),labels=D.team(g,0);assert.equal(labels.find(x=>x.name==='龙系攻击增伤').value,'+'+eligible*10+'%');assert.equal(labels.find(x=>x.name==='龙系入场护盾').value,'按当前队伍可获得 '+shield+' 点');assert.deepEqual(g,before);
  const r=g.battle.round;g=T.turn(g,['wiki:10004','potion:pp']);const e=g.battle.damageEvents.find(e=>e.round===r&&e.sourceSide===0&&e.type==='attack');assert.ok(e);damage.push(e.settledDamage);
 }
 assert.ok(damage[0]>0);assert.equal(damage[0],damage[1]);assert.equal(damage[2],damage[3]);assert.ok(Math.abs(damage[2]-damage[0]*1.5/1.4)<=2);
});
