'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3079-native.cjs'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),pp='potion:pp';
const hits=(s,r)=>(s.damageEvents??[]).filter(e=>e.round===r&&e.sourceSide===0&&e.type==='attack').length;
test('3079雷皇484首次自然MISS不增加计数，下一次实际命中仍两连，成功命中按次成长到五封顶',()=>{
 let found=false;for(let seed=1;seed<=64&&!found;seed++){let s=H.turn(H.make(16103,{seed,aStages:{acc:-6},bGear:{resistance:{percent:100}}}),16103);if(hits(s,1)!==0)continue;assert.equal(s.fighters[0].soulState.hitGrowth?.['wiki:16103']??0,0);s=H.turn(s,16103);if(hits(s,2)>0){found=true;assert.equal(hits(s,2),2);assert.equal(s.fighters[0].soulState.hitGrowth['wiki:16103'],1);}}assert.ok(found);
 let s=H.make(16103,{aStages:{acc:6},bGear:{resistance:{percent:100}}});for(let r=1;r<=5;r++){s=H.turn(s,16103);assert.equal(hits(s,r),Math.min(5,r+1));assert.equal(s.fighters[0].soulState.hitGrowth['wiki:16103'],r);}
});
test('3079雷皇484真实成长至四连后下场返场，下次重新两连且每段免红仍算命中增长一次',()=>{
 const member=(id,moves=[],gear={})=>{const snapshot=store.species(id);return{snapshot,moves:H.loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:1200,spa:1200,def:4000,spd:4000,spe:1000},...gear}};};
 let g=T.create([[member(3079,[16103]),member(3004)],[member(2989,[],{resistance:{percent:100}})]],[0,0],{seed:14,criticals:false});for(let r=1;r<=3;r++){g=T.turn(g,['wiki:16103',pp]);assert.equal(hits(g.battle,r),r+1);}g=T.turn(g,[{switchTo:1},pp]);g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.battle.fighters[0].soulState.hitGrowth?.['wiki:16103']??0,0);g=T.turn(g,['wiki:16103',pp]);assert.equal(hits(g.battle,6),2);
 let s=H.make(16103,{bEffects:{当回合免伤:{start:1,end:3}}});s=H.turn(s,16103);assert.equal(s.fighters[0].soulState.hitGrowth['wiki:16103'],1);s=H.turn(s,16103);assert.equal(s.fighters[0].soulState.hitGrowth['wiki:16103'],2);assert.ok(!(s.damageEvents??[]).some(e=>e.type==='attack'&&e.settledDamage>0));
});
