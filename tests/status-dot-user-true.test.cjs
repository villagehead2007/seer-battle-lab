'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,S,game,turn,apply,timer}=require('./helpers/public-status.cjs'),shields=require('../dist/shield-rules.js');
// Initial health/status/guard resources are explicit boundary fixtures, not claims that a species owns extra skills.
const trio=['中毒','烧伤','冻伤'];
const T=require('../dist/team-engine.js'),store=require('../local-species.cjs');
function member(id,skills=[]){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);for(const k of skills)if(!moves.includes(k))moves[moves.findIndex((x,i)=>i>0&&!skills.includes(x))]=k;return{snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000}}};}
for(const status of trio){
 test('用户20261110 '+status+'周期八分之一为真伤，来源和完整结算与实际损失明确，粉免抗性减伤护罩不拦截',()=>{
  for(const mode of ['plain','pink-immune','resistance','reduction','barrier']){const s=game();apply(s,0,status,1,1);const f=s.fighters[0];if(mode==='pink-immune')timer(s,0,'固定百分比免疫');if(mode==='resistance')f.build.resistance.percent=100;if(mode==='reduction')timer(s,0,'固定百分比减伤',{fraction:.75});if(mode==='barrier')shields.addBarrier(f,500,'initial-boundary');const out=turn(s),events=out.damageEvents.filter(e=>e.targetSide===0);assert.equal(out.fighters[0].hp,1400,mode);assert.equal(events.length,1);assert.deepEqual([events[0].type,events[0].settledDamage,events[0].hpLoss,events[0].sourceSide],['true',200,200,1]);if(mode==='barrier')assert.equal(out.fighters[0].suitState.barrier,500);assert.equal(out.fighters[0].ailments[status],undefined);}
 });
 test('用户20261110 '+status+'真伤保持保一体力、低HP死亡与重生边界，不重复扣已倒下者',()=>{
  for(const mode of ['floor','death','rebirth']){const s=game();s.fighters[0].hp=100;apply(s,0,status,1,1);if(mode==='floor')timer(s,0,'致命保留',{hp:1});if(mode==='rebirth')s.fighters[0].soulState.rebirth2243={armed:true};const out=turn(s),f=out.fighters[0],event=out.damageEvents.find(e=>e.targetSide===0);assert.equal(event.type,'true');assert.equal(event.settledDamage,200);assert.equal(event.hpLoss,mode==='floor'?99:100);assert.equal(f.hp,mode==='floor'?1:mode==='death'?0:1600);if(mode==='death')assert.equal(out.finished,true);if(mode==='rebirth')assert.equal(f.soulState.rebirth2243.armed,false);}
  const s=game();s.fighters[0].hp=100;for(const name of trio)apply(s,0,name,2,1);const out=turn(s);assert.equal(out.damageEvents.filter(e=>e.targetSide===0).length,1);assert.equal(out.fighters[0].hp,0);
 });
}
test('用户仅改三种周期伤害，沉默烈焰诅咒仍百分比而流血固定80，直接技能百分比伤害仍可被粉免',()=>{
 for(const [status,type,amount]of [['沉默','percent',200],['烈焰诅咒','percent',200],['流血','fixed',80]]){const s=game();apply(s,0,status,1,1);const out=turn(s),event=out.damageEvents.find(e=>e.targetSide===0);assert.equal(event.type,type);assert.equal(event.settledDamage,amount);assert.equal(out.fighters[0].hp,1600-amount);}
 for(const immune of [false,true]){let g=T.create([[member(4665,[37483])],[member(3102)]],[0,0],{seed:14,criticals:false});if(immune)g.battle.fighters[1].effects['固定百分比免疫']={start:1,end:1};g=T.turn(g,['wiki:37483','potion:pp']);const events=g.battle.damageEvents??[];assert.equal(events.filter(e=>e.sourceSide===0&&e.type==='percent').reduce((n,e)=>n+e.settledDamage,0),immune?0:2700);assert.ok(events.every(e=>e.type!=='true'));}
});
test('烧伤威力仍减半，真实持续时长与清除规则保留，场下不新增周期结算',()=>{
 const s=game();apply(s,0,'烧伤',2,1);assert.equal(S.powerMultiplier(s.fighters[0],1),.5);S.clear(s.fighters[0],'烧伤');assert.equal(S.powerMultiplier(s.fighters[0],1),1);assert.equal(turn(s).fighters[0].hp,1600);
 for(const status of trio){let g=T.create([[member(3102),member(3056)],[member(3102)]],[0,0],{seed:14,criticals:false});S.attempt(g.battle.fighters[0],status,1,{duration:3,source:g.battle.fighters[1]});g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.slots[0][0].fighter.hp,9000);assert.equal(g.slots[0][0].fighter.ailments[status],undefined);g=T.turn(g,[{switchTo:0},'potion:pp']);assert.equal(g.battle.fighters[0].hp,9000);assert.equal((g.battle.damageEvents??[]).filter(e=>e.type==='true').length,0);}
});
