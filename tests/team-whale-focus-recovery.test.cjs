'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs');
function member(id,skills=[],overrides={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const skill of skills)if(!moves.includes(skill))moves[moves.findIndex((k,i)=>i>0&&!skills.includes(k))]=skill;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...overrides}}};}
const focus=f=>f.soulState.tideFocus1856;
test('鲸沫真实登场授浪潮，持有者主动离场返场保留原来源，源离场也不清除敌浪潮',()=>{
 let g=T.create([[member(4654),member(3056)],[member(3102),member(3056)]],[0,0],{seed:14,criticals:false});const original=structuredClone(focus(g.battle.fighters[1]));assert.ok(original);g=T.turn(g,['potion:pp',{switchTo:1}]);assert.deepEqual(focus(g.slots[1][0].fighter),original);g=T.turn(g,['potion:pp',{switchTo:0}]);assert.deepEqual(focus(g.battle.fighters[1]),original);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.deepEqual(focus(g.battle.fighters[1]),original);
});
test('鲸沫浪潮持有者真实返场后原生触角强制暴击并消费，后续源再登场重新授予且显示来源只读',()=>{
 let g=T.create([[member(4654,[10559]),member(3056)],[member(3102),member(3056)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['potion:pp',{switchTo:1}]);g=T.turn(g,['potion:pp',{switchTo:0}]);const untouched=structuredClone(g);assert.match(D.fighter(g.battle.fighters[1],g.battle.round,g.battle.moveDefinitions).items.find(x=>x.name==='浪潮聚焦').value,/A 方鲸沫.*下场保留/);assert.deepEqual(g,untouched);g=T.turn(g,['wiki:10559','potion:pp']);assert.equal(focus(g.battle.fighters[1]),undefined);assert.equal(g.battle.fighters[0].soulState.tideLastAttack1856.crit,true);assert.ok(g.battle.damageEvents.some(e=>e.round===g.battle.round-1&&e.sourceSide===0&&e.type==='attack'&&e.settledDamage>0));g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.ok(focus(g.battle.fighters[1]));
});
test('鲸沫实际被击败给未标敌人授浪潮，原已标敌人保留原标记，玩家所选继任不清除',()=>{
 for(const existing of [false,true]){let g=T.create([[member(4654,[],{maxHp:1,def:1}),member(3102)],[member(3056,[10127],{atk:9999}),member(3102,[10127],{atk:9999})]],[0,0],{seed:14,criticals:false});if(!existing)g=T.turn(g,['potion:pp',{switchTo:1}]);g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);assert.ok(focus(g.battle.fighters[1]));g=T.replace(g,[1,null]);assert.ok(focus(g.battle.fighters[1]));assert.equal(Number(g.battle.fighters[0].number),3102);}
});
test('鲸沫真实返场遇已有浪潮改封当回合命中效果，未标新敌实际换入后再返场才授新标记',()=>{
 let g=T.create([[member(4654),member(3056)],[member(3056,[20117]),member(3102)]],[0,0],{seed:14,criticals:false});g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'wiki:20117']);assert.equal(g.battle.fighters[1].stages.atk,0);assert.equal(g.battle.fighters[1].pp['wiki:20117'],39);assert.ok(focus(g.battle.fighters[1]));g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(focus(g.battle.fighters[1]),undefined);g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.ok(focus(g.battle.fighters[1]));
});


