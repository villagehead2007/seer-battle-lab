'use strict';const test=require('node:test'),{assert,make,turn,pp}=require('./helpers/round142-confirmed-souls-native.cjs');
test('758原特殊命中封属在施术者真实下场后仍作用于原目标且次回到期',()=>{
 const T=require('../dist/team-engine.js'),L=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
 function member(id,ids=[]){const snapshot=L.species(id);return{snapshot,moves:loadout(snapshot,ids),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:id===3443?1000:500}}};}
 let blocked=0,success=0;
 for(let i=1;i<=24;i++){let g=T.create([[member(3443,[11027]),member(3056)],[member(2989,[20889])]],[0,0],{seed:Math.imul(i,2654435761)>>>0,criticals:false});g.battle.fighters[1].effects['免异常']={start:1,end:9};g=T.turn(g,['wiki:11027',pp]);assert.equal(g.battle.fighters[1].effects['克罗诺斯次回属性50%失效'].start,2);g=T.turn(g,[{switchTo:1},'wiki:20889']);assert.equal(g.active[0],1);const stage=g.battle.fighters[1].stages.spe;if(stage===0)blocked++;else{assert.equal(stage,1);success++;}g=T.turn(g,[pp,'wiki:20889']);assert.equal(g.battle.fighters[1].stages.spe,stage+1);}
 assert.ok(blocked>0&&success>0);
});
test('758首登首回实际害怕概率40，后续每轮加十至100且成功害怕无失败回血固伤',()=>{
 let hit=0,fail=0;for(let i=1;i<=24;i++){let s=make(3443,{seed:Math.imul(i,2654435761)>>>0}),x=turn(s,10008);const rolls=x.rolls.filter(r=>r.event==='afterAttack');assert.equal(rolls.length,1);assert.equal(rolls[0].chance,40);const afraid=x.out.fighters[1].ailments['害怕']>=1;if(afraid){hit++;assert.equal(x.heals.filter(h=>h.label==='克罗诺斯魂印回复').length,0);}else{fail++;assert.equal(x.heals.find(h=>h.label==='克罗诺斯魂印回复').actual,3000);}}assert.ok(hit>0&&fail>0);let x=turn(make(3443),pp);for(let round=2;round<=8;round++){x=turn(x.out,pp);assert.ok(Math.abs(x.out.fighters[0].soulState.kronFearChance-Math.min(1,.4+.1*(round-1)))<1e-10);}
});
test('758真实物攻MISS及整招无效均不判害怕且不回血附固，命中零伤仍判定并按实际回复补偿',()=>{
 for(const mode of ['miss','invalid','zero']){const o={bEffects:{免异常:{start:1,end:9}}};if(mode==='miss')o.aEffects={'攻击必失':{start:1,end:1}};if(mode==='invalid')o.aEffects={skillBlock:{start:1,end:1}};if(mode==='zero')o.bEffects['攻击伤害免疫']={start:1,end:1};const x=turn(make(3443,o),10008),active=mode==='zero';assert.equal(x.rolls.filter(r=>r.event==='afterAttack').length,active?1:0);assert.equal(x.heals.filter(h=>h.label==='克罗诺斯魂印回复').reduce((n,h)=>n+h.actual,0),active?3000:0,mode);assert.equal(x.hurts.filter(h=>h.label==='克罗诺斯魂印等量追加').reduce((n,h)=>n+h.requested,0),active?3000:0,mode);assert.equal(x.out.fighters[1].ailments['害怕'],undefined);}
});
test('758原幻术在命中负六仍特殊必中且仅下回合50封属，真实穿梭有成功失败并第三回到期',()=>{
 let blocked=0,success=0;for(let i=1;i<=24;i++){const s=make(3443,{seed:Math.imul(i,2654435761)>>>0,aStages:{acc:-6},bEffects:{免异常:{start:1,end:9}}}),first=turn(s,11027);assert.ok(first.out.damageEvents.some(e=>e.round===1&&e.sourceSide===0&&e.type==='attack'));const effect=first.out.fighters[1].effects['克罗诺斯次回属性50%失效'];assert.equal(effect.start,2);assert.equal(effect.end,2);assert.equal(effect.chance,50);let x=turn(first.out,pp,20889),stage=x.out.fighters[1].stages.spe;if(stage===0)blocked++;else{success++;assert.equal(stage,1);}x=turn(x.out,pp,20889);assert.equal(x.out.fighters[1].stages.spe,stage+1);}assert.ok(blocked>0&&success>0);
});
test('758真实1985种蛊后攻击害怕被免疫，补偿固定附伤取实际治疗3000而非蛊后净增2960',()=>{
 const setup=turn(make(3443,{enemy:3516,enemyMoves:[],bStages:{atk:1},bEffects:{免异常:{start:1,end:9}}}));assert.ok(setup.out.fighters[0].soulState.soulGu?.length>0);const x=turn(setup.out,10008),heal=x.heals.find(h=>h.label==='克罗诺斯魂印回复');assert.equal(heal.actual,3000);assert.equal(heal.before+heal.actual-heal.after,40);assert.equal(x.hurts.find(h=>h.label==='克罗诺斯魂印等量追加').requested,3000);
});
