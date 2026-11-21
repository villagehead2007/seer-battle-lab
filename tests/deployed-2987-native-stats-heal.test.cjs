'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/2987-native.cjs');
const keys=['atk','def','spa','spd','spe','acc'];
test('2987两版五个原生5实例按原索引降命中一或双防一二，星皇免弱逐项阻挡且负六封底',()=>{
 for(const soul of [372,574])for(const [id,expected]of [[20076,{acc:-1}],[20489,{def:-1,spd:-1}],[19012,{def:-2,spd:-2}]]){let s=turn(make(id,{soul}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],expected[k]??0);s=turn(make(id,{soul,enemyId:3291}),id);for(const k of keys)assert.equal(s.fighters[1].stages[k],0);s=turn(make(id,{soul,bStages:Object.fromEntries(Object.keys(expected).map(k=>[k,-6]))}),id);for(const k of Object.keys(expected))assert.equal(s.fighters[1].stages[k],-6);}
});
test('2987两版神速4与黎羽585按指定速度二及六项一强化，禁强化均阻挡且正六封顶不改HP上限',()=>{
 for(const soul of [372,574])for(const id of [20157,24640]){let s=turn(make(id,{soul}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],id===24640?1:k==='spe'?2:0);assert.equal(s.fighters[0].stats.maxHp,9000);s=turn(make(id,{soul,aEffects:{禁强化:{start:1,end:3}}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],0);s=turn(make(id,{soul,aStages:Object.fromEntries(keys.map(k=>[k,5]))}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],id===24640||k==='spe'?6:5);}
});
test('2987闪光波4真实百分之二十速度强化自然初始种子有成功失败，禁强化阻挡且等级六不再增加',()=>{
 for(const soul of [372,574]){let hit=0,miss=0;for(let seed=1;seed<=32;seed++){const s=turn(make(10531,{soul,seed}),10531),n=s.fighters[0].stages.spe;assert.ok(n===0||n===1);if(n)hit++;else miss++;const capped=turn(make(10531,{soul,seed,aStages:{spe:6}}),10531);assert.equal(capped.fighters[0].stages.spe,6);const blocked=turn(make(10531,{soul,seed,aEffects:{禁强化:{start:1,end:2}}}),10531);assert.equal(blocked.fighters[0].stages.spe,0);}assert.ok(hit>0&&miss>0);}
});
test('2987反击之刃3真实解除自身所有负级但保留正级与命中零级，受控制时不解除',()=>{
 for(const soul of [372,574]){const initial={atk:-6,def:-1,spa:2,spd:-2,spe:3,acc:0};let s=turn(make(19014,{soul,aStages:initial}),19014);assert.deepEqual(s.fighters[0].stages,{atk:0,def:0,spa:2,spd:0,spe:3,acc:0});s=make(19014,{soul,aStages:initial});s.fighters[0].ailments['疲惫']=2;s=turn(s,19014);assert.deepEqual(s.fighters[0].stages,initial);}
});
test('2987黎羽43真实回满九千上限且技能禁疗只挡回血不挡强化和两层神耀，满体不溢出',()=>{
 for(const soul of [372,574])for(const blocked of [false,true])for(const hp of [1000,9000]){const s=turn(make(24640,{soul,aHp:hp,aEffects:blocked?{'无法通过自身技能恢复体力':{start:1,end:3}}:{}}),24640);assert.equal(s.fighters[0].hp,blocked?hp:9000);assert.equal(s.fighters[0].stages.atk,1);assert.equal(s.fighters[0].soulState.energy,2);}
});
test('2987剑破450命中随机回复150至250经自然种子取多值，MISS与技能禁疗不回复、近满体不溢出',()=>{
 for(const soul of [372,574]){const values=new Set();for(let seed=1;seed<=16;seed++){const s=turn(make(19101,{soul,seed,aHp:1000}),19101),hit=(s.damageEvents??[]).some(e=>e.type==='attack'&&e.sourceSide===0);if(hit){assert.ok(s.fighters[0].hp>=1150&&s.fighters[0].hp<=1250);values.add(s.fighters[0].hp);}else assert.equal(s.fighters[0].hp,1000);}assert.ok(values.size>1);for(const hp of [8999,9000])assert.equal(turn(make(19101,{soul,aHp:hp}),19101).fighters[0].hp,9000);const blocked=turn(make(19101,{soul,aHp:1000,aEffects:{'无法通过自身技能恢复体力':{start:1,end:2}}}),19101);assert.equal(blocked.fighters[0].hp,1000);assert.ok(blocked.damageEvents.some(e=>e.type==='attack'&&e.settledDamage>0));}
});
test('2987挥舞29两版额外固定二十与常规红伤独立记录，真实星皇免粉仅阻挡固定不阻挡普通攻击',()=>{
 for(const soul of [372,574])for(const enemyId of [2989,3291]){const reply=enemyId===3291?20530:20889,s=turn(make(10317,{soul,enemyId,enemyMoves:[reply],bStats:{spe:9999}}),10317,reply),fixed=s.damageEvents.filter(e=>e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),red=s.damageEvents.filter(e=>e.type==='attack').reduce((n,e)=>n+e.settledDamage,0);assert.equal(fixed,enemyId===3291?0:20);assert.ok(red>0);assert.equal(s.fighters[1].hp,9000-red-fixed);}
});
