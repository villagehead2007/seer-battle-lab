'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
const D=require('../dist/battle-display.js');
function member(id,skills=[]){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
const make=()=>T.create([[member(4816,[10234]),member(3102,[10127])],[member(3056,[10127])]],[0,0],{seed:14,criticals:false});
test('伊芙实际开共振器阻双方普通攻击、零槽回满，主动下场关闭且队友可真实攻击，返场重新开启而旧盾罩不带回',()=>{
 let g=make();g.battle.fighters[0].pp['wiki:10234']=1;g=T.turn(g,['wiki:10234','wiki:10127']);assert.equal(g.battle.fighters[0].pp['wiki:10234'],40);assert.ok(g.battle.fighters[0].suitState.shield>0);assert.ok(!(g.battle.damageEvents??[]).some(e=>e.type==='attack'&&e.settledDamage>0));g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.soulState.cyber2008.open,false);g=T.turn(g,['wiki:10127','potion:pp']);assert.ok(g.battle.damageEvents.some(e=>e.round===g.battle.round-1&&e.sourceSide===0&&e.type==='attack'&&e.settledDamage>0));g=T.turn(g,[{switchTo:0},'wiki:10127']);assert.equal(g.battle.fighters[0].soulState.cyber2008.open,true);assert.equal(g.battle.fighters[0].suitState.shield,0);assert.equal(g.battle.fighters[0].suitState.barrier,0);assert.ok(!(g.battle.damageEvents??[]).some(e=>e.round===g.battle.round-1&&e.type==='attack'&&e.settledDamage>0));
});
test('伊芙全队装置显示实际开启或场下关闭及来源，读取不改变战斗',()=>{
 let g=make();for(let i=0;i<2;i++){const before=structuredClone(g);assert.match(D.team(g,0).find(x=>x.name==='赛博共振器').value,i===0?/伊芙 · 开启/:/伊芙 · 关闭/);assert.deepEqual(g,before);if(i===0)g=T.turn(g,[{switchTo:1},'potion:pp']);}
});
test('伊芙真实被对手原生第五关闭共振器后回初不重开，真下场返场才重新开并重授沸涌两回',()=>{
 let g=make();g=T.turn(g,['potion:pp','wiki:19369']);assert.equal(g.battle.fighters[0].soulState.cyber2008.open,false);g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[0].soulState.cyber2008.open,false);g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.cyber2008.open,true);assert.equal(g.battle.fighters[0].ailments['沸涌'],g.battle.round);
});
