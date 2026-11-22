'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),L=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),potion='potion:pp';
function member(id,ids=[]){const snapshot=L.species(id);return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:360,def:4000,spd:4000,spe:1000}}};}
function team(lead=0){return T.create([[member(3443,[11027,22219]),member(3056)],[member(3056)]],[lead,0],{seed:14,criticals:false});}
function chance(g){return g.battle.fighters[0].soulState.kronFearChance;}
function same(a,b,label){assert.ok(Math.abs(a-b)<1e-10,label+': '+a+' / '+b);}
test('758真实晚入首回概率等于原首发首回，不沿用全场回合数且不裁定待答40或50基数',()=>{
 const first=T.turn(team(),[potion,potion]);let late=team(1);late=T.turn(late,[potion,potion]);late=T.turn(late,[potion,potion]);late=T.turn(late,[{switchTo:0},potion]);assert.equal(late.active[0],0);assert.equal(late.battle.fighters[0].soulState.teamEntry.number,1);same(chance(late),chance(first),'late first-entry chance');
});
test('758真实逐回增长上限一百而真实离场返场清成长，返场首回等于首登不裁定基数',()=>{
 let g=T.turn(team(),[potion,potion]);const base=chance(g);g=T.turn(g,[potion,potion]);same(chance(g),Math.min(1,base+.1),'next round grows ten points');for(let i=0;i<8;i++)g=T.turn(g,[potion,potion]);same(chance(g),1,'capped at100');g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.teamEntry.number,2);same(chance(g),base,'new visit resets');
});
test('758攻击条件不满足时属性药剂疲惫未出均无失败回复附固，真正攻击害怕被免疫仍按实际回复附等固',()=>{
 for(const mode of['status','ppPotion','hpPotion','control','attack']){
  const own=member(3443,[11027,22219]),enemy=member(3056),s=E.createBattle({wikiSnapshots:[own.snapshot,enemy.snapshot],wikiLoadouts:[own.moves,enemy.moves],builds:[own.build,enemy.build],seed:14,criticals:false});s.fighters[0].hp=1000;s.fighters[1].counts.immune=10;if(mode==='control')s.fighters[0].ailments['疲惫']=2;
  const action=mode==='status'?'wiki:22219':mode==='ppPotion'?potion:mode==='hpPotion'?'potion:hp':'wiki:11027',out=E.resolveTurn(s,[action,potion]),fixed=(out.damageEvents??[]).filter(e=>e.round===1&&e.sourceSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0);
  assert.equal(out.fighters[0].hp,mode==='attack'?4000:mode==='hpPotion'?1250:1000,mode+' source HP');assert.equal(fixed,mode==='attack'?3000:0,mode+' fixed compensation');if(mode==='status')assert.equal(out.fighters[1].stages.def,-1);if(mode==='attack')assert.ok((out.damageEvents??[]).some(e=>e.type==='attack'&&e.sourceSide===0));
 }
});
