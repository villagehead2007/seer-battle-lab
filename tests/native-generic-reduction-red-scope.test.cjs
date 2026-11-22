'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function make(pet,soul,move,o={}){const a=store.species(3017),b=structuredClone(store.species(pet));assert.ok(b.souls.some(x=>x.id===soul));b.selectedSoulId=soul;const stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000};const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout(a,[move]),E.WIKI.defaultMoves(b)],seed:14,criticals:false,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]});if(o.aHp!==undefined)s.fighters[0].hp=o.aHp;if(o.bHp!==undefined)s.fighters[1].hp=o.bHp;if(o.poison)s.fighters[1].ailments['中毒']=4;return s;}
const turn=(s,move)=>E.resolveTurn(s,[typeof move==='number'?'wiki:'+move:move,pp]),sum=(s,type)=>(s.damageEvents??[]).filter(e=>e.round===s.turns.at(-1).round&&e.type===type&&e.targetSide===1&&e.sourceSide===0).reduce((n,e)=>n+e.settledDamage,0);
test('未标类型的乔特鲁德强化焱武四九盖亚减伤仅红伤，原生75固定800百分比均不减，真毒1125亦不减',()=>{
 for(const[pet,soul,options]of[[3036,399,{}],[3043,402,{}],[3106,448,{bHp:1000}],[3481,795,{poison:true}]])for(const[move,type,n]of[[10761,'fixed',75],[16397,'percent',800]]){const initial=make(pet,soul,move,options);initial.fighters[0].stages.acc=6;const s=turn(initial,move);assert.equal(sum(s,type),n,pet+'/'+type);if(options.poison)assert.equal(s.damageEvents.filter(e=>e.type==='true'&&e.targetSide===1).reduce((n,e)=>n+e.settledDamage,0),1125);}
});
test('派利尔明确包括固伤百分比的例外保留，真实回合末互换后仅下轮非红伤仍减半',()=>{
 for(const[move,type,n]of[[10761,'fixed',75],[16397,'percent',800]]){let s=turn(make(4408,1626,move,{aHp:1000}),pp);assert.equal(s.fighters[0].hp,9000);assert.equal(s.fighters[1].hp,1000);s=turn(s,move);assert.equal(sum(s,type),Math.floor(n/2));}
});
test('未标具体伤害类型的弑罪技能减伤按新统一规则仅减红伤，不减原生固定75百分比800',()=>{
 for(const[move,type,n]of[[10761,'fixed',75],[16397,'percent',800]]){const s=turn(make(3886,1971,move),move);assert.equal(sum(s,type),n);assert.ok(s.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0));}
});
