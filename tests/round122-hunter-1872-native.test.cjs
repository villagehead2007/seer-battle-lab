'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),L=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
const variants=E.WIKI.versionSnapshots(L.species(3514)),key='wiki:36200',potion='potion:pp';
function member(snapshot,ids=[],spe=1000){return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:360,def:4000,spd:4000,spe}}};}
function make(snapshot,{enemy=2989,move=10330,arrows=0,late=false,mode}={}){
 const enemySnapshot=L.species(enemy),s=E.createBattle({wikiSnapshots:[snapshot,enemySnapshot],wikiLoadouts:[loadout(snapshot,[36200]),loadout(enemySnapshot,[move])],builds:[member(snapshot,[],late?1:9999).build,member(enemySnapshot,[],late?9999:1).build],seed:14,criticals:false});
 s.fighters[0].hp=8000;s.fighters[0].stages.acc=6;s.fighters[1].stages.acc=6;s.fighters[0].soulState.hunterArrows=arrows;
 if(mode==='control')s.fighters[0].ailments['疲惫']=2;if(mode==='invalid')s.fighters[0].effects.skillBlock={start:1,end:1};if(mode==='zero')s.fighters[0].pp[key]=0;
 const operations=s.moveDefinitions[key].operations;assert.deepEqual(operations.filter(o=>+o.effectId===1872).map(o=>[o.index,o.phase,o.sourceArgs]),[[1,'afterHit',[70,1,10]]]);return s;
}
const attacks=(s,r,side=1)=>(s.damageEvents??[]).filter(e=>e.round===r&&e.sourceSide===side&&e.type==='attack');
test('1872原天弓整招按初态0一二箭精确70八十九十门槛，仅严格低于者失效且不延续无击败回合',()=>{
 for(const snapshot of variants)for(const [arrows,enemy,move,power,blocked]of[[0,2989,10330,60,true],[0,2990,10629,70,false],[1,2988,10056,75,true],[1,2989,19069,80,false],[2,2989,19069,80,true],[2,2989,10183,90,false]]){
  const s=make(snapshot,{arrows,enemy,move}),out=E.resolveTurn(s,[key,'wiki:'+move]);assert.equal(out.turns.at(-1).first,0);assert.equal(out.moveDefinitions['wiki:'+move].power,power);assert.equal(out.fighters[1].soulState.hunterAttackBlockPower,70+10*arrows);assert.equal(out.fighters[1].soulState.hunterAttackBlockRound,1);assert.equal(attacks(out,1).length===0,blocked);assert.ok(attacks(out,1,0).length>0);assert.equal(out.fighters[0].pp[key],s.fighters[0].pp[key]-1);
  const next=E.resolveTurn(out,[potion,'wiki:'+move]);assert.ok(attacks(next,2).length>0,'no KO means no next-round block');
 }
});
test('1872原整招同先制真实后手不封招，控制整招无效药剂零PP均不建立门槛',()=>{
 for(const snapshot of variants){const late=E.resolveTurn(make(snapshot,{enemy:2988,move:19115,late:true,arrows:2}),[key,'wiki:19115']);assert.equal(late.turns.at(-1).first,1);assert.ok(attacks(late,1).length>0);assert.equal(late.fighters[1].soulState.hunterAttackBlockRound,undefined);
  for(const mode of['control','invalid','potion','zero']){const s=make(snapshot,{mode,arrows:2});if(mode==='zero'){const before=structuredClone(s);assert.throws(()=>E.resolveTurn(s,[key,'wiki:10330']),/请选择|有 PP/);assert.deepEqual(s,before);continue;}const out=E.resolveTurn(s,[mode==='potion'?potion:key,'wiki:10330']);assert.equal(out.fighters[1].soulState.hunterAttackBlockRound,undefined);assert.ok(attacks(out,1).length>0);}
 }
});
test('1872原天弓真实KO及指定补位保精确箭门槛，只封下回合并自然恢复',()=>{
 for(const snapshot of variants)for(const arrows of[0,1,2]){
  const hunter=member(snapshot,[36200],9999),victim=member(L.species(3056),[19369],1),heir=member(L.species(2989),[10330],1);let g=T.create([[hunter],[victim,heir]],[0,0],{seed:14,criticals:false});
  g.battle.fighters[0].stages.acc=6;g.battle.fighters[0].soulState.hunterArrows=arrows;g.battle.fighters[1].hp=1;g.slots[1][1].fighter.stages.acc=6;
  g=T.turn(g,[key,'wiki:19369']);assert.equal(g.phase,'replace');assert.ok(attacks(g.battle,1,0).some(e=>e.hpLoss===1));g=T.replace(g,[null,1]);assert.equal(g.active[1],1);assert.equal(g.battle.fighters[1].soulState.hunterAttackBlockPower,70+arrows*10);assert.equal(g.battle.fighters[1].soulState.hunterAttackBlockRound,2);
  g=T.turn(g,[potion,'wiki:10330']);assert.equal(attacks(g.battle,2).length,0);g=T.turn(g,[potion,'wiki:10330']);assert.ok(attacks(g.battle,3).length>0);
 }
});
