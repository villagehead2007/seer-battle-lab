'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function member(id,o={}){const snapshot=store.species(id),moves=loadout(snapshot,o.moves??[]);assert.equal(E.WIKI.assess(snapshot,moves).issues.length,0);return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...o.stats}}};}
function drain(g){return(g.battle.damageEvents??[]).filter(e=>e.sourceSide===0&&e.type==='true'&&e.round===g.battle.round-1).reduce((n,e)=>n+e.settledDamage,0);}
test('统一下场重置铭唤自身汲取倍增，真实两轮90和180后换下重置，痴愚与恒常危机感不随铭唤离场删除',()=>{
 let checked=0;
 for(let seed=1;seed<=50;seed++){
  let g=T.create([[member(4785),member(2989)],[member(2989)]],[0,0],{seed,criticals:false});
  g=T.turn(g,['potion:pp','potion:pp']);if(!g.battle.fighters[1].soulState.chiyu1982)continue;assert.equal(drain(g),90);
  g=T.turn(g,['potion:pp','potion:pp']);if(!g.battle.fighters[1].soulState.chiyu1982)continue;assert.equal(drain(g),180);assert.equal(g.battle.fighters[0].soulState.ming1982.drainPercent,4);
  g=T.turn(g,[{switchTo:1},'potion:pp']);if(!g.battle.fighters[1].soulState.chiyu1982)continue;
  assert.equal(g.slots[0][0].fighter.soulState.ming1982.drainPercent,1,'汲取自身成长未写下场保留');assert.equal(g.battle.fighters[1].soulState.crisis1982,3,'危机感是恒常规则值');assert.equal(g.battle.fighters[1].soulState.crisisGained1982,2);
  g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(drain(g),90,'返场按初始1%汲取而非旧4%');assert.equal(g.battle.fighters[0].soulState.ming1982.drainPercent,2);checked++;break;
 }
 assert.equal(checked,1,'必须至少有一条真实随机未解除标记的完整事件链');
});
test('统一下场重置铭唤消逝后的自身威力成长，真实标记目标阵亡并消逝后获得10点，离场清零',()=>{
 let checked=0;
 for(let seed=1;seed<=50;seed++){
  let g=T.create([[member(4785,{moves:[10001],stats:{atk:9999}}),member(2989)],[member(2989,{stats:{maxHp:1,def:1}}),member(3013)]],[0,0],{seed,criticals:false});
  g=T.turn(g,['potion:pp','potion:pp']);if(!g.battle.fighters[1].soulState.chiyu1982)continue;
  g=T.turn(g,['wiki:10001','potion:pp']);if(g.battle.fighters[1].hp!==0)continue;
  assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[0].soulState.ming1982.power,10);assert.equal(g.slots[1][0].fighter.soulState.vanished,true);
  g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.soulState.ming1982.power,0,'威力自身成长未写下场保留');
  g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].soulState.ming1982.power,0);checked++;break;
 }
 assert.equal(checked,1,'必须真实消逝及获得威力后检查离场');
});
