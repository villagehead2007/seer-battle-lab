'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function member(id,moves=[],stats={}){const snapshot=store.species(id),selected=loadout(snapshot,moves);assert.equal(E.WIKI.assess(snapshot,selected).supported,true);return{snapshot,moves:selected,build:{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:1000,...stats}}};}
function make(){const g=T.create([[member(3019,[10157]),member(3056)],[member(2989,[],{spe:100})]],[0,0],{seed:14,criticals:false});assert.equal(g.battle.fighters[0].soulId,390);assert.equal(g.battle.fighters[0].soulHash,'dd267438');g.battle.fighters[0].hp=1000;return g;}
function step(g,action){const heals=[],old=E.SOULS;E.SOULS={...old,run(event,c){if(c.a.side!==0)return old.run(event,c);return old.run(event,{...c,heal(f,n,label,...rest){const before=f.hp,result=c.heal(f,n,label,...rest);if(label==='伊维特魂印吸血')heals.push({red:c.settledDamage,request:n,actual:f.hp-before,round:c.round});return result;}});}};let out;try{out=T.turn(g,[action,pp]);}finally{E.SOULS=old;}return{g:out,heals};}
function check(x,fraction){assert.equal(x.heals.length,1);const h=x.heals[0];assert.ok(h.red>0);assert.equal(h.request,h.red*fraction);assert.equal(h.actual,Math.floor(h.red*fraction));}
test('3019原390完整魂每在场回合40至50至60封顶，真实药剂度过也增长，不把每回合改成每次攻击',()=>{
 let x=step(make(),'wiki:10157');check(x,.4);x=step(x.g,pp);assert.equal(x.heals.length,0);x=step(x.g,'wiki:10157');check(x,.6);x=step(x.g,'wiki:10157');check(x,.6);assert.equal(x.g.battle.fighters[0].hp,1000+x.g.battle.damageEvents.filter(e=>e.sourceSide===0&&e.type==='attack').reduce((n,e)=>n+Math.floor(e.settledDamage*(e.round===1?.4:.6)),0));
});
test('3019原390真实离场重置逐回合回复比例，重新登场的当前回合从40起算，次回合攻击只回复完整红伤50而非沿用全场60',()=>{
 let x=step(make(),'wiki:10157');check(x,.4);x=step(x.g,'wiki:10157');check(x,.5);x=step(x.g,{switchTo:1});assert.equal(Number(x.g.battle.fighters[0].number),3056);x=step(x.g,{switchTo:0});assert.equal(Number(x.g.battle.fighters[0].number),3019);assert.equal(x.g.battle.fighters[0].soulState.teamEntry.round,4);x=step(x.g,'wiki:10157');check(x,.5);assert.equal(x.heals[0].round,5);
});
