'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3014-native.cjs'),keys=['atk','def','spa','spd','spe','acc'];
test('3014七个4与六项585按原索引强化，正六封顶禁强化阻挡，攻击末523不提前提高本次特攻',()=>{
 for(const[id,expected]of[[20230,{acc:1}],[21021,{def:2,spd:2}],[22978,{def:1,spa:1,spd:1,spe:1}],[24691,{atk:1,def:1,spa:1,spd:1,spe:1,acc:1}],[15426,{spa:1,spe:1}]]){
  let s=turn(make(id),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],expected[k]??0,id+'/'+k);if(id===15426)assert.equal(s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).attackValue,3600);
  s=turn(make(id,{aStages:Object.fromEntries(keys.map(k=>[k,5]))}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],expected[k]?6:5);
  s=turn(make(id,{aEffects:{禁强化:{start:1,end:2}}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],0);
 }
});
test('3014漩涡15概率仅降特防一，自然种子有成功失败，负六封底星皇免弱且不伤其他能力',()=>{
 let yes=0,no=0;for(let seed=1;seed<=48;seed++){const s=turn(make(11047,{seed,aStages:{acc:6}}),11047);if(s.fighters[1].stages.spd===-1)yes++;else{assert.equal(s.fighters[1].stages.spd,0);no++;}for(const k of keys.filter(k=>k!=='spd'))assert.equal(s.fighters[1].stages[k],0);}
 assert.ok(yes>0&&no>0);for(let seed=1;seed<=12;seed++){let s=turn(make(11047,{seed,aStages:{acc:6},bStages:{spd:-6}}),11047);assert.equal(s.fighters[1].stages.spd,-6);s=turn(make(11047,{seed,aStages:{acc:6},enemyId:3291}),11047);assert.equal(s.fighters[1].stages.spd,0);}
});
test('3014梦幻与凌空两3仅清自身负级，梦幻33仅清敌正级，保护不妨碍自身清负且本次红伤仍用旧特攻',()=>{
 for(const id of [15425,19196]){let s=turn(make(id,{aStages:{atk:2,def:-2,spa:-1,spd:1,spe:-3,acc:id===15425?-6:0},bStages:{atk:2,def:-1,spa:1}}),id);assert.deepEqual(s.fighters[0].stages,{atk:2,def:0,spa:0,spd:1,spe:0,acc:0});assert.equal(s.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0).attackValue,2400);assert.equal(s.fighters[1].stages.def,-1);assert.equal(s.fighters[1].stages.atk,0);assert.equal(s.fighters[1].stages.spa,0);}
 const missed=turn(make(19196,{aStages:{acc:-6,spa:-1}}),19196);assert.equal(missed.fighters[0].stages.spa,-1);assert.ok(!missed.damageEvents.some(e=>e.type==='attack'&&e.sourceSide===0));
 let s=turn(make(15425,{aStages:{acc:-6},bStages:{spe:2,def:-1},bEffects:{强化保护:{start:1,end:3}}}),15425);assert.equal(s.fighters[0].stages.acc,0);assert.equal(s.fighters[1].stages.spe,2);assert.equal(s.fighters[1].stages.def,-1);
 s=turn(make(15425,{aStages:{atk:6},bStages:{def:-6}}),15425);assert.equal(s.fighters[0].stages.atk,6);assert.equal(s.fighters[1].stages.def,-6);
});
