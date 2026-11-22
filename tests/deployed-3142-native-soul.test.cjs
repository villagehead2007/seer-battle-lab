'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3142-native.cjs'),pp='potion:pp';
test('3142两魂回初与回末吸正级保留敌负级，禁强化清敌正级但自身不获，1683保护阻吸',()=>{
 for(const soul of[484,527]){let s=H.turn(H.make(20004,{soul,enemyMoves:[20889],bStages:{atk:2,spa:1,def:-1}}),pp,20889);assert.equal(s.fighters[0].stages.atk,2);assert.equal(s.fighters[0].stages.spa,1);assert.equal(s.fighters[0].stages.spe,1);assert.equal(s.fighters[1].stages.def,-1);for(const k of['atk','spa','spe'])assert.equal(s.fighters[1].stages[k],0);s=H.turn(H.make(20004,{soul,enemyMoves:[20889],bStages:{atk:2},aEffects:{禁强化:{start:1,end:3}}}),pp,20889);assert.equal(s.fighters[0].stages.atk,0);assert.equal(s.fighters[0].stages.spe,0);assert.equal(s.fighters[1].stages.atk,0);assert.equal(s.fighters[1].stages.spe,0);
 s=H.make(20004,{soul,enemyId:3549,enemyMoves:[29392]});s=H.turn(s,pp,29392);assert.equal(s.fighters[1].stages.atk,1);s=H.turn(s,pp);assert.equal(s.fighters[1].stages.atk,1);s=H.turn(s,pp);assert.equal(s.fighters[1].stages.atk,0);assert.equal(s.fighters[0].stages.atk,2);}
});
test('3142两魂把原生21042五轮免异压至当前一轮，压缩不是消除，次轮雷祭才可麻痹',()=>{
 for(const soul of[484,527]){let s=H.make(20085,{soul,enemyId:3205,enemyMoves:[21042],aStages:{acc:6}});s=H.turn(s,pp,21042);assert.equal(s.fighters[1].effects['免异常'].end,5);s=H.turn(s,20085);assert.equal(s.fighters[1].ailments['麻痹'],undefined);assert.ok(s.turns.at(-1).events.some(e=>e.text.includes('压缩至本回合结束')));s=H.turn(s,20085);assert.ok(s.fighters[1].ailments['麻痹']);}
});
test('3142原强化严格回初高体才末攻二和强化速命一，低体免断回合保护真实五轮免异，高体可被清',()=>{
 for(const soul of[484,527])for(const hp of[6999,7000,7001]){let s=H.turn(H.make(20004,{soul,aHp:hp,bHp:7000}),pp);assert.equal(s.fighters[0].stages.atk,hp>7000?2:0);assert.equal(s.fighters[0].stages.spe,hp>7000&&soul===527?1:0);assert.equal(s.fighters[0].stages.acc,hp>7000&&soul===527?1:0);}
 for(const soul of[484,527])for(const low of[false,true]){let s=H.make(23245,{soul,aHp:low?4500:9000,bHp:low?9000:4500,enemyId:3102,enemyMoves:[19560]});s=H.turn(s,23245);assert.ok(s.fighters[0].effects['免异常']);s=H.turn(s,pp,19560);assert.equal(!!s.fighters[0].effects['免异常'],low);}
});
