'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,make,turn,red}=require('./helpers/3512-native.cjs');
const pp='potion:pp';
test('3512华光洗礼1219与995各自成功：原生超级改良回合与双防被消除，下回合伤害转回复且消强吸三千',()=>{
 let s=make(31502,{enemyMoves:[24624,10086],aHp:1000});s=turn(s,pp,24624);assert.ok(Object.keys(s.fighters[1].effects).length>0);assert.equal(s.fighters[1].stages.def,2);assert.equal(s.fighters[1].stages.spd,2);s=turn(s,31502);assert.deepEqual(s.fighters[1].effects,{});assert.equal(s.fighters[1].stages.def,0);assert.equal(s.fighters[1].stages.spd,0);assert.equal(s.fighters[0].hp,4000);assert.ok(s.damageEvents.some(e=>e.type==='percent'&&e.settledDamage===3000));assert.equal(s.fighters[0].soulState.emperorConvertRound,3);s=turn(s,pp,10086);assert.ok(s.fighters[0].hp>4000);assert.equal(red(s,1),0);const hp=s.fighters[0].hp;s=turn(s,pp,10086);assert.ok(s.fighters[0].hp<hp);assert.ok(red(s,1)>0);
});
test('3512华光洗礼消回合失败不获得转回复，只有原生速度强化时995独立成功，空目标两种补偿均不触发',()=>{
 for(const boost of [true,false]){let s=make(31502,{enemyMoves:[20889,10086],aHp:1000});s=turn(s,pp,boost?20889:pp);s=turn(s,31502);assert.equal(s.fighters[0].soulState.emperorConvertRound,undefined);assert.equal(s.fighters[0].hp,boost?4000:1000);assert.equal(s.damageEvents.filter(e=>e.type==='percent').length,boost?1:0);const hp=s.fighters[0].hp;s=turn(s,pp,10086);assert.ok(red(s,1)>0);assert.ok(s.fighters[0].hp<hp);}
});
test('3512华光995消除真实星皇命中强化后百分比伤害免疫归零，理论三千回复仍保留，禁疗只阻挡回复',()=>{
 for(const blocked of [false,true]){let s=make(31502,{enemyId:3291,enemyMoves:[20530],aHp:1000,aEffects:blocked?{'无法通过自身技能恢复体力':{start:1,end:4}}:{}});s=turn(s,pp,20530);assert.equal(s.fighters[1].stages.acc,1);s=turn(s,31502);assert.equal(s.fighters[1].stages.acc,0);assert.equal(s.fighters[0].hp,blocked?1000:4000);assert.equal(s.damageEvents.filter(e=>e.type==='percent'&&e.settledDamage>0).length,0);assert.equal(E.SOULS.trait(s.fighters[1],'pinkImmune'),true);}
});
test('3512漫天光羽697突破真实低体战龙250封顶，普通气功弹仍封250且不修改战龙固有上限',()=>{
 for(const id of [31504,10467]){const o=turn(make(id,{enemyId:3046,bHp:4000,aStats:{spa:3600}}),id);assert.equal(E.SOULS.trait(o.fighters[1],'damageCap'),250);assert.equal(o.fighters[1].soulState.warLow,true);assert.ok(red(o)>0);if(id===31504)assert.ok(red(o)>250);else assert.equal(red(o),250);assert.equal(o.fighters[1].hp,4000-red(o));}
});
test('3512漫天光羽697不穿透面板暴击抗性，纯净之心实际必暴后两种原生特攻均为零伤',()=>{
 for(const id of [31504,10467]){let s=make(id,{extraMoves:[20618],enemyId:3291,aStats:{spa:3600},bGear:{resistance:{critical:100}}});s=turn(s,20618);s=turn(s,id);assert.equal(red(s),0);assert.equal(s.fighters[1].hp,9000);assert.equal(s.fighters[1].build.resistance.critical,100);assert.ok(s.fighters[0].effects['必定暴击']);}
});
