'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),R=require('../dist/status-rules.js'),store=require('../local-species.cjs');
const D=require('../dist/battle-display.js');
function member(id,skills=[]){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
const make=()=>T.create([[member(3056),member(4875),member(3102)],[member(4872,[10157]),member(3102)]],[0,0],{seed:14,criticals:false});
test('永烬炎兽真实存活场下使敌原生霜缠免弱期间视烧伤，普通队友在场同样减威力并真实每回扣1125且无真实烧伤回合',()=>{
 let g=make();assert.equal(R.active(g.battle.fighters[1],'烧伤',1),true);assert.equal(g.battle.fighters[1].ailments['烧伤'],undefined);assert.equal(R.powerMultiplier(g.battle.fighters[1],1),.5);g=T.turn(g,['potion:pp','potion:pp']);assert.ok((g.battle.damageEvents??[]).some(e=>e.round===1&&e.sourceSide===0&&e.targetSide===1&&e.type==='true'&&e.settledDamage===1125));g=T.turn(g,[{switchTo:2},'potion:pp']);assert.equal(R.active(g.battle.fighters[1],'烧伤',g.battle.round-1),true);assert.equal(g.battle.fighters[1].ailments['烧伤'],undefined);assert.ok(E.describeEffects(g.battle.fighters[1],g.battle.round).some(x=>x.includes('免弱期间视为烧伤')));g=T.turn(g,['potion:pp',{switchTo:1}]);assert.equal(R.active(g.battle.fighters[1],'烧伤',g.battle.round),false);
});
test('永烬场下光环中文显示实际存活来源和生效规则，读取不写状态或随机数',()=>{
 const g=make(),before=structuredClone(g);assert.match(D.team(g,0).find(x=>x.name==='永烬烧伤光环').value,/永烬劫炎·上古炎兽.*存活背包.*免弱期间视为烧伤/);assert.deepEqual(g,before);
});
test('永烬炎兽从场下实际换上被击败后立刻失去光环，敌仍为霜缠免弱但无真实烧伤且选定继任不延续旧光环',()=>{
 let g=make();g.slots[0][1].fighter.hp=1;g=T.turn(g,['potion:pp','potion:pp']);assert.equal(R.active(g.battle.fighters[1],'烧伤',g.battle.round),true);g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,['potion:pp','wiki:10157']);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.battle.fighters[1].soulState.lotus2059.form,'mesh');assert.equal(g.battle.fighters[1].ailments['烧伤'],undefined);assert.equal(R.active(g.battle.fighters[1],'烧伤',g.battle.round),false);g=T.replace(g,[0,null]);assert.equal(R.active(g.battle.fighters[1],'烧伤',g.battle.round),false);
});
test('永烬炎兽场下已阵亡边界不提供视烧伤，活源下场保护不伪造真实烧伤且敌免弱自然结束即停止扣血',()=>{
 let g=make();g.slots[0][1].fighter.hp=0;g=T.turn(g,['potion:pp','potion:pp']);assert.equal(R.active(g.battle.fighters[1],'烧伤',g.battle.round),false);assert.ok(!(g.battle.damageEvents??[]).some(e=>e.targetSide===1&&e.type==='true'));g=make();for(let i=0;i<6;i++)g=T.turn(g,['potion:pp','potion:pp']);assert.equal(R.active(g.battle.fighters[1],'烧伤',g.battle.round),false);assert.equal(g.battle.fighters[1].ailments['烧伤'],undefined);assert.ok(!(g.battle.damageEvents??[]).some(e=>e.round===g.battle.round-1&&e.targetSide===1&&e.type==='true'));
});


