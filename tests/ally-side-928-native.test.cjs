'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
const traces=[];
function member(id,wanted=[],spe=1000){const snapshot=store.species(id);return{snapshot,moves:loadout(snapshot,wanted),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe},resistance:{critical:0,fixed:0,percent:0,major:'',minor:''}}};}
function frame(g){const a=g.battle.fighters[0];return{round:g.battle.round,active:g.active.slice(),number:a.number,poison:a.ailments['中毒']??null,immune:a.counts.immune??0,hp:a.hp};}
function shared928Scenario(moveId){
 const source=store.species(3414),move=source.moves.find(m=>m.id===moveId),instance=move.effectInstances.find(x=>x.id===928);assert.deepEqual(instance.args,[2]);assert.match(instance.description,/己方免疫下2次/);
 let g=T.create([[member(3414,[moveId]),member(3102),member(3056)],[member(4925,[20573,20020],100)]],[0,0],{seed:14,criticals:false});const originalPp=g.battle.fighters[0].pp['wiki:'+moveId],steps=[];
 g=T.turn(g,['potion:pp','wiki:20573']);const beforeTimers=Object.keys(g.battle.fighters[1].effects);assert.ok(beforeTimers.length>0,'real20573 must create a timed effect');
 g=T.turn(g,['wiki:'+moveId,'potion:pp']);assert.equal(g.battle.fighters[0].pp['wiki:'+moveId],originalPp-1);assert.equal(g.battle.fighters[0].counts.immune,2,'original clear-success must grant2');assert.ok(beforeTimers.some(key=>!g.battle.fighters[1].effects[key]),'real928 clears the current opponent timed effect');
 steps.push(frame(g));
 g=T.turn(g,[{switchTo:1},'wiki:20020']);steps.push(frame(g));assert.equal(g.active[0],1);
 g=T.turn(g,[{switchTo:2},'wiki:20020']);steps.push(frame(g));assert.equal(g.active[0],2);
 g=T.turn(g,[{switchTo:0},'wiki:20020']);steps.push(frame(g));assert.equal(g.active[0],0);
 traces.push({moveId,skillHash:move.hash,effectId:928,args:instance.args,sourceRevision:source.source.revision,initialPp:originalPp,steps,noMidBattleWrites:true,noOperationReplacement:true,noRngReplacement:true});
 return steps;
}
test('己方侧928原生30470真实断回合后跨两名接替者仅共享两次免异，源回场不复制',()=>{const steps=shared928Scenario(30470);assert.deepEqual(steps.slice(1).map(x=>x.poison!==null),[false,false,true],'one ally-side pool must protect exactly first2 actual poison attempts across members');});
test('己方侧928原生30992真实断回合后跨两名接替者仅共享两次免异，源回场不复制',()=>{const steps=shared928Scenario(30992);assert.deepEqual(steps.slice(1).map(x=>x.poison!==null),[false,false,true],'one ally-side pool must protect exactly first2 actual poison attempts across members');});

test.after(()=>console.log('ALLY_SIDE_928_NATIVE_TRACES '+JSON.stringify(traces)));

test('己方侧928原生死亡补位继承剩余两次，消耗跨成员且死亡来源不复制',()=>{
 const fragile=member(3414,[30470]);fragile.build.overrides.maxHp=1;
 let g=T.create([[fragile,member(3102),member(3056)],[member(4925,[20573,20020,10001],100)]],[0,0],{seed:14,criticals:false});
 g=T.turn(g,['potion:pp','wiki:20573']);g=T.turn(g,['wiki:30470','wiki:10001']);
 assert.equal(g.battle.fighters[0].hp,0);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].counts.immune,2);
 g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].counts.immune,2);
 g=T.turn(g,['potion:pp','wiki:20020']);assert.equal(g.battle.fighters[0].counts.immune,1);assert.equal(g.battle.fighters[0].ailments['中毒'],undefined);
 g=T.turn(g,[{switchTo:2},'wiki:20020']);assert.equal(g.battle.fighters[0].counts.immune,0);assert.equal(g.battle.fighters[0].ailments['中毒'],undefined);
 g=T.turn(g,['potion:pp','wiki:20020']);assert.ok(g.battle.fighters[0].ailments['中毒']);
});
test('己方侧928原生同源重授刷新2次，清除失败不刷新，真实中毒每次仅扣1次',()=>{
 let g=T.create([[member(3414,[30470]),member(3102)],[member(4925,[20573,20020],100)]],[0,0],{seed:14,criticals:false});
 g=T.turn(g,['potion:pp','wiki:20573']);g=T.turn(g,['wiki:30470','potion:pp']);
 g=T.turn(g,['potion:pp','wiki:20020']);assert.equal(g.battle.fighters[0].counts.immune,1);
 g=T.turn(g,['potion:pp','wiki:20573']);g=T.turn(g,['wiki:30470','wiki:20020']);assert.equal(g.battle.fighters[0].counts.immune,1,'same source refreshes2 then actual poison consumes1');
 g=T.turn(g,['wiki:30470','wiki:20020']);assert.equal(g.battle.fighters[0].counts.immune,0,'no timed effect to clear means no new charges');assert.equal(g.battle.fighters[0].ailments['中毒'],undefined);
 g=T.turn(g,[{switchTo:1},'wiki:20020']);assert.ok(g.battle.fighters[0].ailments['中毒']);
});
test('己方侧928原生换人和药剂不消费，敌方换人不拿走己方来源，源回场剩余不增加',()=>{
 let g=T.create([[member(3414,[30470]),member(3102)],[member(4925,[20573,20020],100),member(3056,[],100)]],[0,0],{seed:14,criticals:false});
 g=T.turn(g,['potion:pp','wiki:20573']);g=T.turn(g,['wiki:30470','potion:pp']);
 g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.equal(g.battle.fighters[0].counts.immune,2);assert.equal(g.battle.fighters[1].counts.immune??0,0);
 var owned=g.battle.fighters[0].soulState.ailmentImmuneSources.filter(x=>x.key.startsWith('928:'));assert.equal(owned.length,1);assert.equal(owned[0].ownership.side,0);assert.equal(owned[0].ownership.moveId,30470);assert.equal(owned[0].ownership.sourcePosition,0);
 g=T.turn(g,[{switchTo:0},{switchTo:0}]);assert.equal(g.battle.fighters[0].counts.immune,2);assert.equal(g.battle.fighters[1].counts.immune??0,0);
 g=T.turn(g,['potion:pp','wiki:20020']);assert.equal(g.battle.fighters[0].counts.immune,1);assert.equal(g.battle.fighters[0].ailments['中毒'],undefined);
});

test('己方侧928原生3564项羽31774真实断回合才授1次，失败不授且继任免毒一次后耗尽',()=>{for(const success of[false,true]){let g=T.create([[member(3564,[31774]),member(3102)],[member(4925,[20573,20020],100)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['potion:pp',success?'wiki:20573':'potion:pp']);const before=g.battle.fighters[0].pp['wiki:31774'];g=T.turn(g,['wiki:31774','potion:pp']);assert.equal(g.battle.fighters[0].pp['wiki:31774'],before-1);assert.ok((g.battle.damageEvents??[]).some(e=>e.round===2&&e.sourceSide===0&&e.type==='attack'&&e.settledDamage>0));assert.equal(g.battle.fighters[0].counts.immune??0,success?1:0);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[0].counts.immune??0,success?1:0);const poisonPp=g.battle.fighters[1].pp['wiki:20020'];g=T.turn(g,['potion:pp','wiki:20020']);assert.equal(g.battle.fighters[1].pp['wiki:20020'],poisonPp-1);assert.equal(g.battle.fighters[0].counts.immune??0,0);assert.equal(g.battle.fighters[0].ailments['中毒']===undefined,success);g=T.turn(g,['potion:pp','wiki:20020']);assert.ok(g.battle.fighters[0].ailments['中毒']);}});
