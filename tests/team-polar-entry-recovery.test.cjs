'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,skill){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(skill&&!moves.includes(skill))moves[1]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:1000,spd:1000}}};}
test('无极使者真实晚入场及再次返场均封锁当回合攻击附伤，下一回合恢复且仍有真实红伤',()=>{
 let g=T.create([[member(2987),member(4674)],[member(3056,19369)]],[0,0],{seed:14,criticals:false});
 g=T.turn(g,['potion:pp','potion:pp']);
 function strike(a,blocked){const round=g.battle.round;g=T.turn(g,[a,'wiki:19369']);const events=g.battle.damageEvents.filter(e=>e.round===round&&e.sourceSide===1&&e.targetSide===0);assert.ok(events.some(e=>e.type==='attack'&&e.settledDamage>0));assert.equal(events.some(e=>e.type==='fixed'&&e.settledDamage>0),!blocked);}
 strike({switchTo:1},true);strike('potion:pp',false);
 g=T.turn(g,[{switchTo:0},'potion:pp']);strike({switchTo:1},true);strike('potion:pp',false);
});
