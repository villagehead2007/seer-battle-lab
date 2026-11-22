'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
test('3414魂728真实原魂先回复再等量百分比，回复削减和零回复不能按原请求附伤',()=>{
 for(const mode of ['cap','half','zero','full']){
  const a=store.species(3414),b=store.species(2989);a.selectedSoulId=728;const stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000};
  let s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout(a,[]),loadout(b,[])],seed:14,criticals:false,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]});
  s.fighters[0].hp=mode==='full'?9000:mode==='cap'?8950:1000;s.fighters[0].stages.atk=1;
  if(mode==='half'||mode==='zero')s.fighters[0].effects['回复效果削减']={start:1,end:3,fraction:mode==='half'?.5:1};
  s=E.resolveTurn(s,['potion:pp','potion:pp']);
  const actual={cap:50,half:1500,zero:0,full:0}[mode],start={cap:8950,half:1000,zero:1000,full:9000}[mode];
  const damage=s.turns.at(-1).events.filter(e=>e.damage?.sourceSide===0&&e.damage.type==='percent'&&e.text.includes('索伦森魂印追加')).reduce((n,e)=>n+e.damage.settledDamage,0);
  assert.equal(s.fighters[0].hp,start+actual,mode+' actual healing');assert.equal(damage,actual,mode+' actual recovery defines percent');assert.equal(s.fighters[1].hp,9000-actual,mode+' target actual HP');
 }
});
test('4787魂1983真实敌易燃回满按实际回复附百分比，削减后不沿用回复前全部缺失HP',()=>{
 for(const mode of ['cap','half','zero','full']){
  const a=store.species(4787),b=store.species(2989),stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000};
  let s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout(a,[10011]),loadout(b,[])],seed:14,criticals:false,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]});
  s.fighters[0].hp=mode==='full'?9000:mode==='cap'?8950:1000;s.fighters[1].ailments['易燃']=3;
  if(mode==='half'||mode==='zero')s.fighters[0].effects['回复效果削减']={start:1,end:3,fraction:mode==='half'?.5:1};
  s=E.resolveTurn(s,['wiki:10011','potion:pp']);
  const actual={cap:50,half:4500,zero:0,full:0}[mode],start={cap:8950,half:1000,zero:1000,full:9000}[mode];
  const damage=s.turns.at(-1).events.filter(e=>e.damage?.sourceSide===0&&e.damage.type==='percent'&&e.text.includes('钢牙鲨回满')).reduce((n,e)=>n+e.damage.settledDamage,0);
  assert.equal(s.fighters[0].hp,start+actual,mode+' actual soul healing');assert.equal(damage,actual,mode+' percent uses actual recovery');
 }
});
