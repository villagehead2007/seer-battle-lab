'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),D=require('../dist/battle-display.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,overrides={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);if(id===3102)moves[4]=10127;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...overrides}}};}
function create(id,seed=14,criticals=false){const g=T.create([[member(4745),member(id)],[member(4925,{maxHp:40}),member(3102)]],[0,0],{seed,criticals});g.battle.fighters[0].hp=5000;return g;}
function gain(id,seed=14,criticals=false){let g=create(id,seed,criticals);assert.equal(g.battle.fighters[0].soulState.hunt1948.souls,1);g=T.turn(g,['wiki:37862',pp]);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[1].hp,0);return T.replace(g,[null,1]);}
test('继承希瓦暴击闪避整句算一种，真实KO才增长，真实换出返场保留而不复制高体降级或重复选招吸取',()=>{
 let g=create(3865);assert.equal(E.SOULS.trait(g.battle.fighters[0],'dodgeChance'),0);g=T.turn(g,['wiki:37862',pp]);g=T.replace(g,[null,1]);assert.equal(g.battle.fighters[0].soulState.hunt1948.inheritedShivaKills,1);assert.equal(E.SOULS.trait(g.battle.fighters[0],'dodgeChance'),.1);g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);const f=g.battle.fighters[0];assert.equal(f.soulState.hunt1948.souls,1);assert.equal(f.soulState.hunt1948.inheritedShivaKills,1);assert.equal(E.SOULS.trait(f,'dodgeChance'),.1);assert.equal(f.soulState.shivaHigh,undefined);assert.equal(f.soulState.shivaDrainRound,undefined);assert.ok(Object.values(g.battle.fighters[1].stages).every(n=>n===0));assert.match(D.fighter(f,g.battle.round,g.battle.moveDefinitions).items.find(x=>x.name==='继承希瓦击败成长').value,/1 次.*暴击率\+10%.*闪避10%/);
});
test('继承希瓦真实64初始种子验证额外暴击及闪避的成功失败，不改随机序列或直接写结果',()=>{
 let extraCrit=0,dodge=0,hit=0;
 for(let seed=0;seed<64;seed++){
  const critCases=[4521,3865].map(id=>{let g=gain(id,seed,true);g=T.turn(g,['wiki:37862',pp]);assert.ok(Object.values(g.battle.fighters[1].stages).every(n=>n===0));return g.battle.turns.at(-1).events.some(e=>e.kind==='damage'&&e.text.includes('致命一击'));});
  if(critCases[0])assert.ok(critCases[1]);if(!critCases[0]&&critCases[1])extraCrit++;
  let g=gain(3865,seed);const hp=g.battle.fighters[0].hp;assert.equal(g.battle.moveDefinitions['wiki:10127'].accuracy,100);assert.ok(Object.keys(g.battle.fighters[0].ailments).length===0);assert.ok(!g.battle.fighters[1].effects['攻击必失']);g=T.turn(g,[pp,'wiki:10127']);const evaded=g.battle.turns.at(-1).events.some(e=>e.kind==='miss'&&e.text.includes('技能未命中'));if(evaded){dodge++;assert.equal(g.battle.fighters[0].hp,hp);let control=gain(4521,seed);control=T.turn(control,[pp,'wiki:10127']);assert.ok(control.battle.damageEvents.some(e=>e.round===2&&e.targetSide===0&&e.type==='attack'&&e.hpLoss>0));}else{hit++;assert.ok(g.battle.damageEvents.some(e=>e.round===2&&e.targetSide===0&&e.type==='attack'&&e.hpLoss>0));}
 }
 assert.ok(extraCrit>0);assert.ok(dodge>0);assert.ok(hit>0);
});
test('继承幽蝶仅击败后授三回合强化保护，真实瑞尔斯第五两轮无法吸取、到期下一轮才实际反转吸取',()=>{
 let g=create(4743);g.battle.fighters[0].stages.atk=2;assert.equal(g.battle.fighters[0].effects['幽蝶强化保护'],undefined);g=T.turn(g,['wiki:37862',pp]);assert.equal(g.battle.fighters[0].effects['幽蝶强化保护'].end,3);g=T.replace(g,[null,1]);
 for(let round=2;round<=4;round++){assert.equal(g.battle.round,round);g=T.turn(g,[pp,'wiki:19565']);assert.equal(g.battle.fighters[0].stages.atk,round<4?2:-2);assert.equal(g.battle.fighters[1].stages.atk,round<4?0:2);assert.ok(g.battle.fighters.every(f=>f.hp>0));}
});
test('实际落败同时抑制继承希瓦成长和幽蝶保护，正常击败对照两种均取得',()=>{
 for(const fallen of [false,true]){let g=T.create([[member(4745),member(3865),member(4743)],[member(fallen?4911:3102,{maxHp:40}),member(4925)]],[0,0],{seed:14,criticals:false});g.battle.fighters[1].ailments['疲惫']=6;g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.hunt1948.souls,2);g=T.turn(g,['wiki:37862',pp]);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[1].hp,0);const f=g.battle.fighters[0];assert.equal(f.soulState.hunt1948.inheritedShivaKills??0,fallen?0:1);assert.equal(!!f.effects['幽蝶强化保护'],!fallen);assert.equal(E.SOULS.trait(f,'dodgeChance'),fallen?0:.1);}
});
