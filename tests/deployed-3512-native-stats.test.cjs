'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,keys,make,turn,red}=require('./helpers/3512-native.cjs');
const boost=[[20168,{acc:1}],[21528,{def:1,spd:1}],[25860,{spa:2,spe:2}],[25862,{atk:1,def:1,spa:1,spd:1,spe:1,acc:1}]];
test('3512原生4的五个实例与946逐项强化正确能力：念动力命中1、防护双防1、万物特攻速度2、寰宇六项1',()=>{
 for(const[id,expected]of boost){const s=make(id),o=turn(s,id);for(const k of keys)assert.equal(o.fighters[0].stages[k],expected[k]??0,id+'/'+k);assert.equal(o.fighters[0].stats.maxHp,9000);assert.equal(o.fighters[0].pp['wiki:'+id],source.moves.find(m=>m.id===id).pp-1);}
});
test('3512原生4及946禁强化时对应能力均不变，纯净轻触两个5实例对真实星皇免弱失败',()=>{
 for(const[id]of boost){const o=turn(make(id,{aEffects:{禁强化:{start:1,end:2}}}),id);assert.deepEqual(o.fighters[0].stages,Object.fromEntries(keys.map(k=>[k,0])));}const o=turn(make(31503,{enemyId:3291}),31503);assert.equal(o.fighters[1].stages.def,0);assert.equal(o.fighters[1].stages.spd,0);assert.equal(E.SOULS.trait(o.fighters[1],'weaknessImmune'),true);
});
test('3512原生强化逐项封六级、弱化逐项封负六级，寰宇严格低体翻倍而体力相等仅一级',()=>{
 for(const[id,expected]of boost){const stages=Object.fromEntries(Object.keys(expected).map(k=>[k,5])),o=turn(make(id,{aStages:stages}),id);for(const k of Object.keys(expected))assert.equal(o.fighters[0].stages[k],6);}const o=turn(make(31503,{bStages:{def:-5,spd:-5}}),31503);assert.equal(o.fighters[1].stages.def,-6);assert.equal(o.fighters[1].stages.spd,-6);for(const hp of [8999,9000]){const t=turn(make(25862,{aHp:hp}),25862);for(const k of keys)assert.equal(t.fighters[0].stages[k],hp===8999?2:1);}
});
test('3512纯净轻触两个不同索引5实例实际双防各降二且不串其他能力，原4实例参数与重复ID顺序保持',()=>{
 const s=make(31503),o=turn(s,31503);assert.equal(o.fighters[1].stages.def,-2);assert.equal(o.fighters[1].stages.spd,-2);for(const k of ['atk','spa','spe','acc'])assert.equal(o.fighters[1].stages[k],0);assert.deepEqual(source.moves.find(m=>m.id===21528).effectInstances.map(e=>e.args),[[1,100,1],[3,100,1]]);assert.deepEqual(source.moves.find(m=>m.id===25860).effectInstances.map(e=>e.args),[[2,100,2],[4,100,2]]);assert.ok(red(o)>0);
});
test('3512逆袭40真实先手按双倍威力入公式，后手用原65威力；两种均保持原参数且不把伤害翻倍当威力翻倍',()=>{
 for(const first of [true,false]){const s=make(11393,{enemyId:2988,enemyMoves:[10018,19115],aStats:{atk:1200},bStats:{def:901}}),o=turn(s,11393,first?10018:19115),power=first?130:65,base=Math.floor(Math.floor(42*power*1200/901)/50)+2,factor=E.sameTypeBonus(s.moveDefinitions['wiki:11393'].type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(s.moveDefinitions['wiki:11393'].type,s.fighters[1].type,s.typeChart);assert.equal(o.turns[0].first,first?0:1);const actual=red(o);assert.ok(actual>=Math.floor(base*factor*.85)&&actual<=Math.floor(base*factor),JSON.stringify({first,actual,base}));assert.equal(s.moveDefinitions['wiki:11393'].power,65);assert.deepEqual(source.moves.find(m=>m.id===11393).effectInstances[0].args,[]);}
});
