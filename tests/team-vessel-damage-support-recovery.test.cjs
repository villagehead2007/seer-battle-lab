'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
function member(id,stats={},skills=[],gear={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const skill of skills)if(!moves.includes(skill))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats},...gear}};}
function make(removed=1,target=3291,gear={},targetStats={},soul=null){const foe=member(target,targetStats,[],gear);if(soul){foe.snapshot.selectedSoulId=soul;foe.moves=E.WIKI.defaultMoves(foe.snapshot);}let g=T.create([[member(13311,{maxHp:1000,def:30}),member(3056,{},[10716,15969,23285])],[foe]],[0,0],{seed:14,criticals:false});for(let i=0;i<removed;i++){g=T.turn(g,['wiki:38626',pp]);g=T.turn(g,[{switchTo:1},pp]);if(i<removed-1)g=T.turn(g,[{switchTo:0},pp]);}if(!removed)g=T.turn(g,[{switchTo:1},pp]);return g;}
function damage(g,type){return g.battle.damageEvents.filter(e=>e.round===g.battle.turns.at(-1).round&&e.sourceSide===0&&e.targetSide===1&&e.type===type).reduce((n,e)=>n+e.settledDamage,0);}
function freshTarget(id,maxHp,soul){const foe=member(id,{maxHp});if(soul){foe.snapshot.selectedSoulId=soul;foe.moves=E.WIKI.defaultMoves(foe.snapshot);}let g=T.create([[member(13311,{maxHp:1000,def:30}),member(3056,{},[10716])],[member(2988),foe]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:38626',pp]);g=T.turn(g,[{switchTo:1},{switchTo:1}]);return g;}
test('SP固定记录真实移除后场下支援穿透星皇免粉及100面板固定抗性，未移除则仍免疫',()=>{
 for(const removed of [0,1]){let g=make(removed,3291,{resistance:{fixed:100,percent:100}});g=T.turn(g,['wiki:10716',pp]);assert.equal(damage(g,'fixed'),removed?50:0);assert.equal(g.battle.fighters[1].build.resistance.fixed,100);assert.equal(E.SOULS.trait(g.battle.fighters[1],'pinkImmune'),true);}
});
test('SP仅移除固定不能穿透百分比，实际第二次第五移除百分比后按4000防御四成造成1600',()=>{
 for(const removed of [1,2]){let g=make(removed,3291,{resistance:{fixed:100,percent:100}});g=T.turn(g,['wiki:15969',pp]);assert.equal(damage(g,'percent'),removed===2?1600:0);assert.equal(g.battle.fighters[1].build.resistance.percent,100);}
});
test('SP固定支援不穿透普通裁决套装减伤或护罩，50点仍先受5%减伤或消耗真实莫塔里安原生护罩',()=>{
 let g=make(1,3291,{resistance:{fixed:100},suit:'judgment'});g=T.turn(g,['wiki:10716',pp]);assert.equal(damage(g,'fixed'),47);g=make(1,4541,{resistance:{fixed:100}});const barrier=g.battle.fighters[1].suitState.barrier;assert.equal(barrier,300);g=T.turn(g,['wiki:10716',pp]);assert.equal(damage(g,'fixed'),0);assert.equal(g.battle.fighters[1].suitState.barrier,250);
});
test('用户暴击只是举例：SP移除固定百分比后也不忽略100暴击抗性，真实逆转机甲必暴红伤为零但固定仍50',()=>{
 let g=make(2,3291,{resistance:{critical:100,fixed:100,percent:100}});g=T.turn(g,['wiki:23285',pp]);assert.ok(g.battle.fighters[0].effects['必定暴击']);g=T.turn(g,['wiki:10716',pp]);assert.equal(damage(g,'attack'),0);assert.equal(damage(g,'fixed'),50);assert.equal(g.battle.fighters[1].build.resistance.critical,100);
});
test('SP固定支援穿透圣谕邪魇原生固定免疫及幻境界神两版首次致死固粉免疫，不消费被忽略的免疫资格',()=>{
 for(const removed of [0,1]){let g=make(removed,4554);g=T.turn(g,['wiki:10716',pp]);assert.equal(damage(g,'fixed'),removed?50:0);}
 for(const soul of [1298,1542]){let g=freshTarget(4048,40,soul);g=T.turn(g,['wiki:10716',pp]);assert.equal(g.battle.fighters[1].hp,0);assert.equal(g.battle.fighters[1].soulState.illusionReverseUsed,undefined);assert.equal(damage(g,'fixed'),50);}
});
test('SP场下支援的致死固定穿透敌SP原系致死免疫，敌方不再移记录或变神灵；保留自己的原生记录历史',()=>{
 let g=freshTarget(13311,10);assert.equal(g.battle.teamVessel2162[1].state.removed,0);assert.notEqual(g.battle.fighters[1].type,'神灵');g=T.turn(g,['wiki:10716',pp]);assert.equal(g.battle.fighters[1].hp,0);assert.notEqual(g.battle.fighters[1].type,'神灵');assert.equal(g.battle.teamVessel2162[1].state.removed,0);assert.equal(g.battle.teamVessel2162[0].state.removed,1);assert.equal(damage(g,'fixed'),50);
});
