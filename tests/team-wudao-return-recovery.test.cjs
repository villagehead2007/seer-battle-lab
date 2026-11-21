'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),D=require('../dist/battle-display.js');
function member(id,skills=[]){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
const pp='potion:pp',make=()=>T.create([[member(4766),member(2988)],[member(3056,[10127]),member(3102,[10127]) ]],[0,0],{seed:14,criticals:false});
const state=g=>g.battle.fighters[0].soulState.wudao1967,red=g=>g.battle.damageEvents.filter(e=>e.round===g.battle.round-1&&e.sourceSide===1&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);
test('灭战盖亚真实换下暂停本场在场计数，返场血道仍累计至十一次后不再抵挡',()=>{
 let g=make();for(let i=0;i<8;i++)g=T.turn(g,[pp,pp]);assert.equal(state(g).fieldRounds,8);g=T.turn(g,[{switchTo:1},pp]);for(let i=0;i<3;i++)g=T.turn(g,[pp,pp]);g=T.turn(g,[{switchTo:0},pp]);assert.equal(state(g).fieldRounds,9);assert.equal(E.SOULS.registry[1967].abilities.phase(g.battle.fighters[0]),'blood');g=T.turn(g,[pp,'wiki:10127']);assert.equal(state(g).fieldRounds,10);assert.equal(red(g),0);assert.equal(E.SOULS.registry[1967].abilities.phase(g.battle.fighters[0]),'evil');g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},'wiki:10127']);assert.equal(state(g).fieldRounds,11);assert.equal(E.SOULS.registry[1967].abilities.phase(g.battle.fighters[0]),'blood');assert.ok(red(g)>0,JSON.stringify({red:red(g),state:state(g),enemy:g.battle.fighters[1].soulState.enteredRound,round:g.battle.round,events:g.battle.turns.at(-1).events}));
});
test('灭战盖亚邪道按对手本次入场超过两回抵挡，对手换人后前两回不能沿旧计时',()=>{
 let g=make();g=T.turn(g,[pp,'wiki:10127']);assert.equal(E.SOULS.registry[1967].abilities.phase(g.battle.fighters[0]),'evil');g=T.turn(g,[pp,{switchTo:1}]);g=T.turn(g,[pp,'wiki:10127']);assert.ok(red(g)>0,JSON.stringify({red:red(g),state:state(g),enemy:g.battle.fighters[1].soulState.enteredRound,round:g.battle.round,events:g.battle.turns.at(-1).events}));assert.equal(E.SOULS.registry[1967].abilities.phase(g.battle.fighters[0]),'evil');g=T.turn(g,[pp,'wiki:10127']);assert.equal(red(g),0);assert.equal(E.SOULS.registry[1967].abilities.phase(g.battle.fighters[0]),'sky');const before=structuredClone(g);D.fighter(g.battle.fighters[0],g.battle.round,g.battle.moveDefinitions);assert.deepEqual(g,before);
});
test('灭战盖亚真实队伍对战完成两次正转循环，末血后不会关闭',()=>{
 let g=make();
 const expected=['evil','evil','sky','blood','evil','sky','blood'];
 for(const [i,next] of expected.entries()){
   g=T.turn(g,[pp,'wiki:10127']);
   assert.equal(E.SOULS.registry[1967].abilities.phase(g.battle.fighters[0]),next);
   assert.equal(state(g).closed,false);
   assert.equal(red(g)>0,i===1);
 }
});
