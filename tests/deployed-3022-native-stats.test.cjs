'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,make,turn}=require('./helpers/3022-native.cjs'),pp='potion:pp',keys=['atk','def','spa','spd','spe','acc'];
test('3022龙之意志六个4各加一，龙子885按用招当时严格高体翻倍，正六封顶与禁强化',()=>{
 for(const[id,aHp,bHp,n]of[[20269,5000,2000,1],[24717,5000,2000,2],[24717,3000,3000,1],[24717,1000,9000,1]]){let s=turn(make(id,{aHp,bHp}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],n,id+'/'+k);if(id===24717){assert.equal(s.fighters[0].counts.nextDefenseIgnore,.45);assert.equal(s.fighters[0].hp,aHp===1000?8500:Math.min(9000,aHp+4500));}s=turn(make(id,{aHp,bHp,aStages:Object.fromEntries(keys.map(k=>[k,5]))}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],6);s=turn(make(id,{aHp,bHp,aEffects:{禁强化:{start:1,end:2}}}),id);for(const k of keys)assert.equal(s.fighters[0].stages[k],0);}
});
test('3022咆哮乾坤两5只降防御命中一，负六封底和真实星皇免弱',()=>{
 for(const o of [{},{bStages:{def:-6,acc:-6}},{enemyId:3291}]){const s=turn(make(19228,o),19228);for(const k of keys)assert.equal(s.fighters[1].stages[k],o.enemyId?0:['def','acc'].includes(k)?o.bStages?-6:-1:0);}
});
test('3022龙磷光20%只加命中一自然种子成功失败，龙吟千古50%六项同次降一且真实免弱',()=>{
 let up=0,noUp=0,down=0,noDown=0;for(let seed=1;seed<=32;seed++){let s=turn(make(10615,{seed}),10615);for(const k of keys)if(k!=='acc')assert.equal(s.fighters[0].stages[k],0);assert.ok([0,1].includes(s.fighters[0].stages.acc));if(s.fighters[0].stages.acc)up++;else noUp++;s=turn(make(19249,{seed,aStages:{acc:6}}),19249);const n=s.fighters[1].stages.atk;assert.ok([0,-1].includes(n));for(const k of keys)assert.equal(s.fighters[1].stages[k],n);if(n)down++;else noDown++;}assert.ok(up>0&&noUp>0&&down>0&&noDown>0);for(const id of[10615,19249]){const s=turn(make(id,{enemyId:3291,aEffects:{禁强化:{start:1,end:2}}}),id);assert.equal(s.fighters[0].stages.acc,0);for(const k of keys)assert.equal(s.fighters[1].stages[k],0);}
});
test('3022王龙战八荒881用招前负级先制三，521只反转负级保留正级且当次红伤仍用原负攻',()=>{
 const before={atk:-2,def:1,spa:-1,spd:2,spe:-3,acc:1};let s=turn(make(19229,{aStages:before,aStats:{spe:1},bStats:{spe:9999},enemyMoves:[10086]}),19229,10086);assert.equal(s.turns[0].first,0);assert.equal(s.fighters[0].soulState.resolvedPriority.value,3);assert.deepEqual(s.fighters[0].stages,{atk:2,def:1,spa:1,spd:2,spe:3,acc:1});assert.equal(s.damageEvents.find(e=>e.sourceSide===0&&e.type==='attack').attackValue,600);s=turn(make(19229,{aStages:{atk:1,acc:6},aStats:{spe:1},bStats:{spe:9999},enemyMoves:[10086]}),19229,10086);assert.equal(s.turns[0].first,1);assert.equal(s.fighters[0].soulState.resolvedPriority.value,0);assert.equal(s.fighters[0].stages.atk,1);s=turn(make(19229,{aStages:{atk:-6,def:6,acc:6}}),19229);assert.equal(s.fighters[0].stages.atk,6);assert.equal(s.fighters[0].stages.def,6);
});
test('3022两魂回初严格高体才免原生睡眠，等体不免不回，低体回血资格整轮保持且下轮重新判断',()=>{
 for(const soul of[395,396])for(const[aHp,bHp,immune,heal]of[[8000,1000,true,false],[5000,5000,false,false],[1000,9000,false,true]]){let s=turn(make(10613,{soul,aHp,bHp,enemyId:3205,enemyMoves:[22053],bStages:{acc:6}}),pp,22053);assert.equal(s.fighters[0].soulState.hamoHigher,immune);assert.equal(!!s.fighters[0].ailments['睡眠'],!immune);assert.equal(s.fighters[0].hp,aHp+(heal?3000:0));}
 let s=turn(make(24717,{aHp:1000,bHp:2000}),24717);assert.equal(s.fighters[0].hp,8500);assert.equal(s.fighters[0].soulState.hamoLower,true);s=turn(s,pp);assert.equal(s.fighters[0].soulState.hamoLower,false);assert.equal(s.fighters[0].soulState.hamoHigher,true);assert.equal(s.fighters[0].hp,8500);
});
