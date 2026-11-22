'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3020-native.cjs'),keys=['atk','def','spa','spd','spe','acc'];
test('3020力量4仅攻一统领585六项一，正六封顶禁强化阻挡而独立统领回复照常',()=>{
 for(const id of[20156,24702]){let s=turn(make(id),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],id===24702||k==='atk'?1:0);s=turn(make(id,{aStages:Object.fromEntries(keys.map(k=>[k,6]))}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],6);s=turn(make(id,{aEffects:{禁强化:{start:1,end:2}}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],0);}
});
test('3020双刃5自然15概率只降特防一，负六封底星皇免弱，灭天749全项一不串威力先制',()=>{
 let yes=0,no=0;for(let seed=1;seed<=48;seed++){const s=turn(make(10366,{seed}),10366);if(s.fighters[1].stages.spd===-1)yes++;else{assert.equal(s.fighters[1].stages.spd,0);no++;}for(const k of keys.filter(k=>k!=='spd'))assert.equal(s.fighters[1].stages[k],0);}assert.ok(yes>0&&no>0);
 for(const id of[10366,19217]){let s=turn(make(id,{aStages:{acc:6},bStages:Object.fromEntries(keys.map(k=>[k,-6]))}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],-6);s=turn(make(id,{aStages:{acc:6},enemyId:3291}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],0);}const s=turn(make(19217,{aStages:{acc:6}}),19217);for(const k of keys)assert.equal(s.fighters[1].stages[k],-1);
});
test('3020百鬼521命中后仅反转自身负级保留正级，本次特攻仍2400，自然MISS不反转负级',()=>{
 let s=turn(make(19218,{aStages:{atk:2,def:-2,spa:-1,spd:1,spe:-3,acc:6}}),19218);assert.deepEqual(s.fighters[0].stages,{atk:2,def:2,spa:1,spd:1,spe:3,acc:6});assert.equal(s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).attackValue,2400);s=turn(make(19218,{aStages:{spa:-1,acc:-6}}),19218);assert.equal(s.fighters[0].stages.spa,-1);assert.equal(s.fighters[0].stages.acc,-6);s=turn(make(19218,{aStages:{def:-6,acc:6}}),19218);assert.equal(s.fighters[0].stages.def,6);
});
test('3020鬼爪143只把敌正级反为同幅负级，原负级不变，空正级不改负六，180先清回合强化保护',()=>{
 let s=turn(make(19215,{bStages:{atk:2,def:-2,spa:1,spd:0,spe:6}}),19215);assert.deepEqual(s.fighters[1].stages,{atk:-2,def:-2,spa:-1,spd:0,spe:-6,acc:0});s=turn(make(19215,{bStages:{def:-6}}),19215);assert.equal(s.fighters[1].stages.def,-6);
 s=turn(make(19215,{bStages:{atk:2},bEffects:{强化保护:{start:1,end:3}}}),19215);assert.equal(s.fighters[1].stages.atk,-2);assert.equal(s.fighters[1].effects['强化保护'],undefined);
});
