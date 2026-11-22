'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{make,turn}=require('./helpers/3082-native.cjs'),pp='potion:pp';
test('3082摄魂469四轮对原生属性出招75疲惫，封属性仍是使用而可触发，初始种子成败免异及第五轮到期',()=>{
 const seen=new Set();for(let seed=1;seed<=32;seed++){const s=turn(make(24837,{seed,enemyMoves:[20889],bStages:{acc:6}}),24837,20889);seen.add(!!s.fighters[1].ailments['疲惫']);assert.equal(s.fighters[1].pp['wiki:20889'],s.moveDefinitions['wiki:20889'].pp-1);assert.equal(s.fighters[0].effects['对手属性后指定异常'].end,4);}assert.equal(seen.size,2);
 const immune=turn(make(24837,{enemyMoves:[20889],bEffects:{免异常:{start:1,end:5}}}),24837,20889);assert.equal(immune.fighters[1].ailments['疲惫'],undefined);let s=turn(make(24837,{enemyMoves:[20889]}),24837);for(let r=2;r<=4;r++)s=turn(s,pp);assert.equal(s.fighters[0].effects['对手属性后指定异常'],undefined);s=turn(s,pp,20889);assert.equal(s.fighters[1].ailments['疲惫'],undefined);
});
