'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,soul,ids=[]){const raw=S.species(id),snapshot=E.WIKI.versionSnapshots(raw).find(x=>x.selectedSoulId===soul)||raw;if(soul)snapshot.selectedSoulId=soul;return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
test('2149完整原魂原雷震天逆舞真实命中授讨，持有者真下场清标记返场不重授而再次命中重新获得',()=>{
 assert.equal(S.species(4950).souls.find(s=>s.id===2149).hash,'b694e4d9');let g=T.create([[member(4950,2149,[38554])],[member(2989),member(2994)]],[0,0],{seed:14,criticals:false});
 g=T.turn(g,['wiki:38554',pp]);assert.equal(g.battle.fighters[1].soulState.tao2149.sourceHash,'d97331c9');assert.ok(g.battle.damageEvents.some(e=>e.round===g.battle.round-1&&e.type==='attack'&&e.targetSide===1&&e.settledDamage>0));
 g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.slots[1][0].fighter.soulState.tao2149,undefined);
 g=T.turn(g,[pp,{switchTo:0}]);assert.equal(g.battle.fighters[1].soulState.tao2149,undefined);
 g=T.turn(g,['wiki:38554',pp]);assert.equal(g.battle.fighters[1].soulState.tao2149.sourceHash,'d97331c9');
});
test('2149真实授讨后敌击败原队友触发原圣荷慰心自然授连诛，持有者首次进场仍有标记而实际下场清除',()=>{
 assert.equal(S.species(3888).souls.find(s=>s.id===1561).hash,'7efe32b8');let g=T.create([[member(4950,2149,[38554]),member(3056)],[member(3056,undefined,[10127]),member(3888,1561,[38583])]],[0,0],{seed:14,criticals:false});
 g.slots[0][1].fighter.hp=1;g.slots[1][1].fighter.hp=2000;
 g=T.turn(g,['wiki:38554',pp]);assert.equal(g.battle.fighters[1].soulState.tao2149.sourceHash,'d97331c9');
 g=T.turn(g,[{switchTo:1},'wiki:10127']);assert.equal(g.phase,'replace');assert.equal(g.slots[0][1].fighter.hp,0);assert.equal(g.slots[1][1].fighter.soulState.lianzhu2149,true,'real marked killer received actual native bench support');
 assert.equal(g.slots[1][1].fighter.hp,5000);g=T.replace(g,[0,null]);
 g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.battle.fighters[1].soulState.lianzhu2149,true,'bench-earned mark remains on its first entry');
 g=T.turn(g,[pp,{switchTo:0}]);assert.equal(g.slots[1][1].fighter.soulState.lianzhu2149,undefined,'unannotated mark clears on its holder true leave');assert.equal(g.battle.fighters[1].soulState.tao2149,undefined,'old killer did not receive a fresh attack mark');
});
